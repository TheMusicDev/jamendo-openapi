# artists/tracks

## meta
operationId: listArtistTracks
tags: [artists]
deprecated: false
summary: List artists with their tracks
description: Returns each artist's tracks as a subentity, reorderable/filterable by basic parameters. Use `track_type` to select singles, album tracks, or both — default is albumtrack only, since singles leave all `album_*` fields empty.

## endpoint
GET /artists/tracks

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
| order | query | no | array[enum] | relevance-like default | name, id, joindate, popularity_total, popularity_month, popularity_week, track_name, track_id, track_releasedate | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more artist id |
| name | query | no | string | - | - | exact artist name |
| namesearch | query | no | string | - | - | artist_name substring search |
| hasimage | query | no | enum | - | true, 1 | only artists with an image |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | artist join-date range |
| track_id | query | no | array[integer] | - | - | one or more track id |
| track_name | query | no | string | - | - | track name |
| track_type | query | no | array[enum] | albumtrack | single, albumtrack | track type filter |
| album_datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | album creation date range |
| album_id | query | no | array[string] | - | - | one or more album id |
| album_name | query | no | string | - | - | album name |
| imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | cover px size |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for track `audio` field |
| audiodlformat | query | no | enum | audioformat's value, or mp32 | mp31, mp32, ogg, flac | audio download format for `audiodownload` |

## responses
### 200
content-types: json, jsonpretty, xml
Artist fields (id, name, website, joindate, image) plus nested `tracks: []`, each: album_id, album_name, id, name, duration, releasedate, license_ccurl, album_image, image, audio (url), audiodownload (url), audiodownload_allowed (bool).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/artists/tracks/?client_id=your_client_id&format=jsonpretty&order=track_name_desc&name=we+are+fm&album_datebetween=0000-00-00_2012-01-01`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "id":"376782","name":"WE ARE FM","website":"https://www.facebook.com/wearefm","joindate":"2011-12-29",
      "image":"https://usercontent.jamendo.com?type=artist&id=376782&width=300",
      "tracks": [
        {"album_id":"104336","album_name":"Season One","id":"887209","name":"Scene 5","duration":"325","releasedate":"2011-12-29","license_ccurl":"http://creativecommons.org/licenses/by-nc-sa/3.0/","album_image":"...","image":"...","audio":"https://prod-1.storage.jamendo.com/?trackid=887209&format=mp31&from=app-devsite","audiodownload":"https://prod-1.storage.jamendo.com/download/track/887209/mp31/","audiodownload_allowed":true},
        {"...(truncated)":"see live response, 9 more tracks in sample"}
      ]
    }
  ]
}
```

## notes
-
