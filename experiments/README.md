# TDD Workflow Experiments

## Purpose

This experiment framework evaluates different approaches to AI-assisted Test-Driven Development (TDD). The goal is to find the optimal workflow configuration for Claude Code when performing TDD tasks.

### Research Question

**How does the architecture of TDD workflow automation affect code quality, efficiency, and discipline adherence?**

Specifically, we compare:
- **v0-baseline**: Minimal guidance - just "use TDD" with no detailed rules
- **v1-subagents**: Each TDD phase runs in a separate, specialized agent with isolated context
- **v2-single-context**: All TDD phases run within one continuous conversation context using inline skills

### Why This Matters

TDD with AI assistants can fail in several ways:
- Over-implementation (writing more code than tests demand)
- Skipping predictions (not building understanding)
- Poor refactoring discipline
- Context loss between phases
- Token inefficiency

By systematically comparing workflow variants, we can identify which architecture produces:
- Better code quality (lower complexity, cleaner design)
- Higher efficiency (fewer tokens, faster completion)
- Stricter TDD discipline (accurate predictions, minimal implementations)

## Experiment Design

### Input
Each experiment run uses:
1. A **Kata** (coding exercise) with a standardized prompt
2. A **Workflow** variant (set of rules and agents/skills)

The Kata provides a consistent task (e.g., String Calculator, Game of Life) so results are comparable across workflow variants.

### Process
1. Claude receives the Kata prompt and Example Mapping
2. Claude follows the workflow rules to complete TDD:
   - Create test list (`it.todo()` entries)
   - For each test: Red → Green → Refactor cycle
3. No human intervention during the run (HITL disabled for experiments)
4. Claude records decisions and metrics throughout

### Output / Metrics

| Metric | What It Measures |
|--------|------------------|
| **Duration** | Total time for complete TDD cycle |
| **Token Usage** | Efficiency of the workflow |
| **Test Count** | Number of tests created |
| **Code Mass (APP)** | Complexity score using Absolute Priority Premise |
| **Lines of Code** | Size of implementation + tests |
| **Prediction Accuracy** | Red phase: correct predictions / total predictions |
| **Refactoring Count** | Number of improvements applied |
| **Standard Deviation (σ)** | Stability/consistency across multiple runs |

### Evaluation Criteria

A workflow is considered **better** if it produces:
- ✅ Lower code mass (simpler code)
- ✅ Fewer tokens used (more efficient)
- ✅ Higher prediction accuracy (better understanding)
- ✅ More refactorings applied (cleaner code)
- ✅ All tests passing (correct implementation)
- ✅ Lower standard deviation (more consistent results)

## Workflow Variants

### v0-baseline (Control)

**Architecture**: Minimal rules, no specialized agents or skills

```
Single Agent
    └── Just "use TDD" with basic guidance
```

**Purpose**: Control group to measure the value added by structured workflows.

**Characteristics**:
- Minimal TDD rules (no phase-specific guidance)
- No agent spawning, no skill invocation
- Claude decides how to structure its TDD process
- Lowest overhead, maximum flexibility

**Structure**:
```
v0-baseline/.claude/
└── rules/
    ├── experiment-mode.md     # Minimal TDD guidance + output format
    └── tdd_with_ts_and_vitest.md
```

### v1-subagents

**Architecture**: Separate agent for each TDD phase

```
Main Agent
    ├── Task(test-list) → Creates test list      [isolated context]
    ├── Task(red)       → Activates test         [isolated context]
    ├── Task(green)     → Minimal implementation [isolated context]
    └── Task(refactor)  → Improves code          [isolated context]
```

**Hypothesis**: Isolated contexts enforce discipline but may lose state between phases.

**Characteristics**:
- Each phase has specialized system prompt (in `agents/*.md`)
- Context passed explicitly via Task prompt parameters
- Fresh context per phase (no accumulated noise)
- Overhead from agent spawning

**Structure**:
```
v1-subagents/.claude/
├── agents/                    # Subagent definitions
│   ├── test-list.md
│   ├── red.md
│   ├── green.md
│   └── refactor.md
└── rules/                     # Workflow rules
    ├── tdd.md                 # Main TDD rules (uses Task tool)
    ├── tdd_with_ts_and_vitest.md
    └── tdd-experiment-mode.md # Autonomous mode for experiments
```

### v2-single-context

**Architecture**: All phases in one continuous context using inline skills

```
Single Agent
    ├── Skill(/test-list) → Creates test list    [same context]
    ├── Skill(/red)       → Activates test       [same context]
    ├── Skill(/green)     → Minimal implementation [same context]
    └── Skill(/refactor)  → Improves code        [same context]
```

**Hypothesis**: Shared context maintains state but may lead to less discipline.

**Characteristics**:
- Skills provide phase-specific guidance (in `commands/*.md`)
- All state remains in working memory
- No agent spawning overhead
- Risk of context pollution / over-implementation

**Structure**:
```
v2-single-context/.claude/
├── commands/                  # Skill definitions (inline execution)
│   ├── test-list.md
│   ├── red.md
│   ├── green.md
│   └── refactor.md
└── rules/                     # Workflow rules
    ├── tdd.md                 # Main TDD rules (uses Skill tool)
    ├── tdd_with_ts_and_vitest.md
    └── tdd-experiment-mode.md # Autonomous mode for experiments
```

## Key Differences

| Aspect | v0-baseline | v1-subagents | v2-single-context |
|--------|-------------|--------------|-------------------|
| **Mechanism** | None | `Task(subagent_type: "red")` | `Skill(skill: "red")` |
| **Context** | Single | Isolated per phase | Shared across phases |
| **Guidance** | Minimal | Specialized agents | Inline skills |
| **Definitions** | None | `agents/*.md` | `commands/*.md` |
| **Overhead** | None | Agent spawning | None |

