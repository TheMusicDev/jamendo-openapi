import YAML from 'yaml';
import { buildOpenApiIr } from './build-openapi-ir.ts';
import { logger } from './logger.ts';
import { resolveUniqueOperationIds } from './resolve-unique-operation-ids.ts';
import { serializeOpenApi30 } from './serialize-openapi-30.ts';
import { serializeOpenApi31 } from './serialize-openapi-31.ts';

export interface BuildOpenApiResult {
    endpoints: number;
    sharedParameters: number;
    outputFiles: string[];
}

/**
 * Reads jamendo-api-docs/extracted/, builds the shared intermediate
 * representation once, then serializes it into openapi-3.0.yaml and
 * openapi-3.1.yaml. Pure code, no LLM -- both files are generated from
 * the same data by construction, so they can't drift the way two
 * separate LLM passes could.
 */
export const buildOpenApi = async (extractedDir: string, outDir: string): Promise<BuildOpenApiResult> => {
    const ir = await buildOpenApiIr(extractedDir);
    const operationIds = resolveUniqueOperationIds(ir.endpoints);

    const doc30 = serializeOpenApi30(ir, operationIds);
    const doc31 = serializeOpenApi31(ir, operationIds);

    const path30 = `${outDir}/openapi-3.0.yaml`;
    const path31 = `${outDir}/openapi-3.1.yaml`;

    await Bun.write(path30, YAML.stringify(doc30));
    await Bun.write(path31, YAML.stringify(doc31));

    logger.info({ path30, path31 }, 'wrote OpenAPI specs');

    return {
        endpoints: ir.endpoints.length,
        sharedParameters: Object.keys(ir.sharedParameters).length,
        outputFiles: [path30, path31],
    };
};
