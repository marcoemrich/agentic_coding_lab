# Lab-Only Execution and Measurement Rules

> Lab infrastructure only. Delete this file when exporting the workflow and restore the upstream human-in-the-loop agreement.

## Mandatory lab output contract

This single-context workflow runs from one composed command rather than separate phase calls, so every phase MUST emit parser-visible assistant text. These forms are inherited from the TCR source workflow except where Predictive TDD necessarily changes phase persistence.

### Test List

After writing the complete inactive list, emit:

```text
## Test List

Test List Created:
<summary from the test-list skill>
```

Predict and verify that the inactive list leaves the suite green, then continue directly to the first behavior without committing it.

### RED

At the start of every behavior attempt, emit:

```text
## Red -- <behavior>
```

Before running the relevant test, state one falsifiable compilation prediction and one falsifiable runtime prediction. After inspecting the actual result, emit this block verbatim; choose `Correct` or `Incorrect` honestly:

```text
Red Phase Complete:
Compilation Prediction: <prediction> ✅ Correct
Runtime Prediction: <prediction> ✅ Correct
```

The prediction lines MUST remain separate and end in `Correct` or `Incorrect`. Emit the block for already-satisfied behaviors too, using the legitimate passing result.

### GREEN

Before the minimum production change, emit:

```text
## Green -- <behavior>
```

Predict, run the required checks, compare the result, and retain the change only when green. For already-satisfied behavior, this heading records that no production change is needed.

### REFACTOR

For every per-cycle Four Rules and domain-boundary review, emit:

```text
## Refactor -- <improvement or no improvement possible>
```

Emit the heading even when no useful change exists. Predict and verify each structural trial separately. Retain a successful trial in the working tree; narrowly undo an unsuccessful trial. Do not commit or hard-reset the phase.

## Autonomous lab execution

Do not wait for approval, negotiate an autonomy level, or stop at a checkpoint. `prompt.md` is the complete approved specification. Where clarification would normally be required, choose the most defensible reading, state it explicitly, and continue without inventing behavior outside the specification.

A phase-completion message is a checkpoint, not a turn terminus. Continue in the same autonomous turn:

- Test List → first `## Red`
- RED → `## Green`
- GREEN → `## Refactor`
- REFACTOR → next `## Red`

Continue until every listed behavior is executable and all applicable gates pass.

## Done marker

Only after full completion, write `experiment-done.txt` containing exactly:

```text
DONE
```

Do not write another summary or report file. The turn may end only after this file exists.
