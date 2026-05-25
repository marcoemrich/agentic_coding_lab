# HUMAN-IN-THE-LOOP profile for v6.3-audit-bundle

The default state of this workflow is **fully autonomous** — the TDD cycle runs end-to-end without human gates, and the audit-bundle hardening in `commands/red.md` treats wrong predictions as data rather than as blockers.

This file describes how to flip the workflow back into a **human-in-the-loop (HITL)** mode where prediction failures (and other unexpected states) escalate to the human supervisor instead of being silently logged and continued.

It is **not** loaded automatically — `.claude/rules/` would auto-load any file dropped there and conflict with `tdd-experiment-mode.md`. HITL is opt-in via the steps below.

## When to use HITL mode

- Manual debugging sessions where the human wants to inspect each cycle before continuing.
- Diagnosing unexpected prediction failures or workflow regressions.
- Pair-programming / teaching contexts where the human follows along.
- Any context **outside** of the autonomous measurement pipeline used by the research framework.

Do not enable HITL when running batch experiments — the measurement pipeline expects an uninterrupted Skill/Task call sequence; a human gate breaks that sequence and produces unattributable cycles.

## How to activate HITL mode

1. **Replace** `.claude/rules/tdd-experiment-mode.md` with the HITL counterpart below (or delete `tdd-experiment-mode.md` entirely and let the lead instructions describe the HITL flow).
2. **Patch** `.claude/commands/red.md` Steps 3 and 6 to restore the escalation branch (template below).
3. **Replace** the `## Wrong Predictions Are Data` section in `.claude/commands/red.md` with the `## Prediction Failure Protocol` block (template below).

The changes are reversible — keep the autonomous files in version control so HITL stays a layered profile, not a fork.

## Prediction-failure escalation — the critical restoration

In HITL mode, a wrong prediction in the Red phase is the most important signal the human needs to see immediately. The autonomous default explicitly suppresses the escalation ("record `Incorrect` and continue") because the measurement pipeline aggregates the rate across many cycles; in HITL mode, each wrong prediction is a teachable moment that must surface to the human.

### Step 3 / Step 6 — restored escalation branch

Replace the autonomous prose:

```
Run `pnpm test` and record the actual result. The Step 7
prediction block reports whether the Step 2/5 prediction
was `Correct` or `Incorrect`. Either way, proceed to
Step 4/7 — a wrong prediction is a data point, not a
blocker.
```

with the HITL escalation:

```
Run `pnpm test` and verify:
- ✅ Compilation/assertion error as predicted → proceed.
- ❌ Prediction wrong → STOP. Escalate to the human supervisor
  with the Prediction Failure block (see below) and wait for
  guidance before continuing. Do not auto-continue. Do not
  rewrite the prediction.
```

### Replacement for `## Wrong Predictions Are Data`

```markdown
## Prediction Failure Protocol

If your prediction was wrong, STOP the cycle and surface the
discrepancy to the human supervisor before doing anything else.
Do NOT continue to the next step without explicit human approval.
Do NOT edit the original prediction to match the observed result.

Emit the following block verbatim so the human sees the full context:

❌ Prediction Failed:
- Predicted: [what you expected]
- Actual: [what happened]
- Discrepancy: [one-line explanation of the gap]
- Active test: [test name]
- Current step: [Step 3 or Step 6]

Awaiting human input. The supervisor will choose between:
1. **Investigate** — pause and let the human inspect state.
2. **Continue with recorded `Incorrect`** — proceed as autonomous mode would.
3. **Abort cycle** — revert and re-plan.
```

### HITL `tdd-experiment-mode.md` counterpart (replacement file)

```markdown
# TDD Human-in-the-Loop Execution

The TDD cycle in this workflow runs with **human gates between
phases**. After every Red, Green, and Refactor phase, the agent
pauses and waits for the human to confirm before continuing.

The agent MUST also pause when:
- A prediction in the Red phase is wrong (see `commands/red.md`
  Prediction Failure Protocol).
- A test that was green turns red unexpectedly during Refactor.
- Any tool call returns an error the agent cannot recover from
  with the same delegation pattern.

## Why this mode exists

HITL is the supervisory profile — the human wants to inspect each
cycle. The autonomous measurement pipeline (used in batch runs)
is explicitly NOT in use here; uninterrupted Skill/Task call
sequences are not required.

## Workflow

1. **Test List Phase** → Invoke `/test-list`, then pause for human review.
2. **For each test:**
   - **Red Phase** → Invoke `/red`, pause if a prediction is wrong
     (Prediction Failure Protocol), otherwise pause at Step 7.
   - **Green Phase** → Invoke `/green`, pause for human review.
   - **Refactor Phase** → Launch the `refactor` subagent, pause
     for human review of the returned summary.
3. **Continue** only after explicit human approval at each gate.

## Done Marker

When all tests are implemented and passing AND the human has
acknowledged completion, write `experiment-done.txt` with the
single word `DONE`.
```

## Compatibility with audit-bundle additions

The other audit-bundle additions (refactor.md measurement-pipeline rationale, bisectability rationale, "no improvement possible" three-path bar, test-list.md Step 3 generalization rationale, Mandatory-Procedure preamble in red.md) are **content additions** that are equally valid in HITL mode — they explain *why* the rules exist, which helps a human supervisor evaluate compliance just as much as it helps an autonomous agent. Keep them when activating HITL.

The only autonomous-specific text is the Step 3 / Step 6 "data point, not a blocker" prose and the `## Wrong Predictions Are Data` section. Those two are the targeted swap points described above.
