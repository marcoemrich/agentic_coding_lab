# Container Claude config

Schlankes `~/.claude`-Äquivalent für den Batch-Container.
Bewusst **ohne** MCP-Server, `additionalDirectories`, `statusLine` und alles
andere, was im Host-Setup hängt aber im `node:22-slim`-Container fehlt
(z.B. `fish`, `nvm`, Host-Pfade unter `/home/memrich/...`).

## Inhalt

- `settings.json` — eingecheckt, native OAuth-Backend, leeres `mcpServers`
- `.credentials.json` — Symlink auf `~/.claude/.credentials.json` (gitignored).
  Erst-Setup: `ln -sf ~/.claude/.credentials.json .credentials.json`

Der OAuth-Token wird durch den Symlink automatisch frisch gehalten, wenn der
Host ihn refresht.

## Aktivierung

`docker-compose.yml` mountet dieses Verzeichnis nach `/home/experimenter/.claude`.
Override via `CLAUDE_CONFIG_DIR=/anderer/pfad ./batch.sh ...`.
