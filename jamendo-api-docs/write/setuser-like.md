# setuser/like

## meta
operationId: setUserLike
tags: [setuser]
deprecated: false
summary: Like a track as the authenticated user
description: Makes the authenticated user like the given track (surfaces via `/users/tracks?relation=like`). If the track doesn't exist, no error is raised — it simply never appears in read requests.

## endpoint
POST /setuser/like

## auth
oauth2
scopes: [music]

## request_body
| name | required | type | default | enum | description |
|------|----------|------|---------|-------|-------------|
| client_id | yes | string | - | - | app client id |
| format | no | string | json | xml, json, jsonpretty | response format |
| fullcount | no | boolean | false | - | adds results_fullcount to headers |
| access_token | yes | string | - | - | OAuth2 access token with `music` scope |
| track_id | yes | integer | - | - | track to like |

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| (none — all fields sent as POST body per docs' curl sample) | | | | | | |

## responses
### 200
content-types: json, jsonpretty, xml
Empty `results: []` on success.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request:
```
curl -X POST -d client_id="your_client_id" -d format="jsonpretty" -d access_token="your_access_token" -d track_id="10" "https://api.jamendo.com/v3.0/setuser/like/"
```
response:
```json
{"headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":0}, "results": []}
```

## notes
- Same POST-body-vs-query-string ambiguity as setuser/fan — confirm in Step 3/4.
- Silent no-op on invalid track_id.
