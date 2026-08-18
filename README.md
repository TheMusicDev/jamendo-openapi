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

## Building the spec

The specs (`openapi-3.0.yaml`, `openapi-3.1.yaml`) are generated, not
hand-written. If you're building or regenerating them from scratch, here's
the full path.

### Prerequisites

- [Claude Code](https://claude.com/claude-code) — the generation steps are
  Claude Code prompts, not shell scripts. You need it installed and
  authenticated.
- Node.js (for `npx @redocly/cli`, used by `scripts/validate.sh`).
- A [Firecrawl](https://firecrawl.dev) API key (free tier is enough) — used
  to fetch the Jamendo doc pages as clean markdown.
- A [Jamendo](https://developer.jamendo.com) app `client_id` (and secret, if
  you also want to test write methods) — only needed for the final
  live-verification step, not for generating the spec itself.

### 1. Clone and configure

```bash
git clone <this-repo-url>
cd jamendo-openapi
cp .env.example .env
```

Fill in `.env`:

| Variable | Needed for | Get one at |
|---|---|---|
| `FIRECRAWL_API_KEY` | Step 1 (fetch docs) | [firecrawl.dev](https://firecrawl.dev) |
| `JAMENDO_CLIENT_ID` | Step 3 (live spot-check, reads) | [developer.jamendo.com](https://developer.jamendo.com) |
| `JAMENDO_CLIENT_SECRET` | Step 3 (live spot-check, writes — optional) | [developer.jamendo.com](https://developer.jamendo.com) |

`.env` is gitignored — never commit it.

### 2. Fetch the docs mirror (Step 1)

```bash
source .env && ./scripts/fetch-docs.sh
```

This is a plain shell script, no Claude Code needed. It calls Firecrawl once
per known Jamendo doc page and writes raw markdown into `docs/`. Already done
in this repo? Check — if `docs/read/*.md` and `docs/write/*.md` are
populated, skip to step 3.

Firecrawl's raw output still needs to be reshaped into this repo's structured
template before it's usable — that reshaping step needs an LLM's judgment
(deciding what's a parameter table vs. prose, etc.), so it isn't scripted.
Ask Claude Code, in this repo, to: *"read the raw fetched pages in `docs/`
and rewrite each to match the template in `docs/README.md`."* See
[`docs/README.md`](./docs/README.md) for the exact template and full
fetch → normalize → generate → validate → spot-check flow.

### 3. Generate both specs (Steps 2a / 2b)

Each remaining step is a ready-to-run prompt file under [`prompts/`](./prompts).
Run one with Claude Code, from the repo root:

```bash
claude "$(cat prompts/step-2a-generate-3.0.md)"   # → openapi-3.0.yaml
claude "$(cat prompts/step-2b-generate-3.1.md)"   # → openapi-3.1.yaml
```

(No `claude` CLI shortcut? Open a Claude Code session in this repo and paste
the file's contents as your message instead — same effect.)

Run these in either order — both read `docs/` independently, neither depends
on the other's output. These prompts don't run the linter themselves — run
`./scripts/validate.sh` yourself afterward (see below), then **review the
diff before committing**: validation only catches malformed OpenAPI, not
wrong modeling choices. Nothing in these prompts commits on your behalf.

### 4. Live spot-check (Step 3, last)

```bash
claude "$(cat prompts/step-3-live-spot-check.md)"
```

Requires `JAMENDO_CLIENT_ID` in `.env` (sourced into your shell). Compares a
sample of real API responses against both generated specs and patches any
drift — docs and implementation can disagree, and the wire wins. Run this
only after both specs exist and `scripts/validate.sh` passes clean on both.

### Validating anytime

```bash
./scripts/validate.sh
```

Lints whichever of the two spec files exist via Redocly CLI. Safe to run at
any point; skips a spec that hasn't been generated yet.

## Known issues

**Field-level conditional caveats are inconsistently applied (as of the
current `openapi-3.0.yaml` / `openapi-3.1.yaml`).** Jamendo's docs describe
several fields that go empty/null under specific conditions — e.g. `tracks`
without an album ("singles") have empty `album_id`, `album_name`, and
`album_image`. `prompts/step-2a-generate-3.0.md` and
`prompts/step-2b-generate-3.1.md` both instruct the generator to carry these
into the affected field's own `description` in `components/schemas`, not just
leave them in the operation-level prose. In practice:

- `openapi-3.1.yaml` picked up the caveat on `album_id` and `album_name`, but
  not `album_image` — a partial, inconsistent application.
- `openapi-3.0.yaml` didn't pick it up at all. When Claude Code was asked to
  regenerate it, it detected the file already existed (staged in git) and
  reported restoring/validating the existing content rather than actually
  re-deriving it from `docs/` — so the prompt's instruction never took
  effect on that file.

**If you hit this again:** deleting the `.yaml` file from the working tree
isn't enough to force a real regeneration — if it's still present in git's
index, the model can "restore" the staged copy instead of rebuilding from
`docs/`. Also unstage/remove it from the index (`git rm --cached
openapi-3.0.yaml`) before re-running the prompt, and consider explicitly
telling Claude Code in the prompt to ignore any existing file and rebuild
every schema field from `docs/` from scratch.

This has not been re-attempted a fourth time. Known gap, not yet fixed.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) (to be written). The short version:
`docs/` is the source — to fix a field, edit the matching `docs/*.md`, then
regenerate both specs. Don't hand-edit the yaml. Verify changes against the
live API before merging.

## License

MIT — see [`LICENSE`](./LICENSE).