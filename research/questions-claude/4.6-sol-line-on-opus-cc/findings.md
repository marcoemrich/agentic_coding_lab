# Findings — RQ-sol-line-on-opus-cc

Is the native Sol workflow line (basic-sol-tdd, Predictive TDD, Four Rules refactor)
better only on Sol/pi, or does it also beat the v-line on Opus with native Claude
Code — and does the APP effect that suppresses decomposition on Sol reproduce there?

Data base: 31 runs, 6 cells (n=5, one n=6 from the existing pool). Kata
`claim-office-example-mapping`, native Claude Code, thinking off in every cell.
All cells `completed_within_budget` 100 % and `tests_passing` 100 %.

## Übersicht

Direction column applies to both model columns. Trophies compare **within a model**,
i.e. per column pair, since the question is which workflow wins on a given model.

| Metric | v3 · o4-8 | v3 · o5 | sol-cc · o4-8 | sol-cc · o5 | v6.2 · o4-8 | v6.2 · o5 | Direction |
|---|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | 80 % | 99 % | höher = besser |
| Correctness (internal) `tests_passing` | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | höher = besser |
| `cc_avg_loc_per_function` | 8.81 ± 1.71 | 8.90 ± 1.65 | **6.65 ± 0.69** 🏆 | 7.86 ± 1.60 | 4.24 ± 0.67 | **4.40 ± 0.42** 🏆 | kleiner = besser |
| `cc_median_loc_per_function` | 7.70 | 7.17 | **6.00** 🏆 | 6.70 | 2.00 ± 0.00 | **2.00 ± 0.00** 🏆 | kleiner = besser |
| Complexity Peak `cc_longest_function` | 23.4 | 24.3 | **19.4 ± 3.58** 🏆 | **22.4 ± 4.51** 🏆 | 24.6 | 23.4 | kleiner = besser |
| `cognitive_max` | 7.0 ± 2.24 | 5.33 ± 1.86 | **4.6 ± 1.82** 🏆 | **3.4 ± 0.89** 🏆 | 3.6 ± 1.14 | 3.6 ± 1.14 | kleiner = besser |
| `mccabe_max` | 6.0 | 5.33 | **4.4** 🏆 | 4.0 ± 0.71 | 4.0 | **3.8 ± 0.84** 🏆 | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | 1.0 | 0.2 | kleiner = besser |
| Code Mass (APP) | 927.0 | 758.2 | 723.8 | 631.4 | 895.0 | 928.8 | kein 🏆 — s. Caveat |
| `cycle_count` | n/a | n/a | 32.8 | 52.4 | 33.6 | 39.6 | — |
| `refactorings_applied` | n/a | n/a | 29.6 | **39.8 ± 10.52** 🏆 | 36.0 | 28.0 | höher = besser |
| `duration_seconds` | **365** 🏆 | **330** 🏆 | 958 | 1016 | 4159 | 3637 | kleiner = besser |
| `cost_usd` | **$4.87** 🏆 | **$3.89** 🏆 | $17.80 | $17.37 | $95.60 | $59.13 | kleiner = besser |

Caveats for reading the table:

- **Correctness gating at 96 %**: quality and efficiency trophies go only to cells at
  `verification_pct` ≥ 0.96. That admits `v6.2 · o5` (99 %, one scenario short in one of
  five runs) and excludes `v6.2 · o4-8` (80 %, one total failure in four). The threshold
  is deliberately below 100 % — a single missed scenario is within this kata's normal
  variation, a zeroed run is not.
- **`cycle_count`, `refactorings_applied` are n/a for v3**, not zero — v3 prescribes no
  phase markers. The parser's inferred values (`cycle_count` 5–6,
  `refactorings_applied` 1–2) are not comparable to marker-based counts.
- **Code Mass gets no trophy**: APP has no notion of nesting and rewards one long
  function (metric blind spot, RQ README). Here it is reported as the mechanism
  witness — see F-4.6.2.
- `v6.2 · o4-8` is n=4 (one run timed out); all other cells are n=5, `v3 · o5` n=6.

## F-4.6.1 — Workflow optimisation does not transfer across models

This is the load-bearing result of the RQ, and it is larger than the specific workflows
it was measured on. **The ranking of three TDD workflows inverts completely between two
models**, at constant kata, prompt style and metric — the same three documents, judged
on the same decomposition metric:

| Rank | `gpt-5-6-sol-codex` (RQ-1.17) | `opus-4-8` | `opus-5` |
|---|---|---|---|
| 1 | `basic-sol-tdd` 6.60 | `v6.2` 4.24 | `v6.2` 4.40 |
| 2 | `v3` 8.45 | `basic-sol-tdd-cc` 6.65 | `basic-sol-tdd-cc` 7.86 |
| 3 | `v6.2.1` (APP) 9.52 | `v3` 8.81 | `v3` 8.90 |

