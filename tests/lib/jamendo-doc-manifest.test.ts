import { afterEach, describe, expect, test } from 'bun:test';
import { rm } from 'node:fs/promises';
import { hashContent, readManifest, writeManifest } from '../../src/lib/jamendo-doc-manifest.ts';

const MANIFEST_PATH = 'tests/.tmp/jamendo-doc-manifest/manifest.json';

describe('hashContent', () => {
    test('is deterministic for the same input', () => {
        expect(hashContent('hello')).toBe(hashContent('hello'));
    });

    test('differs for different input', () => {
        expect(hashContent('hello')).not.toBe(hashContent('world'));
    });
});

describe('readManifest / writeManifest', () => {
    afterEach(async () => {
        await rm('tests/.tmp/jamendo-doc-manifest', { recursive: true, force: true });
    });

    test('readManifest returns an empty object when the file does not exist', async () => {
        expect(await readManifest(MANIFEST_PATH)).toEqual({});
    });

    test('writeManifest then readManifest round-trips', async () => {
        const manifest = { tracks: { hash: 'abc123', fetchedAt: '2026-08-18T00:00:00.000Z' } };
        await writeManifest(MANIFEST_PATH, manifest);
        expect(await readManifest(MANIFEST_PATH)).toEqual(manifest);
    });

    test('readManifest returns an empty object for invalid JSON', async () => {
        await Bun.write(MANIFEST_PATH, 'not json');
        expect(await readManifest(MANIFEST_PATH)).toEqual({});
    });

    test('readManifest returns an empty object when the shape fails schema validation', async () => {
        await Bun.write(MANIFEST_PATH, JSON.stringify({ tracks: { hash: 123 } }));
        expect(await readManifest(MANIFEST_PATH)).toEqual({});
    });
});
