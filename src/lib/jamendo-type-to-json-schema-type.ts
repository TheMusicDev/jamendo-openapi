/**
 * Extracted `type` fields are free-text from an LLM, not real JSON Schema
 * types -- "enum"/"enum[]" show up because the model described the
 * *constraint* (has an enum) rather than the underlying JSON type. The
 * actual enum values live in enumValues regardless of what's in `type`,
 * so normalize here rather than pass a non-JSON-Schema type straight into
 * a `type:` key.
 *
 * `itemType` is the array element type (e.g. "integer" for "one or more
 * track IDs"), populated by extraction on `JamendoEndpointParameter` when
 * `type` is "array". Falls back to "string" when absent -- older extracted
 * data (extracted before this field existed) or a genuinely string-item
 * array like enum[].
 */
export const jamendoTypeToJsonSchemaType = (
    type: string,
    itemType?: string | null
): { type: string; isArray: boolean } => {
    switch (type) {
        case 'enum':
            return { type: 'string', isArray: false };
        case 'enum[]':
            return { type: 'string', isArray: true };
        case 'array':
            return { type: itemType ?? 'string', isArray: true };
        default:
            return { type, isArray: false };
    }
};
