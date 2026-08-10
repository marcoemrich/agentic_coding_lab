# Test-Driven Development (TDD) Rules -- Exact Subagents (v4.1, pi)

## CRITICAL: One Continuous Autonomous Run -- Never Stop at a Phase Boundary

This entire workflow -- Test List, then Red/Green/Refactor for every test,
through to writing `experiment-done.txt` -- is **one single autonomous
turn**. There are no human-approval gates and no natural stopping points
between phases.

A returned subagent is a **checkpoint, not a terminus**. After a subagent
returns you MUST immediately launch the next phase's subagent in the same
turn:

- After the **Test List** subagent returns -> launch the `red` subagent for test 1.
- After **Red** returns -> launch the `green` subagent.
- After **Green** returns -> launch the `refactor` subagent.
- After **Refactor** returns -> launch the `red` subagent for the next test.

The only place your turn may end is **after** you have written
`experiment-done.txt` containing `DONE`. Ending the turn on a "Proceeding
to..." / "Next Step..." announcement -- without actually taking that step
-- is the single most common failure mode on this harness and invalidates
the run. Announcing an action is not doing it; always do it in the same turn.

## CRITICAL: Mandatory Output Format

This workflow runs on **pi**, where every TDD phase runs in an isolated
subagent. The measurement pipeline parses the `subagent` tool calls **and**
the text each subagent returns.

### Phase-Completion Markers Are MANDATORY

Every TDD phase MUST produce a specific text marker in the subagent's output.
These markers are mechanically parsed to compute `cycle_count`,
`predictions_correct_rate` and `refactorings_applied`. Missing markers silently
zero the corresponding metric, invalidating the data point.

| Phase     | Mandatory Output Marker                   | What the Parser Counts               |
|-----------|-------------------------------------------|--------------------------------------|
| Test List | `## Test List` + `Test List Phase Complete.` | test-list phase occurrence        |
| Red       | `## Red` heading                          | red-phase cycle (`cycle_count`)      |
| Red       | `Red Phase Complete:` + prediction lines  | `predictions_correct`, `predictions_total` |
| Green     | `## Green` heading                        | green-phase occurrence               |
| Refactor  | `subagent` tool call with `agent: "refactor"` | `refactorings_applied`           |

The agent definitions in `.pi/agents/` already carry these requirements. Do not
paraphrase or summarise a subagent's output in your own words instead of
letting its text stand -- the parser reads the subagent's own return text.

## Overview

This project follows strict Test-Driven Development practices using the
Red-Green-Refactor cycle. v4.1 gives **every phase its own isolated subagent**:
test list, red, green and refactor each run with a fresh context and see only
what you pass them. Nothing is shared between phases except the files on disk.

Hypothesis: maximum isolation forces each phase to stand on its own and
prevents implementation bias from leaking between phases.

## Architecture: Subagents Only (Maximum Isolation)

All four phases run as **subagents with isolated context** via the `subagent`
tool. Each agent lives in `.pi/agents/` and sees only the `task` string you
pass it -- not the conversation history, not the previous phase's reasoning.

`agentScope: "both"` is REQUIRED on every call because the agents are
project-local (`.pi/agents/`). Without this flag the subagent extension only
sees user-level agents and the call fails with "Unknown agent: ...".

### Which Mechanism to Use:

| Phase          | Mechanism                        | How to Execute                                                    |
|----------------|----------------------------------|-------------------------------------------------------------------|
| Test List      | **Subagent** (isolated context)  | `subagent` tool with `agent: "test-list"`, `agentScope: "both"`   |
| Red Phase      | **Subagent** (isolated context)  | `subagent` tool with `agent: "red"`, `agentScope: "both"`         |
| Green Phase    | **Subagent** (isolated context)  | `subagent` tool with `agent: "green"`, `agentScope: "both"`       |
| Refactor Phase | **Subagent** (isolated context)  | `subagent` tool with `agent: "refactor"`, `agentScope: "both"`    |

**DO NOT** write the test list, test code, implementation code or refactorings
yourself. Every phase goes through its subagent.

## TDD Workflow

### 1. Test List Phase

```json
{
  "agent": "test-list",
  "agentScope": "both",
  "task": "Feature: <feature>\nTest file: src/<feature>.spec.ts\nImplementation file: src/<feature>.ts\nRequirements:\n<the spec>\n\nCreate the test list. Run autonomously, return when done."
}
```

