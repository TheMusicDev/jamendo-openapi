import type { JamendoEndpoint, OpenApiIr } from '../schemas/index.ts';
import { buildOpenApiDocument } from './serialize-openapi.ts';

/** Serializes the shared IR to an OpenAPI 3.0.3 document object. Idiom: `nullable: true`, single-string `type`. */
// biome-ignore lint/suspicious/noExplicitAny: OpenAPI document object, not worth a full structural type
export const serializeOpenApi30 = (ir: OpenApiIr, operationIds: Map<JamendoEndpoint, string>): any =>
    buildOpenApiDocument(ir, '3.0.3', 'nullable-keyword', operationIds);
