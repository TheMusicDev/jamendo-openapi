import { type JamendoDocManifest, JamendoDocManifestSchema } from '../schemas/index.ts';
import { logger } from './logger.ts';

export const hashContent = (content: string): string => new Bun.CryptoHasher('md5').update(content).digest('hex');

export const readManifest = async (manifestPath: string): Promise<JamendoDocManifest> => {
    const file = Bun.file(manifestPath);
    if (!(await file.exists())) return {};

    try {
        return JamendoDocManifestSchema.parse(await file.json());
    } catch (err) {
        logger.error({ manifestPath, err }, 'manifest is unreadable or invalid, treating as empty');
        return {};
    }
};

export const writeManifest = async (manifestPath: string, manifest: JamendoDocManifest): Promise<void> => {
    await Bun.write(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
};
