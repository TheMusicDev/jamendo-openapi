# jamendo-openapi — Project Plan

Execution plan for Repo 1 (`jamendo-openapi`): a complete, accurate,
community-maintained OpenAPI description of the Jamendo API v3.0, published
in **both** OpenAPI 3.0 and OpenAPI 3.1 from a single shared source.

This plan is written to be **executed by Claude Code**. The core shape:

```
Step 1   fetch official docs  →  structured markdown mirror (source of truth)
Step 2a  read markdown        →  generate openapi-3.0.yaml
Step 2b  read same markdown   →  generate openapi-3.1.yaml
Step 3   live-test both specs against the real API (last)
```

The markdown mirror is the source of truth. Both specs are *generated* from it
by two separate Claude Code passes — not by converting one spec into the
other. This keeps each spec idiomatic in its own version (3.0 uses
`nullable: true`, 3.1 uses `type: [string, null]`) and avoids the lossy
up/down-conversion problem.

> Resolves an open question from `project-overview.md`: **v1 includes all
> methods — read + write/OAuth2 — from the start.** No deferral. The spec is
> the source of truth for the whole API; shipping half of it creates a
> misleading "complete" label. Write methods get the OAuth2 flow wired in
> Step 2 alongside read methods.

---

## Repo layout (target)

```
jamendo-openapi/
├── openapi-3.0.yaml            # OpenAPI 3.0.x spec, generated from docs/
├── openapi-3.1.yaml            # OpenAPI 3.1.0 spec, generated from docs/
├── docs/                        # structured markdown mirror of developer.jamendo.com
│   ├── 00-introduction.md
│   ├── 01-authentication.md
│   ├── 02-response-codes.md
│   ├── 03-read-methods.md       # index of read endpoints
│   ├── 04-write-methods.md      # index of write endpoints
│   ├── read/                    # one file per entity/subentity page
│   │   ├── albums.md
│   │   ├── albums-file.md
│   │   ├── albums-tracks.md
│   │   ├── albums-musicinfo.md
│   │   ├── artists.md
│   │   ├── artists-tracks.md
│   │   ├── artists-albums.md
│   │   ├── artists-locations.md
│   │   ├── artists-musicinfo.md
│   │   ├── autocomplete.md
│   │   ├── feeds.md
│   │   ├── playlists.md
│   │   ├── playlists-file.md
│   │   ├── playlists-tracks.md
│   │   ├── radios.md
│   │   ├── radios-stream.md
│   │   ├── reviews-albums.md
│   │   ├── reviews-tracks.md
│   │   ├── tracks.md
│   │   ├── tracks-file.md
│   │   ├── tracks-similar.md
│   │   ├── users.md
│   │   ├── users-artists.md
│   │   ├── users-albums.md
│   │   └── users-tracks.md
│   └── write/
│       ├── setuser-fan.md
│       ├── setuser-favorite.md
│       ├── setuser-like.md
│       ├── setuser-dislike.md
│       └── setuser-myalbum.md
├── scripts/
│   ├── fetch-docs.sh            # FireCrawl each doc page → docs/ as clean markdown
│   └── validate.sh              # validate both openapi-3.0.yaml and openapi-3.1.yaml
├── .github/
│   └── workflows/
│       └── validate.yml         # validate both specs on PR
├── README.md
├── CLAUDE.md                    # instructions Claude Code follows in this repo
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE                      # MIT (already present)
└── CHANGELOG.md                 # spec version history
```

`docs/` is checked in. It is the provenance trail: every field in both specs
traces back to a line in a file under `docs/`. When the upstream docs drift,
re-run Step 1 and diff.

### Markdown file template

Every `docs/read/<entity>.md` and `docs/write/<entity>.md` follows the same
template so Claude Code can extract data reliably across all files. The
template carries everything an OpenAPI path item needs:

