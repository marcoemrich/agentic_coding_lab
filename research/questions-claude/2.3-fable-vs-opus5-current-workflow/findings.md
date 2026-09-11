# RQ-fable-vs-opus5 Findings

Model comparison of Opus 5 vs Fable 5.1 vs Fable 5 vs Sonnet 5 (each
no-thinking, Claude Max subscription) on
`claim-office-example-mapping × exact-hybrid-v2-testlist-fix-cc`, all cells
measured on Claude Code 2.1.267. Sonnet 5 runs on the native Direct-API route
and is labelled `sonnet-5-native` — the bare `sonnet-5` is the pi/Requesty
route and a different cell.

## Overview

Primary outcome `verification_pct` (Correctness (external), higher = better);
secondary code quality (`cc_avg_loc_per_function`/`cc_longest_function`/`cognitive_max`/`mccabe_max`/`smell_total`/`code_mass`, lower = better)
and cost (`total_tokens`/`cost_usd`/`duration_seconds`, lower = better).

| Model | n | verification_pct ↑ | σ | cc_avg_loc ↓ | cc_longest ↓ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | code_mass ↓ | total_tokens ↓ | cost_usd ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| opus-5-no-thinking | 5 | **0.95** 🏆 | 0.03 | **3.45** 🏆 | **13.6** 🏆 | 2.8 | **3.0** 🏆 | **0.0** 🏆 | 848.4 | 72.2 M | 42.68 | **2552** 🏆 |
| fable-5-1-no-thinking | 5 | **0.93** 🏆 | 0.08 | 3.63 | 14.4 | **2.6** 🏆 | 3.2 | 0.2 | **805.2** 🏆 | **61.3 M** 🏆 | **29.44** 🏆 | 4042 |
| fable-5-no-thinking | 5 | 0.87 | 0.12 | 4.79 | 17.6 | 3.2 | 3.8 | 0.6 | (659.0) | 63.0 M | 76.93 | 4950 |
| sonnet-5-native-no-thinking | 5 | 0.85 | 0.21 | 6.50 | 26.2 | 4.2 | 4.4 | 0.2 | 817.2 | 101.8 M | (23.39) | (2277) |

`verification_pct`: opus-5 (0.95) and fable-5-1 (0.93) differ by 0.02 — far
below 1 σ of either cell → both 🏆. fable-5 (0.87) and sonnet-5-native (0.85)
are not merely lower but fail *differently* (F-fable-vs-opus5.2), which is why
they are treated as behind rather than as tied.

**Correctness gating of the quality trophies:** Quality and efficiency trophies
go only to cells with mean `verification_pct` ≥ 0.90. opus-5 (0.95) and
fable-5-1 (0.93) qualify; **fable-5 (0.87) and sonnet-5-native (0.85) do not**
and therefore receive no quality or cost trophy, regardless of their raw values.
The ceiling on this kata is 14/15 = 0.93, not 15/15, because
`14-family-steinheim` fails deterministically for every model (RQ-1.19
F-1.19.4).

fable-5's `code_mass` of 659.0 is additionally **parenthesized** to mark why its
leading number must not be read as parsimony: 3 of its 5 runs silently drop an
entire class of scenarios (F-fable-vs-opus5.2), so the smaller Code Mass (APP)
is missing coverage, not economy of expression.

sonnet-5-native's `cost_usd` (23.39) and `duration_seconds` (2277) are
parenthesized for the opposite reason: both are the **best raw values in the
field**, and the gate — not the numbers — is what withholds the trophy. Unlike
fable-5's Code Mass (APP), they are not an artifact of unfinished work; both
survive restricting the cell to its three perfect runs (F-fable-vs-opus5.9).
Parentheses here mean "real, but not creditable while the cell misses the
correctness gate", and that distinction is the whole point of reading the
caveat rather than the table.

