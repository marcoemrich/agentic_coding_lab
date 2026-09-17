# Findings — RQ-1.19: Lab/Product Rule Split Neutrality

Four workflows on `opus-5-no-thinking`. `exact-hybrid-v2-testlist-fix-cc` is the
measurement basis; the other three are lab/product rule splits that differ only
in how much text the split carries and how it is worded. Production files
(`agents/refactor.md`, all three commands, `settings.json`) are byte-identical
across all four.

| Workflow | what the split carries | rules | vs. hybrid-v2 |
|---|---|---:|---:|
| `exact-hybrid-v2-testlist-fix-cc` | no split | 7202 B | — |
| `exact-hybrid-v2.8-pure-split-cc` | pure partition of hybrid-v2, nothing added | 7451 B | +3.5 % |
| `exact-hybrid-v2.7-continuation-guard-cc` | hybrid-v2.4 minus the duplicated cycle enumeration | 10320 B | +43 % |
| `exact-hybrid-v2.4-lab-split-cc` | derived from the hybrid-v6 lineage | 10625 B | +48 % |

n per cell: hybrid-v2 13 (claim-office) / 5 (GoL), hybrid-v2.8 10 / 5, hybrid-v2.4 and hybrid-v2.7
5 / 5. The hybrid-v2 claim-office cell spans two measurement periods (2026-08 and
2026-09) that are indistinguishable in cost and refactor rate.

**Tables are split by kata.** `kata_base` is a factor here and the two katas
differ in task size by roughly a factor of five (Code Mass (APP) ~180 against
~860). A cross-kata row would compare the kata, not the workflow.

## Overview — game-of-life

All four cells are 5/5 perfect on Correctness (external), so no gating applies.

| Metric | `hybrid-v2` | `hybrid-v2.8` | `hybrid-v2.7` | `hybrid-v2.4` |
|---|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `cc_avg_loc_per_function` — lower = better | 4.54 ± 1.03 | 5.41 ± 1.54 | **3.17 ± 1.52** 🏆 | 3.05 ± 1.39 |
| **Complexity Peak** — lower = better | 10.80 ± 3.27 | 13.40 ± 6.35 | 6.20 ± 3.42 | **5.40 ± 4.56** 🏆 |
| `cognitive_max` — lower = better | **1.80 ± 0.84** 🏆 | 3.60 ± 1.95 | 2.20 ± 1.10 | 2.40 ± 2.61 |
| `mccabe_max` — lower = better | 3.20 ± 0.45 | 3.80 ± 1.48 | 3.00 ± 0.71 | **2.80 ± 1.30** 🏆 |
| **Smell Total** — lower = better | 1.20 ± 1.64 | 1.20 ± 1.64 | **0.80 ± 1.10** 🏆 | 1.80 ± 1.64 |
| **Code Mass (APP)** — lower = better | 182 ± 26 | 177 ± 24 | **156 ± 25** 🏆 | 180 ± 36 |
| `duration_seconds` — lower = better | **621 ± 90** 🏆 | 679 ± 213 | 640 ± 131 | 687 ± 106 |
| `total_tokens` — lower = better | **8.0 M ± 1.7 M** 🏆 | 10.4 M ± 3.4 M | 9.8 M ± 1.3 M | 9.8 M ± 1.4 M |
| `refactorings_applied` | 4.40 ± 0.55 | 5.60 ± 3.36 | 5.00 ± 2.45 | 6.20 ± 3.11 |
| `cycle_count` | 10.40 ± 1.52 | 9.80 ± 0.45 | 10.40 ± 1.52 | 10.00 ± 0.71 |
| **Refactor rate per cycle** | **0.43 ± 0.05** | 0.58 ± 0.35 | 0.50 ± 0.30 | 0.63 ± 0.34 |
| Runs with rate ≥ 0.95 | **0/5** | 1/5 | 1/5 | 2/5 |

> The quality rows of this table carry trophies because all four cells are
> level on correctness. They are weak nonetheless: at n=5 and σ from 1.0 to
> 6.4, all cells overlap. `hybrid-v2.8` looks worst on decomposition and
> `hybrid-v2.4` best — both within 1 σ and in the opposite direction to
> claim-office. Nothing separates on this kata.

## Overview — claim-office

