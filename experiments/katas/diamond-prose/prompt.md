# Diamond Kata

## Feature

Given an uppercase letter, produce a diamond shape that starts with 'A', expands out to the given letter, and contracts back to 'A'. The shape is symmetric along both its horizontal and vertical axis. Each line is centered with leading spaces so that the letters form a diamond outline. The outermost letters appear only once on the widest middle row, while every other letter appears twice per row, separated by inner spaces. Calling the function with the letter 'A' should simply return the single character 'A'. The width of the diamond grows with the position of the target letter in the alphabet.

## Task

Implement a function that returns the diamond as a string with rows separated by newline characters.

## Expected Output Files

- `src/diamond.ts` - Implementation
- `src/diamond.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Input is always a single uppercase letter (A-Z)
- Rows are separated by newline characters (`\n`)
