---
name: run-rq
description: |
  Use this skill to drive a research question (RQ) end-to-end: validate the
  RQ README, generate a fill batch-plan, start the Docker batch in the
  background, monitor progress, run aggregation, and propose findings updates.
  Trigger when the user says "RQ-N voranbringen", "run-rq", "fill RQ-N",
  "run RQ-N", "Forschungsfrage N starten", or names a specific RQ-N directory
  in research/.
---

# Skill: run-rq

End-to-end orchestration for advancing a single research question (RQ) in this lab repo. **Pure orchestration** — every operation calls existing repo scripts; no new Python or Bash code is written.

## Argument

- `RQ-N` (e.g. `RQ-3`) or `research/RQ-N-*/` (path).
- If not given: infer from the last user turn, otherwise ask back ("Which RQ? e.g. RQ-3").

## Repo conventions (from the top-level `README.md` and memory)

- RQ directory: `research/RQ-{N}-*/` with `README.md`, `findings.md`, `runs.csv`, `summary.md`.
- Mandatory frontmatter fields: `id, question, factors, controls, outcomes, min_replicates, status`.
- Methodology constraint: v1/v2 only with `prompt: prose`; v3/v4/v5 with all three styles. If `factors.workflow_x_prompt` exists, no additional `factors.workflow` / `controls.workflow` is allowed.
- Active katas: `game-of-life`, `mars-rover`, `claim-office`. `controls.kata_base` must be from this set.
- Model IDs are **lab-variant IDs** (`opus-4-7`, `opus-4-7-no-thinking`, `opus-4-6-portkey`, `opus-4-6-portkey-no-thinking`, `sonnet-4-6`, `sonnet-4-6-no-thinking`, `sonnet-4-6-portkey`, `sonnet-4-6-portkey-no-thinking`, `haiku-4-5`, `haiku-4-5-no-thinking`, `haiku-4-5-portkey`, `haiku-4-5-portkey-no-thinking`). The `-portkey` suffix marks models routed via the Portkey gateway.
- Aggregation is query-based: ALL runs in `experiments/runs/` matching the selector query count — regardless of which batch produced them.
- Batch plan is idempotent: counts existing matches and only fills missing replicates up to `min_replicates`.

## Phases

Run sequentially. On errors in any phase, **stop and ask the user**, do not skip ahead.

---

### Phase 1 — Validate

1. Resolve the RQ path with Glob: `research/RQ-{N}-*/`. On multiple matches, take the first and inform the user.
2. Read `README.md`.
3. Parse the frontmatter block (between the first two `---` lines). Check mandatory fields: `id, question, factors, controls, outcomes, min_replicates, status`. Missing fields → abort phase, inform user.
4. Check methodology constraints:
   - If `factors.workflow_x_prompt` is set: no additional `factors.workflow` and no `controls.workflow` may be set.
   - In every `workflow_x_prompt` entry: if `workflow ∈ {v1-oneshot, v2-iterative}`, then `prompt == prose` is required.
   - `controls.kata_base ∈ {game-of-life, mars-rover}`.
   - Model values (in `controls.model` and/or `factors.model`) must appear in the lab-variant table.
5. Read `findings.md` (needed in phase 6 as the existing baseline).
6. Target computation: from `factors` × `controls` derive the cell count (every factor multiplies; paired factors like `workflow_x_prompt` count as a single factor with `len(pairing)` values). Target runs = cells × `min_replicates`. Report this number to the user.
7. **Portkey routing detection**: scan model values (in `controls.model` plus every `factors.model` entry) for a `-portkey` suffix. If any match:
   - Check `~/.claude.portkey/` directory exists. If missing: STOP, instruct the user to follow `experiments/docker/claude-config-portkey.README.md`. Do **not** start the batch.
   - Note: `batch.sh` auto-detects Portkey models from the plan JSON and sets `CLAUDE_CONFIG_DIR` automatically. No manual env-var needed in phase 3.

Output to user (compact):
```
RQ-N validated: <id>, <#cells> cells × min_replicates=<n> = <target> target runs.
status: <status>
[Portkey routing required — using ~/.claude.portkey/ profile]   ← only if portkey_required
```

---

### Phase 2 — Plan

1. Run dry-run:
   ```
   experiments/batch-plan-from-rq.py research/RQ-{N}-*/ --dry-run
   ```
2. Output contains the count of missing runs. Inform user:
   ```
   Cells: X, missing runs: Y → would write experiments/batch-plans/rq-{n}-fill.json
   ```
