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
| **Own workflow** (hybrid-v1.x) | — (baseline) | **per-cycle**, isolated subagent | baseline |
| **Superpowers** `test-driven-development` | yes, confirmed | **per-cycle**, inline in the skill | vendored as superpowers-2026-09-04, measured in RQ-4.13 |
| **Pocock** `tdd`, May snapshot | yes | **tail** (step 5: "After all tests pass") | withdrawn — see "The withdrawn May snapshot" |
| **Pocock** `tdd`, Aug snapshot | yes, vendored as pocock-2026-09-04 | **report-only** — no refactor in loop or review | measured in RQ-4.13 |
| **Kesseler** `tdd` (lexler/skill-factory) | yes, vendored as kesseler-2026-09-30 | **per-cycle**, inline in the skill | measured in RQ-4.13 |
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

Refactor position is the one design choice across these candidates with a
mechanistic link to code quality, so it is the axis the comparison is built on.
Where a workflow refactors — every cycle, once at the end, or never — varies
independently of prompt quality and skill mechanics.

Currently measured by
[RQ-4.13](questions-claude/4.13-tdd-workflow-comparison-opus55/) on
`claim-office-example-mapping` × `opus-5-5-no-thinking`, with five cells:

| Cell | Origin | Loop architecture | Refactor position |
|---|---|---|---|
| `exact-hybrid-v2-testlist-fix-cc` | lab | phase commands + subagent | per-cycle |
| `exact-hybrid-v2.4-lab-split-cc` | lab | same, split file layout | per-cycle |
| `external-superpowers-2026-09-04-cc` | vendor | single skill, inline phases | per-cycle |
| `external-pocock-2026-09-04-cc` | vendor | skill + `code-review` skill | none |
| `external-kesseler-2026-09-30-cc` | vendor | single skill, inline phases | per-cycle |

- **superpowers ↔ pocock** varies refactor position at constant architecture.
- **hybrid ↔ superpowers** varies architecture and mechanism at constant position.
- **superpowers ↔ kesseler** varies only the author, so no statement about
  "an external inline skill" rests on n=1 skill.
- **hybrid-v2 ↔ hybrid-v2.4** is the lab line's own spread (RQ-1.19).

The predecessor [RQ-4.7](questions-claude/4.7-external-tdd-workflows-opus5/) ran
the first three of those cells on `opus-5-no-thinking` and is closed. Its
correctness, decomposition and cost findings stand; its discipline columns came
from the marker and transcript routes retired in 2026-10, and were never
comparable across cells for exactly the reason this page keeps running into — a
vendored skill emits no markers. The phase chain removed that limit, and it
cannot be backfilled, so the field is re-measured rather than extended.

### The withdrawn May snapshot

An earlier study compared `exact-hybrid-v4-cleaned-cc` against the May Pocock
snapshot (vendored 2026-08-31, since removed) on `opus-4-7-portkey-no-thinking`. Both that RQ and
its runs have been removed from the repo, so its figures cannot be re-derived
or verified and **no numbers from it are carried forward here**. Two of its
qualitative observations motivated the current design and are restated as open
questions, not results:

- A tail refactor may fire only once and leave complexity where the initial
  implementation put it. `pocock-2026-09-04` (no refactor stage) is the floor case for this
  in RQ-4.13.
- That comparison varied refactor position *and* loop architecture at the same
  time, so it could not say which produced its effect. RQ-4.13's contrasts
  above exist to separate them.

The May snapshot also carried a lab-inserted RED marker block, which is not a
neutral probe (see below), so it was never a clean authenticity comparison. Its
workflow directory has been removed as well — it had no runs left and belonged to
no RQ; it is recoverable from the git history.

## Why Superpowers should be the next candidate

Superpowers has **the same refactor position as hybrid-v1.x (per-cycle)**, but inline
instead of as a subagent. A comparison hybrid-v1.x ↔ Superpowers therefore isolates
the variable the withdrawn May study could not:

> Does the isolated refactor subagent buy anything over inline refactoring —
> at equal refactor position?

This is the `hybrid ↔ superpowers` contrast in RQ-4.13.

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

