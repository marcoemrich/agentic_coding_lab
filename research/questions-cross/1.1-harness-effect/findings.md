# RQ-harness — Findings

## Overview

Pivot across the six cells (kata × harness). All cells: `model=opus-4-7-portkey-no-thinking`, `prompt=example-mapping`, `workflow=v6.2-with-why-cleaned{,-oc,-pi}`.

| Outcome | Direction | CC × claim (n=8) | OC × claim (n=5) | pi × claim (n=5) | CC × GOL (n=10) | OC × GOL (n=5) | pi × GOL (n=5) |
|---|---|---|---|---|---|---|---|
| `verification_pct` (mean ± σ) | higher = better | 0.96 ± 0.09 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 | **1.00** 🏆 ± 0 |
| `tests_passing` (rate) | higher = better | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `total_tokens` (mean, millions, **incl. cache**) | not comparable | 44.4 | 30.8 | 1.97 | 8.32 | 2.44 | 0.29 |
| `input+output` (mean, k tokens, **excl. cache**) | lower = better | **161** 🏆 | 468 | 1971 | **36** 🏆 | 156 | 287 |
| `cost_usd` (mean, Opus 4.7 list price) | lower = better | $30.47 | $18.80 | **$11.20** 🏆 | $6.22 | $2.26 | **$1.65** 🏆 |
| `duration_seconds` (mean) | lower = better | 2530 ± 401 | 2230 ± 952 | **1647** 🏆 ± 205 | 627 ± 117 | 516 ± 196 | **317** 🏆 ± 43 |
| `code_mass` (APP, mean) | lower = better | 879 ± 91 | 827 ± 99 | **807** 🏆 ± 16 | 153 ± 14 | **149** 🏆 ± 12 | 158 ± 13 |
| `lines_of_code` (mean) | lower = better | **255** 🏆 ± 43 | 271 ± 44 | 266 ± 39 | 41 ± 7 | **39** 🏆 ± 5 | 43 ± 7 |
| `cognitive_max` (mean) | lower = better | 5.0 ± 1.8 | 4.8 ± 3.0 | **4.2** 🏆 ± 1.6 | **4.3** 🏆 ± 2.8 | 6.2 ± 2.6 | 7.6 ± 3.1 |
| `mccabe_max` (mean) | lower = better | 4.5 ± 0.8 | 4.8 ± 1.8 | **4.0** 🏆 ± 0 | **4.2** 🏆 ± 1.3 | 5.4 ± 2.0 | 6.0 ± 2.6 |
| `cc_longest_function` (mean) | lower = better | **12.4** 🏆 ± 1.4 | 15.0 ± 7.0 | 14.6 ± 1.7 | **12.2** 🏆 ± 6.9 | 17.0 ± 5.2 | 18.2 ± 5.3 |
| `smell_total` (mean) | lower = better | 0.38 ± 0.74 | **0.20** 🏆 ± 0.45 | **0.20** 🏆 ± 0.45 | **2.40** 🏆 ± 0.52 | **2.20** 🏆 ± 0.45 | 2.40 ± 0.89 |
| `cycle_count` (mean) | context-dependent | 37.4 ± 1.6 | 33.0 ± 10.7 | 56.2 ± 10.9 | 8.5 ± 1.4 | 9.2 ± 0.8 | 8.8 ± 1.5 |
| `refactorings_applied` (mean) | higher = better | **24.9** 🏆 ± 6.9 | 19.0 ± 11.4 | 16.8 ± 2.8 | **7.9** 🏆 ± 1.9 | 5.0 ± 2.8 | 3.0 ± 0.7 |
| `predictions_correct_rate` (pooled) | higher = better | 97.2 % (599 obs) | **99.6 %** 🏆 (256) | 99.4 % (167) | **100 %** 🏆 (170) | **100 %** 🏆 (86) | 95.9 % (49) |

