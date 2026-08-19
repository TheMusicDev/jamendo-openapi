import { describe, expect, test } from 'bun:test';
import { dedupeOpenApiParameters } from '../../src/lib/dedupe-openapi-parameters.ts';
import type { JamendoEndpoint, JamendoEndpointParameter } from '../../src/schemas/jamendo-endpoint.schema.ts';

const param = (overrides: Partial<JamendoEndpointParameter> = {}): JamendoEndpointParameter => ({
    name: 'client_id',
    in: 'query',
    required: true,
    type: 'string',
    enumValues: null,
    defaultValue: null,
    description: 'A Client Id.',
    ...overrides,
});

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

describe('dedupeOpenApiParameters', () => {
    test('does not share a parameter that only appears once', () => {
        const { sharedParameters } = dedupeOpenApiParameters([endpoint({ parameters: [param()] })]);
        expect(Object.keys(sharedParameters)).toHaveLength(0);
    });

    test('shares a parameter with identical shape across two endpoints', () => {
        const { sharedParameters, resolve } = dedupeOpenApiParameters([
            endpoint({ parameters: [param()] }),
            endpoint({ parameters: [param()] }),
        ]);

        expect(Object.keys(sharedParameters)).toEqual(['client_id']);
        expect(resolve(param())).toBe('client_id');
    });

    test('does not merge same-name parameters with a different shape', () => {
        const a = param({ description: 'Version A' });
        const b = param({ description: 'Version B' });

        const { sharedParameters, resolve } = dedupeOpenApiParameters([
            endpoint({ parameters: [a] }),
            endpoint({ parameters: [a] }),
            endpoint({ parameters: [b] }),
            endpoint({ parameters: [b] }),
        ]);

        expect(Object.keys(sharedParameters).sort()).toEqual(['client_id', 'client_id_2']);
        expect(resolve(a)).not.toBe(resolve(b));
    });

    test('resolve returns undefined for a parameter that was never shared', () => {
        const { resolve } = dedupeOpenApiParameters([endpoint({ parameters: [param()] })]);
        expect(resolve(param())).toBeUndefined();
    });

    test('considers requestBody fields alongside query/path parameters', () => {
        const p = param({ name: 'access_token', in: 'query' });
        const { sharedParameters } = dedupeOpenApiParameters([
            endpoint({ requestBody: [p] }),
            endpoint({ parameters: [p] }),
        ]);
        expect(Object.keys(sharedParameters)).toEqual(['access_token']);
    });
});
