# Predictive TDD -- Hybrid with Refactor Subagent (basic-sol-tdd-subagent, pi)

<!-- LAB-ONLY:START -->
> **Lab-only content is fenced at the end of this file.** Everything
> between the `LAB-ONLY:START` / `LAB-ONLY:END` markers is measurement
> infrastructure for the agentic-coding-lab harness -- autonomous
> execution, the done-marker contract, and the phase-continuation fix.
> **To export this workflow for real-world use, delete that block.**
> Nothing above it is lab-specific.
<!-- LAB-ONLY:END -->

## Origin

The methodology in this workflow comes from the `predictive-tdd` and
`test-list` skills of the `sol_tdd` project. It differs from the v4/v5/v6
line in three ways:

- **Predictions are prose, not a fixed template.** The discipline is
  "state a falsifiable expectation before every deterministic check", not
  "fill in a compilation/runtime form".
- **Refactoring is guided by the Four Rules of Simple Design only.**
  There is no APP mass calculation and no metric-driven end-refactor pass.
- **Red is defined behaviorally.** A valid Red fails because the active
  behavior is missing, for the predicted reason -- reaching compilation
  scaffold is a means to that end, not a phase of its own.

Two lab adaptations were made to the source skills: the human-in-the-loop
autonomy agreement was removed (the harness runs unattended), and the
mandatory output markers below were added so the phases become measurable.

**This variant is the delegated arm of a pair.** `basic-sol-tdd-pi` runs the
identical methodology with refactoring in the main context. The only
difference between the two workflows is where the Four Rules review happens --
which is exactly the factor under test.

## Architecture: Skills + Refactor Subagent

- **`predictive-tdd`** -- the Red/Green cycle and the Four Rules that govern
  refactoring. Its `SKILL.md` is auto-loaded as context. Read it **before the
  first cycle**, then follow its instructions directly in the main context.
- **`test-list`** -- the up-front test list. Read its `SKILL.md` before the
  first phase.
- **`stacks/typescript-vitest.md`** -- the stack profile. Read it before
  changing any code.
- **Refactor** -- runs as a **subagent with isolated context** via the
  `subagent` tool. The refactor agent sees only the current source and tests,
  not the Red prediction or the Green reasoning that produced them.
  Hypothesis: refactoring benefits from a fresh perspective free of
  implementation bias.

Do NOT skip reading the skill files. Do NOT skip the mandatory output markers.

| Phase      | Mechanism                         | How to Execute                                                       |
|------------|-----------------------------------|----------------------------------------------------------------------|
| Test List  | **Skill document** (main context) | Read `.pi/skills/test-list/SKILL.md`, follow its steps                |
| Red        | **Skill document** (main context) | `.pi/skills/predictive-tdd/SKILL.md`, section "Reach behavioral Red"  |
| Green      | **Skill document** (main context) | same skill, section "Reach Green minimally"                          |
| Refactor   | **Subagent** (isolated context)   | `subagent` tool with `agent: "refactor"`, `agentScope: "both"`        |

## CRITICAL: Mandatory Output Format

This workflow runs on **pi**, where skills are auto-loaded documents, not tool
calls. The model reads each SKILL.md once and then follows its instructions
directly. This means the measurement pipeline **cannot count tool invocations**
to track cycles. Instead, it relies on **text markers** in the assistant
output, plus the refactor subagent call.

### Phase-Completion Markers Are MANDATORY

Every TDD phase MUST produce a specific text marker in your output.
These markers are mechanically parsed to compute `cycle_count`,
`predictions_correct_rate` and `refactorings_applied`. Missing markers
silently zero the corresponding metric, invalidating the data point.

| Phase     | Mandatory Output Marker                       | What the Parser Counts                     |
|-----------|-----------------------------------------------|--------------------------------------------|
| Test List | `## Test List` heading + `Test List Created:` line | test-list phase occurrence |
| Red       | `## Red` heading                              | red-phase cycle (`cycle_count`)            |
| Red       | `Red Phase Complete:` + prediction lines      | `predictions_correct`, `predictions_total` |
| Green     | `## Green` heading                            | green-phase occurrence                     |
| Refactor  | `subagent` tool call with `agent: "refactor"` | `refactorings_applied`                     |

