# Findings — RQ-native-sol-workflows-sub

On the OpenAI subscription route, does a workflow line written natively for Sol
(basic-sol-tdd, Predictive TDD) beat structureless TDD (v3) — the floor that no
Opus-derived architecture clears on this model?

Data base: 30 runs, 6 cells × n=5, all `exit_reason: ok`, `completed_within_budget`
100 %, `tests_passing` 100 % in every cell. Route: OpenAI subscription
(`gpt-5-6-sol-codex`), reasoning always on (F-1.3.5).

## Übersicht

**claim-office-example-mapping** (correctness kata)

| Metric | v3 | basic-sol-tdd | basic-sol-tdd-subagent | Direction |
|---|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | 93 % | höher = besser |
| Correctness (internal) `tests_passing` | 100 % | 100 % | 100 % | höher = besser |
| `cognitive_max` | 11.4 ± 8.96 | **4.0 ± 0.63** 🏆 | 4.8 ± 2.14 | kleiner = besser |
| `cognitive_avg` | 3.40 | **2.15** 🏆 | 2.33 | kleiner = besser |
| `mccabe_max` | 9.8 | 5.4 | **5.0** 🏆 | kleiner = besser |
| Smell Total | 4.2 ± 8.40 | **0.0** 🏆 | **0.0** 🏆 | kleiner = besser |
| Complexity Peak `cc_longest_function` | 27.0 ± 10.14 | **18.0 ± 2.68** 🏆 | 18.4 ± 3.26 | kleiner = besser |
| `cc_avg_loc_per_function` | 8.45 | **6.60** 🏆 | 7.75 | kleiner = besser |
| Code Mass (APP) | 750.0 | 556.8 | 618.0 | kleiner = besser (kein 🏆 — s. Caveat) |
| `cycle_count` | n/a | 31.6 | 33.2 | — |
| `refactorings_applied` | n/a | 31.6 | **32.2** 🏆 | höher = besser |
| `predictions_correct_rate` | n/a | 98.6 % | **99.4 %** 🏆 | höher = besser |
| `duration_seconds` | **218** 🏆 | 874 | 2397 | kleiner = besser |
| `total_tokens` | **272 k** 🏆 | 4.61 M | 7.13 M | kleiner = besser |
| `cost_usd` | **$0.58** 🏆 | $3.98 | $3.59 | kleiner = besser |

**game-of-life-example-mapping** (code-quality kata)

| Metric | v3 | basic-sol-tdd | basic-sol-tdd-subagent | Direction |
|---|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | höher = besser |
| `cognitive_max` | **4.4** 🏆 | 4.6 | 5.2 | kleiner = besser |
| `cognitive_avg` | **2.67** 🏆 | 2.83 | 3.07 | kleiner = besser |
| `mccabe_max` | **4.0** 🏆 | 4.2 | 4.6 | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | kleiner = besser |
| Complexity Peak `cc_longest_function` | **11.2** 🏆 | 13.6 | 12.8 | kleiner = besser |
| `cc_avg_loc_per_function` | **6.75** 🏆 | 7.27 | 7.01 | kleiner = besser |
| Code Mass (APP) | 176.4 | 162.8 | 167.4 | kleiner = besser (kein 🏆 — s. Caveat) |
| `cycle_count` | n/a | 10.2 | 9.0 | — |
| `refactorings_applied` | n/a | **10.4** 🏆 | 9.8 | höher = besser |
| `predictions_correct_rate` | n/a | 98.1 % | **100 %** 🏆 | höher = besser |
| `duration_seconds` | **127** 🏆 | 359 | 688 | kleiner = besser |
| `total_tokens` | **153 k** 🏆 | 1.03 M | 1.74 M | kleiner = besser |
| `cost_usd` | **$0.36** 🏆 | $1.15 | $1.25 | kleiner = besser |

Caveats for reading the tables:

- **Correctness gating** on claim-office: quality/efficiency trophies go only to cells at
  `verification_pct` 100 % — v3 and the inline arm. The subagent arm's figures are reported
  but carry no trophy there (F-1.16.4).
- **`cycle_count`, `refactorings_applied` and `predictions_correct_rate` are n/a for v3**,
  not zero — v3 prescribes no phase markers. The parser's inferred `cycle_count` 3.0 / 4.6
  and `refactorings_applied` 0.4 / 0.2 are not comparable to marker-based counts and are
  omitted from the tables. See MARKERS.md, "Baseline workflows satisfy marker 4 only".
- **Code Mass gets no trophy**: APP has no notion of nesting and rewards one long function
  (metric blind spot, RQ README).
- `predictions_total` is not comparable on this line — already-green cycles carry no
  predictions by design. Only the rate is reported.

