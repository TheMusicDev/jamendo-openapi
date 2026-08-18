# albums

## meta
operationId: listAlbums
tags: [albums]
deprecated: false
summary: List albums
description: Select and filter album entities, returning main album fields. Albums have historically been Jamendo's central entity though tracks are now primary. Since 2015, tracks with no album ("singles") are also possible — see the tracks entity. `zip` field is the URL for downloading the album's tracks as a zip (mp3 192kbps); download directly via albums/file too. `zip_allowed` (added Feb 2021) indicates whether the artist permits zip download — `zip` becomes empty when false.

## endpoint
GET /albums

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
| order | query | no | array[enum] | relevance-like default | name, id, releasedate, artist_id, artist_name, popularity_total, popularity_month, popularity_week | sort field(s); suffix _asc/_desc; popularity fields default+force desc |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers; perf cost |
| id | query | no | array[integer] | - | - | one or more album id |
| name | query | no | string | - | - | exact album name |
| namesearch | query | no | string | - | - | album_name substring search |
| artist_id | query | no | array[string] | - | - | one or more artist id |
| artist_name | query | no | string | - | - | artist name |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | release date range, both bounds required |
| imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | cover px size |
| audioformat | query | no | enum | - | mp32 | audio format for `fileurl`; only mp32 exists today |
| type | query | no | array[enum] | album+single | single, album | release type filter |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, name, releasedate, artist_id, artist_name, image (url), zip (url), zip_allowed (bool), shorturl, shareurl.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/albums/?client_id=your_client_id&format=jsonpretty&artist_name=we+are+fm&type=album+single`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":2},
  "results": [
    {"id":"104336","name":"Season One","releasedate":"2011-12-29","artist_id":"376782","artist_name":"WE ARE FM","image":"https://usercontent.jamendo.com?type=album&id=104336&width=300","zip":"https://storage.jamendo.com/download/a104336/mp32/","shorturl":"https://jamen.do/l/a104336","shareurl":"https://www.jamendo.com/list/a104336","zip_allowed":true}
  ]
}
```

## notes
- `zip` becomes an empty string when `zip_allowed` is false (since Apr 2022).
