# Step 3 — Live spot-check (run last)

Read `project-plan.md` Step 3.

Requires `JAMENDO_CLIENT_ID` in the environment (register an app at
`developer.jamendo.com` to get one — see the Glossary in `project-plan.md`).
For write-method verification, a test OAuth2 token is optional — if you don't
have one, skip that part and say so.

## Read-endpoint checks

For `tracks`, `tracks/file`, `albums`, `artists`:

- If `$JAMENDO_CLIENT_ID` is set, curl:
  `https://api.jamendo.com/v3.0/<entity>?client_id=$JAMENDO_CLIENT_ID&limit=1`
- If unset, say so and skip this section entirely.
- Compare the returned JSON keys/shape against the schemas in **both**
  `openapi-3.0.yaml` and `openapi-3.1.yaml`.

## Write-endpoint check

For one write endpoint (`setuser/favorite`):

- If a test OAuth token is available, POST against it the same way and
  compare the response shape.
- If not, flag it for manual verification later and move on — don't block
  on this.

## On any mismatch

Docs and implementation can drift — the wire is truth, not the prose docs.
For every mismatch found:

1. Update **both** `openapi-3.0.yaml` and `openapi-3.1.yaml` to match the
   wire.
2. Add a `> Note:` line under the `## notes` section of the corresponding
   `docs/read/<entity>.md` or `docs/write/<entity>.md`, explaining what
   diverged and what the live response actually showed. This keeps the
   markdown mirror honest as the source of truth even where it disagrees
   with Jamendo's own prose docs.

Several pages already have known quirks flagged in `## notes` from the
normalization pass — check those specifically against the live response:
`autocomplete`'s non-array `results`, the `*/file` binary-redirect
endpoints, `radios/stream`'s reliability, and the write-endpoint body-vs-
query-param format on `setuser/*`.

**Do not commit.** Leave changes in the working tree for review.
