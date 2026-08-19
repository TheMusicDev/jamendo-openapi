const SAMPLE_HEADING_PATTERN = /^#{2,4}\s*Sample\b/im;
const DEFAULT_MAX_CHARS = 12_000;
// Keep a small slice of the Sample section rather than dropping it entirely --
// full example payloads (e.g. tracks.md's waveform peaks array) run into
// thousands of numbers and add nothing, but the opening of the example
// response is often the only place a non-obvious response shape is visible
// (e.g. autocomplete's `results` being a keyed object, not an array -- never
// stated in prose, only shown in the example JSON).
const SAMPLE_PREVIEW_CHARS = 600;

/**
 * Raw fetched doc pages carry a "Sample" section with full example
 * request/response payloads. The extractor needs the parameter table and
 * field descriptions, not bulk example data -- truncate the Sample section
 * to a short preview (keeping response-shape info) rather than the whole
 * thing, then fall back to a char cap for any page that's still oversized
 * for another reason.
 *
 * maxChars is overridable per caller -- the one-shot global-config pass
 * (over 01-authentication.md, which has no Sample section and is entirely
 * load-bearing prose) needs a higher cap than the default, since it only
 * runs once, not once per endpoint page.
 */
export const trimDocMarkdown = (markdown: string, maxChars = DEFAULT_MAX_CHARS): string => {
    const sampleMatch = markdown.match(SAMPLE_HEADING_PATTERN);
    const withSamplePreview =
        sampleMatch?.index === undefined
            ? markdown
            : `${markdown.slice(0, sampleMatch.index)}${markdown.slice(sampleMatch.index, sampleMatch.index + SAMPLE_PREVIEW_CHARS)}\n\n[... example truncated ...]`;

    return withSamplePreview.length <= maxChars
        ? withSamplePreview
        : `${withSamplePreview.slice(0, maxChars)}\n\n[... truncated ...]`;
};
