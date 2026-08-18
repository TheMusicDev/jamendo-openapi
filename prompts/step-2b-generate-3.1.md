# Step 2b — Generate openapi-3.1.yaml

Read `project-plan.md` Step 2b and every file under `docs/` (introduction,
authentication, response-codes, all `docs/read/*.md`, all `docs/write/*.md`).

Generate `openapi-3.1.yaml` as a valid OpenAPI 3.1.0 spec with the **same
content** as `openapi-3.0.yaml` — all read + write endpoints, both auth
schemes, all shared parameters and schemas — but 3.1-native idioms:

- `openapi: 3.1.0`.
- `type: [string, null]` (or `oneOf` + null) for optional-null fields — no
  `nullable:` key, that's 3.0-only.
- JSON Schema 2020-12 semantics: `exclusiveMinimum`/`exclusiveMaximum` as
  numbers, not booleans; `format` per 2020-12.
- `info.summary` allowed; `$ref` may sit alongside sibling keys (3.0
  forbids this, 3.1 permits it).

**Do not convert from `openapi-3.0.yaml`.** Read the markdown in `docs/` and
generate this spec independently, the same way Step 2a did. If the two specs
end up differing in *content* (not idiom — e.g. a missing endpoint, a
different required field), that's a bug in one of the two passes and should
be caught, not shipped.

Same entity processing order as 2a: `tracks → albums → artists → playlists →
radios → reviews → users → feeds → autocomplete`, then `setuser/*` write
entities.

Same known-quirk pages to handle carefully (see their `## notes`):
`autocomplete` (non-array response), `tracks/file` / `albums/file` /
`playlists/file` (binary redirects, not JSON), `radios/stream` (documented as
unreliable).

Run `scripts/validate.sh` and fix everything it flags before finishing.

**Do not commit.** Leave the file in the working tree for review.
