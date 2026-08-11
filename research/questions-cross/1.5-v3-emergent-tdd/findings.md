# RQ-v3-emergent-tdd — Findings

`v3-basic-tdd` ("use TDD", no phase markers). Claude Code for the Anthropic
models, pi for `gpt-5-6-sol`. Phases inferred from the tool sequence
(`phase_source: "inline-tool"`); all 60 refactor candidates hand-validated
against the transcript.

**Two scopes appear below.** The *factor grid* (`runs.csv`) is five models ×
two katas (`game-of-life`, `claim-office`), example-mapping only, 49 runs — that
is what the aggregation and the correctness figures use. The *sequence analysis*
covers **all 71** v3 example-mapping runs, adding `sphinx-score`, the Portkey
routes and the thinking variants, because TDD rigour is read from the transcript
and needs no cell balance. Each table states which scope it uses.

## Overview — which model actually does TDD, and which refactors

Two independent axes. **Test-first TDD** asks whether the model works in small
steps and observes a red state; **refactoring** asks whether it improves working
code unprompted. Both are measured from the tool sequence and hand-validated;
neither is derivable from `cycle_count` alone.

| Model (harness) | n | **Test-first TDD** | 1st cycle | ≤2 cases | red verified | **Refactoring** | validated | in runs |
|---|---:|:---:|---:|---:|---:|:---:|---:|---:|
| **gpt-5-6-sol** (pi) | 10 | ✅ **yes** 🏆 | **1** 🏆 | **8/10** 🏆 | 9/10 | ✅ **yes** | 3 | 3/10 |
| **opus-5-no-thinking** (CC) | 18 | ⚠️ partial | 13 | 2/18 | **17/18** 🏆 | ✅ **yes** 🏆 | **11** 🏆 | **8/18** 🏆 |
| opus-4-7-no-thinking (CC) | 17 | ❌ no | 13 | 0/17 | 7/17 | ❌ no | 0 | 0/17 |
| sonnet-4-6 (CC) | 11 | ❌ no | 10 | 2/11 | 2/11 | ❌ no | 0 | 0/11 |
| haiku-4-5 (CC) | 11 | ❌ no | 15 | 1/11 | 4/11 | ❌ no | 0 | 0/11 |
| opus-4-6 (CC) | 4 | ❌ no | 42 | 0/4 | 2/4 | ❌ no | 0 | 0/4 |

**Column definitions** — each one is a count from the tool sequence, not a
score:

| Column | What it counts | Why it matters |
|---|---|---|
| **1st cycle** | Median number of `it(` / `test(` cases the model writes **before its first line of implementation**. | The defining TDD step. 1–2 means one behaviour at a time; 13 means a test suite was authored up front. Lower = better. |
| **≤2 cases** | Runs whose first cycle held at most two test cases. | How often the model actually took a TDD-sized step, rather than the median hiding the spread. |
| **red verified** | Runs where a test run happened **between** writing the test and writing the implementation. | Without it the model never saw the test fail — no red state was ever observed, so the test proves nothing about the code that follows. |
| **validated** | Hand-checked **real** refactorings, out of the raw candidate count the heuristic produces (60 candidates across all runs → 14 real). | The raw count also captures bugfixes, lint fixes and brand-new untested files. Only the validated number supports a refactoring claim — see F-1.2. |
| **in runs** | Runs containing at least one validated refactoring. | Distinguishes "one run refactored a lot" from "refactoring is habitual". |

The two verdict columns are mechanical, not judgement calls:

- **Test-first TDD** — *small steps* = a majority of runs open with ≤2 cases;
  *red* = at least ⅔ of runs verify red. Both → ✅, one → ⚠️, neither → ❌.
- **Refactoring** — ✅ if the model produced at least one validated refactoring.

`opus-4-6` sits closest to a boundary: 2 of 4 runs verify red, which is below the
⅔ threshold but on n=4 is barely more than a coin flip. Its verdict rests on the
step size (median 42 cases, 0 of 4 runs ≤2), which is unambiguous.

**The verdicts in one line each:**

- **`gpt-5-6-sol` — the only model doing textbook TDD.** One case per cycle, red
  verified, and it refactors. Nothing else in the set comes close on step size.
- **`opus-5` — a working red/green loop at the wrong granularity.** It verifies
  red more reliably than any other model (17/18) but commits to ~13 expectations
  before implementing. Strongest refactorer by a wide margin.
