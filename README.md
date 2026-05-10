# Agentic Coding Lab

A lightweight research framework for systematically comparing agentic coding setups — models, agent architectures, and prompt strategies — using reproducible benchmarks.

## Motivation

When working with agentic coding, many practical questions arise: Does a setup with dedicated sub-agents for testing produce cleaner code than a single agent doing everything? Does Sonnet deliver better code quality than Opus on a refactoring task? How do different prompt styles affect the outcome? This framework was built to answer such questions with data instead of gut feeling.

## What This Framework Does

The framework runs controlled experiments across four dimensions:

- **Workflow variants** — from simple one-shot generation ("vibe coding") to structured TDD with specialized agents per phase
- **Model configurations** — Opus 4.7, Sonnet 4.6, Haiku 4.5, with and without extended thinking
- **Coding katas** — standardized tasks (currently game-of-life and mars-rover; see [Katas](#katas))
- **Prompt styles** — prose, example-mapping, user-story

Each experiment produces measurable metrics: token usage, code complexity, code smells, test coverage, TDD cycle discipline, and more.

Aggregation is **research-question-driven**: A research question (RQ) defines a selector query (factors × controls × outcomes) over `experiments/runs/`, and tooling generates `runs.csv` + `summary.md` on demand. Batch plans are pure data-collection helpers that fill missing replicates.

## Core Concept: Research-Question-Driven Aggregation

Earlier iterations of this lab were **batch-driven**: each batch produced its own results folder, and a finding was tied to "the batch it came from". That coupling made it hard to evolve hypotheses (every new analysis required a new batch) and hard to combine evidence across batches.

The current model decouples three concerns:

1. **A research question (RQ)** declaratively describes what is being studied — its factors, controls, outcomes, and required replicates.
2. **Runs** are produced once and live in a single flat pool (`experiments/runs/`), independent of any RQ or batch.
3. **Aggregations** are derived on demand by selecting all runs matching an RQ's frontmatter — across *all* batches that ever produced matching cells.

```
                                +--------------------+
                                |  research/RQ-N/    |
                                |  README.md         |
                                |  (frontmatter)     |
                                +---------+----------+
                                          |
                                          | factors × controls
                                          v
            +----------------+    +----------------+    +----------------+
            | aggregate-by-  |    | batch-plan-    |    |   findings.md  |
            | query.py       |    | from-rq.py     |    |  (curated)     |
            +-------+--------+    +--------+-------+    +----------------+
                    |                      |
                    | matches              | missing cells
                    v                      v
            +-----------------+    +------------------------+
            | experiments/    |    | experiments/           |
            | runs/  (pool)   |<---| batch-plans/<rq>-fill  |
            +-----------------+    +------------------------+
                       executed by docker/batch.sh
```

### What an RQ contains

Each `research/RQ-N-*/README.md` starts with YAML frontmatter that acts as a **selector query** over the run pool:

```yaml
---
id: RQ-1
question: "Does workflow choice affect code quality, correctness, TDD discipline?"
factors:                          # what varies
  workflow_x_prompt:
    - {workflow: v1-oneshot,         prompt: prose}
    - {workflow: v4-exact-subagents, prompt: example-mapping}
controls:                         # what is held constant
  kata_base: game-of-life
  model: opus-4-7-no-thinking
outcomes: [tests_passing, code_mass, smell_total, cc_longest_function, ...]
min_replicates: 3
status: active
---
```

The cartesian product of `factors × controls` produces **cells** — each cell is one `(kata, workflow, model)` combination that needs `min_replicates` runs.

**Terminology**:

- **Factor** — a variable that is *deliberately varied* across runs. The effect of a factor is what the RQ measures.
- **Control** — a variable that is *held constant* so it cannot confound the factor effect. A finding under `model: opus-4-7-no-thinking` is a finding *for that model*; transfer to other models is an open question, not an established result.
- **Outcome** — a metric that is *observed* per run.

Mixing values into a control (e.g. running additional `opus-4-6` replicates into an RQ controlled on `opus-4-7`) collapses the control into an uncontrolled factor and invalidates the comparison. To study a different model variant, open a new RQ — either with `model` as a factor (model-comparison RQ) or with the new value pinned as the control (separate finding, scoped to that model).

### Two tools, one frontmatter

- **`aggregate-by-query.py`** reads the frontmatter, selects every matching run from `experiments/runs/`, and writes `runs.csv` (raw data) + `summary.md` (pivots per outcome) into the RQ directory. Re-runs the moment new replicates land — no plan editing required.
- **`batch-plan-from-rq.py`** reads the same frontmatter, counts existing matches per cell, and emits `experiments/batch-plans/<rq>-fill.json` containing exactly the missing `(kata, workflow, model)` triples needed to reach `min_replicates`. Idempotent: if everything is already covered, the plan is empty.

Together: declare the question once → fill the gaps → re-aggregate.

### Frontmatter schema

```yaml
---
id: RQ-N
question: "Full text of the research question"
factors:                          # what varies
  <factor-name>: [<value>, ...]
  # OR for paired factors:
  workflow_x_prompt:
    - {workflow: v1-oneshot, prompt: prose}
    - ...
controls:                         # what is held constant
  kata_base: game-of-life         # kata base name without prompt suffix
  workflow: v4-exact-subagents    # only if no workflow_x_prompt factor
  prompt: example-mapping         # only if no prompt factor / pairing
  model: <lab-variant-id>         # e.g. opus-4-7-no-thinking (see model alias table)
outcomes: [<metric>, ...]         # which metrics are measured
min_replicates: N                 # per cell
status: active | partial | closed
---
```

**Selector resolution**: The selector query forms the effective kata ID as `<kata_base>-<prompt>`. `prompt` comes from `controls.prompt`, the `workflow_x_prompt` pairing, or `factors.prompt`.

### Outcome conventions

`outcomes` in the frontmatter are CSV column names from `runs.csv` (see `CSV_COLUMNS` in `experiments/aggregate-by-query.py`). `aggregate-by-query.py` picks the pivot type automatically:

| Value type / naming        | Pivot form                                                     |
|----------------------------|----------------------------------------------------------------|
| Boolean                    | rate_% (share of `true`)                                       |
| Numeric                    | mean / min / max / std over the cell                           |
| Suffix `<X>_correct_rate`  | **pooled** rate from `<X>_correct` and `<X>_total`: Σ/Σ × 100  |

**Pooled rate**: Used for success rates with numerator/denominator per run, e.g. `predictions_correct_rate` → Σ`predictions_correct` / Σ`predictions_total`. Preferred over the mean of per-run rates because runs with small denominators would otherwise be over-weighted.

### Methodology constraints

These rules apply lab-wide and are respected by every RQ.

#### Workflow → permitted prompt styles

For methodological symmetry:

| Workflow | Permitted prompt styles | Rationale |
|---|---|---|
| v1-oneshot, v2-iterative | only **prose** | Concrete examples in the prompt nudge the agent toward starting with tests, which contaminates the non-TDD condition — the whole point of v1/v2 is to observe what happens when the agent is *not* steered into test-first. |
| v3-basic-tdd, v4-exact-subagents, v5-exact-single-context | **prose, example-mapping, user-story** | Examples serve as natural test cases — for TDD workflows this is the ideal task shape. |

Consequences for RQ design:

- **Workflow as factor**: Factor is named `workflow_x_prompt` and is a paired list of `{workflow, prompt}` tuples. Default pairing: v1/v2 → prose, v3/v4/v5 → example-mapping (the so-called "fair" comparison).
- **Workflow as control**: `controls.workflow` and `controls.prompt` are set together, respecting the constraint.

#### Code-quality signal limited to game-of-life and mars-rover

From the re-evaluation of an earlier 235-run study, three constraints are stable:

1. **Classic katas live in training data** (string-calculator, pixel-art-scaler, etc.). Models solve them too trivially — `smell_total = 0` consistently.
2. **Pixel-art-scaler is not usable as a novel-kata sanity check** (no workflow or model differentiation).
3. **Code-quality signal is only visible on game-of-life and mars-rover.** Statements about `smell_total`, `cc_longest_function`, etc. must be based on these katas — cross-kata averages over trivial katas dilute the signal.

**Consequence for RQs**: All current RQs use `kata_base: game-of-life` as the default. mars-rover stays available for cross-kata validation once enough replicates exist. Generalizability claims about arbitrary katas are 🚫 not testable with the current design.

**New novel kata**: `claim-office` was added as a fresh, non-classic kata with enough complexity to differentiate workflows and models. It is not in training data and ships with an external acceptance suite (see [CLI katas](#cli-katas-with-external-acceptance-suite)), so correctness is measured from the outside via `verification_pct`. Once enough replicates land, it becomes the second carrier of the code-quality signal alongside game-of-life.

### Timeouts as a research finding

Each run has a hard wallclock budget (default 90 min, set via `CLAUDE_TIMEOUT_SECONDS=5400` in `run-batch.sh`). When a `(workflow, model, kata)` cell systematically hits this limit, that's **not a data error** — it is itself the finding: the variant is impractical within the chosen cost frame.

Consequences for analysis and data collection:

- **Timeout runs are not deleted.** Their `metrics.json` is preserved with `run_status.exit_reason = "timeout"`. `tests_passing`, `verification_pct`, `code_mass`, etc. are `null`.
- **Exhausted retry budgets** (`exit_reason = "rate-limited"` or `"transient-api-error"`) are also folded into `completed_within_budget = false` — not because the wallclock ran out, but because a (workflow, model, kata) cell that repeatedly trips rate limits or transient API errors is *practically* unusable inside the lab's cost/availability envelope. Configurable via `BATCH_RATELIMIT_RETRIES` (default 5).
- **They count toward `min_replicates`.** `batch-plan-from-rq.py` treats a timeout as a legitimate data point — no refill is generated for timeout cells.
- **`completed_within_budget`** (Boolean, derived from `exit_reason`) is available as an outcome and reports the share of "finished within budget" per cell. Sensible as an outcome in any RQ whose factors vary workflow or model.
- **`n_ok` column** in the cell coverage table of `summary.md` only counts successful runs; a "3 timeouts, 0 OK" cell is flagged ⚠️ even when `min_replicates` is formally met.

### Findings status legend

- `✅ stabil` — data robustly supports the finding (n≥3, clear signal)
- `⚠️ bedingt` — only holds under a qualifying condition (named in the finding)
- `❌ widerlegt` — data clearly contradicts the finding
- `🚫 offen` — data basis missing; status open

### Key files and their meaning

| File | Owner | Lifespan | Purpose |
|------|-------|----------|---------|
| `research/RQ-N/README.md` | human-curated | persistent | The question, its frontmatter selector, hypotheses, design rationale |
| `research/RQ-N/findings.md` | human-curated | persistent, **growing** | Numbered findings with status flags. Survives data refreshes |
| `research/RQ-N/runs.csv` | generated by `aggregate-by-query.py` | regenerated on demand | Flat table of all runs matching the selector |
| `research/RQ-N/summary.md` | generated by `aggregate-by-query.py` | regenerated on demand | Pivot tables per outcome × cell |
| `experiments/runs/<id>/metrics.json` | produced per run | immutable artefact | The atomic data point — every aggregation traces back here |
| `experiments/batch-plans/<rq>-fill.json` | generated by `batch-plan-from-rq.py` | regenerated, throwaway | Missing-cell list for the next batch run |
| `research/_archive/` | human-curated snapshot | frozen | Past analyses preserved with mapping tables to current RQ findings |

## Repository Structure

```
.
├── .claude/
│   └── skills/                   # Claude Code skills for repo workflows
│       ├── run-rq/               #   /run-rq RQ-N — drive an RQ end-to-end
│       └── build-overview/       #   /build-overview — generate cross-RQ snapshot
├── experiments/
│   ├── katas/                            # Coding exercises (problem definitions)
│   ├── workflows/                        # Workflow variants (v1–v5)
│   ├── runs/                             # Recorded experiment results (flat pool)
│   ├── batch-plans/                      # JSON batch specs (auto-generated per RQ)
│   ├── docker/                           # Containerized batch execution
│   ├── record-run.sh                     # Run a single experiment interactively
│   ├── analyze-run.sh                    # Generate analysis-report.md + metrics.json for a run
│   ├── reanalyze-all-runs.sh             # Backfill metrics across every existing run
│   ├── aggregate-by-query.py             # RQ frontmatter → runs.csv + summary.md
│   ├── batch-plan-from-rq.py             # RQ frontmatter → batch plan filling missing cells
│   ├── analyze_transcript.py             # Parse transcript.jsonl for TDD-cycle metrics
│   └── generate-snapshot-skeleton.py     # Cross-RQ snapshot skeleton (used by /build-overview)
├── research/
│   ├── RQ-1-workflow-effect/     # Per-RQ:
│   │   ├── README.md             #   frontmatter selector + question + hypotheses
│   │   ├── findings.md           #   curated, growing list of numbered findings
│   │   ├── runs.csv              #   generated: raw data of all matching runs
│   │   └── summary.md            #   generated: pivot tables per outcome × cell
│   ├── RQ-2-prompt-style/
│   ├── ...                       # one directory per active RQ
│   ├── kata-design/              # kata construction guidelines
│   └── _archive/                 # frozen snapshots of past analyses + experiment-overview snapshots
├── HUMAN-IN-THE-LOOP.md          # Optional HITL checkpoint guide
├── WORKTREE-WORKFLOW.md          # Persistent agent-worktree convention
└── todos_and_ideas.txt           # Future research directions
```

## Workflow Variants

| Variant | Approach | Description |
|---------|----------|-------------|
| **v1-oneshot** | No TDD | Direct implementation in one shot ("vibe coding" baseline) |
| **v2-iterative** | No TDD | Iterative prompting with plan/checklist |
| **v3-basic-tdd** | Minimal TDD | Just "use TDD" — no detailed rules |
| **v4-exact-subagents** | Structured TDD | Each TDD phase (red/green/refactor) runs in a separate, isolated agent |
| **v5-exact-single-context** | Structured TDD | All TDD phases run in one continuous context using inline skills |

### v1-oneshot (No TDD baseline)

Single agent reads requirements, writes code, then adds tests after the fact. Baseline that measures the value of TDD itself. Tests are added based on the Example Mapping for fair comparison.

```
v1-oneshot/.claude/
└── rules/
    └── experiment-mode.md     # Non-TDD approach + output format
```

### v2-iterative (No TDD, iterative)

Single agent builds an explicit checklist, implements step by step, then adds tests after. Measures whether structured iteration alone (without TDD) improves over one-shot.

```
v2-iterative/.claude/
└── rules/
    └── experiment-mode.md     # Iterative approach + output format
```

### v3-basic-tdd (TDD control)

Single agent with minimal TDD rules — no phase-specific guidance, no agent spawning. Claude decides how to structure its TDD process. Lowest TDD overhead, maximum flexibility.

```
v3-basic-tdd/.claude/
└── rules/
    └── experiment-mode.md     # Minimal TDD guidance + output format
```

### v4-exact-subagents

Each TDD phase runs as a specialized subagent with isolated context, invoked via the `Task` tool with `subagent_type` parameter.

```
Main Agent
    ├── Task(test-list) → Creates test list      [isolated context]
    ├── Task(red)       → Activates test         [isolated context]
    ├── Task(green)     → Minimal implementation [isolated context]
    └── Task(refactor)  → Improves code          [isolated context]
```

Hypothesis: isolated contexts enforce discipline but may lose state between phases. Fresh context per phase avoids accumulated noise; comes with agent-spawning overhead.

```
v4-exact-subagents/.claude/
├── agents/                    # Subagent definitions
│   ├── test-list.md
│   ├── red.md
│   ├── green.md
│   └── refactor.md
└── rules/
    ├── tdd.md                 # Main TDD rules (uses Task tool)
    ├── tdd_with_ts_and_vitest.md
    └── tdd-experiment-mode.md # Autonomous mode for experiments
```

### v5-exact-single-context

All TDD phases run in one continuous context using inline skills via the `Skill` tool.

```
Single Agent
    ├── Skill(/test-list) → Creates test list      [same context]
    ├── Skill(/red)       → Activates test         [same context]
    ├── Skill(/green)     → Minimal implementation [same context]
    └── Skill(/refactor)  → Improves code          [same context]
```

Hypothesis: shared context maintains state but may lead to less discipline. No agent-spawning overhead; risk of context pollution / over-implementation.

```
v5-exact-single-context/.claude/
├── commands/                  # Skill definitions (inline execution)
│   ├── test-list.md
│   ├── red.md
│   ├── green.md
│   └── refactor.md
└── rules/
    ├── tdd.md                 # Main TDD rules (uses Skill tool)
    ├── tdd_with_ts_and_vitest.md
    └── tdd-experiment-mode.md # Autonomous mode for experiments
```

### Key differences

| Aspect | v1-oneshot | v2-iterative | v3-basic-tdd | v4-exact-subagents | v5-exact-single-context |
|--------|------------|--------------|--------------|--------------------|-------------------------|
| **TDD** | ❌ No | ❌ No | ✅ Yes (minimal) | ✅ Yes (strict) | ✅ Yes (strict) |
| **Mechanism** | Direct code | Checklist | None | `Task(subagent_type: "red")` | `Skill(skill: "red")` |
| **Context** | Single | Single | Single | Isolated per phase | Shared across phases |
| **Guidance** | None | Plan/checklist | Minimal TDD | Specialized agents | Inline skills |
| **Definitions** | None | None | None | `agents/*.md` | `commands/*.md` |
| **Overhead** | None | None | None | Agent spawning | None |

## Model Configurations

The runner pins the full Claude API model ID per config. The short aliases `opus` / `sonnet` are intentionally avoided because they currently resolve to legacy versions (e.g. `opus` → `claude-opus-4-6`, not Opus 4.7). Bump these entries when new model versions ship.

In RQ frontmatter, **lab-variant IDs** are pinned — not the Claude API IDs (`claude-opus-4-7`), not the short aliases (`opus`). A lab-variant ID uniquely combines model and thinking mode:

| Lab-variant ID | API model ID | Thinking | Mechanism |
|---|---|---|---|
| `opus-4-7`               | `claude-opus-4-7`           | Adaptive | Default behavior |
| `opus-4-7-no-thinking`   | `claude-opus-4-7`           | Off      | `MAX_THINKING_TOKENS=0` |
| `sonnet-4-6`             | `claude-sonnet-4-6`         | Extended | Default behavior |
| `sonnet-4-6-no-thinking` | `claude-sonnet-4-6`         | Off      | `MAX_THINKING_TOKENS=0` |
| `haiku-4-5`              | `claude-haiku-4-5-20251001` | Extended | Default behavior |
| `haiku-4-5-no-thinking`  | `claude-haiku-4-5-20251001` | Off      | `MAX_THINKING_TOKENS=0` |

The ID exactly matches the `model` field in `metrics.json` and the suffix in the run directory name. Source: `MODEL_CONFIGS` in `experiments/record-run.sh` and `experiments/docker/run-batch.sh`.

## Katas

Katas live under `experiments/katas/<basename>-<prompt-style>/prompt.md`. The directory name typically ends with one of `-prose`, `-user-story`, or `-example-mapping` (the prompt style); the part before is the **basename**.

Currently maintained kata families: **game-of-life** and **mars-rover** (each with all three prompt styles), plus the CLI kata family **claim-office**. Older classic katas (string-calculator, pixel-art-scaler, diamond) were dropped because training-data contamination collapses the code-quality signal — see [Methodology constraints](#methodology-constraints).

For deeper guidance on building good katas (ambiguity construction, ruling strategies, test-suite distribution, anti-patterns), see `research/kata-design/kata-construction.md`.

### CLI katas with external acceptance suite

For katas where correctness should be measured against a fixed acceptance suite that the implementer does not see (e.g. `claim-office`), add a sibling directory `katas/<basename>-verification/` with:

- `runner.json` — `{"command": "...", "timeout_seconds": 30}`. For TypeScript CLIs: `pnpm exec tsx src/cli.ts` (assumes `tsx` is in the run's devDependencies; the standard pnpm template includes it).
- `scenarios/NN-name.input.json` — JSON document piped as stdin.
- `scenarios/NN-name.expected.json` — expected JSON on stdout (compared canonically via `jq -S .`).
- Optional `scenarios/NN-name.story.md` for narrative scenarios used in workshop reuse.

Conventions:

- The implementation's CLI entry point must be at `src/cli.ts`.
- The prompt must specify "CLI executable that reads JSON from stdin and writes JSON to stdout".
- The kata's prompt does **not** include the verification scenarios — they are private acceptance tests measured by `analyze-run.sh` after the run completes.

After each run, `analyze-run.sh` automatically detects the `<basename>-verification/` directory, pipes each scenario input into the CLI (in the run directory), and compares canonical JSON output against the expected JSON. Per-scenario results land in `verification.log`; counts go into `metrics.json` as `final_metrics.verification_total`, `verification_passed`, and `verification_pct` (a fraction 0.0–1.0). For non-CLI katas without a verification directory, these fields are 0/null.

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Anthropic API key (or compatible provider)

### Run a single experiment locally

```bash
cd experiments
./record-run.sh
```

This interactively prompts you to select a kata, workflow, and model, then launches Claude Code to execute the task. Results are saved to `experiments/runs/<timestamp>_<kata>_<workflow>_<model>/`.

### Run a batch via Docker

```bash
cd experiments/docker
cp .env.example .env          # add your API key
docker compose build
```

Then either run an existing batch plan or generate one for a research question:

```bash
# Generate a fill plan for an RQ (only missing replicates)
./experiments/batch-plan-from-rq.py research/RQ-3-model-and-thinking/

# Execute the batch
./experiments/docker/batch.sh experiments/batch-plans/rq-3-fill.json
```

### Aggregate results for a research question

```bash
./experiments/aggregate-by-query.py research/RQ-1-workflow-effect/
```

This reads the RQ frontmatter, selects all matching runs from `experiments/runs/`, and writes `runs.csv` + `summary.md` into the RQ directory. Findings are then curated by hand into `findings.md` with status flags (`✅ stabil`, `⚠️ bedingt`, `❌ widerlegt`, `🚫 offen`).

### End-to-end loop

```bash
# 1. Plan: generate the missing cells for an RQ
./experiments/batch-plan-from-rq.py research/RQ-3-model-and-thinking/

# 2. Execute: run the batch in Docker
./experiments/docker/batch.sh experiments/batch-plans/rq-3-fill.json

# 3. Aggregate: re-derive runs.csv + summary.md
./experiments/aggregate-by-query.py research/RQ-3-model-and-thinking/

# 4. Curate: update findings.md with new evidence and status flags
```

## Skills

Two Claude Code skills automate the repetitive parts of the loop above. They live in `.claude/skills/` and are invoked as slash commands inside Claude Code.

| Skill | Invocation | Purpose |
|-------|------------|---------|
| [`run-rq`](.claude/skills/run-rq/SKILL.md) | `/run-rq RQ-N` | Drives a single RQ end-to-end: validates the README, generates a fill batch-plan, starts the Docker batch in the background, monitors progress, runs aggregation, proposes findings updates. Pure orchestration — every step calls existing repo scripts. |
| [`build-overview`](.claude/skills/build-overview/SKILL.md) | `/build-overview` | Generates a cross-RQ snapshot under `research/_archive/experiment-overview-YYYY-MM-DD.md`. Step 1 runs `experiments/generate-snapshot-skeleton.py` (data sections, finding lists, caveats). Step 2 fills synthesis sections (RQ paragraphs, cross-RQ synthesis, limitations) from the current `findings.md`. Reproducible because numbers come from the skeleton, not from model memory. |

The skills replace the manual end-to-end loop in routine usage:

```
   manual                   ⇒    skill
   ------------------------       ----------------
   batch-plan-from-rq.py
   batch.sh                  ⇒    /run-rq RQ-N
   watch-batch.sh
   aggregate-by-query.py

   read all findings.md
   write overview.md         ⇒    /build-overview
```

### Snapshot lifecycle

`findings.md` is **alive** — findings grow, status tags get updated, individual findings can be revised or discarded. For publishable point-in-time reports (table-heavy, cross-RQ synthesis) there are **snapshots** under `research/_archive/experiment-overview-YYYY-MM-DD.md`.

1. `experiments/generate-snapshot-skeleton.py` builds a skeleton with all data sections (data-base figures, coverage, raw finding lists per RQ, caveats section over all ⚠️/❌/🚫 findings).
2. The `/build-overview` skill fills the synthesis sections (RQ paragraphs, cross-RQ synthesis, conclusions) from `findings.md` and writes to `research/_archive/`.

`findings.md` stays the single source of truth, and the snapshot is **reproducible** rather than written from model memory.

## Script Reference

All scripts are designed to be run from the repo root unless noted otherwise. `.py` scripts use Python 3 with PyYAML + pandas; `.sh` scripts are bash.

### Run lifecycle (top-level `experiments/`)

| Script | Purpose |
|--------|---------|
| `experiments/record-run.sh` | Interactive: pick kata + workflow + model, launch Claude Code locally, record everything into `experiments/runs/<id>/`. Used for ad-hoc single runs outside Docker. |
| `experiments/analyze-run.sh` | Post-process one run directory: install pnpm deps, run vitest + ESLint+SonarJS, call `analyze_transcript.py`, emit `analysis-report.md` and `metrics.json`. Idempotent — safe to re-run after pipeline fixes. |
| `experiments/reanalyze-all-runs.sh` | Backfill metrics for every existing run after `analyze-run.sh` is extended (e.g. new fields like `mccabe_*` / `cognitive_*`). Iterates over every `runs/<run>/`, runs `pnpm install` against the shared `runs/.pnpm-store` for any run missing `node_modules/`, and re-invokes `analyze-run.sh`. Output to `experiments/reanalyze.log` (gitignored). |
| `experiments/analyze_transcript.py` | Parse `transcript.jsonl` (+ `transcript-subagents/`) for TDD-cycle metrics: phase inference, prediction accuracy, refactorings applied, token totals, context-window utilization. Writes `transcript-metrics.json`. |

### Aggregation

| Script | Purpose |
|--------|---------|
| `experiments/aggregate-by-query.py` | Reads an RQ frontmatter, selects matching runs from the pool, writes `runs.csv` + `summary.md` into the RQ directory. The canonical aggregator. |
| `experiments/batch-plan-from-rq.py` | Reads an RQ frontmatter, computes missing cells against `min_replicates`, writes `experiments/batch-plans/<rq-id>-fill.json`. Idempotent — empty plan if everything is covered. |
| `experiments/generate-snapshot-skeleton.py` | Reads all `research/RQ-*/README.md` + `findings.md`, emits a Markdown skeleton to `/tmp/snapshot-skeleton-YYYY-MM-DD.md` with data sections (run counts, coverage per RQ, finding lists sorted by status, cross-RQ caveats) pre-filled and synthesis sections marked with `<!-- TODO Claude -->`. Consumed by the `/build-overview` skill. |

### Docker batch execution (`experiments/docker/`)

| Script | Purpose |
|--------|---------|
| `docker/batch.sh` | Convenience wrapper around `docker compose --profile batch run --rm batch`. Accepts a plan name or path: `./batch.sh rq-3-fill` or `./batch.sh /abs/path/plan.json`. Tees output to `batch.<plan>.log`. Supports `--shards N` for parallel runs (round-robin split, default 2, do not exceed 3 due to memory + API rate-limit pressure) and `--detach` for background execution. |
| `docker/run-batch.sh` | The *inside-container* entrypoint invoked by `batch.sh`. Reads the plan, executes each `(kata, workflow, model)` triple via Claude Code, calls `analyze-run.sh`, copies transcripts. Not normally invoked directly. |
| `docker/list-plans.sh` | Print every `experiments/batch-plans/*.json` with name, description, and run count. Useful before kicking off a batch. |
| `docker/resume-plan.sh` | Compute remaining work for a plan: subtract triples already present in `experiments/runs/` from the original plan, write `/tmp/<plan>-resume.json`. Useful after a crashed/cancelled batch. |
| `docker/watch-batch.sh` | Status snapshot of running or recently finished batches. Auto-detects all `docker-batch-run-*` containers; falls back to the last entry in `batch.log` if none running. Reports per-cell progress, ETAs, and tail of `run.log`. Pass a plan name to scope to one batch. |

### Typical sequences

**Fill a research question:**

```bash
./experiments/batch-plan-from-rq.py research/RQ-3-model-and-thinking/
./experiments/docker/list-plans.sh                          # verify
./experiments/docker/batch.sh rq-3-fill                     # run
./experiments/docker/watch-batch.sh                         # monitor in another shell
./experiments/aggregate-by-query.py research/RQ-3-model-and-thinking/
```

**Recover from an interrupted batch:**

```bash
./experiments/docker/resume-plan.sh rq-3-fill               # writes /tmp/rq-3-fill-resume.json
./experiments/docker/batch.sh /tmp/rq-3-fill-resume.json
```

**Re-derive metrics for a single run after a pipeline fix:**

```bash
./experiments/analyze-run.sh experiments/runs/2026-05-04_*_v4-exact-subagents_opus-4-7
```

## Docker Setup

Run experiments in isolated, reproducible Docker containers.

### Setup

```bash
cd experiments/docker

# Copy and edit environment file
cp .env.example .env

# Set your user/group IDs (fixes volume permissions)
echo "USER_ID=$(id -u)" >> .env
echo "GROUP_ID=$(id -g)" >> .env

# Edit .env with your API credentials (direct or Portkey)

# Build
docker compose build
```

### Running

```bash
# List all available plans with description and run count
./list-plans.sh

# Run a plan (extension and full path optional)
./batch.sh smoke-test
./batch.sh /abs/path/to/plan.json
```

Plan files live in `experiments/batch-plans/*.json` and list explicit `{kata, workflow, model}` triples. They are validated fail-fast against available katas, workflows, and the hard-coded `MODEL_CONFIGS` list — typos abort before any Claude call.

Plan file schema:

```json
{
  "name": "Optional plan name",
  "description": "Optional description",
  "runs": [
    { "kata": "game-of-life-prose", "workflow": "v3-basic-tdd", "model": "sonnet-4-6" }
  ]
}
```

`model` is the lab-variant ID from `MODEL_CONFIGS` in `run-batch.sh` (e.g. `sonnet-4-6`, `opus-4-7-no-thinking`, `haiku-4-5`), not the full API ID.

### Per-run hardening

Each run is wrapped with a 90-minute timeout (override via `CLAUDE_TIMEOUT_SECONDS=...`). Stdout/stderr is captured to `runs/<run>/run.log`. Transient API errors (rate limits, 429, overloaded) are retried with backoff up to 5 times; if they persist, the run is recorded with `exit_reason = "rate-limited"` or `"transient-api-error"` and the batch continues. Each `metrics.json` gets a `run_status` block with `exit_code`, `exit_reason`, and `rate_limited`.

### Container details

- **Base image**: `node:22-slim`
- **Tools**: Node.js 22, pnpm, TypeScript, Vitest, Claude Code CLI, jq, git
- **Resource limits**: 2 CPUs, 4 GB memory (override in `docker-compose.yml` if needed)
- **Security**: non-root user (`experimenter`), read-only mounts for katas/workflows, API key mounted securely

### Volume mounts

| Host path | Container path | Mode |
|-----------|----------------|------|
| `../katas` | `/home/experimenter/experiments/katas` | ro |
| `../workflows` | `/home/experimenter/experiments/workflows` | ro |
| `../runs` | `/home/experimenter/experiments/runs` | rw |
| `~/.anthropic/api_key` | `/home/experimenter/.anthropic/api_key` | ro |
| `~/.claude` | `/home/experimenter/.claude` | rw |

### Environment variables

**Direct Anthropic API**

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | API key for Claude | (required) |
| `ANTHROPIC_API_KEY_FILE` | Path to file with API key | `~/.anthropic/api_key` |
| `CLAUDE_CONFIG_DIR` | Claude config directory | `~/.claude` |
| `CLAUDE_TIMEOUT_SECONDS` | Per-run wallclock budget | `5400` (90 min) |

**Portkey gateway (or other proxy)**

| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_BASE_URL` | Proxy URL | `https://api.portkey.ai` |
| `ANTHROPIC_AUTH_TOKEN` | Auth token (can be dummy for Portkey) | `dummy` |
| `ANTHROPIC_CUSTOM_HEADERS` | Custom headers for proxy | `x-portkey-api-key: your-key` |

**Container user (volume permissions)**

| Variable | Description | Default |
|----------|-------------|---------|
| `USER_ID` | Container user UID (run `id -u`) | `1000` |
| `GROUP_ID` | Container user GID (run `id -g`) | `1000` |

### Troubleshooting

**API key issues**

```bash
docker compose run --rm experiment cat /home/experimenter/.anthropic/api_key
```

**Permission errors**

The container user must match your host user. Ensure `USER_ID` and `GROUP_ID` in `.env` match your system:

```bash
id -u  # USER_ID
id -g  # GROUP_ID
docker compose build --no-cache
# Or fix existing runs directory:
sudo chown -R $(id -u):$(id -g) ../runs
```

## Metrics

Each run is evaluated on metrics extracted from two sources: direct code analysis of generated files, and the AI-generated `experiment-summary.md`. All metrics live in `metrics.json` per run; the analysis pipeline (ESLint with `sonarjs/cognitive-complexity`, `max-depth`, etc.) runs inside the Docker batch container.

The **Term (binding)** column gives the canonical name to use in `findings.md`, `summary.md`, and snapshots. These terms are binding — alternatives like "Code-Volumen", "Code-Gesamtvolumen", or "LoC-Größe" for `code_mass` are forbidden because they are ambiguous or collide with established definitions from the software-craftsmanship literature. When in doubt, cite the metric ID in backticks.

### Run outcomes

| Metric | Term (binding) | Source | Description |
|--------|----------------|--------|-------------|
| `duration_seconds` | — | metrics.json | Wall-clock time for the complete task |
| `tests_passing` | **Korrektheit (innen)** | test runner | Whether the implementer's own Vitest tests pass — the "inside view" of correctness |
| `verification_pct` | **Korrektheit (außen)** | external acceptance suite | For CLI katas with a sibling `<basename>-verification/` directory: fraction of acceptance scenarios passed (0.0–1.0). The "outside view" of correctness — measured against scenarios the implementer did not see during the run. `null` for katas without a verification suite. |

### Code-quality metrics

| Metric | Term (binding) | Source | Description |
|--------|----------------|--------|-------------|
| `code_mass` | **Code-Mass (APP)** | code analysis | Weighted sum of code constructs (constants, invocations, conditionals, loops, assignments — heavier weights for higher-complexity constructs) following the *Absolute Priority Premise* by Micah Martin. Aims to compare implementations objectively beyond raw LoC. Lower = simpler. See [Code Cop blog](http://blog.code-cop.org/2016/08/absolute-priority-premise-example.html). |
| `cc_loc` | **Produktiv-LoC** | code analysis | Production LoC only, from the clean-code reporter (no tests) |
| `test_lines` | **Test-LoC** | code analysis | Vitest test code |
| `smell_total` | **Smell-Summe** | [ESLint](https://eslint.org/) + [`eslint-plugin-sonarjs`](https://github.com/SonarSource/eslint-plugin-sonarjs) | Aggregated code-smell count. Sub-counters `smell_complexity`, `smell_duplication`, `smell_magic_numbers`, `smell_code_quality` group SonarJS rules (e.g. `no-duplicate-string`, `no-collapsible-if`) plus a few ESLint built-ins (`max-depth`, `max-lines-per-function`, `max-params`, `no-magic-numbers`, `no-unreachable`). |
| `cc_longest_function` | **Spitzen-Komplexität** | code analysis | Longest function in lines (complexity peak per run) |
| `cc_avg_loc_per_function` | — | code analysis | Mean function length in lines |
| `cc_median_loc_per_function` | — | code analysis | Median function length in lines (robust against single long outliers) |
| `mccabe_max`, `mccabe_avg`, `mccabe_high_count` | — | ESLint [`complexity`](https://eslint.org/docs/latest/rules/complexity) rule | McCabe cyclomatic complexity per function — max, mean, and count of functions above the threshold |
| `cognitive_max`, `cognitive_avg`, `cognitive_high_count` | — | ESLint [`sonarjs/cognitive-complexity`](https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/cognitive-complexity.md) | Cognitive complexity per function (SonarSource metric, weights nesting and control-flow breaks heavier than McCabe) — max, mean, and count above threshold |

### Token & context metrics

| Metric | Description |
|--------|-------------|
| `tokens_total` | Total tokens consumed (input + output + cache) |
| `context_utilization` | Final context-window utilization percentage |

v4-exact-subagents keeps the main context low because each agent has fresh context. v5-exact-single-context accumulates tokens, so utilization is higher.

### TDD discipline metrics

| Metric | Description |
|--------|-------------|
| `tdd_cycles` | Number of red-green-refactor cycles (TDD workflows only); should match test count for proper discipline |
| `prediction_accuracy` | Correctness of red-phase failure predictions (v4/v5). Higher accuracy shows deeper understanding of code state |
| `refactorings` | Number of refactoring improvements applied. More refactorings indicate better discipline and cleaner final code |
| `tests_immediately_passing` | Tests passing immediately in red phase, indicating over-implementation. Lower is better |

### Run status

| Field | Description |
|-------|-------------|
| `run_status.exit_code` | Process exit code |
| `run_status.exit_reason` | `ok`, `timeout`, `rate-limited`, `transient-api-error`, etc. |
| `completed_within_budget` | Boolean derived from `exit_reason`; available as an outcome in any RQ |

## Adding New Experiments

### New kata

Create `experiments/katas/<kata-name>/prompt.md` with:

- Feature description
- Example Mapping (rules + examples)
- Expected file paths
- Constraints

The directory name typically ends with one of `-prose`, `-user-story`, or `-example-mapping` (the prompt style); the part before is the **basename**. For CLI katas with an external acceptance suite, see [CLI katas with external acceptance suite](#cli-katas-with-external-acceptance-suite). For deeper kata-design guidance, see `research/kata-design/kata-construction.md`.

### New workflow variant

Create `experiments/workflows/<variant-name>/.claude/` with:

- `rules/*.md` — TDD rules for this variant
- `agents/*.md` — agent definitions (if using subagents)
- `commands/*.md` — skill definitions (if using inline skills)

## Further Documentation

| Document | Description |
|----------|-------------|
| [HUMAN-IN-THE-LOOP.md](HUMAN-IN-THE-LOOP.md) | How to re-enable human approval checkpoints between TDD phases |
| [WORKTREE-WORKFLOW.md](WORKTREE-WORKFLOW.md) | Persistent agent-worktree convention for parallel work |

## License

This project is provided as-is for research and educational purposes.
