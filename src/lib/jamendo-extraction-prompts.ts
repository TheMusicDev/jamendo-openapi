const JSON_ONLY_INSTRUCTION =
    'You must respond with ONLY a single valid JSON object matching the exact shape below. ' +
    'No markdown code fences, no explanations, no bullet points, no prose before or after the JSON.';

export const ENDPOINT_SYSTEM_PROMPT = `${JSON_ONLY_INSTRUCTION}

{
  "operationId": string,               // camelCase, e.g. "listTracks", "getTrackFile"
  "method": "GET" | "POST",
  "path": string,                      // e.g. "/tracks", "/setuser/favorite" -- NEVER include a version prefix like "/v3.0"
  "authType": "apikey" | "oauth2" | "none",
  "summary": string,                   // one line
  "description": string,               // longer, include any caveats (e.g. "empty for singles")
  "parameters": [
    { "name": string, "in": "query" | "path", "required": boolean, "type": string,
      "enumValues": string[] | null, "defaultValue": string | null, "description": string }
  ],
  "requestBody": [
    { "name": string, "in": "query" | "path", "required": boolean, "type": string,
      "enumValues": string[] | null, "defaultValue": string | null, "description": string }
  ],                                   // empty array if this is a GET / has no body
  "responseFields": [
    { "name": string, "type": string, "nullable": boolean, "description": string }
  ],
  "notes": string[]                    // gotchas, conditional field behavior, cross-references
}`;

export const GLOBAL_CONFIG_SYSTEM_PROMPT = `${JSON_ONLY_INSTRUCTION}

{
  "oauth2": {
    "authorizationUrl": string,        // the OAuth2 authorize endpoint URL
    "tokenUrl": string,                // the OAuth2 grant/token endpoint URL
    "scopes": string[]                 // e.g. ["music"]
  },
  "envelope": {
    "headerFields": string[],          // field names inside the "headers" object of every response
    "resultsFieldName": string         // usually "results"
  },
  "errorFields": string[]              // field names present in an error response
}`;

export const endpointUserPrompt = (markdown: string): string =>
    `Extract structured API endpoint info from this Jamendo API documentation page:\n\n${markdown}`;

export const globalConfigUserPrompt = (markdown: string): string =>
    `Extract the OAuth2 config, response envelope shape, and error shape from these Jamendo API docs:\n\n${markdown}`;
