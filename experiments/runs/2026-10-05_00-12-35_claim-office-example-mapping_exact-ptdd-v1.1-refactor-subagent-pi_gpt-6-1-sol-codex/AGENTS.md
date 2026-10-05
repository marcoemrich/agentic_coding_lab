# EXACT Coding Predictive TDD — TCR-Parity Port (pi)

This workflow transfers `exact-tcr-v1.3-domain-boundary-trial-pi` to Predictive TDD. It retains the source workflow's complete inactive test list, domain-responsibility and boundary-trial contract, concrete stack guidance, shared context, autonomous execution, and parser-visible records. Only method-specific TCR behavior is replaced: predictions and checks keep or narrowly undo changes without phase commits or hard resets.

## Required documents

Before changing code, read these files completely:

1. `.pi/skills/exact-coding-ptdd/SKILL.md`
2. `.pi/skills/test-list/SKILL.md`
3. `.pi/skills/predictive-tdd/SKILL.md`
4. the matching profile under `.pi/skills/exact-coding-ptdd/stacks/`
5. `prompt.md`

Follow the composed `exact-coding-ptdd` skill when a generic Predictive TDD rule and this workflow differ. In particular, an activated behavior already satisfied by an earlier generalization is verified and recorded as already green; never manufacture a failure.

Use the full-suite command and quality gates selected by the stack profile. The run directory is an isolated Git repository only to control the environment against the TCR arm. Do not create method commits, change Git configuration, use hard resets as phase transitions, or operate outside the repository.

## Mandatory lab output contract

Pi skills are documents rather than phase tool calls, so every phase MUST emit parser-visible assistant text. These forms are inherited from the TCR source workflow except where Predictive TDD necessarily changes phase persistence.

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
Compilation Prediction: <prediction> Correct
Runtime Prediction: <prediction> Correct
```

The prediction lines MUST remain separate and end in `Correct` or `Incorrect`. Emit the block for already-satisfied behaviors too, using the legitimate passing result.

### GREEN

Before the minimum production change, emit:

```text
## Green -- <behavior>
```

Predict, run the required checks, compare the result, and retain the change only when green. For already-satisfied behavior, this heading records that no production change is needed.

### REFACTOR

For every per-cycle Four Rules and domain-boundary review, invoke the isolated `refactor` subagent through the `subagent` tool with `agent: "refactor"` and `agentScope: "both"`. Give it the active behavior, relevant files, and stack commands. The tool call is the parser-visible phase marker: do not emit a `## Refactor` heading and do not refactor in the main context. Read the report and confirm the tests remain green before continuing.

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