3. If `Y == 0`: no new runs needed — jump straight to phase 5.
4. Otherwise: get user confirmation ("Write the plan with Y runs now?"). Only proceed after explicit "yes".
5. Write the plan without `--dry-run`:
   ```
   experiments/batch-plan-from-rq.py research/RQ-{N}-*/
   ```
6. Briefly inspect the generated plan (Read on `experiments/batch-plans/rq-{n}-fill.json`) and summarize the cell distribution (`{kata, workflow, model}` frequencies) to the user.

---

### Phase 3 — Run

1. **Pre-check**:
   - `docker ps --filter name=docker-batch-run --format '{{.Names}}'` — if a container is running: STOP and ask the user whether the existing batch should finish first.
   - If `experiments/docker/batch.log` from an earlier run exists and is >0 bytes: ask the user whether to back it up as `experiments/docker/batch.<plan>.log` (`mv`, no deletion).
2. **User confirmation** before start: "Start batch `rq-{n}-fill` with Y runs in the background? Expected wallclock ≈ Y × 6 min ≈ Z min." (6 min/run per memory, smart-subset experience.) For Portkey RQs (flag from phase 1.7), append: "via Portkey gateway (auto-detected)".
3. Start with `--detach` (backgrounds the batch and disowns the process so the terminal can be closed safely):
   ```bash
   cd experiments/docker && ./batch.sh rq-{n}-fill --detach
   ```
   Portkey routing is **auto-detected** by `batch.sh`: it scans the plan JSON for `-portkey` model names and sets `CLAUDE_CONFIG_DIR=~/.claude.portkey` automatically. No manual env-var override needed. For sharded runs (>30 runs), add `--shards N` (max 6):
   ```bash
   cd experiments/docker && ./batch.sh rq-{n}-fill --shards 4 --detach
   ```
4. After a few seconds, determine the container name via `docker ps --filter name=docker-batch-run --format '{{.Names}}'` and report it to the user.

---

### Phase 4 — Monitor

1. Polling loop with `experiments/docker/watch-batch.sh rq-{n}-fill`:
   - First 5 min: snapshot every 60 s.
   - After that: every 5 min.
   - On every poll, report the counter `[N/total]` and container status.
2. Termination conditions:
   - `Container STOPPED` AND counter = `[total/total]` → success, continue to phase 5.
   - `Container STOPPED` AND counter < total → resume (phase 4b).
   - User signals abort → `docker stop <container>` → resume (phase 4b).
3. **Important**: Take memory patterns seriously:
   - `\b429\b` with `claude_exit != 0` = real rate limit; backup-warning with `backup.<ms>.json` (which can incidentally contain `429`) is to be IGNORED.
   - "Claude configuration file not found at: …" at container start is harmless.
   - Do not panic-retry when `watch-batch.sh` is once slow to respond.
4. **Mid-execution cleanup after stop**: the youngest run dir in `experiments/runs/` that lacks `analysis-report.md` OR `transcript.jsonl` was interrupted mid-execution. Ask the user: "Delete interrupted run dir `<run-dir>` (no analysis-report.md)?" Only delete with `rm -rf` after explicit "yes".

#### Phase 4b — Resume

1. Generate a resume plan:
   ```
   experiments/docker/resume-plan.sh rq-{n}-fill
   ```
   → writes `/tmp/rq-{n}-fill-resume.json`.
2. Show the size to the user (`jq '.runs | length' /tmp/rq-{n}-fill-resume.json`).
3. Get user confirmation: "Restart with `<m>` remaining runs?"
4. After "yes" — resume with `--detach` (Portkey auto-detected from plan content):
   ```bash
   cd experiments/docker && ./batch.sh /tmp/rq-{n}-fill-resume.json --detach
   ```
   Back to phase 4.

---

### Phase 5 — Aggregate

1. **Pipeline sanity check before aggregating** — pipeline bugs masquerade as research findings. Spot-check 2–3 of the matched runs (covering the workflow × model cells most central to the RQ) for divergence between `run.log` and `metrics.json`:
   - In `run.log` the agent typically reports a final test status (e.g. "All N tests pass", "experiment-done.txt written"). Compare this against `final_metrics.tests_passing` in `metrics.json`. If the agent reports green but `tests_passing` is `false`, that's a pipeline issue, not a workflow effect.
   - Grep `analysis-report.md` for known infrastructure failure patterns: `IGNORED_BUILDS`, `approve-builds`, `corepack`, `ENOENT`, `Cannot find module`, `tsc.*error`. These typically come from container/tooling drift (e.g. pnpm version bumps, missing deps), not from agent code.
   - For CLI-katas (`<basename>-verification/` exists): check `cli_built` in `metrics.json`. If `cli_built: false` for a run whose `src/cli.ts` exists and runs manually (`pnpm exec tsx src/cli.ts < scenario.input.json`), the verification stage misfired — re-run `analyze-run.sh <run_dir>` on the host (with absolute path).
   - If any of these checks fail: stop, report the suspected pipeline bug to the user, do NOT aggregate. Fixing buggy data after a finding has been drawn from it is much more expensive than spending two minutes on the spot-check.
