import { defineCommand } from 'citty';
import { extractJamendoDocs } from '../lib/extract-jamendo-docs.ts';
import { logger } from '../lib/logger.ts';

const DOCS_DIR = 'jamendo-api-docs';

export default defineCommand({
    meta: {
        name: 'extract-docs',
        description:
            'Extract structured endpoint/config data from jamendo-api-docs/ via an LLM, into jamendo-api-docs/extracted/',
    },
    async run() {
        const { succeeded, failed, skipped } = await extractJamendoDocs(DOCS_DIR);
        if (failed > 0) {
            logger.error({ succeeded, failed, skipped }, 'extraction completed with failures');
            process.exit(1);
        }
    },
});