```markdown
# <entity>

## meta
operationId: <uniqueId>           # e.g. listTracks, getTrackFile
tags: [<group>]                    # e.g. [tracks]
deprecated: false
summary: <one-line human label>
description: <longer, what it does>

## endpoint
<method> /<path>                   # GET /tracks  or  POST /setuser/favorite

## auth
apikey_auth | oauth2
# if oauth2, list required scopes (empty if Jamendo defines none)

## request_body                     # ONLY for POST/write methods; omit for GET
| name | required | type | default | enum | description |
|------|----------|------|---------|-------|-------------|

## parameters
| name | in    | required | type   | default | enum | description |
|------|-------|----------|--------|---------|-------|-------------|
| client_id | query | yes | string | - | - | app id |
| limit | query | no | int | 10 | 1-200 | page size |

## responses
### 200
content-types: json, jsonpretty, xml
<field table of the returned object(s), OR an example JSON block>
### 400 / 401 / 403 / 404 / 429 / 500
reference: $ref Error   # shared schema from 02-response-codes

## examples
request: <example call URL>
response: <example JSON>

## notes
<gotchas, divergences from other entities, cross-references, wire-vs-doc notes>
```

Sections present even when empty (write a `-` or omit the section cleanly) so
the generation pass knows what's absent vs what was skipped. Consistent
template = Claude reads it the same way every time = both generation passes
(3.0 and 3.1) stay in sync because they read the same input.

---

## Steps

### Step 1 — Fetch docs → structured markdown mirror

**Goal:** `docs/` populated, one file per doc page, every file following the
template above.

1. Write `scripts/fetch-docs.sh`: a loop over the known doc URLs (list below)
   calling **FireCrawl** (needs `FIRECRAWL_API_KEY` env var) to convert each
   page to clean markdown, saved to `docs/read/<slug>.md` /
   `docs/write/<slug>.md`. FireCrawl handles HTML→markdown, strips nav chrome,
   keeps the parameter tables, and deals with any JS-rendered or anti-bot edge
   cases without us writing a scraper. Use the FireCrawl REST API or the
   `@mendable/firecrawl-js` SDK; one call per URL, write the returned markdown
   to the file.
2. FireCrawl gives clean *prose* markdown, but not the 8-section structure the
   generator needs. After raw fetch, Claude Code normalizes each file to the
   template: pull the endpoint path + verb into `## endpoint`, the param table
   into `## parameters`, the response shape into `## responses`, etc. This
   normalization step happens regardless of fetcher — FireCrawl just gives
   cleaner raw input to normalize.
3. Run it. Confirm every file matches the template.

**Known doc URLs to fetch** (base `https://developer.jamendo.com/v3.0/`):

```
docs                          introduction
authentication                auth
response-codes
albums  albums/file  albums/tracks  albums/musicinfo
artists  artists/tracks  artists/albums  artists/locations  artists/musicinfo
autocomplete
feeds
playlists  playlists/file  playlists/tracks
radios  radios/stream
reviews/albums  reviews/tracks
tracks  tracks/file  tracks/similar
users  users/artists  users/albums  users/tracks
setuser/fan  setuser/favorite  setuser/like  setuser/dislike  setuser/myalbum
```

Explicit list, not a crawler. The docs site is a static nav; crawling adds a
scraper for no gain. New method appears upstream → someone files an issue, we
add the URL by hand, re-run Step 1.

**Claude Code prompt for Step 1:**

> "Read `project-plan.md` Step 1 and the markdown template section. Write
> `scripts/fetch-docs.sh` that uses FireCrawl (REST API or `@mendable/firecrawl-js`
> SDK, reading `FIRECRAWL_API_KEY` from env) to convert each URL in the known-doc
> list to clean markdown at `docs/read/<slug>.md` and `docs/write/<slug>.md`.
> Run it. Then read each fetched file and rewrite it to match the 8-section
> template exactly: `## meta`, `## endpoint`, `## auth`, `## request_body` (POST
> only), `## parameters`, `## responses`, `## examples`, `## notes`. Show me the
> resulting `docs/` tree and one sample file. Do not commit."

### Step 2a — Generate `openapi-3.0.yaml` from markdown

**Goal:** valid OpenAPI 3.0.x spec, **all methods** (read + write) + both auth
schemes, built from `docs/`.

Claude Code reads every file under `docs/` and emits `openapi-3.0.yaml`:

