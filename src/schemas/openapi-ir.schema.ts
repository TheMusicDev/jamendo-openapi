import { z } from 'zod';
import { JamendoEndpointParameterSchema, JamendoEndpointSchema } from './jamendo-endpoint.schema.ts';
import { JamendoGlobalConfigSchema } from './jamendo-global-config.schema.ts';

/**
 * The intermediate representation build-openapi assembles from
 * jamendo-api-docs/extracted/ before handing off to a version-specific
 * serializer. Both openapi-3.0.yaml and openapi-3.1.yaml are generated
 * from the same OpenApiIr -- the serializers differ only in idiom
 * (nullable vs type-array-with-null, etc.), never in content.
 */
export const OpenApiIrSchema = z.object({
    globalConfig: JamendoGlobalConfigSchema,
    endpoints: z.array(JamendoEndpointSchema),
    /** componentName -> parameter shape, for parameters/requestBody fields whose exact shape recurs across >=2 endpoints. */
    sharedParameters: z.record(z.string(), JamendoEndpointParameterSchema),
});
export type OpenApiIr = z.infer<typeof OpenApiIrSchema>;
