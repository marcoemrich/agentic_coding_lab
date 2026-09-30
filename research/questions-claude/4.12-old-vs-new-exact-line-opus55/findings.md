# Findings — RQ-old-vs-new-exact-line-opus55

## Key result

**The retired Opus line still decomposes finer on Opus 5.5, and the subagent
step is worth keeping in that line and not in the maintained one.** The two
lines answer the isolated-Refactor question with opposite signs:

| shared context → isolated Refactor subagent | maintained PTDD line | retired Opus line |
|---|---|---|
| total tokens | 25.0 M → 55.7 M (**+123 %**) | 102.6 M → 55.3 M (**−46 %**) |
| list-price comparison | $9.96 → $28.86 (**+190 %**) | $27.86 → $20.27 (**−27 %**) |
| `duration_seconds` | 871 → 2658 (**+205 %**) | 954 → 1318 (**+38 %**) |
| `cognitive_max` | 2.0 → 2.8 | 4.0 → 2.8 |

Token and price figures in this findings file are **not** the `total_tokens` and
`cost_usd` columns of `runs.csv`. Those two count the main context only and omit
every subagent invocation, which understates the two isolated arms by 43 % and
11 % respectively — unevenly, and along exactly the factor under study. Every
number here is recomputed from the subagent transcripts as well (F-4.12.5).

Three consequences, each carried by its own finding:

- **Decomposition is a property of the line, not of the subagent** — both
  retired-line arms produce smaller functions than both PTDD arms, and the
  retired line's isolated arm reaches the field's finest median at σ = 0
  (F-4.12.1).
- **"Isolate the Refactor step" is not a transferable recommendation.** In the
  retired line it cuts tokens by 46 % and price by 27 %; in the maintained line
  it more than doubles tokens, nearly triples price and triples the wall-clock
  for no quality gain (F-4.12.2).
- **The token gap between the lines is far smaller than the Opus 5 measurement
  suggested** — 2.2× rather than 5.7×, which removes the main argument for
  keeping the retired line out of consideration on price alone (F-4.12.3).
- **The lab's token and cost columns do not count subagents at all**, which is a
  measurement defect rather than a result of this RQ, and it reverses the price
  ranking of the two isolated arms (F-4.12.5).

Correctness is saturated: all four cells sit at Correctness (external) 1.00 ± 0
with 100 % internal suites and 100 % within budget, so it carries none of this.
Scope: one kata (Claim Office), one prompt style (Example Mapping), one stack
(TypeScript), one CLI version (2.1.280), n=5 per cell.

## Overview

Cell means ± standard deviation, n=5 per cell, Claim Office / Example Mapping /
TypeScript / `opus-5-5-no-thinking` / Claude Code 2.1.280.

The four arms are the 2×2 over line and Refactor architecture. **PTDD** is the
maintained Predictive-TDD line (`exact-ptdd-v1-cc`), **PTDD+Sub** the same
contract with the per-cycle Refactor delegated to an isolated subagent
(`exact-ptdd-v1.1-refactor-subagent-cc`), **Old+Sub** the retired Opus line with
red/green shared and Refactor isolated (`exact-hybrid-v2-testlist-fix-cc`), and
**Old** its minimal shared-context variant with no subagent at all
(`exact-single-context-v3-no-subagent-cc`).

Bold + 🏆 marks the winner of a row. A trophy is shared when the gap is smaller
than the larger of the two standard deviations involved, so several trophies in a
row read as "this row does not separate". Two cells reach σ = 0, which would make
the best cell's own σ a degenerate yardstick; the larger σ is used instead.

All four cells clear the 0.90 correctness gate, so all are eligible for the
quality and efficiency trophies.

**Decomposition** — every row lower = better.

| | PTDD | PTDD+Sub | Old+Sub | Old |
|---|---:|---:|---:|---:|
| `cc_avg_loc_per_function` | 4.54 ± 0.28 | 4.42 ± 0.35 | **3.34 ± 0.22** 🏆 | **3.74 ± 0.68** 🏆 |
| `cc_median_loc_per_function` | 3.30 ± 0.45 | 3.10 ± 0.22 | **2.00 ± 0** 🏆 | **2.40 ± 0.89** 🏆 |
| `cc_longest_function` | **13.8 ± 1.79** 🏆 | **12.4 ± 2.3** 🏆 | **13.6 ± 4.1** 🏆 | **13.0 ± 2.45** 🏆 |

