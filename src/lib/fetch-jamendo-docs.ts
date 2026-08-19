import { FirecrawlClient, SdkError } from '@mendable/firecrawl-js';
import Bottleneck from 'bottleneck';
import type { FetchJamendoDocsResult, JamendoDocManifest } from '../schemas/index.ts';
import { hashContent, readManifest, writeManifest } from './jamendo-doc-manifest.ts';
import { JAMENDO_DOC_SOURCE } from './jamendo-doc-source.ts';
import { logger } from './logger.ts';

const DEFAULT_CONCURRENCY = 2;
// Firecrawl's free plan allows 10 requests/min; default sits under that so a
// fresh clone doesn't 429 immediately. Override via FIRECRAWL_RPM on a paid plan.
const DEFAULT_RPM = 8;
const MAX_RETRIES = 5;
const RETRY_AFTER_FALLBACK_MS = 15_000;
// Plain HTTP GETs against Jamendo's own site, used only for change detection.
// Not rate-limited by Firecrawl, so this can run much faster than the scrape step.
const CHANGE_CHECK_CONCURRENCY = 8;

export const retryAfterMs = (err: unknown): number | undefined => {
    if (!(err instanceof SdkError) || err.status !== 429) return undefined;
    const match = err.message.match(/retry after (\d+)s/i);
    return match?.[1] ? Number(match[1]) * 1000 : RETRY_AFTER_FALLBACK_MS;
};

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

type PageWithHash = {
    page: (typeof JAMENDO_DOC_SOURCE.pages)[number];
    hash: string | undefined;
};

/**
 * Plain (free, un-rate-limited) fetch of each page's source HTML, hashed for
 * change detection. Returns undefined for a page's hash if the fetch itself
 * fails -- callers should treat that as "unknown, needs Firecrawl" rather
 * than skip it.
 */
const hashSourcePages = async (baseUrl: string, pages: typeof JAMENDO_DOC_SOURCE.pages): Promise<PageWithHash[]> => {
    const limiter = new Bottleneck({ maxConcurrent: CHANGE_CHECK_CONCURRENCY });

    return Promise.all(
        pages.map((page) =>
            limiter.schedule(async (): Promise<PageWithHash> => {
                const url = `${baseUrl}/${page.path}`;
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`change-detection request failed with HTTP ${response.status}`);
                    return { page, hash: hashContent(await response.text()) };
                } catch (err) {
                    logger.debug({ url, err }, 'change-detection fetch failed, will re-scrape');
                    return { page, hash: undefined };
                }
            })
        )
    );
};

export const fetchJamendoDocs = async (destDir: string): Promise<FetchJamendoDocsResult> => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
        throw new Error('FIRECRAWL_API_KEY is not set. Get one at https://firecrawl.dev');
    }

    const maxConcurrent = Number(process.env.FIRECRAWL_CONCURRENCY) || DEFAULT_CONCURRENCY;
    const rpm = Number(process.env.FIRECRAWL_RPM) || DEFAULT_RPM;
    // maxConcurrent caps simultaneous in-flight requests; minTime caps the pace
    // between request starts (60s / rpm). Both are needed -- concurrency alone
    // doesn't stop two fast workers from blowing through a per-minute budget.
    const limiter = new Bottleneck({ maxConcurrent, minTime: Math.ceil(60_000 / rpm) });

    const firecrawl = new FirecrawlClient({ apiKey });
    const { baseUrl, pages } = JAMENDO_DOC_SOURCE;
    const manifestPath = `${destDir}/manifest.json`;
    const manifest = await readManifest(manifestPath);

    logger.info({ pages: pages.length, maxConcurrent, rpm, destDir }, 'checking Jamendo doc pages for changes');

    const hashed = await hashSourcePages(baseUrl, pages);

    const toFetch = await Promise.all(
        hashed.map(async ({ page, hash }) => {
            const destPath = `${destDir}/${page.dest}`;
            const known = manifest[page.path];
            const unchanged = hash !== undefined && known?.hash === hash && (await Bun.file(destPath).exists());
            return { page, hash, needsFetch: !unchanged };
        })
    );

    const skipped = toFetch.filter((p) => !p.needsFetch).length;
    const pending = toFetch.filter((p) => p.needsFetch);

    logger.info(
        { total: pages.length, skipped, toFetch: pending.length },
        'change detection complete, fetching what changed'
    );

    let succeeded = 0;
    let failed = 0;

    const fetchPage = async (page: (typeof pages)[number], hash: string | undefined): Promise<void> => {
        const url = `${baseUrl}/${page.path}`;
        const destPath = `${destDir}/${page.dest}`;

        let attempt = 0;
        for (;;) {
            attempt += 1;
            logger.debug({ url, destPath, attempt }, 'requesting page');

            try {
                const doc = await firecrawl.scrape(url, {
                    formats: ['markdown'],
                    onlyMainContent: true,
                });

                if (!doc.markdown) {
                    throw new Error('response had no markdown content');
                }

                await Bun.write(destPath, doc.markdown);
                if (hash !== undefined) {
                    manifest[page.path] = { hash, fetchedAt: new Date().toISOString() };
                }
                succeeded += 1;
                logger.info({ url, destPath }, 'fetched page');
                return;
            } catch (err) {
                const wait = retryAfterMs(err);
                if (wait !== undefined && attempt <= MAX_RETRIES) {
                    logger.info({ url, attempt, waitMs: wait }, 'rate limited, retrying');
                    await sleep(wait);
                    continue;
                }
                failed += 1;
                logger.error({ url, err }, 'failed to fetch page');
                return;
            }
        }
    };

    await Promise.all(pending.map(({ page, hash }) => limiter.schedule(() => fetchPage(page, hash))));
    await writeManifest(manifestPath, manifest as JamendoDocManifest);

    logger.info({ succeeded, failed, skipped }, 'done fetching Jamendo doc pages');
    return { succeeded, failed, skipped };
};
