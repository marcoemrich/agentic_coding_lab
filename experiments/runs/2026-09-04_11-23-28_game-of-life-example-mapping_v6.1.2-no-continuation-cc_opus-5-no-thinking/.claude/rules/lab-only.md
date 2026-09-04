# Lab-Only Execution Rules

> **This file is lab infrastructure, not TDD methodology.**
>
> Everything here exists to make a run _measurable_ and _unattended_ inside
> the agentic-coding-lab harness. None of it is advice about how to do TDD.
>
> **To export this workflow for real-world use: delete this file.** It is
> the only file in `.claude/rules/` that is lab-specific. The remaining
> rules (`tdd.md`, `subagent-prompts.md`, `tdd-with-ts-and-vitest.md`)
> describe the workflow itself and must stay.
>
> Deleting this file removes: the autonomous-execution mandate and the
> done-marker contract. A workflow without it is free to pause between
> phases and to end its turn wherever a human checkpoint says to — which is
> exactly what an interactive or human-in-the-loop setup wants.

## Autonomous Execution

The TDD cycle in this workflow runs autonomously — no human-approval gates
between phases. The measurement pipeline parses an uninterrupted sequence of
Skill and Task tool calls per cycle; user prompts inserted between phases
would split that sequence and produce unattributable cycles.

When executing:

- Do NOT wait for human approval between phases
- Complete the full TDD cycle without interruption

Every subagent prompt in `@.claude/rules/subagent-prompts.md` should be sent
with an autonomy instruction appended, e.g. `Run autonomously, return after
completion.` — see that file for the prompt bodies themselves.

## Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt`
with the single word `DONE` as its only content. Do not write any other
summary or report file.

This is **parser marker 4** — see `experiments/workflows/MARKERS.md`. Without
it the run-driver cannot detect clean termination and the container hits its
timeout, flagging the run `exit_reason: timeout`.
