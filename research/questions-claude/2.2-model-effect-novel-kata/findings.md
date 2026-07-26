# RQ-model-novel Findings

Model comparison of Fable 5 vs opus-4-8-no-thinking vs opus-4-7-no-thinking vs opus-4-6-portkey-no-thinking (each no-thinking) on `claim-office-example-mapping × v4-exact-subagents`.

## Overview

Primary outcome `verification_pct` (Correctness (external), higher = better); secondary code quality (`cognitive_max`/`mccabe_max`/`smell_total`/`cc_longest_function`, lower = better) and cost (`total_tokens`/`duration_seconds`, lower = better).

| Model | n | verification_pct ↑ | σ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | total_tokens ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| fable-5-no-thinking | 5 | 0.83 | 0.10 | (4.0) | (4.2) | (0.2) | **13.4 M** 🏆 | 7826 |
| opus-5-no-thinking | 5 | 0.88 | 0.11 | **2.8** 🏆 | 3.8 | **0.2** 🏆 | 24.6 M | 5931 |
| opus-4-8-no-thinking | 5 | **0.92** 🏆 | 0.09 | 7.4 | **7.0** 🏆 | 1.2 | 31.0 M | 5264 |
| opus-4-7-no-thinking | 10 | 0.67 | 0.36 | 10.5 | 7.9 | 1.8 | 13.7 M | **3693** 🏆 |
| opus-4-6-portkey-no-thinking | 5 | **0.93** 🏆 | 0.08 | 22.2 | 10.6 | 5.6 | 15.1 M | 4416 |

`verification_pct`: 4-6 (0.93) and 4-8 (0.92) are indistinguishable within 0.1 σ → both 🏆; opus-5 (0.88) and fable-5 (0.83) are in the midfield, 4-7 (0.67) falls clearly behind. **Correctness gating of the quality trophies:** opus-5 gets the `cognitive_max` and `smell_total` trophies: with 0.88 correctness (one run 15/15, all ≥ 11/15) it delivers real, often complete implementations while achieving the lowest Complexity Peak (2.8) and Smell Total (0.2) of all correct models — clearly below opus-4-8 (7.4 / 1.2). opus-4-8 keeps the `mccabe_max` trophy (7.0). fable-5 does have equally low raw values but **deliberately receives no trophy** — at 0.83 correctness and **never a full implementation** (max 14/15) that would be misleading; the parenthesized values mark leading numbers without full correctness coverage. opus-4-7's lower complexity would be equally misleading — its bimodal distribution (runs down to 3/15) partly depresses the complexity through *incomplete* implementations.

