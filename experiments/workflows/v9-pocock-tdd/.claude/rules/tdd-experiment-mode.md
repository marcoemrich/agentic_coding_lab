# TDD Experiment Mode (No HITL) — Pocock TDD Skill

## Override for Automated Experiments

This file overrides human-in-the-loop requirements for automated experiment runs of the Pocock-style TDD skill.

The skill under `.claude/skills/tdd/` is **not authored by this project**. It is vendored unmodified from [mattpocock/skills](https://github.com/mattpocock/skills) (path `skills/engineering/tdd/`, MIT-licensed, retrieved 2026-05-26) to serve as an external comparison baseline in RQ-pocock-vs-v62. Upstream has evolved since that date, so measurements here describe that specific snapshot — not the current upstream skill. The upstream license is preserved in `LICENSE.upstream` at the workflow root. This rules file is the only project-authored addition.

When running experiments:

- Do NOT wait for human approval between phases or before starting.
- Treat the prompt (especially example-mapping prompts) as the user-approved plan.
- Complete the full TDD cycle autonomously.

## Workflow Entry

Invoke the `tdd` skill at the start of the task. All phases (planning, tracer bullet, incremental red-green loop, refactor) run inline inside that one skill invocation — there are no separate `/red`, `/green`, or `/refactor` sub-commands.

## Required Output Per Cycle

Every RED step must end with the verbatim block defined in the skill:

```
Red Phase Complete
- Compilation: <Correct|Incorrect>
- Runtime:     <Correct|Incorrect>
```

Both lines, every cycle. Do not collapse, do not abbreviate. Downstream analysis relies on this block to count cycles and prediction accuracy.

## Done Marker

When all tests are implemented and passing and the final refactor pass is done, write a file `experiment-done.txt` in the working directory containing the single word `DONE` as its only content. Do not write any other summary or report file.

Without this file the run driver will hit its timeout and the run will be flagged as incomplete.
