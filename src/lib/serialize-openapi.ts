import type { JamendoEndpoint, JamendoEndpointParameter, OpenApiIr } from '../schemas/index.ts';
import { parameterShapeKey } from './dedupe-openapi-parameters.ts';
import { jamendoTypeToJsonSchemaType } from './jamendo-type-to-json-schema-type.ts';

const SERVER_URL = 'https://api.jamendo.com/v3.0';

// biome-ignore lint/suspicious/noExplicitAny: building a loosely-typed OpenAPI document object, not worth a full type for every possible shape
type Json = any;

/**
 * Which nullable idiom to emit. 3.0 uses `nullable: true` alongside a
 * single `type:` string; 3.1 uses `type: [x, "null"]` and drops
 * `nullable` entirely. Everything else about the two documents is
 * identical -- both are built by the same code path below, differing
 * only where this flag is read.
 */
export type NullableIdiom = 'nullable-keyword' | 'type-array';

const applyType = (baseType: string, nullable: boolean, idiom: NullableIdiom): Json => {
    if (!nullable) return { type: baseType };
    return idiom === 'nullable-keyword' ? { type: baseType, nullable: true } : { type: [baseType, 'null'] };
};

/**
 * Extracted enum/default values are always strings regardless of the
 * field's real type (e.g. imagesize is `integer` with enum values like
 * "25", "35") -- JSON Schema requires enum members to match `type`, so
 * coerce here rather than emit an invalid string-in-an-integer-enum spec.
 */
const coerceToType = (value: string, jsonSchemaType: string): Json => {
    if (jsonSchemaType === 'integer' || jsonSchemaType === 'number') {
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
    }
    if (jsonSchemaType === 'boolean') {
        if (value === 'true') return true;
        if (value === 'false') return false;
    }
    return value;
};

const buildParameterSchema = (param: JamendoEndpointParameter, idiom: NullableIdiom): Json => {
    const { type, isArray } = jamendoTypeToJsonSchemaType(param.type);
    const leaf = applyType(type, false, idiom);
    if (param.enumValues) leaf.enum = param.enumValues.map((v) => coerceToType(v, type));
    if (param.defaultValue !== null) leaf.default = coerceToType(param.defaultValue, type);

    return isArray ? { type: 'array', items: leaf } : leaf;
};

const buildParameterObject = (
    param: JamendoEndpointParameter,
    idiom: NullableIdiom,
    sharedParameters: OpenApiIr['sharedParameters'],
    resolveSharedName: (param: JamendoEndpointParameter) => string | undefined
): Json => {
    const sharedName = resolveSharedName(param);
    if (sharedName && sharedParameters[sharedName]) {
        return { $ref: `#/components/parameters/${sharedName}` };
    }

    return {
        name: param.name,
        in: param.in,
        required: param.required,
        description: param.description,
        schema: buildParameterSchema(param, idiom),
    };
};

const buildResponseSchema = (
    endpoint: JamendoEndpoint,
    globalConfig: OpenApiIr['globalConfig'],
    idiom: NullableIdiom
): Json => {
    const properties: Json = {};
    for (const field of endpoint.responseFields) {
        const { type, isArray } = jamendoTypeToJsonSchemaType(field.type);
        const leaf = applyType(type, field.nullable, idiom);
        properties[field.name] = isArray ? { type: 'array', items: leaf } : leaf;
    }

    const headerProperties: Json = {};
    for (const field of globalConfig.envelope.headerFields) {
        headerProperties[field] = { type: 'string' };
    }

    return {
        type: 'object',
        properties: {
            headers: { type: 'object', properties: headerProperties },
            [globalConfig.envelope.resultsFieldName]: {
                type: 'array',
                items: { type: 'object', properties },
            },
        },
    };
};

const buildErrorSchema = (globalConfig: OpenApiIr['globalConfig']): Json => {
    const properties: Json = {};
    for (const field of globalConfig.errorFields) {
        properties[field] = { type: 'string' };
    }
    return { type: 'object', properties };
};

