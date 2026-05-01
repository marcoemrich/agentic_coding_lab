# String Calculator Kata

## User Story

**As a** developer
**I want** an `add` function that sums numbers given as a comma-separated string
**so that** I can quickly aggregate numeric input that arrives as text.

## Acceptance Criteria

- An empty input string returns zero.
- An input string containing a single number returns that number.
- An input string containing several numbers separated by commas returns the sum of all of them.
- The function works for any number of comma-separated numbers in the input.

## Expected Output Files

- `src/string-calculator.ts` - Implementation
- `src/string-calculator.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
