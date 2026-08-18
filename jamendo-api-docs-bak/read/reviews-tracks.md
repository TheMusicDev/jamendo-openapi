# reviews/tracks

## meta
operationId: listTrackReviews
tags: [reviews]
deprecated: false
summary: List track reviews
description: Filters and browses track reviews (a Jamendo.com feature since May 2012). Key returned fields beyond filter params: agreecnt, score, text, title. `track_audiodownload_allowed` (added Feb 2021) controls whether `track_audiodownload` is populated.

## endpoint
GET /reviews/tracks

## auth
apikey_auth
(accepts but does not require access_token)

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| offset | query | no | integer | - | - | pagination offset |
| limit | query | no | string | 10 | max 200, or "all" (capped 200) | page size |
| order | query | no | array[enum] | relevance-like default | addeddate, score, id | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more review id |
| lang | query | no | string | - | 2-letter code | review language |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | review date range |
| user_id | query | no | integer | - | - | filter by reviewer user id |
| access_token | query | no | string | - | - | OAuth2 access token to scope to a specific user |
| hasscore | query | no | boolean | - | - | only reviews with/without a score |
| track_id | query | no | array[integer] | - | - | one or more track id |
| album_id | query | no | integer | - | - | filter by album id |
| artist_id | query | no | integer | - | - | filter by artist id |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for `track_audio` field |
| audiodlformat | query | no | enum | audioformat's value, or mp32 | mp31, mp32, ogg, flac | audio download format for `track_audiodownload` |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, title, text, dateadded, agreecnt, lang, user_id, user_name, user_dispname, score, track_id, track_name, album_id, artist_id, track_audiodownload_allowed (bool), track_license_ccurl, track_audio (url), track_audiodownload (url).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/reviews/tracks/?client_id=your_client_id&format=jsonpretty&limit=2&order=score_desc+addeddate_desc&lang=en`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":2},
  "results": [
    {"id":"533416","title":"","text":"Hi","dateadded":"2023-12-09","agreecnt":"5","lang":"en","user_id":"8849127","user_name":"s12384657@students.duvalschools.org","user_dispname":"Elektra_L","score":"10","track_id":"2133898","track_name":"One Gift Shawty (For Christmas)","album_id":"549522","artist_id":"484695","track_audiodownload_allowed":true,"track_license_ccurl":"http://creativecommons.org/licenses/by-nc-nd/3.0/","track_audio":"https://prod-1.storage.jamendo.com/?trackid=2133898&format=mp31&from=app-devsite","track_audiodownload":"https://prod-1.storage.jamendo.com/download/track/2133898/mp32/"},
    {"id":"532432","title":"","text":"Love it","dateadded":"2023-07-15","agreecnt":"0","lang":"en","user_id":"8678316","user_name":"jonze785@gmail.com","user_dispname":"jonze785","score":"10","track_id":"2026253","track_name":"Moon Reflections","album_id":"519570","artist_id":"485950","track_audiodownload_allowed":false,"track_license_ccurl":"http://creativecommons.org/licenses/by-nc-nd/3.0/","track_audio":"","track_audiodownload":""}
  ]
}
```

## notes
- Live example includes `user_name` values that look like real email addresses — treat `user_name` as potentially PII in the schema description; irrelevant to spec shape but worth flagging for anyone consuming this data.
- Source doc's canonical URL link target was malformed (pointed at `setuser/tracks`) — confirmed correct path via page `sourceURL` metadata.
