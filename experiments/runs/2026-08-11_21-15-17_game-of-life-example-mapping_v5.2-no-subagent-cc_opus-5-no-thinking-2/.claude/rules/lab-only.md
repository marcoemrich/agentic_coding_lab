# Lab-Only Execution Rules

> **This file is lab infrastructure, not TDD methodology.**
>
> Everything here exists to make a run _measurable_ and _unattended_ inside
> the agentic-coding-lab harness. None of it is advice about how to do TDD.
>
> **To export this workflow for real-world use: delete this file.** It is
> the only file in `.claude/rules/` that is lab-specific. The remaining
> rules (`tdd.md`, `tdd-with-ts-and-vitest.md`) describe the workflow itself
> and must stay.
>
> Deleting this file removes: the autonomous-execution mandate, the
> done-marker contract, and the phase-continuation fix. A workflow without
> it is free to pause between phases and to end its turn wherever a human
> checkpoint says to — which is exactly what an interactive or
> human-in-the-loop setup wants.

## Autonomous Execution

The TDD cycle in this workflow runs autonomously — no human-approval gates
between phases. The measurement pipeline parses an uninterrupted sequence of
Skill tool calls per cycle; user prompts inserted between phases would split
that sequence and produce unattributable cycles.

When executing:

- Do NOT wait for human approval between phases
- Complete the full TDD cycle without interruption

## Done Marker

When all tests are implemented and passing AND the last cycle's refactor
pass is done, write a file `experiment-done.txt` with the single word `DONE`
as its only content. Do not write any other summary or report file.

This is **parser marker 4** — see `experiments/workflows/MARKERS.md`. Without
it the run-driver cannot detect clean termination and the container hits its
timeout, flagging the run `exit_reason: timeout`.

## Phase Continuation

> **Scope: not needed on Claude Code.** This section is carried here for
> parity with the pi and cursor-agent variants, where it fixes a real stall.
> On Claude Code the failure mode below has never been observed. It is kept
> in this file — rather than in the workflow proper — so that dropping
> `lab-only.md` removes it along with everything else lab-specific.
>
> **Origin:** on document-skill harnesses (pi, cursor-agent), some models
> (qwen, kimi, minimax) read a prose phase announcement ("Proceeding to Red
> phase") as a turn terminus and settle at the Test-List → Red boundary. The
> run dies mid-flight with no error.

The whole workflow — Test List, then Red/Green/Refactor for every test,
through to writing `experiment-done.txt` — is one continuous autonomous run.

A phase-completion line ("Test List Phase Complete", "Red Phase Complete", a
finished refactor pass) is a **checkpoint, not a terminus**. After emitting
one, continue immediately with the next phase's action:

- After the **Test List** → invoke the `red` skill for test 1.
- After **Red** → invoke the `green` skill.
- After **Green** → invoke the `refactor` skill.
- After **Refactor** → invoke the `red` skill for the next test.
- After the **last cycle** → write `experiment-done.txt`.

The only place the run ends is after `experiment-done.txt` contains `DONE`.
Announcing an action is not performing it.
