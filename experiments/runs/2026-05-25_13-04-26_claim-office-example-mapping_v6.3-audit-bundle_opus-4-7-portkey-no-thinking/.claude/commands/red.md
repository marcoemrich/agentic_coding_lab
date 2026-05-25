# TDD Red Phase

You are now in the **Red Phase** of TDD. Follow these instructions to activate ONE test and make it fail.

## Mandatory Procedure

**All seven steps below are mandatory on every red cycle.** Predictions (Steps 2 and 5) are not optional even when the failure looks obvious — they are the measured signal. Skipping or collapsing a prediction block drops `predictions_correct_rate` to zero for the cycle and invalidates the data point. A wrong prediction is expected output (record `Incorrect` and continue), not a reason to skip.

## Your Mission

1. Activate exactly ONE test from the test list
2. Make explicit predictions about how it will fail
3. Verify the test fails for the right reason
4. Maintain strict discipline - NO implementation during Red phase

## Context: $ARGUMENTS

## Red Phase Rules

- **One test at a time**: Convert exactly ONE `it.todo()` to executable test
- **All other tests remain as `it.todo()`**: Never have more than one failing test
- **Two-stage failure**: First compilation error, then runtime/assertion error
- **Make predictions**: Explicitly state expected failures before running tests
- **No implementation**: Don't write code to make test pass yet

## Process

### Step 1: Activate One Test

Identify the next `it.todo()` and convert it to executable test code:

```typescript
// Convert from:
it.todo("should return 0 for empty input");

// To:
it("should return 0 for empty input", () => {
  expect(calculate("")).toBe(0);
});
```

Leave all other tests as `it.todo()`.

### Step 2: Predict Compilation Error

Before running the test, state your prediction:

```
🔴 Red Phase - Compilation Error Prediction:
- Test: "should return 0 for empty input"
- Expected: Compilation error
- Reason: Function `calculate` doesn't exist yet
- Error: "Cannot find name 'calculate'"
```

### Step 3: Run Test - Verify Compilation Error

Run `pnpm test` and record the actual result. The Step 7 prediction block reports whether the Step 2 prediction was `Correct` or `Incorrect`. Either way, proceed to Step 4 — a wrong prediction is a data point, not a blocker. Do not edit the Step 2 prediction after seeing the result.

### Step 4: Create Empty Function

Create minimal function stub (no logic):

```typescript
export const calculate = (input: string): number => {
  return undefined as unknown as number; // Intentionally wrong
};
```

### Step 5: Predict Runtime Error

Before running again, state your prediction:

```
🔴 Red Phase - Runtime Error Prediction:
- Test: "should return 0 for empty input"
- Expected: Runtime assertion error
- Expected value: 0
- Actual value: undefined
- Diff:
  Expected: 0
  Received: undefined
```

### Step 6: Run Test - Verify Runtime Error

Run `pnpm test` and record the actual result. The Step 7 prediction block reports whether the Step 5 prediction was `Correct` or `Incorrect`. Either way, proceed to Step 7 — a wrong prediction is a data point, not a blocker. Do not edit the Step 5 prediction after seeing the result.

### Step 7: Report Completion

You MUST output the full Step 7 block verbatim with `Correct` or `Incorrect`
chosen for each prediction. Do not abbreviate. Do not collapse the two
prediction lines into one.

**Why this format matters:** The block is mechanically parsed to compute
`predictions_correct_rate`. The parser expects two lines matching
`(- |✅ |❌ )(Correct|Incorrect)` per cycle — one for the compilation prediction,
one for the runtime prediction. Collapsing them into a single line, summarizing
them as "both correct", or skipping the block entirely drops the predictions
count for this cycle to zero. Format consistency here directly drives a metric
the experiment measures.

```
🔴 Red Phase Complete:
**Test Activated**: "should return 0 for empty input"
**Compilation Prediction**: Cannot find name 'calculate' ✅ Correct
**Runtime Prediction**: Expected 0, received undefined ✅ Correct
**Result**: Test fails as expected with assertion error

Proceeding to Green phase.
```

## Important Guidelines

### DO
- ✅ Activate exactly ONE test at a time
- ✅ Make explicit predictions before running tests
- ✅ Verify test fails for the right reason
- ✅ Keep all other tests as `it.todo()`

### DON'T
- ❌ Activate multiple tests
- ❌ Skip making predictions
- ❌ Write implementation to make test pass
- ❌ Suppress, rewrite, or backfill a wrong prediction after seeing the result

## Wrong Predictions Are Data

A prediction can be wrong — that is the point of recording it. The Step 7 block reports `Correct` or `Incorrect`; the measurement pipeline aggregates the rate across cycles.

When a prediction was wrong:

- Do **not** edit the original Step 2 / Step 5 prediction to match the observed result. The recorded prediction must be the one you made *before* running the test.
- Do **not** skip the report block or merge the two prediction lines into a summary. The parser needs both lines verbatim.
- Do continue the cycle through Step 7. Wrong predictions do not block progression — they populate the metric.

(For non-autonomous runs, the `HUMAN-IN-THE-LOOP.md` profile at the workflow root flips this behavior back to "STOP and escalate to human" — but it is not active in the default autonomous mode this file describes.)

## Completion

After completing Red phase, proceed to Green phase:

```
🔴 Red Phase Complete. Proceeding to Green phase.
```