**Format for each Red phase output:**

```
## Red -- Test N: <test description>

<prediction and failure verification steps>

Red Phase Complete:
**Compilation Prediction**: <what you expected> Correct
**Runtime Prediction**: <what you expected> Correct

<result summary>
```

The two prediction lines are **parsed mechanically**. You MUST output them
verbatim with `Correct` or `Incorrect` at the end. Do not abbreviate,
summarize, or collapse them into one line.

These two lines are the mechanical form of the skill's core rule "compare
predicted and actual outcomes explicitly": an unexpected result is recorded
as `Incorrect` and then investigated, never rewritten as predicted.

The prose reasoning of the skill stays as it is -- these lines are a summary
line per prediction, not a replacement for the prediction itself.

When the activated test already passes, write:

```
## Red -- Test N: <test description>

Test already passes -- no new failure to fix. No production change needed.
```

**Format for Green phase output:**

```
## Green -- <brief summary of what was added>
```

**Test List phase output:**

```
## Test List

Test List Created:
<test list details>
```

Both lines are required. The heading and the `Test List Created:` line are read
by different parsers; emitting only one of them loses the phase on the other.

**Refactoring produces no text marker in this workflow.** The `subagent` tool
call itself is the signal, so emit no refactor heading at all -- neither before
nor after the call. And do NOT refactor in the main context: that would leave
`refactorings_applied` at zero while the code changes anyway, which measures
the wrong architecture.

## The Refactor Subagent

**INVOKE SUBAGENT**: Use the `subagent` tool with these parameters:

```json
{
  "agent": "refactor",
  "agentScope": "both",
  "task": "Test file: src/<feature>.spec.ts\nImplementation file: src/<feature>.ts\nPassing tests: <count>\nRecent Green change: <one-line summary of what was just added>\n\nReview the code against the Four Rules of Simple Design and apply at most one refactoring at a time while keeping all tests green.\n\nRun autonomously, return when done."
}
```

`agentScope: "both"` is REQUIRED because the `refactor` agent lives in
`.pi/agents/` (project-local). Without this flag the subagent extension only
sees user-level agents and the call fails with "Unknown agent: refactor".

The agent runs in an isolated context and has no memory of your Red prediction
or Green reasoning. Everything it needs must be in the `task` parameter.

It will:
- verify the suite is green before touching anything
- review the Four Rules of Simple Design in priority order
- apply at most one refactoring at a time, verifying each with a check
- leave the code unchanged and explain why, if no rule improves

After it returns, read its summary, run the tests to confirm they are still
green, and proceed directly to the next Red phase.

## Workflow Sequence

1. **Preparation** -- Read `predictive-tdd/SKILL.md`, `test-list/SKILL.md`
   and `predictive-tdd/stacks/typescript-vitest.md`. Read the specification
   (`prompt.md`) completely. Establish the baseline gates.
2. **Test List Phase** -- Follow `test-list/SKILL.md`, produce `## Test List`
3. **For each test:**
   - **Red** -- activate exactly one behavior, predict, verify the behavioral
     failure; produce `## Red` and `Red Phase Complete:` with both prediction lines
   - **Green** -- smallest production change; produce `## Green`
   - **Refactor** -- invoke the `refactor` subagent
   - **Close once** -- predict and run the full suite and the applicable gates
4. **Continue** until every test in the list is active and passing

## Running Tests

Run tests with `pnpm test`. See the stack profile for the other gates.

## Common Failure Modes

- **MISSING OUTPUT MARKERS** -- the most critical failure mode on pi.
  Every cycle needs `## Red` and `## Green`; every Red cycle with a failing
  test needs `Red Phase Complete:` with both prediction lines.
- **Refactoring in the main context instead of via the subagent** -- the code
  improves but `refactorings_applied` stays at zero, so the run measures the
  wrong architecture.
