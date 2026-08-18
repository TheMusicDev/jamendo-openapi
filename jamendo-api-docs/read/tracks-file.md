# tracks/file

## meta
operationId: downloadTrackFile
tags: [tracks]
deprecated: false
summary: Download or stream a track's audio file
description: Exception to the normal response shape — HTTP-redirects to the requested audio file URL instead of returning a document. Does not inherit parent (`tracks`) parameter declarations. A not-valid request triggers an HTTP error (404 or 500). Since Apr 2022, returns 404 if `audiodownload_allowed`/`track_audiodownload_allowed` is false for the requested track.

## endpoint
GET /tracks/file

## auth
apikey_auth

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| fullcount | query | no | boolean | false | - | adds results_fullcount to headers |
| audioformat | query | no | enum | mp31 | mp31, mp32, ogg, flac | audio format for the redirected file |
| action | query | no | enum | download | download, stream | hints server-side request handling optimization |
| id | query | yes | integer | - | - | single track id (only one; redirect semantics) |

## responses
### 200
content-types: (binary redirect, not a document)
HTTP redirect (3xx) to the audio file URL on success.

### 404
Track doesn't exist, or download not allowed. Plain HTTP error, not the standard `Error` JSON envelope.

### 500
Malformed request. Plain HTTP error, not the standard `Error` JSON envelope.

## examples
request: `https://api.jamendo.com/v3.0/tracks/file/?client_id=your_client_id&id=10`
response: HTTP redirect to the track's audio file on success; HTTP 404/500 on failure.

## notes
- Same "file" pattern as albums/file and playlists/file — plain HTTP error responses, redirect on success. Confirm exact 404/500 body in Step 3.
