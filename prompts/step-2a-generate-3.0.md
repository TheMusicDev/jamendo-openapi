# Step 2a — Generate openapi-3.0.yaml

Read `project-plan.md` Step 2a and every file under `docs/` (introduction,
authentication, response-codes, all `docs/read/*.md`, all `docs/write/*.md`).

Generate `openapi-3.0.yaml` as a valid OpenAPI 3.0.3 spec:

- `info` block, `servers`.
- Both security schemes: `apikey_auth` (apiKey, query, `client_id`) and
  `oauth2` (authorizationCode flow, using the exact `authorizationUrl` /
  `tokenUrl` documented in `docs/01-authentication.md`, with scopes if any
  are documented).
- Shared `components/parameters` (`client_id`, `format`, `offset`, `limit`,
  `order`, `datebetween`, plus any per-entity `include`/`imagesize`/
  `audioformat` that recur across multiple entities).
- Shared `components/schemas`: the `JamendoResponse<T>` envelope and the
  `Error` schema (from `docs/02-response-codes.md`).
- One `paths` entry per endpoint:
  - GET read endpoints → `security: [{apikey_auth: []}]`.
  - POST write endpoints (`setuser/*`) → `security: [{oauth2: [...]}]`, with
    a request body built from each page's `## request_body` section.
- Fill each `components/schemas/<Entity>` from the `## responses` section of
  its doc page. If a field's `## meta` description or `## notes` mentions a
  conditional case (e.g. "empty for singles," "empty string if X is false"),
  carry that into the field's own `description` in the schema — not just the
  path-level operation description. A consumer reading the schema for one
  field should see the caveat without also reading the whole endpoint prose.
- Reuse shared parameters/schemas via `$ref` — never redefine the same thing
  twice. Subentity pages (`/albums/tracks`, `/artists/albums`, etc.)
  reference the parent entity's schema via `$ref`, they don't redeclare it.

**Use OpenAPI 3.0.x idioms only:**
- `nullable: true` for optional-null fields (not `type: [string, null]` —
  that's 3.1-only).
- `type:` is always a single string, never an array.
- No `webhooks`, no `info.summary` — those are 3.1 features.

Process entities in this order so schemas compose cleanly: `tracks → albums →
artists → playlists → radios → reviews → users → feeds → autocomplete`, then
the `setuser/*` write entities once the `oauth2` scheme is in place.

A few pages have known quirks flagged in their `## notes` — read those before
modeling the schema:
- `autocomplete`'s `results` is a keyed object (`{tags, artists, tracks,
  albums}`), not an array — do not force it into `JamendoResponse<T[]>`.
- `tracks/file`, `albums/file`, `playlists/file` are binary redirects, not
  JSON responses — their error bodies aren't the shared `Error` schema.
- `radios/stream` is documented as unreliable per Jamendo's own docs.

**Do not run `scripts/validate.sh` or any other linter.** Validation is run
separately, by hand. Do not create or modify any linter config file (e.g.
`redocly.yaml`) — that's not part of this task.

**Do not commit.** Leave the file in the working tree for review.
