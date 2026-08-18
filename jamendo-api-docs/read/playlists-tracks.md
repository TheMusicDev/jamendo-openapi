# playlists/tracks

## meta
operationId: listPlaylistTracks
tags: [playlists]
deprecated: false
summary: List playlists with their tracks
description: Returns playlist entities with the list of belonging tracks. `track_type` selects singles, album tracks, or both — default albumtrack only, since singles leave album_* fields empty.

## endpoint
GET /playlists/tracks

## auth
apikey_auth
(one of id, name, user_id, access_token, or user_name is required in addition to client_id)

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| offset | query | no | integer | - | - | pagination offset |
| limit | query | no | string | 10 | max 200, or "all" (capped 200) | page size |
| order | query | no | array[enum] | relevance-like default | name, id, creationdate, track_id, track_name, track_added_date, track_position | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | conditionally | array[integer] | - | - | one or more playlist id (see required-parameters note) |
| name | query | conditionally | string | - | - | exact playlist name |
| namesearch | query | no | string | - | - | playlist_name substring search |
| user_id | query | conditionally | array[integer] | - | - | one or more author id |
| access_token | query | conditionally | string | - | - | OAuth2 access token |
| user_name | query | conditionally | string | - | - | author username |
| datebetween | query | no | string | - | (docs say integer — likely typo, see notes) | creation date range |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for track `audio` field |
| track_type | query | no | array[enum] | albumtrack | single, albumtrack | track type filter |
| imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | cover px size |
| positionbetween | query | no | string | - | int_int | filter by track position range in the playlist, both bounds required |
| audiodlformat | query | no | enum | audioformat's value, or mp32 | mp31, mp32, ogg, flac | audio download format for `audiodownload` |

## responses
### 200
content-types: json, jsonpretty, xml
Playlist fields plus nested tracks array (same track shape as albums/tracks: id, name, duration, license_ccurl, audio, audiodownload, audiodownload_allowed, etc).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=your_client_id&format=jsonpretty&limit=2&name=Instrumental&track_type=albumtrack`
response:
```json
{"headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":0}, "results": []}
```

## notes
- Live example returned zero results (name filter didn't match any playlist) — full result shape not visible in the docs sample; infer field shape from albums/tracks and artists/tracks track objects, confirm exact shape in Step 3/4.
- `datebetween` type description says "must be both integer" — same likely doc typo noted in playlists.md.
