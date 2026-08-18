# users/tracks

## meta
operationId: listUserTracks
tags: [users]
deprecated: false
summary: List tracks a user has liked, favorited, or reviewed
description: Given a user, returns Jamendo tracks they've liked, added to favorite, and/or reviewed. `relation` filters which of these to include (default all). `order=rating_desc` sorts by an aggregated rating (review score, with like=8 and favorite=9 as implicit review scores). `order=updatedate` sorts by the latest of like/favorite/review action, exposed on each track as `dateupdated`. `track_type` selects singles, album tracks, or both (default albumtrack only).

## endpoint
GET /users/tracks

## auth
apikey_auth
(one of id or access_token is required in addition to client_id)

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| offset | query | no | integer | - | - | pagination offset |
| limit | query | no | string | 10 | max 200, or "all" (capped 200) | page size |
| order | query | no | array[enum] | - | updatedate, rating | sort field(s); rating = aggregated review/like/favorite score |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | conditionally | integer | - | - | one user id |
| access_token | query | conditionally | string | - | - | OAuth2 access token |
| imagesize | query | no | enum | - | 30, 50, 100 | user avatar px size |
| track_type | query | no | array[enum] | albumtrack | single, albumtrack | track type filter |
| track_id | query | no | array[integer] | - | - | one or more track id |
| artist_id | query | no | array[integer] | - | - | one or more artist id |
| album_id | query | no | array[integer] | - | - | one or more album id |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for track `audio` field |
| audiodlformat | query | no | enum | audioformat's value, or mp32 | mp31, mp32, ogg, flac | audio download format for `audiodownload` |
| album_imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | album cover px size |
| relation | query | no | array[enum] | all | like, favorite, review | relation type filter; "favorite+like" means OR, not AND |

## responses
### 200
content-types: json, jsonpretty, xml
User fields (name, dispname, id, lang, creationdate, avatar_type, avatar) plus nested `tracks: []`, each: id, name, releasedate, artist_id, duration, artist_name, license_ccurl, updatedate, album_image, image, audio (url), audiodownload (url), relations (object: review, favorite, like — numeric scores), audiodownload_allowed (bool).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/users/tracks/?client_id=your_client_id&format=jsonpretty&limit=3&order=rating_desc+updatedate_desc&id=972174`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "name":"claudod","dispname":"claudod","id":"972174","lang":"en","creationdate":"2010-10-17","avatar_type":"uploadedv2","avatar":"jpg","album_id":"49216",
      "tracks": [
        {"id":"391002","name":"Balrog Boogie","releasedate":"2009-07-23","artist_id":"351716","duration":"233","artist_name":"Diablo Swing Orchestra","license_ccurl":"http://creativecommons.org/licenses/by-nc-nd/3.0/","updatedate":"2014-02-18 15:39:55","album_image":"...","image":"...","audio":"https://prod-1.storage.jamendo.com/?trackid=391002&format=mp31&from=app-devsite","audiodownload":"https://prod-1.storage.jamendo.com/download/track/391002/mp32/","relations":{"review":"10","favorite":"0","like":"1"},"audiodownload_allowed":true},
        {"...(truncated)":"see live response, 2 more tracks in sample"}
      ]
    }
  ]
}
```

## notes
- Top-level response includes a stray `album_id` field alongside the user object in the live example — confirm this isn't an artifact of the sample data (a user's own last-viewed album?) versus expected top-level shape in Step 3/4.
