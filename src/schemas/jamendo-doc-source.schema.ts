import { z } from 'zod';

export const JamendoDocPageSchema = z.object({
    /** Path under the source's baseUrl */
    path: z.string(),
    /** Destination file, relative to jamendo-api-docs/ */
    dest: z.string(),
});
export type JamendoDocPage = z.infer<typeof JamendoDocPageSchema>;

export const JamendoDocSourceSchema = z.object({
    baseUrl: z.string().url(),
    pages: z.array(JamendoDocPageSchema),
});
export type JamendoDocSource = z.infer<typeof JamendoDocSourceSchema>;
