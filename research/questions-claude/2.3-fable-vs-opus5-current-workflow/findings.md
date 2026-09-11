# RQ-fable-vs-opus5 Findings

Model comparison of Opus 5 vs Fable 5.1 vs Fable 5 (each no-thinking, Claude Max
subscription) on `claim-office-example-mapping × v6.1-hybrid-testlist-scope-fix`,
all cells measured on Claude Code 2.1.267.

## Overview

Primary outcome `verification_pct` (Correctness (external), higher = better);
secondary code quality (`cc_avg_loc_per_function`/`cc_longest_function`/`cognitive_max`/`mccabe_max`/`smell_total`/`code_mass`, lower = better)
and cost (`total_tokens`/`cost_usd`/`duration_seconds`, lower = better).

| Model | n | verification_pct ↑ | σ | cc_avg_loc ↓ | cc_longest ↓ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | code_mass ↓ | total_tokens ↓ | cost_usd ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| opus-5-no-thinking | 5 | **0.95** 🏆 | 0.03 | **3.45** 🏆 | **13.6** 🏆 | 2.8 | **3.0** 🏆 | **0.0** 🏆 | 848.4 | 72.2 M | 42.68 | **2552** 🏆 |
| fable-5-1-no-thinking | 5 | **0.93** 🏆 | 0.08 | 3.63 | 14.4 | **2.6** 🏆 | 3.2 | 0.2 | **805.2** 🏆 | **61.3 M** 🏆 | **29.44** 🏆 | 4042 |
| fable-5-no-thinking | 5 | 0.87 | 0.12 | 4.79 | 17.6 | 3.2 | 3.8 | 0.6 | (659.0) | 63.0 M | 76.93 | 4950 |

`verification_pct`: opus-5 (0.95) and fable-5-1 (0.93) differ by 0.02 — far
below 1 σ of either cell → both 🏆. fable-5 (0.87) is not merely lower but fails
*differently* (F-fable-vs-opus5.2), which is why it is treated as behind rather
than as tied.

**Correctness gating of the quality trophies:** Quality and efficiency trophies
go only to cells with mean `verification_pct` ≥ 0.90. opus-5 (0.95) and
fable-5-1 (0.93) qualify; **fable-5 (0.87) does not** and therefore receives no
quality or cost trophy, regardless of its raw values. The ceiling on this kata
is 14/15 = 0.93, not 15/15, because `14-family-steinheim` fails
deterministically for every model (RQ-1.19 F-1.19.4).

fable-5's `code_mass` of 659.0 is additionally **parenthesized** to mark why its
leading number must not be read as parsimony: 3 of its 5 runs silently drop an
entire class of scenarios (F-fable-vs-opus5.2), so the smaller Code Mass (APP)
is missing coverage, not economy of expression.

**Cost trophies are gated the same way.** `total_tokens` goes to fable-5-1
(61.3 M) ahead of opus-5 (72.2 M); `cost_usd` to fable-5-1 ($29.44) ahead of
opus-5 ($42.68) — but read F-fable-vs-opus5.7 before quoting the dollar figures,
because on this workflow they are almost entirely a cache-read tariff.
`duration_seconds` goes to opus-5 (2552 s), the fastest by a wide margin —
fable-5-1 needs 1.6× and fable-5 1.9× as long.

---

## F-fable-vs-opus5.1 — All Three Models Sit at the Kata Ceiling; Only the Fable Line Falls Below It

On `v6.1-hybrid-testlist-scope-fix`, **opus-5 (0.95, σ 0.03)** and **fable-5-1
(0.93, σ 0.08)** are statistically indistinguishable and both sit at the
effective ceiling of this kata. **fable-5 (0.87, σ 0.12)** is below, with more
than four times the spread of opus-5.

| Model | mean | σ | min | max | 15/15 runs |
|---|---:|---:|---:|---:|---:|
| opus-5-no-thinking | 0.95 | 0.03 | 0.93 | 1.00 | 1 / 5 |
| fable-5-1-no-thinking | 0.93 | 0.08 | 0.80 | 1.00 | 2 / 5 |
| fable-5-no-thinking | 0.87 | 0.12 | 0.73 | 1.00 | 2 / 5 |

The ceiling is not 15/15 but 14/15: `14-family-steinheim` fails for every model
that does not solve the whole spec, and opus-5 fails exactly that one case in 4
of its 5 runs. Its profile is therefore the most homogeneous in the field — four
runs at 14/15, one at 15/15, nothing else.

Both Fable cells reach 15/15 more often than opus-5 (2 of 5 vs 1 of 5) and are
still ranked lower, because their remaining runs fail harder. That combination —
a higher share of perfect runs *and* a lower mean — is the signature of a
bimodal cell, not of a weaker model.

**Data basis:** n=5 per cell, all `exit_reason: ok`, all with
`experiment-done.txt` written (H4 verified on the marker file, not on
`exit_reason`).

---

## F-fable-vs-opus5.2 — The Fable Line Has a Second Failure Mode That Opus 5 Never Shows

Across all 15 runs, exactly two failure modes occur, and they are cleanly
separable:

| Failing case(s) | opus-5 | fable-5-1 | fable-5 |
|---|---:|---:|---:|
| `14-family-steinheim` alone | 4 / 5 | 2 / 5 | 1 / 5 |
| `{12-warrior-garras, 13-magus-velorin, 15-unlucky-tordan}` | **0 / 5** | 1 / 5 | 3 / 5 |
| nothing (15/15) | 1 / 5 | 2 / 5 | 2 / 5 |

The second mode is a block: those three cases fail together, all or none, never
individually. And the block is not an arbitrary set — cases 12, 13 and 15 are
**exactly the scenarios with four or more steps** in the whole 15-case suite (12
and 13 have 4 steps, 15 has 5; every other case has 1–3). One run additionally
loses `14-family-steinheim` on top of the block, giving 11/15.

This is the qualitative signal the RQ's primary-outcome caveat asked for.
`verification_pct` has roughly one bit of resolution here, so 0.87 against 0.95
is weak evidence on its own; *which* cases fail is not. opus-5 never produces the
block failure in 5 runs, fable-5 produces it in 3.

**The mechanism is not established, and the runs do not share one.** Running the
failing scenarios through the produced CLIs shows different breakage per run: one
fable-5 run emits well-formed JSON with `null` for every `payout` and
`remainingCap` while the `quote` premiums are correct; another emits no output at
all for the same input. Two candidate explanations are already ruled out — item
count (case 11 has multiple items over 2 steps and passes) and claim-step shape
(cases 10 and 15 have structurally identical claim steps, and only 15 fails). So
"long scenarios lose state" is a description of the pattern, not a diagnosis.

**Consequence for reading the quality metrics:** in the affected runs the model
built a smaller program that never handles the long scenarios. Its lower Code
Mass (APP) and lower complexity are therefore not comparable to a cell that
implements the full spec — hence the parenthesized `code_mass` in the overview.

---

## F-fable-vs-opus5.3 — Fable 5.1 Closes the Decomposition Gap to Opus 5; Fable 5 Does Not

At the ceiling, the three cells separate on decomposition rather than on
correctness — the effect H2 predicted.

| Metric (lower = better) | opus-5 | fable-5-1 | fable-5 |
|---|---:|---:|---:|
| `cc_avg_loc_per_function` | 3.45 | 3.63 | 4.79 |
| `cc_longest_function` | 13.6 | 14.4 | 17.6 |
| `cognitive_max` (Complexity Peak) | 2.8 | 2.6 | 3.2 |
| `mccabe_max` | 3.0 | 3.2 | 3.8 |
| `smell_total` (Smell Total) | 0.0 | 0.2 | 0.6 |

opus-5 and fable-5-1 are close on every axis; fable-5 is consistently the
weakest, with functions ~39 % longer on average than opus-5's and the highest
Smell Total. Complexity Peak is the one metric where fable-5-1 leads (2.6 vs
2.8), but the gap is well inside the spread and does not carry a ranking.

`smell_total` deserves separate mention because the RQ set it up as the
sharpest instrument: on claim-office in RQ-1.19 it was deterministically 0
across all four workflow cells, so any non-zero value is a real difference
rather than noise. opus-5 reproduces that 0.0 exactly (σ 0). **Both Fable cells
do not** — 0.2 and 0.6. By the RQ's own stated criterion this is a genuine
model difference, not measurement scatter, even though the absolute numbers are
small.

TDD rhythm differs without tracking quality: `cycle_count` runs 46.4 (opus-5) /
43.8 (fable-5-1) / 38.6 (fable-5), `refactorings_applied` 27.2 / 25.4 / 23.8.
All markers are healthy in all cells.

---

## F-fable-vs-opus5.4 — The CLI Bump Is Behaviourally Neutral, Except Possibly on Token Volume

H5's period control holds `opus-5-no-thinking` constant across the two CLI
versions. Read by median rather than mean, because two of these metrics carry
single-run outliers:

| Metric | 2.1.267 (n=5) | pre-bump (n=13) | reading |
|---|---:|---:|---|
| `verification_pct` | 0.95 | 0.96 | neutral |
| `smell_total` | 0.0 | 0.0 | neutral |
| `code_mass` | 848.4 | 863.8 | neutral |
| `cycle_count` | 46.4 | 45.7 | neutral |
| `duration_seconds` | 2552 | 2688 | neutral |
| `refactorings_applied` (median) | 23 | 21 | neutral |
| `total_tokens` (median) | 76.6 M | 89.0 M | **−14 %, tentative** |

**`refactorings_applied` must be read as a median here.** The means are 27.2
against 19.0, which looks like a +43 % shift, but the new arm is
[21, 22, 23, 24, **46**] — a single outlier carries the entire difference, while
the old arm's [9, 10, …] low tail depresses its mean. The medians, 23 against
21, show no effect. Mean-reading would have produced a CLI finding that the data
does not support; `refactorings_applied` is a known-noisy metric in this lab.