- **`opus-4-7` — test-first ordering only.** Large increments, red unverified in
  more than half the runs, and of 16 refactor candidates **not one** is a
  refactoring.
- **`sonnet-4-6` — the shape of TDD without the loop.** 8 of 11 runs write the
  entire suite in one block; red verified in 2 of 11. Never refactors.
- **`haiku-4-5` / `opus-4-6` — neither.** Suites up front (opus-4-6: median 42
  cases), red mostly unverified, no refactorings.

**Scope of this table: all 71 v3 example-mapping runs**, which is why `n` exceeds
the `runs.csv` cell size (opus-5 18 vs. 12, opus-4-7 17 vs. 15) and why
`opus-4-6` appears at all — it has no cell in the factor grid.

Restricting to the grid leaves every verdict intact **except haiku-4-5**, which
moves ❌ → ⚠️: on its 6 grid runs 4 verify red (67 %, just over the ⅔ line),
against 4 of 11 across all its runs. Its step size is unaffected (median 14
cases, 1 of 6 runs ≤2), so the "no TDD" reading holds on substance; the flag is
a threshold artefact on a small cell. Per-scope figures are in F-1.5 and F-1.2.

### Secondary outcomes

| Model (harness) | test-first ordering (↑) | `cycle_count` (↑) | refac raw | Correctness ext. (↑) |
|---|---:|---:|---:|---:|
| opus-5-no-thinking (CC) | **100 %** 🏆 | **4.4** 🏆 | 14 | **1.00** 🏆 |
| gpt-5-6-sol (pi) | **100 %** 🏆 | 3.9 | 7 | **1.00** 🏆 |
| opus-4-7-no-thinking (CC) | **100 %** 🏆 | 2.3 | 10 | **1.00** 🏆 |
| sonnet-4-6-no-thinking (CC) | **100 %** 🏆 | 2.0 | 0 | 0.96 |
| haiku-4-5-no-thinking (CC) | 83 % | 3.5 | 3 | 0.87 |

**Test-first ordering is nearly universal and says almost nothing.** Four of five
models reach 100 %, including the ones that never observe a red state. Quote the
verdict table above, not this column. `cycle_count` and raw refactor counts carry
no cross-workflow meaning — see the measurement notes. Correctness (external) is
`verification_pct` on claim-office; game-of-life is 1.00 throughout.

## F-1.1 — Test-first *ordering* survives without any scaffolding

**70 of 71 runs open with a test.** Across six model families, two harnesses and
four katas, a bare "use TDD" instruction is enough to make the test file come
first —
no phase skill, no `## Red` marker, no prediction block.

This finding is about **file ordering only**. It is the weakest of the three TDD
properties and the easiest to satisfy; F-1.5 shows that most of these runs write
a whole suite in that first step and several never observe a red state. Do not
read the 100 % below as "these models do TDD".

The single exception is one `haiku-4-5-no-thinking` claim-office run, which
writes `types.ts`, `pricing.ts`, `claims.ts` and `cli.ts` before its first spec
file. That is a genuine test-last run, not a measurement artefact.

Three further runs (`sonnet-4-6`, `sonnet-4-6-no-thinking`,
`haiku-4-5-no-thinking`, all claim-office) open with `types.ts`. Inspection
shows pure type declarations — `export type ItemType = "sword" | ...`, no
executable construct — followed immediately by the spec file. Counting those as
test-last would have put Sonnet at 80 % on a file containing no behaviour to
test; the metric therefore skips type-only files, which moves both Sonnet cells
to 100 %.

**H1 confirmed for ordering only.** A test comes first almost everywhere. That
is a much weaker statement than "the models do TDD" — see F-1.5, which measures
what happens *after* that first test.

## F-1.2 — Refactoring does not survive, and only two models do it at all

The raw heuristic suggests every model refactors occasionally. Hand-validation
removes that impression. All 60 candidates across every v3 run were classified;
the RQ cells hold 34 of them:

| Model | candidates | Refactoring | Bugfix | Toolchain | New untested file | precision |
|---|---:|---:|---:|---:|---:|---:|
| opus-5 | 14 | **9** | 2 | 2 | 1 | 64 % |
| gpt-5-6-sol | 7 | **3** | 1 | 3 | 0 | 43 % |
| opus-4-7 | 10 | **0** | 2 | 2 | 6 | 0 % |
| haiku-4-5 | 3 | **0** | 2 | 1 | 0 | 0 % |
| sonnet-4-6 | 0 | — | — | — | — | — |
| **RQ cells total** | **34** | **12** | 7 | 8 | 7 | **35 %** |
| *all v3 runs, incl. outside grid* | *60* | *14* | *11* | *16* | *19* | *23 %* |

