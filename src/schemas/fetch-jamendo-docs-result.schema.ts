import { z } from 'zod';

export const FetchJamendoDocsResultSchema = z.object({
    succeeded: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    /** Pages whose source HTML hash matched the manifest, so Firecrawl was never called. */
    skipped: z.number().int().nonnegative(),
});
export type FetchJamendoDocsResult = z.infer<typeof FetchJamendoDocsResultSchema>;
