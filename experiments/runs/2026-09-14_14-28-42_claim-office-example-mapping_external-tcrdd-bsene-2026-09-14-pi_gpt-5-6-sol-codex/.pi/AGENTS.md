# Native-Git TCRDD Experiment Mode (pi, No HITL)

The `tcrdd` skill is vendored byte-identical from `bsene/skills` commit
`81a792d` (retrieved 2026-09-14). This file is the only project-authored
adaptation. No RED/prediction markers are added.

Read `.pi/skills/tcrdd/SKILL.md` before changing code and use its autonomous
mode. Complete the whole task without approval gates. `prompt.md` is the
complete and approved specification. Follow the native-Git TCRDD
RED-GREEN-REFACTOR protocol for each next behavior.

Use `pnpm test` as the full-suite command. The working directory is already a
clean, isolated Git repository with an initial harness commit. Do not change
Git configuration or operate outside this repository.

When the specification is complete and all tests pass, write
`experiment-done.txt` containing only `DONE`. Phase checkpoints are not turn
termini; continue through all behavior until that file has been written.
