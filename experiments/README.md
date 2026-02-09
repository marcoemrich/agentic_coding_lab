# TDD Workflow Experiments

## Purpose

This experiment framework evaluates different approaches to AI-assisted Test-Driven Development (TDD). The goal is to find the optimal workflow configuration for Claude Code when performing TDD tasks.

### Research Question

**How does the architecture of TDD workflow automation affect code quality, efficiency, and discipline adherence?**

Specifically, we compare:
- **Subagent-based workflows**: Each TDD phase (Test List, Red, Green, Refactor) runs in a separate, specialized agent with isolated context
- **Single-context workflows**: All TDD phases run within one continuous conversation context using inline skills

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

The Kata provides a consistent task (e.g., String Calculator) so results are comparable across workflow variants.

### Process
1. Claude receives the Kata prompt and Example Mapping
2. Claude follows the workflow rules to complete TDD:
   - Create test list (`it.todo()` entries)
   - For each test: Red → Green → Refactor cycle
3. No human intervention during the run (HITL disabled)
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

### Evaluation Criteria

A workflow is considered **better** if it produces:
- ✅ Lower code mass (simpler code)
- ✅ Fewer tokens used (more efficient)
- ✅ Higher prediction accuracy (better understanding)
- ✅ More refactorings applied (cleaner code)
- ✅ All tests passing (correct implementation)

## Workflow Variants

### v1-subagents (Baseline)

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
    ├── human-in-the-loop.md
    ├── tdd_with_ts_and_vitest.md
    └── tdd-experiment-mode.md # Disables HITL for experiments
```

### v2-single-context (Alternative)

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
    ├── human-in-the-loop.md
    ├── tdd_with_ts_and_vitest.md
    └── tdd-experiment-mode.md # Disables HITL for experiments
```

## Key Difference

| Aspect | v1-subagents | v2-single-context |
|--------|--------------|-------------------|
| **Mechanism** | `Task(subagent_type: "red")` | `Skill(skill: "red")` |
| **Context** | Isolated per phase | Shared across all phases |
| **State transfer** | Via prompt parameters | In-memory (conversation) |
| **Definitions** | `agents/*.md` | `commands/*.md` |
| **Overhead** | Agent spawning | None |

## Directory Structure

```
experiments/
├── katas/                        # Standardized coding exercises
│   └── string-calculator/
│       ├── prompt.md             # Task description for Claude
│       └── example-mapping.png   # (Optional) Visual input
│
├── workflows/                    # Workflow variants to test
│   ├── v1-subagents/
│   │   └── .claude/
│   │       ├── agents/           # test-list.md, red.md, green.md, refactor.md
│   │       └── rules/            # tdd.md, human-in-the-loop.md, etc.
│   │
│   └── v2-single-context/
│       └── .claude/
│           ├── commands/         # test-list.md, red.md, green.md, refactor.md
│           └── rules/            # tdd.md, human-in-the-loop.md, etc.
│
├── runs/                         # Experiment results
│   └── YYYY-MM-DD_HH-MM-SS_kata_workflow/
│       ├── .claude/              # Workflow config used for this run
│       ├── src/                  # Generated code
│       │   ├── string-calculator.ts
│       │   └── string-calculator.spec.ts
│       ├── metrics.json          # Recorded metrics
│       ├── prompt.md             # Kata prompt used
│       └── package.json          # Test runner config
│
├── record-run.sh                 # Interactive: create new experiment run
├── analyze-run.sh                # Analyze and compare completed runs
└── README.md                     # This file
```

## Running Experiments

### Step 1: Create a new run

```bash
cd experiments
./record-run.sh
```

Select:
1. A Kata (e.g., `string-calculator`)
2. A Workflow variant (e.g., `v1-subagents` or `v2-single-context`)

This creates a new directory under `runs/` with all necessary configuration.

### Step 2: Execute the experiment

```bash
cd runs/<created-run-directory>/
pnpm install

# Start Claude Code in this directory
claude

# Then give Claude the prompt:
# "Read prompt.md and complete the TDD exercise following the workflow rules."
```

Claude will:
1. Read the Kata prompt
2. Follow the workflow rules (from `.claude/`)
3. Complete the full TDD cycle autonomously
4. Output a structured summary

### Step 3: Analyze results

```bash
# Analyze a single run
./analyze-run.sh runs/<run-name>/

# Or compare multiple runs interactively
./analyze-run.sh
```

The analyzer reports:
- Code metrics (LOC, test count)
- APP mass calculation
- Test pass/fail status
- Comparison tables (when comparing runs)

## Expected Output from Claude

After completing a run, Claude should output a summary like:

```markdown
## TDD Experiment Summary

### Configuration
- Workflow: v1-subagents
- Kata: string-calculator
- Timestamp: 2026-02-09T15:30:00Z

### Test List
1. should return 0 for empty string
2. should return number for single number
3. should return sum for two numbers
4. should return sum for multiple numbers

### Cycle Details
| # | Test | Red Prediction | Green Approach | Refactor | Mass |
|---|------|----------------|----------------|----------|------|
| 1 | empty string → 0 | ✅ Correct | return 0 | naming OK | 8 |
| 2 | single number | ✅ Correct | parseInt | none needed | 12 |
| 3 | two numbers | ✅ Correct | split + sum | extracted helper | 15 |
| 4 | multiple numbers | ✅ Correct | reduce | renamed function | 13 |

### Final Metrics
- Total tests: 4
- All passing: ✅
- Final code mass: 13
- Refactorings applied: 2
- Prediction accuracy: 4/4 = 100%
```

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
   - v1-subagents: Use `Task` tool with `subagent_type` parameter
   - v2-single-context: Use `Skill` tool with skill name
