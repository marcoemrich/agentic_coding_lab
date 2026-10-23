# RQ-model-novel Findings

Model comparison of fable-5 vs opus-5 vs opus-4-8 vs opus-4-7 vs opus-4-6-portkey (each no-thinking) on `claim-office-example-mapping × exact-subagents-v1-cc`.

## Overview

Primary outcome `verification_pct` (Correctness (external), higher = better); secondary code quality (`cognitive_max`/`mccabe_max`/`smell_total`/`longest_function`, lower = better) and cost (`total_tokens`/`duration_seconds`, lower = better).

| Model | n | verification_pct ↑ | σ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | total_tokens ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| fable-5-no-thinking | 5 | 0.84 | 0.09 | 3.6 | 3.8 | 0.2 | 45.3 M ± 19.8 | 7267 |
| opus-5-no-thinking | 5 | **0.92** 🏆 | 0.07 | **2.6** 🏆 | **3.6** 🏆 | **0.2** 🏆 | 61.4 M ± 13.0 | 5249 |
| opus-4-8-no-thinking | 5 | **0.92** 🏆 | 0.09 | 7.4 | 7.0 | 1.2 | 62.0 M ± 8.8 | 5264 |
| opus-4-7-no-thinking | 10 | 0.67 | 0.36 | 10.5 | 7.9 | 1.8 | 36.1 M ± 7.9 | 3693 |
| opus-4-6-portkey-no-thinking ³ | 5 | **0.93** 🏆 | 0.08 | 25.0 | 13.4 | 7.0 | **26.9 M ± 12.4** 🏆 | **3411** 🏆 |

`verification_pct`: 4-6 (0.93), opus-5 (0.92) and 4-8 (0.92) are indistinguishable, all three within one σ → three 🏆. fable-5 (0.84) is in the midfield, 4-7 (0.67) falls clearly behind.

**Correctness gating (≥ 0.90) applies to every quality and cost column.** Eligible are opus-4-6, opus-5 and opus-4-8. A trophy is shared when the gap to the best value is smaller than the smaller σ of the two cells.
- **Quality:** opus-5 takes `cognitive_max` (2.6), `mccabe_max` (3.6) and Smell Total (0.2) alone — each gap to opus-4-8 (7.4 / 7.0 / 1.2) exceeds opus-5's σ. opus-4-6 is the most complex eligible cell (25.0 / 13.4 / 7.0). fable-5 matches opus-5 on Smell Total and comes close on the complexity columns, but sits below the gate at 0.84 and **never reaches a full implementation** (max 14/15). opus-4-7's low values come partly from *incomplete* implementations (bimodal, runs down to 3/15).
- **Cost:** opus-4-6 is the cheapest and fastest eligible cell (26.9 M `total_tokens`, 3411 s). Its lead does not rest on the replacement run³: the four Portkey runs alone average 32.1 M and 4170 s, still clearly below opus-5 (61.4 M, 5249 s) and opus-4-8 (62.0 M, 5264 s). opus-4-7 (36.1 M, 3693 s) is cheap too but gated out. fable-5 carries the largest token spread in the field (σ 19.8) and the longest wallclock (7267 s).

³ One of the five opus-4-6 runs is a replacement on the Requesty route (`opus-4-6-requesty-no-thinking`, see README "Routing caveat — Opus 4.6"). Its correctness (15/15) is in the cell's range, its process is not: 379 s, 6.0 M tokens and 13 suite invocations with 3 closed cycles for 38 tests, against 3385–4959 s and 26–38 M tokens for the four Portkey runs. Those ran on Claude Code 2.1.107, the replacement on 2.1.280, so route and harness version change together and cannot be separated at n=1. It pulls the cell's duration and token means down and widens their σ; read the cost columns of this cell with that in mind.

The token figures were re-derived after the subagent-token correction
([RQ-old-vs-new-exact-line-opus55 F-4.12.5](../4.12-old-vs-new-exact-line-opus55/findings.md)).
`exact-subagents-v1-cc` isolates all four phases, so every cell was recorded
short, and **not by the same factor**: 2.3× for opus-4-6 against 3.3× for
fable-5, because the models differ in how much they delegate.

## F-model-novel.1 — opus-4-6, opus-4-8 and opus-5 Solve claim-office Reliably, fable-5 in the Midfield, opus-4-7 Does Not

