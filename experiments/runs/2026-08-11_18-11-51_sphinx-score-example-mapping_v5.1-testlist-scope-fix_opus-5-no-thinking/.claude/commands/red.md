# TDD Red Phase

You are now in the **Red Phase** of TDD. Follow these instructions to activate ONE test and make it fail.

## Your Mission

Guide developers through the Red phase of TDD by helping them:
1. Activate exactly ONE test from the test list
2. Make explicit predictions about how the test will fail
3. Verify the test fails for the right reason (compilation error, then runtime error)
4. Maintain strict TDD discipline - no implementation during Red phase

## Context: $ARGUMENTS

## Red Phase Rules
- **One test at a time**: Convert exactly ONE `it.todo()` to executable test code
- **All other tests remain as `it.todo()`**: Never have more than one failing test
- **Two-stage failure**: First compilation error, then runtime/assertion error
- **Make predictions**: Explicitly state expected failures before running tests
- **No implementation**: Don't write code to make test pass yet

## Red Phase Process

### Step 1: Activate One Test
- Identify the next `it.todo()` from the test list
- Convert it to executable test code
- Leave all other tests as `it.todo()`
- Ensure only one test is active/failing

### Step 2: Make Prediction (Guessing Game) - Compilation Error
Before running the test, explicitly state:
- **Which test will fail**
- **Type of error**: Compilation error
- **Reason**: Function doesn't exist yet
- **Expected error message** (TypeScript/compiler error)

Example prediction:
```
🔴 Red Phase - Compilation Error Prediction:
- Test: "should return 0 for empty input"
- Expected: Compilation error
- Reason: Function `calculate` doesn't exist yet
- Error: "Cannot find name 'calculate'"
```

### Step 3: Run Test - Verify Compilation Error
- Run the test
- Verify it fails with compilation error as predicted
- If prediction was wrong, STOP and explain discrepancy

### Step 4: Create Empty Function
- Create function signature with minimal implementation
- Function should return `undefined`, wrong type, or wrong value
- No actual logic yet

### Step 5: Make Prediction - Runtime Error
Before running the test again, explicitly state:
- **Which test will fail**
- **Type of error**: Runtime/assertion error
- **Expected value** (what test expects)
- **Actual value** (what function will return)
- **Expected diff output**

Example prediction:
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
- Run the test
- Verify it fails with assertion error as predicted
- If prediction was wrong, STOP and explain discrepancy

### Step 7: Report Completion

You MUST output the full Step 7 block verbatim with `Correct` or `Incorrect`
chosen for each prediction. Do not abbreviate. Do not collapse the two
prediction lines into one.

```
🔴 Red Phase Complete:
**Test Activated**: "should return 0 for empty input"
**Compilation Prediction**: Cannot find name 'calculate' ✅ Correct
**Runtime Prediction**: Expected 0, received undefined ✅ Correct
**Result**: Test fails as expected with assertion error

Proceeding to Green phase.
```

## Important Guidelines

### What to DO
- ✅ Activate exactly ONE test at a time
- ✅ Make explicit predictions before running tests
- ✅ Verify test fails for the right reason
- ✅ Explain if predictions fail
- ✅ Keep all other tests as `it.todo()`

### What NOT to do
- ❌ Never activate multiple tests simultaneously
- ❌ Never skip making predictions
- ❌ Never write implementation to make test pass
- ❌ Never continue if prediction fails without explanation
- ❌ Never implement beyond creating empty function

## Psychological Resistance

Developers will experience resistance:
- **Feels uncomfortable** - This is normal and correct
- **Seems wasteful** - Two-stage failure seems redundant but builds understanding
- **Urge to implement** - Strong desire to fix the test immediately
- **Push through discomfort** - These feelings indicate correct discipline

## Red Flags

Watch for these violations:
- Multiple active tests (not `it.todo()`)
- Skipping predictions
- Writing implementation before test fails
- Not verifying test actually fails
- Ignoring failed predictions

## Output Format

### When Activating Test
```typescript
// Convert from:
it.todo("should return 0 for empty input");

// To:
it("should return 0 for empty input", () => {
  expect(calculate([])).toBe(0);
});
```

### Prediction Template - Compilation Error
```
🔴 Red Phase - Compilation Error Prediction:
- Test: [test name]
- Expected: Compilation error
- Reason: [why it will fail]
- Error: [expected error message]
```

### Prediction Template - Runtime Error
```
🔴 Red Phase - Runtime Error Prediction:
- Test: [test name]
- Expected: Runtime assertion error
- Expected value: [expected]
- Actual value: [actual]
- Diff: [expected diff output]
```

### Completion Template
```
🔴 Red Phase Complete:
**Test Activated**: [test name]
**Compilation Prediction**: [error message] ✅ Correct / ❌ Incorrect
**Runtime Prediction**: [error message] ✅ Correct / ❌ Incorrect
**Result**: [actual result]

Proceeding to Green phase.
```

## Remember

- **One test at a time** - Never more than one active test
- **Predictions are mandatory** - Build understanding through explicit expectations
- **Two-stage failure** - Compilation error, then runtime error
- **No implementation** - Only create empty function signature
- **Trust the process** - Discomfort indicates correct discipline

Your goal is to maintain strict TDD discipline, ensure predictions are made and verified, and proceed autonomously through the TDD cycle.