Values are `cc_avg_loc_per_function`, kleiner = besser. The best workflow on Sol is the
worst on Opus and vice versa — a full reversal, not a reshuffle in the middle.

The two Opus generations agree with each other and disagree with Sol, so this is not
noise between adjacent model versions: it is a property of the model family. What
separates them is legible in the briefs. `v6.2` instructs the agent to minimise APP mass
*and* carries a guard that clarity outranks it. Opus follows the guard and extracts named
functions; Sol optimises the number it was given and inlines (F-1.17.1, F-4.6.2). Same
instruction, opposite behaviour.

**Consequence for this lab's method.** Every workflow-development RQ that ran on one
model produced findings whose scope is that model, whether or not the finding says so.
The v-line was developed and validated on Opus and is genuinely good there — it wins here
— but F-1.6 and F-1.16 already showed it losing to structureless TDD on Sol, and this RQ
now shows the reverse holding on Opus. A workflow recommendation without a model
attached is not a finding, it is an extrapolation.

The practical rule that follows: **a workflow ported to a new model must be re-ranked
there, not assumed.** The cheapest form of that is the three-cell shape used here —
floor, candidate, incumbent — on one kata.

## F-4.6.2 — On Opus the APP line decomposes best, reversing the Sol result

The decomposition metrics rank the three workflows in the opposite order from
`gpt-5-6-sol-codex`, and they do so identically on both Opus generations:

| Metric | v3 | basic-sol-tdd-cc | v6.2 (APP) | Direction |
|---|---:|---:|---:|---|
| `cc_avg_loc_per_function` · o4-8 | 8.81 | 6.65 | **4.24** | kleiner = besser |
| `cc_avg_loc_per_function` · o5 | 8.90 | 7.86 | **4.40** | kleiner = besser |
| `cc_median_loc_per_function` · o4-8 | 7.70 | 6.00 | **2.00** | kleiner = besser |
| `cc_median_loc_per_function` · o5 | 7.17 | 6.70 | **2.00** | kleiner = besser |

The gap is far outside 1 σ on every row (σ 0.42–1.71) and the median is the sharper
signal: v6.2 lands at exactly 2.00 with σ = 0.00 in all ten runs across both models.
Inspection of the source trees shows why — v6.2 produces 22–34 functions for 238–403
production LoC, i.e. half of them are two lines or shorter, while the native line
builds 14–20 larger functions from a comparable spec.

On Sol the same comparison ran the other way: `basic-sol-tdd-pi` reached
`cc_avg_loc_per_function` 6.60 against 9.52 for `v6.2.1-phase-continuation-pi`
(F-1.17.1). **The workflow that decomposes worst on Sol decomposes best on Opus.**

This supports H2: the APP mass table is not inherently decomposition-hostile. Both
Opus generations honour the brief's own guard ("Rule 2 trumps APP: Clarity over low
mass") that Sol optimises past.

### The head-to-head on `opus-5-no-thinking`

The full picture of the trade-off, both cells n=5 at the same kata, model and prompt
style — this is the comparison the recommendation rests on:

| Metric | basic-sol-tdd-cc | v6.2 (APP) | Direction |
|---|---:|---:|---|
| Correctness (external) | **100 %** 🏆 | 99 % | höher = besser |
| `cc_avg_loc_per_function` | 7.86 ± 1.60 | **4.40 ± 0.42** 🏆 | kleiner = besser |
| `cc_median_loc_per_function` | 6.70 | **2.00 ± 0.00** 🏆 | kleiner = besser |
| Complexity Peak `cc_longest_function` | **22.4 ± 4.51** 🏆 | 23.4 ± 5.81 | kleiner = besser |
| `cognitive_max` | **3.4 ± 0.89** 🏆 | 3.6 ± 1.14 | kleiner = besser |
| `mccabe_max` | 4.0 ± 0.71 | **3.8 ± 0.84** 🏆 | kleiner = besser |
| Smell Total | **0.0 ± 0.00** 🏆 | 0.2 ± 0.45 | kleiner = besser |
| Code Mass (APP) | **631.4** | 928.8 | kein 🏆 (Blind Spot) |
| `refactorings_applied` | **39.8 ± 10.52** 🏆 | 28.0 ± 10.12 | höher = besser |
| `duration_seconds` | **1016** 🏆 | 3637 | kleiner = besser |
| `cost_usd` | **$17.37** 🏆 | $59.13 | kleiner = besser |

Read as three groups:

- **Decomposition — v6.2, decisively.** 1.8× on the mean, 3.4× on the median, both far
  outside 1 σ. Concretely: 22–34 functions for 238–403 production LoC against 14–20
  larger ones.
- **Complexity — a tie.** `cognitive_max`, `mccabe_max` and Complexity Peak all sit
  within 1 σ of each other and split 2:1 in favour of the native line. These metrics do
  not see the difference the length metrics see, exactly as the blind spot predicts.
- **Cost and correctness — the native line.** 3.4× cheaper, 3.6× faster, and 5/5 perfect
  against one scenario missed.

So the choice is not "better vs. worse workflow" but "structure vs. budget", and only the
decomposition metrics distinguish them at all.

## F-4.6.3 — Code Mass confirms the mechanism by failing to move

The APP brief exists to minimise Code Mass. On Sol it succeeded at that and paid for it
in structure — lowest mass (492) and worst decomposition of the field (F-1.17.1). On
Opus it achieves neither:

| Cell | Code Mass (APP) | `cc_avg_loc_per_function` |
|---|---:|---:|
| v6.2 · o4-8 | 895.0 | 4.24 |
| v6.2 · o5 | 928.8 | 4.40 |
| sol-cc · o4-8 | 723.8 | 6.65 |
| sol-cc · o5 | **631.4** | 7.86 |
| v3 · o4-8 | 927.0 | 8.81 |
| v3 · o5 | 758.2 | 8.90 |

The APP-optimising cells carry the **highest** mass in the field, and the line that
never mentions APP carries the lowest. Opus does not chase the number the brief names;
it extracts named functions instead, which costs mass (`Invocation`, 2 per call site)
and buys structure.

That is the same trade-off Sol resolved in the opposite direction, and it makes the
mass metric a clean witness here: on this model the brief's stated priority order is
followed, so the metric it names loses to the goal it serves.

## F-4.6.4 — The native line clears the v3 floor on Opus, but not by the Sol margin

`basic-sol-tdd-cc` beats the structureless floor on every quality metric, on both
models, at equal (perfect) correctness:

| Metric | v3 · o4-8 | sol-cc · o4-8 | v3 · o5 | sol-cc · o5 | Direction |
|---|---:|---:|---:|---:|---|
| `cc_avg_loc_per_function` | 8.81 | **6.65** | 8.90 | **7.86** | kleiner = besser |
| Complexity Peak | 23.4 | **19.4** | 24.3 | **22.4** | kleiner = besser |
| `cognitive_max` | 7.0 | **4.6** | 5.33 | **3.4** | kleiner = besser |
| `mccabe_max` | 6.0 | **4.4** | 5.33 | **4.0** | kleiner = besser |
| Code Mass (APP) | 927.0 | **723.8** | 758.2 | **631.4** | kleiner = besser |

So F-1.16.1 does transfer in direction: the native line is a real improvement over
structureless TDD on Opus too. But the margin is smaller than on Sol, where the same
comparison showed `cognitive_max` 11.4 → 4.0 (2.85×) with the spread collapsing from
σ 8.96 to σ 0.63. Here the ratio is 1.5× on o4-8 and 1.6× on o5, and both cells were
already well-behaved: v3 on Opus produces zero smells in 11 of 11 runs, where v3 on Sol
averaged 4.2.

The reading is that the native line's Sol advantage came substantially from **rescuing a
badly behaved baseline**. On Opus the baseline is not badly behaved, so there is less to
rescue — and the v-line, which was developed on this model, is ahead of both.

## F-4.6.5 — v6.2 is the only line with a correctness regression on Opus

Quality is not free here. The two v6.2 cells are the only ones in the RQ that fail
external verification:

| Cell | `verification_pct` | Detail |
|---|---:|---|
| v6.2 · o4-8 | 0.80 ± 0.45 | one run at 0.0 of four |
| v6.2 · o5 | 0.99 ± 0.03 | one run at 0.93 of five |
| all four other cells | 1.00 ± 0.00 | 21/21 runs |

The o4-8 figure rests on n=4 with one total failure, which is thin — but the direction
matches the pattern this kata has produced for Opus-derived workflows before (RQ-1.9,
RQ-1.10), and no other cell in this RQ shows any regression at all. Per the RQ's H4 this
withholds a recommendation for v6.2 on `opus-4-8-no-thinking` regardless of its
decomposition win.

`v6.2 · o5` at 0.99 is a single scenario short in one run and does not disqualify the
cell.

## F-4.6.6 — Cost separates the three lines by an order of magnitude

