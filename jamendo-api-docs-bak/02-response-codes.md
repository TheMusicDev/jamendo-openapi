# Response Codes

Source: https://developer.jamendo.com/v3.0/response-codes

## headers shape

Every response document contains a `headers` object with 4 fields:

| field | description |
|-------|-------------|
| status | `"success"` or `"failed"` |
| code | `0` on success, non-zero error id on failure (see table below) |
| error_message | error type + contextual description, empty on success |
| warnings | warning messages if any; warnings do not fail the request |

## error code table

| code | type | description |
|------|------|-------------|
| 0 | Success | Success (or success with warning) |
| 1 | Exception | Generic unidentified error |
| 2 | Http Method | HTTP method not supported for this method |
| 3 | Type | A parameter value doesn't respect type/range/format requirements |
| 4 | Required Parameter | A required parameter was missing or empty |
| 5 | Invalid Client Id | client_id doesn't exist or can't be validated |
| 6 | Rate Limit Exceeded | App or IP exceeded permitted rate limit |
| 7 | Method Not Found | entity/subentity path doesn't exist |
| 8 | Needed Parameter | A conditionally-required parameter missing or invalid |
| 9 | Format | Unknown output format requested |
| 10 | Entry Point | IP and/or port not recognized as a valid entry point |
| 11 | Suspended Application | Client application suspended (illegal usage, etc) |
| 12 | Access Token | Invalid access token |
| 13 | Insufficient Scope | Access token lacks required scope |
| 21 | Invalid User | Some user parameter is invalid |
| 22 | Email Already Exist | Email already used by another user |
| 23 | Duplicate Value | Attempted to write/update a value that must be unique |
| 24 | Invalid Playlist | Invalid playlist id |
| 101 | Access Code | Access code invalid, or subscription not active |

## for openapi generation

Shared `Error` schema (used by all endpoints' 4xx/5xx responses):

```yaml
Error:
  type: object
  properties:
    headers:
      type: object
      properties:
        status: { type: string, enum: [success, failed] }
        code: { type: integer }
        error_message: { type: string }
        warnings: { type: string }
    results:
      type: array
      items: {}
```

## notes

- Jamendo returns HTTP 200 with `headers.status: "failed"` for most API-level
  errors rather than a non-200 HTTP status — confirm this against the live
  API in Step 3 (project-plan.md) before locking down `responses` status
  codes in the spec.