2. Invoke:
   ```
   experiments/aggregate-by-query.py research/RQ-{N}-*/
   ```
3. Expected outputs:
   - `research/RQ-{N}-*/runs.csv` (one line per matched run)
   - `research/RQ-{N}-*/summary.md` (per-cell pivots for each `outcome`)
4. Read `summary.md` in full and summarize to the user — show the per-cell pivot tables individually.
5. Sanity check: does every cell have ≥ `min_replicates`? If not: warn and offer to jump back to phase 2 (additional runs).
6. **Plausibility cross-check before phase 6** — if any cell value contradicts a previously-stable finding by a large margin (e.g. a workflow that was 100% green is suddenly 0%), do NOT treat that as a new finding without first running the spot-check from step 1 against that exact cell. A "v4 is suddenly broken on game-of-life" type observation is more often a pipeline regression than a real shift.

---

### Phase 6 — Findings proposal

**Never write to `findings.md` automatically.** Only present a proposal in chat, then wait for explicit "yes, apply", then patch via `Edit`.

`findings.md` shows **only the current state**. No status tags (`✅ stabil` / `⚠️ bedingt` / `🚫 offen` / `❌ widerlegt`), no comparisons with archive snapshots or older studies, no "previously X, corrected" hints in the prose. Header form: `## F-x.y — title` (no `· …` suffix).

1. Diff sources:
   - **Existing**: `findings.md` from phase 1.
   - **New**: `summary.md` from phase 5.
2. Three possible actions per effect:
   - **New finding**: cell/factor group with Δ ≥ 1σ over the other groups AND the effect is not yet covered in `findings.md` → new `F-{N}.{M+1}` block (M = highest existing finding number).
   - **Update**: an existing finding covers the same effect, but cell values or interpretation have shifted → `Edit` on the existing block. Rewrite table and rationale, **without** old/new diff, **without** "previously X", **without** reference to archive snapshots.
   - **Deletion**: data contradicts the finding → get user confirmation, then remove the block including its `---` separator. Do not mark as "widerlegt".
3. Data gap: if an effect is suspected but coverage is too small for `n ≥ min_replicates` → note in `todos_and_ideas.txt` (section "Re-Check ungeprüfter Hypothesen aus alten findings.md") as a bullet with a concrete re-check target. **Do not** create as a finding in `findings.md`.
4. Format per proposal: statement / data-base table / rationale. Header `## F-x.y — title` with no suffix.
   **Glossary discipline**: terms like `code_mass`, `cc_loc`, `cc_longest_function`, `smell_total`, `verification_pct` are to be used only in the form from the glossary in the top-level `README.md` ("Code-Mass (APP)", "Produktiv-LoC", "Spitzen-Komplexität", "Smell-Summe", "Korrektheit (außen)") or directly via the metric ID in backticks. Synonyms like "Code-Volumen", "Code-Gesamtvolumen", "LoC-Größe" are forbidden — they are ambiguous or collide with established definitions (APP). Before patching the proposal, read the glossary once and check every term used in the block against the table.
5. Get user decision per proposal. On "yes", apply with `Edit`:
   - New finding: block at the end of `findings.md`.
   - Update: replace the existing `## F-x.y` block, removing any `· …` header suffix still in place.
   - Deletion: remove the block including the trailing `---` separator.
6. On "no": proposal stays in chat only, `findings.md` is unchanged.

---

## Out of scope (deliberately NOT in the skill)

- The actual batch execution inside the container (`run-batch.sh` runs in the container).
- ESLint / smell detection (runs per run inside `analyze-run.sh`).
- Cross-RQ aggregation or creation of new RQs.
- Auto-commit/push of `runs.csv` / `summary.md` / `findings.md` — stays a user decision.
- Worktree switching or merging into `main`.

## Behavior on errors

- **Phase 1 fails**: do not continue; give a clear constraint hint (e.g. "v1-oneshot with prompt=example-mapping violates the methodology constraint in the top-level README, section 'Methodology constraints'").
- **Phase 2/3 scripts with non-zero exit**: show output to the user; do NOT blindly retry.
- **Phase 4 loses the container**: show `docker ps -a`, then offer resume.
- **Phase 5 produces an empty `runs.csv`**: check whether `experiments/runs/` actually contains matching runs (selector too narrow?). Inform the user.
