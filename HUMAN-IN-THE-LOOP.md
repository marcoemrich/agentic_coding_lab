# Human-in-the-Loop (HITL) TDD Rules

This file contains the HITL rules that were removed from the experiment
workflows for autonomous runs. Use this as a reference to re-enable HITL
checkpoints when human oversight is desired.

A ready-to-copy variant of this is shipped in
`research/workflow-dev/export/exact-coding-baseline-2026-05-25/.claude/rules/human-in-the-loop.md`
— that version is structured as a single configurable rule file with an
Autonomy Level switch and is referenced from the phase files. The notes
below are the canonical reference; the export is the consumable form.

## Overview

HITL ensures the human stays engaged and can provide guidance at critical
decision points during Test-Driven Development. The AI pauses and explicitly
asks for user feedback at the end of selected TDD phases.

**Default stop points (level `full-hitl`):** after Test-List, after Red,
after Refactor, and on any prediction failure. **Green is exempt by
default** — it is the most mechanical phase, and stopping there mostly
produces "yes, continue" with no real review value.

## Autonomy Levels

A single configuration setting controls how aggressive HITL is. The
following levels are supported in the exported workflow and recommended for
any HITL re-enablement:

| Level | Stops after | Use when |
|---|---|---|
| `full-hitl` (default) | Test-List, Red, Refactor, prediction failure | Learning TDD; reviewing AI work end-to-end |
| `refactor-only` | Refactor, prediction failure | Trusting the model on test-list/red/green; reviewing design decisions only |
| `red-only` | Red, prediction failure | Validating every test before any implementation |
| `every-n-tests N` | After every N completed Red-Green-Refactor cycles | Periodic checkpoints without per-phase friction |
| `task-end` | Only at the very end | Long unattended runs with a final review |
| `autonomous` | Never | Batch experiments; the original v6.2 behavior |

The level is a single edit point at the top of the consumed HITL file. To
add or remove stops without editing the phase files, change the level
instead.

## How to Re-Enable HITL

To add HITL back to an autonomous workflow:

1. **Add the consumable HITL file** (`rules/human-in-the-loop.md`) with an
   Autonomy Level setting and per-phase checkpoint templates. Use the
   exported version as a starting point.
2. **Add a single-line reference** in each phase file (test-list.md, red.md,
   refactor.md) at the end: "Apply HITL checkpoint per
   `@.claude/rules/human-in-the-loop.md`". Do **not** embed stop logic in
   the phase files — keeping it in one place makes it swappable.
3. **Leave Green untouched** by default. Optionally add a note in
   `commands/green.md` explaining that no stop happens there.
4. **Update `tdd.md`** with a short "Human-in-the-Loop" section that
   references the HITL file.
5. **Replace `tdd-experiment-mode.md`** (which mandates autonomous
   execution) with a mode-neutral `tdd-execution-mode.md` that defers stop
   behavior to the HITL file.

---

## Rule 1: End-of-Phase Confirmation

### When to Apply

At the end of every TDD phase that the current Autonomy Level lists as a
stop point. In `full-hitl` that means **end of Test-List, Red, and
Refactor** — and not Green.

### What to Do

1. **Stop after completing the current phase**
2. **Summarize what was just completed in this phase**
3. **Explicitly ask for permission to continue**

---

## Phase-Specific HITL Instructions

### Red Phase HITL

Add to `red.md`:

```markdown
### Step 8: Apply HITL Checkpoint
Consult `@.claude/rules/human-in-the-loop.md`. If the level stops after Red,
present this:

🔴 Red Phase Complete:
**Test Activated**: "should return 0 for empty input"
**Compilation Prediction**: Cannot find name 'calculate' ✅ Correct
**Runtime Prediction**: Expected 0, received undefined ✅ Correct
**Result**: Test fails as expected with assertion error

Red phase complete. Should I proceed to Green phase?
```

Note: keep Step 7 (the verbatim Report Completion block) intact — Step 8 is
*added*, not a replacement.

---

### Green Phase HITL — Disabled by Default

Green has **no HITL checkpoint** in the default `full-hitl` level. Rationale:

1. **Green is the most mechanical phase.** Once the Red prediction is right,
   the minimal implementation is usually one obvious change.
2. **Cycles double in length without it.** Adding a Green stop turns every
   test into four human approvals (test-list once, then red/green/refactor
   per cycle). That friction discourages running the workflow at all.