**Cost trophies are gated the same way.** `total_tokens` goes to fable-5-1
(61.3 M) ahead of opus-5 (72.2 M); `cost_usd` to fable-5-1 ($29.44) — but read
F-fable-vs-opus5.7 before quoting the dollar figures, because on this workflow
they are almost entirely a cache-read tariff, and sonnet-5-native is the proof:
it consumes the **most** tokens of any cell (101.8 M, 1.4× opus-5) and still
produces the lowest dollar figure. `duration_seconds` goes to opus-5 (2552 s),
the fastest *eligible* cell — fable-5-1 needs 1.6× and fable-5 1.9× as long.

---

## F-fable-vs-opus5.1 — Only Opus 5 and Fable 5.1 Sit at the Kata Ceiling; Perfect-Run Share Ranks Cells Backwards

On `exact-hybrid-v2-testlist-fix-cc`, **opus-5 (0.95, σ 0.03)** and **fable-5-1
(0.93, σ 0.08)** are statistically indistinguishable and both sit at the
effective ceiling of this kata. **fable-5 (0.87, σ 0.12)** and
**sonnet-5-native (0.85, σ 0.21)** are below it.

| Model | mean | σ | min | max | 15/15 runs |
|---|---:|---:|---:|---:|---:|
| opus-5-no-thinking | 0.95 | 0.03 | 0.93 | 1.00 | 1 / 5 |
| fable-5-1-no-thinking | 0.93 | 0.08 | 0.80 | 1.00 | 2 / 5 |
| fable-5-no-thinking | 0.87 | 0.12 | 0.73 | 1.00 | 2 / 5 |
| sonnet-5-native-no-thinking | 0.85 | 0.21 | 0.53 | 1.00 | **3 / 5** |

The ceiling is not 15/15 but 14/15: `14-family-steinheim` fails for every model
that does not solve the whole spec, and opus-5 fails exactly that one case in 4
of its 5 runs. Its profile is therefore the most homogeneous in the field — four
runs at 14/15, one at 15/15, nothing else.

**The perfect-run column ranks the field almost exactly backwards, and that is
the finding.** Reading down it gives 1 / 2 / 2 / **3** — sonnet-5-native
produces three flawless implementations of the whole spec where opus-5 produces
one, and still comes last on the mean. Its σ of 0.21 is seven times opus-5's.

The reason is that these cells differ in *shape*, not in level. opus-5 is
unimodal and lands in a narrow band just under the ceiling. sonnet-5-native is
sharply bimodal: three runs at 15/15, then 11/15 and 8/15, with nothing in
between. A single summary statistic cannot represent both, and the mean is the
statistic that flatters the unimodal cell.

Practical consequence: **for this cell the mean is the wrong number to plan
with.** If the question is "will one run of this produce a correct program",
sonnet-5-native answers 3 in 5 and opus-5 answers 1 in 5. If the question is
"what do I get on average without looking", the ranking inverts. Both readings
are in the table; neither alone is the cell.

**Data basis:** n=5 per cell, all `exit_reason: ok`, all with
`experiment-done.txt` written (H4 verified on the marker file, not on
`exit_reason`).

---

## F-fable-vs-opus5.2 — Three Distinct Failure Modes, Each Confined to Its Own Model Line

Across all 20 runs, exactly three failure modes occur, and no cell shows more
than one of them:

| Failing case(s) | opus-5 | fable-5-1 | fable-5 | sonnet-5-native |
|---|---:|---:|---:|---:|
| `14-family-steinheim` alone | 4 / 5 | 2 / 5 | 1 / 5 | **0 / 5** |
| `{12-warrior-garras, 13-magus-velorin, 15-unlucky-tordan}` | **0 / 5** | 1 / 5 | 3 / 5 | **0 / 5** |
| scattered premium errors (see below) | **0 / 5** | **0 / 5** | **0 / 5** | 2 / 5 |
| nothing (15/15) | 1 / 5 | 2 / 5 | 2 / 5 | 3 / 5 |

