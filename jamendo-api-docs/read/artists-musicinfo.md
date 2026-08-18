# artists/musicinfo

## meta
operationId: listArtistsMusicinfo
tags: [artists]
deprecated: false
summary: List artists with tags and description
description: Returns the tags list of each artist and its description (HTML) if it exists. Adds a `tag` filter parameter (single tag only) on top of all `artists` parent parameters.

## endpoint
GET /artists/musicinfo

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
| order | query | no | array[enum] | relevance-like default | name, id, joindate, popularity_total, popularity_month, popularity_week | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more artist id |
| name | query | no | string | - | - | exact artist name |
| namesearch | query | no | string | - | - | artist_name substring search |
| hasimage | query | no | enum | - | true, 1 | only artists with an image |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | artist join-date range |
| tag | query | no | string | - | - | filter by one tag; english vocabulary recommended, no synonym support |

## responses
### 200
content-types: json, jsonpretty, xml
Artist fields (id, name, website, joindate, image, shorturl, shareurl) plus nested `musicinfo: { tags: [], description: { en, fr, es, de, pl, it, ru, pt, ja } }`.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/artists/musicinfo/?client_id=your_client_id&format=jsonpretty&name=we+are+fm`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "id":"376782","name":"WE ARE FM","website":"https://www.facebook.com/wearefm","joindate":"2011-12-29",
      "image":"https://usercontent.jamendo.com?type=artist&id=376782&width=300","shorturl":"https://jamen.do/a/376782","shareurl":"https://www.jamendo.com/artist/376782",
      "musicinfo": {
        "tags": ["rock","electronic","energetic","electrorock"],
        "description": {"en":"<p>https://www.facebook.com/wearefm</p>","fr":"","es":"","de":"","pl":"","it":"","ru":"","pt":"","ja":""}
      }
    }
  ]
}
```

## notes
- `description.<lang>` may contain raw HTML (e.g. `<p>...</p>`), not plain text.
