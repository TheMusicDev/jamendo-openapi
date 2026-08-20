# V2 Todos

---

# ✅ DONE

## Tooling

installed and configured:

- "@biomejs/biome": "^2.5.9",
- "@commitlint/cli": "^21.2.2",
- "@commitlint/config-conventional": "^21.2.2",
- "@types/bun": "^1.3.14",
- "fallow": "^3.17.0",
- "lefthook": "^2.1.10",
- "typescript": "^7.0.2"
- "citty" (CLI framework), "zod" (all shared types inferred from schemas)
- "@mendable/firecrawl-js" (doc fetching), "bottleneck" (rate limiting)
- "ai" + "@ai-sdk/openai-compatible" (LLM extraction, env-configurable to any OpenAI-compatible endpoint)
- "yaml" (spec output — Bun's built-in `Bun.YAML` emits unreadable flow-style, not usable for a human-reviewed spec)
- "pino" + "pino-pretty" (logging)

added the scripts:

- "prepare": "lefthook install",
- "cli": "bun run src/index.ts"
- "test": "bun test"
- "check:types": "tsc --noEmit",
- "check:dead-code": "bun run fallow dead-code",
- "check:dupes": "bun run fallow dupes",
- "check:health": "bun run fallow health",
- "check:audit": "bun run fallow audit",
- "lint": "biome check .",
- "lint:fix": "biome check --write ."

renamed files

- docs --> jamendo-api-docs
- both openapi*.yaml --> openapi-docs/*

## Pipeline (the actual v2 rewrite)

Three CLI commands, replacing v1's bash-script + one-shot-LLM approach:

- `bun run cli fetch-docs` — pulls all 33 Jamendo doc pages via Firecrawl. Rate-limited + concurrency-limited
  (Bottleneck). Hash-based change detection (manifest.json) so a rerun skips pages whose source HTML hasn't
  changed — turns a ~4 minute full run into a ~1.5 second no-op rerun.
- `bun run cli extract-docs` — LLM-extracts structured per-endpoint data (params, auth, response fields, notes)
  plus a one-shot global OAuth2/envelope config into `jamendo-api-docs/extracted/`. Uses plain `generateText` +
  schema-in-prompt + manual JSON parse/Zod validation, NOT `generateObject`/`format` — that structured-output mode
  doesn't work reliably on the local Ollama setup this was built against (tested via ai-sdk through two providers,
  raw REST, and the official ollama-js SDK — all ignored the schema). Retries on parse/validation failure; logs
  clearly when retries are exhausted as a "try a bigger/different model" signal. Same hash-based caching as
  fetch-docs.
- `bun run cli build-openapi` — pure code, no LLM. Reads `jamendo-api-docs/extracted/`, dedupes shared parameters
  (conservative: name + exact shape must match), resolves operationId collisions from extraction, and serializes
  the same intermediate representation into both `openapi-docs/openapi-3.0.yaml` and `openapi-3.1.yaml` — the two
  specs literally cannot drift apart the way two separate LLM passes did in v1, since they're built from identical
  data by one code path that only branches on nullable idiom (`nullable: true` vs `type: [x, "null"]`).

Both generated specs currently validate clean with Redocly CLI (0 errors). 30/30 endpoints present.

Found and fixed during development (code-review-caught, not self-discovered):
- Change detection was caching HTTP error responses as "unchanged" (fetch-docs).
- `/*/file` endpoints (tracks/file, albums/file, playlists/file) were getting a fabricated JSON 200 response
  instead of the real 302 redirect they document.
- Duplicate `(method, path)` pairs in extracted data were silently overwriting each other instead of failing loud
  — traced to 5 real extraction bugs (artists-albums, artists-tracks, playlists-tracks, reviews-albums,
  reviews-tracks all extracted with the wrong/truncated path), now corrected by hand and verified against each
  page's actual documented request URL.
- A schema-invalid extracted file was being logged-and-skipped instead of failing the build.
- Enum/default values were always strings in extraction but got assigned into integer/boolean-typed schemas
  verbatim — invalid JSON Schema (`no-enum-type-mismatch`). Fixed with type coercion.

---

# 🚧 PENDING

**First, not parallelizable — do this before starting any chunk below:**

## 0. Merge PR #3
`feat/build-openapi` → `main`. Every chunk below assumes `build-openapi` exists on `main`; starting other work
against the unmerged branch risks conflicts.

---

**Everything below is independent — different files/repos, safe to hand out in parallel.**

## A. Documentation cleanup
*Touches: `README.md`, `CLAUDE.md`, `project-plan.md`, `prompts/*.md`, new `CONTRIBUTING.md`. No code changes.*

README.md, CLAUDE.md, project-plan.md, and all three `prompts/*.md` files still describe the v1 workflow
(root-level `docs/`, root-level `openapi-3.0.yaml`, the bash-script + one-shot-LLM-prompt approach) — none of that
matches the actual v2 pipeline (`jamendo-api-docs/`, `openapi-docs/`, the three citty commands above).

- [ ] Rewrite README to document the real fetch-docs / extract-docs / build-openapi flow and env vars
      (`FIRECRAWL_*`, `LLM_*`).
- [ ] Update CLAUDE.md for the new tooling/commands.
- [ ] Decide whether `project-plan.md` and `prompts/*.md` (both v1 artifacts) should be rewritten, archived, or
      deleted now that the pipeline they describe no longer exists.
- [ ] Create `CONTRIBUTING.md` — doesn't exist yet.

## B. CLI naming + standalone binary
*Touches: `src/index.ts`, `package.json`. No other overlap.*

- [ ] Compile the CLI to a standalone binary (`bun build --compile` or similar) instead of running via
      `bun run src/index.ts` / `bun cli`.
- [ ] Once the binary name is decided, set root `meta.name` in `src/index.ts` to match it — right now it's
      hardcoded to `jamendo-openapi`, which doesn't match the `bun cli` entrypoint people actually type, so
      citty's usage output is confusing.

## C. Array-item-type extraction/spec limitation
*Touches: `src/schemas/jamendo-endpoint.schema.ts`, `src/lib/jamendo-extraction-prompts.ts`, `src/lib/serialize-openapi.ts`. Requires re-running `extract-docs` + `build-openapi` after the schema change.*

Array-typed params always serialize with `string` items in both generated specs, since `JamendoEndpointParameter`
has no separate item-type field — e.g. "one or more track IDs" (`id` param on several endpoints) gets
`items: { type: string }` instead of `items: { type: integer }`.

- [ ] Add an `itemType` field to the parameter extraction schema.
- [ ] Update the extraction prompt to populate it.
- [ ] Update `serialize-openapi.ts` to use it instead of defaulting array items to `string`.
- [ ] Re-run `extract-docs` + `build-openapi`, verify the regenerated specs still validate clean.

## D. Repo 2 — jamendo-ts-client
*Fully separate repo. No file overlap with this repo at all.*

The typed TS client meant to consume this spec. Scoped as a fully separate repo from the start (see the original
`project-overview.md`); nothing has been built for it yet. Can start any time once repo 1's spec is stable enough
to point at (a tagged release, or just `main` if moving fast).
