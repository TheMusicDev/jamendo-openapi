#!/usr/bin/env bash
# Fetches the known Jamendo API doc pages via Firecrawl's /v1/scrape endpoint
# and writes each page's markdown to docs/read/<slug>.md or docs/write/<slug>.md.
#
# Requires: FIRECRAWL_API_KEY (get one at https://firecrawl.dev)
# Requires: curl, jq
#
# This step is purely mechanical -- fetch raw page content, save to disk.
# No LLM involved. The raw files here are NOT yet in the repo's markdown
# template; that normalization is a separate, LLM-driven step (see
# project-plan.md Step 1, and docs/README.md in this directory).

set -euo pipefail

if [[ -z "${FIRECRAWL_API_KEY:-}" ]]; then
  echo "error: FIRECRAWL_API_KEY is not set. Get one at https://firecrawl.dev" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/../docs"
BASE_URL="https://developer.jamendo.com/v3.0"

mkdir -p "$DOCS_DIR/read" "$DOCS_DIR/write"

# path -> output file (relative to docs/), one per line
PAGES=(
  "docs 00-introduction.md"
  "authentication 01-authentication.md"
  "response-codes 02-response-codes.md"
  "albums read/albums.md"
  "albums/file read/albums-file.md"
  "albums/tracks read/albums-tracks.md"
  "albums/musicinfo read/albums-musicinfo.md"
  "artists read/artists.md"
  "artists/tracks read/artists-tracks.md"
  "artists/albums read/artists-albums.md"
  "artists/locations read/artists-locations.md"
  "artists/musicinfo read/artists-musicinfo.md"
  "autocomplete read/autocomplete.md"
  "feeds read/feeds.md"
  "playlists read/playlists.md"
  "playlists/file read/playlists-file.md"
  "playlists/tracks read/playlists-tracks.md"
  "radios read/radios.md"
  "radios/stream read/radios-stream.md"
  "reviews/albums read/reviews-albums.md"
  "reviews/tracks read/reviews-tracks.md"
  "tracks read/tracks.md"
  "tracks/file read/tracks-file.md"
  "tracks/similar read/tracks-similar.md"
  "users read/users.md"
  "users/artists read/users-artists.md"
  "users/albums read/users-albums.md"
  "users/tracks read/users-tracks.md"
  "setuser/fan write/setuser-fan.md"
  "setuser/favorite write/setuser-favorite.md"
  "setuser/like write/setuser-like.md"
  "setuser/dislike write/setuser-dislike.md"
  "setuser/myalbum write/setuser-myalbum.md"
)

for entry in "${PAGES[@]}"; do
  path="${entry%% *}"
  out="${entry#* }"
  url="$BASE_URL/$path"
  dest="$DOCS_DIR/$out"

  echo "fetching $url -> docs/$out"

  response="$(curl -sS -X POST https://api.firecrawl.dev/v1/scrape \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg url "$url" '{url: $url, formats: ["markdown"], onlyMainContent: true}")")"

  ok="$(echo "$response" | jq -r '.success')"
  if [[ "$ok" != "true" ]]; then
    echo "  failed: $(echo "$response" | jq -r '.error // "unknown error"')" >&2
    continue
  fi

  echo "$response" | jq -r '.data.markdown' > "$dest"
done

echo "done. raw pages written to $DOCS_DIR/"
echo "next: normalize each file into the 8-section template (see docs/README.md)"
