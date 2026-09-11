# TDD Green Phase

You are now in the **Green Phase** of TDD. Follow these instructions to make the failing test pass with MINIMAL code.

## Your Mission

1. Implement the minimal code necessary to make the failing test pass
2. Use the simplest possible solution (hardcoded values are acceptable)
3. Do not add features for future tests
4. Verify all tests pass
5. No optimization, no refactoring during Green phase

## Context: $ARGUMENTS

## Green Phase Rules

- **Minimal code only**: Just enough to pass the current test
- **Smallest change**: Make the smallest possible change
- **No future features**: Don't implement what future tests might need
- **Hardcoded returns are allowed**
- **Tests must pass**: Verify all tests are green
- **No refactoring during Green phase**: Save improvements for Refactor phase

## Process

### Step 1: Analyze the Failing Test

Identify:
- What input does the test provide?
- What output does it expect?
- What is the simplest way to produce that output?

### Step 2: Write Minimal Implementation

Implement only what's needed to make the current test pass:

```typescript
// For first test "should return 0 for empty input":
export const calculate = (input: string): number => {
  return 0;
};

// For second test "should return number for single input":
export const calculate = (input: string): number => {
  if (input === "") return 0;
  return parseInt(input);
};

// For third test "should add two numbers":
export const calculate = (input: string): number => {
  if (input === "") return 0;
  const numbers = input.split(",");
  if (numbers.length === 1) return parseInt(numbers[0]);
  return parseInt(numbers[0]) + parseInt(numbers[1]);
};
```

### Step 3: Run Tests

Run `pnpm test:unit:basic` and verify:
- Current test now passes
- All previous tests still pass
### Step 4: Verify No Over-Implementation

Check:
- ❓ Did I implement features for future tests? → Remove them
- ❓ Did I add logic not demanded by current test? → Remove it
- ❓ Did I optimize prematurely? → Simplify
- ❓ Did I refactor existing code? → Revert, save for Refactor phase

### Step 5: Report Completion

```
Green Phase Complete:
**Implementation**: [brief description of what was added]
**Result**: All tests now pass ([X] passing)

Proceeding to Refactor phase.
```

## Minimal Implementation Strategies

### Hardcoded Returns

```typescript
// Test: "should return 0 for empty input"
return 0;
```

### Simple Conditionals

```typescript
// Test: "should return number for single input"
if (input === "") return 0;
return parseInt(input);
```

### Generalization (only when forced by a new test)

```typescript
// Test: "should add multiple numbers"
return input.split(",").reduce((sum, n) => sum + parseInt(n), 0);
```

## Important Guidelines

### DO
- Write minimal code to make test pass
- Use hardcoded values when appropriate
- Take small steps
- Verify all tests pass

### DON'T
- Implement beyond what tests demand
- Add features for future tests
- Optimize prematurely
- Refactor during Green phase

## Completion

After completing Green phase, proceed to Refactor phase:

```
Green Phase Complete. Proceeding to Refactor phase.
```