export const buildOpenApiDocument = (
    ir: OpenApiIr,
    openapiVersion: '3.0.3' | '3.1.0',
    idiom: NullableIdiom,
    operationIds: Map<JamendoEndpoint, string>
): Json => {
    // ir.sharedParameters was already computed by dedupeOpenApiParameters in
    // build-openapi-ir.ts; re-derive a lookup from it by the same shape key
    // rather than re-running the dedup pass here.
    const sharedParameterNameByShape = new Map<string, string>();
    for (const [name, param] of Object.entries(ir.sharedParameters)) {
        sharedParameterNameByShape.set(parameterShapeKey(param), name);
    }
    const resolveSharedName = (param: JamendoEndpointParameter): string | undefined =>
        sharedParameterNameByShape.get(parameterShapeKey(param));

    const paths: Json = {};

    for (const endpoint of ir.endpoints) {
        const operationId = operationIds.get(endpoint) ?? endpoint.operationId;
        const verb = endpoint.method.toLowerCase();

        paths[endpoint.path] ??= {};
        paths[endpoint.path][verb] = {
            operationId,
            summary: endpoint.summary,
            description: endpoint.description,
            security:
                endpoint.authType === 'none'
                    ? []
                    : [
                          {
                              [endpoint.authType === 'apikey' ? 'apikey_auth' : 'oauth2']:
                                  endpoint.authType === 'oauth2' ? ir.globalConfig.oauth2.scopes : [],
                          },
                      ],
            parameters: endpoint.parameters.map((p) =>
                buildParameterObject(p, idiom, ir.sharedParameters, resolveSharedName)
            ),
            ...(endpoint.requestBody.length > 0
                ? {
                      requestBody: {
                          required: true,
                          content: {
                              'application/x-www-form-urlencoded': {
                                  schema: {
                                      type: 'object',
                                      properties: Object.fromEntries(
                                          endpoint.requestBody.map((p) => [p.name, buildParameterSchema(p, idiom)])
                                      ),
                                      required: endpoint.requestBody.filter((p) => p.required).map((p) => p.name),
                                  },
                              },
                          },
                      },
                  }
                : {}),
            responses: {
                '200': {
                    description: 'Successful response.',
                    content: {
                        'application/json': { schema: buildResponseSchema(endpoint, ir.globalConfig, idiom) },
                    },
                },
                default: {
                    description: 'Error response.',
                    content: { 'application/json': { schema: buildErrorSchema(ir.globalConfig) } },
                },
            },
            ...(endpoint.notes.length > 0 ? { 'x-notes': endpoint.notes } : {}),
        };
    }

    const sharedParameterComponents: Json = {};
    for (const [name, param] of Object.entries(ir.sharedParameters)) {
        sharedParameterComponents[name] = {
            name: param.name,
            in: param.in,
            required: param.required,
            description: param.description,
            schema: buildParameterSchema(param, idiom),
        };
    }

    return {
        openapi: openapiVersion,
        info: {
            title: 'Jamendo API',
            version: '3.0.0',
            description:
                'Community-generated OpenAPI description of the Jamendo API v3.0, built from jamendo-api-docs/.',
        },
        servers: [{ url: SERVER_URL }],
        security: [{ apikey_auth: [] }],
        paths,
        components: {
            parameters: sharedParameterComponents,
            securitySchemes: {
                apikey_auth: { type: 'apiKey', in: 'query', name: 'client_id' },
                oauth2: {
                    type: 'oauth2',
                    flows: {
                        authorizationCode: {
                            authorizationUrl: ir.globalConfig.oauth2.authorizationUrl,
                            tokenUrl: ir.globalConfig.oauth2.tokenUrl,
                            scopes: Object.fromEntries(ir.globalConfig.oauth2.scopes.map((s) => [s, s])),
                        },
                    },
                },
            },
        },
    };
};
