# Agentic Coding Lab

A lightweight research framework for systematically comparing agentic coding setups -- models, agent architectures, and prompt strategies -- using reproducible benchmarks.

## Motivation

When working with agentic coding, many practical questions arise: Does a setup with dedicated sub-agents for testing produce cleaner code than a single agent doing everything? Does Sonnet deliver better code quality than Opus on a refactoring task? How do different prompt styles affect the outcome? This framework was built to answer such questions with data instead of gut feeling.

## What This Framework Does

The framework runs controlled experiments across four dimensions:

- **Workflow variants** -- from simple one-shot generation ("vibe coding") to structured TDD with specialized agents per phase
- **Model configurations** -- Opus 4.7, Sonnet 4.6, Haiku 4.5, with and without extended thinking
- **Coding katas** -- standardized tasks (currently game-of-life and mars-rover)
- **Prompt styles** -- prose, example-mapping, user-story

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

### Two tools, one frontmatter

- **`aggregate-by-query.py`** reads the frontmatter, selects every matching run from `experiments/runs/`, and writes `runs.csv` (raw data) + `summary.md` (pivots per outcome) into the RQ directory. Re-runs the moment new replicates land — no plan editing required.
- **`batch-plan-from-rq.py`** reads the same frontmatter, counts existing matches per cell, and emits `experiments/batch-plans/<rq>-fill.json` containing exactly the missing `(kata, workflow, model)` triples needed to reach `min_replicates`. Idempotent: if everything is already covered, the plan is empty.

Together: declare the question once → fill the gaps → re-aggregate.

### The trade-off

This decoupling has costs and benefits:

**Wins**
- *Cumulative evidence*: every new run benefits every RQ whose selector matches it. No re-running batches when the question evolves.
- *Cheap exploration*: drafting an RQ is just writing a frontmatter; tooling tells you immediately how much data already exists.
- *Reproducibility*: `runs.csv` and `summary.md` are derivations; the canonical artefacts are the runs themselves.

**Costs**
- *No isolation*: a run produced for batch X might be silently picked up by RQ Y. If the run conditions drift (e.g. an analysis-pipeline bugfix), older matching runs become a hidden source of variance. Mitigation: re-run analysis on all runs after pipeline changes; status flags in findings (`✅ haltbar / ⚠️ revidiert / ❌ verworfen / 🚫 nicht prüfbar`) track such drift.
- *Selector drift*: when a frontmatter changes (new factor value, different model), previously aggregated findings may no longer be reproducible without re-deriving — hence the `_archive/` snapshots for frozen analyses.
- *Coupling via convention*: matching depends on the `model` field in `metrics.json` exactly equalling the lab-variant ID in the frontmatter. The model-alias table in [research/README.md](research/README.md) is the contract.

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
├── experiments/
│   ├── katas/                    # Coding exercises (problem definitions)
│   ├── workflows/                # 5 workflow variants (v1-v5)
│   ├── runs/                     # Recorded experiment results (68 runs)
│   ├── batch-plans/              # JSON batch specs (auto-generated per RQ)
│   ├── docker/                   # Containerized batch execution
│   ├── record-run.sh             # Run a single experiment interactively
│   ├── analyze-run.sh            # Generate analysis-report.md + metrics.json for a run
│   ├── aggregate-by-query.py     # RQ frontmatter → runs.csv + summary.md
│   └── batch-plan-from-rq.py     # RQ frontmatter → batch plan filling missing cells
├── research/
│   ├── README.md                 # RQ concept, methodology constraints, model aliases
│   ├── RQ-1-workflow-effect/     # Per-RQ:
│   │   ├── README.md             #   frontmatter selector + question + hypotheses
│   │   ├── findings.md           #   curated, growing list of numbered findings
│   │   ├── runs.csv              #   generated: raw data of all matching runs
│   │   └── summary.md            #   generated: pivot tables per outcome × cell
│   ├── RQ-2-prompt-style/
│   ├── RQ-3-model-and-thinking/
│   ├── RQ-4-workflow-model-interaction/
│   ├── RQ-5-run-stability/
│   └── _archive/                 # Frozen snapshots of past analyses
├── reference/                    # Reference configurations
├── HUMAN-IN-THE-LOOP.md          # Optional HITL checkpoint guide
├── WORKTREE-WORKFLOW.md          # Persistent agent-worktree convention
├── SECURITY-AUDIT.md             # Pre-publication security audit
└── todos_and_ideas.txt           # Future research directions
```

## The Five Workflow Variants

| Variant | Approach | Description |
|---------|----------|-------------|
| **v1-oneshot** | No TDD | Direct implementation in one shot ("vibe coding" baseline) |
| **v2-iterative** | No TDD | Iterative prompting with plan/checklist |
| **v3-basic-tdd** | Minimal TDD | Just "use TDD" -- no detailed rules |
| **v4-exact-subagents** | Structured TDD | Each TDD phase (red/green/refactor) runs in a separate, isolated agent |
| **v5-exact-single-context** | Structured TDD | All TDD phases run in one continuous context using inline skills |

## Research Questions

| RQ | Question | Status |
|----|----------|--------|
| [RQ-1](research/RQ-1-workflow-effect/) | Does workflow choice affect code quality, correctness, and TDD discipline? | active |
| [RQ-2](research/RQ-2-prompt-style/) | Does prompt style (prose / example-mapping / user-story) affect quality and correctness? | active |
| [RQ-3](research/RQ-3-model-and-thinking/) | Do model class (Opus / Sonnet / Haiku) and thinking mode affect output quality and efficiency? | active |
| [RQ-4](research/RQ-4-workflow-model-interaction/) | Do weaker models benefit more from stricter workflows than stronger ones? | active |
| [RQ-5](research/RQ-5-run-stability/) | How large is run-to-run variance within identical cells? | active |

See [research/README.md](research/README.md) for the RQ frontmatter schema, methodology constraints (e.g. workflow → allowed prompt styles), and the lab-variant model alias table.

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Anthropic API key (or compatible provider)

### Run a Single Experiment Locally

```bash
cd experiments
./record-run.sh
```

This interactively prompts you to select a kata, workflow, and model, then launches Claude Code to execute the task. Results are saved to `experiments/runs/<timestamp>_<kata>_<workflow>_<model>/`.

### Run a Batch via Docker

```bash
cd experiments/docker
cp .env.example .env          # Add your API key
docker compose build
```

Then either run an existing batch plan or generate one for a research question:

```bash
# Generate a fill plan for an RQ (only missing replicates)
./experiments/batch-plan-from-rq.py research/RQ-3-model-and-thinking/

