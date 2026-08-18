# reviews/albums

## meta
operationId: listAlbumReviews
tags: [reviews]
deprecated: false
summary: List album reviews
description: Filters and browses album reviews. Key returned fields beyond the filter params: agreecnt (agreement count), score (user rating), text (review body), title.

## endpoint
GET /reviews/albums

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
| lang | query | no | string | - | 2-letter code (en, fr, it, ...) | review language |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | review date range |
| user_id | query | no | integer | - | - | filter by reviewer user id |
| access_token | query | no | string | - | - | OAuth2 access token to scope to a specific user |
| hasscore | query | no | boolean | - | - | only reviews with/without a score |
| album_id | query | no | array[integer] | - | - | one or more album id |
| artist_id | query | no | integer | - | - | filter by artist id |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, title, text, dateadded, agreecnt, lang, user_id, user_name, user_dispname, score, album_id, album_name, artist_id.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/reviews/albums/?client_id=your_client_id&format=jsonpretty&limit=2&order=addeddate_asc&lang=en&hasscore=1&artist_id=376782`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":2},
  "results": [
    {"id":"387930","title":"Good album","text":"Hi guys!...(truncated)","dateadded":"2012-02-03","agreecnt":"0","lang":"en","user_id":"592597","user_name":"morganejamendo","user_dispname":"morganejamendo","score":"8","album_id":"104336","album_name":"Season One","artist_id":"376782"},
    {"id":"388939","title":"Awesome!!!!!!","text":"I absolutely love the whole album!!!...(truncated)","dateadded":"2012-02-11","agreecnt":"4","lang":"en","user_id":"485198","user_name":"jem9","user_dispname":"jem9","score":"10","album_id":"104336","album_name":"Season One","artist_id":"376782"}
  ]
}
```

## notes
- Source doc's canonical URL link target was malformed (pointed at a `setuser/albums` href despite being the reviews/albums page) — confirmed correct via page `sourceURL` metadata (`https://developer.jamendo.com/v3.0/reviews/albums`). Path used here is correct.
