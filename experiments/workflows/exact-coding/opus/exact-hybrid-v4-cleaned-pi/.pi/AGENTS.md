# Test-Driven Development (TDD) Rules -- Hybrid (v6, pi)

## CRITICAL: Mandatory Output Format

This workflow runs on **pi**, where skills are auto-loaded documents, not tool calls.
The model reads each SKILL.md once and then follows its instructions directly.
This means the measurement pipeline **cannot count tool invocations** to track cycles.
Instead, it relies on **text markers** in the assistant output.

### Phase-Completion Markers Are MANDATORY

Every TDD phase MUST produce a specific text marker in your output.
These markers are mechanically parsed to compute `cycle_count`, `predictions_correct_rate`,
and `refactorings_applied`. Missing markers silently zero the corresponding metric,
invalidating the data point.

| Phase     | Mandatory Output Marker                   | What the Parser Counts               |
|-----------|-------------------------------------------|--------------------------------------|
| Test List | `## Test List` heading                    | test-list phase occurrence           |
| Red       | `## Red` heading                          | red-phase cycle (`cycle_count`)      |
| Red       | `Red Phase Complete:` + prediction lines  | `predictions_correct`, `predictions_total` |
| Green     | `## Green` heading                        | green-phase occurrence               |
| Refactor  | `subagent` tool call with `agent: "refactor"` | `refactorings_applied`          |

**Format for each Red phase output:**

```
## Red -- Test N: <test description>

<prediction and failure verification steps>

Red Phase Complete:
**Compilation Prediction**: <what you expect> Correct
**Runtime Prediction**: <what you expect> Correct

<Result summary>
```

The two prediction lines (`Compilation Prediction: ... Correct` / `Runtime Prediction: ... Correct`)
are **parsed mechanically**. You MUST output them verbatim with `Correct` or `Incorrect` at the end.
Do not abbreviate, summarize, or collapse them. Do not skip them when a test already passes --
in that case, write:

```
## Red -- Test N: <test description>

Test already passes -- no new failure to fix. Skipping green/refactor.
```

**Format for Green phase output:**

```
## Green -- <brief summary of what was added>
```

**Format for Test List phase output:**

```
## Test List

<test list details>
```

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle.
v6 keeps red and green in a shared context so the predictions, error messages, and minimal
implementations stay coherent -- and isolates refactoring so the model evaluates the resulting
code on its own merits.

## Architecture: Skills + Subagent

- **`test-list`, `red`, `green`** -- Their SKILL.md files are auto-loaded as context.
  Read each SKILL.md **before the first use** of that phase, then follow its instructions
  directly in the main context. You execute the phase yourself, following the skill content.
- **Refactor** -- Runs as a **Subagent with isolated context** via the `subagent` tool.
  The refactor agent sees only the current source/tests, not the full red/green history.
  Hypothesis: refactoring benefits most from a fresh perspective free of implementation bias.

Do NOT skip reading the skill files. Do NOT skip the mandatory output markers.

### Which Mechanism to Use:

| Phase         | Mechanism                              | How to Execute                                              |
|---------------|----------------------------------------|-------------------------------------------------------------|
| Test List     | **Skill document** (main context)      | Read `.pi/skills/test-list/SKILL.md`, follow its steps      |
| Red Phase     | **Skill document** (main context)      | Read `.pi/skills/red/SKILL.md`, follow its steps           |
| Green Phase   | **Skill document** (main context)      | Read `.pi/skills/green/SKILL.md`, follow its steps         |
| Refactor Phase| **Subagent** (isolated context)        | `subagent` tool with `agent: "refactor"`, `agentScope: "both"` |

## TDD Workflow

### 1. Test List Phase
**READ SKILL**: `.pi/skills/test-list/SKILL.md`

Provide: feature, test file path, implementation file path, requirements.

The skill creates a comprehensive test list using `it.todo()` covering every rule and example from the specification.

**DO NOT** write the test list yourself. Follow the skill instructions and produce the `## Test List` marker.

### 2. Red Phase
**READ SKILL**: `.pi/skills/red/SKILL.md`

Provide: test file path, which `it.todo()` to activate, current passing-test count, implementation file path.

The skill activates exactly ONE test, makes explicit predictions, and verifies failure.

**DO NOT** write test code yourself. Follow the skill instructions and produce the `## Red` and `Red Phase Complete:` markers with prediction lines.

### 3. Green Phase
**READ SKILL**: `.pi/skills/green/SKILL.md`

Provide: test file path, failing test name, current error, implementation file path.

The skill implements minimal code to make the test pass -- hardcoded returns are fine for early tests.

**DO NOT** write implementation code yourself. Follow the skill instructions and produce the `## Green` marker.

### 4. Refactor Phase
**INVOKE SUBAGENT**: Use the `subagent` tool with these parameters:

```json
{
  "agent": "refactor",
  "agentScope": "both",
  "task": "Test file: src/<feature>.spec.ts\nImplementation file: src/<feature>.ts\nPassing tests: <count>\nRecent Green phase: <one-line summary of what was just added>\n\nRefactor the implementation while keeping all tests green.\n\nRun autonomously, return when done."
}
```

`agentScope: "both"` is REQUIRED because the `refactor` agent lives in `.pi/agents/` (project-local). Without this flag the subagent extension only sees user-level agents and the call fails with "Unknown agent: refactor".

The agent will improve code while keeping tests green:
- MUST attempt at least one refactoring (or document why none is possible)
- Evaluate naming FIRST
- Apply Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass before/after

**DO NOT** refactor code yourself -- let the subagent do it. After it returns, read its summary, apply any test-runs needed for sanity, and proceed to the next Red phase.

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
  Every cycle MUST have `## Red` and `## Green` headings.
  Every Red cycle with a failing test MUST have `Red Phase Complete:` with prediction lines.
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring
- Refactoring in the main context instead of via the subagent

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

Run tests with `pnpm test`.

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

## TDD Autonomous Execution

The TDD cycle runs autonomously -- no human-approval gates between phases.
The measurement pipeline parses the output text for phase markers
and subagent tool calls; user prompts inserted between phases would
split that sequence and produce unattributable cycles.

When executing:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle without interruption

### Autonomous Workflow

1. **Test List Phase** -- Read skill, produce `## Test List` marker
2. **For each test:**
   - **Red Phase** -- Read skill, produce `## Red` and `Red Phase Complete:` with predictions
   - **Green Phase** -- Read skill, produce `## Green` marker
   - **Refactor Phase** -- Invoke `subagent` tool with `agent: "refactor"`, `agentScope: "both"`
3. **Continue** until all tests are implemented

### Required Task Content for the Refactor Subagent

The refactor subagent has no memory of the red/green phases. Pass everything it needs in the `task` parameter:

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]

Run autonomously, return after completion.
```

After the subagent returns, read its summary and proceed directly to the next Red phase.

### Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.

## Remember

- **ALWAYS PRODUCE THE MANDATORY MARKERS** -- `## Red`, `Red Phase Complete:`, `## Green`, `## Test List`
- **ALWAYS USE THE SUBAGENT** for refactor -- `subagent` tool with `agent: "refactor"`, `agentScope: "both"`
- Follow skill content (test-list/red/green SKILL.md) for the actual work
- Pass `agentScope: "both"` to the `subagent` tool so the project-local refactor agent is discovered
- Trust the process -- discomfort is a signal you're doing it right
