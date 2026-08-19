import type { JamendoEndpoint } from '../schemas/jamendo-endpoint.schema.ts';
import { logger } from './logger.ts';

/**
 * The LLM extraction sometimes assigns the same operationId to genuinely
 * different endpoints (e.g. /artists and /artists/tracks both extracted
 * as "listArtists") -- operationId must be globally unique in a valid
 * OpenAPI document, and (path, method) is always unique, so that's the
 * real identity. Returns a Map from endpoint to its guaranteed-unique
 * operationId: the extracted one if it's not colliding, otherwise a
 * disambiguated variant derived from the path.
 */
export const resolveUniqueOperationIds = (endpoints: JamendoEndpoint[]): Map<JamendoEndpoint, string> => {
    const countByOperationId = new Map<string, number>();
    for (const endpoint of endpoints) {
        countByOperationId.set(endpoint.operationId, (countByOperationId.get(endpoint.operationId) ?? 0) + 1);
    }

    const seenSoFar = new Map<string, number>();
    const result = new Map<JamendoEndpoint, string>();

    for (const endpoint of endpoints) {
        const collisionCount = countByOperationId.get(endpoint.operationId) ?? 1;
        if (collisionCount === 1) {
            result.set(endpoint, endpoint.operationId);
            continue;
        }

        const occurrence = (seenSoFar.get(endpoint.operationId) ?? 0) + 1;
        seenSoFar.set(endpoint.operationId, occurrence);

        const pathSuffix = endpoint.path
            .split('/')
            .filter(Boolean)
            .map((segment, i) => (i === 0 ? segment : segment[0]?.toUpperCase() + segment.slice(1)))
            .join('');
        const disambiguated = `${endpoint.operationId}_${pathSuffix}`;

        logger.info(
            { original: endpoint.operationId, path: endpoint.path, resolved: disambiguated },
            'operationId collision, disambiguated from path'
        );
        result.set(endpoint, disambiguated);
    }

    return result;
};