The last row covers every v3 run in the lab, including `sphinx-score` and
Portkey-routed cells outside this factor grid. Precision drops there because
`sphinx-score` alone contributes 16 candidates of which 8 are tsc/ESLint fixes
and only 2 are refactorings — that kata's lint config pushes the model into
toolchain work.

Only **opus-5 and gpt-5-6-sol refactor unprompted**. opus-4-7 produces 10
candidates in the RQ cells and not one is a refactoring — 6 are new untested
files, 2 bugfixes, 2 lint fixes. Sonnet produces no candidates at all.

### Habit, not accident

Both refactoring models spread the behaviour across runs rather than
concentrating it in one lucky transcript:

| Model | validated refactorings | runs containing ≥1 | of n runs |
|---|---:|---:|---:|
| opus-5 | 11 | **8** | 18 |
| gpt-5-6-sol | 3 | **3** | 10 |

opus-5 refactors in 44 % of its runs, sol in 30 %. For every other model the
figure is 0.

### What the four categories look like

The heuristic ("impl edit with no fresh test before it") cannot tell these
apart; the transcript can. Examples from the validated set:

**Refactoring** — structural change, behaviour unchanged, model names the intent:

> "the tally loop and the rule evaluation are two separate concerns. Splitting them"

> "simplify the redundant branch in `reimbursement` while tests protect me"

**Bugfix** — the logic was wrong, not the structure:

> "my `componentBasePremium` treats 7 runes as 2 blocks + 1 single"

**Toolchain fix** — the compiler or linter complained, nothing else:

> "`@types/node` isn't a dependency, so the Node globals don't typecheck"

**New untested file** — the largest group, and the opposite of refactoring:

> "All 38 tests pass. Now let's build the CLI and scenario processor."

**Borderline rule.** Lint-triggered edits count as refactoring only when the
model argues the change on its own merits — *"naming them makes the rules read
better anyway"*, *"each number encodes a rule from the card"*. Silent lint
compliance counts as a toolchain fix. **Four** candidates sit on this line: three
opus-5 and one sol. Reclassifying all four as toolchain fixes would move opus-5
from 11 validated refactorings to 8 (precision 37 % → 27 % across all its runs)
and sol from 3 to 2 — it would narrow the gap to the non-refactoring models but
not close it, since those stay at zero either way.

**Classification source differs by model.** opus-5 narrates every step, so its
cases were read from the assistant text. `gpt-5-6-sol` emits almost no prose —
one text block per run — so its three cases were classified from the code diff:
magic numbers replaced by `CURSE_RATE`, `countNeighbors` split into a `neighbors`
function, and a triple-nested offset loop extracted into `NEIGHBOR_OFFSETS`. All
three are unambiguous structural changes.

**H2 confirmed, with a qualification.** Without a refactor phase most models stop
at green — but two do not, and that is a model property rather than a workflow
property.

## F-1.3 — Test-first discipline stops at the core algorithm

7 of the 34 RQ-cell candidates — and 19 of all 60 v3 candidates (32 %) — are
**new production files written without any test**, almost all of them the CLI.
The pattern is uniform across models, and the accompanying text is nearly always
the same:

> "All 38 tests pass. Now let's build the CLI and scenario processor."

The algorithm gets full test-first treatment; the CLI, scenario runner and
scaffolding around it are written straight out. opus-4-7 is the clearest case:
6 of its 10 candidates in the RQ cells are untested new files (10 of 16 across
all its v3 runs).

This qualifies F-1.1: **test-first holds for the part of the system the examples
describe**, not for the whole deliverable. The kata prompts specify behaviour for
the domain logic and mention the CLI only as packaging, so the models test
exactly what was exemplified.

**H3 confirmed.**

## F-1.4 — The measurement, not the behaviour, was missing

v3 was treated as unmeasurable for TDD discipline. `MARKERS.md` recorded
`cycle_count 1, refactorings_applied 0, predictions_total 0` "without
exception", and two RQs instruct readers to report those rows as n/a.

Two separate things were wrong:

1. **cc could already see it.** `infer_phases_from_tool_sequence` has been
   scoring every v3 run since it was written; nothing propagated that into the
   docs, so the output kept being read as zeros.
