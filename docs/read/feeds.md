# feeds

## meta
operationId: listFeeds
tags: [feeds]
deprecated: false
summary: List editorial feeds
description: Returns the editorial feeds shown on the jamendo.com homepage. Every feed has a start/end date; only active feeds are returned. Every feed includes image URLs at 4 fixed sizes (996x350, 315x111, 600x211, 470x165). Default and recommended order is `position_asc`.

## endpoint
GET /feeds

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
| order | query | no | array[enum] | position_asc | id, date_start, date_end, position | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | integer | - | - | select by id |
| lang | query | no | enum | - | en, fr, es, de, pl, it, ru, pt | filter to feeds with text in this language (other-language text still returned in the document) |
| target | query | no | enum | all | all, logged, notlogged | audience filter; logged/notlogged not mutually exclusive |
| type | query | no | array[enum] | - | album, artist, playlist, track, news, interview, contest, video, update | feed type; album/track/artist/playlist types populate `joinid` with the related entity's id |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, title (per-lang object), link, position, lang (array of language codes this feed is translated in), date_start, date_end, text (per-lang object), type, joinid, subtitle (array), target, images (object keyed by size: size996_350, size315_111, size600_211, size470_165).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/feeds/?client_id=your_client_id&format=jsonpretty&limit=1&order=id_desc`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "id":"337",
      "title": {"en":"Say hello to the brand new Jamendo Music app!","fr":"...(truncated)"},
      "link":"https://itunes.apple.com/app/jamendo/id319042726?mt=8",
      "position":"0",
      "lang":["en","fr","it","es","de","pl","ru","pt"],
      "date_start":"2016-04-06 00:00:00","date_end":"2200-01-01 00:00:00",
      "text": {"en":"It's a whole new version...(truncated)"},
      "type":"news","joinid":"0","subtitle":[],"target":"all",
      "images": {"size996_350":"https://images.jamendo.com/feeds/37/337.996_350.jpg?du=...","size315_111":"...","size600_211":"...","size470_165":"..."}
    }
  ]
}
```

## notes
-
