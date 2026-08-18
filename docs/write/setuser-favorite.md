# setuser/favorite

## meta
operationId: setUserFavorite
tags: [setuser]
deprecated: false
summary: Add a track to the authenticated user's favorites
description: Adds the given track to the user's favorites (Jamendo.com's "Favorites" playlist; surfaces via `/users/tracks?relation=favorite` — source docs typo this as "preferite"). If the track doesn't exist, no error is raised — it simply never appears in read requests.

## endpoint
POST /setuser/favorite

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
| track_id | yes | integer | - | - | track to add to favorites |

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
curl -X POST -d client_id="your_client_id" -d format="jsonpretty" -d access_token="your_access_token" -d track_id="10" "https://api.jamendo.com/v3.0/setuser/favorite/"
```
response:
```json
{"headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":0}, "results": []}
```

## notes
- Same POST-body-vs-query-string ambiguity as setuser/fan — confirm in Step 3/4.
- Silent no-op on invalid track_id.
