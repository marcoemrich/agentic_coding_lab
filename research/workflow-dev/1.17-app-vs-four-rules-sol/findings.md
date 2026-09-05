# Findings — RQ-app-vs-four-rules-sol

On the OpenAI subscription route, does a refactor brief that optimises APP mass
(v6.2.1) decompose worse than one governed by the Four Rules of Simple Design alone
(basic-sol-tdd) — at constant model, harness, kata and prompt style?

Data base: 15 runs, 3 cells × n=5, all `exit_reason: ok`, `completed_within_budget`
100 %, `tests_passing` 100 % and `verification_pct` 100 % in every cell. Route: OpenAI
subscription (`gpt-5-6-sol-codex`), reasoning always on (F-1.3.5). Kata
`claim-office-example-mapping`, the only kata in this lab where the decomposition
metrics measure decomposition rather than function length (F-1.16.7).

## Übersicht

| Metric | v3 (no brief) | basic-sol-tdd (Four Rules) | v6.2.1 (Four Rules + APP) | Direction |
|---|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | höher = besser |
| Correctness (internal) `tests_passing` | 100 % | 100 % | 100 % | höher = besser |
| `cc_avg_loc_per_function` | 8.45 ± 2.41 | **6.60 ± 1.18** 🏆 | 9.52 ± 5.69 | kleiner = besser |
| `cc_median_loc_per_function` | 6.10 ± 1.82 | **4.70 ± 0.67** 🏆 | 6.00 ± 3.67 | kleiner = besser |
| Complexity Peak `cc_longest_function` | 27.0 ± 11.34 | **18.0 ± 3.00** 🏆 | 24.0 ± 13.17 | kleiner = besser |
| `cognitive_max` | 11.4 ± 10.01 | **4.0 ± 0.71** 🏆 | 8.2 ± 4.66 | kleiner = besser |
| `cognitive_avg` | 3.40 | **2.15** 🏆 | 3.55 | kleiner = besser |
| `mccabe_max` | 9.8 ± 5.36 | **5.4 ± 0.89** 🏆 | 6.2 ± 2.05 | kleiner = besser |
| Smell Total | 4.2 ± 9.39 | **0.0 ± 0.00** 🏆 | 9.6 ± 9.02 | kleiner = besser |
| Production LoC | 164.0 | 129.4 | **110.4** 🏆 | kleiner = besser |
| Code Mass (APP) | 750.0 | 556.8 | **492.4** | kein 🏆 — Mechanismus-Zeuge, s.u. |
| `cycle_count` | n/a | 31.6 | 28.0 | — |
| `refactorings_applied` | n/a | **31.6** 🏆 | 14.2 | höher = besser |
| `predictions_correct_rate` | n/a | 98.6 % | **99.3 %** 🏆 | höher = besser |
| `duration_seconds` | **218** 🏆 | 874 | 1266 | kleiner = besser |
| `total_tokens` | **272 k** 🏆 | 4.61 M | 4.61 M | kleiner = besser |
| `cost_usd` | **$0.58** 🏆 | $3.98 | $4.84 | kleiner = besser |

Caveats for reading the table:

- **No correctness gating applies** — all three cells reach `verification_pct` 100 %,
  so the whole field is eligible for quality and efficiency trophies.
- **Code Mass gets no trophy.** In this RQ it is not a quality metric but the witness
  for the mechanism under test: it is what the v6.2.1 refactor brief optimises, and it
  runs *against* the decomposition metrics (F-1.17.1). Reporting it as a win would
  invert the finding.
- **`cycle_count`, `refactorings_applied` and `predictions_correct_rate` are n/a for
  v3**, not zero — v3 prescribes no phase markers. The parser's inferred `cycle_count`
  3.0 and `refactorings_applied` 0.4 are not comparable to marker-based counts and are
  omitted. See MARKERS.md, "Baseline workflows satisfy marker 4 only".
- **The v6.2.1 means are averages over two distinct regimes**, not a central tendency.
  Read them together with F-1.17.2 — every σ in that column above 3 comes from the
  split, not from noise.

## F-1.17.1 — The APP brief buys the lowest mass and the worst decomposition

The cell that optimises APP mass achieves it: 492.4 against 556.8 and 750.0, the lowest
of the field, on the fewest Production LoC (110.4). On the metrics that measure
decomposition it lands last, behind even the structureless floor:

| Metric | v3 | basic-sol-tdd | v6.2.1 | Direction |
|---|---:|---:|---:|---|
| Code Mass (APP) | 750.0 | 556.8 | **492.4** | kleiner = besser |
| Production LoC | 164.0 | 129.4 | **110.4** | kleiner = besser |
| function count | 14.2 | 9.8 | **6.6** | — |
| `cc_avg_loc_per_function` | 8.45 | **6.60** | 9.52 | kleiner = besser |
| `cc_longest_function` | 27.0 | **18.0** | 24.0 | kleiner = besser |

The two directions are not independent. `refactor.md` in `v6.2.1-phase-continuation-pi`
prescribes the mass table that prices extraction — **Invocation (Mass: 2)** — so an
extracted function is charged twice, once for existing and once per call site.
Minimising the number the brief names rewards inlining, and the cell does exactly that:
it writes the least code of the three and cuts it into the fewest pieces.

