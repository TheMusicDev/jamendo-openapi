# autocomplete

## meta
operationId: autocomplete
tags: [autocomplete]
deprecated: false
summary: Autocomplete tracks, albums, artists, and tags by name prefix
description: Builds an autocomplete over Jamendo tracks, albums, artists, and tags. By default searches all four entities; narrow with `entity`. `prefix` is matched as a name prefix (SQL `WHERE name LIKE 'prefix%' GROUP BY entity, name ORDER BY name, COUNT(*) DESC`), minimum length 2. No entity id is returned — a follow-up lookup must go by name, which is not unique.

## endpoint
GET /autocomplete

## auth
apikey_auth

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| limit | query | no | string | - | - | results per entity |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| prefix | query | yes | string | - | - | name prefix to search, min length 2 |
| entity | query | no | array[enum] | all four | artists, albums, tracks, tags | which entities to search |
| matchcount | query | no | boolean | false | - | include match count per result; tags matchcount reflects tracks only, not albums/artists |

## responses
### 200
content-types: json, jsonpretty, xml
`results` is an object keyed by entity (not an array): `{ tags: [{match, count}], artists: [...], tracks: [...], albums: [...] }` — only requested entities present if `entity` filter used.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/autocomplete/?client_id=your_client_id&format=jsonpretty&limit=3&prefix=something&matchcount=1`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":4},
  "results": {
    "tags": [{"match":"something","count":1}, {"match":"somethingkindofvocalthingy","count":1}, {"match":"somethingonitisoff","count":1}],
    "artists": [{"match":"something","count":2}, {"match":"something else","count":1}, {"match":"somethingelse","count":1}],
    "tracks": [{"match":"something","count":28}, {"match":"somethingelse","count":15}, {"...(truncated)":"see live response"}],
    "albums": [{"match":"something","count":50}, {"...(truncated)":"see live response"}]
  }
}
```

## notes
- Response `results` shape (keyed object, not array) differs from every other read endpoint's `JamendoResponse<T[]>` envelope — do NOT reuse the shared envelope schema for this endpoint; model its `results` field specially.