On exact-subagents-v1-cc, **opus-4-6 (0.93, σ 0.08)**, **opus-5 (0.92, σ 0.07)** and **opus-4-8 (0.92, σ 0.09)** reach nearly identical, high correctness with a tight spread. opus-4-7 is clearly below at 0.67 (σ 0.36) and is bimodally distributed (4 perfect runs, 6 between 0.20–0.87). **fable-5 (0.84, σ 0.09)** is in between — above 4-7, below the leading three. opus-5 reaches the full implementation (15/15) in one run, 14/15 in three and 12/15 in one; fable-5 reaches max 14/15 and **never 15/15**. All runs of the three leading models are ≥ 0.80, each cell with runs up to 15/15; opus-4-7 has no comparably consistent high cluster.

The naive expectation "newer model = monotonically better" does not hold: the middle model (4-7) is the weakest Opus here, and fable-5, the newest generation alongside opus-5, stays in the midfield. On this novel kata with subagents-v1, opus-4-7's weakness is consistent with the RQ-regression observation that without enforced test-list completeness subagents-v1 can lose entire spec operations on opus-4-7 (for the mechanism see F-model-novel.4). **opus-5 joins the top group** and at the same time delivers the cleanest code of all eligible cells (see overview) — it is the one cell that combines 4-6/4-8 spec fidelity with fable-5-level code quality.

opus-4-8 settles the question of whether the high 4-6 correctness was merely conservative parsing: the model reaches the same correctness without paying the quality price (see F-model-novel.5). The 4-6 strength on claim-office is thereby reproducible as "spec fidelity", not as a routing or generation artifact.

Limitation: opus-4-6 runs via Portkey (n=4) plus one replacement run via Requesty (both Anthropic on Vertex, see overview note ³); opus-4-7, opus-4-8, opus-5 and fable-5 run via the native API (n=10, 5, 5 and 5). The routing difference remains a potential confound between 4-6 and the native models; between the native cells it does not exist.

## F-model-novel.2 — The Workflow × Model Interaction Is the Dominating Effect

The finding "opus-4-6 ≈ opus-4-8 ≫ opus-4-7" holds only for exact-subagents-v1-cc. For opus-4-6 and opus-4-7 the picture reverses on exact-hybrid-v1-cc:

| Workflow | opus-4-7 vpct (n) | opus-4-6 vpct (n) |
|---|---:|---:|
| exact-subagents-v1-cc | 0.67 (10) | **0.93** 🏆 (5) |
| exact-single-context-v1-cc | 0.87 (10) | 0.87 (5) |
| exact-hybrid-v1-cc | **1.00** 🏆 (5) | 0.68 (15) |

Neither "opus-4-7 is better" nor "opus-4-6 is better" is a tenable statement — **the workflow determines which model comes out in front**. single-context-v1 is constant independently of the model (0.87). Model comparisons without workflow control are not generalizable on novel katas.

Mechanism: exact-hybrid-v1-cc delegates orchestration to the model (skill invocation in the shared context) — opus-4-7 masters this, opus-4-6 loses the claim half of the spec in ~40 % of the runs (implements only quote, ignores the `claim` operation entirely, yet still `tests_passing=true` because the internal tests only cover quote). subagents-v1 gives every phase an explicit subagent prompt — opus-4-6 benefits from this structure.

opus-4-8 has so far only been collected on subagents-v1; whether it shares the workflow sensitivity of 4-6/4-7 or (as its consistently high subagents-v1 correctness suggests) is more robust across workflows is open — hypothesis in the README.

## F-model-novel.3 — Correctness Differentiates More Strongly Than Code Quality

On game-of-life (RQ-model-quality), code quality separates the models at perfect correctness. On claim-office, **correctness itself** separates the models: opus-4-7's `verification_pct` spread (0.20–1.00) is the largest model difference of the entire RQ, while all five models have internal tests 100 % green (`tests_passing` 100 % for all). External correctness therefore uncovers spec gaps that the internal tests do not see — the "harder challenge" exposes differences that were invisible on GOL. fable-5 is a good example: 100 % green tests (up to 45 tests/run) at 0.84 external correctness and never 15/15 — a green internal suite ≠ a complete spec (F-model-novel.6).

## F-model-novel.4 — A More Precise Mechanism on opus-4-7: Test-List Completeness, Not Subagent Isolation

Refines F-model-novel.2. From RQ-tdd-correctness on claim-office × opus-4-7-portkey-no-thinking (35 runs):

| Workflow | n | verification_pct | passed_immediately | Test-list completeness | shared example-mapping |
|---|---:|---:|---:|---|---|
| exact-subagents-v1-cc | 10 | 0.67 (σ 0.36) | 17.8 | not enforced | no |
| **exact-subagents-v2-testlist-fix-cc** | 5 | **0.96 (σ 0.09)** | 22.2 | "Cover every spec example" | no |
| exact-subagents-v2.1-shared-context-cc† | 5 | 0.71 (σ 0.41) | 14.0 | "Cover every spec example" | yes |
| exact-subagents-v2.1.1-fake-it-green-cc† | 2 | 0.70 | 12.0 | "Cover every spec example" | yes + green fake-it |
| exact-single-context-v1-cc | 9 | 0.97 (σ 0.09) | **0.9** 🏆 | (single context, implicitly complete) | n/a |
| exact-hybrid-v1-cc | 5 | **1.00 (σ 0.00)** 🏆 | 10.0 | (single context, implicitly complete) | n/a |

