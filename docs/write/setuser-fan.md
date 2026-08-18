# setuser/fan

## meta
operationId: setUserFan
tags: [setuser]
deprecated: false
summary: Mark the authenticated user as a fan of an artist
description: Makes the user identified by the access_token a fan of the artist identified by `artist_id` (surfaces via `/users/artists?relation=fan`). If the artist doesn't exist, no error is raised — the artist simply never appears in read requests.

## endpoint
POST /setuser/fan

## auth
oauth2
scopes: [music]

## request_body
| name | required | type | default | enum | description |
|------|----------|------|---------|-------|-------------|
| client_id | yes | string | - | - | app client id |
| format | no | string | json | xml, json, jsonpretty | response format |
| fullcount | no | boolean | false | - | adds results_fullcount to headers |
| access_token | yes | string | - | - | OAuth2 access token with `music` scope, for the user being updated |
| artist_id | yes | integer | - | - | artist to become a fan of |

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| (none — all fields sent as POST body per docs' curl sample using -d) | | | | | | |

## responses
### 200
content-types: json, jsonpretty, xml
Empty `results: []` on success — the response only confirms via `headers.status`/`code`.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request:
```
curl -X POST -d client_id="your_client_id" -d format="jsonpretty" -d access_token="your_access_token" -d artist_id="6" "https://api.jamendo.com/v3.0/setuser/fan/"
```
response:
```json
{"headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":0}, "results": []}
```

## notes
- Source doc's sample uses `curl -X POST -d ...` (form-encoded POST body), not query-string params — despite the shared parameter table style used across the docs. Confirm in Step 3/4 whether params are strictly required as POST body (`application/x-www-form-urlencoded`) vs also accepted as query string.
- Silent no-op on invalid artist_id (no error raised) — worth a note in the generated spec's operation description so client authors don't assume a 200 means the artist existed.
