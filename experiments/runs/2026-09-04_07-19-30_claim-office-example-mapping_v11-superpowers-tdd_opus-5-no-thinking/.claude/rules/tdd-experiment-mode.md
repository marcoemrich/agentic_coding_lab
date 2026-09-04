# TDD Experiment Mode (No HITL) — Superpowers TDD Skill

## Provenance

The skill under `.claude/skills/test-driven-development/` is **not authored by
this project**. It is vendored **byte-identical** from Superpowers by Jesse
Vincent (<https://github.com/obra/superpowers>), release `v6.3.0`, upstream
commit `b36e0829` (2026-08-12), retrieved 2026-09-04. MIT-licensed; the upstream
license is preserved in `LICENSE.upstream` at the workflow root.

Both files (`SKILL.md`, `writing-good-tests.md`) are unchanged — verified by
checksum against a fresh clone. **This rules file is the only project-authored
addition.** Upstream evolves, so measurements here describe that snapshot, not
the current upstream skill.

Unlike `v9-pocock-tdd`, no marker block was inserted into the skill. See
`experiments/workflows/MARKERS.md` → "Vendored external workflows: no RED marker
block", and `README.md` → "Cycle discipline is measured from the transcript, not
from markers". Cycle discipline for this workflow comes from
`experiments/measure-tdd-rigour.py`, which reads the tool sequence only.

## Override for Automated Experiments

The skill defers to a "human partner" in several places (exceptions to TDD,
final rule, when stuck). There is no human in the loop here. For this run:

- Do NOT wait for human approval — not before starting, not between phases,
  not at the exceptions the skill lists.
- No exception to the Iron Law applies here: this is a new feature, not a
  throwaway prototype, not generated code, not configuration. Follow the full
  Red-Green-Refactor cycle for every behaviour.
- If the skill says "ask your human partner", decide yourself and continue.
- Complete the whole exercise autonomously.

## Planning Input: The Example Mapping Is the Approved Plan

`prompt.md` carries the specification. When it is in example-mapping format
(rules + examples + questions), treat it as the agreed plan: **every concrete
example is one behaviour to test**, every rule constrains the implementation.
Do not ask further questions and do not wait for approval — the example mapping
IS the approval. When the prompt is prose or user-story format, derive the
behaviours yourself and proceed.

This replaces the planning that would otherwise precede implementation. Go
straight into the skill's Red-Green-Refactor loop.

## Workflow Entry

Invoke the `test-driven-development` skill at the start of the task via the
Skill tool. All phases (RED, verify RED, GREEN, verify GREEN, REFACTOR) run
inline inside that one skill invocation — there are no separate `/red`,
`/green`, or `/refactor` sub-commands, and no refactor subagent.

Do not invoke any other skill. In particular, do not brainstorm, write a plan
file, or dispatch subagents: this experiment measures the inner TDD loop only.

## Test Command

The project uses **pnpm**; dependencies are already installed. Run tests with:

```bash
pnpm test
```

The skill's examples say `npm test` — that is upstream's phrasing, not a
requirement. Use `pnpm test` (equivalent here: both run `vitest run`).

## Done Marker

When all behaviours from the prompt are implemented, all tests pass, and the
refactor step of the last cycle is finished, write a file `experiment-done.txt`
in the working directory containing the single word `DONE` on its own line. Do
not write any other summary or report file.

Without this file the run driver will hit its timeout and the run will be
flagged as incomplete.