**Mode 2 — the long-scenario block (Fable line).** Cases 12, 13 and 15 fail
together, all or none, never individually, and the block is not an arbitrary
set: those are **exactly the scenarios with four or more steps** in the whole
15-case suite (12 and 13 have 4 steps, 15 has 5; every other case has 1–3). One
run additionally loses `14-family-steinheim` on top of the block, giving 11/15.
The mechanism is not established and the runs do not share one — one fable-5 run
emits well-formed JSON with `null` for every `payout` and `remainingCap` while
the `quote` premiums are correct; another emits no output at all for the same
input. Two candidate explanations are ruled out: item count (case 11 has
multiple items over 2 steps and passes) and claim-step shape (cases 10 and 15
have structurally identical claim steps, and only 15 fails). "Long scenarios
lose state" describes the pattern, it does not diagnose it.

**Mode 3 — scattered premium errors (Sonnet 5 only).** This mode is new with the
Sonnet cell and does not overlap either of the others. The two affected runs
fail different case sets — `{01, 02, 06, 10, 11, 13, 14}` and
`{09, 12, 13, 14}` — sharing only 13 and 14, and neither set is the block. It is
diagnosable, unlike mode 2, and the diagnosis is narrow:

| | expected | actual |
|---|---|---|
| `01-block-exact-three` | premium 71 | premium 88 |
| `02-block-not-four` | premium 115 | premium 116 |
| `06-dragon-material-clause` | premium 115, payout 700, cap 1300 | premium **116**, payout 700, cap 1300 |
| `11-multi-items-same-type` | premium 225, payout 2100, cap 1900 | premium **226**, payout 2100, cap 1900 |
| `12-warrior-garras` | premiums 265 / 89 | premiums 265 / **101** |
| `13-magus-velorin` | premiums 267 / 172 | premiums 267 / **198** |

**Every single mismatch in both runs is a `premium` value. Not one `payout` or
`remainingCap` is ever wrong** — including in the same response object as a
wrong premium, and including in the long scenarios that break the Fable line.
The claims engine is correct in all 10 failing cases; only the pricing
arithmetic is off.

Two sub-shapes are visible. One run is off by exactly +1 on most premiums
(116/115, 226/225, 402/401) — a rounding-direction error — plus two larger
misses. The other gets the *first* premium of a multi-step scenario right and
the *second* wrong (09: 41 ✓ / 160→175; 12: 265 ✓ / 89→101; 13: 267 ✓ /
172→198), which points at a repeat-quote discount that is under-applied rather
than at arithmetic.

**Why the modes matter more than the scores.** `verification_pct` has roughly
one bit of resolution here (RQ-1.19 F-1.19.4), so 0.85 against 0.95 is weak
evidence on its own; *which* cases fail is not. The three cells fail in three
structurally different ways, and each way is confined to one model line across
5 runs.

**Consequence for reading the quality metrics differs by mode.** In mode 2 the
model built a smaller program that never handles the long scenarios, so its
lower Code Mass (APP) and complexity are not comparable to a cell that
implements the full spec — hence the parenthesized `code_mass` for fable-5. Mode
3 carries no such discount: those programs implement the entire spec, produce
complete well-formed output for every scenario, and are merely wrong in one
arithmetic rule. sonnet-5-native's Code Mass (APP) of 817.2 is therefore
directly comparable to opus-5's 848.4, and its quality figures are not inflated
by missing work.

---

## F-fable-vs-opus5.3 — Decomposition Separates the Field Far More Sharply Than Correctness Does

The cells separate on decomposition rather than on correctness — the effect H2
predicted — and the Sonnet cell widens that separation well past anything the
frontier models show among themselves.

