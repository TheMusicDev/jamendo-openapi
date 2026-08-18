# playlists/file

## meta
operationId: downloadPlaylistFile
tags: [playlists]
deprecated: false
summary: Download a playlist's zip file
description: Exception to the normal response shape — HTTP-redirects to the requested zip file URL instead of returning a document. Does not inherit parent (`playlists`) parameter declarations. A not-valid request triggers an HTTP error (404 or 500), not a JSON error body.

## endpoint
GET /playlists/file

## auth
apikey_auth

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| id | query | yes | integer | - | - | single playlist id (only one; redirect semantics) |
| audioformat | query | no | enum | - | mp3 | only mp32 (mp3 192kbps) exists today |

## responses
### 200
content-types: (binary redirect, not a document)
HTTP redirect (3xx) to the zip file URL on success.

### 404
Playlist or file doesn't exist. Plain HTTP error, not the standard `Error` JSON envelope.

### 500
Malformed request. Plain HTTP error, not the standard `Error` JSON envelope.

## examples
request: `https://api.jamendo.com/v3.0/playlists/file/?client_id=your_client_id&id=1`
response: HTTP redirect to the playlist zip file on success; HTTP 404/500 on failure.

## notes
- Same shape as albums/file — plain HTTP error responses, not the shared `Error` schema. Confirm exact body in Step 3.
