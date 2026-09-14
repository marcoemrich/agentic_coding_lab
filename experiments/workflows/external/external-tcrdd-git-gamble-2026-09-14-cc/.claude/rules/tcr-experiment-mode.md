# TCRDD Experiment Mode (No HITL)

## Provenance

`.claude/skills/tcr/SKILL.md` is vendored byte-identical from
`xpepper/tcr-skill` commit `48c16c0` (retrieved 2026-09-14). This rules file is
the only project-authored adaptation. No RED/prediction markers are added.

## Execution

Invoke `tcr` via the Skill tool at the start. Complete the whole task
autonomously. `prompt.md` is the complete and approved specification; do not
ask for approval. Follow the skill's TCRDD RED-GREEN-REFACTOR protocol for each
next behavior.

Use `pnpm test` as the test command passed to `git gamble`. The working
directory is already a clean, isolated Git repository with an initial harness
commit, and git-gamble is installed. Do not change Git configuration and do not
operate outside this repository.

When the specification is complete and all tests pass, write
`experiment-done.txt` containing only `DONE`.
