# Test-Driven Development (TDD) Rules

## CRITICAL: Skill Usage is MANDATORY

**YOU MUST USE THE SPECIALIZED TDD SKILLS FOR EVERY TDD TASK.**

Do NOT perform TDD phases without invoking the appropriate skill. The skills enforce discipline and prevent common mistakes.

### Before Starting Any TDD Work - Complete This Checklist:

- [ ] Have I been asked to implement something using TDD?
- [ ] Am I about to write tests or implementation code?
- [ ] **STOP** - Use the `skill` tool to invoke the appropriate TDD skill
- [ ] NEVER write tests or code directly - ALWAYS use skills

### Which Skill to Use:

| Phase | Skill Name | Invoke With |
|-------|-----------|-------------|
| Test List | `test-list` | `skill({ name: "test-list" })` |
| Red Phase | `red` | `skill({ name: "red" })` |
| Green Phase | `green` | `skill({ name: "green" })` |
| Refactor Phase | `refactor` | `skill({ name: "refactor" })` |

**If you find yourself writing test code or implementation code without invoking a skill first, you are doing it WRONG.**

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle.

## TDD Workflow

**MANDATORY: Use the specialized TDD skills for each phase of the cycle:**

### 1. Test List Phase
**INVOKE SKILL**: Use `skill` tool with `name: "test-list"`

**Required context to provide:**
- Feature/function to implement
- Target file paths (test file + implementation file)
- Any constraints or requirements from the user

The skill will guide you to create a comprehensive test list using `it.todo()` covering every rule and example from the specification:
- Cover every example and clarifying question from the spec
- Order tests from simple to complex
- No implementation yet

**DO NOT** write the test list yourself - follow the skill's guidance.

### 2. Red Phase
**INVOKE SKILL**: Use `skill` tool with `name: "red"`

**Required context to provide:**
- Test file path
- Which `it.todo()` to activate (name or line number)
- Current state (number of passing tests)
- Implementation file path

The skill will guide you to activate exactly ONE test and make it fail:
- Convert one `it.todo()` to executable test
- Make explicit predictions (Guessing Game)
- Verify compilation error, then runtime error

**DO NOT** write test code yourself - follow the skill's guidance.

### 3. Green Phase
**INVOKE SKILL**: Use `skill` tool with `name: "green"`

**Required context to provide:**
- Test file path
- Failing test name and expected behavior
- Current error message
- Implementation file path

The skill will guide you to implement minimal code to make the test pass:
- Use the simplest possible solution
- Hardcoded returns are acceptable early on
- No features for future tests

**DO NOT** write implementation code yourself - follow the skill's guidance.

### 4. Refactor Phase
**INVOKE SKILL**: Use `skill` tool with `name: "refactor"`

**Required context to provide:**
- Test file path
- Implementation file path
- Current number of passing tests
- Recent changes made in Green phase

The skill will guide you to improve code while keeping tests green:
- **MUST attempt at least one refactoring**
- Evaluate naming FIRST
- Apply Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass
- Document improvements or why none were possible

**DO NOT** refactor code yourself - follow the skill's guidance.

### 5. Repeat
Return to step 2 (Red phase) for the next test in the list.

**Invoke the `red` skill again - DO NOT proceed manually.**

## Core TDD Principles

### TDD Mindset
TDD practices will feel counterintuitive:
- **Hardcoded returns feel "too simple"** - This is correct!
- **The urge to implement ahead is strong** - Resist this
- **Minimal steps feel inefficient** - They actually accelerate development
- **Predictions feel unnecessary** - They build crucial understanding
- **Push through discomfort** - These feelings indicate you're following the discipline correctly

### Common TDD Failure Modes
Watch for these violations:
- **NOT USING TDD SKILLS** - The most critical failure mode!
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring
- Premature abstraction
- Ignoring the uncomfortable
- Writing code directly instead of invoking skills

### Why This Discipline Works
- **Baby steps reveal simpler solutions** - Implementing only what tests demand often uncovers simpler approaches
- **One-test-at-a-time prevents complexity** - Not thinking ahead eliminates unnecessary features
- **Predictions build confidence** - Explicit expectations create deeper understanding
- **Refactoring becomes natural** - Mandatory improvement attempts prevent technical debt
- **The process fights harmful instincts** - Programming instincts often lead to premature optimization

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

## TDD Experiment Mode (No HITL)

### Override for Automated Experiments

**This file overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously

### Autonomous Workflow

1. **Test List Phase** -> Invoke `test-list` skill
2. **For each test:**
   - **Red Phase** -> Invoke `red` skill
   - **Green Phase** -> Invoke `green` skill
   - **Refactor Phase** -> Invoke `refactor` skill
3. **Continue** until all tests implemented

### Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.
