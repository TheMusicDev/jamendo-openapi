import { defineCommand } from 'citty';
import { fetchJamendoDocs } from '../lib/fetch-jamendo-docs.ts';
import { logger } from '../lib/logger.ts';

const DEST_DIR = 'jamendo-api-docs';

export default defineCommand({
    meta: {
        name: 'fetch-docs',
        description: 'Fetch the known Jamendo API doc pages via Firecrawl into jamendo-api-docs/',
    },
    async run() {
        const { succeeded, failed, skipped } = await fetchJamendoDocs(DEST_DIR);
        if (failed > 0) {
            logger.error({ succeeded, failed, skipped }, 'fetch completed with failures');
            process.exit(1);
        }
    },
});