**DO NOT** end your turn after the test list returns. Launch the `red`
subagent for test 1 in the same turn. See "One Continuous Autonomous Run" at
the top -- the Test-List -> Red boundary is where runs most often stall.

### 2. Red Phase

```json
{
  "agent": "red",
  "agentScope": "both",
  "task": "Test file: src/<feature>.spec.ts\nImplementation file: src/<feature>.ts\nActivate this it.todo(): \"<test description>\"\nCurrently passing tests: <count>\n\nActivate exactly ONE test, make explicit predictions, verify it fails.\n\nRun autonomously, return when done."
}
```

### 3. Green Phase

```json
{
  "agent": "green",
  "agentScope": "both",
  "task": "Test file: src/<feature>.spec.ts\nImplementation file: src/<feature>.ts\nFailing test: \"<test name>\"\nCurrent error: <error>\n\nImplement the minimal code to make this test pass.\n\nRun autonomously, return when done."
}
```

### 4. Refactor Phase

```json
{
  "agent": "refactor",
  "agentScope": "both",
  "task": "Test file: src/<feature>.spec.ts\nImplementation file: src/<feature>.ts\nPassing tests: <count>\nRecent Green phase: <one-line summary of what was just added>\n\nRefactor the implementation while keeping all tests green.\n\nRun autonomously, return when done."
}
```

### 5. Repeat

Return to step 2 (Red phase) for the next test.

## Core TDD Principles

### TDD Mindset
TDD practices will feel counterintuitive:
- **Hardcoded returns feel "too simple"** -- This is correct!
- **The urge to implement ahead is strong** -- Resist this
- **Minimal steps feel inefficient** -- They actually accelerate development
- **Predictions feel unnecessary** -- They build crucial understanding

### Common TDD Failure Modes
- **MISSING OUTPUT MARKERS** -- The most critical failure mode on pi.
  Every cycle MUST have `## Red` and `## Green` headings in the subagent output.
  Every Red cycle with a failing test MUST have `Red Phase Complete:` with
  prediction lines.
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring
- Doing a phase's work yourself instead of delegating it to its subagent

## Technical Setup: TypeScript and Vitest

### TypeScript Conventions
- Use proper type annotations
- Leverage TypeScript's type checking during development
- Name files after their content
- Import with explicit `.js` extensions for local modules

### Test File Conventions
- Use `.spec.ts` extension for test files
- Place tests near implementation files
- Import test functions: `import { describe, it, expect } from "vitest"`

### Running Tests

Run tests with `pnpm test:unit:basic`.

### Example Test Template

The test list comes from the kata's specification -- do not add generic "validate input types" or "edge cases" tests unless the spec calls for them.

```typescript
// some-feature.spec.ts
import { describe, it, expect } from "vitest";
import { someFeature } from "./some-feature.js";

describe("Some Feature", () => {
  it.todo("[first behaviour from the spec]");
  it.todo("[second behaviour from the spec]");
});
```

## TDD Experiment Mode (No HITL)

### Override for Automated Experiments

**This section overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously

### Autonomous Workflow

1. **Test List Phase** -- Launch `test-list` subagent
2. **For each test:**
   - **Red Phase** -- Launch `red` subagent
   - **Green Phase** -- Launch `green` subagent
   - **Refactor Phase** -- Launch `refactor` subagent
3. **Continue** until all tests are implemented

### Required Task Content for Every Subagent

Each subagent has **no memory** of the other phases. Pass everything it needs
in the `task` parameter -- file paths, the active test, the current error, the
passing-test count. A subagent that has to guess its context produces worse
output than one that is told.

Every `task` should end with:

```
EXPERIMENT MODE: Run autonomously, return after completion.
```

### Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.

## Remember

- **NEVER STOP AT A PHASE BOUNDARY** -- Test List -> Red -> Green -> Refactor -> next Red all happen in one turn. Announcing the next phase is not doing it; take the action in the same turn. The only turn-end is after `experiment-done.txt` says `DONE`.
- **ALWAYS USE A SUBAGENT** for every phase -- `subagent` tool with `agent: "test-list"` / `"red"` / `"green"` / `"refactor"`, always with `agentScope: "both"`
- **THE SUBAGENTS PRODUCE THE MARKERS** -- `## Red`, `Red Phase Complete:`, `## Green`, `## Test List`; do not paraphrase their output
- Pass `agentScope: "both"` on every call so the project-local agents are discovered
- Give each subagent the full context it needs -- it cannot see the others
- Trust the process -- discomfort is a signal you're doing it right
