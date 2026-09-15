# EXACT Coding TCR — Lab Workflow (pi)

This workflow is the lab adaptation of the `exact-coding-tcr`, `tcrdd`, and
`test-list` skills from `exact-coding-exercises` version `2026-09-13`.
It keeps the source method: one complete up-front inactive test list, then one
behavior at a time through native-Git RED–GREEN–REFACTOR commit-or-revert
steps. The lab adaptations are autonomous execution, parser-visible phase and
prediction markers, phase continuation, and the final done marker.

## Required Documents

Before changing code, read these files completely:

1. `.pi/skills/exact-coding-tcr/SKILL.md`
2. `.pi/skills/test-list/SKILL.md`
3. `.pi/skills/tcrdd/SKILL.md`
4. `.pi/skills/exact-coding-tcr/human-in-the-loop.md`
5. the matching profile under `.pi/skills/exact-coding-tcr/stacks/`
6. `prompt.md`

Follow the parent `exact-coding-tcr` skill when a generic `tcrdd` rule and the
composed workflow differ. In particular, an activated behavior already
satisfied by an earlier generalization is committed as the parent's
`[GREEN] <already-satisfied behavior>` exception; never manufacture a failure.

Use the full-suite command and quality gates selected by the stack profile.
The run directory is already a clean, isolated Git repository with an initial
harness commit. Do not change Git configuration or operate outside it.

## Mandatory Lab Output Contract

Pi skills are documents rather than phase tool calls, so every phase MUST emit
parser-visible assistant text. These exact forms make the source workflow
measurable without changing its commit-or-revert decisions.

### Test List

After writing the complete inactive list, emit both forms:

```text
## Test List

Test List Created:
<summary from the test-list skill>
```

Then stage, verify, and commit or revert the list as prescribed by the parent
skill.

### RED

At the start of every behavior attempt, emit:

```text
## Red -- <behavior>
```

Before running the full suite, state one falsifiable compilation prediction
and one falsifiable runtime prediction. After inspecting the actual result,
emit this block verbatim; choose `Correct` or `Incorrect` honestly and never
rewrite an unexpected result as predicted:

```text
Red Phase Complete:
Compilation Prediction: <prediction> Correct
Runtime Prediction: <prediction> Correct
```

The two prediction lines MUST remain separate and MUST end in `Correct` or
`Incorrect`. Do not abbreviate, summarize, or collapse them. This block is
mechanically parsed; stable formatting is what lets the lab compare predicted
and observed outcomes.

Emit the block for already-satisfied behaviors too: predict the legitimate
passing result, run the suite, record the outcome, and follow the parent's
`[GREEN]` exception without adding production code.

### GREEN

Before the minimum production change, emit:

```text
## Green -- <behavior>
```

Then stage, run the required gates, and commit or revert exactly as prescribed.
For an already-satisfied behavior, this heading labels the passing-test commit;
it does not license a production change.

### REFACTOR

For every per-cycle Four Rules review, emit:

```text
## Refactor -- <improvement or no improvement possible>
```

Emit the heading even when the review finds no useful change. Each useful
structural change still gets its own native-Git commit-or-revert step. The
heading records that the mandatory review occurred; the Git history records
which changes survived verification.

## Autonomous Lab Execution

The configured HITL level is `autonomous`. Do not wait for approval, negotiate
an autonomy level, or stop at a checkpoint. `prompt.md` is the complete and
approved specification. Where the source workflow would need clarification,
choose the most defensible reading, state it explicitly, and continue without
inventing behavior outside the specification.

A phase-completion message is a checkpoint, not a turn terminus. Continue in
the same autonomous turn:

- Test List → first `## Red`
- RED → `## Green`
- GREEN → `## Refactor`
- REFACTOR → next `## Red`

Continue until every listed behavior is executable, the full suite and all
applicable gates pass, and the working tree is clean.

## Done Marker

Only after full completion, write `experiment-done.txt` containing exactly:

```text
DONE
```

Do not write another summary or report file. The turn may end only after this
file exists. Without it the lab harness records a timeout.
