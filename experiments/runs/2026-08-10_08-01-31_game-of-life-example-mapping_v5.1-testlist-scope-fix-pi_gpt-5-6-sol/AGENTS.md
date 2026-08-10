# Test-Driven Development (TDD) Rules -- Single Context (v5.1, pi)

## CRITICAL: One Continuous Autonomous Run -- Never Stop at a Phase Boundary

This entire workflow -- Test List, then Red/Green/Refactor for every test,
through to writing `experiment-done.txt` -- is **one single autonomous
turn**. There are no human-approval gates and no natural stopping points
between phases.

A phase-completion line (e.g. "Test List Phase Complete", "Red Phase
Complete", a finished refactor pass) is a **checkpoint, not a
terminus**. After emitting it you MUST immediately continue with the next
phase's action in the same turn:

- After the **Test List** -> read `red/SKILL.md` and produce `## Red` for test 1.
- After **Red** -> read `green/SKILL.md` and produce `## Green`.
- After **Green** -> read `refactor/SKILL.md` and produce `## Refactor`.
- After **Refactor** -> produce `## Red` for the next test.

The only place your turn may end is **after** you have written
`experiment-done.txt` containing `DONE`. Ending the turn on a "Proceeding
to..." / "Next Step..." announcement -- without actually taking that step
-- is the single most common failure mode on this harness and invalidates
the run. Announcing an action is not doing it; always do it in the same turn.

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
| Refactor  | `## Refactor` heading                     | `refactorings_applied`               |

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

**Format for Refactor phase output:**

```
## Refactor -- <brief summary of what was improved, or "no improvement possible">
```

The `## Refactor` heading is the **only** signal for `refactorings_applied` in
this workflow -- refactoring happens in the main context, so there is no
subagent call to count. Omitting the heading silently zeros the metric.

**Format for Test List phase output:**

```
## Test List

<test list details>
```

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle.
v5.1 keeps **all four phases in a single shared context**: test list, red, green and refactor
all run in the main conversation. Nothing is delegated to an isolated subagent, so every phase
sees the full history of predictions, error messages and implementation decisions that came
before it.

## Architecture: Skills Only (Single Context)

- **`test-list`, `red`, `green`, `refactor`** -- Their SKILL.md files are auto-loaded as
  context. Read each SKILL.md **before the first use** of that phase, then follow its
  instructions directly in the main context. You execute every phase yourself, following
  the skill content.
- **No subagents.** There is no `subagent` tool call in this workflow. Refactoring happens
  in the main context like every other phase, which is why the `## Refactor` heading is the
  only measurable signal for it.

Do NOT skip reading the skill files. Do NOT skip the mandatory output markers.

### Which Mechanism to Use:

| Phase         | Mechanism                              | How to Execute                                              |
|---------------|----------------------------------------|-------------------------------------------------------------|
| Test List     | **Skill document** (main context)      | Read `.pi/skills/test-list/SKILL.md`, follow its steps      |
| Red Phase     | **Skill document** (main context)      | Read `.pi/skills/red/SKILL.md`, follow its steps           |
| Green Phase   | **Skill document** (main context)      | Read `.pi/skills/green/SKILL.md`, follow its steps         |
| Refactor Phase| **Skill document** (main context)      | Read `.pi/skills/refactor/SKILL.md`, follow its steps       |

## TDD Workflow

### 1. Test List Phase
**READ SKILL**: `.pi/skills/test-list/SKILL.md`

Provide: feature, test file path, implementation file path, requirements.

The skill creates a comprehensive test list using `it.todo()` covering every rule and example from the specification.

**DO NOT** write the test list yourself. Follow the skill instructions and produce the `## Test List` marker.

**DO NOT** end your turn after the test list. The moment the `## Test List`
marker is complete, continue in the same turn into the Red Phase for test 1
(read `red/SKILL.md`, produce `## Red`). See "One Continuous Autonomous Run"
at the top -- the Test-List -> Red boundary is where runs most often stall.

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
**READ SKILL**: `.pi/skills/refactor/SKILL.md`

Provide: test file path, implementation file path, current passing-test count, one-line summary of what the Green phase just added.

Improve the code in the main context while keeping tests green:
- MUST attempt at least one refactoring (or document why none is possible)
- Evaluate naming FIRST
- Apply Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass before/after

Follow the skill instructions and produce the `## Refactor` marker. After the refactoring, run the tests to confirm they are still green, then proceed to the next Red phase.

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
- Refactoring without producing the `## Refactor` heading

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

1. **Test List Phase** -- Read skill, produce `## Test List` marker
2. **For each test:**
   - **Red Phase** -- Read skill, produce `## Red` and `Red Phase Complete:` with predictions
   - **Green Phase** -- Read skill, produce `## Green` marker
   - **Refactor Phase** -- Read skill, produce `## Refactor` marker
3. **Continue** until all tests are implemented

### Refactoring in the Shared Context

Unlike the hybrid workflows, refactoring here happens in the **same context** as
red and green. You already have the full history -- the predictions, the error
messages, the minimal implementation you just wrote. Use it: you do not need to
re-read the files to know what changed.

After the refactoring, run the tests to confirm they are still green, then
proceed directly to the next Red phase.

### Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.

## Remember

- **NEVER STOP AT A PHASE BOUNDARY** -- Test List -> Red -> Green -> Refactor -> next Red all happen in one turn. Announcing the next phase is not doing it; take the action in the same turn. The only turn-end is after `experiment-done.txt` says `DONE`.
- **ALWAYS PRODUCE THE MANDATORY MARKERS** -- `## Red`, `Red Phase Complete:`, `## Green`, `## Refactor`, `## Test List`
- **`## Refactor` is the only refactor signal** -- there is no subagent in this workflow; without the heading `refactorings_applied` stays at zero
- Follow skill content (test-list/red/green/refactor SKILL.md) for the actual work
- Everything runs in one shared context -- no delegation, no isolated agents
- Trust the process -- discomfort is a signal you're doing it right
