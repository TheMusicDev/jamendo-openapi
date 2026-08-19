import { describe, expect, test } from 'bun:test';
import { jamendoTypeToJsonSchemaType } from '../../src/lib/jamendo-type-to-json-schema-type.ts';

describe('jamendoTypeToJsonSchemaType', () => {
    test('maps enum to string, non-array', () => {
        expect(jamendoTypeToJsonSchemaType('enum')).toEqual({ type: 'string', isArray: false });
    });

    test('maps enum[] to string, array', () => {
        expect(jamendoTypeToJsonSchemaType('enum[]')).toEqual({ type: 'string', isArray: true });
    });

    test('maps array to string, array', () => {
        expect(jamendoTypeToJsonSchemaType('array')).toEqual({ type: 'string', isArray: true });
    });

    test('passes through known JSON Schema types unchanged', () => {
        for (const t of ['string', 'integer', 'number', 'boolean', 'object']) {
            expect(jamendoTypeToJsonSchemaType(t)).toEqual({ type: t, isArray: false });
        }
    });
});