- Rewriting an unexpected result as predicted instead of recording `Incorrect`
- Multiple active tests at once
- Implementing beyond what the active test demands
- Reaching Red through a compilation error and stopping there, without driving
  it to the behavioral failure

## Remember

- **ALWAYS PRODUCE THE MANDATORY MARKERS** -- `## Test List`, `## Red`,
  `Red Phase Complete:`, `## Green`
- **ALWAYS USE THE SUBAGENT** for refactor -- `subagent` tool with
  `agent: "refactor"`, `agentScope: "both"`
- Pass `agentScope: "both"` so the project-local refactor agent is discovered
- Follow the skill content for the actual work; this file defines only the
  architecture and the output contract

<!-- LAB-ONLY:START -->

## Lab-Only Execution Rules

> **This block is lab infrastructure, not TDD methodology.** Everything
> between `LAB-ONLY:START` and `LAB-ONLY:END` exists to make a run
> *measurable* and *unattended* inside the agentic-coding-lab harness.
>
> **To export this workflow for real-world use: delete this whole block**
> and restore the human-in-the-loop agreement from the source project.
> Removing it drops the autonomous-execution mandate, the done-marker
> contract, and the phase-continuation fix -- which is exactly what an
> interactive or human-in-the-loop setup wants.

### Autonomous Execution

The TDD cycle runs autonomously -- no human-approval gates between phases.
The measurement pipeline parses the output text for phase markers and
subagent tool calls; user prompts inserted between phases would split that
sequence and produce unattributable cycles.

When executing:
- Do NOT wait for human approval between phases
- Do NOT negotiate an autonomy level -- there is no human in this loop
- Complete the full TDD cycle without interruption

Append an autonomy instruction to every subagent `task` parameter, e.g.
`Run autonomously, return after completion.`

The source skill's escalation rules resolve differently here: where they say
"pause and ask the human", instead choose the most defensible reading of the
specification, state that reading explicitly in your output, and continue.
Never expand the agreed scope, and never invent behavior the spec does not
describe.

### Done Marker

When all tests are implemented and passing AND the last refactor subagent has
returned, write a file `experiment-done.txt` with the single word `DONE` as
its only content. Do not write any other summary or report file.

This is **parser marker P7** -- see `experiments/workflows/MARKERS.md`.
Without it the run-driver cannot detect clean termination and the container
hits its timeout, flagging the run `exit_reason: timeout`.

### Phase Continuation

> **Origin:** on pi, some models (qwen, kimi, minimax) read a prose phase
> announcement ("Proceeding to Red phase") as a turn terminus and settle at
> the Test-List -> Red boundary. The run dies mid-flight with no error.
> This section is the fix. It is a workaround for a harness-specific
> parsing quirk, not a workflow advance -- it carries real prose cost (see
> RQ-lean / RQ-rules on added-instruction overhead), so it lives here in
> the droppable block rather than in the workflow proper.

This entire workflow -- Test List, then Red/Green/Refactor for every test,
through to writing `experiment-done.txt` -- is **one single autonomous
turn**. There are no human-approval gates and no natural stopping points
between phases.

A phase-completion line ("Test List", "Red Phase Complete", a returned
refactor subagent) is a **checkpoint, not a terminus**. After emitting it you
MUST immediately continue with the next phase's action in the same turn:

- After the **Test List** -> produce `## Red` for test 1.
- After **Red** -> produce `## Green`.
- After **Green** -> invoke the `refactor` subagent.
- After **Refactor returns** -> produce `## Red` for the next test.

The only place your turn may end is **after** you have written
`experiment-done.txt` containing `DONE`. Ending the turn on a "Proceeding
to..." / "Next Step..." announcement -- without actually taking that step
-- is the single most common failure mode on this harness and invalidates
the run. Announcing an action is not doing it; always do it in the same turn.

**NEVER STOP AT A PHASE BOUNDARY** -- Test List -> Red -> Green -> Refactor
-> next Red all happen in one turn. The only turn-end is after
`experiment-done.txt` says `DONE`.

<!-- LAB-ONLY:END -->
