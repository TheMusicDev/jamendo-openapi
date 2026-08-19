import { z } from 'zod';

export const JamendoGlobalConfigSchema = z.object({
    oauth2: z.object({
        authorizationUrl: z.string(),
        tokenUrl: z.string(),
        scopes: z.array(z.string()),
    }),
    envelope: z.object({
        headerFields: z.array(z.string()),
        resultsFieldName: z.string(),
    }),
    errorFields: z.array(z.string()),
});
export type JamendoGlobalConfig = z.infer<typeof JamendoGlobalConfigSchema>;
