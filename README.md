# jamendo-openapi

A complete, accurate, community-maintained OpenAPI description of the
[Jamendo API v3.0](https://developer.jamendo.com/v3.0/docs). Published in both
OpenAPI 3.0 and OpenAPI 3.1, generated from a single markdown mirror of the
official docs. This is the source of truth for the API shape — it has no
opinion about any programming language.

> **Status: planning.** Specs are not generated yet. See
> [`project-plan.md`](./project-plan.md) for the execution plan. The markdown
> docs mirror, `openapi-3.0.yaml`, and `openapi-3.1.yaml` are the deliverables.

## Why this exists

Jamendo only publishes prose documentation — there is no official
machine-readable spec. The one existing community attempt,
[`miguel76/jamendo-openapi`](https://github.com/miguel76/jamendo-openapi), is
abandoned (last touched ~2017) and covers only 2 of the ~20+ read/write
methods. There is no actively maintained, typed Jamendo client in any
language today.

A language-agnostic spec has value on its own: Rust, PHP, Python, Go, and
TypeScript devs can all generate clients from it. Keeping the spec in its own
repo — separate from any one client — means it stays the source of truth
rather than being a side effect of a single client's codebase.

## What's included

- `openapi-3.0.yaml` and `openapi-3.1.yaml` — the spec, both OpenAPI versions,
  generated from `docs/`.
- `docs/` — a checked-in markdown mirror of `developer.jamendo.com/v3.0/docs`,
  one file per doc page. This is the source the specs are generated from; every
  field in the specs traces back to a line here.
- All documented methods — read (`tracks`, `albums`, `artists`, `playlists`,
  `radios`, `reviews`, `users`, plus subentities) and write/OAuth2
  (`setuser/*`).
- Both auth schemes — `apikey_auth` (client_id query param, reads) and `oauth2`
  (authorization code flow, writes).

## Scope

Cover every documented entity and method, modeled once via reusable
`components` (parameters, schemas, security schemes) and referenced throughout.
Validate continuously against the spec, and spot-check against the live API so
the spec matches the wire, not just the prose.

## Non-goals

- No language-specific client code lives here. Clients are built in downstream
  repos against this spec.
- No retry, pagination helpers, caching, or other client ergonomics — that's
  client territory.
- No opinions on how a consumer uses the spec beyond publishing it cleanly.

## Setup

Copy `.env.example` to `.env` and fill in:

- `FIRECRAWL_API_KEY` — required to run `scripts/fetch-docs.sh` (Step 1: fetch
  the Jamendo docs). Get one at [firecrawl.dev](https://firecrawl.dev).
- `JAMENDO_CLIENT_ID` / `JAMENDO_CLIENT_SECRET` — required for Step 3 (live
  spot-check against the real API). Register an app at
  [developer.jamendo.com](https://developer.jamendo.com) to get these.

`.env` is gitignored — never commit it. See `prompts/` for the Claude Code
prompt for each step of `project-plan.md`.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) (to be written). The short version:
`docs/` is the source — to fix a field, edit the matching `docs/*.md`, then
regenerate both specs. Don't hand-edit the yaml. Verify changes against the
live API before merging.

## License

MIT — see [`LICENSE`](./LICENSE).