| Metric (lower = better) | opus-5 | fable-5-1 | fable-5 | sonnet-5-native |
|---|---:|---:|---:|---:|
| `cc_avg_loc_per_function` | 3.45 | 3.63 | 4.79 | **6.50** |
| `cc_longest_function` | 13.6 | 14.4 | 17.6 | **26.2** |
| `cognitive_max` (Complexity Peak) | 2.8 | 2.6 | 3.2 | **4.2** |
| `mccabe_max` | 3.0 | 3.2 | 3.8 | **4.4** |
| `smell_total` (Smell Total) | 0.0 | 0.2 | 0.6 | 0.2 |

opus-5 and fable-5-1 are close on every axis; fable-5 is weaker, with functions
~39 % longer on average than opus-5's and the highest Smell Total. Complexity
Peak is the one metric where fable-5-1 leads (2.6 vs 2.8), but the gap is well
inside the spread and does not carry a ranking.

**sonnet-5-native is last on four of the five axes, and not narrowly.** Its
average function is 1.9× opus-5's and its longest function 1.9× as long (26.2
against 13.6, with a σ of 11.9 and a maximum of 36). The spread between the
three frontier cells on `cc_avg_loc_per_function` is 1.34 LoC; the gap from the
best of them to sonnet-5-native is 3.05 LoC — more than twice as large as the
entire frontier spread. This is the clearest tier signal in the RQ, and it sits
on the quality axes, not the correctness axis.

**The quality deficit is not an artifact of the two broken runs.** Restricting
sonnet-5-native to its three 15/15 runs gives `cc_avg_loc_per_function` 6.52 and
`cc_longest_function` 28.7 — indistinguishable from the full-cell 6.50 / 26.2,
and if anything worse on the longest function. The correctness gate that
withholds this cell's trophies therefore hides nothing here: Sonnet 5 decomposes
worse *even when it solves the entire spec correctly*. That is the opposite of
the fable-5 situation, where the leading Code Mass (APP) number had to be
discounted because it came from unfinished work.

`smell_total` deserves separate mention because the RQ set it up as the sharpest
instrument: on claim-office in RQ-1.19 it was deterministically 0 across all
four workflow cells, so any non-zero value is a real difference rather than
noise. opus-5 reproduces that 0.0 exactly (σ 0). **The other three cells do
not** — 0.2, 0.6 and 0.2. By the RQ's own stated criterion this is a genuine
model difference, not measurement scatter, even though the absolute numbers are
small. Note that Smell Total is the one axis where sonnet-5-native is *not*
last: it ties fable-5-1 at 0.2 while being far behind on every size and
complexity measure. Smell Total counts lint-visible defects, not structure —
long functions are not smells.

TDD rhythm differs without tracking quality: `cycle_count` runs 46.4 (opus-5) /
43.8 (fable-5-1) / 41.6 (sonnet-5-native) / 38.6 (fable-5),
`refactorings_applied` 27.2 / 25.4 / 21.4 / 23.8. All markers are healthy in all
cells except the prediction axis, which is zero for fable-5-1 and
sonnet-5-native for two different parser reasons documented in the RQ README and
is not an outcome of this RQ.

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
refactor rate, quality, correctness), and findings in the hybrid-v2 line measured
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

## F-fable-vs-opus5.6 — Wallclock Splits by Model Family, Not by Capability

| Model | `duration_seconds` mean | σ | min | max |
|---|---:|---:|---:|---:|
| sonnet-5-native-no-thinking | 2277 | 563 | 1421 | 2949 |
| opus-5-no-thinking | 2552 | 531 | 2188 | 3471 |
| fable-5-1-no-thinking | 4042 | 212 | 3762 | 4357 |
| fable-5-no-thinking | 4950 | 3005 | 2424 | 8386 |

The field splits cleanly in two: sonnet-5-native and opus-5 both finish in under
43 min, the two Fable versions need 67 and 83 min. The split is by model family,
not by how well the cell does — the fastest cell (sonnet-5-native, ~38 min) and
one of the slowest (fable-5) are the two cells that miss the correctness gate,
while opus-5 and fable-5-1 sit on opposite sides of the speed divide with
near-identical correctness.

