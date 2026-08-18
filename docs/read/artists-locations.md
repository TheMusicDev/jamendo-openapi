# artists/locations

## meta
operationId: listArtistLocations
tags: [artists]
deprecated: false
summary: List artists' declared geographical locations
description: Selects and filters geographical locations artists have declared as their reference. Filter by country and/or city name, or by a lat/long coordinate pair (`location_coords`) plus a km radius (`location_radius`).

## endpoint
GET /artists/locations

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
| name | query | no | string | - | - | artist name |
| namesearch | query | no | string | - | - | artist_name substring search |
| hasimage | query | no | enum | - | true, 1 | only artists with an image |
| datebetween | query | no | string | - | yyyy-mm-dd_yyyy-mm-dd | artist join-date range |
| haslocation | query | no | boolean | - | - | only artists with (true) or without (false) declared locations |
| location_country | query | no | array[enum] | - | ISO 3166-1 alpha-3 codes (full list, e.g. USA, ITA, GBR, DEU, FRA, ...) | artist country |
| location_city | query | no | string | - | - | artist city |
| location_coords | query | no | string | - | `<latitude>_<longitude>` | coordinate pair, both numeric |
| location_radius | query | no | integer | 1 (km) | - | search radius in km around location_coords; ignored if location_coords not set |

## responses
### 200
content-types: json, jsonpretty, xml
Artist fields (id, name, website, joindate, image, shorturl, shareurl) plus nested `locations: []`, each: id, longitude, latitude, country, city.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/artists/locations/?client_id=your_client_id&format=jsonpretty&limit=5&haslocation=true&location_country=ITA&location_city=milan`
response:
```json
{
  "headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":5},
  "results": [
    {"id":"92","name":"Haeresis","website":"http://www.haeresis.org/","joindate":"2005-04-09","image":"","shorturl":"https://jamen.do/a/92","shareurl":"https://www.jamendo.com/artist/92",
     "locations":[{"id":"472","longitude":"9.18813","latitude":"45.4637","country":"ITA","city":"Milan"}]},
    {"...(truncated)":"see live response, 4 more artists in sample"}
  ]
}
```

## notes
- `location_country` enum is the full ISO 3166-1 alpha-3 country code list — omitted verbatim here for brevity, use the standard list when generating the OpenAPI enum.
