# Lab-Only Execution Rules

> **This file is lab infrastructure, not TDD methodology.** Everything in it
> exists to make a run *measurable* and *unattended* inside the
> agentic-coding-lab harness.
>
> **To export this workflow for real-world use: delete this file** and restore
> the human-in-the-loop agreement from the source project. Removing it drops
> the autonomous-execution mandate, the done-marker contract, and the
> phase-continuation fix -- which is exactly what an interactive or
> human-in-the-loop setup wants. Nothing in the other rule or command files is
> lab-specific.

## Autonomous Execution

The TDD cycle runs autonomously -- no human-approval gates between phases.
The measurement pipeline parses the output text for phase markers; user
prompts inserted between phases would split that sequence and produce
unattributable cycles.

When executing:
- Do NOT wait for human approval between phases
- Do NOT negotiate an autonomy level -- there is no human in this loop
- Complete the full TDD cycle without interruption

The source skill's escalation rules resolve differently here: where they say
"pause and ask the human", instead choose the most defensible reading of the
specification, state that reading explicitly in your output, and continue.
Never expand the agreed scope, and never invent behavior the spec does not
describe.

## Done Marker

When all tests are implemented and passing, write a file
`experiment-done.txt` with the single word `DONE` as its only content. Do
not write any other summary or report file.

This is **parser marker 4** -- see `experiments/workflows/MARKERS.md`.
Without it the run-driver cannot detect clean termination and the container
hits its timeout, flagging the run `exit_reason: timeout`.

## Phase Continuation

> **Origin:** on pi, some models read a prose phase announcement ("Proceeding
> to Red phase") as a turn terminus and settle at the Test-List -> Red
> boundary. The run dies mid-flight with no error. This section is the fix,
> carried over from the pi variant so the two are structurally comparable. It
> is a workaround for a harness parsing quirk, not a workflow advance -- it
> carries real prose cost (see RQ-lean / RQ-rules on added-instruction
> overhead), so it lives here in the droppable file rather than in the
> workflow proper.

This entire workflow -- Test List, then Red/Green/Refactor for every test,
through to writing `experiment-done.txt` -- is **one single autonomous
turn**. There are no human-approval gates and no natural stopping points
between phases.

A phase-completion line ("Test List", "Red Phase Complete", a finished
refactor review) is a **checkpoint, not a terminus**. After emitting it you
MUST immediately continue with the next phase's action in the same turn:

- After the **Test List** -> produce `## Red` for test 1.
- After **Red** -> produce `## Green`.
- After **Green** -> produce `## Refactor`.
- After **Refactor** -> produce `## Red` for the next test.

The only place your turn may end is **after** you have written
`experiment-done.txt` containing `DONE`. Ending the turn on a "Proceeding
to..." / "Next Step..." announcement -- without actually taking that step
-- is a failure mode that invalidates the run. Announcing an action is not
doing it; always do it in the same turn.

**NEVER STOP AT A PHASE BOUNDARY** -- Test List -> Red -> Green -> Refactor
-> next Red all happen in one turn. The only turn-end is after
`experiment-done.txt` says `DONE`.
