# users/albums

## meta
operationId: listUserMyAlbums
tags: [users]
deprecated: false
summary: List albums a user has added to "myalbums"
description: Given a user, returns Jamendo albums added to their "myalbums" collection. Currently `myalbums` is the only user-album relation type; `relation` param and `relations` field are forward-looking. `updatedate` is the date the album was added to myalbums.

## endpoint
GET /users/albums

## auth
apikey_auth
(one of id, access_token, or name is required in addition to client_id)

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| format | query | no | string | json | xml, json, jsonpretty | response format |
| callback | query | no | string | - | - | JSONP callback wrapper |
| offset | query | no | integer | - | - | pagination offset |
| limit | query | no | string | 10 | max 200, or "all" (capped 200) | page size |
| order | query | no | array[enum] | - | updatedate | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | conditionally | array[integer] | - | - | one or more user id |
| access_token | query | conditionally | string | - | - | OAuth2 access token |
| name | query | conditionally | string | - | - | one or more user names |
| imagesize | query | no | enum | - | 30, 50, 100 | user avatar px size |
| album_id | query | no | array[integer] | - | - | one or more album id |
| album_imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | album cover px size |
| relation | query | no | array[enum] | myalbums | myalbums | relation type filter; only `myalbums` exists today |

## responses
### 200
content-types: json, jsonpretty, xml
User fields (name, dispname, id, lang, creationdate, image) plus nested `albums: []`, each: id, name, releasedate, artist_id, artist_name, updatedate, image, relations (object, e.g. `{myalbums: "1"}`).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/users/albums/?client_id=your_client_id&format=jsonpretty&limit=3&name=claudod`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "name":"claudod","dispname":"claudod","id":"972174","lang":"en","creationdate":"2010-10-17","image":"https://images.jamendo.com/users/s972/972174/covers/1.50.jpg",
      "albums": [
        {"id":"2225","name":"Increase the Dosage","releasedate":"2006-06-20","artist_id":"2278","artist_name":"revolutionvoid","updatedate":"2010-12-19 16:25:12","image":"https://images.jamendo.com/albums/s2/2225/covers/1.200.jpg","relations":{"myalbums":"1"}},
        {"...(truncated)":"see live response, 3 more albums in sample"}
      ]
    }
  ]
}
```

## notes
-