**Measurable without touching the skill.** The figure is `red_batch_size` from
the phase chain: the median number of tests that newly fail when a red arrives.
1 means one failing test at a time; higher means a batch was authored before any
implementation existed. Report `red_batch_max` with it — a single big-bang opener
hides inside a median of 1. `green_batch_size` is the mirror and separates the
interesting case: a workflow that writes several tests up front and then
implements them one at a time reads red high, green 1.

This resolves a methodological problem: the verbatim RED marker block from
`MARKERS.md` is **not a neutral probe** — an output obligation per RED phase
creates exactly the structural break whose absence encourages batching. Measuring
cycle discipline through markers partly manufactures it. It applied to the
May Pocock snapshot too, where the RED block was *inserted* for the lab. The
phase chain needs nothing of the kind: it reads the test framework's own event
stream, so Superpowers can be vendored unmodified (only the DONE marker stays
necessary, otherwise container timeout).

This is lab-wide policy, not a suggestion for this study: see `README.md` →
"Phase chain metrics", and the corresponding section in
`experiments/workflows/MARKERS.md`.

**One obstacle when setting this up.** The Superpowers skill consistently uses
`npm test` in its examples while the stack is driven by `pnpm`. The phase chain
is indifferent — the reporter fires from inside vitest however the suite was
started — but a failing `npm test` distorts the run itself. The project rules
file therefore pins `pnpm test`; verify on a smoke run that the model follows it.

An earlier measurement route for this question — `test_blocks` and
`red_verified`/`red_unverified` from `measure-tdd-rigour.py` — was retired in
2026-10. It keyed on `Write`/`Edit`/`MultiEdit` calls and read 0 for any model
that writes files through the shell, which is indistinguishable from "never
wrote a test". The script is still in the tree as a manual tool.

## external-pocock-2026-09-04-cc: upstream moved the refactor out of the loop

`experiments/workflows/external/external-pocock-2026-09-04-cc/` holds a second Pocock snapshot, now at
upstream commit `6654f6b6` (2026-08-24, retrieved 2026-09-04). It is **not an
update of the May snapshot** — upstream restructured the workflow between May and August:

| | May snapshot (2026-05-26, removed) | external-pocock-2026-09-04-cc (2026-08-24) |
|---|---|---|
| tdd skill | 5 sub-files (`tests`, `mocking`, `refactoring`, `interface-design`, `deep-modules`) | 2 sub-files (`tests`, `mocking`), 38 lines |
| Refactor position | tail — inside the skill, after all tests are green | **not in the workflow at all** (see below) |
| Further skills | — | `code-review`, `codebase-design` |
| Seam selection | implicit | explicit, pre-agreed before any test |

The decisive line is in "Rules of the loop":

> **Refactoring is not part of the loop.** It belongs to the review stage (see the
> `code-review` skill), not the red → green implementation cycle.

**But `code-review` does not refactor either.** It runs two parallel sub-agents —
Standards (against a Fowler smell baseline) and Spec — and *reports* their
findings side by side. It changes no code. Upstream's `implement` skill closes
the sequence with "Once done, use /code-review to review the work. Commit your
work to the current branch" — no fix pass. So in this architecture, refactoring
is neither in the loop nor in the review; the review hands findings to a human.

That makes pocock-2026-09-04 a **third** position on the main comparison axis: per-cycle
(hybrid-v1.x, Superpowers) → tail (the May snapshot) → report-only (pocock-2026-09-04). Only the
per-cycle and report-only ends are currently measured; the tail position has no
runs in the pool.

### Adaptations to make it runnable

Vendored: `tdd`, `code-review`, and `codebase-design` (the latter resolves the
skill-to-skill reference in `tdd`), all byte-identical, checksum-verified. The
only project-authored file is `.claude/rules/tdd-experiment-mode.md`, which
covers four points:

1. **DONE marker** — otherwise the container hits its timeout.
2. **HITL override.** The skill puts human approval in the body, not in a side
   note: "Before writing any test, write down the seams under test and confirm
   them with the user. No test is written at an unconfirmed seam", plus a literal
   question to ask. The override keeps the write-down and treats `prompt.md` as
   the confirmation.
