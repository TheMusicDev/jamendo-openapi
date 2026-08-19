import { z } from 'zod';

export const JamendoDocManifestEntrySchema = z.object({
    /** MD5 hash of the raw HTML fetched from the source page. */
    hash: z.string(),
    /** ISO timestamp of the last time this page was fetched through Firecrawl. */
    fetchedAt: z.string(),
});
export type JamendoDocManifestEntry = z.infer<typeof JamendoDocManifestEntrySchema>;

/** Keyed by JamendoDocPage.path. */
export const JamendoDocManifestSchema = z.record(z.string(), JamendoDocManifestEntrySchema);
export type JamendoDocManifest = z.infer<typeof JamendoDocManifestSchema>;