`verification_pct`: higher = better; 🏆 = best value. `passed_immediately`: lower = better (discipline gain, see observation 3); 🏆 = lowest value. The bold on subagents-v2 marks the finding hero (it closes the subagents-v1 gap), not the column maximum.

† Workflows archived in `experiments/workflows/_archive/` (2026-05-22). Removed from the RQ-tdd-correctness frontmatter; the completed runs are retained as evidence for these findings.

**Observation 1 — subagents-v2 closes the subagents-v1 gap almost completely.** The only substantive difference between subagents-v1 → subagents-v2 is in the `test-list` subagent: the explicit obligation "Every requirement in the spec MUST produce at least one test … Every operation the spec names". Nothing else. With that, subagents-v2 reaches single-context-v1/hybrid-v1 level on 4.7 (0.96), with a considerably tighter spread (σ 0.09 vs. 0.36).

**Observation 2 — subagents-v2.1 (additional shared example-mapping) brings no improvement over subagents-v2.** subagents-v2.1 inherits the test-list fix from subagents-v2 *and* additionally writes `example-mapping/<feature>.md`, which red and green read before each phase. Nevertheless only 0.71 — within the subagents-v1 spread and clearly below subagents-v2. The bimodal distribution (σ 0.41, min 0, max 1.00) suggests that the additional spec view in red/green destabilizes rather than helps. If missing spec context in the red/green subagent were the reason for the subagents-v1 weakness, subagents-v2.1 would have to be better than subagents-v2 — it is not.

