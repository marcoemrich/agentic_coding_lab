# TDD Red Phase

You are now in the **Red Phase** of TDD. Follow these instructions to activate ONE test and make it fail.

## Your Mission

1. Activate exactly ONE test from the test list
2. Make explicit predictions about how it will fail
3. Verify the test fails for the right reason
4. Maintain strict discipline - NO implementation during Red phase

## Context: $ARGUMENTS

## Red Phase Rules

- **One test at a time**: Convert exactly ONE inactive test to an executable test using the active stack profile
- **All other tests remain inactive**: Never have more than one failing test
- **Two-stage failure**: First load/compilation failure, then runtime/assertion failure, as defined by the active stack profile
- **Make predictions**: Explicitly state expected failures before running tests
- **No implementation**: Don't write code to make test pass yet

## Process

### Step 1: Activate One Test

Identify the next inactive test and convert it to executable test code using the activation example from the active stack profile. Leave all other tests inactive.

### Step 2: Predict Compilation Error

Before running the test, state your prediction:

```
🔴 Red Phase - Compilation Error Prediction:
- Test: [active test description]
- Expected: [load or compilation outcome]
- Reason: [why this outcome should occur]
- Error: [relevant expected message]
```

Use the active stack profile to distinguish loading, compilation, test discovery, and assertion failures.

### Step 3: Run Test - Verify Compilation Error

Run the focused test command from the active stack profile and verify:
- ✅ Load or compilation error as predicted, OR
- ❌ Prediction wrong → STOP and explain discrepancy

### Step 4: Create Empty Function

Create the minimal language-appropriate scaffold shown by the active stack profile. Add no behavior: the scaffold exists only to advance from the load/compilation failure to the intended runtime/assertion failure.

### Step 5: Predict Runtime Error

Before running again, state your prediction:

```
🔴 Red Phase - Runtime Error Prediction:
- Test: [active test description]
- Expected: Runtime assertion error
- Expected value: [expected value]
- Actual value: [scaffold value]
- Diff:
  Expected: [expected value]
  Received: [scaffold value]
```

### Step 6: Run Test - Verify Runtime Error

Run the focused test command from the active stack profile and verify:
- ✅ Assertion error as predicted, OR
- ❌ Prediction wrong → STOP and explain discrepancy

### Step 7: Report Completion

You MUST output the full Step 7 block verbatim with `Correct` or `Incorrect`
chosen for each prediction. Do not abbreviate. Do not collapse the two
prediction lines into one.

```
🔴 Red Phase Complete:
**Test Activated**: [active test description]
**Compilation Prediction**: [predicted load/compilation outcome] ✅ Correct
**Runtime Prediction**: [predicted runtime/assertion outcome] ✅ Correct
**Result**: Test fails as expected with assertion error

Proceeding to Green phase.
```

## Important Guidelines

### DO
- ✅ Activate exactly ONE test at a time
- ✅ Make explicit predictions before running tests
- ✅ Verify test fails for the right reason
- ✅ Keep all other tests inactive

### DON'T
- ❌ Activate multiple tests
- ❌ Skip making predictions
- ❌ Write implementation to make test pass
- ❌ Continue if prediction fails without explanation

## Prediction Failure Protocol

If your prediction was wrong:

```
❌ Prediction Failed:
- Predicted: [what you expected]
- Actual: [what happened]
- Discrepancy: [explanation]

Investigating the discrepancy before proceeding.
```

## Completion

After completing Red phase, proceed to Green phase:

```
🔴 Red Phase Complete. Proceeding to Green phase.
```