| Metric | `hybrid-v2` (n=13) | `hybrid-v2.8` (n=10) | `hybrid-v2.7` (n=5) | `hybrid-v2.4` (n=5) |
|---|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | 0.96 ± 0.03 | 0.95 ± 0.03 | 0.96 ± 0.04 | 0.96 ± 0.04 |
| perfect runs | 6/13 | 2/10 | 2/5 | 2/5 |
| `cc_avg_loc_per_function` — lower = better | 3.95 ± 0.61 | 4.35 ± 0.87 | 4.47 ± 1.20 | 4.49 ± 0.54 |
| **Complexity Peak** — lower = better | 17.23 ± 5.36 | 20.50 ± 4.88 | 24.00 ± 11.29 | 17.60 ± 4.39 |
| `cognitive_max` — lower = better | 2.77 ± 1.54 | 3.20 ± 1.03 | 2.80 ± 0.84 | 2.80 ± 0.84 |
| `mccabe_max` — lower = better | 3.54 ± 0.88 | 3.80 ± 0.79 | 3.40 ± 0.55 | 3.40 ± 0.55 |
| **Smell Total** — lower = better | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| **Code Mass (APP)** — lower = better | 864 ± 108 | 857 ± 177 | 954 ± 136 | 821 ± 111 |
| `duration_seconds` — lower = better | 2688 ± 455 | 3215 ± 599 | 3521 ± 765 | 3841 ± 1523 |
| `total_tokens` — lower = better | 88.1 M ± 16.2 M | 101.5 M ± 21.9 M | 116.5 M ± 25.1 M | 126.2 M ± 41.9 M |
| `refactorings_applied` | 19.00 ± 4.83 | 24.10 ± 4.79 | 26.40 ± 11.61 | 33.00 ± 14.27 |
| `cycle_count` | 45.69 ± 5.41 | 46.10 ± 3.67 | 46.80 ± 4.76 | 48.00 ± 2.55 |
| **Refactor rate per cycle** | 0.41 ± 0.10 | 0.52 ± 0.08 | 0.56 ± 0.23 | 0.69 ± 0.29 |
| Runs with rate ≥ 0.95 | 0/13 | 0/10 | 1/5 | 2/5 |

> **No trophies on claim-office.** The correctness gating rule awards trophies
> for quality and cost metrics only to cells with `verification_pct` = 1.0.
> None of the four cells reaches that on average; all sit at 0.95–0.96. The
> field is therefore empty, and a trophy on the survivor of an empty selection
> would mislead. The correctness row itself is ungated but carries no trophy
> either: the four cells are indistinguishable (F-1.19.4).

---

## F-1.19.1 — The rule split raises refactor frequency, independently of text volume

All three split variants refactor more often per cycle than `hybrid-v2`, at a
practically unchanged cycle count.

| claim-office | refactor rate | `refactorings_applied` | `cycle_count` | rule text |
|---|---:|---:|---:|---:|
| `hybrid-v2` (n=13) | 0.41 ± 0.10 | 19.00 | 45.69 | 7202 B |
| `hybrid-v2.8` (n=10) | 0.52 ± 0.08 | 24.10 | 46.10 | 7451 B |
| `hybrid-v2.7` (n=5) | 0.56 ± 0.23 | 26.40 | 46.80 | 10320 B |
| `hybrid-v2.4` (n=5) | 0.69 ± 0.29 | 33.00 | 48.00 | 10625 B |

`hybrid-v2.8` is the defensible case: a pure partition of `hybrid-v2` at +3.5 %
text. Welch against `hybrid-v2` gives **p = 0.009** for the rate, p = 0.021 for
`refactorings_applied`, p = 0.83 for `cycle_count`. So it is not that more
cycles are run, but that refactoring happens more often within the cycles —
and at a text budget matching that of the measurement basis.

That refutes the obvious explanation — that the split costs because it writes
more text into every turn. It is the partition itself. The mechanism is open;
one conjecture is framing: in `hybrid-v2` the cycle sequence sits in a file
named "TDD Experiment Mode (No HITL)" and reads as measurement scaffolding,
while in the split variants the same list sits under its own heading "Workflow
Sequence" in a methodology file.

---

## F-1.19.2 — The split costs around 20 % wallclock, and refactor frequency explains two thirds of it

| claim-office, `hybrid-v2.8` against `hybrid-v2` | | | Welch p |
|---|---:|---:|---:|
| refactor rate | 0.41 → 0.52 | +27 % | **0.009** |
| `refactorings_applied` | 19.0 → 24.1 | +27 % | 0.021 |
| `cycle_count` | 45.7 → 46.1 | +1 % | 0.83 |
| `duration_seconds` | 2688 → 3215 | +20 % | 0.034 |
| `total_tokens` | 88.1 M → 101.5 M | +15 % | 0.12 |

