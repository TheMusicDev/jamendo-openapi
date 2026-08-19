import { readdir } from 'node:fs/promises';
import { JamendoEndpointSchema, JamendoGlobalConfigSchema, type OpenApiIr } from '../schemas/index.ts';
import { dedupeOpenApiParameters } from './dedupe-openapi-parameters.ts';
import { logger } from './logger.ts';

const GLOBAL_CONFIG_FILE = '_global.json';
const MANIFEST_FILE = 'manifest.json';

/**
 * Reads every extracted endpoint + the global config from
 * jamendo-api-docs/extracted/ and assembles the shared intermediate
 * representation both openapi-3.0.yaml and openapi-3.1.yaml serialize
 * from. Pure data loading + dedup -- no OpenAPI-version-specific idioms
 * here, those live in the serializers.
 */
export const buildOpenApiIr = async (extractedDir: string): Promise<OpenApiIr> => {
    const globalConfig = JamendoGlobalConfigSchema.parse(
        await Bun.file(`${extractedDir}/${GLOBAL_CONFIG_FILE}`).json()
    );

    const files = (await readdir(extractedDir)).filter(
        (f) => f.endsWith('.json') && f !== GLOBAL_CONFIG_FILE && f !== MANIFEST_FILE
    );

    const endpoints = [];
    for (const file of files.sort()) {
        const raw = await Bun.file(`${extractedDir}/${file}`).json();
        const parsed = JamendoEndpointSchema.safeParse(raw);
        if (!parsed.success) {
            logger.error(
                { file, issues: parsed.error.issues },
                'extracted endpoint file failed schema validation, skipping'
            );
            continue;
        }
        endpoints.push(parsed.data);
    }

    const { sharedParameters } = dedupeOpenApiParameters(endpoints);

    logger.info(
        { endpoints: endpoints.length, sharedParameters: Object.keys(sharedParameters).length },
        'built OpenAPI intermediate representation'
    );

    return { globalConfig, endpoints, sharedParameters };
};
