# radios

## meta
operationId: listRadios
tags: [radios]
deprecated: false
summary: List Jamendo radios
description: Returns the list of existing Jamendo radios with image and name. Each radio id/name can be used with radios/stream to integrate the radio. Commercial/direct-indirect use requires purchasing a commercial license (licensing.jamendo.com); a paid license upgrades the developer account to access `type=pro` radios and provides a royalty-exemption certificate.

## endpoint
GET /radios

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
| order | query | no | array[enum] | relevance-like default | id, name, dispname | sort field(s) |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| id | query | no | integer | - | - | a radio id |
| type | query | no | enum | www | www, pro | www = public radios (default); pro = commercial/licensed only |
| name | query | no | string | - | - | radio name (unique, identifying) |
| imagesize | query | no | enum | - | 150, 30 | radio image px size |

## responses
### 200
content-types: json, jsonpretty, xml
Fields per result: id, name, dispname, type, image (url).

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/radios/?client_id=your_client_id&format=jsonpretty&limit=3`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":3},
  "results": [
    {"id":1,"name":"bestof","dispname":"Best Of Jamendo Radio","type":"www","image":"https://images.jamendo.com/new_jamendo_radios/bestof150.jpg"},
    {"id":2,"name":"electro","dispname":"Electronic Radio","type":"www","image":"https://images.jamendo.com/new_jamendo_radios/electro150.jpg"},
    {"id":3,"name":"rock","dispname":"Rock Radio","type":"www","image":"https://images.jamendo.com/new_jamendo_radios/rock150.jpg"}
  ]
}
```

## notes
-
