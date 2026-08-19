import { describe, expect, test } from 'bun:test';
import { buildOpenApiDocument } from '../../src/lib/serialize-openapi.ts';
import type { JamendoEndpoint, OpenApiIr } from '../../src/schemas/index.ts';

const endpoint = (overrides: Partial<JamendoEndpoint> = {}): JamendoEndpoint => ({
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
    ...overrides,
});

const ir = (endpoints: JamendoEndpoint[]): OpenApiIr => ({
    globalConfig: {
        oauth2: { authorizationUrl: 'https://x/authorize', tokenUrl: 'https://x/grant', scopes: ['music'] },
        envelope: { headerFields: ['status'], resultsFieldName: 'results' },
        errorFields: ['error'],
    },
    endpoints,
    sharedParameters: {},
});

const operationIds = (endpoints: JamendoEndpoint[]): Map<JamendoEndpoint, string> =>
    new Map(endpoints.map((e) => [e, e.operationId]));

describe('buildOpenApiDocument', () => {
    test('/*​/file endpoints get a 302 redirect response, not a JSON 200', () => {
        const e = endpoint({ path: '/tracks/file', responseFields: [] });
        const doc = buildOpenApiDocument(ir([e]), '3.0.3', 'nullable-keyword', operationIds([e]));

        const responses = doc.paths['/tracks/file'].get.responses;
        expect(responses['302']).toBeDefined();
        expect(responses['200']).toBeUndefined();
    });

    test('a normal JSON-returning endpoint still gets a 200 response', () => {
        const e = endpoint({
            path: '/tracks',
            responseFields: [{ name: 'id', type: 'integer', nullable: false, description: '' }],
        });
        const doc = buildOpenApiDocument(ir([e]), '3.0.3', 'nullable-keyword', operationIds([e]));

        const responses = doc.paths['/tracks'].get.responses;
        expect(responses['200']).toBeDefined();
        expect(responses['302']).toBeUndefined();
    });

    test('an endpoint with empty responseFields that is not a /file path still gets a 200, not a redirect', () => {
        // Guards against misreading "empty responseFields" as "this is a redirect" --
        // most extracted endpoints have empty responseFields for unrelated reasons.
        const e = endpoint({ path: '/feeds', responseFields: [] });
        const doc = buildOpenApiDocument(ir([e]), '3.0.3', 'nullable-keyword', operationIds([e]));

        const responses = doc.paths['/feeds'].get.responses;
        expect(responses['200']).toBeDefined();
        expect(responses['302']).toBeUndefined();
    });

    test('throws when two endpoints share the same method+path', () => {
        const a = endpoint({ operationId: 'a', path: '/artists', method: 'GET' });
        const b = endpoint({ operationId: 'b', path: '/artists', method: 'GET' });

        expect(() => buildOpenApiDocument(ir([a, b]), '3.0.3', 'nullable-keyword', operationIds([a, b]))).toThrow(
            /Duplicate GET \/artists/
        );
    });

    test('does not throw when two endpoints share a path but differ in method', () => {
        const a = endpoint({ operationId: 'a', path: '/setuser/favorite', method: 'GET' });
        const b = endpoint({ operationId: 'b', path: '/setuser/favorite', method: 'POST' });

        expect(() => buildOpenApiDocument(ir([a, b]), '3.0.3', 'nullable-keyword', operationIds([a, b]))).not.toThrow();
    });
});