- `openapi: 3.0.3`, `info` (title, version `3.0.0` mirroring Jamendo API v3.0,
  license MIT, contact), `servers: [{url: https://api.jamendo.com/v3.0}]`.
- **Security schemes** (from `docs/01-authentication.md`):
  - `apikey_auth`: `type: apiKey`, `in: query`, `name: client_id`.
  - `oauth2`: `type: oauth2`, `flows.authorizationCode` with the documented
    `authorizationUrl`/`tokenUrl` and scopes (empty if Jamendo defines none).
- **Shared parameters** (`components/parameters/`): `client_id`, `format`
  (enum `json|jsonpretty|xml`, default `json`), `offset`, `limit`, `order`,
  `datebetween`, plus per-entity `include`/`imagesize`/`audioformat` where they
  recur.
- **Shared schemas** (`components/schemas/`): `Track`, `Album`, `Artist`,
  `Playlist`, `Radio`, `Review`, `User`, `Location`, `Musicinfo`, `Feed`,
  `Autocomplete`, the `JamendoResponse<T>` envelope (`{headers, results: T[]}`),
  and `Error` (the shared error shape from `docs/02-response-codes.md`).
- **Paths**: one entry per `docs/read/*.md` and `docs/write/*.md`.
  - Read: verb `get`, `security: [{apikey_auth: []}]`, params via `$ref`, 200
    response → `JamendoResponse<Track[]>`, 4xx/5xx → `$ref Error`.
  - Write: verb `post`, `security: [{oauth2: [<scopes>]}]`, request body from
    `## request_body`, 200 response per the page, 4xx/5xx → `$ref Error`.

**3.0.x idioms enforced on this pass:**
- Optional-null fields use `nullable: true` (not `type: [string, null]` — that's
  3.1-only).
- `type:` is always a single string, never an array.
- No `webhooks`, no `info.summary`, JSON Schema draft-4 subset.

Process read entities in dependency order so schemas compose:
`tracks → albums → artists → playlists → radios → reviews → users → feeds →
autocomplete`. Then write entities (`setuser/*`) after the OAuth2 scheme is in.
Subentity pages (`/albums/tracks`, `/artists/albums`, …) reference the parent
schema via `$ref`, never redefine.

**Claude Code prompt for Step 2a:**