**Important measurement convention:** `total_tokens` is **not directly comparable** across the three harnesses, because CC and OC aggressively count prompt-cache reads in `cache_read` (40+ million per run), while pi (Portkey `openai-completions` path) reports `cache_read=0` across all runs. The comparable efficiency proxy is `input + output` (cache-adjusted) — see F-harness.2. The trophy on `total_tokens` is therefore suppressed; the trophy on `input+output` shows the actual footprint ranking.

Trophy assignment otherwise: all six cells satisfy the correctness gating rule (`verification_pct ≥ 0.95`), so efficiency and quality metrics are also assessable. The `🏆` symbol marks the best mean per row; where the spread is within ≈1 σ there may be individual close calls (e.g. `code_mass` claim: 879 vs 827 vs 807 with σ ≈ 90 → weak differentiation; `smell_total` GOL: all three at 2.2–2.4 → trophy to OC on points, effectively a tie).

---

## F-harness.1 — Correctness is harness-invariant; CC × claim-office shows slight spread

Five of six cells deliver `verification_pct` deterministically perfect (1.0 ± 0). One cell (CC × claim-office, n=8) sits at 0.96 ± 0.09 with two runs below (0.93 and 0.73, otherwise 6/8 = 1.00). H1 (correctness harness-invariant) is **confirmed** within measurement uncertainty across all three harnesses. The internal `tests_passing` view is uniformly green across all 38 runs.

| kata | harness | n | verification_pct mean | min | max | σ | perfect rate (1.00/n) |
|---|---|---:|---:|---:|---:|---:|---|
| claim-office-example-mapping | CC | 8 | 0.96 | 0.73 | 1.00 | 0.09 | 6/8 |
| claim-office-example-mapping | OC | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |
| claim-office-example-mapping | pi | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |
| game-of-life-example-mapping | CC | 10 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 10/10 |
| game-of-life-example-mapping | OC | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |
| game-of-life-example-mapping | pi | 5 | **1.00** 🏆 | 1.00 | 1.00 | 0.00 | 5/5 |

The two CC claim runs with verification < 1.0 hit 11/15 and 14/15 of the external acceptance scenarios respectively. With n=5 on the OC and pi claim side (5/5 perfect each) against a 6/8 = 0.75 perfect rate on the CC claim side, the hypothesis "OC and pi hit here with higher reliability" gains weight; but the difference in the mean stays at 4 pp and the confidence band on the CC side still includes 1.00, so this remains a plausible directional hypothesis rather than a statistically robust harness advantage.

Method caveat: a first CC attempt with `opus-4-7-portkey` (with thinking) showed a **premature-end glitch** (see F-harness.4). The no-thinking runs evaluated here are free of this pathology on all three harnesses.

---

## F-harness.2 — Token footprint and list-price cost: pi is the cheapest variant

Three measurement layers that do not all point in the same direction:

| kata | harness | n | input+output mean (k) | total_tokens mean (millions, incl. cache) | cache_read mean (millions) | cost_usd mean | duration_s mean |
|---|---|---:|---:|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | **161** 🏆 | 44.4 | ~44.2 | $30.47 (σ=2.23) | 2530 (σ=401) |
| claim-office-example-mapping | OC | 5 | 468 | 30.8 | ~30.3 | $18.80 (σ=9.12) | 2230 (σ=952) |
| claim-office-example-mapping | pi | 5 | 1971 | 1.97 | 0 | **$11.20** 🏆 (σ=1.99) | **1647** 🏆 (σ=205) |
| game-of-life-example-mapping | CC | 10 | **36** 🏆 | 8.32 | ~8.28 | $6.22 (σ=1.00) | 627 (σ=117) |
| game-of-life-example-mapping | OC | 5 | 156 | 2.44 | ~2.28 | $2.26 (σ=0.55) | 516 (σ=196) |
| game-of-life-example-mapping | pi | 5 | 287 | 0.29 | 0 | **$1.65** 🏆 (σ=0.45) | **317** 🏆 (σ=43) |

