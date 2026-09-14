# Classic TCR Experiment Mode (pi, No HITL)

The `tcr-kentbeck` skill is vendored byte-identical from `xpepper/tcr-skill`
commit `48c16c0` (retrieved 2026-09-14). This file is the only project-authored
adaptation. No RED/prediction markers are added.

Read `.pi/skills/tcr-kentbeck/SKILL.md` before changing code, then complete the
whole task autonomously. `prompt.md` is the complete specification. Follow
classic TCR as authored: tiny changes followed by the full suite, commit on
green, revert on red. **Test-first is not an additional requirement of this
arm.** Do not turn it into a RED-GREEN-REFACTOR protocol.

Use `pnpm test` as the full-suite command. The working directory is already a
clean, isolated Git repository with an initial harness commit. Do not change
Git configuration or operate outside this repository.

When the specification is complete and all tests pass, write
`experiment-done.txt` containing only `DONE`. A checkpoint is not a terminus:
continue autonomously until that file has been written.