## F-1.16.1 — On claim-office the native line clears the v3 floor decisively

This is the finding the RQ was built to answer, and on the correctness kata the answer is
yes. The inline arm beats the v3 baseline on every quality metric, at equal (perfect)
correctness:

| Metric | v3 | basic-sol-tdd (inline) | Faktor | Direction |
|---|---:|---:|---:|---|
| `cognitive_max` | 11.4 | **4.0** | 2.85× | kleiner = besser |
| Complexity Peak | 27.0 | **18.0** | 1.50× | kleiner = besser |
| `cc_avg_loc_per_function` | 8.45 | **6.60** | 1.28× | kleiner = besser |
| Smell Total | 4.2 | **0.0** | — | kleiner = besser |
| Code Mass (APP) | 750.0 | **556.8** | 1.35× | kleiner = besser |

The gap is not only in the mean but in the spread: v3's `cognitive_max` σ is 8.96 against
0.63, its Complexity Peak σ 10.14 against 2.68, its Smell Total σ 8.40 against 0.00. The
v3 baseline produces one run at `cognitive_max` 29 and one at 21 smells; the native line's
worst run across five is `cognitive_max` 5 with zero smells. **The native line is both
better and predictable, where the baseline is neither.**

This is the direct counterpoint to F-1.6 in RQ-architecture-axis-sol-pi, where no
Opus-derived architecture cleared the v3 floor on Sol. It supports the second of the two
readings that finding left open: the transfer failure was a property of *that* line, not of
architecture on this model. See F-1.16.5 for what that does and does not license.

## F-1.16.2 — On game-of-life the floor holds, exactly as it did for the v-line

The kata inverts the result. All three cells reach 100 % correctness and zero smells, and
v3 wins or ties every quality metric:

| Metric | v3 | best native | Faktor | Direction |
|---|---:|---:|---:|---|
| `cognitive_max` | **4.4** | 4.6 (inline) | 1.05× | kleiner = besser |
| `cognitive_avg` | **2.67** | 2.83 (inline) | 1.06× | kleiner = besser |
| `mccabe_max` | **4.0** | 4.2 (inline) | 1.05× | kleiner = besser |
| Complexity Peak | **11.2** | 12.8 (subagent) | 1.14× | kleiner = besser |
| `cc_avg_loc_per_function` | **6.75** | 7.01 (subagent) | 1.04× | kleiner = besser |
| `cost_usd` | **$0.36** | $1.15 (inline) | 3.19× | kleiner = besser |

Every gap is inside 1 σ — this is a tie on quality, not a defeat — but the cost gap is not:
the native line pays 3.2–3.5× for it. Code Mass runs the other way (176.4 against 162.8),
which is the APP blind spot, not a counter-result.

The mechanism RQ-1.14 named for F-1.6 applies unchanged: game-of-life is small and
training-known, the spec fits in one context, and there is nothing for a TDD architecture to
protect against. **This reproduces on a line with no Opus lineage at all**, which makes it
a property of the kata-model pair rather than of the workflow family — see F-1.16.5.

## F-1.16.3 — Refactor isolation buys nothing here and costs a great deal

The two native cells differ only in where the Four Rules review runs. Across both katas the
quality difference is inside 1 σ on every metric, in both directions:

| Metric | inline | subagent | kata |
|---|---:|---:|---|
| `cognitive_max` | **4.0 ± 0.63** | 4.8 ± 2.14 | claim-office |
| `cc_avg_loc_per_function` | **6.60** | 7.75 | claim-office |
| Complexity Peak | **18.0** | 18.4 | claim-office |
| `cognitive_max` | **4.6** | 5.2 | game-of-life |
| Complexity Peak | 13.6 | **12.8** | game-of-life |
| `cc_avg_loc_per_function` | 7.27 | **7.01** | game-of-life |

The cost side is not a tie. On claim-office the subagent arm runs **2.7× longer** (2397 s
against 874 s) and consumes 1.5× the tokens; on game-of-life 1.9× longer. It also carries
the RQ's only correctness regression (F-1.16.4).

H3 (refactor isolation is the differentiator) is **not supported**: the two arms separate
from each other by far less than the inline arm separates from v3 on claim-office. Isolating
the refactor context — the one axis this pair was built to test cleanly, and which is
confounded in the v-line — does not pay on Sol.

Worth naming against F-1.6's observation that the v6.1 refactor subagent fails to extract on
Sol: with a different refactor brief (Four Rules, no APP) the subagent does now work — it
applies 32.2 refactorings per claim-office run and reaches zero smells. It simply does not
produce better code than doing the same review inline.

## F-1.16.4 — The subagent arm carries the only correctness regression

