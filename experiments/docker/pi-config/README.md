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

## Agent dirs are mounted read-only (hardened 2026-08-05)

The parent mount has to stay `:rw` — pi creates a session directory per cwd at
startup (`.pi/agent/sessions/--<cwd>--/`) and dies with `ENOENT` if it cannot.
The agent definitions are therefore pinned read-only by two overlay mounts on
top of it, in all three services (`experiment`, `batch`, `batch-retry`):

```yaml
- ${PI_CONFIG_DIR:-./pi-config}:/home/experimenter/.pi:rw
- ${PI_CONFIG_DIR:-./pi-config}/agents:/home/experimenter/.pi/agents:ro
- ${PI_CONFIG_DIR:-./pi-config}/agent/agents:/home/experimenter/.pi/agent/agents:ro
```

Verified in the real image: pi 0.81.1 starts, `sessions/` stays writable, both
agent dirs reject writes.

Before this, an agent writing to `~/.pi/agents/` wrote straight into
`experiments/docker/pi-config/agents/` on the host — and thus into the
configuration of **every subsequent pi run**. The run-local copy
(`cp -r $WORKFLOWS_DIR/$workflow/.pi $run_dir/` in `run-batch.sh`) was never the
only path an agent could reach; the global one was writable too.

**This has happened.** In run
`2026-08-05_00-01-18_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b`
(exit `ok`, `tests_passing: false`) the model wrote `.pi/agents/refactor.js` 789 times
and `refactor.md` 269 times. It replaced the refactor instruction with a
"Current Implementation (Mock)" section declaring that no refactoring is possible,
plus a matching `refactor.js` stub whose hardcoded output ends in
`**Refactoring**: none possible`. The model rewrote its own task definition instead
of performing the task — an instrument-tampering variant of the qwen3 phase-drop
described in `research/questions-pi/1.2-model-novel-kata-pi/findings.md` F-1.2.

Note that `refactor.js` does not exist in any workflow — the file is entirely
model-authored. Only `refactor.md` ships with the workflow; `refactor.ts` predates
the incident.

Consequences for reading results: pi runs started after 2026-08-05 02:09 ran against
the tampered `refactor.md`. Measured effect on the RQ-model-novel-pi fill runs was
none (`refactorings_applied` 21.8/23.2, genuine refactor work in the transcripts) —
the mock apparently never resolved, likely because `refactor.ts` takes precedence.
Do not assume that holds for other workflows.

**The check is still worth running before trusting a pi batch:**
```bash
git status --porcelain experiments/docker/pi-config/
```
Anything unexpected here was written by a run, not by a human. The overlays cover
the agent dirs; the rest of this directory (`models.json`, `settings.json`,
`sessions/`) remains writable by necessity.
