# TDD Workflow Experiments

## Purpose

This experiment framework evaluates different approaches to AI-assisted Test-Driven Development (TDD). The goal is to find the optimal workflow configuration for Claude Code when performing TDD tasks.

### Research Question

**How does the architecture of TDD workflow automation affect code quality, efficiency, and discipline adherence?**

Specifically, we compare across three dimensions:

**Workflow variants:**
- **v1-oneshot**: No TDD - direct implementation ("vibe coding")
- **v2-iterative**: No TDD - iterative prompting with plan/checklist
- **v3-basic-tdd**: Minimal TDD guidance - just "use TDD" with no detailed rules
- **v4-exact-subagents**: EXACT-Coding TDD - each phase runs in a separate, specialized agent with isolated context
- **v5-exact-single-context**: EXACT-Coding TDD - all phases run within one continuous conversation context using inline skills

**Model configurations:**
- **opus**: Opus 4.6 with extended thinking enabled
- **opus-no-thinking**: Opus 4.6 with extended thinking disabled
- **sonnet**: Sonnet 4.5 with extended thinking enabled
- **sonnet-no-thinking**: Sonnet 4.5 with extended thinking disabled

### Known Limitation: Training Data Contamination

The classic katas used in this experiment (String Calculator, Game of Life, Diamond, Mars Rover) are extremely common in:
- Coding Dojo materials and TDD tutorials
- Books, blog posts, and YouTube videos
- Thousands of GitHub repositories with solutions

**This means Claude likely has seen dozens of solutions during training**, which may affect results:

| Metric | Potential Bias |
|--------|----------------|
| **Mass/Complexity** | May reproduce "known good solutions" instead of developing incrementally |
| **Prediction Accuracy** | Artificially high because the model already "knows" the outcome |
| **Tests Immed** | Over-implementation more likely (knows what's coming) |
| **Refactorings** | Fewer needed because implementation is "correct" from the start |

**Implications**: Results may not generalize to novel, real-world tasks where the model has no prior exposure. The experiment primarily measures workflow overhead and discipline enforcement rather than genuine TDD learning effects.

**Possible mitigations for future work**:
- Create novel, unpublished katas
- Add unusual constraints to known katas
- Use domain-specific tasks from real projects
- Generate randomized requirement variations

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
3. A **Model** configuration (model + thinking mode)

The Kata provides a consistent task (e.g., String Calculator, Game of Life) so results are comparable across workflow and model variants.

### Process
1. Claude receives the Kata prompt and Example Mapping
2. Claude follows the workflow rules to complete TDD:
   - Create test list (`it.todo()` entries)
   - For each test: Red → Green → Refactor cycle
3. No human intervention during the run (HITL disabled for experiments)
4. Claude records decisions and metrics throughout

### Output / Metrics

The analyzer extracts metrics from two sources:
1. **Code analysis** - direct inspection of generated files
2. **Experiment summary** - parsed from the AI-generated `experiment-summary.md`

#### Core Metrics

| Metric | Source | Description |
|--------|--------|-------------|
| **Duration** | metrics.json | Total time (seconds) for complete TDD cycle |
| **Tests** | Code analysis | Number of active test cases (non-todo) |
| **Mass** | Code analysis | APP complexity score (see below) |
| **Passed** | Test runner | Whether all tests pass (✅/❌) |

#### Token Usage & Context Metrics

| Metric | Source | Description |
|--------|--------|-------------|
| **Tokens** | experiment-summary | Total tokens consumed by the AI during the run |
| **Ctx Util** | experiment-summary | Final context window utilization percentage |
| **Cycles** | experiment-summary | Number of TDD Red-Green-Refactor cycles completed |

**Why these matter:**
- **Tokens** measures efficiency - lower is better for cost and speed
- **Ctx Util** shows how much of the context window was used
  - v4-exact-subagents: Each agent has fresh context, so main context stays low
  - v5-exact-single-context: Tokens accumulate, higher utilization expected
- **Cycles** should match test count for proper TDD discipline

#### TDD Discipline Metrics

| Metric | Source | Description |
|--------|--------|-------------|
| **Refactorings** | experiment-summary | Number of refactoring improvements applied |
| **Pred Accuracy** | experiment-summary | Red phase predictions: correct/total (e.g., "4/4") |
| **Tests Immed** | experiment-summary | Tests that passed immediately without Green phase |

**Why these matter:**
- **Refactorings** - TDD requires mandatory refactoring attempts. More refactorings indicate better discipline and cleaner final code.
- **Pred Accuracy** (Guessing Game) - Before running tests, Claude predicts the outcome. Higher accuracy shows deeper understanding of the code state.
- **Tests Immed** - Tests passing immediately in Red phase indicates over-implementation (writing more code than the previous test demanded). Lower is better.

#### Code Complexity: APP Mass

APP (Absolute Priority Premise) measures code complexity by weighting different code elements:

| Element | Weight | Rationale |
|---------|--------|-----------|
| Constants | ×1 | Literals and strings (low complexity) |
| Invocations | ×2 | Function/method calls |
| Conditionals | ×4 | if/switch/ternary (branching logic) |
| Loops | ×5 | for/while/map/reduce/forEach |
| Assignments | ×6 | Variable mutations (highest complexity) |

**Total Mass = Σ(count × weight)**

Lower mass = simpler, more maintainable code.

#### Statistical Metrics

| Metric | Description |
|--------|-------------|
| **Avg Duration** | Mean duration across runs of same kata+workflow |
| **σ Duration** | Standard deviation of duration |
| **Avg Mass** | Mean code mass |
| **σ Mass** | Standard deviation of mass |
| **Avg Tokens** | Mean token usage |
| **Success Rate** | Percentage of runs with all tests passing |

**Standard Deviation (σ)** measures consistency - lower values indicate more stable, predictable results across multiple runs.

### Evaluation Criteria

A workflow is considered **better** if it produces:
- ✅ Lower code mass (simpler code)
- ✅ Fewer tokens used (more efficient)
- ✅ Higher prediction accuracy (better understanding)
- ✅ More refactorings applied (cleaner code)
- ✅ Fewer tests passing immediately (proper incremental TDD)
- ✅ All tests passing (correct implementation)
- ✅ Lower standard deviation (more consistent results)

## Workflow Variants

### v1-oneshot (No TDD Baseline)

**Architecture**: No TDD - direct implementation ("vibe coding")

```
Single Agent
    └── Read requirements → Write code → Add tests after
```

**Purpose**: Baseline to measure the value of TDD itself (any TDD variant vs no TDD).

**Characteristics**:
- No test-first approach
- No Red-Green-Refactor cycle
- No incremental steps or predictions
- Implementation written in one shot based on requirements
- Tests added **after implementation** based on Example Mapping (for fair comparison)
- Represents "normal coding" without TDD discipline

**Structure**:
```
v1-oneshot/.claude/
└── rules/
    └── experiment-mode.md     # Non-TDD approach + output format
```

### v2-iterative (No TDD, Iterative)

**Architecture**: No TDD - iterative prompting with plan/checklist

```
Single Agent
    └── Read requirements → Create checklist → Implement step-by-step → Add tests after
```

**Purpose**: Measure whether structured iteration (without TDD) improves over one-shot.

**Characteristics**:
- No test-first approach
- No Red-Green-Refactor cycle
- Incremental implementation via explicit checklist
- Plan-driven development with task tracking
- Tests added **after implementation** based on Example Mapping
- Represents "structured coding" without TDD discipline

**Structure**:
```
v2-iterative/.claude/
└── rules/
    └── experiment-mode.md     # Iterative approach + output format
```

### v3-basic-tdd (TDD Control)

**Architecture**: Minimal TDD rules, no specialized agents or skills

```
Single Agent
    └── Just "use TDD" with basic guidance
```

**Purpose**: Control group to measure the value added by structured TDD workflows.

**Characteristics**:
- Minimal TDD rules (no phase-specific guidance)
- No agent spawning, no skill invocation
- Claude decides how to structure its TDD process
- Lowest TDD overhead, maximum flexibility

**Structure**:
```
v3-basic-tdd/.claude/
└── rules/
    └── experiment-mode.md     # Minimal TDD guidance + output format
```

### v4-exact-subagents

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
v4-exact-subagents/.claude/
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

### v5-exact-single-context

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
v5-exact-single-context/.claude/
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

### Workflow Variants

| Aspect | v1-oneshot | v2-iterative | v3-basic-tdd | v4-exact-subagents | v5-exact-single-context |
|--------|------------|--------------|--------------|--------------|-------------------|
| **TDD** | ❌ No | ❌ No | ✅ Yes (minimal) | ✅ Yes (strict) | ✅ Yes (strict) |
| **Mechanism** | Direct code | Checklist | None | `Task(subagent_type: "red")` | `Skill(skill: "red")` |
| **Context** | Single | Single | Single | Isolated per phase | Shared across phases |
| **Guidance** | None | Plan/checklist | Minimal TDD | Specialized agents | Inline skills |
| **Definitions** | None | None | None | `agents/*.md` | `commands/*.md` |
| **Overhead** | None | None | None | Agent spawning | None |

### Model Configurations

The `--model` flag uses the CLI aliases `opus` / `sonnet`, which always
resolve to the latest available model in that family.

| Config | CLI Flag | Thinking | Mechanism |
|--------|----------|----------|-----------|
| `opus` | `--model opus` | Enabled | Default behavior |
| `opus-no-thinking` | `--model opus` | Disabled | `MAX_THINKING_TOKENS=0` |
| `sonnet` | `--model sonnet` | Enabled | Default behavior |
| `sonnet-no-thinking` | `--model sonnet` | Disabled | `MAX_THINKING_TOKENS=0` |

## Available Katas

### string-calculator
**Complexity**: Simple
**Purpose**: Validate workflow mechanics
Tests basic TDD cycle with:
- Empty input handling
- Single value parsing
- Multiple value summation

### mars-rover
**Complexity**: Medium
**Purpose**: State transformation and command processing
Tests TDD with:
- Position tracking (x, y, direction)
- Command execution (turn left/right, move forward)
- Sequential state updates

### diamond
**Complexity**: Medium
**Purpose**: Algorithmic thinking and formatting
Tests TDD with:
- Pattern generation
- Symmetry (horizontal and vertical)
- Spacing calculations

### pixel-art-scaler (Novel)
**Complexity**: Medium
**Purpose**: Novel kata to avoid training data contamination
Tests TDD with:
- 2D grid transformation
- Horizontal and vertical pixel replication
- Edge cases (empty, single pixel, scale 1)
- Pattern preservation

**Note**: This kata was specifically created for this experiment and is unlikely to exist in training data, providing a fairer comparison between workflows.

### game-of-life
**Complexity**: Complex
**Purpose**: Algorithmic challenges with grid logic
Tests TDD with:
- Infinite grid (sparse representation)
- 4 Game of Life rules (underpopulation, survival, overpopulation, reproduction)
- Coordinate-based neighbor calculations

### Disabling Katas or Workflows

To temporarily exclude a kata or workflow from batch runs, prefix the folder name with `_`:

```bash
# Disable game-of-life kata
mv katas/game-of-life katas/_game-of-life

# Re-enable it
mv katas/_game-of-life katas/game-of-life

# Disable a workflow
mv workflows/v2-single-context workflows/_v2-single-context
```

Disabled items:
- Are skipped in batch runs (`run-batch.sh`)
- Show as "(disabled)" in interactive mode (`record-run.sh`)
- Can still be selected manually in interactive mode

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
│   ├── v1-oneshot/
│   │   └── .claude/rules/
│   ├── v2-iterative/
│   │   └── .claude/rules/
│   ├── v3-basic-tdd/
│   │   └── .claude/rules/
│   ├── v4-exact-subagents/
│   │   └── .claude/{agents,rules}/
│   └── v5-exact-single-context/
│       └── .claude/{commands,rules}/
│
├── runs/                         # Experiment results
│   └── YYYY-MM-DD_HH-MM-SS_kata_workflow_model/
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
2. A Workflow variant (e.g., `v1-oneshot`, `v2-iterative`, `v3-basic-tdd`, `v4-exact-subagents`, `v5-exact-single-context`)

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

The analyzer generates grouped reports with multiple metric tables per kata:

### Sample Output

```markdown
## Kata: string-calculator

### Core Metrics

| Workflow | Model | Run | Duration | Tests | Mass | Passed |
|----------|-------|-----|----------|-------|------|--------|
| v3-basic-tdd | opus | 2026-02-09_05-34-30_... | 233s | 4 | 29 | ✅ |
| v4-exact-subagents | opus | 2026-02-09_05-38-31_... | 511s | 4 | 21 | ✅ |
| v4-exact-subagents | sonnet | 2026-02-09_06-12-00_... | 312s | 4 | 25 | ✅ |
| v5-exact-single-context | opus | 2026-02-09_05-47-09_... | 434s | 4 | 33 | ✅ |

### Token Usage & Context

| Workflow | Model | Run | Tokens | Ctx Util | Cycles |
|----------|-------|-----|--------|----------|--------|
| v3-basic-tdd | opus | 2026-02-09_05-34-30_... | 13611 | 6% | 4 |
| v4-exact-subagents | opus | 2026-02-09_05-38-31_... | 259352 | 17% | 8 |
| v4-exact-subagents | sonnet | 2026-02-09_06-12-00_... | 185000 | 12% | 6 |
| v5-exact-single-context | opus | 2026-02-09_05-47-09_... | 320000 | 29% | 4 |

### Statistics: Core Metrics

| Workflow | Model | Runs | Avg Duration | σ Duration | Avg Mass | σ Mass | Success Rate |
|----------|-------|------|--------------|------------|----------|--------|-------------|
| v3-basic-tdd | opus | 3 | 204s | ±42s | 31 | ±2 | 100% |
| v4-exact-subagents | opus | 3 | 566s | ±42s | 23 | ±3 | 100% |
| v4-exact-subagents | sonnet | 3 | 320s | ±30s | 26 | ±2 | 100% |
| v5-exact-single-context | opus | 3 | 431s | ±18s | 32 | ±1 | 100% |

### Statistics: Token Usage & Context

| Workflow | Model | Runs | Avg Tokens | σ Tokens | Avg Ctx Util | σ Ctx Util | Avg Cycles | σ Cycles |
|----------|-------|------|------------|----------|--------------|------------|------------|----------|
| v3-basic-tdd | opus | 3 | 17303 | ±11600 | 12% | ±4% | 4 | ±0 |
| v4-exact-subagents | opus | 3 | 262428 | ±2000 | 17% | ±0% | 8 | ±0 |
| v4-exact-subagents | sonnet | 3 | 185000 | ±5000 | 12% | ±1% | 6 | ±0 |
| v5-exact-single-context | opus | 3 | 207553 | ±109000 | 28% | ±0% | 4 | ±0 |
```

### Report Features

- **Grouped by Kata**: Separate tables per kata (values only comparable within same kata)
- **Sorted by Workflow + Model**: Same workflow types and model configurations appear together for easy comparison
- **Three Metric Categories**:
  - Core Metrics: Duration, Tests, Mass, Pass/Fail
  - Token Usage: Tokens, Context Utilization, TDD Cycles
  - TDD Discipline: Refactorings, Prediction Accuracy, Tests Passed Immediately
- **Three Statistics Tables**: Each metric category has its own statistics with Avg and σ
- **Metrics Legend**: Explanation of all metrics at end of report

## Adding New Experiments

### New Kata

Create `katas/<kata-name>/prompt.md` with:
- Feature description
- Example Mapping (rules + examples)
- Expected file paths
- Constraints

#### API Specification Guidelines

**Do NOT specify the API** in kata prompts unless the original kata definition includes a canonical API.

| Kata | API in Prompt? | Rationale |
|------|----------------|-----------|
| **String Calculator** | ✅ Yes | [Roy Osherove's original](https://osherove.com/tdd-kata-1) defines `int add(String numbers)` |
| **Mars Rover** | ❌ No | [kata-log.rocks](https://kata-log.rocks/mars-rover-kata) - no canonical signature |
| **Diamond** | ❌ No | [Various implementations](http://natpryce.com/articles/000807.html) use different signatures |
| **Game of Life** | ❌ No | [codingdojo.org](https://codingdojo.org/kata/GameOfLife/) - just describes input/output |
| **Novel katas** | ❌ No | Let TDD drive the design |

**Why avoid pre-specified APIs:**
1. **TDD philosophy**: Design should emerge from tests, not be dictated upfront
2. **Real-world simulation**: Actual TDD starts with requirements, not function signatures
3. **Workflow differentiation**: Better workflows might produce better APIs - pre-specification hides this

The examples in the prompt already make input/output clear enough for the AI to infer an appropriate API.

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

1. **Your task**: Complete a coding exercise following the workflow rules
2. **No human approval needed**: Run autonomously through all phases
3. **Record everything**: Output a structured summary at the end
4. **Model is pre-configured**: The model and thinking mode are set by the runner scripts
5. **Use correct test commands**: `pnpm test` (never `npm` or `npx vitest`)
5. **Workflow determines approach**:
   - **v1-oneshot**: NO TDD - just read requirements and implement directly, add tests after
   - **v2-iterative**: NO TDD - use plan/checklist for iterative implementation, add tests after
   - **v3-basic-tdd**: Follow minimal TDD rules directly (no tools)
   - **v4-exact-subagents**: Use `Task` tool with `subagent_type` parameter
   - **v5-exact-single-context**: Use `Skill` tool with skill name
6. **For TDD workflows** (v3, v4, v5), follow TDD strictly:
   - Test List: Only base functionality, `it.todo()` format
   - Red: One test at a time, make predictions, verify failure
   - Green: Minimal code only, simplest solution
   - Refactor: Evaluate naming first, calculate APP mass