The split is line against line: both retired-line cells win the two
distributional rows and neither PTDD cell comes close, while `cc_longest_function` ties
four ways. Four trophies in that row mean the longest single function is the same
size everywhere (12.4–13.8 lines) — the lines differ in how they cut up the rest
of the code, not in how long their worst function is.

**Complexity and suite strength** — Mutation Score higher = better, every
complexity row lower = better.

| | PTDD | PTDD+Sub | Old+Sub | Old |
|---|---:|---:|---:|---:|
| `cognitive_max` | **2.0 ± 0** 🏆 | **2.8 ± 1.79** 🏆 | **2.8 ± 0.84** 🏆 | **4.0 ± 2.83** 🏆 |
| `cognitive_avg` | **1.36 ± 0.06** 🏆 | **1.36 ± 0.42** 🏆 | **1.38 ± 0.27** 🏆 | **1.62 ± 0.42** 🏆 |
| `mccabe_max` | **3.0 ± 0** 🏆 | **3.2 ± 0.45** 🏆 | **3.2 ± 0.45** 🏆 | **4.2 ± 1.79** 🏆 |
| `mccabe_avg` | **1.46 ± 0.10** 🏆 | **1.39 ± 0.12** 🏆 | **1.36 ± 0.10** 🏆 | **1.46 ± 0.14** 🏆 |
| Mutation Score | **0.94 ± 0.04** 🏆 | **0.95 ± 0.04** 🏆 | **0.97 ± 0.03** 🏆 | **0.96 ± 0.02** 🏆 |

Every row here ties four ways, but not for the same reason. On `cognitive_avg`,
`mccabe_avg` and Mutation Score the means genuinely sit on top of each other. On
the two peak rows they do not — `Old` means 4.0 against PTDD's 2.0 — and what
prevents separation is the spread *inside* the `Old` cell: its five runs measure
2, 2, 2, 6, 8 on `cognitive_max` and 3, 3, 3, 5, 7 on `mccabe_max`.
The shared-context retired arm is the only cell in the RQ that sometimes leaves a
function the others never leave. Read those two rows as "unstable", not as
"equal".

**Price and shape** — trophies only on the three efficiency rows, which measure
the same work under the same correctness. The shape rows have no unambiguous
direction and are context.

| | PTDD | PTDD+Sub | Old+Sub | Old |
|---|---:|---:|---:|---:|
| total tokens ↓ | **25.0 M ± 2.3 M** 🏆 | 55.7 M ± 4.6 M | 55.3 M ± 2.8 M | 102.6 M ± 23.5 M |
| list-price comparison ↓ | **$9.96 ± 0.95** 🏆 | $28.86 ± 2.54 | $20.27 ± 0.99 | $27.86 ± 5.94 |
| `duration_seconds` ↓ | **871 ± 89** 🏆 | 2658 ± 357 | 1318 ± 222 | **954 ± 173** 🏆 |
| subagent invocations | 0 | 48.0 ± 2.4 | 27.4 ± 0.9 | 0 |
| Production LoC | 237.0 ± 16.84 | 279.8 ± 48.16 | 197.4 ± 12.22 | 182.0 ± 25.17 |
| Test LoC | 266.4 ± 22.24 | 270.6 ± 12.50 | 277.4 ± 16.76 | 225.8 ± 19.02 |
| Code Mass (APP) | 642.4 ± 55.19 | 670.6 ± 21.62 | 710.8 ± 34.69 | 713.6 ± 47.13 |
| `unit_count` | 24.6 ± 1.67 | 29.2 ± 5.12 | 27.4 ± 4.28 | 24.6 ± 6.19 |
| Smell Total | 0 ± 0 | 0 ± 0 | 0.2 ± 0.45 | 0.4 ± 0.55 |
| `mutants_total` / survived | 126.2 / 8.2 | 133.4 / 7.2 | 131.8 / 4.6 | 121.4 / 4.4 |

The list-price comparison is not an invoice — nothing is billed per token on the
Max subscription. Opus 5.5 prices cache reads at 0.05× base input, so the
ranking here follows consumption rather than a tariff quirk: all four cells run
on the same model.

The two isolated arms are a **tie on total tokens** (55.7 M against 55.3 M,
inside the larger σ) and separate clearly on price ($28.86 against $20.27),
because `PTDD+Sub` spends a larger share of its tokens inside subagents, where
each fresh context pays cache *creation* at 25× the cache-read rate. The
`subagent invocations` row is the driver of both that and the wall-clock gap:
48.0 against 27.4 calls.

