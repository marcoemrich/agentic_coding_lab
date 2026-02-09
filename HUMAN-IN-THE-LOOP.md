# Human-in-the-Loop (HITL) TDD Rules

This file contains the HITL rules that were removed from the experiment workflows for autonomous runs.
Use this as a reference to re-enable HITL checkpoints when human oversight is desired.

## Overview

HITL ensures the human stays engaged and can provide guidance at critical decision points during Test-Driven Development. The AI pauses and explicitly asks for user feedback at the end of every TDD phase.

## How to Re-Enable HITL

To add HITL back to a workflow:

1. **Add these sections to agent/command files** (red.md, green.md, refactor.md)
2. **Add the "Human-in-the-Loop" section to tdd.md**
3. **Update the descriptions** to include "Stop and wait for approval"

---

## Rule 1: End-of-Phase Confirmation

### When to Apply
At the **end of every TDD phase** (Red, Green, or Refactor), before proceeding to the next phase or test.

### What to Do
1. **Stop after completing the current phase**
2. **Summarize what was just completed in this phase**
3. **Explicitly ask for permission to continue**

---

## Phase-Specific HITL Instructions

### Red Phase HITL

Add to `red.md` agent/command:

```markdown
### Human-in-the-Loop Rules
- **Stop after Red phase**: Wait for explicit user approval before proceeding to Green
- **Prediction failures**: Stop immediately if prediction is wrong and explain discrepancy
- **No autonomous continuation**: Each phase requires explicit human approval
```

Replace "Report Completion" with:

```markdown
### Step 7: Human Checkpoint
**STOP and explicitly ask for permission to continue**:
\`\`\`
🔴 Red Phase Complete:
**Test Activated**: "should return 0 for empty input"
**Prediction**: Runtime assertion error (Expected: 0, Received: undefined) ✅ Correct
**Result**: Test fails as expected with assertion error

Red phase complete. Should I proceed to Green phase?
\`\`\`
```

Add to "What to DO":
```markdown
- ✅ Stop after Red phase and wait for approval
```

Add to "What NOT to do":
```markdown
- ❌ Never proceed to Green phase without approval
```

---

### Green Phase HITL

Add to `green.md` agent/command:

```markdown
### Human-in-the-Loop Rules
- **Stop after Green phase**: Wait for explicit user approval before proceeding to Refactor
- **No autonomous continuation**: Each phase requires explicit human approval
```

Replace "Report Completion" with:

```markdown
### Step 5: Human Checkpoint
**STOP and explicitly ask for permission to continue**:
\`\`\`
🟢 Green Phase Complete:
**Implementation**: [describe what was implemented]
**Result**: All tests now pass
**Approach**: [explain why this is minimal]

Green phase complete. Should I proceed to Refactor phase?
\`\`\`
```

Add to "What to DO":
```markdown
- ✅ Stop after Green phase and wait for approval
```

Add to "What NOT to do":
```markdown
- ❌ Never proceed to Refactor phase without approval
```

---

### Refactor Phase HITL

Add to `refactor.md` agent/command:

```markdown
### Human-in-the-Loop Rules
- **Stop after Refactor phase**: Wait for explicit user approval before next test
- **No autonomous continuation**: Each phase requires explicit human approval
```

Replace "Report Completion" with:

```markdown
### Step 7: Human Checkpoint
**STOP and explicitly ask for permission to continue**:
\`\`\`
🔄 Refactor Phase Complete:
**Refactoring**: [improvements made or "none possible"]
**Mass Change**: [before → after] (if calculated)
**Tests**: All passing ✅

Refactor phase complete. Should I proceed to the next test?
\`\`\`
```

Add to "What to DO":
```markdown
- ✅ Stop after Refactor phase and wait for approval
```

Add to "What NOT to do":
```markdown
- ❌ Never proceed to next test without approval
```

---

### Test List Phase HITL

Add to `test-list.md` command:

```markdown
## Human Checkpoint

After completing the test list:

\`\`\`
📋 Test List Phase Complete.

Should I proceed to Red phase with the first test?
\`\`\`

Wait for explicit approval before continuing.
```

