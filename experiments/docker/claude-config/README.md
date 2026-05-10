# Container Claude config

Slim `~/.claude` equivalent for the batch container.
Deliberately **without** MCP servers, `additionalDirectories`, `statusLine`,
and anything else that depends on the host setup but is missing inside the
`node:22-slim` container (e.g. `fish`, `nvm`, host paths under `/home/memrich/...`).

## Contents

- `settings.json` — checked in, native OAuth backend, empty `mcpServers`
- `.credentials.json` — symlink to `~/.claude/.credentials.json` (gitignored).
  First-time setup: `ln -sf ~/.claude/.credentials.json .credentials.json`

The OAuth token stays fresh automatically through the symlink whenever the
host refreshes it.

## Activation

`docker-compose.yml` mounts this directory at `/home/experimenter/.claude`.
Override with `CLAUDE_CONFIG_DIR=/other/path ./batch.sh ...`.
