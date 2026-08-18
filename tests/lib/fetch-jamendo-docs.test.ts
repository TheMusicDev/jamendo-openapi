import { describe, expect, test } from 'bun:test';
import { SdkError } from '@mendable/firecrawl-js';
import { retryAfterMs } from '../../src/lib/fetch-jamendo-docs.ts';

describe('retryAfterMs', () => {
    test('returns undefined for a non-SdkError', () => {
        expect(retryAfterMs(new Error('boom'))).toBeUndefined();
    });

    test('returns undefined for an SdkError with a non-429 status', () => {
        const err = new SdkError('not found', 404);
        expect(retryAfterMs(err)).toBeUndefined();
    });

    test('parses the retry-after seconds from a 429 message', () => {
        const err = new SdkError(
            'Rate limit exceeded. Consumed (req/min): 10, Remaining (req/min): 0. ' +
                'Upgrade your plan at https://firecrawl.dev/pricing for increased rate limits ' +
                'or please retry after 57s, resets at Tue Aug 18 2026 19:08:46 GMT+0000',
            429
        );
        expect(retryAfterMs(err)).toBe(57_000);
    });

    test('falls back to 15s when a 429 message has no parseable retry-after', () => {
        const err = new SdkError('Rate limit exceeded, try later.', 429);
        expect(retryAfterMs(err)).toBe(15_000);
    });
});
