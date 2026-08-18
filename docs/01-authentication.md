# Authentication

Source: https://developer.jamendo.com/v3.0/authentication

## basic authentication (apikey_auth)

- Every API call requires a `client_id` query parameter.
- Get one by signing up at https://devportal.jamendo.com/ and creating an
  "application".
- Public test client_id for read-only testing: `709fa152` (testing only).
- New applications default to the "read only" plan (all read methods).
  "Read & Write" plan requires Jamendo team approval — complete the
  application description before applying.
- Apps exceeding (or projected to exceed) 500,000 hits should contact
  api@jamendo.com to avoid restrictions.

## oauth2 introduction

Lets users log in to Jamendo via a third-party app and grant it rights to
read/write data on their behalf. Standard OAuth2 (IETF, http://oauth.net/2/),
Authorization Code Grant flow only.

## oauth2 workflow

1. App needs an OAuth2-protected method → makes an **OAuth2 Authorize**
   request; user logs in with Jamendo credentials and grants (or denies)
   requested scopes.
2. On grant, Authorize redirects back with an **Authorization Code**.
3. App exchanges the Authorization Code for an **Access Token** + **Refresh
   Token** via an **OAuth2 Grant** request. Must happen within **30 seconds**
   of receiving the code.
4. Access Token is valid for **2 hours**. Expired token → API returns "Your
   access token has expired".
5. To continue the session, app makes a new OAuth2 Grant request with
   `grant_type=refresh_token` and the Refresh Token (not the original
   Authorization Code). Returns a new Access Token + new Refresh Token — the
   app must overwrite the old Refresh Token.
6. User can revoke granted permissions anytime in Jamendo account
   preferences — invalidates the Access Token and Refresh Token immediately.

## requirements

- App's Redirect URL must be pre-defined in the Jamendo developer account.
- OAuth2 client should support draft #31 of the OAuth2 protocol
  (http://tools.ietf.org/html/draft-ietf-oauth-v2-31); other versions may
  work but are untested.
- SSL required for the OAuth2 Grant request (and recommended everywhere).

## which methods need oauth2

Any method requiring an `access_token` parameter — typically all write
methods. Check each method's "Required parameters" section. Methods like
`/reviews/tracks`, `/playlists`, `/users` accept but don't require
`access_token` (they read public data).

## scopes

Only one scope currently exists: **`music`** — allows writing a user's music
properties (playlists, favorite tracks/artists/albums). All OAuth2-protected
write methods in this API need the `music` scope.

## endpoint: oauth2 authorize (get authorization_code)

```
GET https://api.jamendo.com/v3.0/oauth/authorize
```

| name | type | required | default | description |
|------|------|----------|---------|-------------|
| client_id | string | yes | - | Jamendo client_id |
| redirect_uri | string | no | app's configured redirect URL | must share the same domain as the app's configured redirect URL if provided |
| scope | enum: {music} | no | music | only `music` exists today |
| response_type | enum: {code} | no | code | only `code` supported (Authorization Code Grant) |
| state | string | no | - | opaque anti-CSRF value, echoed back on redirect |

Sample: `https://api.jamendo.com/v3.0/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URL&state=YOURSTATE`

**Errors** (client_id/redirect_uri errors return JSON in the HTTP body;
other param errors redirect with GET params):

| error | description |
|-------|-------------|
| invalid_client | client_id/redirect_uri problem |
| invalid_request | generic invalid request |
| invalid_uri | redirect URI must not contain a fragment |
| redirect_uri_mismatch | redirect URI missing or mismatched |
| unsupported_response_type | only `code` is supported |
| invalid_scope | unsupported scope requested |
| access_denied | user denied the requested scope(s) |
| server_error | temporary; retry, contact api@jamendo.com if persistent |

Error sample: `{"error":"invalid_client", "error_description":"Can't get information about this clientId: Not Found", "error_uri":"URL_TO_HELP_YOU"}`

Success (redirect): `http://YOUR_REDIRECT_URL?code=YOUR_AUTHORIZATION_CODE&state=YOUR_STATE`

## endpoint: oauth2 grant (exchange authorization_code for access_token)

```
POST https://api.jamendo.com/v3.0/oauth/grant   (SSL required)
```

Must be called within 30 seconds of receiving the authorization code.

| name | type | required | description |
|------|------|----------|-------------|
| client_id | string | yes | Jamendo client_id |
| client_secret | string | yes | app's client_secret — MUST stay secret |
| grant_type | string | yes | must be `authorization_code` |
| code | string | yes | the authorization code (valid 30s) |
| redirect_uri | string | yes if used in Authorize step | must be identical to the one used in the Authorize request |

**Errors:**

| error | description |
|-------|-------------|
| invalid_client | invalid client credentials |
| unauthorized_client | grant type not authorized for this client_id |
| invalid_request | generic invalid request |
| invalid_grant | generic invalid grant |
| unsupported_grant_type | requested grant type not supported |

Error sample: `{"error":"invalid_grant", "error_description":"Authorization code doesn't exist or is invalid for the client"}`

Success sample: `{"access_token":"YOUR_NEW_ACCESS_TOKEN", "expires_in":7200, "token_type":"bearer", "scope":"music", "refresh_token":"YOUR_REFRESH_TOKEN"}`

## endpoint: oauth2 grant (refresh access_token)

```
POST https://api.jamendo.com/v3.0/oauth/grant   (SSL required)
```

| name | type | required | description |
|------|------|----------|-------------|
| client_id | string | yes | Jamendo client_id |
| client_secret | string | yes | app's client_secret — MUST stay secret |
| grant_type | string | yes | must be `refresh_token` |
| refresh_token | string | yes | the refresh_token from the prior access_token |

**Errors:** same shape as the authorization_code grant (invalid_client,
unauthorized_client, invalid_request, invalid_grant, unsupported_grant_type).

Error sample: `{"error":"invalid_request", "error_description":"The grant type was not specified in the request"}`

Success sample: `{"access_token":"YOUR_NEW_ACCESS_TOKEN", "expires_in":7200, "token_type":"bearer", "scope":"music", "refresh_token":"YOUR_NEW_REFRESH_TOKEN"}`

Must overwrite both the old access_token AND refresh_token in app storage.

## for openapi generation

- `apikey_auth`: `type: apiKey`, `in: query`, `name: client_id`.
- `oauth2`: `type: oauth2`, `flows.authorizationCode`:
  - `authorizationUrl: https://api.jamendo.com/v3.0/oauth/authorize`
  - `tokenUrl: https://api.jamendo.com/v3.0/oauth/grant`
  - `scopes: { music: "write user's music properties (playlists, favorites)" }`

## notes

-
