# External TDD Workflows: Substituting the Implementation Loop

Status: 2026-09-03.

## Question

We keep Example Mapping as the starting point and swap out **only the
implementation / TDD / refactoring part** for an external skill or tool.

**Scope: the inner loop.** Refactoring inside the cycle belongs to it.
End-refactoring is now a separate skill on our side (workflows with and without
it) and stays out of this study as its own dimension. A paired comparison (our
workflow with end-refactor against an external one with end-refactor) is possible
later, but is not part of this. The katas are small enough that the inner loop
alone is informative.

## Selection criterion

**Is the inner TDD loop isolable and feedable with our Example Mapping output?**

## Candidates

| Candidate | Loop isolable | Refactor position | Status |
|---|---|---|---|
| **Own workflow** (v6.x) | — (baseline) | **per-cycle**, isolated subagent | baseline |
| **Superpowers** `test-driven-development` | yes, confirmed | **per-cycle**, inline in the skill | candidate |
| **Pocock** `tdd` | yes, already runs in the lab | **tail** (step 5: "After all tests pass") | measured (RQ-4.4) |
| **nWave** DELIVER | loop yes, but needs artifact chain | **open** (indication: none) | candidate, unresolved |
| ~~ATDD plugin~~ | **no** | — | dropped → augmentation track |

### Evidence on isolability

**Superpowers** (`skills/test-driven-development/SKILL.md`): needs no plan, spec
or brainstorm artifact. Takes a directly stated requirement and starts the loop.
The gesamt-workflow's brainstorming phase is not a precondition for this skill.

**nWave**: `/nw-distill [acceptance-criteria]` takes acceptance criteria as an
argument — that is the docking point. `/nw-deliver` alone does **not** run: it
requires outputs from DISCOVER…DISTILL, a feature roadmap from `/nw-roadmap`, and
step definitions as JSON under `docs/feature/{feature-id}/steps/`. Realistically
one enters at DISTILL and has to produce the upstream artifacts minimally.

**ATDD plugin** (dropped): the implementation step (4 of 7) depends on generated
artifacts from steps 1–3. The implementer must first see the generated acceptance
tests fail. No command exists for the bare red-green-refactor loop. → moves to the
augmentation track (`mutate`, `kill-mutants`, `spec-check`).

## Main axis: refactor position

The existing lab measurement (RQ-4.4) shows that **refactor position is the
dominant variable** — not prompt quality and not skill mechanics.

RQ: `research/questions-claude/4.4-external-tdd-pocock-vs-v62/`.
Kata `claim-office-example-mapping`, model `opus-4-7-portkey-no-thinking`.

| Metric | v6.2-with-why-cleaned (n=8) | v9-pocock-tdd (n=3) |
|---|---:|---:|
| refactorings_applied | 24.9 | 0 |
| cognitive_max | 5.0 | 14.3 |
| mccabe_max | 4.5 | 11.7 |
| cc_longest_function | 12.4 | 32.3 |
| smell_total | 0.4 | 6.7 |
| code_mass | 878 | 748 |
| cycle_count | 37.4 | 14.0 |
| duration_seconds | 2530 | 570 |
| total_tokens | 44.4 M | 13.1 M |
| verification_pct | 0.96 | 1.00 |

**Finding:** hypothesis H4 of the RQ failed. The assumption was that Pocock's
"deep modules / small interfaces" makes per-cycle refactoring unnecessary. The
complexity metrics say the opposite — factor 2.5–3 on cognitive_max and
mccabe_max. At the same time Pocock is more compact (code_mass) and roughly 4.4×
cheaper at equal correctness.

**Limitation:** the comparison varies two things at once — refactor position
(per-cycle vs. tail) **and** architecture (multi-command + subagent vs.
single-skill inline). It therefore does not answer whose inner loop is better,
but effectively what refactor position does.

## Why Superpowers should be the next candidate

Superpowers has **the same refactor position as v6.x (per-cycle)**, but inline
instead of as a subagent. A comparison v6.x ↔ Superpowers therefore isolates
exactly the variable RQ-4.4 had to leave open:

> Does the isolated refactor subagent buy anything over inline refactoring —
> at equal refactor position?

That is the cleanest next cut and closes the confound gap of RQ-4.4.

## Open question: does Superpowers hold cycle discipline?

**Observation (n=1, manual, unconfirmed):** Superpowers wrote all tests at once
instead of one per cycle. Without feedback from the implementation flowing back
into the next test, that is not TDD. May well be a one-off — finding that out is
the point, not assuming it.

**The skill itself clearly prescribes single tests:**
"Write **one minimal test**", requirements "One behavior", "Repeat: Next failing
test for next feature", checklist "Watched **each** test fail before
implementing". The red flags even list "Test passes immediately" as a
start-over condition. Batching would be a deviation from the skill, not its
design.

