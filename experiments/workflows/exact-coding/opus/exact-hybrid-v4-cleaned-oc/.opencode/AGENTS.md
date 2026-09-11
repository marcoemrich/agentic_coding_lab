# Test-Driven Development (TDD) Rules -- Hybrid (v6)

## CRITICAL: Skill + Subagent Usage is MANDATORY

This workflow is a **hybrid** of skill-based and subagent-based execution:

- **`test-list`, `red`, `green`** run as **Skills in the main context** -- they share state, so the model keeps test list, last error, and current implementation in working memory.
- **Refactor** runs as a **Task subagent with isolated context** -- the refactor agent sees only the current source/tests, not the full red/green history. Hypothesis: refactoring benefits most from a fresh perspective free of implementation bias.

The skill and subagent invocations are not just stylistic. The experiment's measurement pipeline parses these tool calls to compute `cycle_count`, `predictions_correct_rate`, and `refactorings_applied`. If the orchestrating agent writes test code, implementation code, or refactorings directly instead of delegating, those actions produce **no measurable signal** -- the run completes but the run-level metrics drop to zero, invalidating the data point. Delegation is the only way to populate the metrics.

Do NOT perform TDD phases without invoking the appropriate skill or agent.

### Before Starting Any TDD Work -- Complete This Checklist:

- [ ] Have I been asked to implement something using TDD?
- [ ] Am I about to write tests or implementation code?
- [ ] **STOP** -- Use the `skill` tool (test-list/red/green) or the `task` tool (refactor)
- [ ] NEVER write tests, code, or refactorings directly -- ALWAYS delegate

### Which Tool to Use:

| Phase | Mechanism | Invoke With |
|-------|-----------|-------------|
| Test List | **Skill** (main context) | `skill({ name: "test-list" })` |
| Red Phase | **Skill** (main context) | `skill({ name: "red" })` |
| Green Phase | **Skill** (main context) | `skill({ name: "green" })` |
| Refactor Phase | **Task subagent** (isolated context) | `task({ description: "refactor", prompt: ... })` with `@refactor` agent |

**If you find yourself writing test code, implementation code, or a refactoring without invoking the right tool first, you are doing it WRONG.**

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle. v6 keeps red and green in a shared context so the predictions, error messages, and minimal implementations stay coherent -- and isolates refactoring so the model evaluates the resulting code on its own merits.

## TDD Workflow

### 1. Test List Phase
**INVOKE SKILL**: `skill({ name: "test-list" })`

Provide: feature, test file path, implementation file path, requirements.

The skill creates a comprehensive test list using `it.todo()` covering every rule and example from the specification.

**DO NOT** write the test list yourself.

### 2. Red Phase
**INVOKE SKILL**: `skill({ name: "red" })`

Provide: test file path, which `it.todo()` to activate, current passing-test count, implementation file path.

The skill activates exactly ONE test, makes explicit predictions, and verifies failure.

**DO NOT** write test code yourself.

### 3. Green Phase
**INVOKE SKILL**: `skill({ name: "green" })`

Provide: test file path, failing test name, current error, implementation file path.

The skill implements minimal code to make the test pass -- hardcoded returns are fine for early tests.

**DO NOT** write implementation code yourself.

### 4. Refactor Phase
**LAUNCH SUBAGENT**: Use the `task` tool to invoke the `refactor` subagent.

**Required prompt context** (the subagent has no memory of red/green -- give it everything it needs):

```
@refactor
Test file: src/<feature>.spec.ts
Implementation file: src/<feature>.ts
Passing tests: <count>
Recent Green phase: <one-line summary of what was just added>

Refactor the implementation while keeping all tests green.

Run autonomously, return when done.
```

The agent will improve code while keeping tests green:
- MUST attempt at least one refactoring (or document why none is possible)
- Evaluate naming FIRST
- Apply Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass before/after

**DO NOT** refactor code yourself -- let the agent do it. After it returns, read its summary, apply any test-runs needed for sanity, and proceed to the next Red phase.

### 5. Repeat
Return to step 2 (Red phase) for the next test. **Invoke the `red` skill again.**

## Core TDD Principles

### TDD Mindset
TDD practices will feel counterintuitive:
- **Hardcoded returns feel "too simple"** -- This is correct!
- **The urge to implement ahead is strong** -- Resist this
- **Minimal steps feel inefficient** -- They actually accelerate development
- **Predictions feel unnecessary** -- They build crucial understanding

### Common TDD Failure Modes
- **NOT USING SKILLS / SUBAGENT** -- The most critical failure mode
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

The TDD cycle in this workflow runs autonomously -- no
human-approval gates between phases. The measurement
pipeline parses an uninterrupted sequence of skill and
task tool calls per cycle; user prompts inserted between
phases would split that sequence and produce
unattributable cycles.

When executing:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle without interruption

### Autonomous Workflow

1. **Test List Phase** -> Invoke `test-list` skill
2. **For each test:**
   - **Red Phase** -> Invoke `red` skill
   - **Green Phase** -> Invoke `green` skill
   - **Refactor Phase** -> Launch `refactor` subagent via the `task` tool
3. **Continue** until all tests are implemented

### Required Prompt Context for the Refactor Subagent

The refactor subagent has no memory of the red/green phases. Pass everything it needs:

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

- **ALWAYS USE SKILLS** for test-list/red/green; **ALWAYS USE THE SUBAGENT** for refactor
- Never write tests, implementation, or refactorings directly
- Refactor subagent runs in an isolated context -- give it everything it needs in the prompt
- Trust the process -- discomfort is a signal you're doing it right
