# String Calculator Kata - Experiment Prompt

## Input
You are given an Example Mapping image that describes the String Calculator feature.

## Task
Using TDD, implement the String Calculator based on the Example Mapping.

1. Create a test list from the Example Mapping
2. Complete the full TDD cycle (Red → Green → Refactor) for each test
3. Do NOT wait for human approval between phases - run autonomously
4. Record your progress and decisions

## Example Mapping Summary
(Use this if no image is provided)

**Feature**: String Calculator - Add function

**Rules**:
- Empty string returns 0
- Single number returns that number
- Two numbers (comma-separated) returns sum
- Multiple numbers (comma-separated) returns sum

**Examples**:
- "" → 0
- "1" → 1
- "1,2" → 3
- "1,2,3" → 6

## Expected Output Files
- `src/string-calculator.ts` - Implementation
- `src/string-calculator.spec.ts` - Tests

## Constraints
- Use Vitest for testing
- Use TypeScript
- Follow TDD strictly (no implementation before tests)
