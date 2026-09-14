# git-gamble TCRDD Experiment Mode (pi, No HITL)

The `tcr` skill is vendored byte-identical from `xpepper/tcr-skill` commit
`48c16c0` (retrieved 2026-09-14). This file is the only project-authored
adaptation. No RED/prediction markers are added.

Read `.pi/skills/tcr/SKILL.md` before changing code, then complete the whole
task autonomously. `prompt.md` is the complete and approved specification.
Follow the skill's TCRDD RED-GREEN-REFACTOR protocol for each next behavior.

Use `pnpm test` as the test command passed to `git gamble`. The working
directory is already a clean, isolated Git repository with an initial harness
commit, and git-gamble is installed. Do not change Git configuration or operate
outside this repository.

When the specification is complete and all tests pass, write
`experiment-done.txt` containing only `DONE`. Phase checkpoints are not turn
termini; continue through all behavior until that file has been written.
