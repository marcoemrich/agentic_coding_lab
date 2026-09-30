# Test-Driven Development (TDD) Rules — Single Context (v5)

## ⚠️ CRITICAL: Skill Usage is MANDATORY

This workflow runs **every phase in the shared main context**:

- **`/test-list`, `/red`, `/green`, `/refactor`** all run as **Skills in the main context** — they share state, so the model keeps test list, last error, current implementation and refactoring history in working memory.
- There is **no isolated subagent** and **no final whole-tree refactoring pass**. Refactoring happens once per cycle, in the same context that just wrote the code.

The skill invocations are not just stylistic. The experiment's measurement pipeline parses these tool calls to compute `cycle_count`, `predictions_correct_rate`, and `refactorings_applied`. If the agent writes test code, implementation code, or refactorings directly instead of invoking the skill, those actions produce **no measurable signal** — the run completes but the run-level metrics drop to zero, invalidating the data point. Invoking the skill is the only way to populate the metrics.

Do NOT perform TDD phases without invoking the appropriate skill.

### Before Starting Any TDD Work — Complete This Checklist:

- [ ] Have I been asked to implement something using TDD?
- [ ] Am I about to write tests or implementation code?
- [ ] **STOP** — Use the Skill tool (test-list/red/green/refactor)
- [ ] NEVER write tests, code, or refactorings directly — ALWAYS invoke the skill

### Which Tool to Use:

| Phase | Mechanism | Invoke With |
|-------|-----------|-------------|
| Test List | **Skill** (main context) | `Skill({ skill: "test-list" })` |
| Red Phase | **Skill** (main context) | `Skill({ skill: "red" })` |
| Green Phase | **Skill** (main context) | `Skill({ skill: "green" })` |
| Refactor Phase (per cycle) | **Skill** (main context) | `Skill({ skill: "refactor" })` |

**If you find yourself writing test code, implementation code, or a refactoring without invoking the right tool first, you are doing it WRONG.**

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle. v6 keeps red and green in a shared context so the predictions, error messages, and minimal implementations stay coherent — and isolates refactoring so the model evaluates the resulting code on its own merits.

## TDD Workflow

### 1. Test List Phase
**🚨 INVOKE SKILL**: `Skill({ skill: "test-list" })`

Provide: feature, test file path, implementation file path, requirements.

The skill creates a comprehensive test list using `it.todo()` covering every rule and example from the specification.

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
**🚨 INVOKE SKILL**: `Skill({ skill: "refactor" })`

Provide: test file path, implementation file path, current passing-test count,
and a one-line summary of what the Green phase just added.

The skill improves the code while keeping tests green:
- MUST attempt at least one refactoring (or document why none is possible)
- Evaluate naming FIRST
- Apply Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass before/after

**DO NOT** refactor code yourself — invoke the skill. Afterwards, run the tests
for sanity and proceed to the next Red phase.

### 5. Repeat
Return to step 2 (Red phase) for the next test. **Invoke the `red` skill again.**

### 6. Done

When the last test in the list is implemented and its refactor pass is done,
the workflow is complete. There is no final whole-tree refactoring pass —
refactoring happens once per cycle, on the code that cycle touched.

Proceed to the Done Marker.

## Core TDD Principles

### TDD Mindset
TDD practices will feel counterintuitive:
- **Hardcoded returns feel "too simple"** — This is correct!
- **The urge to implement ahead is strong** — Resist this
- **Minimal steps feel inefficient** — They actually accelerate development
- **Predictions feel unnecessary** — They build crucial understanding

### Common TDD Failure Modes
- **🚨 NOT USING SKILLS / SUBAGENT** — The most critical failure mode
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring
- Refactoring inline instead of via the `refactor` skill

## Technical Setup

See `@.claude/rules/tdd-with-ts-and-vitest.md` for TypeScript and Vitest configuration.

## Rule Files

| File | Contains | Export |
|------|----------|--------|
| `tdd.md` (this file) | The TDD workflow itself | keep |
| `@.claude/rules/tdd-with-ts-and-vitest.md` | TypeScript + Vitest setup | keep |
<!-- LAB-ONLY:START -->
| `@.claude/rules/lab-only.md` | Lab measurement infrastructure: autonomous execution, done-marker, phase continuation | **delete when exporting** |
<!-- LAB-ONLY:END -->

## Running Tests

Run tests with `pnpm test`.

## Remember

- **🚨 ALWAYS USE SKILLS** for test-list/red/green/refactor
- Never write tests, implementation, or refactorings directly
- Every phase shares one context — the refactor step sees the full red/green history
- Trust the process — discomfort is a signal you're doing it right