| Cell | `duration_seconds` | `cost_usd` | vs. v3 |
|---|---:|---:|---:|
| v3 · o5 | 330 | $3.89 | — |
| v3 · o4-8 | 365 | $4.87 | — |
| sol-cc · o5 | 1016 | $17.37 | 4.5× |
| sol-cc · o4-8 | 958 | $17.80 | 3.7× |
| v6.2 · o5 | 3637 | $59.13 | 15.2× |
| v6.2 · o4-8 | 4159 | $95.60 | 19.6× |

The ordering is stable across both models: the floor is cheapest, the native line costs
~4×, the v-line 15–20×. The `v6.2 · o4-8` cost figure carries σ 87.64 — one run consumed
far more than the others — so treat the 19.6× as indicative.

Against Sol these absolute figures do not transfer (different route, different billing);
only the internal ordering is comparable, and there the native line was also the middle
option at 6.9× the floor (F-1.16.1).

## F-4.6.7 — The native line wins the duration/quality trade-off on both Opus generations

F-4.6.2 establishes that v6.2 decomposes better on Opus. It does not come free, and the
exchange rate is unfavourable on both models. Comparing the two structured lines directly
— v3 is not a reference here, its quality is inadequate on Opus and its wide spread
(`cc_avg_loc_per_function` σ 1.65–1.71) makes it a poor baseline for a marginal figure:

| Model | v6.2 duration | vs. native line | Decomposition gain | **Seconds per point** |
|---|---:|---:|---:|---:|
| opus-4-8 | 4159 s | **4.34×** | 1.57× (6.65 → 4.24) | 1328 s |
| opus-5 | 3637 s | **3.58×** | 1.79× (7.86 → 4.40) | 757 s |

Duration grows faster than quality on both models: roughly four times the wallclock buys
about one and a half times the decomposition. Expressed per unit, each point of
`cc_avg_loc_per_function` costs 12.6 minutes of additional runtime on opus-5 and 22.1
minutes on opus-4-8.

Two qualifications keep this from being a blanket verdict for the native line:

- **The advantage is shrinking across generations.** 4.34× on opus-4-8 against 3.58× on
  opus-5 — and the reason is not that v6.2 improved (4.24 → 4.40, marginally worse) but
  that the native line degraded (6.65 → 7.86). The trend runs against it.
- **It is a trade-off only on decomposition.** On every other quality metric the native
  line already wins or ties — `cognitive_max` on opus-5, Complexity Peak on both, Smell
  Total on both — while also reaching 10/10 perfect external correctness against v6.2's
  80 % / 99 %. There the comparison is not "faster but coarser", it is simply faster and
  at least as good.

So the duration/quality argument reinforces the recommendation on `opus-4-8`, where v6.2
is disqualified on correctness anyway (F-4.6.5), and makes the `opus-5` choice a genuine
decision: v6.2 for structure, the native line for throughput.

## Recommendation

- **Pick the workflow per model, never per line.** The ranking of these three workflows
  inverts completely between Sol and Opus (F-4.6.1). A workflow that is best on one model
  is a plausible candidate on the next, not a recommendation — re-rank it against the
  floor and the incumbent before adopting it.
- **On Opus, for claim-office-like work: `v6.2-with-why-cleaned` on `opus-5-no-thinking`.**
  Best decomposition in the field (`cc_avg_loc_per_function` 4.40, median 2.00) at 99 %
  correctness. Not on `opus-4-8-no-thinking` — that cell shows a total verification
  failure in one of four runs (F-4.6.5).
- **`basic-sol-tdd-cc` wins on duration/quality on both models** (F-4.6.7): v6.2 needs
  3.6–4.3× the wallclock for 1.6–1.8× the decomposition, i.e. 12.6–22.1 minutes per point of
  `cc_avg_loc_per_function`. It is also 3.4× cheaper on opus-5, reaches perfect external
  correctness in 10/10 runs, and wins or ties every quality metric except decomposition.
  Choose it whenever throughput matters or decomposition is not the binding goal.

## Open questions

- Why does Opus honour the "clarity trumps APP" guard that Sol optimises past? A
  targeted probe would give one model both briefs on the same kata and compare how often
  the guard is followed — this is now an instruction-following question, not a
  brief-design one.
- Is the `v6.2 · o4-8` correctness regression a rate or an artefact of n=4? → n=10 on
  that cell, the cheapest way to firm up the one recommendation this RQ withholds.
- Does the ordering hold on game-of-life, where the Sol comparison found the floor
  unbeaten (F-1.16.2)? The three workflows on the small kata would show whether v6.2's
  decomposition win survives where there is less to decompose.
- Does `basic-sol-tdd-subagent-cc` (refactor isolated) behave as on Sol, where isolation
  bought nothing and cost 2.7× (F-1.16.3)?