3. **`code-review` without git.** The run dir is not a repo and has no issue
   tracker, so `git diff <fixed-point>...HEAD`, `docs/agents/issue-tracker.md`
   and the `/setup-matt-pocock-skills` fallback do not apply. Substitute: the
   directory started empty, so the change set is every file written; the spec is
   `prompt.md`; the Standards axis rests on the skill's own smell baseline, which
   is its documented fallback for repos that document nothing. `git init` is
   explicitly ruled out — run dirs are tracked in this repo, and a nested repo
   would corrupt that.
4. **The review reports, it does not fix.** The rules file forbids acting on the
   findings. An autonomous fix pass would be a step we invented and would make
   pocock-2026-09-04 silently comparable to a tail-refactor workflow it is not. `refactorings_applied = 0`
   is the expected result here and must be read as the workflow's property.

Point 4 is the one open design decision. The alternative — let it apply its own
review findings — would be a defensible second variant (call it v10b), but it
measures something upstream does not prescribe. Not built.

## Open points

1. **Resolve nWave's refactor position.** The docs mention a "3-Phase TDD Canon
   (RED → GREEN → COMMIT)" — REFACTOR is missing from the triad. A practitioner
   report describes the loop as "failing acceptance test → failing unit tests
   through the driving port → minimum code to green → **it commits**", also
   without refactor. Indication: no refactor inside the cycle. **Not
   established** — docs.nwave.ai does not lead to the loop spec across four
   levels. Resolution: install the plugin, search its 206 skills locally for the
   software-crafter / deliver spec.
2. ~~**Set up Superpowers as a lab workflow.**~~ **Done** — see
   `experiments/workflows/external/external-superpowers-2026-09-04-cc/`. Skill vendored byte-identical
   from release `v6.3.0`, commit `b36e0829` (2026-08-12), checksum-verified
   against a fresh clone; no RED marker block. The only
   project-authored file is `.claude/rules/tdd-experiment-mode.md` (HITL
   override, "example mapping IS the plan", `pnpm test` instead of the skill's
   `npm test`, DONE marker). **Open: smoke run** before the batch.
3. ~~**Decide what to do with external-pocock-2026-09-04-cc.**~~ **Done** — updated to upstream
   `6654f6b6` (2026-08-24) and made runnable on 2026-09-04; see the section
   below. It is not "pocock-2026-08-31 updated" but a different point on the refactor axis, so
   both stay side by side. **Open: smoke run** before the batch.
4. **Snapshot drift** is now recorded per workflow, in each
   `.claude/rules/tdd-experiment-mode.md`: pocock-2026-08-31 = Pocock 2026-05-26 (on disk, in
   no RQ), pocock-2026-09-04 = Pocock `6654f6b6` (2026-08-24), superpowers-2026-09-04 =
   Superpowers `b36e0829` / v6.3.0 (2026-08-12). Do the same for nWave. Note
   that Superpowers renamed `testing-anti-patterns.md` to `writing-good-tests.md`
   between 5.1.0 and 6.3.0; the refactor position stayed per-cycle, so the
   comparison rationale is unaffected.
5. **n=3 is small** (the RQ's own caveat). If the Superpowers comparison turns
   out interesting: top up to n=8, matching the RQ-1.9 standard for claim-office.

## Translating Example Mapping into tool input

Not yet worked through. Per candidate, clarify what becomes of rule and example
cards:

- **hybrid-v1.x / Superpowers**: test list in natural language, one entry = one cycle.
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
  loop** and targets `code_mass` directly → additively testable (hybrid-v1.x with and
  without, same loop, same kata). Both Pocock snapshots pursue lower code
  mass via "deep modules"; Ponytail pursues the same goal by a different means. Their own benchmark: −54 % LOC against an agent baseline
  (Haiku 4.5, n=4, 12 tickets, real repo); earlier −80..94 % withdrawn after
  criticism (issue #126); they also measure a safety tier (does minimalism cut
  validation, error handling or security?).

## Confidence

Statements about Superpowers and the ATDD plugin come from skill files and repo
docs actually read. The nWave statements come from README and a practitioner
report, **not** from skill files — the refactor question in particular is open.
No lab numbers are quoted in this document; measured figures live in the
`findings.md` of the RQ that produced them.

Sister document on the augmentation track (hooks, guardrails, mutation testing)
lives in the book repo:
`exact-coding-book/comments_and_ideas/handover-tdd-workflows-uc2.md`.
