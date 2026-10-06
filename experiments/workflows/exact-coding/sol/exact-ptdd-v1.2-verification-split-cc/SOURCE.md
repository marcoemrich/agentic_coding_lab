# Source

Claude Code port of `exact-ptdd-v1.2-verification-split-pi`, branching from `exact-ptdd-v1-cc`.

The sole treatment is a split of the test list into driving tests and verification tests, with verification tests activated only after every driving test is green. The group name `verification` is a measurement contract read by `tdd-report.py`. Content-equivalent to the pi port; see its `SOURCE.md` for the full description.

One further difference from `exact-ptdd-v1-cc`, not part of the treatment: `commands/exact-coding-ptdd.md` points at `.claude/commands/test-list.md` and `.claude/commands/predictive-tdd.md`. The parent names `.claude/commands/<name>/SKILL.md`, a path that does not exist in the Claude Code layout, so a cc agent following it literally finds nothing and falls back on the slash commands or the rules file. The pi port is unaffected; its `SKILL.md` paths are real.

Predictions, dimensions cross-check, stack profiles, domain-boundary trial, narrow undo, lab markers, and autonomy remain unchanged.

Validation status: unmeasured before smoke and fill runs.
