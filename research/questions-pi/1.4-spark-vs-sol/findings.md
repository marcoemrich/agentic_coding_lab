# RQ-spark-vs-sol — Findings

/ GPT-5.3 Codex Spark vs. GPT-5.6 Sol on the two native Sol workflows,
sphinx-score-example-mapping, OpenAI subscription route, n=5 per cell.

## Übersicht

Primary outcome is Correctness (external) — the 16-scenario acceptance suite the
agent never sees. Everything below it is gated on that result.

| Metrik | Richtung | Sol / inline | Sol / subagent | Spark / inline | Spark / subagent |
|---|---|---:|---:|---:|---:|
| **Correctness (external)** | höher = besser | **0.99** 🏆 | 0.96 | 0.78 | 0.84 |
| Correctness (internal) | höher = besser | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| completed_within_budget | höher = besser | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| Complexity Peak (cognitive) | kleiner = besser | 1.8 | **1.6** 🏆 | 3.4 | 4.2 |
| Complexity Peak (mccabe) | kleiner = besser | 2.8 | **2.6** 🏆 | 4.2 | 4.4 |
| `cc_longest_function` | kleiner = besser | **13.2** 🏆 | 16.2 | 22.8 | 21.2 |
| `cc_avg_loc_per_function` | kleiner = besser | **13.2** 🏆 | 15.9 | 19.2 | 19.3 |
| Smell Total | kleiner = besser | **0** 🏆 | **0** 🏆 | 1.0 | 0.4 |
| Code Mass (APP) | — | 129.2 | 136.0 | 159.6 | 151.8 |
| `predictions_correct_rate` | höher = besser | **100 %** 🏆 | **100 %** 🏆 | 80.5 % | 80.5 % |
| duration_seconds | kleiner = besser | 440 | 946 | 321 | 630 |
| total_tokens | kleiner = besser | **1.6 M** 🏆 | 2.5 M | 5.1 M | 6.2 M |

**Correctness-gating applies to every quality and cost row.** No Spark cell reaches
`verification_pct = 1.0`, so no Spark cell is eligible for a 🏆 on complexity, mass,
duration or tokens — even where its raw number is lower. Spark/inline is the fastest
cell in the field at 321 s, and that is precisely the artifact the rule guards against:
it is fast because it ships a smaller, wrong rule set. The same holds for its
`cycle_count` mean of 10.0, which includes one run that stopped after 3 cycles.

`duration_seconds` therefore carries **no** trophy: the fastest cell in the row is
Spark/inline, which gating excludes, and the fastest eligible cell (Sol/inline, 440 s)
is not the row's best value. Gating narrows a field of competitors; it never moves a
trophy onto a worse number. `total_tokens` does keep its trophy — there Sol/inline is
both eligible and the row's lowest value.

Code Mass (APP) carries no trophy at all — see the metric blind spot noted in RQ-1.14:
APP has no notion of nesting and rewards a single long function.

`cost_usd` is deliberately absent. Both models bill against the flat-rate subscription
and are wired without per-token prices, so the field is a constant 0 for all four cells;
a row of zeros would read as a tie rather than as an unmeasured quantity.

---

## F-1.4.1 — Spark does not hold Correctness on this kata

Spark loses Correctness (external) against Sol on both workflows, by a margin far
outside the replicate spread. Internal tests stay green in 20/20 runs, so the gap is
invisible from inside the run — it only surfaces against the external suite.

| cell | n | Correctness (external) mean | min | max | σ |
|---|---:|---:|---:|---:|---:|
| Sol / inline | 5 | **0.99** 🏆 | 0.94 | 1.00 | 0.03 |
| Sol / subagent | 5 | 0.96 | 0.94 | 1.00 | 0.03 |
| Spark / subagent | 5 | 0.84 | 0.69 | 1.00 | 0.14 |
| Spark / inline | 5 | 0.78 | 0.69 | 0.81 | 0.06 |

*höher = besser*

The gap between the model groups (0.96–0.99 vs. 0.78–0.84) is roughly 4σ of the Sol
cells and is not explained by the workflow axis: both Spark cells sit below both Sol
cells. This answers H1 and rules out H3.

The failures are systematic rather than random. Across the ten Spark runs the same
scenarios recur: `15-two-sphinxes-broad-army` (8 runs), `04-below-three-types` and
`09-undead-warrior-below` (6 runs each), `02-lone-sphinx`, `11-two-sphinxes-alone` and
`14-three-sphinxes` (3 each). Sol fails at most one scenario per run and never the same
one repeatedly.

The mechanism is a rule error, not a crash. On `15-two-sphinxes-broad-army` a failing
Spark build returns `{"score":10}` against an expected `{"score":14}` — the CLI runs,
parses input and emits well-formed output. `cli_built` is true and `tests_passing` is
true in all ten runs. Spark converges on a self-consistent but wrong reading of the
scoring rule and then writes tests that confirm it.

That is a property of this kata worth naming: sphinx-score is an ambiguity probe. Its
card text ("2 per type beyond three, else 1") is deliberately underdetermined, and the
example-mapping prompt resolves it only through examples. Sol resolves the ambiguity
correctly, Spark does not.

---

## F-1.4.2 — Spark pays in code quality on every structural metric

Where Correctness already separates the models, code quality separates them again in
the same direction. Spark produces roughly twice the complexity peak and functions
about 40 % longer.