Four of five claim-office runs reach `verification_pct` 1.0; one reaches 0.67 (10/15),
pulling the cell to 0.93. It is not a technical failure: `exit_reason: ok`,
`experiment-done.txt` written, 36 own tests green, CLI built, 37 cycles, 40 refactorings.
The run worked with full discipline and still failed five scenarios —
`09-follow-up-customer`, `12-warrior-garras`, `13-magus-velorin`, `14-family-steinheim`,
`15-unlucky-tordan`. All five are the late multi-step scenarios that depend on earlier
results.

This is a spec-comprehension failure on the second half of the specification, the same
failure mode Opus-derived workflows have shown on this kata (RQ-1.9, RQ-1.10) and the
pattern F-workflow-model.2 describes for shared-context orchestration. That it appears in
the **isolated** arm and not the inline one is the opposite of the direction isolation is
supposed to help.

Per the RQ's H4, this disqualifies the subagent arm on claim-office regardless of its
quality figures. At n=5 a single run is thin evidence for a *rate*, but it is sufficient to
withhold a recommendation: the inline arm reached 5/5 on the same kata, model, route and
prompt.

## F-1.16.5 — What this does and does not settle about F-1.6

RQ-1.14 F-1.6 found no architecture clearing the v3 floor on Sol and left two readings open:
architecture does not pay on this model, or that specific Opus-derived line does not
transfer. This RQ splits the answer by kata:

- **claim-office: the lineage reading holds.** A line with no Opus ancestry clears the floor
  decisively (F-1.16.1), so "architecture does not pay on Sol" is too strong.
- **game-of-life: the model/kata reading holds.** The native line ties at best and pays 3.2×
  for it (F-1.16.2) — the same outcome the v-line produced, now without the lineage confound.

The honest synthesis is that F-1.6's conclusion was **kata-overgeneralised**, not wrong.
Where the spec is large enough to exceed what one context handles well, architecture pays on
Sol; where it is not, it is overhead — and that holds regardless of which family the
architecture comes from.

**Route caveat, binding:** this RQ ran entirely on the OpenAI subscription route, RQ-1.14
entirely on Requesty. `RQ-route-effect-pi` F-1.3.6 documents a real route effect on exactly
these metrics. The v3 rows make the size of that concern concrete — claim-office
`cognitive_max` is 11.4 here against 9.2 on Requesty, and Smell Total 4.2 against 6.8, for
the same workflow, kata, model and prompt style. Comparisons **across** the two RQs are
therefore directional at best. Every claim above is internal to this RQ, where the route is
constant.

## F-1.16.6 — The prose-prediction compliance loss did not persist

The marker smoke run showed 3 of 10 red phases in the inline arm carrying a prose-only
prediction with no `Red Phase Complete:` block, raising the concern that the retrofitted
two-line format would erode. At n=5 per cell it did not: `predictions_correct_rate` is
98.1–100 % across all four native cells, against 95.8–100 % for the v-line cells on Requesty
(RQ-1.14). The rates are pooled over 52–176 predictions per cell.

`predictions_total` is still not comparable on this line — already-green cycles carry no
predictions by design — but the *rate*, which is what the RQ compares on, is healthy. No
change to the red-phase instruction is indicated.

## Recommendation

- **claim-office-like work (large, novel spec) on Sol/subscription: `basic-sol-tdd-pi`.**
  Best or tied-best on every quality metric at 5/5 correctness, with markedly tighter spread
  than the baseline. It costs 4.0× the wallclock and 6.9× the dollars of v3 — that is the
  price of the quality and predictability gap documented in F-1.16.1.
- **game-of-life-like work (small, training-known) on Sol/subscription: `v3-basic-tdd-pi`.**
  The native line does not beat the floor and costs 3.2× more (F-1.16.2).
- **`basic-sol-tdd-subagent-pi`: not recommended on either kata.** No quality advantage over
  the inline arm anywhere, 1.9–2.7× the wallclock, and the RQ's only correctness regression
  (F-1.16.3, F-1.16.4).

## Open questions

- Does F-1.16.1 survive on the Requesty route, or is it entangled with the route effect?
  → the decisive follow-up; the claim-office cells would need re-running on `gpt-5-6-sol`.
- Is the single 0.67 run a rate or an outlier? → n=10 on the claim-office subagent cell.
- Where does the kata boundary lie between "architecture pays" and "architecture is
  overhead"? Both RQs now show the inversion but neither locates it; a mid-size kata
  (`claim-office-lite`, `sphinx-score`) would.
- Does the inline arm's advantage come from the methodology or from the removal of APP?
  → swap the v-line's APP-based refactor brief into the native line, holding architecture
  constant.
