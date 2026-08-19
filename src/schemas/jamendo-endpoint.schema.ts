import { z } from 'zod';

export const JamendoEndpointParameterSchema = z.object({
    name: z.string(),
    in: z.enum(['query', 'path']),
    required: z.boolean(),
    type: z.string(),
    enumValues: z.array(z.string()).nullable(),
    defaultValue: z.string().nullable(),
    description: z.string(),
});
export type JamendoEndpointParameter = z.infer<typeof JamendoEndpointParameterSchema>;

export const JamendoResponseFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
    nullable: z.boolean(),
    description: z.string(),
});
export type JamendoResponseField = z.infer<typeof JamendoResponseFieldSchema>;

export const JamendoEndpointSchema = z.object({
    operationId: z.string(),
    method: z.enum(['GET', 'POST']),
    path: z.string(),
    authType: z.enum(['apikey', 'oauth2', 'none']),
    summary: z.string(),
    description: z.string(),
    parameters: z.array(JamendoEndpointParameterSchema),
    requestBody: z.array(JamendoEndpointParameterSchema),
    responseFields: z.array(JamendoResponseFieldSchema),
    notes: z.array(z.string()),
});
export type JamendoEndpoint = z.infer<typeof JamendoEndpointSchema>;
