import { defineCommand } from 'citty';
import { buildOpenApi } from '../lib/build-openapi.ts';
import { logger } from '../lib/logger.ts';

const EXTRACTED_DIR = 'jamendo-api-docs/extracted';
const OUT_DIR = 'openapi-docs';

export default defineCommand({
    meta: {
        name: 'build-openapi',
        description: 'Assemble openapi-3.0.yaml and openapi-3.1.yaml from jamendo-api-docs/extracted/ (no LLM)',
    },
    async run() {
        const result = await buildOpenApi(EXTRACTED_DIR, OUT_DIR);
        logger.info(result, 'build-openapi complete');
    },
});