**Measurable without touching markers.** `experiments/measure-tdd-rigour.py`
classifies TDD rigour purely from the tool sequence in the transcript:

- `test_blocks` — number of test-write blocks (**1 = big bang**, >1 = incremental)
- `first_cases` / `all_cases` — test cases in the first block vs. total
- `verified` / `unverified` — was there a test run between writing a test and
  writing implementation?

This resolves a methodological problem: the verbatim RED marker block from
`MARKERS.md` is **not a neutral probe** — an output obligation per RED phase
creates exactly the structural break whose absence encourages batching. Measuring
cycle discipline through markers partly manufactures it. This applies
retroactively to v9-pocock as well: the RED block was *inserted* there for the
lab. `measure-tdd-rigour.py` does not need it — so Superpowers can be vendored
unmodified (only the DONE marker stays necessary, otherwise container timeout).

This is now lab-wide policy, not a suggestion for this study: see `README.md` →
"Cycle discipline is measured from the transcript, not from markers", and the
corresponding section in `experiments/workflows/MARKERS.md`.

**Two obstacles when setting this up:**

1. The script's `__main__` is hardwired to `*_v3-basic-tdd*` — parameterise the
   glob to apply it to other workflows.
2. Test runs are only detected via `pnpm test` / `pnpm run test`. The Superpowers
   skill consistently uses `npm test` in its examples. If the model adopts that,
   `verified`/`unverified` come out empty and look like "never verified". Check on
   a smoke run before the batch.

## Open points

1. **Resolve nWave's refactor position.** The docs mention a "3-Phase TDD Canon
   (RED → GREEN → COMMIT)" — REFACTOR is missing from the triad. A practitioner
   report describes the loop as "failing acceptance test → failing unit tests
   through the driving port → minimum code to green → **it commits**", also
   without refactor. Indication: no refactor inside the cycle. **Not
   established** — docs.nwave.ai does not lead to the loop spec across four
   levels. Resolution: install the plugin, search its 206 skills locally for the
   software-crafter / deliver spec.
2. **Set up Superpowers as a lab workflow** (v11?), following the v9 vendoring
   pattern: skill unmodified, plus a `tdd-experiment-mode.md` with HITL override
   and DONE marker. No RED marker block — see the section above. Cf.
   `experiments/workflows/MARKERS.md`.
3. **v10-pocock-tdd** exists in the lab (leaner tdd skill plus `code-review`
   skill) but has no runs. Decide whether v10 enters the comparison or v9 stays
   the reference state.
4. **Snapshot drift:** the Pocock skill in the lab is from 2026-05-26, upstream
   has moved on. For Superpowers and nWave, record the snapshot date and upstream
   commit from the start.
5. **n=3 is small** (the RQ's own caveat). If the Superpowers comparison turns
   out interesting: top up to n=8, matching the RQ-1.9 standard for claim-office.

## Translating Example Mapping into tool input

Not yet worked through. Per candidate, clarify what becomes of rule and example
cards:

- **v6.x / Superpowers**: test list in natural language, one entry = one cycle.
  Already solved for Pocock in the lab via the stipulation "example mapping IS
  the plan approval".
- **nWave**: Example Mapping result → acceptance criteria as argument to
  `/nw-distill`; DISTILL turns them into Given-When-Then. Example cards are
  scenarios in raw form, so the structural fit is good.

## Not TDD workflows (checked, for the record)

- **Omakase** (omakaseagent.com) — three roles (Engineer/Critic/Archivist) plus a
  rubric gate. Tests appear only as verification ("runs your build and tests"),
  no cycle structure. Out for TDD comparisons.
- **Ponytail** (github.com/DietrichGebert/ponytail) — a minimalism skill, not a
  workflow: a decision ladder before writing (YAGNI → reuse → stdlib → native →
  dependency → one line). Says nothing about TDD, but is **orthogonal to the
  loop** and targets `code_mass` directly → additively testable (v6.x with and
  without, same loop, same kata). Connects to RQ-4.4: Pocock reached the lower
  code mass (748 vs. 878) via "deep modules"; Ponytail pursues the same goal by a
  different means. Their own benchmark: −54 % LOC against an agent baseline
  (Haiku 4.5, n=4, 12 tickets, real repo); earlier −80..94 % withdrawn after
  criticism (issue #126); they also measure a safety tier (does minimalism cut
  validation, error handling or security?).

## Confidence

Statements about Superpowers and the ATDD plugin come from skill files and repo
docs actually read. The nWave statements come from README and a practitioner
report, **not** from skill files — the refactor question in particular is open.
The lab numbers come from `summary.md` of RQ-4.4 (generated 2026-05-25).

Sister document on the augmentation track (hooks, guardrails, mutation testing)
lives in the book repo:
`exact-coding-book/comments_and_ideas/handover-tdd-workflows-uc2.md`.
