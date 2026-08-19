import type { JamendoEndpoint, OpenApiIr } from '../schemas/index.ts';
import { buildOpenApiDocument } from './serialize-openapi.ts';

/** Serializes the shared IR to an OpenAPI 3.1.0 document object. Idiom: `type: [x, "null"]`, no `nullable` keyword. */
// biome-ignore lint/suspicious/noExplicitAny: OpenAPI document object, not worth a full structural type
export const serializeOpenApi31 = (ir: OpenApiIr, operationIds: Map<JamendoEndpoint, string>): any =>
    buildOpenApiDocument(ir, '3.1.0', 'type-array', operationIds);
