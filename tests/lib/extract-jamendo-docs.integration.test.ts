import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { rm } from 'node:fs/promises';
import * as ai from 'ai';
import { extractJamendoDocs } from '../../src/lib/extract-jamendo-docs.ts';
import { JAMENDO_DOC_SOURCE } from '../../src/lib/jamendo-doc-source.ts';

// generateText's real generic signature is too complex to type a mock
// implementation against cleanly -- the test only ever cares about `.text`,
// so mock it as returning that one field and cast through `any` here, once.
const mockGenerateText = (impl: (opts: { prompt: string }) => Promise<{ text: string }>) =>
    // biome-ignore lint/suspicious/noExplicitAny: see comment above
    spyOn(ai, 'generateText').mockImplementation(impl as any);

const DOCS_DIR = 'tests/.tmp/extract-jamendo-docs';
const endpointPages = JAMENDO_DOC_SOURCE.pages.filter((p) => p.dest.includes('/'));

const validEndpointJson = JSON.stringify({
    operationId: 'op',
    method: 'GET',
    path: '/x',
    authType: 'apikey',
    summary: 's',
    description: 'd',
    parameters: [],
    requestBody: [],
    responseFields: [],
    notes: [],
});

const validGlobalConfigJson = JSON.stringify({
    oauth2: { authorizationUrl: 'https://x/authorize', tokenUrl: 'https://x/grant', scopes: ['music'] },
    envelope: { headerFields: ['status'], resultsFieldName: 'results' },
    errorFields: ['error'],
});

// biome-ignore lint/suspicious/noExplicitAny: mock module override
let generateTextMock: any;

describe('extractJamendoDocs', () => {
    const originalBaseUrl = process.env.LLM_BASE_URL;
    const originalApiKey = process.env.LLM_API_KEY;
    const originalModel = process.env.LLM_MODEL;

    beforeEach(async () => {
        process.env.LLM_BASE_URL = 'http://localhost:11434/v1';
        process.env.LLM_API_KEY = 'test-key';
        process.env.LLM_MODEL = 'test-model';

        for (const page of JAMENDO_DOC_SOURCE.pages) {
            await Bun.write(`${DOCS_DIR}/${page.dest}`, `# ${page.path}\n\nsome doc content`);
        }
    });

    afterEach(async () => {
        process.env.LLM_BASE_URL = originalBaseUrl;
        process.env.LLM_API_KEY = originalApiKey;
        process.env.LLM_MODEL = originalModel;
        generateTextMock?.mockRestore();
        await rm(DOCS_DIR, { recursive: true, force: true });
    });

    test('throws when LLM_BASE_URL is unset', async () => {
        process.env.LLM_BASE_URL = undefined;
        await expect(extractJamendoDocs(DOCS_DIR)).rejects.toThrow('LLM_BASE_URL is not set');
    });

    test('extracts every endpoint page and the global config on a fresh run', async () => {
        generateTextMock = mockGenerateText(async (opts) => {
            const isGlobal = opts.prompt.includes('OAuth2 config');
            return { text: isGlobal ? validGlobalConfigJson : validEndpointJson };
        });

        const result = await extractJamendoDocs(DOCS_DIR);

        expect(result.failed).toBe(0);
        // +1 for the single global-config extraction alongside per-endpoint pages.
        expect(result.succeeded).toBe(endpointPages.length + 1);
        expect(result.skipped).toBe(0);

        const globalConfig = await Bun.file(`${DOCS_DIR}/extracted/_global.json`).json();
        expect(globalConfig.oauth2.authorizationUrl).toBe('https://x/authorize');

        const firstPage = endpointPages[0];
        const slug = firstPage?.dest.replace(/\.md$/, '').replace('/', '-');
        const extracted = await Bun.file(`${DOCS_DIR}/extracted/${slug}.json`).json();
        expect(extracted.operationId).toBe('op');
    });

    test('retries on invalid JSON then succeeds', async () => {
        const callsPerPath: Record<string, number> = {};
        generateTextMock = mockGenerateText(async (opts) => {
            const isGlobal = opts.prompt.includes('OAuth2 config');
            if (isGlobal) return { text: validGlobalConfigJson };

            const firstPagePath = endpointPages[0]?.path ?? '';
            callsPerPath[firstPagePath] = (callsPerPath[firstPagePath] ?? 0) + 1;
            const isFirstPage = opts.prompt.includes(firstPagePath);
            return { text: isFirstPage && callsPerPath[firstPagePath] < 2 ? 'not json' : validEndpointJson };
        });

        const result = await extractJamendoDocs(DOCS_DIR);
        expect(result.failed).toBe(0);
        expect(callsPerPath[endpointPages[0]?.path ?? '']).toBeGreaterThan(1);
    });

    test('gives up after max retries and counts as failed', async () => {
        generateTextMock = mockGenerateText(async (opts) => {
            const isGlobal = opts.prompt.includes('OAuth2 config');
            return { text: isGlobal ? validGlobalConfigJson : 'not valid json no matter what' };
        });

        const result = await extractJamendoDocs(DOCS_DIR);
        expect(result.failed).toBe(endpointPages.length);
        expect(result.succeeded).toBe(1); // just the global config
    });

    test('skips extraction on a second run when source markdown is unchanged', async () => {
        generateTextMock = mockGenerateText(async (opts) => {
            const isGlobal = opts.prompt.includes('OAuth2 config');
            return { text: isGlobal ? validGlobalConfigJson : validEndpointJson };
        });

        await extractJamendoDocs(DOCS_DIR);
        generateTextMock.mockClear();

        const second = await extractJamendoDocs(DOCS_DIR);

        expect(second.succeeded).toBe(0);
        expect(second.failed).toBe(0);
        expect(second.skipped).toBe(endpointPages.length + 1);
        expect(generateTextMock).not.toHaveBeenCalled();
    });
});
