# V2 Todos

## Done

### Tooling

installed and configured:

- "@biomejs/biome": "^2.5.9",
- "@commitlint/cli": "^21.2.2",
- "@commitlint/config-conventional": "^21.2.2",
- "@types/bun": "^1.3.14",
- "fallow": "^3.17.0",
- "lefthook": "^2.1.10",
- "typescript": "^7.0.2"

added the scripts:

- "prepare": "lefthook install",
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

## Todo

update files to reflect new tooling:

- README
- CLAUDE
- create CONTRIBUTING.md

README.md, project-plan.md, and all three prompts/*.md files still reference the old paths (docs/read, docs/README.md,
root-level openapi-3.0.yaml, etc.) — this is the exact gap v2-todos.md's Todo section already flags ("update
files to reflect new tooling: README, CLAUDE, create CONTRIBUTING.md"), so it's known, just not done yet.

### CLI

- Root command's `meta.name` is `jamendo-openapi` (src/index.ts), but the actual entrypoint is `bun cli` (the
  package.json script alias). Citty's usage output shows `jamendo-openapi <subcommand>`, which doesn't match what
  the user types — confusing. Revisit once the CLI is compiled to a standalone binary (see below); the binary's
  name should drive `meta.name`, not be decided ahead of it.
- Eventually compile the CLI to a standalone binary (`bun build --compile` or similar) instead of running via
  `bun run src/index.ts` / `bun cli`. Decide the binary name then, and set root `meta.name` to match.
