# Word Score Kata

## User Story

**As a** word game designer
**I want** to score a word by summing the alphabet positions of its letters
**so that** I have a simple, deterministic value to rank words by.

## Acceptance Criteria

- An empty word scores zero.
- A single letter scores its position in the alphabet (A=1, B=2, ..., Z=26).
- A word of multiple letters scores the sum of all its letter values.
- The scoring is case-insensitive: uppercase and lowercase letters contribute the same value.

## Expected Output Files

- `src/word-score.ts` - Implementation
- `src/word-score.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Input contains only letters (A-Z, a-z) or empty string
- No spaces, numbers, or special characters in input