Arithmetic: 5.1 additional subagent launches per run at a mean refactor
duration of 66 s give 335 s, against a total gap of 527 s. The rest spreads
across the remaining phases.

The defensible test is the rate. Across five comparisons with Bonferroni
correction (α = 0.01) only it survives; the duration at p = 0.034 is consistent
with the mechanism but would not stand on its own. The token difference is not
detectable.

None of this resolves on game-of-life (621 → 679 s, 8.0 → 10.4 M, all σ
overlapping). The kata damps the effect because it acts multiplicatively with
cycle count and codebase size — over ten cycles, +0.11 rate is roughly one
additional spawn; over 46 cycles it is five.

---

## F-1.19.3 — The additional refactoring buys no measurable quality in return

On claim-office all quality metrics are indistinguishable within 1 σ across all
four cells, and `Smell Total` is deterministically 0. The cell with the highest
refactor rate (`hybrid-v2.4`, 0.69) has neither the best decomposition nor the
lowest Complexity Peak.

On game-of-life, `hybrid-v2.4` and `hybrid-v2.7` show better decomposition than
`hybrid-v2` (`cc_avg_loc_per_function` 3.05 and 3.17 against 4.54), while
`hybrid-v2.8` shows the worst in the field (5.41). Since all three show the same
raised refactor rate, the rate cannot explain that difference — at n=5 and σ up
to 1.54 it is noise.

The split's surcharge therefore buys nothing on either kata.

---

## F-1.19.4 — Correctness does not separate the four workflows, and the metric has one bit of resolution

| claim-office | `verification_pct` | perfect runs |
|---|---:|---:|
| `hybrid-v2` | 0.96 ± 0.03 | 6/13 |
| `hybrid-v2.8` | 0.95 ± 0.03 | 2/10 |
| `hybrid-v2.7` | 0.96 ± 0.04 | 2/5 |
| `hybrid-v2.4` | 0.96 ± 0.04 | 2/5 |

On game-of-life all four cells are 5/5 perfect.

The reason for the lack of discrimination lies in the metric. Across all 33
claim-office runs of these four cells, **without exception the same** one of the
15 verification cases fails, `14-family-steinheim`; the other 14 always pass.
On this kata `verification_pct` is therefore not a degree of correctness but a
yes/no question about one scenario, and 0.9333 does not mean "93 % right" but
"this one case wrong".

The error is also deterministic: the claim half of the scenario is right in
every run (`payout` 1800, `remainingCap` 5400); only the premium is wrong, and
in **every** failing run with the same value of 137 against an expected 401.
The model reads the rule either correctly or in exactly one wrong way.

Consequence for any statement about correctness on claim-office: it rests on a
coin flip per run. At n=5 the standard error of a proportion is around 0.22 —
cells can differ by 2/5 against 4/5 without any effect being present.

---

## F-1.19.5 — The always-refactor tipper belongs to the extra text, not to the split

Some runs refactor after **every** cycle — `refactorings_applied` equal to
`cycle_count`, or one cycle off. These runs are the most expensive in the field
(claim-office: 4860–5923 s against 2400–3700 s otherwise).

| | tippers (rate ≥ 0.95), both katas | Fisher against `hybrid-v2` 0/18 |
|---|---:|---:|
| `hybrid-v2.4` | 4/10 | **0.010** |
| `hybrid-v2.7` | 2/10 | 0.119 |
| `hybrid-v2.8` | 1/15 | 0.455 |

Only `hybrid-v2.4` separates. `hybrid-v2.8` — the pure partition — is
indistinguishable from `hybrid-v2` and has **0 of 10** on claim-office. The
tipper therefore hangs on `hybrid-v2.4`'s extra text, not on the partition.

Within that extra text, suspicion falls on the second mention of the cycle.
`hybrid-v2` enumerates the cycle once, in `tdd-experiment-mode.md`;
`hybrid-v2.4` carries the same list forward into `subagent-prompts.md` **and**
states it a second time as an arrow chain in `lab-only.md` under the heading
"Phase Continuation", reinforced by "Red/Green/Refactor for every test" and
"After Green → launch the refactor subagent". `hybrid-v2.7` removes exactly that
second mention and halves the tipper rate — not significant at n=10, but
consistent in direction.

