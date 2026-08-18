# docs/ — how this directory works

This directory is a structured markdown mirror of
`developer.jamendo.com/v3.0/docs`. It is the **source of truth** for both
generated specs (`openapi-3.0.yaml`, `openapi-3.1.yaml`). Every field in
either spec should trace back to a line in a file here.

## The flow, end to end

```
 1. FETCH (mechanical, no LLM)
    scripts/fetch-docs.sh calls the Firecrawl API for each known doc URL,
    gets back raw markdown, saves it to a temp/raw location.
    Needs: FIRECRAWL_API_KEY env var.

 2. NORMALIZE (needs an LLM — Claude Code)
    Claude Code reads each raw fetched page and rewrites it into this
    directory's strict template (below). This step requires judgment —
    picking which table is "the parameters," which prose sentence is
    "the description," etc. — so it's not scripted.

 3. GENERATE (needs an LLM — two independent passes)
    Claude Code reads every file under docs/ and generates:
      - openapi-3.0.yaml (3.0.x idioms)
      - openapi-3.1.yaml (3.1 idioms)
    Both read the SAME docs/ input. Neither is converted from the other.

 4. VALIDATE (mechanical, no LLM)
    scripts/validate.sh runs Redocly lint against both spec files.

 5. LIVE SPOT-CHECK (last, mechanical + manual judgment)
    Compare a handful of real API responses against the generated specs.
    Needs: JAMENDO_CLIENT_ID (reads) and a test OAuth token (writes).
    Fix specs + docs/ to match the wire when they disagree with prose.
```

Steps 1–2 only need to be repeated when Jamendo changes their docs. Step 3
is repeated any time `docs/` changes. See `project-plan.md` at the repo root
for the full phase-by-phase plan and the exact Claude Code prompt for each
step.

## Why fetch and normalize are separate steps

Firecrawl returns clean *prose* markdown — readable, but not the fixed
structure the spec-generation step needs. A human (or a script) can't
reliably tell "this paragraph is the description" from "this paragraph is a
gotcha note" without reading it. That's why normalization is an LLM step:
Claude Code reads each raw page and reshapes it into the template below, so
that generation (step 3) can process every file the same mechanical way.

## Directory layout

```
docs/
├── README.md              # this file
├── 00-introduction.md     # prose reference page — not endpoint-shaped
├── 01-authentication.md   # prose reference page — has the OAuth2 flow URLs/scopes
├── 02-response-codes.md   # prose reference page — the shared Error shape
├── read/                  # one file per read (GET) endpoint page
│   └── <entity>[-<subentity>].md
└── write/                 # one file per write (POST) endpoint page
    └── setuser-<action>.md
```

The three top-level prose pages don't follow the endpoint template (they're
not describing a single method) — they use plain headed markdown instead.
Everything under `read/` and `write/` follows the template exactly.

## The endpoint template

Every file under `read/` and `write/` has these sections, in this order.
Write `-` for an empty section rather than omitting it, except
`## request_body`, which is omitted entirely on GET/read pages (only POST/
write pages have a body).

```markdown
# <entity>[-<subentity>]

## meta
operationId: <uniqueId>            # e.g. listTracks, getTrackFile
tags: [<group>]                    # e.g. [tracks]
deprecated: false
summary: <one-line human label>
description: <longer, what it does>

## endpoint
<METHOD> /<path>                   # e.g. GET /tracks  or  POST /setuser/favorite

## auth
apikey_auth | oauth2
# if oauth2: list required scopes, or "none documented" if Jamendo defines none

## request_body                     # POST/write pages ONLY — omit this section on GET pages
| name | required | type | default | enum | description |
|------|----------|------|---------|------|-------------|

## parameters
| name | in    | required | type   | default | enum | description |
|------|-------|----------|--------|---------|------|-------------|

## responses
### 200
content-types: json, jsonpretty, xml
<field table of the returned object(s), or an example JSON block>
### 4xx / 5xx
reference: shared Error schema (see docs/02-response-codes.md)

## examples
request: <example call URL>
response: <example JSON — trim large arrays/payloads, keep 1-2 example
           objects and truncate anything over ~10 elements; the field
           shape belongs in ## responses, not here>

## notes
<gotchas, cross-references to other entities, or "-" if none>
```

## Provenance rule

If a field in either generated spec doesn't trace back to something written
in a file here, that's a bug — either the markdown is missing the info (go
re-read the live doc page and add it) or the generator invented something
(fix the generator prompt/output, don't just patch the yaml by hand).

## Keeping docs/ and the wire in sync

Docs and implementation can drift. Step 5 (live spot-check) is where that
gets caught. When it does, the fix is: update the spec to match the wire,
and add a `> Note:` line under the relevant file's `## notes` section
explaining the divergence — so the next person reading the markdown knows
why the spec doesn't match what `developer.jamendo.com` says.
