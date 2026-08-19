import { describe, expect, test } from 'bun:test';
import { resolveUniqueOperationIds } from '../../src/lib/resolve-unique-operation-ids.ts';
import type { JamendoEndpoint } from '../../src/schemas/jamendo-endpoint.schema.ts';

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

describe('resolveUniqueOperationIds', () => {
    test('leaves a non-colliding operationId unchanged', () => {
        const a = endpoint({ operationId: 'listTracks', path: '/tracks' });
        const result = resolveUniqueOperationIds([a]);
        expect(result.get(a)).toBe('listTracks');
    });

    test('disambiguates colliding operationIds using the path', () => {
        const a = endpoint({ operationId: 'listArtists', path: '/artists' });
        const b = endpoint({ operationId: 'listArtists', path: '/artists/tracks' });
        const result = resolveUniqueOperationIds([a, b]);

        expect(result.get(a)).not.toBe(result.get(b));
        expect(new Set([result.get(a), result.get(b)]).size).toBe(2);
    });

    test('every endpoint gets a distinct id even with 3+ collisions', () => {
        const endpoints = [
            endpoint({ operationId: 'x', path: '/a' }),
            endpoint({ operationId: 'x', path: '/b' }),
            endpoint({ operationId: 'x', path: '/c' }),
        ];
        const result = resolveUniqueOperationIds(endpoints);
        const ids = endpoints.map((e) => result.get(e));
        expect(new Set(ids).size).toBe(3);
    });
});
