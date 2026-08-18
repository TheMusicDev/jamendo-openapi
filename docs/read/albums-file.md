# albums/file

## meta
operationId: downloadAlbumFile
tags: [albums]
deprecated: false
summary: Download an album's zip file
description: Exception to the normal response shape — HTTP-redirects to the requested zip file URL instead of returning a document. Does not inherit parent (`albums`) parameter declarations. A not-valid request triggers an HTTP error (404 or 500), not a JSON error body. Since Apr 2022, returns 404 if `zip_allowed` is false for the requested album.

## endpoint
GET /albums/file

## auth
apikey_auth

## parameters
| name | in | required | type | default | enum | description |
|------|-----|----------|------|---------|------|-------------|
| client_id | query | yes | string | - | - | app client id |
| id | query | yes | integer | - | - | single album id (only one; redirect semantics) |
| audioformat | query | no | enum | - | mp3 | only mp32 (mp3 192kbps) exists today |

## responses
### 200
content-types: (binary redirect, not a document)
HTTP redirect (3xx) to the zip file URL on success.

### 404
Album or file doesn't exist, or `zip_allowed` is false. Plain HTTP error, not the standard `Error` JSON envelope.

### 500
Malformed request. Plain HTTP error, not the standard `Error` JSON envelope.

## examples
request: `https://api.jamendo.com/v3.0/albums/file/?client_id=your_client_id&id=1`
response: HTTP redirect to the album zip file on success; HTTP 404/500 on failure.

## notes
- Does NOT use the shared `Error` schema for its error responses — plain HTTP error codes with a differently-shaped body. Confirm exact 404/500 body shape in Step 3 (live spot-check) before modeling `responses` for this path.