# Execute the batch
./experiments/docker/batch.sh experiments/batch-plans/rq-3-fill.json
```

### Aggregate Results for a Research Question

```bash
./experiments/aggregate-by-query.py research/RQ-1-workflow-effect/
```

This reads the RQ frontmatter, selects all matching runs from `experiments/runs/`, and writes `runs.csv` + `summary.md` into the RQ directory. Findings are then curated by hand into `findings.md` with status flags (`✅ haltbar`, `⚠️ revidiert`, `❌ verworfen`, `🚫 nicht prüfbar`).

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

## Script Reference

All scripts are designed to be run from the repo root unless noted otherwise. `.py` scripts use Python 3 with PyYAML + pandas; `.sh` scripts are bash.

### Run lifecycle (top-level `experiments/`)

| Script | Purpose |
|--------|---------|
| `experiments/record-run.sh` | Interactive: pick kata + workflow + model, launch Claude Code locally, record everything into `experiments/runs/<id>/`. Used for ad-hoc single runs outside Docker. |
| `experiments/analyze-run.sh` | Post-process one run directory: install pnpm deps, run vitest + ESLint+SonarJS, call `analyze_transcript.py`, emit `analysis-report.md` and `metrics.json`. Idempotent — safe to re-run after pipeline fixes. |
| `experiments/analyze_transcript.py` | Parse `transcript.jsonl` (+ `transcript-subagents/`) for TDD-cycle metrics: phase inference, prediction accuracy, refactorings applied, token totals, context-window utilization. Writes `transcript-metrics.json`. |

### Aggregation (RQ-driven, current)

| Script | Purpose |
|--------|---------|
| `experiments/aggregate-by-query.py` | Reads an RQ frontmatter, selects matching runs from the pool, writes `runs.csv` + `summary.md` into the RQ directory. The canonical aggregator for current research. |
| `experiments/batch-plan-from-rq.py` | Reads an RQ frontmatter, computes missing cells against `min_replicates`, writes `experiments/batch-plans/<rq-id>-fill.json`. Idempotent — empty plan if everything is covered. |

### Aggregation (batch-driven, legacy)

| Script | Purpose |
|--------|---------|
| `experiments/aggregate-runs.sh` | Older aggregator: takes a *batch plan name* (not an RQ) and produces `results/<plan>/runs.csv` + `summary.md` with per-kata blocks (Core/TDD/Code-Quality/Coverage) and a cross-kata appendix. Still useful for quick batch-scoped sanity checks. Superseded for research use by `aggregate-by-query.py`. |

### Docker batch execution (`experiments/docker/`)

| Script | Purpose |
|--------|---------|
| `docker/batch.sh` | Convenience wrapper around `docker compose --profile batch run --rm batch`. Accepts a plan name or path: `./batch.sh rq-3-fill` or `./batch.sh /abs/path/plan.json`. Tees output to `batch.<plan>.log`. |
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

## Key Metrics

Each run is evaluated on:

- **duration_seconds** -- wall-clock time for the complete task
- **tests_passing** -- whether the final test suite is green
- **code_mass** -- LoC-based complexity proxy (lower = simpler)
- **cc_longest_function** -- highest cognitive complexity in any function
- **smell_total** -- count of ESLint/SonarJS code smells
- **tokens_total** -- total token consumption (input + output + cache)
- **tdd_cycles** -- number of red-green-refactor cycles (TDD workflows only)
- **prediction_accuracy** -- correctness of red-phase failure predictions (v4/v5)

Metrics live in `metrics.json` per run; the analysis pipeline (ESLint with `sonarjs/cognitive-complexity`, `max-depth`, etc.) runs inside the Docker batch container.

## Further Documentation

| Document | Description |
|----------|-------------|
| [research/README.md](research/README.md) | RQ concept, frontmatter schema, methodology constraints, model aliases |
| [experiments/README.md](experiments/README.md) | Detailed experiment framework docs, metrics definitions |
| [experiments/docker/README.md](experiments/docker/README.md) | Docker setup and batch execution guide |
| [HUMAN-IN-THE-LOOP.md](HUMAN-IN-THE-LOOP.md) | How to re-enable human approval checkpoints between TDD phases |
| [WORKTREE-WORKFLOW.md](WORKTREE-WORKFLOW.md) | Persistent agent-worktree convention for parallel work |
| [SECURITY-AUDIT.md](SECURITY-AUDIT.md) | Pre-publication security verification |

## License

This project is provided as-is for research and educational purposes.