2. **pi could not.** `parse_pi_transcript.py` had no equivalent, so all ten
   `gpt-5-6-sol` runs reported 0 — indistinguishable from "this model never did
   TDD" while the transcripts show clean red/green cycles. Fixed by importing
   the same heuristic; the ten runs moved from 0 to a mean of 3.9 cycles.

A regression diff over all 226 pi runs confirms no instrumented workflow shifted
by a single count.

## F-1.5 — Test-first ordering is not TDD: only one model works in small verified steps

F-1.1 measures *which file came first*. It says nothing about step size or
whether the red state was ever observed. Measured on the **first cycle** — the
test cases written before the first line of implementation, and whether a test
run happened in between:

**Scope: the 55 runs in the RQ cells** (the factor-grid models, all their
example-mapping runs). The overview table uses the wider 71-run scope; both are
listed so the thresholds can be checked either way.

| Model | n | first-cycle cases (median) | runs with ≤2 cases | red verified |
|---|---:|---:|---:|---:|
| gpt-5-6-sol (pi) | 10 | **1** 🏆 | **8/10** 🏆 | 9/10 |
| opus-5-no-thinking | 18 | 13 | 2/18 | **17/18** 🏆 |
| opus-4-7-no-thinking | 15 | 12 | 0/15 | 7/15 |
| sonnet-4-6-no-thinking | 6 | 11 | 1/6 | 1/6 |
| haiku-4-5-no-thinking | 6 | 14 | 1/6 | 4/6 |

Across these 55 runs, only **22 % open with an increment of two cases or
fewer**, and **31 % never run the tests before implementing**.

For reference, the same measurement over all 71 example-mapping runs, which adds
`opus-4-6` and the thinking variants:

| Model | n | median | ≤2 cases | red verified |
|---|---:|---:|---:|---:|
| gpt-5-6-sol | 10 | 1 | 8/10 | 9/10 |
| opus-5 | 18 | 13 | 2/18 | 17/18 |
| opus-4-7 | 17 | 13 | 0/17 | 7/17 |
| sonnet-4-6 | 11 | 10 | 2/11 | 2/11 |
| haiku-4-5 | 11 | 15 | 1/11 | 4/11 |
| opus-4-6 | 4 | 42 | 0/4 | 2/4 |

The only cell that moves materially is haiku: 4/6 verified red inside the grid
versus 4/11 across all its runs. The cause is the thinking variant, which
verifies red in **0 of 5** runs against 4 of 6 for no-thinking — the only place
in this dataset where the thinking flag visibly shifts TDD behaviour. Sonnet is
unaffected (median 10 with thinking, 11 without; red 1/5 vs. 1/6), and the other
models have no thinking runs at v3. With n=5 this is suggestive, not
established; it would need its own RQ to settle.

**`gpt-5-6-sol` is the only model that works in TDD-sized steps.** Median first
increment 1, and the rhythm continues through the run:

```
test spec.ts +1 → RUN → impl → RUN → test +2 → RUN → test +2 → RUN → impl → RUN
```

Every other model opens with a **test suite**, not a test. The extreme case is a
`sonnet-4-6-no-thinking` claim-office run:

```
test quote.spec.ts +25 → test claim.spec.ts +16 → test cli.spec.ts +7
  → impl items.ts → impl quote.ts → impl claim.ts → impl scenario.ts → impl cli.ts
  → RUN pnpm test
```

48 test cases across three files, then five implementation files, and only then
the first test run. Nothing red was ever observed. That is waterfall with the
tests written first — the shape of TDD without the feedback loop.

### The four patterns actually observed

Every run falls into one of four shapes. They are visible directly in the tool
sequence, and they explain why one summary number cannot capture "does this model
do TDD".

**1 — Real TDD (`gpt-5-6-sol`, 8 of 10 runs).** One case, run, implement, run.
The suite grows with the implementation.

```
test spec.ts +1 → RUN → impl → RUN → test +2 → RUN → test +2 → RUN → impl → RUN
```

**2 — Suite up front, red verified (`opus-5`, typical).** A large first block,
but the model does run the tests and watch them fail before implementing. The
loop exists; the step is too large.

```
test premium.spec.ts +26 → RUN → RUN → impl types.ts → impl priceList.ts
  → impl premium.ts → RUN → RUN → test +2 → RUN → test +1
```

