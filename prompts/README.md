# prompts/

Standalone Claude Code prompts for each remaining step of `project-plan.md`.
Each file is self-contained — paste its contents (or run
`claude "$(cat prompts/step-2a-generate-3.0.md)"`) to execute that step in a
fresh Claude Code session.

| File | Step | Produces |
|---|---|---|
| [`step-2a-generate-3.0.md`](./step-2a-generate-3.0.md) | 2a | `openapi-3.0.yaml` |
| [`step-2b-generate-3.1.md`](./step-2b-generate-3.1.md) | 2b | `openapi-3.1.yaml` |
| [`step-3-live-spot-check.md`](./step-3-live-spot-check.md) | 3 | Live-verifies both specs, patches drift |

Run 2a and 2b in either order (or separately) — both read `docs/`
independently and don't depend on each other. Run 3 only after both specs
exist and `scripts/validate.sh` passes clean.

None of these prompts authorize `git add`/`commit`/`push` — review the diff
yourself and commit when you're satisfied.