**Cost trophies (not correctness-gated, but to be read with caution):** The `total_tokens` trophy goes to fable-5 (13.4 M, narrowly ahead of 4-7's 13.7 M) — fable-5 is the cheapest model *and* delivers 0.83 correctness while doing so (vs. 4-7's 0.67), so this is not a pure saving-by-abort effect. opus-5 is in the upper midfield at 24.6 M (below opus-4-8's 31.0 M). The `duration_s` trophy stays with 4-7 (3693 s); opus-5 is in the midfield at 5931 s, partly inflated by server-side 529 backoffs (one timeout run at 7201 s). 4-7's token value is, as before, to be read with caution (low cost with a partly aborted spec).

## F-model-novel.1 — opus-4-8 and opus-4-6 Solve claim-office Reliably, opus-5 and fable-5 in the Midfield, opus-4-7 Does Not

On v4-exact-subagents, **opus-4-8 (0.92, σ 0.09)** and **opus-4-6 (0.93, σ 0.08)** reach nearly identical, high correctness with a tight spread. opus-4-7 is clearly below at 0.67 (σ 0.36) and is bimodally distributed (4 perfect runs, 6 between 0.20–0.87). **opus-5 (0.88, σ 0.11, n=5)** and **fable-5 (0.83, σ 0.10)** are in between — above 4-7, but below the two leading models. opus-5 reaches the full implementation (15/15) in one run, the rest at 11–14/15 (one timeout run at 11/15); fable-5 reaches max 14/15 and **never 15/15**. All opus-4-8 and opus-4-6 runs are ≥ 0.80 with runs up to 15/15; opus-4-7 has no comparably consistent high cluster.

The naive expectation "newer model = monotonically better" does not hold: neither the middle model (4-7) nor the newest generation (opus-5, fable-5) is in front, but the two Opus 4 edges (4-6 and 4-8). On this novel kata with v4, opus-4-7 is the weakest of the Opus models — consistent with the RQ-regression observation that without enforced test-list completeness v4 can lose entire spec operations on opus-4-7 (for the mechanism see F-model-novel.4). **opus-5 (0.88)** does not rank at the top despite being the newest generation: it delivers the cleanest code of all correct models (see overview + the F-model-novel.6 profile) but on average does not reach the spec fidelity of 4-6/4-8 — the claim-office novel kata rewards spec completeness, not code elegance.

opus-4-8 settles the question of whether the high 4-6 correctness was merely conservative parsing: the model reaches the same correctness without paying the quality price (see F-model-novel.5). The 4-6 strength on claim-office is thereby reproducible as "spec fidelity", not as a routing or generation artifact.

Limitation: opus-4-6 runs via Portkey (n=5, of which 4 within budget — one timeout), opus-4-7 and opus-4-8 via the native API (n=10 and n=5 respectively). opus-5 runs natively (n=5, 4 within budget — one timeout due to server-side 529 backoffs, not due to model slowness). The routing difference remains a potential confound between 4-6 and the native models; between 4-7, 4-8 and opus-5 (all native) it does not exist.

## F-model-novel.2 — The Workflow × Model Interaction Is the Dominating Effect

The finding "opus-4-6 ≈ opus-4-8 ≫ opus-4-7" holds only for v4-exact-subagents. For opus-4-6 and opus-4-7 the picture reverses on v6-hybrid:

| Workflow | opus-4-7 vpct (n) | opus-4-6 vpct (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** 🏆 (5) |
| v5-exact-single-context | 0.87 (10) | 0.87 (5) |
| v6-hybrid | **1.00** 🏆 (5) | 0.68 (15) |

Neither "opus-4-7 is better" nor "opus-4-6 is better" is a tenable statement — **the workflow determines which model comes out in front**. v5 is constant independently of the model (0.87). Model comparisons without workflow control are not generalizable on novel katas.

Mechanism: v6-hybrid delegates orchestration to the model (skill invocation in the shared context) — opus-4-7 masters this, opus-4-6 loses the claim half of the spec in ~40 % of the runs (implements only quote, ignores the `claim` operation entirely, yet still `tests_passing=true` because the internal tests only cover quote). v4 gives every phase an explicit subagent prompt — opus-4-6 benefits from this structure.

opus-4-8 has so far only been collected on v4; whether it shares the workflow sensitivity of 4-6/4-7 or (as its consistently high v4 correctness suggests) is more robust across workflows is open — hypothesis in the README.

## F-model-novel.3 — Correctness Differentiates More Strongly Than Code Quality

On game-of-life (RQ-model-quality), code quality separates the models at perfect correctness. On claim-office, **correctness itself** separates the models: opus-4-7's `verification_pct` spread (0.20–1.00) is the largest model difference of the entire RQ, while all four models have internal tests 100 % green (`tests_passing` 100 % for all). External correctness therefore uncovers spec gaps that the internal tests do not see — the "harder challenge" exposes differences that were invisible on GOL. fable-5 is a good example: 100 % green tests (up to 45 tests/run) at 0.83 external correctness and never 15/15 — a green internal suite ≠ a complete spec (F-model-novel.6).

## F-model-novel.4 — A More Precise Mechanism on opus-4-7: Test-List Completeness, Not Subagent Isolation

Refines F-model-novel.2. From RQ-tdd-correctness on claim-office × opus-4-7-portkey-no-thinking (35 runs):

| Workflow | n | verification_pct | passed_immediately | Test-list completeness | shared example-mapping |
|---|---:|---:|---:|---|---|
| v4-exact-subagents | 10 | 0.67 (σ 0.36) | 17.8 | not enforced | no |
| **v4.1-testlist-scope-fix** | 5 | **0.96 (σ 0.09)** | 22.2 | "Cover every spec example" | no |
| v4.2-shared-context† | 5 | 0.71 (σ 0.41) | 14.0 | "Cover every spec example" | yes |
| v4.2.1-fake-it-green† | 2 | 0.70 | 12.0 | "Cover every spec example" | yes + green fake-it |
| v5-exact-single-context | 9 | 0.97 (σ 0.09) | **0.9** 🏆 | (single context, implicitly complete) | n/a |
| v6-hybrid | 5 | **1.00 (σ 0.00)** 🏆 | 10.0 | (single context, implicitly complete) | n/a |

`verification_pct`: higher = better; 🏆 = best value. `passed_immediately`: lower = better (discipline gain, see observation 3); 🏆 = lowest value. The bold on v4.1 marks the finding hero (it closes the v4 gap), not the column maximum.

† Workflows archived in `experiments/workflows/_archive/` (2026-05-22). Removed from the RQ-tdd-correctness frontmatter; the completed runs are retained as evidence for these findings.

**Observation 1 — v4.1 closes the v4 gap almost completely.** The only substantive difference between v4 → v4.1 is in the `test-list` subagent: the explicit obligation "Every requirement in the spec MUST produce at least one test … Every operation the spec names". Nothing else. With that, v4.1 reaches v5/v6 level on 4.7 (0.96), with a considerably tighter spread (σ 0.09 vs. 0.36).

**Observation 2 — v4.2 (additional shared example-mapping) brings no improvement over v4.1.** v4.2 inherits the test-list fix from v4.1 *and* additionally writes `example-mapping/<feature>.md`, which red and green read before each phase. Nevertheless only 0.71 — within the v4 spread and clearly below v4.1. The bimodal distribution (σ 0.41, min 0, max 1.00) suggests that the additional spec view in red/green destabilizes rather than helps. If missing spec context in the red/green subagent were the reason for the v4 weakness, v4.2 would have to be better than v4.1 — it is not.

**Observation 3 — v4.2 lowers `passed_immediately` (14.0 vs. v4.1's 22.2) without improving `verification_pct`.** The spec view in red/green evidently reduces green anticipation (fewer tests that are already green before red activates them). But this discipline gain does not translate into correctness — which is an indication that passed_immediately is a secondary mechanism, not the dominant one.

**Refined hypothesis (replaces "overly creative" for 4.7):**

On opus-4-7 the dominant failure mode in v4 is **an incomplete test list that omits an entire spec operation (e.g. `claim`)** — analogous to the documented 4.6 failure on v6 (claim half lost, F-model-novel.2). As soon as the test list is complete (v4.1), the subsequent subagent phases (red/green) are sufficiently steered by the activated tests. Additional spec context in red/green (v4.2) brings no added value and even degrades — a possible mechanism: red/green re-interpret the spec instead of orienting themselves strictly on the active test.

**Consequence for F-model-novel.2:** The actual mechanism lies in the `test-list` step. v6 is not superior on 4.7 *because* red is not a subagent, but *because* the single-context setup structurally prevents incomplete test lists.

**Resolved (2026-05-22):** Two v4.2.1 runs show verification_pct 0.73 and 0.67 — both within the v4.2 range and clearly below v4.1. passed_immediately fell to 12 (vs. v4.2: 14, v4.1: 22.2), but correctness does not benefit. The wallclock rose by ~50 % compared to v4.2 (5500s vs. 4500s), because refactor takes over more work when green only fakes (40 refactorings instead of 25.7).

**Final conclusion:** Green anticipation is NOT a second independent failure mode on 4.7 — lowering passed_immediately via fake-it is real but does not translate into correctness. **Test-list completeness (v4.1) is the only relevant workflow lever on 4.7 for claim-office correctness.** The v4.2 branch (shared context files for red/green) was discarded on 2026-05-22; the workflow definitions are archived in `experiments/workflows/_archive/`. For the consequence for future workflow designs see `research/workflow-dev/workflow-construction.md` → "Shared context files for red/green are not a correctness lever on 4.7".

## F-model-novel.5 — opus-4-8 Buys the Best Code Quality at ~2× the Token Cost

At almost the same correctness as opus-4-6 (0.92 vs 0.93), opus-4-8 delivers the best code quality of all three models: `cognitive_max` 7.4 (vs 4-6: 22.2, 4-7: 10.5), `mccabe_max` 7.0 (vs 10.6 / 7.9), `smell_total` 1.2 (vs 5.6 / 1.8). The `Complexity Peak` (`cc_longest_function`) is at 28.4, close to 4-7 (25.0) and clearly below 4-6 (50.8). opus-4-8 thereby unites the spec fidelity of 4-6 with code quality that reaches or exceeds 4-7 — the trade-off "conservatively correct (4-6) vs. clean but unreliable" from the two-model picture dissolves on the newest generation.

The price is on the cost axis: opus-4-8 consumes on average **31.0 M** `total_tokens` — about twice as much as 4-6 (15.1 M) and 4-7 (13.7 M) — and takes the longest at 5264 s (vs 4416 / 3693 s). At the same time it writes the most code (`code_mass` 820, `lines_of_code` 303 vs. 4-7: 626 / 194) at the lowest complexity per function — i.e. the extra volume is distributed over more, simpler functions, not over a few complex ones. For correctness- and quality-critical work on v4, opus-4-8 is the strongest choice; where token budget or latency binds, opus-4-6 remains the cheaper option at comparable correctness.

Limitation: n=5. The `cognitive_max` mean (7.4) is pulled up by one outlier run (18), which is at the same time the only opus-4-8 run with `verification_pct` 0.80; the remaining four are at 3–7. The highly complex outlier and the weakest correctness run therefore coincide.

## F-model-novel.6 — fable-5: The Cleanest, Most Thoroughly Tested Code — But Never the Full Spec

On claim-office, fable-5 shows an internally consistent but paradoxical profile: it writes **by far the cleanest code** of all four models and at the same time the **least spec-complete** among the usable models.

- **Quality (leading, but un-trophied):** `cognitive_max` 4.0 and `mccabe_max` 4.2 are the lowest in the RQ — about one fifth of opus-4-6 (22.2 / 10.6) and clearly below opus-4-8 (7.4 / 7.0). `cc_longest_function` 14.8 (vs. 4-8: 28.4, 4-6: 50.8) and `smell_total` 0.2 (vs. 4-8: 1.2, 4-6: 5.6) are also best values. The code is at the same time thoroughly tested (all runs `tests_passing=true`, up to 45 tests) on the most compact code base (`lines_of_code` 257.6, `code_mass` 743).
- **Correctness (midfield):** `verification_pct` 0.83 (σ 0.10, 0.73–0.93) — on average 12.4 of 15 external checks, max 14/15, **never 15/15**. fable-5 is thereby above opus-4-7 (0.67) but below opus-4-6/4-8 (~0.92). The internal tests are green but do not cover the full spec: the same "tests green, spec gappy" pattern as with opus-4-6 on v6 (F-model-novel.2) and opus-4-7 on v4 (F-model-novel.4) — but more mildly pronounced with fable-5 (no total loss of an entire operation, rather individual missing edge cases).
- **Cost:** the **cheapest model** at 13.4 M `total_tokens` (narrowly below 4-7's 13.7 M, about half as much as opus-4-8) — and unlike 4-7 not bought via a spec abort. But with 7826 s the **longest wallclock** of the RQ; one run ran into the 7200 s timeout (n_ok=4/5), and two runs experienced rate-limit backoff, which inflates the wallclock further.
- **Variable cycle granularity:** The five runs range from 7 to 46 RGR cycles (pred/cycle ratio consistently 2.0, markers healthy). fable-5 partly batches several `it.todo`s per cycle instead of strictly one per test — not a quality deficit, but a difference in TDD rhythm compared to the Opus models.

Interpretation: fable-5 visibly optimizes for code quality and test discipline but "loses" some spec breadth in doing so — it implements the covered operations cleanly and fully tested but consistently omits a few spec points (never 15/15). This is the mirror image of opus-4-8 (spec-faithful up to 15/15, but higher complexity and 2× tokens). For token-/quality-critical work with tolerance for ~10 % missing spec points, fable-5 is the cheapest and cleanest choice; where completeness is mandatory, opus-4-8/4-6 remain ahead.

**Open follow-up question:** Whether a more complete test-list step (analogous to v4.1 for 4-7, F-model-novel.4) lifts fable-5 from 0.83 to 4-8 correctness has not been collected — fable-5 has so far only been tested on v4.
