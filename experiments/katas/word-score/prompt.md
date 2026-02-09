# Word Score Kata - Experiment Prompt

## Feature: Word Score Calculator

A word game needs to calculate scores for words based on letter positions in the alphabet. Each letter contributes its position value (A=1, B=2, ... Z=26).

## Rules

1. **Empty Word**: Empty string returns 0
2. **Single Letter**: Returns the letter's position (A=1, B=2, ... Z=26)
3. **Multiple Letters**: Returns sum of all letter positions
4. **Case Insensitive**: Uppercase and lowercase treated the same

## Examples

**Empty String**:
```
Input: ""
Output: 0
```

**Single Letter**:
```
Input: "A"
Output: 1

Input: "Z"
Output: 26

Input: "c"
Output: 3
```

**Simple Word**:
```
Input: "AB"
Output: 3  (A=1 + B=2)

Input: "CAB"
Output: 6  (C=3 + A=1 + B=2)
```

**Case Insensitive**:
```
Input: "Ab"
Output: 3  (A=1 + b=2)

Input: "aB"
Output: 3  (a=1 + B=2)

Input: "HeLLo"
Output: 52  (H=8 + e=5 + L=12 + L=12 + o=15)
```

## Task

Using TDD, implement the Word Score Calculator based on the rules and examples above.

## Expected Output Files

- `src/word-score.ts` - Implementation
- `src/word-score.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Follow TDD strictly (no implementation before tests)
- Input contains only letters (A-Z, a-z) or empty string
- No spaces, numbers, or special characters in input

The test-list agent should create the actual test list based on TDD principles (simple -> complex).
