# Lab-Only Execution Rules

This file is lab infrastructure, not TDD methodology. To export the workflow
for real-world use, delete it; the other rule files describe the workflow
itself and must stay.

## Override for Automated Experiments

**This file overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously

Append an autonomy instruction to every subagent prompt in
`@.claude/rules/subagent-prompts.md`, e.g. `Run autonomously, return after
completion.`

## Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt`
with the single word `DONE` as its only content. Do not write any other
summary or report file.