Two context rows deserve a note.

**Smell Total is no longer deterministically 0 on this kata.** Both PTDD cells
are exactly 0 across 10 runs; the retired line produced one smell in 1 of 5
`Old+Sub` runs and in 2 of 5 `Old` runs. All three are a single
`magic_numbers` finding — no complexity, duplication or code-quality smell
anywhere. The gaps (0.2 and 0.4) are below their own standard deviations, so this
is a directional observation, not a separation.

**`mutants_survived` runs the opposite way to Mutation Score's near-tie.** The
retired line leaves about half as many surviving mutants in absolute terms
(4.4–4.6 against 7.2–8.2) at a comparable mutant population (121.4–133.4). At
n=5 the gap sits inside the standard deviations and establishes nothing, but the
direction is consistent across both of its arms and is the reason the pair is
reported rather than the ratio alone.

## F-4.12.1 — Finer decomposition is a property of the retired line, not of its subagent

Both retired-line arms produce smaller functions than both maintained-line arms,
and the effect does not depend on whether the Refactor step is isolated.

| metric (lower = better) | PTDD | PTDD+Sub | Old+Sub | Old |
|---|---:|---:|---:|---:|
| `cc_avg_loc_per_function` | 4.54 ± 0.28 | 4.42 ± 0.35 | 3.34 ± 0.22 | 3.74 ± 0.68 |
| `cc_median_loc_per_function` | 3.30 ± 0.45 | 3.10 ± 0.22 | 2.00 ± 0 | 2.40 ± 0.89 |

The line gap is larger than the architecture gap on both rows. Within the
retired line, removing the subagent moves the mean by 0.40 (inside the 0.68
standard deviation); across the lines the smallest gap between any retired and
any maintained cell is 0.68 on the mean and 0.70 on the median, and the largest
is 1.20 and 1.30.

`Old+Sub` reaches `cc_median_loc_per_function` 2.00 with σ = 0 across five runs —
the same value the line produced on native Opus 5, where it was also σ = 0 over
18 runs. The median function in this workflow is two lines long on both models
and in every replicate.

This reproduces RQ-current-ptdd-vs-exact-opus-native F-4.9.1 on the newer model:
there the retired line measured 3.81 mean and 2.00 median against the PTDD line's
5.53 and 4.55. The absolute values moved (the PTDD line decomposes markedly
harder on Opus 5.5 than on Opus 5, RQ-opus55-current-workflow F-2.4.1) but the
ordering did not. The RQ's H1 is confirmed, with the correction that it holds for
the line rather than for the hybrid architecture specifically.

The advantage does not extend to `cc_longest_function`, which ties across all four
cells at 12.4–13.8 lines. The retired line creates more small functions; it does
not shorten the single longest one.

---

## F-4.12.2 — Isolating the Refactor step has opposite signs in the two lines

Holding the line constant and varying only the Refactor architecture produces
inverted efficiency results.

| | shared → isolated | total tokens | list-price | `duration_seconds` |
|---|---|---:|---:|---:|
| maintained PTDD line | `exact-ptdd-v1-cc` → `-v1.1-refactor-subagent-cc` | 25.0 M → 55.7 M | $9.96 → $28.86 | 871 → 2658 |
| retired Opus line | `exact-single-context-v3-no-subagent-cc` → `exact-hybrid-v2-testlist-fix-cc` | 102.6 M → 55.3 M | $27.86 → $20.27 | 954 → 1318 |

Every one of those six movements is larger than the standard deviations
involved, except the retired line's wall-clock increase (954 ± 173 → 1318 ± 222),
which is marginal.

On quality the two directions differ too, though neither reaches separation:
isolating the step raises the maintained line's `cognitive_max`
(2.0 → 2.8) and lowers the retired line's (4.0 → 2.8), landing both at the same
value from opposite sides.

The practical consequence is that the subagent decision cannot be stated as a
workflow-independent rule. In the retired line the isolated arm is the one to
take: it cuts tokens by 46 % and price by 27 % for a 38 % wall-clock penalty and
a more stable complexity profile. In the maintained line it is the one to avoid:
it adds 123 % tokens, 190 % price and 205 % wall-clock and buys nothing
measurable. RQ-opus55-current-workflow F-2.4.7 reached the same verdict for that
line, but on the uncorrected columns — its $12.89 for this arm is $28.86 once
the subagents are counted, so its conclusion holds while its number does not.
H3 is confirmed.

