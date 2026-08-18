import { generateText, type LanguageModel } from 'ai';
import Bottleneck from 'bottleneck';
import type { z } from 'zod';
import { type FetchJamendoDocsResult, JamendoEndpointSchema, JamendoGlobalConfigSchema } from '../schemas/index.ts';
import { hashContent, readManifest, writeManifest } from './jamendo-doc-manifest.ts';
import { JAMENDO_DOC_SOURCE } from './jamendo-doc-source.ts';
import {
    ENDPOINT_SYSTEM_PROMPT,
    endpointUserPrompt,
    GLOBAL_CONFIG_SYSTEM_PROMPT,
    globalConfigUserPrompt,
} from './jamendo-extraction-prompts.ts';
import { getLlmModel } from './llm.ts';
import { logger } from './logger.ts';
import { trimDocMarkdown } from './trim-doc-markdown.ts';

const DEFAULT_CONCURRENCY = 2;
const MAX_ATTEMPTS = 3;
const GLOBAL_CONFIG_MAX_CHARS = 30_000;
const GLOBAL_CONFIG_KEY = '_global';

/** Strips a leading/trailing ```json fence, if the model added one despite instructions. */
const stripCodeFence = (text: string): string =>
    text
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

/**
 * Calls the model with a schema-shape-in-prompt instruction and parses the
 * response as JSON, validating against `schema`. Retries on parse/validation
 * failure -- not on network/transport errors, ai-sdk's own retry covers
 * those. Repeated failures here are a signal the current model can't
 * reliably follow instructions for this schema; logged clearly so that's
 * visible rather than silently degrading.
 */
const extractWithRetry = async <T>(
    model: LanguageModel,
    system: string,
    prompt: string,
    schema: z.ZodType<T>,
    label: string
): Promise<T | undefined> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        logger.info({ label, attempt, of: MAX_ATTEMPTS }, 'calling model');
        const startedAt = Date.now();

        try {
            const result = await generateText({
                model,
                system:
                    attempt === 1
                        ? system
                        : `${system}\n\nYour previous response was not valid JSON matching this shape. Try again.`,
                prompt,
            });
            const elapsedMs = Date.now() - startedAt;

            const parsed = JSON.parse(stripCodeFence(result.text));
            const validated = schema.safeParse(parsed);

            if (validated.success) {
                logger.info({ label, attempt, elapsedMs }, 'model responded, extraction valid');
                return validated.data;
            }

            lastError = validated.error;
            logger.info(
                { label, attempt, elapsedMs, issues: validated.error.issues },
                'model responded, but failed schema validation'
            );
        } catch (err) {
            lastError = err;
            logger.info(
                { label, attempt, elapsedMs: Date.now() - startedAt, err },
                'model call failed or returned invalid JSON'
            );
        }
    }

    logger.error(
        { label, attempts: MAX_ATTEMPTS, lastError },
        'extraction failed after all retries -- consider a larger/different LLM_MODEL'
    );
    return undefined;
};

export const extractJamendoDocs = async (docsDir: string): Promise<FetchJamendoDocsResult> => {
    const model = getLlmModel();
    const concurrency = Number(process.env.LLM_CONCURRENCY) || DEFAULT_CONCURRENCY;
    const limiter = new Bottleneck({ maxConcurrent: concurrency });

    const extractedDir = `${docsDir}/extracted`;
    const manifestPath = `${extractedDir}/manifest.json`;
    const manifest = await readManifest(manifestPath);

    let succeeded = 0;
    let failed = 0;
    let skipped = 0;

    const globalConfigPaths = JAMENDO_DOC_SOURCE.pages.filter((p) => !p.dest.includes('/'));
    const endpointPages = JAMENDO_DOC_SOURCE.pages.filter((p) => p.dest.includes('/'));

    logger.info(
        { globalConfigFiles: globalConfigPaths.length, endpointPages: endpointPages.length, concurrency },
        'starting extraction -- global config first, then per-endpoint pages'
    );

    // Global config: one shot over the 3 prose pages combined (OAuth2 URLs/
    // scopes, response envelope shape, error shape). Cache-keyed on the
    // combined hash of all 3 source files -- any of them changing re-runs it.
    const globalConfigSources = await Promise.all(
        globalConfigPaths.map((p) => Bun.file(`${docsDir}/${p.dest}`).text())
    );
    const combinedGlobalMarkdown = globalConfigSources.join('\n\n---\n\n');
    const globalConfigHash = hashContent(combinedGlobalMarkdown);
    const globalConfigDest = `${extractedDir}/_global.json`;
    const knownGlobal = manifest[GLOBAL_CONFIG_KEY];
    const globalUnchanged = knownGlobal?.hash === globalConfigHash && (await Bun.file(globalConfigDest).exists());

    if (globalUnchanged) {
        skipped += 1;
        logger.info('global config unchanged, skipping extraction');
    } else {
        const globalConfig = await extractWithRetry(
            model,
            GLOBAL_CONFIG_SYSTEM_PROMPT,
            globalConfigUserPrompt(trimDocMarkdown(combinedGlobalMarkdown, GLOBAL_CONFIG_MAX_CHARS)),
            JamendoGlobalConfigSchema,
            GLOBAL_CONFIG_KEY
        );

        if (globalConfig) {
            await Bun.write(globalConfigDest, `${JSON.stringify(globalConfig, null, 4)}\n`);
            manifest[GLOBAL_CONFIG_KEY] = { hash: globalConfigHash, fetchedAt: new Date().toISOString() };
            succeeded += 1;
        } else {
            failed += 1;
        }
    }

    // Per-endpoint extraction: hash each raw doc page, skip if unchanged and
    // already extracted -- same change-detection pattern as fetch-docs.
    let processed = 0;
    await Promise.all(
        endpointPages.map((page) =>
            limiter.schedule(async () => {
                const sourcePath = `${docsDir}/${page.dest}`;
                const slug = page.dest.replace(/\.md$/, '').replace('/', '-');
                const destPath = `${extractedDir}/${slug}.json`;

                const markdown = await Bun.file(sourcePath).text();
                const hash = hashContent(markdown);
                const known = manifest[page.path];
                const unchanged = known?.hash === hash && (await Bun.file(destPath).exists());

                if (unchanged) {
                    skipped += 1;
                    processed += 1;
                    logger.info(
                        { path: page.path, progress: `${processed}/${endpointPages.length}` },
                        'extraction unchanged, skipping'
                    );
                    return;
                }

                const endpoint = await extractWithRetry(
                    model,
                    ENDPOINT_SYSTEM_PROMPT,
                    endpointUserPrompt(trimDocMarkdown(markdown)),
                    JamendoEndpointSchema,
                    page.path
                );
                processed += 1;

                if (endpoint) {
                    await Bun.write(destPath, `${JSON.stringify(endpoint, null, 4)}\n`);
                    manifest[page.path] = { hash, fetchedAt: new Date().toISOString() };
                    succeeded += 1;
                    logger.info(
                        { path: page.path, destPath, progress: `${processed}/${endpointPages.length}` },
                        'extracted endpoint'
                    );
                } else {
                    failed += 1;
                }
            })
        )
    );

    await writeManifest(manifestPath, manifest);

    logger.info({ succeeded, failed, skipped }, 'done extracting Jamendo docs');
    return { succeeded, failed, skipped };
};
