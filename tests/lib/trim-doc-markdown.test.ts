import { describe, expect, test } from 'bun:test';
import { trimDocMarkdown } from '../../src/lib/trim-doc-markdown.ts';

describe('trimDocMarkdown', () => {
    test('leaves short content unchanged', () => {
        const md = '# tracks\n\nsome content';
        expect(trimDocMarkdown(md)).toBe(md);
    });

    test('keeps a short preview of the Sample section rather than dropping it entirely', () => {
        const sampleBody = 'x'.repeat(1000);
        const md = `# tracks\n\n## parameters\nstuff\n\n### Sample\n\n${sampleBody}`;
        const result = trimDocMarkdown(md);

        expect(result).toContain('# tracks\n\n## parameters\nstuff');
        expect(result).toContain('### Sample');
        expect(result).toContain('[... example truncated ...]');
        // The preview is short, not the full 1000-char sample body.
        expect(result.length).toBeLessThan(md.length);
    });

    test('preserves response-shape hints near the start of the Sample section', () => {
        const md = '# autocomplete\n\n### Sample\n\n#### Response:\n```json\n{"results":{"tags":[],"artists":[]}}\n```';
        const result = trimDocMarkdown(md);
        expect(result).toContain('"results":{"tags"');
    });

    test('matches "Sample" heading at various levels and casing', () => {
        expect(trimDocMarkdown('before\n#### sample\nafter')).toContain('before\n');
        expect(trimDocMarkdown('before\n## SAMPLE\nafter')).toContain('before\n');
    });

    test('falls back to a char cap when there is no Sample heading but content is huge', () => {
        const md = `x`.repeat(20_000);
        const result = trimDocMarkdown(md, 100);
        expect(result.length).toBeLessThan(200);
        expect(result).toContain('[... truncated ...]');
    });

    test('accepts a custom maxChars for callers that need a bigger budget', () => {
        const md = `x`.repeat(500);
        expect(trimDocMarkdown(md, 1000)).toBe(md);
        expect(trimDocMarkdown(md, 100)).toContain('[... truncated ...]');
    });
});