opus-5 does *more* TDD cycles than anything else (46.4 vs 43.8 / 41.6 / 38.6)
while placing second on wallclock, so its speed is throughput per cycle, not
less work. sonnet-5-native's lead is smaller than it looks for the same reason
in reverse: it is 11 % faster than opus-5 while doing 10 % fewer cycles.

fable-5's σ of 3005 s is the largest dispersion of any metric in this RQ: its
runs span 2424 s to 8386 s, a factor of 3.5 on identical inputs. fable-5-1 is by
far the most predictable cell (σ 212 s). For planning batch wallclock, fable-5 is
the cell that makes an ETA unreliable.

---

## F-fable-vs-opus5.7 — On This Workflow Cost Is Almost Purely a Cache-Read Tariff, Not a Model Property

| Model | cost_usd ↓ | σ | total_tokens | cache-read share |
|---|---:|---:|---:|---:|
| sonnet-5-native-no-thinking | (23.39) | 6.56 | **101.8 M** | ~99 % |
| fable-5-1-no-thinking | **29.44** 🏆 | 2.62 | 61.3 M | ~99 % |
| opus-5-no-thinking | 42.68 | 6.48 | 72.2 M | ~99 % |
| fable-5-no-thinking | 76.93 | 4.68 | 63.0 M | ~99 % |

The hybrid-v2 workflow is overwhelmingly cache-driven. A representative run splits as
input 108.5 k, output 162.6 k, cache-creation 460.7 k, **cache-read 60.7 M** —
98.8 % of all tokens are cache reads. `cost_usd` on this workflow is therefore,
to within about a percent, `cache_read × cache-read price`.

That makes the ranking above almost entirely a statement about four published
tariffs, not about four models:

| Model | cache-read $/MTok | multiplier on base input |
|---|---:|---|
| sonnet-5-native | 0.20 | 0.1× |
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

**sonnet-5-native is the sharpest demonstration that token count and cost are
different questions.** It consumes 101.8 M tokens — the most of any cell, 1.4×
opus-5 and 1.7× fable-5-1 — and still produces the lowest dollar figure in the
field, because its cache-read rate is the lowest ($0.20 against $0.25 / $0.50 /
$1.00). A reader who takes `cost_usd` as a proxy for "how much work did this
model make the machine do" gets the ranking exactly backwards here. This is H7
as stated: compare `total_tokens` first, `cost_usd` second, and never treat one
as a stand-in for the other.

The same point holds across the frontier cells: opus-5 consumes more tokens than
either Fable version (72.2 M) and is still cheaper than fable-5 ($42.68 vs
$76.93), because its whole price sheet is half of Fable's ($5/$25 base against
$10/$50, and $0.50 against $1.00 on cache reads).

**These are list-price comparison values, not invoices.** All 20 runs are native
OAuth on the Max subscription, where nothing is billed per token; the transcripts
carry `cost_usd: null` because no routed charge exists, and every figure above
comes from `PRICES` in `compute-cost.py`. Long-context tariff steps are
deliberately not modelled, so the values are a consistent lower bound.

Note the label: **`sonnet-5-native` is the native Direct-API route** at $2.00 /
$10.00 / $0.20. The bare `sonnet-5` used in the pi RQs is the Requesty route at
$2.20 / $11.00 / $0.22 and is a different cell — the two must not be merged in
any cost comparison.

---

## F-fable-vs-opus5.8 — Sonnet 5's Failures Are Invisible to Its Own Test Suite

Every one of the 20 runs in this RQ has `tests_passing: true`. In the two
sonnet-5-native runs that fail external verification, the model wrote a test
suite that is fully green against a program that prices claims wrongly.

| | Correctness (internal) | Correctness (external) |
|---|---|---:|
| sonnet-5-native run A | green | 8 / 15 |
| sonnet-5-native run B | green | 11 / 15 |
| all other 18 runs | green | 14–15 / 15 |

