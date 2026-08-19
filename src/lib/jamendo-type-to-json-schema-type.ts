/**
 * Extracted `type` fields are free-text from an LLM, not real JSON Schema
 * types -- "enum"/"enum[]" show up because the model described the
 * *constraint* (has an enum) rather than the underlying JSON type, and
 * "array" params (e.g. "one or more track IDs") don't carry an item type
 * at all. The actual enum values live in enumValues regardless of what's
 * in `type`, so normalize here rather than pass a non-JSON-Schema type
 * straight into a `type:` key.
 *
 * Known limitation: array item type always defaults to "string" since the
 * extracted schema has no separate item-type field -- an "array of
 * integer IDs" param serializes with string items. Fixing this properly
 * needs a richer extraction schema (a future extract-docs change), not a
 * guess parsed out of the free-text description here.
 */
export const jamendoTypeToJsonSchemaType = (type: string): { type: string; isArray: boolean } => {
    switch (type) {
        case 'enum':
            return { type: 'string', isArray: false };
        case 'enum[]':
        case 'array':
            return { type: 'string', isArray: true };
        default:
            return { type, isArray: false };
    }
};
