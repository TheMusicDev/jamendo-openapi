# tracks

## meta
operationId: listTracks
tags: [tracks]
deprecated: false
summary: List tracks
description: Track is the king entity in Jamendo — this is the main, most flexible read method. Unlike some other API frameworks (Musicbrainz, Echonest), songs and tracks are the same entity here; a future "track version" feature may allow e.g. instrumental versions. Since 2015, tracks can exist with no album ("singles") — `type` selects single, albumtrack, or both (default albumtrack only). The `include` parameter appends extra fields not returned by default: licenses, musicinfo, stats, lyrics. `order` supports many sort/boost combinations for charts and discovery; using a non-relevance `order` as the first sort loses search relevance — use `boost` instead to blend relevance with a rating signal.

## endpoint
GET /tracks

## auth
apikey_auth

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper (json + GET only) |
| offset | query | no | integer | - | - | pagination offset |
| limit | query | no | string | 10 | max 200, or "all" (capped 200) | page size |
| order | query | no | array[enum] | relevance | relevance, buzzrate, downloads_week, downloads_month, downloads_total, listens_week, listens_month, listens_total, popularity_week, popularity_month, popularity_total, name, album_name, artist_name, releasedate, duration, id | sort field(s); suffix _asc/_desc; rating orders default+force desc |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more track id |
| name | query | no | string | - | - | exact track name |
| namesearch | query | no | string | - | - | track_name substring search, UTF-8 |
| type | query | no | array[enum] | albumtrack | single, albumtrack | track type filter |
| album_id | query | no | array[integer] | - | - | one or more album id |
| album_name | query | no | string | - | - | album name |
| artist_id | query | no | array[integer] | - | - | one or more artist id |
| artist_name | query | no | string | - | - | artist name |
| content_id_free | query | no | boolean | - | - | Content ID free filter |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | release date range, both bounds required |
| featured | query | no | enum | - | true, 1 | featured (Jamendo-team-selected) tracks only |
| imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | cover px size |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for `audio` field |
| audiodlformat | query | no | enum | audioformat's value, or mp32 | mp31, mp32, ogg, flac | audio download format for `audiodownload` |
| tags | query | no | array[string] | - | - | boolean AND tag search (genre/instrument/theme/nc); some synonym/language mapping, english recommended |
| fuzzytags | query | no | array[string] | - | - | fuzzy OR tag search |
| acousticelectric | query | no | enum | - | acoustic, electric | acoustic vs electric filter |
| vocalinstrumental | query | no | enum | - | vocal, instrumental | vocal vs instrumental filter |
| gender | query | no | enum | - | male, female | singer gender (vocal tracks only) |
| speed | query | no | array[enum] | - | verylow, low, medium, high, veryhigh | track speed/tempo bucket |
| lang | query | no | array[string] | - | 2-letter code | lyrics language |
| durationbetween | query | no | string | - | int_int (seconds) | track duration range, both bounds required |
| xartist | query | no | string | - | - | select tracks similar to a named non-Jamendo artist |
| search | query | no | string | - | - | free text search across track/album/artist name and tags |
| prolicensing | query | no | boolean | - | - | only tracks in the single-track commercial licensing program |
| probackground | query | no | boolean | - | - | only tracks in the background-music commercial program |
| ccsa | query | no | boolean | - | - | Creative Commons Share Alike filter |
| ccnd | query | no | boolean | - | - | Creative Commons No Derivs filter |
| ccnc | query | no | boolean | - | - | Creative Commons Non Commercial filter |
| include | query | no | array[enum] | - | licenses, musicinfo, stats, lyrics | append extra fields not returned by default |
| groupby | query | no | enum | - | artist_id, album_id | aggregate results, one track per artist/album (use with order for charts) |
| boost | query | no | enum | popularity_month (implicit, lower intensity) | buzzrate, downloads_week, downloads_month, downloads_total, listens_week, listens_month, listens_total, popularity_week, popularity_month, popularity_total | blend a rating signal into relevance-ordered search without losing relevance |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, name, duration, artist_id, artist_name, artist_idstr, album_name, album_id, license_ccurl, position, releasedate, album_image, audio (url), audiodownload (url), prourl, shorturl, shareurl, waveform (nested peaks array), image, audiodownload_allowed (bool), content_id_free (bool). With `include=musicinfo`: nested `musicinfo` object (vocalinstrumental, lang, gender, acousticelectric, speed, tags: {genres, instruments, vartags}).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/tracks/?client_id=your_client_id&format=jsonpretty&limit=2&fuzzytags=groove+rock&speed=high+veryhigh&include=musicinfo&groupby=artist_id`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":2},
  "results": [
    {
      "id":"1848357","name":"mañana será tarde","duration":272,"artist_id":"421168","artist_name":"fankel","artist_idstr":"fankel",
      "album_name":"mañana será tarde","album_id":"368084","license_ccurl":"http://creativecommons.org/licenses/by-nc-nd/3.0/",
      "position":1,"releasedate":"2021-04-11","album_image":"https://usercontent.jamendo.com?type=album&id=368084&width=300&trackid=1848357",
      "audio":"https://prod-1.storage.jamendo.com/?trackid=1848357&format=mp31&from=app-devsite",
      "audiodownload":"https://prod-1.storage.jamendo.com/download/track/1848357/mp32/",
      "prourl":"","shorturl":"https://jamen.do/t/1848357","shareurl":"https://www.jamendo.com/track/1848357",
      "waveform":"{\"peaks\":[0,0,0,0,30,39,33,"..."(truncated, hundreds of values)]}",
      "image":"https://usercontent.jamendo.com?type=album&id=368084&width=300&trackid=1848357",
      "musicinfo": {"vocalinstrumental":"instrumental","lang":"","gender":"","acousticelectric":"electric","speed":"high",
        "tags": {"genres":["rock"],"instruments":["bass","guitar"],"vartags":["groovy","happy"]}},
      "audiodownload_allowed":true,"content_id_free":false
    },
    {"...(truncated)":"see live response, 1 more track in sample"}
  ]
}
```

## notes
- `waveform.peaks` is a large numeric array (hundreds of values per track) — truncated here for brevity; full fidelity not needed for the OpenAPI schema, model it as `type: array, items: {type: integer}`.
- `audiodownload` becomes an empty string when `audiodownload_allowed` is false (since Aug 2020).
