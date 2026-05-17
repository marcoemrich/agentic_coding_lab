# TDD Green Phase

You are now in the **Green Phase** of TDD. Make the failing test pass with minimal code.

## Why minimality matters

The Green Phase deliberately writes the smallest implementation that turns the active test green — even hardcoded returns, even obviously-incomplete logic. This is not laziness or naïveté:

- It **exposes refactoring opportunities** in the next phase. When the implementation does exactly one thing, structural smells are visible. Over-implemented green code looks "already clean" and hides design problems.
- It **prevents premature generalization**. The shape of the right abstraction emerges from the second and third test, not the first. Implementing for hypothetical future tests locks in a design before its constraints are known.
- It **keeps the red-green-refactor cycle short**. Each cycle pays a cost in tokens and context; over-implementing in green collapses several future cycles into one large one and loses the per-test feedback loop.

## Context: $ARGUMENTS

## Green Phase Rules

- **Minimal code only**: just enough to pass the current test
- **No future features**: don't implement what future tests might need
- **Hardcoded returns are allowed**
- **Tests must pass**: verify all tests are green
- **No refactoring during Green phase**: save improvements for Refactor phase

## Process

### Step 1: Analyze the Failing Test

Identify the input, the expected output, and the simplest way to produce that output.

### Step 2: Write Minimal Implementation

Pick the simplest pattern that turns the test green. As the test list grows, the implementation grows with it — but at each step, only as much as the active test demands:

```typescript
// Test 1: "should return 0 for empty input"
// Pattern: hardcoded return
export const calculate = (input: string): number => {
  return 0;
};

// Test 2: "should return number for single input"
// Pattern: simple conditional, still no looping
export const calculate = (input: string): number => {
  if (input === "") return 0;
  return parseInt(input);
};

// Test 3: "should add two numbers"
// Pattern: still no reduce; just sum two parts
export const calculate = (input: string): number => {
  if (input === "") return 0;
  const numbers = input.split(",");
  if (numbers.length === 1) return parseInt(numbers[0]);
  return parseInt(numbers[0]) + parseInt(numbers[1]);
};

// Test 4: "should add multiple numbers"
// Pattern: NOW generalize — the third number forces it
export const calculate = (input: string): number => {
  if (input === "") return 0;
  return input.split(",").reduce((sum, n) => sum + parseInt(n), 0);
};
```

Each step replaces only what the new test requires. Notice how generalization is delayed until the third example actually forces it — that's the discipline.

### Step 3: Run Tests

Run `pnpm test:unit:basic` and verify the current test now passes and all previous tests still pass.

### Step 4: Verify No Over-Implementation

Check:
- Did I implement features for future tests? → Remove them
- Did I add logic not demanded by current test? → Remove it
- Did I optimize prematurely? → Simplify
- Did I refactor existing code? → Revert, save for Refactor phase

### Step 5: Report Completion

```
Green Phase Complete:
**Implementation**: [brief description of what was added]
**Result**: All tests now pass ([X] passing)

Proceeding to Refactor phase.
```
