# artists/albums

## meta
operationId: listArtistAlbums
tags: [artists]
deprecated: false
summary: List artists with their albums
description: Displays each artist's albums as a subentity, reorderable/filterable by basic parameters.

## endpoint
GET /artists/albums

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
| order | query | no | array[enum] | relevance-like default | name, id, joindate, popularity_total, popularity_month, popularity_week, album_name, album_id, album_releasedate | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | array[integer] | - | - | one or more artist id |
| name | query | no | string | - | - | exact artist name |
| namesearch | query | no | string | - | - | artist_name substring search |
| hasimage | query | no | enum | - | true, 1 | only artists with an image |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | artist join-date range |
| album_id | query | no | array[string] | - | - | one or more album id |
| album_name | query | no | string | - | - | album name |
| album_datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | album creation date range |
| imagesize | query | no | integer/enum | - | - | album cover px size (docs table malformed here — same enum as other entities: 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600) |

## responses
### 200
content-types: json, jsonpretty, xml
Artist fields (id, name, website, joindate, image) plus nested `albums: []`, each: id, name, releasedate, image.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/artists/albums/?client_id=your_client_id&format=jsonpretty&name=we+are+fm&album_datebetween=0000-00-00_2012-01-01`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "id":"376782","name":"WE ARE FM","website":"https://www.facebook.com/wearefm","joindate":"2011-12-29",
      "image":"https://usercontent.jamendo.com?type=artist&id=376782&width=300",
      "albums": [
        {"id":"104336","name":"Season One","releasedate":"2011-12-29","image":"https://images.jamendo.com/albums/s104/104336/covers/1.200.jpg"}
      ]
    }
  ]
}
```

## notes
- Source doc's `imagesize` param row was malformed (Type column repeats the Description text) — treat as the standard imagesize enum shared across entities; confirm in Step 3/4 (live spot-check) if it diverges.