The mechanism is visible in the token counts rather than in the quality columns.
A shared-context refactor step re-reads the whole conversation on every cycle; an
isolated one starts from a fresh, small context and returns a diff. In the
retired line, whose Refactor emphasis drives many cycles, that saves more than
the isolation costs. In the maintained line, whose shared context is already
compact, it does not.

---

## F-4.12.3 — The retired line costs 2.0× the maintained line, not 5.7×

The price argument against the retired line is much weaker on Opus 5.5 than the
Opus 5 measurement implied.

| | total tokens | list-price | ratio against `exact-ptdd-v1-cc` |
|---|---:|---:|---|
| `exact-ptdd-v1-cc` | 25.0 M ± 2.3 M | $9.96 ± 0.95 | — |
| `exact-hybrid-v2-testlist-fix-cc` | 55.3 M ± 2.8 M | $20.27 ± 0.99 | 2.2× tokens, 2.0× price |

On native Opus 5 the same two workflows measured 83.7 M against 14.7 M tokens
and $49.13 against $11.83 — 5.7× and 4.2×
(RQ-current-ptdd-vs-exact-opus-native F-4.9.2). The RQ's H2 expected that gap to
widen; it narrowed by roughly a factor of two and a half on both axes.

Those Opus 5 figures are themselves uncorrected main-context counts, and the
hybrid arm there runs subagents while the PTDD arm does not — so the published
5.7× **understates** the true Opus 5 gap, and the narrowing measured here is at
least as large as stated rather than an artefact of correcting only one side
(F-4.12.5).

**This is a cross-RQ observation, not a controlled model contrast.** The Opus 5
cells were measured between 2026-08-10 and 2026-09-10 on Claude Code ≤ 2.1.267;
these cells are on 2.1.280, which Opus 5.5 requires. Model and CLI version move
together across that comparison, and this RQ pins `harness_version` precisely so
that its own four cells do not have that problem. The defensible claim is the
within-RQ ratio in the table; the Opus 5 figures are context for how much the
recommendation's premise has shifted, not a measured model effect.

The consequence for `research/workflow-dev/model-recommendation-matrix.md` is
that the retired line's entry cannot be dismissed on price any more. It buys the
finest decomposition in the field (F-4.12.1) for 2.0× the list price of the
default, on a kata where both reach full Correctness (external). Whether that
trade is worth making is a product decision; the "substantially more runtime and
tokens" qualifier currently attached to it is an overstatement by roughly a
factor of two and a half.

---

## F-4.12.4 — The retired line without its subagent burns the most tokens and is the least stable cell measured

`exact-single-context-v3-no-subagent-cc` is the worst arm in the RQ on token
consumption and on every stability measure.

| | value | rank among the four cells |
|---|---:|---|
| total tokens | 102.6 M ± 23.5 M | worst, 4.1× the best cell |
| list-price comparison | $27.86 ± 5.94 | second worst, 2.8× the best cell |
| `cognitive_max`, range over 5 runs | 2, 2, 2, 6, 8 | widest spread |
| `mccabe_max`, range over 5 runs | 3, 3, 3, 5, 7 | widest spread |
| Smell Total | 0.4 ± 0.55 | worst (2 of 5 runs carry one magic number) |
| `duration_seconds` | 954 ± 173 | second best |

Its standard deviations are the largest in the RQ on tokens (23.5 M against
2.8–4.6 M elsewhere), on price ($5.94 against $0.95–2.54) and on both complexity
peaks. Three of its five runs land with the field; two do not.

It is **not** the most expensive cell: `PTDD+Sub` costs $28.86 against its
$27.86, a tie inside the larger σ. The uncorrected `cost_usd` column made this
arm look like the clear worst on price at $27.86 against $12.89 — it is not, and
that reversal is F-4.12.5.

The spread is not random with respect to price. The run with the worst complexity
profile in the entire RQ (`cognitive_max` 8, `mccabe_max` 7) is also the
cell's *cheapest* run by a wide margin — 62.0 M tokens and $17.70, against
106.2–122.1 M and $28.47–33.03 for the other four (this arm runs no subagents,
so its figures need no correction). Its three well-behaved runs are
its three most expensive ones. Within this arm, spending less is where the quality
goes, which is the opposite of the parsimony reading a low token count usually
invites.

