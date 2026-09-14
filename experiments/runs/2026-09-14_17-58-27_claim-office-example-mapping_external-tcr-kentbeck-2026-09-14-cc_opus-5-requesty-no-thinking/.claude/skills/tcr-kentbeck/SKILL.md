---
name: tcr-kentbeck
description: >
  Enforces Test && Commit || Revert (TCR): run tests after each micro-change,
  commit only on green, discard the change on red.
  ALWAYS trigger when the user mentions TCR, test-commit-revert, or wants strict incremental commits with no red
  states kept in the working tree or history.
  The agent makes tiny changes, runs the full test suite, and either commits on green or reverts
  everything on red — never accumulating broken code.
  Do NOT trigger for general TDD questions, test framework setup, CI pipelines,
  or code coverage — those do not need this skill.
license: MIT
compatibility: Requires git
---

# TCR (Test && Commit || Revert)

## Non-negotiables

When this skill applies, treat TCR as **mandatory**, not optional:

1. **One small step** — Prefer the smallest change that could move tests toward green (or add a failing test first in strict TDD, then minimal implementation).
2. **Run tests** — Use the project’s real test command (see [Detecting the test command](#detecting-the-test-command)). **Always run the full suite** for that command (same as CI / default project test entrypoint): e.g. `pytest` with no path arguments, `npm test` / `pnpm test` / `yarn test`, `cargo test`, `go test ./...`, `make test` if that runs everything. Do **not** narrow to a single file, class, or `-k` filter unless the user explicitly asks for a scoped run.
3. **Green → commit** — If tests pass, **commit** that step immediately with a message that describes *what* changed (present tense, imperative).
4. **Red → revert** — If tests fail, **do not** keep the change. Restore the working tree to the last committed state (`git restore .` / `git checkout -- .` or revert unstaged edits as appropriate). Then retry with a smaller or different step.

5. **Red → log** — After reverting, **append** an entry to **`tcr-failure-log.md`** at the repository root (create it with a short title if missing). Record what went wrong so the failure is not invisible: **when** (ISO timestamp or equivalent), **which test(s)** failed and the **assertion or error** (or a short traceback excerpt), **what change was attempted** (intent in one or two sentences), and optionally **what to try next**. This file is append-only; do not delete past entries. Commit this log update with the **next** green commit if it is part of the same work, or as its own tiny commit if the user prefers a clean separation.

Do **not** accumulate uncommitted red edits “to fix in the next message.” Red means revert first, then log.

## Workflow loop

```
edit (tiny) → run tests → pass? → git add + git commit
                      ↘ fail? → revert working tree → append tcr-failure-log.md → try again
```

## Git behavior

- **Commit**: Include only files that belong to the green step; keep commits small and atomic.
- **Revert on failure**: Prefer discarding uncommitted changes to return to last commit. Do not commit broken states. If a commit was already made by mistake while red, use the project’s agreed recovery (e.g. `git reset --soft HEAD~1` only when the user expects rewriting history—default to revert/discard **before** committing).
- **Branch**: Same rules on feature branches: never push a sequence that leaves mainline patterns broken if your workflow requires linear green history.

## Detecting the test command

Resolve how to test **from the repo**, in order:

1. `package.json` → `scripts.test` (or `npm test` / `pnpm test` / `yarn test`).
2. `Makefile` → `make test` or documented target.
3. `pytest`, `cargo test`, `go test ./...`, Maven/Gradle, etc., from project conventions.
4. If unclear, check `README`, CI config (e.g. `.github/workflows`), or ask once.

Use the same command the project already uses; do not invent a second test runner without reason.

**Full suite:** The goal is “everything this project’s standard test command runs.” If the repo documents a different “full” command (e.g. `make test-all` vs `make test`), use the one that matches CI or README for complete coverage.

## Agent conduct

- **Proactive**: After substantive edits, run the **full** test suite before suggesting the task is done.
- **Honest**: If tests cannot be run in the environment, say so and either request permission to run them or describe exact commands for the user—do not claim TCR compliance without a green run.
- **Scope**: TCR applies to coding tasks that touch behavior covered by tests; pure docs-only changes may skip tests only when they cannot affect execution.

## Optional: user escape hatch

If the user explicitly says to **skip TCR** or **bend** the workflow for a one-off (e.g. WIP checkpoint), follow their instruction for that turn only, then return to TCR unless they say otherwise.
