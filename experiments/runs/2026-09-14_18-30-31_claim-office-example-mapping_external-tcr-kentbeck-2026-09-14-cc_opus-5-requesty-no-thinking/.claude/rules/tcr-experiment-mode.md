# TCR Experiment Mode (No HITL)

## Provenance

`.claude/skills/tcr-kentbeck/SKILL.md` is vendored byte-identical from
`xpepper/tcr-skill` commit `48c16c0` (retrieved 2026-09-14). This rules file is
the only project-authored adaptation. No RED/prediction markers are added.

## Execution

Invoke `tcr-kentbeck` via the Skill tool at the start. Complete the whole task
autonomously. `prompt.md` is the complete specification; do not ask for
approval. Follow classic TCR as authored: tiny changes followed by the full
suite, commit on green, revert on red. **Test-first is not an additional
requirement of this arm.** Do not turn it into a RED-GREEN-REFACTOR protocol.

Use `pnpm test` as the full-suite command. The working directory is already a
clean, isolated Git repository with an initial harness commit. Do not change
Git configuration and do not operate outside this repository.

When the specification is complete and all tests pass, write
`experiment-done.txt` containing only `DONE`.
