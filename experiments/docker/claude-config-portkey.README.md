# Container Claude config — Portkey variant

The batch container's default Claude profile (`./claude-config/`) talks to
the Anthropic API directly via OAuth. When the Anthropic-API rate limit
is reached, RQs can be routed through the Portkey gateway instead
(currently used by `RQ-rules` with model variant `opus-4-6-portkey`).

This file documents the **host-side setup** for the Portkey profile.

## Why a separate host directory

The Portkey profile contains a Portkey API key. To prevent the key from
ever reaching the repo, the profile lives **outside** the repository in
`~/.claude.portkey/`. The container picks it up via the existing
`CLAUDE_CONFIG_DIR` override that `docker-compose.yml` already supports.

`experiments/docker/.gitignore` also denies `claude-config-portkey/` and
`*.settings.portkey.json` inside the worktree as a belt-and-braces
measure — if you ever paste the profile into the repo by mistake, git
ignores it.

## One-time setup

```bash
mkdir -p ~/.claude.portkey

cat > ~/.claude.portkey/settings.json <<'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.portkey.ai",
    "ANTHROPIC_AUTH_TOKEN": "dummy",
    "ANTHROPIC_CUSTOM_HEADERS": "x-portkey-api-key: <YOUR_PORTKEY_KEY>",
    "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS": "1"
  },
  "permissions": {
    "allow": ["WebSearch", "Bash(npx vitest:*)"],
    "deny": [],
    "ask": []
  },
  "skipDangerousModePermissionPrompt": true,
  "mcpServers": {}
}
EOF

# Replace <YOUR_PORTKEY_KEY> with the real key, then lock it down:
chmod 600 ~/.claude.portkey/settings.json
```

**Important — profile must be stripped:**

- `mcpServers: {}` — empty. Host MCP servers spawned via `fish` (playwright,
  context7) hang the container init (`node:22-slim` has no fish/nvm).
  This issue is documented in repo memory under "Docker-Batch-Container
  Claude-Config".
- No `additionalDirectories` — they reference host paths that don't exist
  inside the container.
- No `statusLine` — it depends on host `jq` / `awk` and adds nothing in
  a non-interactive batch context.

## Per-batch invocation

The `run-rq` skill detects RQs whose model contains the `-portkey`
suffix and switches the invocation automatically. Manual equivalent:

```bash
cd experiments/docker
CLAUDE_CONFIG_DIR=~/.claude.portkey ./batch.sh rq-9-fill
```

`docker-compose.yml` already references `${CLAUDE_CONFIG_DIR:-./claude-config}`
for both `batch` and `batch-retry` services, so no compose changes are
needed.

## Smoke test

After setup, before launching a real batch:

```bash
docker run --rm \
  -v ~/.claude.portkey:/home/experimenter/.claude:rw \
  -v ~/.claude/.credentials.json:/home/experimenter/.claude/.credentials.json:rw \
  -e CLAUDE_THINKING=true \
  docker-batch \
  claude --print --model "@vertex-ai/anthropic.claude-opus-4-6" "Reply: pong"
```

Expected: `pong` within ~10s. If the call hangs: usually a stale
`mcpServers` entry or `additionalDirectories` in the profile.

## Rotating the key

The key only exists in `~/.claude.portkey/settings.json`. Overwrite the
file, the next batch picks up the new value. No rebuild needed.
