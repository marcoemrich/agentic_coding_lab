# TDD Green Phase

You are now in the **Green Phase** of TDD. Follow these instructions to make the failing test pass with MINIMAL code.

## Your Mission

1. Implement the **minimal code** necessary to make the failing test pass
2. Use the **simplest possible solution** (hardcoded values are acceptable)
3. Avoid adding features for future tests
4. Verify all tests pass
5. NO optimization, NO refactoring yet

## Context: $ARGUMENTS

## Green Phase Rules

- **Minimal code only**: Just enough to pass the current test
- **Baby steps**: Make the smallest possible change
- **No future features**: Don't implement what future tests might need
- **Simple is better**: Hardcoded returns are perfectly fine
- **Tests must pass**: Verify all tests are green
- **No refactoring yet**: Save improvements for Refactor phase

## Process

### Step 1: Analyze the Failing Test

Understand what the test expects:
- What input does the test provide?
- What output does it expect?
- What is the **simplest** way to produce that output?

### Step 2: Write Minimal Implementation

Implement **only what's needed** to make the current test pass. Follow the language-specific Green progression and examples in the active stack profile: begin with a hardcoded result, introduce a narrow conditional only when another active test requires it, and generalize only when forced by a later example.

### Step 3: Run Tests

Run the focused test command from the active stack profile and verify:
- Current test now passes ✅
- All previous tests still pass ✅

### Step 4: Verify No Over-Implementation

Check yourself:
- ❓ Did I implement features for future tests? → Remove them
- ❓ Did I add logic not demanded by current test? → Remove it
- ❓ Did I optimize prematurely? → Simplify
- ❓ Did I refactor existing code? → Revert, save for Refactor phase

### Step 5: Report Completion

```
🟢 Green Phase Complete:
**Implementation**: [brief description of what was added]
**Result**: All tests now pass ([X] passing)
**Approach**: [explain why this is minimal]

Proceeding to Refactor phase.
```

## Minimal Implementation Strategies

Use the concrete syntax examples from the active stack profile for these language-neutral progression steps:

1. **Hardcoded return** — preferred for an early test
2. **Simple conditional** — introduced when multiple active tests require different results
3. **Generalization** — introduced only when another active example forces it

## Important Guidelines

### DO
- ✅ Write minimal code to make test pass
- ✅ Use hardcoded values when appropriate
- ✅ Take baby steps
- ✅ Verify all tests pass

### DON'T
- ❌ Implement beyond what tests demand
- ❌ Add features for future tests
- ❌ Optimize prematurely
- ❌ Refactor during Green phase

## Psychological Resistance

You will feel resistance:
- **"This is too simple"** → That's correct! Minimal is the way
- **"Hardcoded values feel wrong"** → They're exactly right for early tests
- **"I should implement ahead"** → Resist this strongly
- **"This is inefficient"** → Actually accelerates development

Trust the process. Simple steps compound into elegant solutions.

## Completion

After completing Green phase, proceed to Refactor phase:

```
🟢 Green Phase Complete. Proceeding to Refactor phase.
```
