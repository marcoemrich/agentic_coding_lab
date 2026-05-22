# TDD Green Phase

Implement the **minimal code** that makes the failing test pass. No
features for future tests, no optimisation, no refactoring.

## Context: $ARGUMENTS

## Rules

- Just enough to pass the current test. Hardcoded returns are fine.
- All previously passing tests must stay green.
- Save improvements for the Refactor phase.

## Process

1. Read the failing test: input, expected output, simplest path from one
   to the other.
2. Write the minimal implementation. Examples:

   ```typescript
   // Test: "should return 0 for empty input"
   export const calculate = (input: string): number => 0;

   // Test: "should return number for single input"
   export const calculate = (input: string): number => {
     if (input === "") return 0;
     return parseInt(input);
   };
   ```

3. Run `pnpm test:unit:basic` and verify all tests pass.
4. Self-check: did I implement features for future tests? Add logic the
   current test does not demand? Optimise? Refactor? If yes, revert.
5. Report:

   ```
   🟢 Green Phase Complete:
   **Implementation**: [brief description]
   **Result**: All tests now pass ([X] passing)

   Proceeding to Refactor phase.
   ```
