# users/artists

## meta
operationId: listUserFanArtists
tags: [users]
deprecated: false
summary: List artists a user is a fan of
description: Given a user, returns the Jamendo artists they've become a fan of. Currently `fan` is the only user-artist relation type; the `relation` parameter and `relations` field are forward-looking for future relation types. `updatedate` is the date the relation was last established (i.e. when the user became a fan).

## endpoint
GET /users/artists

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
| artist_id | query | no | array[integer] | - | - | one or more artist id |
| relation | query | no | array[enum] | fan | fan | relation type filter; only `fan` exists today |

## responses
### 200
content-types: json, jsonpretty, xml
User fields (name, dispname, id, lang, creationdate, image) plus nested `artists: []`, each: id, name, image, joindate, updatedate, relations (object, e.g. `{fan: "1"}`).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/users/artists/?client_id=your_client_id&format=jsonpretty&limit=3&name=claudod`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {
      "name":"claudod","dispname":"claudod","id":"972174","lang":"en","creationdate":"2010-10-17","image":"https://images.jamendo.com/users/s972/972174/covers/1.50.jpg",
      "artists": [
        {"id":"104","name":"Tryad","image":"https://images.jamendo.com/artists/s0/104/covers/1.200.jpg?t=1470326207","joindate":"2005-04-13","updatedate":"2013-09-09 12:01:44","relations":{"fan":"1"}},
        {"...(truncated)":"see live response, 3 more artists in sample"}
      ]
    }
  ]
}
```

## notes
-