`cost_usd` is a **list-price estimate** (Opus 4.7: $5/M input, $25/M output, $0.50/M cache_read, $6.25/M cache_write) — see `experiments/compute-cost.py` and `research/model-pricing.md`. Portkey workspace tariffs may differ.

Four findings that cannot all be explained in the same direction:

1. **List-price cost: pi < OC < CC**, monotonic across both katas. On claim-office pi at $11.20 is only ~37 % of the CC cost ($30.47); on game-of-life at $1.65 only ~27 % of the CC cost ($6.22). OC sits in between in each case ($18.80 / $2.26).
2. **Cache-adjusted input/output effort reverses the ranking: CC < OC < pi.** On claim-office pi is at ~12× CC, OC at ~3× CC; on game-of-life ~8× CC vs ~4× CC. Mechanistic explanation: pi spawns a separate pi process for every refactor subagent, which loads the entire workflow context (skills + test file + implementation file + AGENTS.md) afresh — no provider session reuse. CC's `Task` tool and OC's `task` tool share the provider history better.
3. **Provider caching explains the difference between finding 1 and finding 2.** Anthropic bills cache_read at only 10 % of the input price ($0.50 vs $5.00 per 1M tokens). CC × claim-office reads 44.2 million cache tokens — at $0.50/M that alone is ~$22 just for cache reads. pi via the Portkey `openai-completions` path receives none of these caching discounts (cache_read=0 in all runs), but pays full tariff for every input token. Cache-adjusted, pi is less efficient; billed at cache tariff, pi is cheaper.
4. **Wallclock also favours pi: pi < OC < CC.** On claim-office: 27 min (pi) vs 37 min (OC) vs 42 min (CC); on game-of-life: 5 min vs 9 min vs 10 min. pi benefits from subagent processes not needing conversation synchronisation with the main run and being able to stream continuously.

**The apparent contradiction — "why is pi cheaper although CC consumes fewer tokens?"** The intuitive expectation (fewer tokens = cheaper) does not hold here, because finding 1 refers to *cache-inclusive billing* and finding 2 to the *cache-adjusted raw volume*. On claim-office pi pushes ~12× as many fresh input+output tokens through the model as CC (1971k vs 161k) and is still cheaper ($11.20 vs $30.47). Resolution: CC keeps the fresh token count low by sending the same growing conversation context through the cache again on every turn across ~37 TDD cycles — this generates 44.2 million cache_read tokens which, even at the 10 % discount tariff (~$22), exceed pi's entire full-price bill. pi does not build up this cumulative cache load (every subagent loads fresh, `cache_read=0`) and does pay full price for every token, but only once. In short: **CC buys its low raw token count with a massively repeated cache load that costs more even when discounted than pi's cache-free full-price bill.** It is not the token volume that decides, but the ratio of one-off full-price input (pi) to repeatedly re-read discounted cache (CC).

H2 (token profile differentiates) is **confirmed**, but the answer depends on the measurement layer:

- "Which harness burns the model the hardest?" → CC (most frugal cache-adjusted, the model makes fewer fresh inputs).
- "Which harness is most expensive in $?" → CC (the cache load adds up despite the discount).
- "Which harness is fastest?" → pi (subagent parallelism).
- "Which harness is best for the standard goal 'cheap and fast'?" → pi, with a clear lead in both dimensions.

Caveat: if a Portkey workspace tariff does not bill cache at the Anthropic list price, the CC cost advantage from cache may shrink or disappear. The cost_usd values shown here are the list-price baseline.

