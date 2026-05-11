# TDD Red Phase

Activate exactly ONE test from the list and make it fail. No
implementation in this phase.

## Context: $ARGUMENTS

## Rules

- One test at a time. All other tests stay as `it.todo()`.
- Two-stage failure: first compilation error, then runtime/assertion
  error.
- Make explicit predictions before each test run.

## Process

### Step 1: Activate one test

Convert the next `it.todo()` into an executable test:

```typescript
it("should return 0 for empty input", () => {
  expect(calculate("")).toBe(0);
});
```

### Step 2: Predict the compilation error

```
🔴 Red Phase - Compilation Error Prediction:
- Expected: Compilation error
- Reason: Function `calculate` doesn't exist yet
```

### Step 3: Run `pnpm test:unit:basic` and verify the compilation error

If the prediction is wrong, STOP and explain.

### Step 4: Create an empty function stub

```typescript
export const calculate = (input: string): number => {
  return undefined as unknown as number; // intentionally wrong
};
```

### Step 5: Predict the runtime error

```
🔴 Red Phase - Runtime Error Prediction:
- Expected: assertion error
- Expected value: 0
- Actual value: undefined
```

### Step 6: Run `pnpm test:unit:basic` and verify the runtime error

If the prediction is wrong, STOP and explain.

### Step 7: Report Completion

You MUST output the full Step 7 block verbatim, do not abbreviate, do
not collapse the two prediction lines into one. Choose `Correct` or
`Incorrect` for each prediction.

```
🔴 Red Phase Complete:
**Test Activated**: "should return 0 for empty input"
**Compilation Prediction**: Cannot find name 'calculate' ✅ Correct
**Runtime Prediction**: Expected 0, received undefined ✅ Correct
**Result**: Test fails as expected with assertion error

Proceeding to Green phase.
```
