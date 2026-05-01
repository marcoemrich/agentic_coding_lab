# Diamond Kata

## User Story

**As a** developer
**I want** a function that generates an ASCII letter diamond for any uppercase letter
**so that** I can render symmetric letter shapes for typography demos and code katas.

## Acceptance Criteria

- The diamond is symmetric along both the horizontal and the vertical axis.
- Every row is centered using leading spaces.
- The letter 'A' always appears alone on a single row (no inner spacing).
- All other letters appear twice per row, with the correct amount of inner spacing.
- The widest row contains the target letter and only the target letter.
- Calling the function with 'A' returns the single character "A".
- The result is returned as a string with rows separated by newline characters.

## Expected Output Files

- `src/diamond.ts` - Implementation
- `src/diamond.spec.ts` - Tests

## Constraints

- Use TypeScript
- Input is always a single uppercase letter (A-Z)
- Rows are separated by newline characters (`\n`)
