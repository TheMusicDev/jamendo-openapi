import { describe, expect, test } from 'bun:test';
import { JAMENDO_DOC_SOURCE } from '../../src/lib/jamendo-doc-source.ts';
import { JamendoDocSourceSchema } from '../../src/schemas/index.ts';

describe('JamendoDocSourceSchema', () => {
    test('accepts the real JAMENDO_DOC_SOURCE config', () => {
        expect(() => JamendoDocSourceSchema.parse(JAMENDO_DOC_SOURCE)).not.toThrow();
    });

    test('rejects a non-URL baseUrl', () => {
        expect(() => JamendoDocSourceSchema.parse({ baseUrl: 'not-a-url', pages: [] })).toThrow();
    });

    test('rejects a page missing dest', () => {
        expect(() =>
            JamendoDocSourceSchema.parse({
                baseUrl: 'https://example.com',
                pages: [{ path: 'tracks' }],
            })
        ).toThrow();
    });
});