This is the divergence the two correctness metrics exist to expose, and this RQ
is the first place in the hybrid-v2 line where it opens wide. The mechanism follows
from F-fable-vs-opus5.2: the failures are premium *values*, not crashes,
missing output, or unhandled scenarios. A wrong-but-consistent pricing rule
produces a program that is internally coherent — the model derives its expected
values from the same misreading of the spec that it implements, so the tests
agree with the code and both are wrong together.

**Why this is worse than the Fable failure mode for a practitioner.** Mode 2
(the Fable long-scenario block) yields `null` payouts or no output at all — the
kind of breakage that surfaces on the first real input. Mode 3 yields a
plausible number that is off by one, or off by a discount. Nothing in the run
signals it: exit status `ok`, `experiment-done.txt` written, TDD markers
healthy, 36–48 cycles, 20–27 refactorings, full green suite.

**Consequence for the metric set.** `tests_passing` carries no discriminating
information in this RQ — it is 100 % in all four cells and would rank a cell
that prices every claim wrongly equal to one that is perfect. On a kata with an
external suite this is harmless because `verification_pct` is the primary
outcome. On the katas *without* one (`mars-rover`, and any code-quality RQ read
on game-of-life), `tests_passing` is the only correctness signal available, and
this finding shows it can be fully green on a substantively wrong program. Any
claim of the form "model X is correct on kata Y" that rests on `tests_passing`
alone should be read with that in mind.

---

## F-fable-vs-opus5.9 — The Baseline Workflow Does Not Carry Sonnet 5 to the Frontier, But Its Speed and Cost Advantage Is Real

This is the question the Sonnet cell was added to answer (H6): does the
structural scaffolding of `exact-hybrid-v2-testlist-fix-cc` — test list, phase
gates, refactor subagent — substitute for model capability?

**It does not.** sonnet-5-native lands at `verification_pct` 0.85, below the
0.90 correctness gate, and is last or near-last on every decomposition axis
(F-fable-vs-opus5.3). H6 holds.

But the result is not the flat "cheaper model is worse" the hypothesis
anticipated, and two qualifications matter for anyone acting on it.

**First, the correctness shortfall is bimodal, not uniform.** Three of five runs
solve the entire spec (F-fable-vs-opus5.1) — a higher perfect-run share than
opus-5's 1 of 5. The cell does not degrade gracefully; it either lands or misses
badly. For unattended work that is worse than a uniformly slightly-worse cell,
because the failure cannot be recognised from the run's own signals
(F-fable-vs-opus5.8). For work with human review of the output, the picture is
different.

**Second, the efficiency advantage survives the correctness gate.** Restricting
sonnet-5-native to its three perfect runs:

| | full cell (n=5) | perfect runs only (n=3) | opus-5 (n=5) |
|---|---:|---:|---:|
| `duration_seconds` | 2277 | 2105 | 2552 |
| `cost_usd` | 23.39 | 22.93 | 42.68 |
| `cc_avg_loc_per_function` | 6.50 | 6.52 | 3.45 |

The speed and cost figures barely move — those three runs are faster and cheaper
than opus-5 while implementing the whole spec. The decomposition figures also
barely move, in the other direction: the structural deficit is present in the
correct runs too. So the honest summary is **not** "cheaper but worse across the
board" — it is "as fast, at roughly half the cost, correct three times in five,
and structurally worse regardless".

The n=3 sub-cell is an observation, not a measured cell: it is selected on the
outcome, so it cannot be quoted as a cost estimate for Sonnet 5 on this workflow.
Its only job is to rule out the alternative reading — that the cost and speed
lead is an artifact of the two runs that did less work. It is not.

**What this says about the baseline recommendation.** The hybrid-v2 workflow does not
close the tier gap on this kata, so the correctness-critical recommendation
stays on the frontier models. The case for revisiting it would be a kata where
the failure mode is visible to the internal suite; that is not this one.
