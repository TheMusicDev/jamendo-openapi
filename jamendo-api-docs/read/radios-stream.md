# radios/stream

## meta
operationId: getRadioStream
tags: [radios]
deprecated: false
summary: Get a radio's stream URL and currently playing track
description: 'WARNING (per official docs): the returned stream link "is not more working, and it could be never fixed". Given a radio id or name, returns the streaming URL, a `playingnow` object describing the currently streamed track, and a `callmeback` value indicating in how many ms the current track will finish and the next one starts.'

## endpoint
GET /radios/stream

## auth
apikey_auth
(one of id or name is required in addition to client_id)

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | conditionally | integer | - | - | a radio id (id or name required) |
| type | query | no | enum | www | www, pro | radio type filter |
| name | query | conditionally | string | - | - | radio name (id or name required) |
| imagesize | query | no | enum | - | 150, 30 | radio image px size |
| track_imagesize | query | no | enum/integer | - | - | track cover px size (docs table malformed — Type column repeats Description; treat as the standard imagesize-style enum) |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, name, dispname, type, image, stream (url — per official docs, currently non-functional), playingnow (object: track_id, artist_id, album_id, album_name, track_name, track_image, artist_name), callmeback.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/radios/stream/?client_id=your_client_id&format=jsonpretty&name=rock`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "id":3,"name":"rock","dispname":"Rock Radio","type":"www","image":"https://images.jamendo.com/new_jamendo_radios/rock150.jpg",
      "stream":"https://streaming.jamendo.com/JamRock",
      "playingnow": {"track_id":0,"artist_id":0,"album_id":0,"album_name":"","track_name":"","track_image":"","artist_name":""},
      "callmeback":""
    }
  ]
}
```

## notes
- **Official docs state the stream link is broken and may never be fixed.** Model the schema as documented, but flag this endpoint as unreliable/possibly-dead in the generated spec's description field. Confirm actual behavior in Step 3/4 before shipping v1 if this matters to consumers.
- `track_imagesize` param row was malformed in source docs (Type column duplicates Description).
