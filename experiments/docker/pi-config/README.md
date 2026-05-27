# Container pi-config

Slim PI_CODING_AGENT_DIR for the batch container, analogous to `claude-config/`.

Contents:
- `agent/models.json` — Portkey provider definition (openai-completions transport, x-portkey-api-key header from env). Same content the user's local `~/.pi/agent/models.json` would carry.
- `agent/extensions/subagent/` — vendored subagent extension (sourced from `experiments/docker/pi-extensions/subagent/`, kept in sync manually). Provides the `subagent` tool that workflows like v6.2-with-why-cleaned-pi need for refactor isolation.

The container starts pi with `PI_CODING_AGENT_DIR=/home/experimenter/.pi/agent` (= bind-mount of this dir). Project-level skills/agents live in `<run_dir>/.pi/` and are discovered via cwd walk-up.

If `subagent` extension diverges from upstream, refresh via:
```
cp ~/.pi/agent/extensions/subagent/{index.ts,agents.ts,README.md} \
   experiments/docker/pi-config/agent/extensions/subagent/
```