**Observation 3 — subagents-v2.1 lowers `passed_immediately` (14.0 vs. subagents-v2's 22.2) without improving `verification_pct`.** The spec view in red/green evidently reduces green anticipation (fewer tests that are already green before red activates them). But this discipline gain does not translate into correctness — which is an indication that passed_immediately is a secondary mechanism, not the dominant one.

**Refined hypothesis (replaces "overly creative" for 4.7):**

On opus-4-7 the dominant failure mode in subagents-v1 is **an incomplete test list that omits an entire spec operation (e.g. `claim`)** — analogous to the documented 4.6 failure on hybrid-v1 (claim half lost, F-model-novel.2). As soon as the test list is complete (subagents-v2), the subsequent subagent phases (red/green) are sufficiently steered by the activated tests. Additional spec context in red/green (subagents-v2.1) brings no added value and even degrades — a possible mechanism: red/green re-interpret the spec instead of orienting themselves strictly on the active test.

**Consequence for F-model-novel.2:** The actual mechanism lies in the `test-list` step. hybrid-v1 is not superior on 4.7 *because* red is not a subagent, but *because* the single-context setup structurally prevents incomplete test lists.

**Resolved (2026-05-22):** Two subagents-v2.1.1 runs show verification_pct 0.73 and 0.67 — both within the subagents-v2.1 range and clearly below subagents-v2. passed_immediately fell to 12 (vs. subagents-v2.1: 14, subagents-v2: 22.2), but correctness does not benefit. The wallclock rose by ~50 % compared to subagents-v2.1 (5500s vs. 4500s), because refactor takes over more work when green only fakes (40 refactorings instead of 25.7).

**Final conclusion:** Green anticipation is NOT a second independent failure mode on 4.7 — lowering passed_immediately via fake-it is real but does not translate into correctness. **Test-list completeness (subagents-v2) is the only relevant workflow lever on 4.7 for claim-office correctness.** The subagents-v2.1 branch (shared context files for red/green) was discarded on 2026-05-22; the workflow definitions are archived in `experiments/workflows/_archive/`. For the consequence for future workflow designs see `research/workflow-dev/workflow-construction.md` → "Shared context files for red/green are not a correctness lever on 4.7".

## F-model-novel.5 — opus-4-8 Buys the Best Code Quality at ~2× the Token Cost

At almost the same correctness as opus-4-6 (0.92 vs 0.93), opus-4-8 delivers the best code quality of the three Opus 4 models: `cognitive_max` 7.4 (vs 4-6: 25.0, 4-7: 10.5), `mccabe_max` 7.0 (vs 13.4 / 7.9), Smell Total 1.2 (vs 7.0 / 1.8). `longest_function` is at 28.4, close to 4-7 (25.0) and clearly below 4-6 (58.2). opus-4-8 thereby unites the spec fidelity of 4-6 with code quality that reaches or exceeds 4-7 — the trade-off "conservatively correct (4-6) vs. clean but unreliable" dissolves on the newer generation.

The price is on the cost axis: opus-4-8 consumes on average **62.0 M** `total_tokens` — about 2.3× as much as 4-6 (26.9 M; 32.1 M on the four Portkey runs alone, see overview note ³) and 1.7× as much as 4-7 (36.1 M) — and takes 5264 s (vs 3411 / 3693 s). At the same time it writes more code than the older models (Code Mass (APP) 820.2, `lines_of_code` 303.2 vs. 4-7: 625.9 / 194.3) at low complexity per function — the extra volume is distributed over more, simpler functions, not over a few complex ones. opus-5 matches opus-4-8 on correctness (0.92) and token use (61.4 M) and beats it on every complexity column (`cognitive_max` 2.6, `mccabe_max` 3.6, Smell Total 0.2), so for correctness- and quality-critical work on subagents-v1 opus-5 is now the strongest choice; where token budget or latency binds, opus-4-6 remains the cheaper option at comparable correctness.

Limitation: n=5. The `cognitive_max` mean (7.4) is pulled up by one outlier run (18), which is at the same time the only opus-4-8 run with `verification_pct` 0.80; the remaining four are at 3–7. The highly complex outlier and the weakest correctness run therefore coincide.

## F-model-novel.6 — fable-5: The Cleanest, Most Thoroughly Tested Code — But Never the Full Spec

On claim-office, fable-5 shows an internally consistent but paradoxical profile: it writes **clean code close to the best in the RQ** and at the same time is the **least spec-complete** among the usable models.

- **Quality (near the top, un-trophied):** `cognitive_max` 3.6 and `mccabe_max` 3.8 are second only to opus-5 (2.6 / 3.6) — about one seventh and one third of opus-4-6 (25.0 / 13.4) and clearly below opus-4-8 (7.4 / 7.0). `longest_function` 13.0 is the lowest in the RQ (opus-5: 13.4, 4-8: 28.4, 4-6: 58.2), Smell Total 0.2 ties with opus-5. The code is at the same time thoroughly tested (all runs `tests_passing=true`, up to 45 tests) on a compact code base (`lines_of_code` 265.8, Code Mass (APP) 770.4, below opus-5's 335.2 / 875.4). No trophy, because the cell sits below the 0.90 correctness gate.
- **Correctness (midfield):** `verification_pct` 0.84 (σ 0.09, 0.73–0.93) — on average 12.6 of 15 external checks, max 14/15, **never 15/15**. fable-5 is thereby above opus-4-7 (0.67) but below opus-4-6/opus-5/4-8 (0.92–0.93). The internal tests are green but do not cover the full spec: the same "tests green, spec gappy" pattern as with opus-4-6 on hybrid-v1 (F-model-novel.2) and opus-4-7 on subagents-v1 (F-model-novel.4) — but more mildly pronounced with fable-5 (no total loss of an entire operation, rather individual missing edge cases).
- **Cost:** mid-field at 45.3 M `total_tokens` (above opus-4-6's 26.9 M and 4-7's 36.1 M, below opus-5's 61.4 M and opus-4-8's 62.0 M), with the **largest token spread of the RQ** at σ 19.8. And with 7267 s the **longest wallclock** of the RQ; one run took 12394 s including rate-limit backoff, which inflates the mean. Cost is therefore not an argument for this model here: it is neither the cheapest nor the most predictable, and it is the slowest.
- **Variable cycle granularity:** The runs with legacy cycle markers range from 7 to 46 RGR cycles (pred/cycle ratio consistently 2.0, markers healthy). fable-5 partly batches several `it.todo`s per cycle instead of strictly one per test — not a quality deficit, but a difference in TDD rhythm compared to the Opus models.

Interpretation: fable-5 visibly optimizes for code quality and test discipline but "loses" some spec breadth in doing so — it implements the covered operations cleanly and fully tested but consistently omits a few spec points (never 15/15). This is the mirror image of opus-4-8 (spec-faithful up to 15/15, but higher complexity and 1.4× tokens). opus-5 removes the trade-off on this kata: the same code quality at 0.92 correctness, for 1.4× fable-5's tokens. Where completeness is mandatory, opus-5/4-8/4-6 are ahead, and where the token budget binds, opus-4-6 leads outright.

**Open follow-up question:** Whether a more complete test-list step (analogous to subagents-v2 for 4-7, F-model-novel.4) lifts fable-5 from 0.84 to the 0.92 of the leading cells has not been collected — fable-5 has so far only been tested on subagents-v1.