Only re-enable if you want extra granularity. If you do, the template is:

```markdown
🟢 Green Phase Complete:
**Implementation**: [describe what was implemented]
**Result**: All tests now pass
**Approach**: [explain why this is minimal]

Green phase complete. Should I proceed to Refactor phase?
```

---

### Refactor Phase HITL

Add to `refactor.md` after Step 7:

```markdown
### Step 8: Apply HITL Checkpoint
The requesting context consults `@.claude/rules/human-in-the-loop.md` after
the subagent returns. If the level stops after Refactor, the requester
presents:

🔄 Refactor Phase Complete:
**Refactoring**: [improvements made or "none possible"]
**Mass Change**: [before → after] (if calculated)
**Tests**: All passing ✅

Refactor phase complete. Should I proceed to the next test?
```

---

### Test List Phase HITL

Add to `test-list.md`:

```markdown
### Step 6: Apply HITL Checkpoint
Consult `@.claude/rules/human-in-the-loop.md`. If the level stops after
Test-List, present:

📋 Test List Phase Complete.

Should I proceed to Red phase with the first test?
```

---

## TDD Rules File Addition

Add this section to `tdd.md` (after "Core TDD Principles"):

```markdown
## Human-in-the-Loop

See `@.claude/rules/human-in-the-loop.md` for the Autonomy Level setting and
checkpoint behavior.

**Key principle (default `full-hitl`):** stop after Test-List, Red, and
Refactor — not Green — and on prediction failures. Switch the level in the
HITL file to change this.
```

---

## Rule 2: Failed Prediction Recovery

### When to Apply

When the **"Guessing Game" prediction fails** — the actual test result
differs significantly from what was predicted.

This rule applies in **every Autonomy Level except `autonomous`**. Even in
`task-end` mode, prediction failures still trigger a stop — a wrong
prediction usually means the model misunderstands the system, and
continuing compounds the misunderstanding.

### What to Do

1. **Stop the TDD cycle immediately**
2. **Explain the prediction failure**:
   - What was predicted (error type, expected/actual values)
   - What actually happened
   - Why the prediction was wrong (if clear)
3. **Assess the implications**
4. **Explicitly ask**:
   - "My prediction was incorrect. Should I continue with the TDD process,
     or would you like me to investigate this discrepancy further?"

### Example

```
❌ Prediction Failed:
- Predicted: Runtime assertion error (Expected: 3, Received: 1)
- Actual: Runtime assertion error (Expected: 3, Received: NaN)
- Issue: I incorrectly assumed parseInt("1,2") would return 1, but it actually returned NaN

This suggests I misunderstood how parseInt handles comma-separated strings.
Should I continue with the TDD process, or would you like me to investigate
this behavior further?
```

In `autonomous` mode: log the failure in the Red-phase report, then
proceed. The wrong prediction is treated as data, not a stop signal.

---

## Summary Formats with HITL

### After Test List
```
📋 Test List Phase Complete.

Created [N] test cases (all `it.todo()`) covering [feature].
Ordered simple → complex.

Should I proceed to Red phase with the first test?
```

### After Red Phase
```
🔴 Red Phase Complete:
**Test Activated**: "should return sum for two numbers"
**Compilation Prediction**: [reason] ✅ Correct
**Runtime Prediction**: Expected 3, received 1 ✅ Correct
**Result**: Test fails as expected with assertion error

Red phase complete. Should I proceed to Green phase?
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

The recommended consumable form is a single
`.claude/rules/human-in-the-loop.md` with:

```markdown
# Human-in-the-Loop (HITL)

## Autonomy Level

**Current setting:** `full-hitl`

(Edit this line to change behavior. Supported: full-hitl, refactor-only,
red-only, every-n-tests N, task-end, autonomous.)

## Core Principle

In `full-hitl` mode:
- Stop after Test-List, Red, and Refactor (not Green by default)
- Stop on any prediction failure
- Each stop requires explicit human approval to continue

(Continue with checkpoint templates and prediction-failure recovery.)
```

The full exported version with all templates is in
`research/workflow-dev/export/exact-coding-baseline-2026-05-25/.claude/rules/human-in-the-loop.md`.

---

## Benefits of HITL

- **Maintains human agency** in the TDD process
- **Prevents AI from making poor design decisions** in isolation
- **Creates learning opportunities** for both human and AI
- **Ensures code quality standards** are met
- **Builds confidence** in the TDD process through transparency
