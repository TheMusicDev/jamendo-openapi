# playlists

## meta
operationId: listPlaylists
tags: [playlists]
deprecated: false
summary: List playlists
description: A playlist is a dynamic collection of tracks; the owning user can modify/delete/publish/mask it at any time. Selects playlists by common filters. `zip` is the URL for the playlist's tracks as a high-quality mp3 zip — the zip may contain fewer tracks than the playlist actually has (server-side ~100-track internal limit).

## endpoint
GET /playlists

## auth
apikey_auth
(accepts but does not require access_token — see auth notes below)

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| offset | query | no | integer | - | - | pagination offset |
| limit | query | no | string | 10 | max 200, or "all" (capped 200) | page size |
| order | query | no | array[enum] | relevance-like default | name, id, creationdate | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more playlist id |
| name | query | no | string | - | - | exact playlist name |
| namesearch | query | no | string | - | - | playlist_name substring search |
| user_id | query | no | array[integer] | - | - | one or more author id (no access_token required) |
| access_token | query | no | string | - | - | OAuth2 access token, to scope results to a specific authenticated Jamendo user |
| user_name | query | no | string | - | - | author username |
| datebetween | query | no | string | - | (docs say "must be integer" — likely a doc typo for date format) | creation date range, both bounds required |
| audioformat | query | no | enum | - | mp32 | audio format for fileurl; only mp32 exists today |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, name, creationdate, user_id, user_name, zip (url), shorturl, shareurl.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/playlists/?client_id=your_client_id&format=jsonpretty&namesearch=cool&datebetween=2012-01-01_2012-02-01`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":9},
  "results": [
    {"id":"218277","name":"some cool stuff","creationdate":"2012-01-04","user_id":"1293438","user_name":"hywayace","zip":"https://storage.jamendo.com/download/p218277/mp32/","shorturl":"https://jamen.do/l/p218277","shareurl":"https://www.jamendo.com/list/p218277"},
    {"...(truncated)":"see live response, 8 more playlists in sample"}
  ]
}
```

## notes
- Source doc's `datebetween` Type column literally says "must be both integer" — almost certainly a copy-paste error from another page's date-range param (should be yyyy-mm-dd like every other entity's datebetween). Confirm against live API in Step 3.