## Available Katas

### string-calculator
Simple kata for validating workflow mechanics. Tests basic TDD cycle with:
- Empty input handling
- Single value parsing
- Multiple value summation

### game-of-life
More complex kata with algorithmic challenges:
- Infinite grid (sparse representation)
- 4 Game of Life rules (underpopulation, survival, overpopulation, reproduction)
- Coordinate-based neighbor calculations

## Directory Structure

```
experiments/
├── katas/                        # Standardized coding exercises
│   ├── string-calculator/
│   │   └── prompt.md
│   └── game-of-life/
│       └── prompt.md
│
├── workflows/                    # Workflow variants to test
│   ├── v0-baseline/
│   │   └── .claude/rules/
│   ├── v1-subagents/
│   │   └── .claude/{agents,rules}/
│   └── v2-single-context/
│       └── .claude/{commands,rules}/
│
├── runs/                         # Experiment results
│   └── YYYY-MM-DD_HH-MM-SS_kata_workflow/
│       ├── .claude/              # Workflow config used
│       ├── src/                  # Generated code
│       ├── metrics.json          # Recorded metrics
│       ├── analysis-report.md    # Generated by analyzer
│       └── prompt.md             # Kata prompt used
│
├── docker/                       # Containerized experiment environment
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── run-batch.sh              # Batch runner for all combinations
│   └── README.md
│
├── record-run.sh                 # Interactive: create new experiment run
├── analyze-run.sh                # Analyze and compare completed runs
└── README.md                     # This file
```

## Running Experiments

### Option A: Local Execution

#### Step 1: Create a new run

```bash
cd experiments
./record-run.sh
```

Select:
1. A Kata (e.g., `string-calculator`, `game-of-life`)
2. A Workflow variant (e.g., `v0-baseline`, `v1-subagents`, `v2-single-context`)

The script will:
- Create a run directory under `runs/`
- Copy workflow configuration
- Install dependencies
- Start Claude Code automatically
- Run analysis after completion

#### Step 2: Analyze results

```bash
# Analyze a single run
./analyze-run.sh runs/<run-name>/

# Analyze all runs
./analyze-run.sh --all

# Or compare interactively
./analyze-run.sh
# Select option 2 (Compare runs), then 'all'
```

### Option B: Docker Execution (Recommended)

For isolated, reproducible experiments:

```bash
cd experiments/docker

# Setup
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY

# Build
docker compose build

# Run interactive experiment
docker compose run -it --rm experiment bash
./record-run.sh

# Or run all combinations automatically
docker compose --profile batch run --rm batch
```

See `docker/README.md` for full documentation.

## Analysis Reports

The analyzer generates grouped reports with statistics:

### Sample Output

```markdown
## Kata: string-calculator

| Workflow | Run | Duration | Tests | Todos | Mass | Passed |
|----------|-----|----------|-------|-------|------|--------|
| v0-baseline | 2026-02-09_02-08-03_... | 165s | 4 | 0 | 36 | ✅ |
| v1-subagents | 2026-02-09_01-47-38_... | 210s | 4 | 0 | 38 | ✅ |
| v1-subagents | 2026-02-09_02-32-40_... | 195s | 4 | 0 | 40 | ✅ |
| v2-single-context | 2026-02-09_01-36-53_... | 175s | 4 | 0 | 35 | ✅ |

### Statistics for string-calculator

| Workflow | Runs | Avg Duration | σ Duration | Avg Mass | σ Mass | Success Rate |
|----------|------|--------------|------------|----------|--------|-------------|
| v0-baseline | 1 | 165s | ±0s | 36 | ±0 | 100% |
| v1-subagents | 2 | 202s | ±7s | 39 | ±1 | 100% |
| v2-single-context | 1 | 175s | ±0s | 35 | ±0 | 100% |
```

### Report Features

- **Grouped by Kata**: Separate tables per kata (values only comparable within same kata)
- **Sorted by Workflow**: Same workflow types appear together for easy comparison
- **Standard Deviation (σ)**: Shows consistency across multiple runs
- **Success Rate**: Percentage of runs with all tests passing

## Adding New Experiments

### New Kata

Create `katas/<kata-name>/prompt.md` with:
- Feature description
- Example Mapping (rules + examples)
- Expected file paths
- Constraints

### New Workflow Variant

Create `workflows/<variant-name>/.claude/` with:
- `rules/*.md` - TDD rules for this variant
- `agents/*.md` - Agent definitions (if using subagents)
- `commands/*.md` - Skill definitions (if using inline skills)

## Human-in-the-Loop (HITL)

HITL checkpoints are **disabled** for automated experiments. To re-enable HITL for interactive development, see `/HUMAN-IN-THE-LOOP.md` in the project root for:
- Phase-specific HITL instructions
- Checkpoint templates
- Recovery procedures

## Context for AI Assistants

If you are a Claude instance reading this to run an experiment:

1. **Your task**: Complete a TDD exercise following the workflow rules
2. **No human approval needed**: Run autonomously through all phases
3. **Record everything**: Output a structured summary at the end
4. **Follow TDD strictly**:
   - Test List: Only base functionality, `it.todo()` format
   - Red: One test at a time, make predictions, verify failure
   - Green: Minimal code only, simplest solution
   - Refactor: Evaluate naming first, calculate APP mass
5. **Use correct test commands**: `pnpm test:unit:basic` (never `npm` or `npx vitest`)
6. **Workflow determines mechanism**:
   - v0-baseline: Follow minimal TDD rules directly
   - v1-subagents: Use `Task` tool with `subagent_type` parameter
   - v2-single-context: Use `Skill` tool with skill name
