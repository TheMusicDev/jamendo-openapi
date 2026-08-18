# albums/musicinfo

## meta
operationId: listAlbumsMusicinfo
tags: [albums]
deprecated: false
summary: List albums with tags and description
description: Returns the tags list of each album and its description (HTML) if it exists. Adds a `tag` filter parameter (single tag only) on top of all `albums` parent parameters.

## endpoint
GET /albums/musicinfo

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
| order | query | no | array[enum] | relevance-like default | name, id, releasedate, artist_id, artist_name, popularity_total, popularity_month, popularity_week | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more album id |
| name | query | no | string | - | - | exact album name |
| namesearch | query | no | string | - | - | album_name substring search |
| artist_id | query | no | array[string] | - | - | one or more artist id |
| artist_name | query | no | string | - | - | artist name |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | release date range |
| imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | cover px size |
| audioformat | query | no | enum | - | mp32 | audio format for fileurl |
| type | query | no | array[enum] | album+single | single, album | release type filter |
| tag | query | no | string | - | - | filter by one tag; english vocabulary recommended, no synonym support |

## responses
### 200
content-types: json, jsonpretty, xml
Album fields (id, name, releasedate, artist_id, artist_name, image, zip, shorturl, shareurl, zip_allowed) plus nested `musicinfo: { tags: [], description: { en, fr, es, de, pl, it, ru, pt, ja } }`.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/albums/musicinfo/?client_id=your_client_id&format=jsonpretty&artist_name=we+are+fm&type=album+single`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":2},
  "results": [
    {
      "id":"104336","name":"Season One","releasedate":"2011-12-29","artist_id":"376782","artist_name":"WE ARE FM",
      "image":"https://usercontent.jamendo.com?type=album&id=104336&width=300","zip":"https://storage.jamendo.com/download/a104336/mp32/",
      "shorturl":"https://jamen.do/l/a104336","shareurl":"https://www.jamendo.com/list/a104336","zip_allowed":true,
      "musicinfo": {
        "tags": ["energetic","electronic","dance","rock","...(truncated)"],
        "description": {"en":"","fr":"","es":"","de":"","pl":"","it":"","ru":"","pt":"","ja":""}
      }
    }
  ]
}
```

## notes
- `tags` array in live examples has heavy duplication (same tag repeated per matched sub-attribute) — confirm actual dedup behavior against live API in Step 3.
