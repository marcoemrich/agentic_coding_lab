# Test-Driven Development (TDD) Rules — Hybrid Green+Refactor (v7)

## ⚠️ CRITICAL: Skill + Subagent Usage is MANDATORY

This workflow sits between v6 (only refactor isolated) and v4 (everything isolated):

- **`/test-list` and `/red`** run as **Skills in the main context** (like v5/v6) — they share state, so the model keeps the test list, predictions, and last failing test in working memory.
- **Green and Refactor** run as **Task subagents with isolated context** (like v4) — each gets a fresh perspective, free of red-phase implementation bias. Hypothesis: isolating green prevents over-implementation driven by accumulated context; isolating refactor prevents anchoring on the just-written minimal code.

Do NOT perform TDD phases without invoking the appropriate skill or agent.

### Before Starting Any TDD Work — Complete This Checklist:

- [ ] Have I been asked to implement something using TDD?
- [ ] Am I about to write tests or implementation code?
- [ ] **STOP** — Use the Skill tool (test-list/red) or the Task tool (green/refactor)
- [ ] NEVER write tests, code, or refactorings directly — ALWAYS delegate

### Which Tool to Use:

| Phase | Mechanism | Invoke With |
|-------|-----------|-------------|
| Test List | **Skill** (main context) | `Skill({ skill: "test-list" })` |
| Red Phase | **Skill** (main context) | `Skill({ skill: "red" })` |
| Green Phase | **Task subagent** (isolated context) | `Task({ subagent_type: "green", prompt: ... })` |
| Refactor Phase | **Task subagent** (isolated context) | `Task({ subagent_type: "refactor", prompt: ... })` |

**If you find yourself writing test code, implementation code, or a refactoring without invoking the right tool first, you are doing it WRONG.**

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle. v7 keeps test-list and red in a shared context so predictions, error messages, and the active test stay coherent — and isolates both green and refactor so each evaluates the situation on its own merits without accumulated implementation bias.

## TDD Workflow

### 1. Test List Phase
**🚨 INVOKE SKILL**: `Skill({ skill: "test-list" })`

Provide: feature, test file path, implementation file path, requirements.

The skill creates a comprehensive test list using `it.todo()` for BASE FUNCTIONALITY ONLY.

**DO NOT** write the test list yourself.

### 2. Red Phase
**🚨 INVOKE SKILL**: `Skill({ skill: "red" })`

Provide: test file path, which `it.todo()` to activate, current passing-test count, implementation file path.

The skill activates exactly ONE test, makes explicit predictions, and verifies failure.

**DO NOT** write test code yourself.

### 3. Green Phase
**🚨 LAUNCH AGENT**: `Task({ subagent_type: "green", prompt: ... })`

**Required prompt context** (the subagent has no memory of test-list/red — give it everything it needs):

```
Task({
  subagent_type: "green",
  prompt: `
    Test file: src/<feature>.spec.ts
    Implementation file: src/<feature>.ts
    Failing test: <name of the just-activated test>
    Current error: <one-line summary of the red-phase failure>
    Passing tests so far: <count>

    Implement the minimal code to make the failing test pass.
    Do NOT refactor — that comes in the next phase.

    EXPERIMENT MODE: Run autonomously, return when done.
  `
})
```

The agent will write the simplest possible implementation:
- Hardcoded returns are fine for early tests
- No features for future tests
- All previously passing tests must still pass
- No refactoring — only minimal additions

**DO NOT** write implementation code yourself — let the agent do it. After it returns, read its summary, run tests for a sanity check if needed, and proceed to the Refactor phase.

### 4. Refactor Phase
**🚨 LAUNCH AGENT**: `Task({ subagent_type: "refactor", prompt: ... })`

**Required prompt context** (the subagent has no memory of red/green — give it everything it needs):

```
Task({
  subagent_type: "refactor",
  prompt: `
    Test file: src/<feature>.spec.ts
    Implementation file: src/<feature>.ts
    Passing tests: <count>
    Recent Green phase: <one-line summary of what was just added>

    Refactor the implementation while keeping all tests green.

    EXPERIMENT MODE: Run autonomously, return when done.
  `
})
```

The agent will improve code while keeping tests green:
- MUST attempt at least one refactoring (or document why none is possible)
- Evaluate naming FIRST
- Apply Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass before/after

**DO NOT** refactor code yourself — let the agent do it. After it returns, read its summary, apply any test-runs needed for sanity, and proceed to the next Red phase.

### 5. Repeat
Return to step 2 (Red phase) for the next test. **Invoke the `red` skill again.**

## Core TDD Principles

### TDD Mindset
TDD practices will feel counterintuitive:
- **Hardcoded returns feel "too simple"** — This is correct!
- **The urge to implement ahead is strong** — Resist this
- **Minimal steps feel inefficient** — They actually accelerate development
- **Predictions feel unnecessary** — They build crucial understanding

### Common TDD Failure Modes
- **🚨 NOT USING SKILLS / SUBAGENTS** — The most critical failure mode
- Planning beyond base functionality
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring
- Writing green/refactor code in the main context instead of via the subagent

## Technical Setup

See `@.claude/rules/tdd_with_ts_and_vitest.md` for TypeScript and Vitest configuration.

## Running Tests

Run tests with `pnpm test`.

## Remember

- **🚨 ALWAYS USE SKILLS** for test-list/red; **ALWAYS USE SUBAGENTS** for green/refactor
- Never write tests, implementation, or refactorings directly
- Green and refactor subagents run in isolated contexts — give each everything it needs in the prompt
- Trust the process — discomfort is a signal you're doing it right