**The token figure and the wall-clock figure point in opposite directions**, and
that combination is the diagnosis. At 102.6 M tokens it consumes 1.9× what the
isolated arm does, while finishing 364 s *earlier*. It is not doing more work —
it is doing a comparable amount of work in one ever-growing context, where each
turn re-reads everything before it. Cache reads are cheap in time and not free in
price, so the cost shows up in tokens and dollars and not on the clock.

This is the cell the 2×2 was opened to measure, and it is the one that has never
been run on this kata before — on Opus 5 the arm exists only on `game-of-life`
and `sphinx-score`. Its behaviour here does not transfer from those: on
`game-of-life` / Opus 5 it consumed 21.1 M tokens against the isolated arm's
7.4 M, a 2.9× ratio at a much smaller absolute scale.

Nothing recommends this arm. It is the minimal workflow that still satisfies all
four EXACT Coding building blocks, which is what made it worth measuring; on this
kata and model it pays 2.8× the default's price for a complexity profile that is
sometimes the worst in the field.

---

## F-4.12.5 — `total_tokens` and `cost_usd` omit every subagent, which reverses the price ranking of the two isolated arms

`analyze_transcript.py` sums tokens from `transcript.jsonl` only
(`total_tokens = total_input + total_output + total_cache_read + total_cache_creation`,
line 394). Subagent consumption is aggregated separately into
`subagent_token_total` (line 865) and **never added**. `analyze-run.sh` does not
reference that field at all, so it never reaches `metrics.json`, `runs.csv`,
`summary.md` or `compute-cost.py` — which prices the run from the same
main-context-only figure.

The omission is not a constant offset. It scales with how much work the workflow
delegates:

| | main context | subagents | true total | omitted share | subagent calls |
|---|---:|---:|---:|---:|---:|
| `exact-ptdd-v1-cc` | 25.0 M | — | 25.0 M | — | 0 |
| `exact-ptdd-v1.1-refactor-subagent-cc` | 39.0 M | 16.7 M | 55.7 M | **43 %** | 48.0 |
| `exact-hybrid-v2-testlist-fix-cc` | 49.9 M | 5.4 M | 55.3 M | **11 %** | 27.4 |
| `exact-single-context-v3-no-subagent-cc` | 102.6 M | — | 102.6 M | — | 0 |

**The bias runs along exactly the factor this RQ studies**, so it does not cancel
in the comparison — it distorts it. Two published statements invert once the
subagents are counted:

| | uncorrected | corrected |
|---|---|---|
| cheaper of the two isolated arms | `PTDD+Sub` $12.89 < `Old+Sub` $14.27 | **`Old+Sub` $20.27 < `PTDD+Sub` $28.86** |
| most expensive cell in the RQ | `Old` $27.86 | **`PTDD+Sub` $28.86** (tie with `Old`) |

The two isolated arms also stop separating on tokens (55.7 M against 55.3 M,
inside the larger σ) where the uncorrected columns had them 22 % apart. What
still separates them is price, because `PTDD+Sub` puts a larger share of its
tokens inside subagents, and every fresh subagent context pays cache *creation*
at $5.00/MTok against $0.20 for a cache read.

Correction is exact rather than estimated: each `transcript-subagents/agent-*.jsonl`
carries the full per-message `usage` breakdown (`input_tokens`,
`output_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`), so
the same tariff applies to it as to the main context. Every token and price
figure in this findings file is computed that way.

`duration_seconds` is unaffected — it is `ended_at − started_at` from the run
wrapper, so it measures the whole run including subagent time. The 2658 s against
1318 s gap between the two isolated arms is therefore real, and the
`subagent invocations` row explains it: 48.0 against 27.4 fresh contexts to spin
up and feed.

**Scope beyond this RQ: 571 runs in the pool carry subagent tokens that are
missing from both columns, omitting 59.8 % of the recorded figure on average.**
The worst arms are the `exact-subagents` ones at ~201 % — their true consumption
is three times what is recorded. Any cross-arm token or price comparison that
puts a subagent arm against a shared-context arm is affected, including
RQ-opus55-current-workflow F-2.4.4 and F-2.4.7,
RQ-current-ptdd-vs-exact-opus-native F-4.9.2, and the architecture-axis RQs.
Fixing it means summing the subagent transcripts in `analyze_transcript.py`,
threading `subagent_token_total` through `analyze-run.sh`, and reanalysing those
runs — a pipeline change, not a finding.
