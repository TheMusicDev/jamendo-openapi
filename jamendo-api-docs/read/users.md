# users

## meta
operationId: getUser
tags: [users]
deprecated: false
summary: Look up a user
description: Returns main information about a user. Deliberately a "look up" (requires id, access_token, or name) rather than an open "search", to keep light access to the user base.

## endpoint
GET /users

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
| order | query | no | array[enum] | - | (none documented — empty enum in source docs) | sort field(s); no valid values currently documented |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | conditionally | array[integer] | - | - | one or more user id (id, access_token, or name required) |
| access_token | query | conditionally | string | - | - | OAuth2 access token |
| name | query | conditionally | string | - | - | one or more user names |
| imagesize | query | no | enum | - | 30, 50, 100 | user avatar px size |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: name, dispname, id, lang, creationdate, image (url).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/users/?client_id=your_client_id&format=jsonpretty&name=claudod`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":1},
  "results": [
    {"name":"claudod","dispname":"claudod","id":"972174","lang":"en","creationdate":"2010-10-17","image":"https://images.jamendo.com/users/s972/972174/covers/1.50.jpg"}
  ]
}
```

## notes
- Source doc's `order` enum is documented as empty (`[]enum: {}`) — no valid sort values currently exist for this endpoint. Confirm in Step 3/4 whether the param should be omitted from the spec entirely or kept with an empty enum.
