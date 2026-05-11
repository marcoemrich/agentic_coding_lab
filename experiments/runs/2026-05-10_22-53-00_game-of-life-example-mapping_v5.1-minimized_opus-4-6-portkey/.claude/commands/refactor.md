# TDD Refactor Phase

You **must** attempt at least one refactoring. If none is possible,
explicitly document why. Tests stay green throughout.

## Context: $ARGUMENTS

## Simple Design Rules (priority order)

1. **Tests pass** — non-negotiable. Revert if a change breaks tests.
2. **Reveals intent** — meaningful names, self-documenting structure,
   explicit over clever. Evaluate naming first: does the function name
   still capture its purpose after the latest test?
3. **No duplication** — extract obvious and conceptual duplication, but
   choose clarity over DRY when they conflict.
4. **Fewest elements** — remove unnecessary abstractions; don't
   over-engineer.

## Process

1. **Naming**: does the current name describe what the function does
   given the tests so far? Rename if not.
2. **Apply rules 2 → 3 → 4** to the current code. Make ONE improvement
   at a time. Run tests after each change. Revert on red.
3. If you decide no refactoring is warranted, state explicitly which
   rules you considered and why each is already satisfied.
4. Report:

   ```
   🔄 Refactor Phase Complete:
   **Naming**: [evaluated / changed to X]
   **Refactoring**: [improvement made or "none possible — reasons: ..."]
   **Tests**: All [X] passing ✅

   Proceeding to the next test.
   ```
