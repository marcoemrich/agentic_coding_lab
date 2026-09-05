# v6.1.5-pure-split-cc

A pure partition of `v6.1-hybrid-testlist-scope-fix` along the lab/product
seam. Same instructions, redistributed across four rule files; nothing added
beyond what two standalone files need to make sense on their own.

## Why this exists

`v6.1.1-lab-split-cc` was meant to be that partition, but it was derived from
the v6.6 lineage instead and arrived carrying 48 % more rule text — rationale
prose, an export contract table, and a second statement of the Red/Green/
Refactor cycle phrased as an imperative chain. RQ-1.19 measured the cost:
about +44 % duration and +54 % tokens on claim-office, plus always-refactor
runs that `v6.1` never produces.

This workflow keeps the split property and the v6.1 text budget:

| workflow | rules | vs. v6.1 |
|---|---:|---:|
| `v6.1-hybrid-testlist-scope-fix` | 7202 B | — |
| `v6.1.5-pure-split-cc` | 7451 B | +3.5 % |
| `v6.1.4-continuation-guard-cc` | 10320 B | +43 % |
| `v6.1.1-lab-split-cc` | 10625 B | +48 % |

## Export contract

Delete `.claude/rules/lab-only.md`. That removes the autonomous-execution
override and the done-marker obligation, which are the only lab-specific
instructions. What remains — `tdd.md`, `subagent-prompts.md`,
`tdd_with_ts_and_vitest.md` — is the workflow itself.

This README is deliberately **outside** `.claude/`. The run driver copies
only `.claude/`, so nothing here reaches the agent's context. Documentation
about the workflow does not belong in the rules the workflow is made of.

## What changed against v6.1, exactly

- `rules/tdd-experiment-mode.md` split into `rules/lab-only.md` (autonomy
  override, done marker) and `rules/subagent-prompts.md` (workflow sequence,
  refactor prompt contract).
- `rules/tdd.md`: the string `EXPERIMENT MODE: ` dropped from the refactor
  prompt template, so the exported workflow carries no lab vocabulary. 17
  bytes; otherwise byte-identical to v6.1.
- The autonomy instruction the subagent prompt used to carry inline is now
  requested by `lab-only.md`, so it leaves with that file on export.
- `agents/`, `commands/`, `settings.json` and `rules/tdd_with_ts_and_vitest.md`
  are byte-identical to v6.1.

No phase-continuation guard, and no per-cycle enumeration of the cycle beyond
the one sequence v6.1 already had.