---

## F-1.19.6 — `hybrid-v2.4` varies three to four times more in cost, `hybrid-v2.8` does not

| claim-office | `duration_seconds` σ | `total_tokens` σ | refactor rate σ |
|---|---:|---:|---:|
| `hybrid-v2` | 455 | 16.2 M | 0.10 |
| `hybrid-v2.8` | 599 | 21.9 M | **0.08** |
| `hybrid-v2.7` | 765 | 25.1 M | 0.23 |
| `hybrid-v2.4` | 1523 | 41.9 M | 0.29 |

The variance follows the tipper rate, not the mean: `hybrid-v2.4` runs range
from 2685 s to 5923 s. `hybrid-v2.8` has the tightest rate variance in the whole
field, tighter than the measurement basis.

For a workflow exported as a product baseline, predictable runtime is a quality
attribute in its own right. On that axis `hybrid-v2.8` is level with
`hybrid-v2` and `hybrid-v2.4` is markedly worse.

---

## F-1.19.7 — Marker health is unchanged across all four workflows

All four produce the four markers from `MARKERS.md` on both katas.
`predictions_total` sits at ≈ 2 × `cycle_count` (hybrid-v2.8 GoL: 20 predictions
over 10 cycles), `refactorings_applied` is non-zero everywhere, and
`tests_passing` is true in all 53 runs. The rule split is harmless from a
measurement standpoint — all four cells are usable without restriction.

---

## F-1.19.8 — The original 2.9 σ anomaly was an n=3 artifact

The motivation for this RQ was a value of 2.9 σ on `refactorings_applied`
across three game-of-life control runs, computed against the σ of `hybrid-v2`.

| | control (n=3, σ of `hybrid-v2`) | this RQ (n=5, pooled σ) |
|---|---:|---:|
| `refactorings_applied` GoL | 2.9 σ | 0.80 σ |

The value shrinks because `hybrid-v2.4` itself varies widely (σ 3.11 against
0.55 for `hybrid-v2`) — a deviation computed one-sidedly against the narrower σ
overstates the effect.

The directional result stands (F-1.19.1), and so does the methodological core
of the criticism: `refactorings_applied` was not among the compared metrics in
the control at all, the control ran on only one kata, and it ran outside the RQ
pipeline.

---

## F-1.19.9 — A period control was necessary and came back negative

The original measurement compared `hybrid-v2` runs from 2026-08 against
`hybrid-v2.4` runs from 2026-09, with a container rebuild in between
(2026-09-04, floating `node:22-slim` base). "`hybrid-v2.4` costs more" was
therefore indistinguishable from "September costs more".

| `hybrid-v2`, claim-office | `duration_seconds` | `total_tokens` | refactor rate | tippers |
|---|---:|---:|---:|---:|
| 2026-08 (n=5) | 2661 ± 411 | 81.9 M ± 17.0 M | 0.41 | 0/5 |
| 2026-09 (n=8) | 2704 ± 507 | 92.0 M ± 15.5 M | 0.39 | 0/8 |

No drift in cost or rate; `hybrid-v2` produces no tipper in either period. The
cells are merged.

On correctness the question stayed open: `14-family-steinheim` succeeds in 4 of
5 runs in 2026-08, in 2 of 8 in 2026-09 (Fisher p = 0.103). The August arm is
frozen at n=5, and further runs can no longer close this. It remains a
documented anomaly without the status of a finding — and one more reason to
read correctness statements on this kata with restraint (F-1.19.4).

---

## F-1.19.10 — An aborted run is recorded by the pipeline as a success

One `hybrid-v2.6` run ended its turn after the test-list phase: one `test-list`
skill call, no red/green/refactor, no `experiment-done.txt`, 71 s. It is
recorded in `metrics.json` as `exit_reason: "ok"` because the CLI exited with 0.

`aggregate-by-query.py:284` derives `completed_within_budget` from
`exit_reason` alone and excludes only `timeout`, `rate-limited`,
`transient-api-error`, `quota-exhausted` and `pi-retries-exhausted`. Such a run
therefore counts as complete, with `null` metrics throughout — precisely the
class the comment at that location warns about ("visually identical to a model
that failed the task").

The documented completion signal from `CLAUDE.md`
(`jq .run_status.exit_reason`) reports this run as fine. Only the existence of
`experiment-done.txt` is reliable. All numbers in this RQ are filtered on that
criterion.