**`total_tokens` is the one axis that may have moved.** The new arm's maximum
(81.0 M) sits below the old arm's median (89.0 M), which overlapping ranges alone
would not produce. At n=5 against n=13 this is suggestive, not established.

So H5 holds for every axis the RQ names as load-bearing (cost in the sense of
refactor rate, quality, correctness), and findings in the v6.1 line measured
before the bump remain comparable. The token caveat is worth carrying into any
future cross-version cost claim.

**Provenance limit:** the pre-bump arm is selected via `harness_version:
unrecorded`, which means *not recorded* — the field postdates those runs. That
they are all 2.1.170 rests on their run dates, not on a measurement.

---

## F-fable-vs-opus5.5 — Fable 5.1 Is a Clear Improvement Over Fable 5 on Every Axis of This RQ

The two Fable versions were measured under identical conditions, which makes
this the cleanest generation comparison in the RQ.

| | fable-5-1 | fable-5 |
|---|---:|---:|
| `verification_pct` | 0.93 (σ 0.08) | 0.87 (σ 0.12) |
| block failure (F-fable-vs-opus5.2) | 1 / 5 runs | 3 / 5 runs |
| `cc_avg_loc_per_function` | 3.63 | 4.79 |
| `smell_total` | 0.2 | 0.6 |
| `total_tokens` | 61.3 M | 63.0 M |
| `duration_seconds` | 4042 | 4950 |

Fable 5.1 is better on correctness, on every decomposition metric, on tokens and
on wallclock, and it produces the block failure a third as often. Nothing in this
RQ favours Fable 5.

On cost the gap is far larger than on tokens — $29.44 against $76.93, a factor
of 2.6 — but that factor is a tariff, not a model property; see
F-fable-vs-opus5.7.

---

## F-fable-vs-opus5.6 — Opus 5 Is Roughly Twice as Fast as Either Fable Version

| Model | `duration_seconds` mean | σ | min | max |
|---|---:|---:|---:|---:|
| opus-5-no-thinking | 2552 | 531 | 2188 | 3471 |
| fable-5-1-no-thinking | 4042 | 212 | 3762 | 4357 |
| fable-5-no-thinking | 4950 | 3005 | 2424 | 8386 |

opus-5 finishes in ~43 min against fable-5-1's ~67 min and fable-5's ~83 min,
while doing *more* TDD cycles (46.4 vs 43.8 vs 38.6) — so the difference is
throughput per cycle, not less work.

fable-5's σ of 3005 s is the largest dispersion of any metric in this RQ: its
runs span 2424 s to 8386 s, a factor of 3.5 on identical inputs. fable-5-1 is by
far the most predictable cell (σ 212 s). For planning batch wallclock, fable-5 is
the cell that makes an ETA unreliable.

---

## F-fable-vs-opus5.7 — On This Workflow Cost Is Almost Purely a Cache-Read Tariff, Not a Model Property

| Model | cost_usd ↓ | σ | total_tokens | cache-read share |
|---|---:|---:|---:|---:|
| fable-5-1-no-thinking | **29.44** 🏆 | 2.62 | 61.3 M | ~99 % |
| opus-5-no-thinking | 42.68 | 6.48 | 72.2 M | ~99 % |
| fable-5-no-thinking | 76.93 | 4.68 | 63.0 M | ~99 % |

The v6.1 workflow is overwhelmingly cache-driven. A representative run splits as
input 108.5 k, output 162.6 k, cache-creation 460.7 k, **cache-read 60.7 M** —
98.8 % of all tokens are cache reads. `cost_usd` on this workflow is therefore,
to within about a percent, `cache_read × cache-read price`.

That makes the ranking above almost entirely a statement about three published
tariffs, not about three models:

| Model | cache-read $/MTok | multiplier on base input |
|---|---:|---|
| fable-5-1 | 0.25 | 0.025× |
| opus-5 | 0.50 | 0.1× |
| fable-5 | 1.00 | 0.1× |

Fable 5.1 and Fable 5 consume near-identical token volume (61.3 M vs 63.0 M,
a 2.7 % difference) yet differ by 2.6× in dollars, because their cache-read rates
differ by 4×. **H3 is confirmed but not tested**: the hypothesis says the tariff
asymmetry drives the cost difference, and `cost_usd` is computed *from* that
asymmetry, so the calculation cannot falsify it. What the data does add is the
empirical half — the token volumes are close enough that the tariff is the whole
story rather than being confounded with different consumption.

The one genuinely cross-model result here is opus-5: it consumes the **most**
tokens of the three (72.2 M) and is still cheaper than fable-5 ($42.68 vs
$76.93), because its whole price sheet is half of Fable's ($5/$25 base against
$10/$50, and $0.50 against $1.00 on cache reads). Token count and cost rank
differently across the model families, so neither substitutes for the other.

**These are list-price comparison values, not invoices.** All 15 runs are native
OAuth on the Max subscription, where nothing is billed per token; the transcripts
carry `cost_usd: null` because no routed charge exists, and every figure above
comes from `PRICES` in `compute-cost.py`. Long-context tariff steps are
deliberately not modelled, so the values are a consistent lower bound.
