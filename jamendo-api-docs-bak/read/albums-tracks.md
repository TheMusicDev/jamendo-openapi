# albums/tracks

## meta
operationId: listAlbumTracks
tags: [albums]
deprecated: false
summary: List albums with their tracks
description: Selects and filters album entities together with their belonging tracks. Returns the same fields as the parent `albums` method, plus a nested `tracks` array with per-track fields.

## endpoint
GET /albums/tracks

## auth
apikey_auth

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| offset | query | no | integer | - | - | pagination offset |
| limit | query | no | string | 10 | max 200, or "all" (capped 200) | page size |
| order | query | no | array[enum] | relevance-like default | name, id, releasedate, artist_id, artist_name, popularity_total, popularity_month, popularity_week, track_id, track_name, track_position | sort field(s); suffix _asc/_desc |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more album id |
| name | query | no | string | - | - | exact album name |
| namesearch | query | no | string | - | - | album_name substring search |
| artist_id | query | no | array[string] | - | - | one or more artist id |
| artist_name | query | no | string | - | - | artist name |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | release date range |
| imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | cover px size |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for track `audio` field |
| type | query | no | array[enum] | album+single | single, album | release type filter |
| track_id | query | no | array[integer] | - | - | one or more track id |
| track_name | query | no | string | - | - | track name |
| audiodlformat | query | no | enum | audioformat's value, or mp32 | mp31, mp32, ogg, flac | audio download format for `audiodownload` field |

## responses
### 200
content-types: json, jsonpretty, xml
Album fields (id, name, releasedate, artist_id, artist_name, image, zip, zip_allowed) plus nested `tracks: []` array, each track: count, id, position, name, duration, license_ccurl, audio (url), audiodownload (url), audiodownload_allowed (bool).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/albums/tracks/?client_id=your_client_id&format=jsonpretty&limit=1&artist_name=we+are+fm&type=album+single`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "id":"104336","name":"Season One","releasedate":"2011-12-29","artist_id":"376782","artist_name":"WE ARE FM",
      "track_id":"887202","image":"https://usercontent.jamendo.com?type=album&id=104336&width=300&trackid=887202",
      "zip":"https://storage.jamendo.com/download/a104336/mp32/","zip_allowed":true,
      "tracks": [
        {"count":"1","id":"887202","position":"10","name":"Press Record","duration":"192","license_ccurl":"http://creativecommons.org/licenses/by-nc-sa/3.0/","audio":"https://prod-1.storage.jamendo.com/?trackid=887202&format=mp31&from=app-devsite","audiodownload":"https://prod-1.storage.jamendo.com/download/track/887202/mp32/","audiodownload_allowed":true},
        {"count":"1","id":"887203","position":"3","name":"No Words (Director's Cut)","duration":"338","...(truncated)":"see live response"}
      ]
    }
  ]
}
```

## notes
-
