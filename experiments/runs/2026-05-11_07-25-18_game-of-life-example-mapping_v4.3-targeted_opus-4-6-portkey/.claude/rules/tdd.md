# Test-Driven Development (TDD) Rules

This project uses strict Red-Green-Refactor TDD. **Use the specialized
TDD agents for every phase — do not write tests or implementation code
directly.**

## Phase → agent mapping

| Phase | Launch with |
|---|---|
| Test list | `Task({ subagent_type: "test-list" })` |
| Red       | `Task({ subagent_type: "red" })`       |
| Green     | `Task({ subagent_type: "green" })`     |
| Refactor  | `Task({ subagent_type: "refactor" })`  |

Each agent expects a prompt string with the relevant file paths and
current state.

## Cycle

1. `test-list` once at the start.
2. For each test in the list: `red` → `green` → `refactor`.
3. Repeat step 2 until the list is empty.

## Technical setup

See `@.claude/rules/tdd_with_ts_and_vitest.md` for TypeScript and Vitest
configuration. Run tests with `pnpm test`.
