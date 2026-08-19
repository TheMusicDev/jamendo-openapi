import type { JamendoEndpoint, JamendoEndpointParameter } from '../schemas/jamendo-endpoint.schema.ts';

/**
 * Key used to decide whether two parameters (or requestBody fields) with
 * the same name are "the same parameter" and can be hoisted to a shared
 * components/parameters entry. Includes every field except `name` itself --
 * two params only merge if name AND the full shape (type, required, in,
 * enum, default, description) match exactly. This is deliberately
 * conservative: a param that's documented slightly differently on two
 * pages stays separate rather than risk silently conflating two different
 * meanings under one shared component.
 */
export const parameterShapeKey = (param: JamendoEndpointParameter): string =>
    `${param.name}::${JSON.stringify({
        in: param.in,
        required: param.required,
        type: param.type,
        enumValues: param.enumValues,
        defaultValue: param.defaultValue,
        description: param.description,
    })}`;

export interface DedupeResult {
    /** componentName -> parameter definition, for components/parameters */
    sharedParameters: Record<string, JamendoEndpointParameter>;
    /** name -> componentName, for endpoints to look up which shared component (if any) a given (name, shape) resolves to */
    resolve: (param: JamendoEndpointParameter) => string | undefined;
}

/**
 * Finds parameters (query/path params and requestBody fields, since both
 * use JamendoEndpointParameterSchema) whose exact shape recurs across two
 * or more endpoints, and assigns each a stable component name.
 */
export const dedupeOpenApiParameters = (endpoints: JamendoEndpoint[]): DedupeResult => {
    const seen = new Map<string, { param: JamendoEndpointParameter; count: number }>();

    for (const endpoint of endpoints) {
        for (const param of [...endpoint.parameters, ...endpoint.requestBody]) {
            const key = parameterShapeKey(param);
            const existing = seen.get(key);
            if (existing) {
                existing.count += 1;
            } else {
                seen.set(key, { param, count: 1 });
            }
        }
    }

    const sharedParameters: Record<string, JamendoEndpointParameter> = {};
    const keyToComponentName = new Map<string, string>();

    for (const [key, { param, count }] of seen) {
        if (count < 2) continue;
        // Component names must be unique per (name, shape) pair -- when the
        // same param name has multiple distinct shapes across the API, each
        // shape gets its own suffixed component name.
        const existingForName = Object.keys(sharedParameters).filter(
            (n) => n === param.name || n.startsWith(`${param.name}_`)
        );
        const componentName = existingForName.length === 0 ? param.name : `${param.name}_${existingForName.length + 1}`;
        sharedParameters[componentName] = param;
        keyToComponentName.set(key, componentName);
    }

    const resolve = (param: JamendoEndpointParameter): string | undefined =>
        keyToComponentName.get(parameterShapeKey(param));

    return { sharedParameters, resolve };
};
