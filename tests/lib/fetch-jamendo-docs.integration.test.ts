import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { rm } from 'node:fs/promises';
import { FirecrawlClient } from '@mendable/firecrawl-js';
import { fetchJamendoDocs } from '../../src/lib/fetch-jamendo-docs.ts';
import { JAMENDO_DOC_SOURCE } from '../../src/lib/jamendo-doc-source.ts';

const DEST_DIR = 'tests/.tmp/fetch-jamendo-docs';

describe('fetchJamendoDocs', () => {
    const originalApiKey = process.env.FIRECRAWL_API_KEY;
    const originalConcurrency = process.env.FIRECRAWL_CONCURRENCY;
    const originalRpm = process.env.FIRECRAWL_RPM;
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        process.env.FIRECRAWL_API_KEY = 'test-key';
        process.env.FIRECRAWL_CONCURRENCY = '4';
        // High enough that Bottleneck's pacing never throttles a mocked (near-instant) call.
        process.env.FIRECRAWL_RPM = '100000';
        // Change-detection fetch: return distinct HTML per URL so hashes differ per page,
        // but stay stable across calls within a test unless a test overrides it.
        globalThis.fetch = (async (url: string | URL | Request) => new Response(`<html>${url}</html>`)) as typeof fetch;
    });

    afterEach(async () => {
        process.env.FIRECRAWL_API_KEY = originalApiKey;
        process.env.FIRECRAWL_CONCURRENCY = originalConcurrency;
        process.env.FIRECRAWL_RPM = originalRpm;
        globalThis.fetch = originalFetch;
        await rm(DEST_DIR, { recursive: true, force: true });
    });

    test('throws when FIRECRAWL_API_KEY is unset', async () => {
        process.env.FIRECRAWL_API_KEY = undefined;
        await expect(fetchJamendoDocs(DEST_DIR)).rejects.toThrow('FIRECRAWL_API_KEY is not set');
    });

    test('writes every page to disk and reports success counts on a fresh run', async () => {
        const scrapeSpy = spyOn(FirecrawlClient.prototype, 'scrape').mockImplementation(async (url: string) => ({
            markdown: `# content for ${url}`,
        }));

        const result = await fetchJamendoDocs(DEST_DIR);

        expect(result.failed).toBe(0);
        expect(result.skipped).toBe(0);
        expect(result.succeeded).toBe(JAMENDO_DOC_SOURCE.pages.length);
        expect(scrapeSpy).toHaveBeenCalledTimes(result.succeeded);

        const written = await Bun.file(`${DEST_DIR}/read/tracks.md`).text();
        expect(written).toContain('content for https://developer.jamendo.com/v3.0/tracks');

        scrapeSpy.mockRestore();
    });

    test('counts a page as failed when scrape returns no markdown', async () => {
        const scrapeSpy = spyOn(FirecrawlClient.prototype, 'scrape').mockImplementation(async () => ({
            markdown: undefined,
        }));

        const result = await fetchJamendoDocs(DEST_DIR);

        expect(result.succeeded).toBe(0);
        expect(result.failed).toBeGreaterThan(0);

        scrapeSpy.mockRestore();
    });

    test('skips Firecrawl on a second run when source HTML is unchanged', async () => {
        const scrapeSpy = spyOn(FirecrawlClient.prototype, 'scrape').mockImplementation(async (url: string) => ({
            markdown: `# content for ${url}`,
        }));

        const first = await fetchJamendoDocs(DEST_DIR);
        expect(first.succeeded).toBe(JAMENDO_DOC_SOURCE.pages.length);
        scrapeSpy.mockClear();

        const second = await fetchJamendoDocs(DEST_DIR);

        expect(second.failed).toBe(0);
        expect(second.succeeded).toBe(0);
        expect(second.skipped).toBe(JAMENDO_DOC_SOURCE.pages.length);
        expect(scrapeSpy).not.toHaveBeenCalled();

        scrapeSpy.mockRestore();
    });

    test('re-fetches only the pages whose source HTML changed', async () => {
        const scrapeSpy = spyOn(FirecrawlClient.prototype, 'scrape').mockImplementation(async (url: string) => ({
            markdown: `# content for ${url}`,
        }));

        await fetchJamendoDocs(DEST_DIR);
        scrapeSpy.mockClear();

        const changedPath = JAMENDO_DOC_SOURCE.pages[0]?.path;
        globalThis.fetch = (async (url: string | URL | Request) => {
            const isChanged = String(url).endsWith(`/${changedPath}`);
            return new Response(isChanged ? '<html>new content</html>' : `<html>${url}</html>`);
        }) as typeof fetch;

        const result = await fetchJamendoDocs(DEST_DIR);

        expect(result.succeeded).toBe(1);
        expect(result.skipped).toBe(JAMENDO_DOC_SOURCE.pages.length - 1);
        expect(scrapeSpy).toHaveBeenCalledTimes(1);

        scrapeSpy.mockRestore();
    });

    test('re-fetches a page whose destination file is missing even if the hash matches', async () => {
        const scrapeSpy = spyOn(FirecrawlClient.prototype, 'scrape').mockImplementation(async (url: string) => ({
            markdown: `# content for ${url}`,
        }));

        await fetchJamendoDocs(DEST_DIR);
        scrapeSpy.mockClear();

        const missingDest = JAMENDO_DOC_SOURCE.pages[0]?.dest;
        await rm(`${DEST_DIR}/${missingDest}`);

        const result = await fetchJamendoDocs(DEST_DIR);

        expect(result.succeeded).toBe(1);
        expect(result.skipped).toBe(JAMENDO_DOC_SOURCE.pages.length - 1);

        scrapeSpy.mockRestore();
    });
});
