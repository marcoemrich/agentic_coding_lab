# Container pi-config

Slim PI_CODING_AGENT_DIR for the batch container, analogous to `claude-config/`.

Contents:
- `agent/models.json` — Portkey provider definition (openai-completions transport, x-portkey-api-key header from env). Same content the user's local `~/.pi/agent/models.json` would carry.
- `agent/settings.json` — default provider/model.
- `agent/auth.json` — auth state.
- `agent/bin/` — vendored `fd` / `rg` binaries pi shells out to.

The container starts pi with `PI_CODING_AGENT_DIR=/home/experimenter/.pi/agent` (= bind-mount of this dir). Project-level skills, agents **and the subagent extension** live in `<run_dir>/.pi/` and are discovered by pi from the cwd (project-local extension dir = `cwd/.pi/extensions/`).

## subagent extension

The `subagent` extension is **no longer global**. It is now workflow-local, vendored inside the pi workflow that needs it:

```
experiments/workflows/v6.2-with-why-cleaned-pi/.pi/extensions/subagent/{index.ts,agents.ts,README.md}
```

pi's extension loader searches `cwd/.pi/extensions/` before the global `agent/extensions/`, so the workflow copy is the single source of truth — the workflow is self-contained and carries its own `subagent` tool. There is no global fallback.

If the extension diverges from upstream, refresh the workflow copy:
```
cp ~/.pi/agent/extensions/subagent/{index.ts,agents.ts,README.md} \
   experiments/workflows/v6.2-with-why-cleaned-pi/.pi/extensions/subagent/
```