| cell | n | cognitive_max | mccabe_max | `cc_longest_function` | Smell Total |
|---|---:|---:|---:|---:|---:|
| Sol / subagent | 5 | **1.6** 🏆 | **2.6** 🏆 | 16.2 | **0** 🏆 |
| Sol / inline | 5 | 1.8 | 2.8 | **13.2** 🏆 | **0** 🏆 |
| Spark / inline | 5 | 3.4 | 4.2 | 22.8 | 1.0 |
| Spark / subagent | 5 | 4.2 | 4.4 | 21.2 | 0.4 |

*kleiner = besser; gated on Correctness (external) = 1.0, which no Spark cell reaches*

Sol's Smell Total is 0 in all ten of its runs (σ = 0), Spark's is non-zero in both
cells with single runs reaching 5. The `cc_longest_function` gap (13.2–16.2 vs.
21.2–22.8) says Spark extracts less: it writes one long function where Sol writes
several short ones.

Two caveats on reading the size of this effect. Spark's variance is large — cognitive_max
σ is 1.67 and 2.77 against Sol's 0.45 and 1.14 — so individual Spark runs do reach
Sol-like values (min 1 in the subagent cell). And the quality numbers are measured on
code that is partly wrong: a build that implements a smaller rule set has less to be
complex about, which if anything understates the gap.

This answers H2 in combination with F-1.4.1: Spark loses on both axes, not just one.

---

## F-1.4.3 — Prediction discipline degrades on Spark, and the marker count is unreliable

Sol predicts the outcome of its own red phase correctly in 144 of 144 pooled
predictions across both workflows. Spark reaches 80.5 % in both cells.

| cell | n | correct | total | rate |
|---|---:|---:|---:|---:|
| Sol / inline | 5 | 68 | 68 | **100 %** 🏆 |
| Sol / subagent | 5 | 76 | 76 | **100 %** 🏆 |
| Spark / inline | 5 | 66 | 82 | 80.5 % |
| Spark / subagent | 5 | 62 | 77 | 80.5 % |

*höher = besser*

A perfect 100 % across 144 predictions is itself worth flagging: it means Sol never
once mispredicted whether a new test would fail to compile or fail at runtime. Spark
misses roughly one prediction in five.

**`predictions_total` must not be compared across the two models here.** Spark's totals
(82, 77) exceed Sol's (68, 76) while its `cycle_count` means are partly lower — the
counts do not scale together the way they do within a model. Whether Spark emits
prediction lines at a different rate per cycle, or the pi parser picks them up
inconsistently on this route, is unresolved. The rate is comparable because it is a
ratio within each model; the absolute count is not.

---

## F-1.4.4 — The workflow axis is real but smaller than the model axis

H4 asked whether inline-vs-subagent separates the cells more than Spark-vs-Sol does.
It does not, but it is not negligible either, and it points the opposite way for the
two models.

| axis | contrast | Correctness (external) | duration_seconds |
|---|---|---:|---:|
| model (within inline) | Sol → Spark | 0.99 → 0.78 | 440 → 321 |
| model (within subagent) | Sol → Spark | 0.96 → 0.84 | 946 → 630 |
| workflow (within Sol) | inline → subagent | 0.99 → 0.96 | 440 → 946 |
| workflow (within Spark) | inline → subagent | 0.78 → 0.84 | 321 → 630 |

On Correctness the model axis moves the number by 0.12–0.21, the workflow axis by
0.03–0.06 — model dominates by roughly a factor of three. H4 is rejected for
Correctness.

On cost the workflow axis dominates instead: isolating the refactor into a subagent
roughly doubles wall-clock for both models (440 → 946 s on Sol, 321 → 630 s on Spark)
without buying Correctness on Sol, where it costs 0.03. The subagent variant does
appear to help Spark (0.78 → 0.84), but the Spark/subagent cell has σ = 0.14 against a
0.06 difference, so this is not separable from noise at n=5.

The practical reading for the subscription route is unchanged from RQ-1.16: on Sol,
`basic-sol-tdd-pi` is the better default — same Correctness, half the wall-clock, a
third fewer tokens.

---

## Caveats

**Single kata.** All 20 runs are `sphinx-score-example-mapping`. sphinx-score is an
ambiguity probe, and F-1.4.1 traces Spark's loss specifically to mis-resolving that
ambiguity. Whether Spark trails Sol on a kata with unambiguous rules is untested and
must not be inferred from this RQ. This is the single most important open question
against these findings.

**Phase timings and context utilization are not measured on the codex route.**
`avg_cycle_seconds`, `avg_red_seconds`, `avg_green_seconds`, `avg_refactor_seconds`
and `context_utilization_pct` return 0 in every run of both models despite millions of
tokens. Parser gap, not a measurement — excluded from `outcomes:` for that reason.

**Spark's token variance is extreme.** σ ≈ 3.4 M and 3.8 M against means of 5.1 M and
6.2 M; individual runs range from 877 k to 11.8 M. Any per-run token budgeting on this
model has to plan against the maximum, not the mean.

**Spark was newly wired for this RQ** (2026-08-17, `pi-config/agent/models.json` and
`run-batch.sh`). Routing is verified — transcript entries name `gpt-5.3-codex-spark`
and a deliberately invalid id is rejected by the backend — so there is no silent
fallback to another model. No long-run history exists on this id yet.

**Both cells run with reasoning on**, as declared by the `openai-codex` provider entry.
This RQ does not vary reasoning; see RQ-route-effect-pi (1.3) for that axis.