The same brief carries a guard against this ("Rule 2 trumps APP: Clarity over low
mass"). On this model it does not hold: `basic-sol-tdd-pi`, which refactors under the
Four Rules with no mass metric at all, applies 31.6 refactorings per run against 14.2
and reaches the best decomposition values in the field.

This is the metric blind spot documented in RQ-1.14 and RQ-1.16 — APP has no notion of
nesting — reappearing inside a workflow rather than inside a measurement. There it is a
caveat for readers; here it steers the agent.

## F-1.17.2 — The APP cell splits into two regimes, and only one of them collapses

The v6.2.1 cell is bimodal, not dispersed. Sorting its five runs by function count
separates them cleanly, with no run in between:

| Group | n | functions | `cc_avg_loc_per_function` | `cognitive_max` | Smell Total | Code Mass (APP) | `refactorings_applied` |
|---|---:|---:|---:|---:|---:|---:|---:|
| A | 2 | 11.5 | 6.42 | 5.0 | 0.0 | 553 | 14.5 |
| B | 3 | 3.3 | 11.58 | 10.3 | 16.0 | 452 | 14.0 |

Group A is indistinguishable from `basic-sol-tdd-pi` (6.42 against 6.60, zero smells).
Group B carries the entire deficit of the cell: three functions for 100–115 Production
LoC, the longest at 44 lines, 16 smells on average.

The two groups apply the **same number of refactorings** (14.5 against 14.0), so this is
not a discipline difference — the run does the work either way and arrives at a
different structure. Group B also has the lower mass (452 against 553), which is the
direction F-1.17.1 predicts: the collapse is what optimising the number looks like when
nothing stops it.

At n=5 the split is 2 against 3. That is enough to establish that the cell is not
unimodal — the gap between 11.5 and 3.3 functions has no occupancy — but not enough to
estimate how often each regime occurs.

## F-1.17.3 — The blind-spot prediction fails, and that is informative

The RQ predicted a specific signature: the length metrics separate against the APP cell
while `cognitive_max`, `mccabe_max` and Code Mass stay neutral or favour it, because a
callback chain defeats those three. Only half of that holds. `cognitive_max` (8.2) and
Smell Total (9.6) separate against the APP cell as well, and Smell Total is its worst
metric outright.

The mechanism from F-1.17.1 survives this, but its scope narrows. Cognitive Complexity
resets its nesting counter at every function boundary — that protects a *many small
callbacks* shape, not a *three functions, longest 44 lines* shape. In Group B there are
too few boundaries left for the reset to help, so the complexity metrics see what the
length metrics see. In Group A, which stays decomposed, `cognitive_max` is 5.0 and Smell
Total 0.0, i.e. the neutral behaviour the prediction expected.

So the metrics do not move together for the reason H2 proposes (a general quality
difference between two workflow lines). They move together only in the regime where the
structure has collapsed far enough that the blind spot no longer applies. This is
consistent with H1 and inconsistent with a plain line effect — but it is an argument
from the mechanism, not from the metric signature the RQ named in advance, and it rests
on three runs.

## F-1.17.4 — The APP cell costs more than the line it is compared against, and is slower

Cost and throughput do not rescue the APP brief anywhere:

| Metric | v3 | basic-sol-tdd | v6.2.1 | Direction |
|---|---:|---:|---:|---|
| `duration_seconds` | **218** | 874 | 1266 | kleiner = besser |
| `total_tokens` | **272 k** | 4.61 M | 4.61 M | kleiner = besser |
| `cost_usd` | **$0.58** | $3.98 | $4.84 | kleiner = besser |

The two structured cells consume the same total tokens (4.61 M both), yet v6.2.1 needs
1.45× the wallclock and costs 22 % more. The identical totals hide a different mix, and
the mix is where the money is:

| | basic-sol-tdd | v6.2.1 | |
|---|---:|---:|---|
| input | 205 k | 302 k | +47 %, billed at $5/M |
| output | 25 k | 40 k | +56 %, billed at $30/M |
| cache read | 4.38 M | 4.27 M | −3 %, billed at $0.50/M |

Cache reads dominate the volume and are the cheap component; the APP cell spends
noticeably more on the two expensive ones. The duration gap is consistent with the
subscription route's lower throughput (F-1.3.1) applied to a longer agent chain.

Against the floor, both structured lines are expensive: 4.0–5.8× the wallclock and
6.9–8.3× the dollars of v3, which reaches the same 100 % correctness. On this kata the
case for either brief rests on the quality gap documented in F-1.16.1, not on cost.

## Recommendation

- **On Sol/subscription, prefer the Four Rules brief without APP** (`basic-sol-tdd-pi`).
  Best or tied-best on every decomposition and complexity metric, zero smells in 5/5
  runs, at 100 % correctness.
- **Do not port the APP mass table to this model.** It reliably lowers the number it
  names and, in 3 of 5 runs, collapses the structure while doing so (F-1.17.2). Whether
  to keep it on Opus is a separate question — the same brief produces the best
  decomposition in the comparison there.
- **v3 remains the honest choice when cost dominates** and the quality gap of F-1.16.1
  is acceptable: same correctness at ~1/6 of the cost.

## Open questions

- How often does the collapse occur? The 2/3 split of F-1.17.2 needs n=10 on this cell
  before either regime can be called typical.
- Is the mass table the whole cause? v6.2.1 and basic-sol-tdd also differ in skill
  structure and phase vocabulary. → remove only the APP section from
  `v6.2.1-phase-continuation-pi/.pi/agents/refactor.md`, hold everything else constant,
  re-run this cell. That isolates the brief completely and is the cheapest workflow
  change this result licenses.
- Is the effect Sol-specific? `v6.2.1` × `opus-5-requesty` reaches
  `cc_avg_loc_per_function` 2.62 on game-of-life with the same brief — the best value in
  that comparison. If Opus weighs the "clarity trumps APP" guard that Sol ignores, this
  is an instruction-following finding rather than a brief-design finding.
- Does it reproduce on the Requesty route, where F-1.3.6 documents a route effect on
  exactly these metrics? → the same three cells on `gpt-5-6-sol`.
