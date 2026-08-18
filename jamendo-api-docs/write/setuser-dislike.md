# setuser/dislike

## meta
operationId: setUserDislike
tags: [setuser]
deprecated: false
summary: Dislike a track as the authenticated user
description: Counterpart to setuser/like — lets the authenticated user dislike a track, similar to like/dislike patterns on other social platforms.

## endpoint
POST /setuser/dislike

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
| track_id | yes | integer | - | - | track to dislike |

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
curl -X POST -d client_id="your_client_id" -d format="jsonpretty" -d access_token="your_access_token" -d track_id="10" "https://api.jamendo.com/v3.0/setuser/dislike/"
```
response:
```json
{"headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":0}, "results": []}
```

## notes
- Same POST-body-vs-query-string ambiguity as setuser/fan — confirm in Step 3/4.
- Unlike setuser/like's read-side exposure (`/users/tracks?relation=like`), no corresponding `dislike` relation is documented on `/users/tracks` — confirm whether disliked tracks are queryable anywhere, or whether this is write-only with no read surface.
