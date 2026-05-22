# Test-Driven Development (TDD) Rules — Hybrid (v6)

## Why skills and subagents are required

This workflow is a **hybrid** of v4 (everything in isolated subagents) and v5 (everything in shared context):

- **`/test-list`, `/red`, `/green`** run as **Skills in the main context** — they share state, so the model keeps test list, last error, and current implementation in working memory.
- **Refactor** runs as a **Task subagent with isolated context** — the refactor agent sees only the current source/tests, not the full red/green history. Hypothesis: refactoring benefits from a fresh perspective free of implementation bias.

The skill and subagent invocations are not just stylistic. The experiment's measurement pipeline parses these tool calls to compute `cycle_count`, `predictions_correct_rate`, and `refactorings_applied`. If the orchestrating agent writes test code, implementation code, or refactorings directly instead of delegating, those actions produce **no measurable signal** — the run completes but the run-level metrics drop to zero, invalidating the data point. Delegation is the only way to populate the metrics.

## Which tool for which phase

| Phase | Mechanism | Invoke With |
|-------|-----------|-------------|
| Test List | Skill (main context) | `Skill({ skill: "test-list" })` |
| Red Phase | Skill (main context) | `Skill({ skill: "red" })` |
| Green Phase | Skill (main context) | `Skill({ skill: "green" })` |
| Refactor Phase | Task subagent (isolated context) | `Task({ subagent_type: "refactor", prompt: ... })` |

## TDD Workflow

### 1. Test List Phase
Invoke `Skill({ skill: "test-list" })` with feature, test file path, implementation file path, requirements. The skill creates a comprehensive test list using `it.todo()` for base functionality only.

### 2. Red Phase
Invoke `Skill({ skill: "red" })` with test file path, which `it.todo()` to activate, current passing-test count, implementation file path. The skill activates exactly one test, makes explicit predictions, verifies failure.

### 3. Green Phase
Invoke `Skill({ skill: "green" })` with test file path, failing test name, current error, implementation file path. The skill implements minimal code to make the test pass.

### 4. Refactor Phase
Launch the refactor subagent. The subagent has no memory of red/green — give it everything it needs in the prompt:

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

The agent must attempt at least one refactoring, evaluates naming first, and calculates APP (Absolute Priority Premise) mass before and after. After it returns, read its summary and proceed to the next Red phase.

### 5. Repeat
Return to step 2 with the next test from the list.

## Technical Setup

See `@.claude/rules/tdd_with_ts_and_vitest.md` for TypeScript and Vitest configuration. Run tests with `pnpm test`.
