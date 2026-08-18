# Jamendo API Introduction

Source: https://developer.jamendo.com/v3.0/docs

## overview

Jamendo API v3.0 provides 20+ read methods over a catalog of ~500K tracks,
OAuth2-based authentication, 5 write methods to manage a user's library, and
app usage statistics via the developer portal.

## rest-like api

Every method is expressed as an entity or entity+subentity. Generic GET URL
form:

```
http[s]://api.jamendo.com/<version>/<entity>/<subentity>/?<api_parameter>=<value>
```

Not fully RESTful (no CRUD-to-HTTP-verb 1:1 mapping, no entity id as URL path
segment) — Jamendo calls it "RESTlike".

## http methods

- Read methods: GET (HTTP or HTTPS)
- Write methods: POST
- SSL strongly recommended always, and required for parts of the OAuth2 flow.

## document format

Every call returns a document in the requested `format`: `json`, `jsonpretty`,
`xml`. Structure varies slightly per format but always includes `headers`
(see `02-response-codes.md`) plus the requested `results`.

## terms of use

Signing up at the developer portal (https://devportal.jamendo.com/) and
creating an application requires accepting Jamendo's API Terms of Use.

## notes

-
