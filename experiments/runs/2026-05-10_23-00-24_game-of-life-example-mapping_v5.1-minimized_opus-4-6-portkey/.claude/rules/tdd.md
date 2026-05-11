# Test-Driven Development (TDD) Rules

This project uses strict Red-Green-Refactor TDD. **Use the specialized
TDD skills for every phase — do not write tests or implementation code
directly.** The skills enforce discipline and emit the markers the
experiment pipeline relies on.

## Phase → skill mapping

| Phase | Invoke |
|---|---|
| Test list | `Skill({ skill: "test-list" })` |
| Red       | `Skill({ skill: "red" })`       |
| Green     | `Skill({ skill: "green" })`     |
| Refactor  | `Skill({ skill: "refactor" })`  |

Each skill expects a short context string with the relevant file paths
and current state.

## Cycle

1. `/test-list` once at the start.
2. For each test in the list: `/red` → `/green` → `/refactor`.
3. Repeat step 2 until the list is empty.

## Technical setup

See `@.claude/rules/tdd_with_ts_and_vitest.md` for TypeScript and Vitest
configuration. Run tests with `pnpm test`.