> "Read `project-plan.md` Step 2a and every file under `docs/` (introduction,
> authentication, response-codes, all `docs/read/*.md`, all `docs/write/*.md`).
> Generate `openapi-3.0.yaml` as a valid OpenAPI 3.0.3 spec: info block,
> servers, both security schemes (apikey_auth, oauth2 with the documented
> authorizationCode flow + scopes), shared `components/parameters`, the
> `JamendoResponse` envelope and `Error` schemas. Then one `paths` entry per
> endpoint — GET read endpoints with apikey_auth, POST write endpoints
> (setuser/*) with oauth2 and a request body from `## request_body`. Use 3.0.x
> idioms only: `nullable: true`, single-string `type`, no 3.1 features. Fill
> each `components/schemas/<Entity>` from the `## response` table in its doc
> page. Reuse shared components via `$ref`, never redefine. Run
> `scripts/validate.sh` and fix everything it flags. Do not commit."

### Step 2b — Generate `openapi-3.1.yaml` from markdown

**Goal:** valid OpenAPI 3.1.0 spec, same content as 3.0, 3.1-native idioms.

Separate Claude Code pass over the *same* `docs/` markdown. Independent output
file. Same paths (read + write), schemas, components, auth — different version
idioms:

- `openapi: 3.1.0`.
- Optional-null fields use `type: [string, null]` (or `oneOf` + null) — 3.1
  native, no `nullable`.
- JSON Schema 2020-12: `exclusiveMinimum`/`exclusiveMaximum` as numbers, not
  booleans; `format` semantics per 2020-12.
- `info.summary` allowed; `webhooks` available if we ever need them (we don't in
  v1, but the door is open).
- `$ref` now allowed next to sibling keys (3.0 forbade it; 3.1 permits it).

No mechanical conversion from the 3.0 file. Both specs are first-class
generated outputs from the markdown. If a field differs between the two beyond
idiom, that's a bug in one of the passes.

**Claude Code prompt for Step 2b:**

> "Read `project-plan.md` Step 2b and every file under `docs/` (introduction,
> authentication, response-codes, all `docs/read/*.md`, all `docs/write/*.md`).
> Generate `openapi-3.1.yaml` as a valid OpenAPI 3.1.0 spec with the same
> content as `openapi-3.0.yaml` — all read + write endpoints, both auth
> schemes, all schemas — but 3.1-native idioms: `type: [string, null]` for
> nullable fields (no `nullable:` key), JSON Schema 2020-12 semantics,
> `$ref` allowed alongside sibling keys. Do not convert from the 3.0 file —
> read the markdown and generate independently. Run `scripts/validate.sh`
> and fix everything it flags. Do not commit."

### Step 3 — Live spot-check (last)

**Goal:** specs match the wire, not just the prose docs.

Needs a `JAMENDO_CLIENT_ID` (see "Glossary" below) for read endpoints and an
OAuth2 token for write endpoints. For a sample of high-traffic read endpoints
— `tracks`, `tracks/file`, `albums`, `artists` — curl the real API and
compare returned JSON keys against the schemas in **both** spec files. For one
write endpoint (e.g. `setuser/favorite`) repeat with a test OAuth token if one
is available; if not, validate the write-method shapes against the docs only
and flag them in the PR for manual OAuth verification. Where docs and wire
diverge, **fix both specs to match the wire** (docs lie; the wire is truth)
and add a `> Note:` line under `## notes` in the relevant
`docs/read/<entity>.md` or `docs/write/<entity>.md` so the provenance trail
stays honest.

`scripts/validate.sh` must not depend on `JAMENDO_CLIENT_ID`. Live testing is
opt-in, run by hand or in a separate script, never in the required validation
path.

**Claude Code prompt for Step 3:**

> "Read `project-plan.md` Step 3. For tracks, tracks/file, albums, artists:
> if `$JAMENDO_CLIENT_ID` is set, curl
> `https://api.jamendo.com/v3.0/<entity>?client_id=$JAMENDO_CLIENT_ID&limit=1`
> and compare the returned JSON keys against the schemas in both
> `openapi-3.0.yaml` and `openapi-3.1.yaml`. If unset, say so and skip. For one
> write endpoint (setuser/favorite), if a test OAuth token is available, do the
> same with a POST; else flag it for manual verification and move on. For each
> mismatch, update both specs to match the wire and add a `> Note:` line under
> `## notes` in the matching `docs/read/*.md` or `docs/write/*.md`. Do not
> commit."

### Step 4 — Tag v1

1. Final `scripts/validate.sh` — both specs green.
2. Tag `v1.0.0` (annotated). This is the pin `jamendo-ts-client` (Repo 2)
   targets.
3. Write `CHANGELOG.md` entry listing both spec files and their OpenAPI
   versions.

---

## Open-source documentation to write

Plain prose, no spec content:

- **`README.md`** — what this is, why (no official spec; the abandoned
  `miguel76/jamendo-openapi` covers 2 of ~20+ methods), what's included (both
  3.0 and 3.1 specs from one markdown source), how to consume (raw file URLs,
  Redoc/Swagger UI preview, 1-line codegen examples for `openapi-typescript`
  and `openapi-generator`), how to validate locally, link to CONTRIBUTING.
- **`CLAUDE.md`** — repo-scoped instructions Claude Code follows: work
  source-driven from `docs/`, never invent a field; both specs regenerate from
  the same markdown — if they diverge in content (not idiom) that's a bug; run
  `scripts/validate.sh` before considering work done; reuse shared components
  via `$ref`; the wire is truth over prose; don't commit without explicit ask
  (restated from global rules for repo context).
- **`CONTRIBUTING.md`** — how to propose additions/corrections: file an issue
  with the doc page + live API evidence; PRs keep `docs/` in sync with upstream;
  validation must pass; the verify-against-live rule; which to edit when fixing
  a field — `docs/*.md` is source, regenerate both specs, don't hand-edit the
  yaml.
- **`CODE_OF_CONDUCT.md`** — Contributor Covenant 2.1.
- **`CHANGELOG.md`** — spec version history; `v1.0.0` entry at tag time.
- **`LICENSE`** — MIT (present).
- **`.github/workflows/validate.yml`** — CI: install validator, run
  `scripts/validate.sh` on PR.

---

## Glossary (things the plan references)

- **`FIRECRAWL_API_KEY`** — API key for the FireCrawl service. Used in Step 1
  to convert each Jamendo doc page to clean markdown. Get one at
  `firecrawl.dev`. Required to run `scripts/fetch-docs.sh`; not needed for spec
  generation (Step 2) or validation.
- **`JAMENDO_CLIENT_ID`** — your app's identifier for the Jamendo API. Every
  read call requires `client_id` as a query parameter; you get one by
  registering an app at `developer.jamendo.com`. Used only in Step 3 to hit the
  live API for verification. Not needed to generate or validate the specs —
  only to spot-check them against reality.
- **Spec validator** — a tool that checks a yaml file is valid OpenAPI and
  flags errors (bad `$ref`, wrong type, missing required field). Two common
  ones:
  - **Redocly CLI** (`@redocly/cli`) — current standard. `redocly lint
    openapi-3.1.yaml` validates + lints in one. One install, opinionated rules.
  - **Spectral** (Stoplight) — alternative linter, config-driven, fewer
    default opinions.
  - Plan default: **Redocly CLI.** One tool, covers validation and linting.
  - Pure-validation minimal alt: `swagger-cli validate` (`@apidevtools/
    swagger-cli`) — no lint opinions, just "is this valid OpenAPI." Use if you
    want zero opinions.
- **FireCrawl** — web-crawler service (`firecrawl.dev`). Crawls URLs, returns
  clean LLM-ready markdown: strips nav/boilerplate, keeps content + tables,
  handles JS rendering and anti-bot. Used in Step 1 to fetch the Jamendo docs.
  Its output is clean prose markdown, but *not* the 8-section structure the
  generator needs — Claude Code normalizes FireCrawl's output into the
  template after fetch.

---

## Decisions logged

| Question (from overview) | Decision |
|---|---|
| Repo name/ownership | `jamendo-openapi`, personal (TheMusicDev). MIT in place. Can move to an org later without renaming. |
| License | MIT (present). |
| Methods in v1? | **All of them.** Read + write/OAuth2 from Step 2. No deferral; the spec is the source of truth for the whole API. |
| Spec format | **Two specs:** `openapi-3.0.yaml` and `openapi-3.1.yaml`, both generated from `docs/`. No JSON variant unless a consumer asks. |
| Generation approach | Markdown is source of truth. Two independent Claude Code passes produce the two specs. No up/down-conversion. |
| Markdown structure | One file per doc page, strict template (`## meta` / `## endpoint` / `## auth` / `## request_body` / `## parameters` / `## responses` / `## examples` / `## notes`). |
| Fetch tooling | **FireCrawl** (confirmed). `scripts/fetch-docs.sh` calls FireCrawl per URL, returns clean markdown. Needs `FIRECRAWL_API_KEY` env var. Output still normalized to the 8-section template by Claude Code after fetch. |
| Docs committed | Yes. `docs/` is checked in — the provenance trail. Every field in both specs traces to a line in `docs/`. |
| Validator | **Redocly CLI** (confirmed). `scripts/validate.sh` runs `redocly lint` on both specs. |
| Live testing | Last step only. Requires `JAMENDO_CLIENT_ID` (read) and a test OAuth token (write). Never in the required validation path. |

---

## What this plan deliberately does not do

- No client code. Repo 2's job.
- No retry/pagination/caching helpers. Client territory.
- No automated doc crawler. Explicit fetch list; new methods added by hand.
- No generated client in this repo. Codegen belongs in consuming repos.
- No JSON spec variant. Yaml only; add JSON if a consumer needs it.
- No multi-version Jamendo spec. This describes Jamendo v3.0 only.