---

## TDD Rules File Addition

Add this section to `tdd.md` (after "Core TDD Principles"):

```markdown
## Human-in-the-Loop

See `@.claude/rules/human-in-the-loop.md` for detailed checkpoint requirements.

**Key principle**: Stop after every phase (Red, Green, Refactor) and wait for explicit approval before continuing.
```

Update the Overview to include:
```markdown
This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle with human-in-the-loop checkpoints.
```

Update phase descriptions to include:
```markdown
- **Stop and wait for approval** before [next phase]
```

---

## Rule 2: Failed Prediction Recovery

### When to Apply
When the **"Guessing Game" prediction fails** - the actual test result differs significantly from what was predicted.

### What to Do
1. **Stop the TDD cycle immediately**
2. **Explain the prediction failure**:
   - What was predicted (error type, expected/actual values)
   - What actually happened
   - Why the prediction was wrong (if clear)
3. **Assess the implications**
4. **Explicitly ask**:
   - "My prediction was incorrect. Should I continue with the TDD process, or would you like me to investigate this discrepancy further?"

### Example
```
❌ Prediction Failed:
- Predicted: Runtime assertion error (Expected: 3, Received: 1)
- Actual: Runtime assertion error (Expected: 3, Received: NaN)
- Issue: I incorrectly assumed parseInt("1,2") would return 1, but it actually returned NaN

This suggests I misunderstood how parseInt handles comma-separated strings. Should I continue with the TDD process, or would you like me to investigate this behavior further?
```

---

## Summary Formats with HITL

### After Red Phase
```
🔴 Red Phase Complete:
**Test Activated**: "should return sum for two numbers"
**Prediction**: Runtime assertion error (Expected: 3, Received: 1) ✅ Correct
**Result**: Test fails as expected with assertion error

Red phase complete. Should I proceed to Green phase?
```

### After Green Phase
```
🟢 Green Phase Complete:
**Implementation**: Added split/map/reduce logic for comma-separated numbers
**Result**: All tests now pass
**Approach**: Minimal implementation using built-in array methods

Green phase complete. Should I proceed to Refactor phase?
```

### After Refactor Phase
```
🔄 Refactor Phase Complete:
**Refactoring**:
- Evaluated naming: kept `sumCommaSeparatedNumbers` (already clear)
- Mass calculation: remains at 38 (no improvements found)
- Considered helper functions but would increase complexity

Refactor phase complete. Should I proceed to the next test?
```

---

## Optional: Separate HITL Rules File

You can also create a dedicated `.claude/rules/human-in-the-loop.md` file:

```markdown
# Human-in-the-Loop TDD Rules

## Core Principle: Never Proceed Without Permission

- **Stop after every single phase** (Red, Green, Refactor)
- **Implement only what the current phase requires**
- **No lookahead or anticipatory coding**
- **No additional features without explicit human approval**
- **Each phase must be approved before continuing to next phase**

## When to ALWAYS Stop

- **After every TDD phase** - Red, Green, and Refactor (MANDATORY)
- **Before proceeding to next phase** - Human must approve continuation
- **Before writing any additional code** - Even if path seems obvious

## When to IMMEDIATELY Stop

- **Significant prediction failures** - fundamental misunderstanding of behavior
- **Any unexpected test results** - if actual differs meaningfully from predicted
- **Compilation errors not anticipated** - suggests misunderstanding of codebase

## Never Continue Without Approval

- **No autonomous multi-phase execution** - Each phase requires explicit approval
- **No anticipatory implementation** - Only implement what current phase demands
- **No "obvious next steps"** - Human decides what constitutes next steps
- **No batch processing** - Each phase must be individually approved
```

---

## Benefits of HITL

- **Maintains human agency** in the TDD process
- **Prevents AI from making poor design decisions** in isolation
- **Creates learning opportunities** for both human and AI
- **Ensures code quality standards** are met
- **Builds confidence** in the TDD process through transparency