**pi caching special situation (as of 2026-05-27):** pi technically supports Anthropic prompt caching (config `api: "anthropic-messages"` + `baseUrl: "https://api.portkey.ai"` + Portkey provider header) — cache write was verified with ~3 k cache_creation tokens. Cache **read** however fails consistently: when routing to Vertex-AI Anthropic models Portkey strips the `cache_control` markers, which shows up as cache_read=0 on identical follow-up calls. Known open issue: [Portkey-AI/gateway #1579](https://github.com/Portkey-AI/gateway/issues/1579) (filed 2026-03-25, no PR). CC and OC are unaffected because they do not use the Anthropic `/v1/messages` path but direct API endpoints with `ANTHROPIC_CUSTOM_HEADERS`. The pi token/cost situation in this RQ is therefore a mixture of genuine subagent-architecture effects and a gateway caching bug. If Portkey #1579 is fixed, a re-measurement of the pi cells is indicated — pi cost would likely drop by a factor of 5–10.

> **Update on the Requesty migration (as of 2026-07):** This RQ is a **frozen Portkey snapshot** (`opus-4-7-portkey` via Portkey) and is not overwritten. The lab has since migrated to **Requesty**; the pi caching premise of this block **no longer holds** there: on Requesty pi receives `cache_read ≠ 0` depending on route/model (kimi/opus yes; glm-5-1/qwen no, because `supports_caching=false`). It also turned out that `parse_pi_transcript.py` massively undercounted main-thread token/cache consumption (only the last request instead of the sum → cache_read on one opus run 1.4 M instead of 14.5 M) — the pi token/cost numbers shown here are therefore **doubly** shaped by the Portkey era (no cache + parser undercount). The robust pi-vs-CC-vs-OC cost question is re-measured under the new **cross-harness Requesty RQ**. See memory `pi-requesty-cost-and-parser-undercount`.

---

## F-harness.3 — Code Mass (APP) is harness-invariant; mccabe/longest/cognitive vary by kata

`code_mass` (APP-weighted sum) and `lines_of_code` show no robust difference across all three harnesses within 1 σ — means lie close together on both katas (claim: 879/827/807 for CC/OC/pi; GOL: 153/149/158). H3 (Code Mass drift) **not confirmed** — the extended comparison across three harnesses makes this more robust still.

For the **complexity measures** a **kata-dependent but newly structured** picture emerges against the n=3 predecessor version:

- `mccabe_max`: pi remarkably tight on claim-office (all 5 runs exactly 4.0, σ=0). CC second (4.5), OC third (4.8). On game-of-life this reverses: CC ahead (4.2), pi worse (6.0).
- `cc_longest_function`: CC leads on both katas (12.4 claim / 12.2 GOL), pi and OC sit 2–6 points higher with large σ.
- `cognitive_max`: mixed. On claim-office pi is lowest (4.2 vs 5.0/4.8); on game-of-life it reverses (CC 4.3 vs pi 7.6).

| kata | harness | n | code_mass | cognitive_max | mccabe_max | cc_longest_function |
|---|---|---:|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | 879 (σ=91) | 5.0 (σ=1.8) | 4.5 (σ=0.8) | **12.4** 🏆 (σ=1.4) |
| claim-office-example-mapping | OC | 5 | 827 (σ=99) | 4.8 (σ=3.0) | 4.8 (σ=1.8) | 15.0 (σ=7.0) |
| claim-office-example-mapping | pi | 5 | **807** 🏆 (σ=16) | **4.2** 🏆 (σ=1.6) | **4.0** 🏆 (σ=0) | 14.6 (σ=1.7) |
| game-of-life-example-mapping | CC | 10 | 153 (σ=14) | **4.3** 🏆 (σ=2.8) | **4.2** 🏆 (σ=1.3) | **12.2** 🏆 (σ=6.9) |
| game-of-life-example-mapping | OC | 5 | **149** 🏆 (σ=12) | 6.2 (σ=2.6) | 5.4 (σ=2.0) | 17.0 (σ=5.2) |
| game-of-life-example-mapping | pi | 5 | 158 (σ=13) | 7.6 (σ=3.1) | 6.0 (σ=2.6) | 18.2 (σ=5.3) |

Mechanistically consistent: the refactor subagent on OC and pi sees only the assignment + test/impl file, not the full conversation history. On the smaller game-of-life kata this evidently leads to more concentrated but more complex code per refactor step (higher Complexity Peak). On claim-office pi is very stable with `mccabe_max=4.0` for all 5 runs — possibly because the larger kata forces the subagent to break up the logic instead of concentrating it into a single function, or because pi subagent processes consistently do "fresh" refactoring.

Direction against the n=3 predecessor version: "CC keeps complexity peaks lower" remains **plausible on game-of-life**, but has **flipped** on claim-office — pi is there either ahead or level on the three peak-complexity measures.

---

## F-harness.4 — Claude Code harness glitch: premature `end_turn` on claim-office (thinking variant)

A first RQ run with `opus-4-7-portkey` (thinking variant) showed a run that terminated at `exit_code=0`/`exit_reason=ok` after only 8 of 38 tests, without writing `experiment-done.txt` (`context_utilization_pct=12 %`, so no context limit; last assistant action: "🟢 Green Phase Complete. Proceeding to Refactor phase."). The code stayed fragmentary — external verification failed with a `TypeError` on inputs whose tests the agent never activated (`verification_pct=0.13`).

| Variant | n existing runs | premature-end frequency |
|---|---:|---:|
| `opus-4-7-portkey` (thinking) on CC × claim-office | 3 | 1/3 (n=3 too small to quantify) |
| `opus-4-7-portkey-no-thinking` on CC × claim-office | 8 | 0/8 |
| `opus-4-7-portkey-no-thinking` on CC × game-of-life | 10 | 0/10 |

In the 18 no-thinking CC runs the phenomenon occurred **not once**, nor in the 20 OC/pi runs. This is consistent with the memory note `claude-code-premature-end-turn` and suggests the pathology is coupled to thinking-token processing in the Claude Code harness (possibly: the thinking block is misinterpreted as "end of intent"). Since the RQ currently runs on `no-thinking`, the effect is not relevant to comparison findings 1–3, 5–6. For RQs that need thinking as a factor, it is a methodological caveat.

---

## F-harness.5 — TDD discipline is harness-invariant; refactor frequency falls monotonically CC → OC → pi

All three TDD discipline metrics (`cycle_count`, `refactorings_applied`, `predictions_correct_rate`) can be collected comparably for all three harnesses after parser extensions (OC: whitespace-separator regex; pi: text-marker fallback because skills on pi are auto-load documents). H4 ("`predictions_correct_rate` harness-invariant") is therefore **confirmed**: all three harnesses reach 96–100 % prediction correctness over their respective pool basis.

| kata | harness | n | cycle_count mean | refactorings_applied mean | predictions_correct / total (pooled) |
|---|---|---:|---:|---:|---|
| claim-office-example-mapping | CC | 8 | 37.4 (σ=1.6) | **24.9** 🏆 (σ=6.9) | 582 / 599 (97.2 %) |
| claim-office-example-mapping | OC | 5 | 33.0 (σ=10.7) | 19.0 (σ=11.4) | **255 / 256 (99.6 %)** 🏆 |
| claim-office-example-mapping | pi | 5 | 56.2 (σ=10.9) | 16.8 (σ=2.8) | 166 / 167 (99.4 %) |
| game-of-life-example-mapping | CC | 10 | 8.5 (σ=1.4) | **7.9** 🏆 (σ=1.9) | **170 / 170 (100 %)** 🏆 |
| game-of-life-example-mapping | OC | 5 | 9.2 (σ=0.8) | 5.0 (σ=2.8) | **86 / 86 (100 %)** 🏆 |
| game-of-life-example-mapping | pi | 5 | 8.8 (σ=1.5) | 3.0 (σ=0.7) | 47 / 49 (95.9 %) |

Three observable effects:

1. **`refactorings_applied`** shows a **monotonic ranking CC > OC > pi** on both katas. On claim-office: 24.9 → 19.0 → 16.8; on game-of-life: 7.9 → 5.0 → 3.0. pi is very tight on game-of-life at 3.0 ± 0.7 — the refactor subagent is systematically invoked less often. Mechanistically consistent with F-harness.2: pi's subagent spawn is expensive (own process per call, full context reload), so the model presumably bundles refactor work or skips it more often than with the cheaper CC/OC mechanisms.
2. **`cycle_count` on claim-office × pi**: 56.2 (σ=10.9) against ~37 (CC) and 33 (OC). On claim-office pi runs **systematically more red-phase cycles than CC/OC** — see F-harness.6 for the explanation.
3. **`predictions_correct_rate`** sits at 96–100 % for all three harnesses. Since predictions are self-reported and not an externally verified factor, the difference between 97.2 % (CC claim) and 99.4–99.6 % (OC/pi claim) is not to be read as "OC/pi is more disciplined" but as "no harness-structured influence on self-reported discipline".

Parser history: until May 2026 `analyze_transcript.py` contained only one regex for a `-`/`✅`/`❌`/`.`/`:` separator pattern. Extension in May 2026: whitespace-separated variant for OC; text-marker fallback (`## Red`/`## Green` headers) for pi, because pi skills are auto-load documents and are not written into the event stream as tool calls. CC pool values are stable across all parser iterations.

---

## F-harness.6 — pi cycle inflation on claim-office: markedly more red markers than CC/OC at the same test count

On claim-office × pi, `cycle_count` sits at 56.2 (σ=10.9, range 41–66), while CC is at 37.4 (σ=1.6) and OC at 33.0 (σ=10.7) — and that **at a comparable number of actually active tests** (CC 37.25 ± 1.67; OC 38.2 ± 2.17; pi 38.2 ± 3.96). On game-of-life the effect is absent (all three at 8.5–9.2 cycles).

| kata | harness | n | tests_total mean | cycle_count mean | cycles per test |
|---|---|---:|---:|---:|---:|
| claim-office-example-mapping | CC | 8 | 37.25 | 37.38 | ~1.00 |
| claim-office-example-mapping | OC | 5 | 38.20 | 33.00 | ~0.86 |
| claim-office-example-mapping | pi | 5 | 38.20 | **56.20** | **~1.47** |
| game-of-life-example-mapping | CC | 10 | 8.50 | 8.50 | ~1.00 |
| game-of-life-example-mapping | OC | 5 | 9.20 | 9.20 | ~1.00 |
| game-of-life-example-mapping | pi | 5 | 8.40 | 8.80 | ~1.05 |

On claim-office pi produces on average **1.47 red markers per test** — the model activates tests multiple times (e.g. revises predictions after a first failure, writes a second `## Red` section with a corrected expectation) or splits one logical test into several `## Red` phases. On game-of-life this does not happen.

Two possible mechanistic explanations, without the data distinguishing between them:

1. **AGENTS.md marker-obligation artifact**: the pi `AGENTS.md` enforces `## Red` as a marker per phase, with high severity ("MISSING OUTPUT MARKERS — The most critical failure mode on pi"). With an ambiguous spec like claim-office this could lead the model to write a second `## Red` block for the same test activation when a clarification question arises, instead of handling the clarification inline.
2. **Larger kata triggers more re-predictions**: claim-office is considerably larger (38 tests, ~300 LoC) than game-of-life (8 tests, ~40 LoC). With the larger test list and its inter-test dependencies, pi might withdraw predictions and restart more often.

Consequence for the evaluation: `cycle_count` on pi-claim is **not directly comparable** with CC/OC without normalising to `cycles_per_test`. The markdown-strict convention of the pi AGENTS.md (see memory `pi-harness-integration`) is part of the harness mechanics and cannot be removed without a workflow redesign — the cycle-inflation effect is therefore a **genuine harness effect**, not a measurement artifact.

`refactorings_applied` is **not** affected by this inflation (16.8 ± 2.8 on pi-claim is congruent with the tendency from F-harness.5: pi calls refactor less often, not more). This supports hypothesis 1: the inflation arises in red-phase marking, not in actual TDD activity.
