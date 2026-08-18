# tracks/similar

## meta
operationId: listSimilarTracks
tags: [tracks]
deprecated: false
summary: Find tracks similar to a given track
description: Given a track id, finds similar Jamendo tracks. Similarity is based mostly on tags (genre, instrument, mood), then acousticelectric/vocalinstrumental, then less-weighted xartists_idstr/lang/gender. Results sorted by relevance via the `score` field (max 1). `no_artist`/`no_album` filter out the reference track's own artist/album from results (both take an artist_id, per docs — see notes).

## endpoint
GET /tracks/similar

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
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| imagesize | query | no | enum | - | 25,35,50,55,60,65,70,75,85,100,130,150,200,300,400,500,600 | cover px size |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for `audio` field |
| audiodlformat | query | no | enum | audioformat's value, or mp32 | mp31, mp32, ogg, flac | audio download format for `audiodownload` |
| include | query | no | array[enum] | - | licenses, musicinfo, stats, lyrics | append extra fields not returned by default |
| id | query | yes | integer | - | - | reference track id to find similar tracks for |
| no_artist | query | no | integer | - | - | artist_id to exclude from results (per docs, described identically to no_album — likely a doc copy-paste; confirm semantics in Step 3) |
| no_album | query | no | integer | - | - | artist_id to exclude from results (see no_artist note) |

## responses
### 200
content-types: json, jsonpretty, xml
Track fields (same shape as `tracks` entity) plus a `score` field (float, max 1) indicating similarity relevance.

### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error

## examples
request: `https://api.jamendo.com/v3.0/tracks/similar/?client_id=your_client_id&format=jsonpretty&limit=3&include=musicinfo&id=628410&no_album=72779`
response:
```json
{"headers": {"status":"success","code":0,"error_message":"","warnings":"","results_count":0}, "results": []}
```

## notes
- Source doc's `no_artist` and `no_album` parameter descriptions are textually identical ("use that artist_id to exclude his tracks") — likely a doc copy-paste error where `no_album` should reference an album_id instead. Confirm actual parameter semantics against the live API in Step 3/4 before finalizing this path's schema.
- Live example returned zero results — full response shape not visible in the sample; infer track fields from the `tracks` entity schema plus the added `score` field.
