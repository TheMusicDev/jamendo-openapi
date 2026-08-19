import { afterEach, describe, expect, test } from 'bun:test';
import { rm } from 'node:fs/promises';
import { buildOpenApiIr } from '../../src/lib/build-openapi-ir.ts';

const EXTRACTED_DIR = 'tests/.tmp/build-openapi-ir';

const validGlobalConfig = {
    oauth2: { authorizationUrl: 'https://x/authorize', tokenUrl: 'https://x/grant', scopes: ['music'] },
    envelope: { headerFields: ['status'], resultsFieldName: 'results' },
    errorFields: ['error'],
};

const validEndpoint = {
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
};

describe('buildOpenApiIr', () => {
    afterEach(async () => {
        await rm(EXTRACTED_DIR, { recursive: true, force: true });
    });

    test('builds an IR from valid extracted files', async () => {
        await Bun.write(`${EXTRACTED_DIR}/_global.json`, JSON.stringify(validGlobalConfig));
        await Bun.write(`${EXTRACTED_DIR}/read-x.json`, JSON.stringify(validEndpoint));

        const ir = await buildOpenApiIr(EXTRACTED_DIR);
        expect(ir.endpoints).toHaveLength(1);
        expect(ir.globalConfig.oauth2.authorizationUrl).toBe('https://x/authorize');
    });

    test('ignores manifest.json', async () => {
        await Bun.write(`${EXTRACTED_DIR}/_global.json`, JSON.stringify(validGlobalConfig));
        await Bun.write(`${EXTRACTED_DIR}/manifest.json`, JSON.stringify({ x: { hash: 'a', fetchedAt: 'b' } }));

        const ir = await buildOpenApiIr(EXTRACTED_DIR);
        expect(ir.endpoints).toHaveLength(0);
    });

    test('throws instead of silently skipping a file that fails schema validation', async () => {
        await Bun.write(`${EXTRACTED_DIR}/_global.json`, JSON.stringify(validGlobalConfig));
        await Bun.write(`${EXTRACTED_DIR}/read-good.json`, JSON.stringify(validEndpoint));
        await Bun.write(`${EXTRACTED_DIR}/read-bad.json`, JSON.stringify({ operationId: 'missing-fields' }));

        await expect(buildOpenApiIr(EXTRACTED_DIR)).rejects.toThrow(/read-bad\.json/);
    });
});
