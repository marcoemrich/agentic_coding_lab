# Word Score Kata

## Feature

A word game needs a function that scores words based on the position of each letter in the alphabet. The letter A is worth one point, B is worth two, and so on up to Z which is worth twenty-six. The score of a word is the sum of the scores of its letters. The function is case-insensitive: uppercase and lowercase letters of the same character contribute the same value. An empty string scores zero.

## Task

Implement the word score function according to the description above.

## Expected Output Files

- `src/word-score.ts` - Implementation
- `src/word-score.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Input contains only letters (A-Z, a-z) or empty string
- No spaces, numbers, or special characters in input