Note what follows the big block: increments of 2 and 1. opus-5 *can* work small —
it just front-loads the bulk of its expectations. The tail is also why a median
over all blocks misleads (see Measurement notes).

**3 — Suite up front, red never seen (`opus-4-7`, 10 of 17 runs).** Test block,
more test blocks, then implementation — no test run in between. The first
`RUN` happens after the code already exists, so no test ever failed for the
reason it was written.

```
test premium.spec.ts +18 → test +1 → test +1 → test +1 → test +3
  → impl types.ts → impl premium.ts → RUN
```

**4 — Waterfall with tests first (`sonnet-4-6`, 8 of 11 runs).** The entire test
suite across several files, then the entire implementation across several files,
then the first test run. The extreme case:

```
test quote.spec.ts +25 → test claim.spec.ts +16 → test cli.spec.ts +7
  → impl items.ts → impl quote.ts → impl claim.ts → impl scenario.ts → impl cli.ts
  → RUN pnpm test
```

48 cases, 5 implementation files, one test run at the end. This satisfies
"test-first" by any file-ordering metric and contains no TDD whatsoever.

### Why the Opus generations differ

**opus-5 verifies red in 17 of 18 runs** even while writing large increments;
opus-4-7 in 7 of 15. That is the difference between patterns 2 and 3, and it is
the single sharpest behavioural split in the dataset. opus-5 does watch its tests
fail — it just fails them a dozen at a time.

**Practical reading.** v3 buys test-first *ordering* from every model and a
functioning red/green loop from opus-5. It does not buy incremental design from
anything except `gpt-5-6-sol`. If the point of prescribing TDD is small steps,
the bare instruction does not deliver it — which is an argument for the phase
scaffolding the instrumented workflows add, not against it.

### No evidence of tests being weakened to reach green

The large first increments raise the obvious suspicion that failing tests get
softened rather than satisfied. Two checks, both negative:

- **Weakened assertions in the final test code** (`toBeDefined`, `toBeTruthy`,
  `expect.any`, empty `catch`, `.skip` / `.todo`): 2 occurrences across all 72
  v3 runs, both a single `toBeDefined`.
- **Expectations edited after a failure.** Frequent — sonnet 10 of 11 test
  edits, haiku 20 of 32, opus-4-6 8 of 9, opus-5 11 of 51, and `gpt-5-6-sol`
  **0 of 38**. But the accompanying text shows these are corrections of the
  model's own arithmetic, not concessions to the implementation:

  > "= 100 + 10 − 20 − 15 + 5 = 80. The test expectation is wrong. Let me fix
  > the tests"

  The model re-derives the rule from the kata spec and repairs an expectation it
  had computed wrongly. That is legitimate — though it is a direct consequence of
  writing a dozen expectations up front instead of one at a time. `gpt-5-6-sol`
  never needs the repair because it only ever commits to one expectation per
  cycle.

### Measurement notes

- **`cycle_count` is not comparable across workflow generations.** On opus-5, v3
  yields 1–8 and v6.6 yields 7–57. Inferred tool sequence and marker emission are
  different constructs. Never place them in one column.
- **Raw `refactorings_applied` is an upper bound**, at 23 % precision overall.
  Only `opus-5` and `gpt-5-6-sol` have any validated refactorings at all;
  `opus-4-7`, `haiku-4-5` and `opus-4-6` produce candidates that are 0 %
  refactorings, and `sonnet-4-6` produces none. Only the validated column
  supports a claim.
- **`cycle_count` says nothing about rigour.** It counts red/green alternations,
  not their size, and a run that authors 26 expectations before implementing
  scores the same as one that authors two. Step size and verified-red must be
  measured on the first cycle (F-1.5); `experiments/measure-tdd-rigour.py` does
  this for any workflow, not just v3.
- **Medians over all test blocks are misleading here.** Models that front-load a
  suite typically follow it with several one-case fixes, which drags an
  all-block median down to 1–2 and makes a big-bang run look incremental. This
  cost an earlier draft of F-1.5 its classification; only the first cycle
  separates the patterns reliably.
- **`predictions_*` stay unmeasurable** — no inference reconstructs a prediction
  the model was never asked to state.
- **Model and harness are confounded** between the opus-5 and sol cells (CC vs.
  pi). Both refactor and both open test-first, but they differ in step size, and
  that difference cannot be attributed to model or harness from this data. No
  ranking between the two is claimed. The cc cells are mutually clean.
