# Test-Driven Development (TDD) Rules — Hybrid (v6)

## ⚠️ CRITICAL: Skill + Subagent Usage is MANDATORY

This workflow is a **hybrid** of v4 and v5:

- **`/test-list`, `/red`, `/green`** run as **Skills in the main context** (like v5) — they share state, so the model keeps test list, last error, and current implementation in working memory.
- **Refactor** runs as a **Task subagent with isolated context** (like v4) — the refactor agent sees only the current source/tests, not the full red/green history. Hypothesis: refactoring benefits most from a fresh perspective free of implementation bias.

Do NOT perform TDD phases without invoking the appropriate skill or agent.

### Before Starting Any TDD Work — Complete This Checklist:

- [ ] Have I been asked to implement something using TDD?
- [ ] Am I about to write tests or implementation code?
- [ ] **STOP** — Use the Skill tool (test-list/red/green) or the Task tool (refactor)
- [ ] NEVER write tests, code, or refactorings directly — ALWAYS delegate

### Which Tool to Use:

| Phase | Mechanism | Invoke With |
|-------|-----------|-------------|
| Test List | **Skill** (main context) | `Skill({ skill: "test-list" })` |
| Red Phase | **Skill** (main context) | `Skill({ skill: "red" })` |
| Green Phase | **Skill** (main context) | `Skill({ skill: "green" })` |
| Refactor Phase | **Task subagent** (isolated context) | `Task({ subagent_type: "refactor", prompt: ... })` |

**If you find yourself writing test code, implementation code, or a refactoring without invoking the right tool first, you are doing it WRONG.**

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle. v6 keeps red and green in a shared context so the predictions, error messages, and minimal implementations stay coherent — and isolates refactoring so the model evaluates the resulting code on its own merits.

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
**🚨 INVOKE SKILL**: `Skill({ skill: "green" })`

Provide: test file path, failing test name, current error, implementation file path.

The skill implements minimal code to make the test pass — hardcoded returns are fine for early tests.

**DO NOT** write implementation code yourself.

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
- **🚨 NOT USING SKILLS / SUBAGENT** — The most critical failure mode
- Planning beyond base functionality
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring
- Refactoring in the main context instead of via the subagent

## Technical Setup

See `@.claude/rules/tdd_with_ts_and_vitest.md` for TypeScript and Vitest configuration.

## Running Tests

Run tests with `pnpm test`.

## Remember

- **🚨 ALWAYS USE SKILLS** for test-list/red/green; **ALWAYS USE THE SUBAGENT** for refactor
- Never write tests, implementation, or refactorings directly
- Refactor subagent runs in an isolated context — give it everything it needs in the prompt
- Trust the process — discomfort is a signal you're doing it right
