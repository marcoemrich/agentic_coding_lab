# Findings: RQ-workflow-model — Workflow × Model Interaction

Data basis: `claim-office-example-mapping`, external verification suite (`verification_pct`).
Origin: extracted from the localization RQ `research/workflow-dev/5.1-correctness-regression/`
(formerly F-regression.6), where the subagents-v1/single-context-v1/hybrid-v1 columns arose as a side finding.

## Overview

All six cells at `min_replicates` (49 `ok` runs). Correctness (external) = `verification_pct`, higher = better; `tests_passing` = share of runs with a green internal suite, higher = better. 🏆 per model column, because the RQ asks whether the winner changes with the model.

| Workflow | Correctness (external), opus-4-7 | Correctness (external), opus-4-6 | `tests_passing`, opus-4-7 | `tests_passing`, opus-4-6 |
|---|---:|---:|---:|---:|
| exact-subagents-v1-cc | 0.67 ± 0.36 (n=10) | **0.93** ± 0.08 (n=5) 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| exact-single-context-v1-cc | 0.97 ± 0.09 (n=9) | 0.87 ± 0.30 (n=5) | **100 %** 🏆 | **100 %** 🏆 |
| exact-hybrid-v1-cc | **1.00** ± 0 (n=5) 🏆 | 0.68 ± 0.33 (n=15) | **100 %** 🏆 | 87 % |

Caveats:
- **Opus 4.6 cells mix two routes.** The column is `opus-4-6-portkey-no-thinking`; one replacement run (2026-10-20, cell exact-subagents-v1-cc) uses `opus-4-6-requesty-no-thinking` (Vertex via Requesty, see README "Routing caveat — Opus 4.6") and runs on Claude Code 2.1.280 instead of 2.1.107. Its Correctness (external) of 1.00 lies inside the cell's range, but its process does not: 379 s and 6.0 M tokens against 3385–4959 s and 26–38 M for the four Portkey runs, with 13 suite invocations and 3 closed cycles for 38 tests. With n=1, route and Claude Code version cannot be told apart. No statement here rests on duration, tokens or process metrics of that cell.
- **Cost is not compared.** The Portkey runs are priced at $15 / $75 per 1M input/output tokens, the Requesty run at $5.50 / $27.50; any cost figure for the Opus 4.6 subagents cell would mix two tariffs.

## F-workflow-model.1 — subagents-v1 and hybrid-v1 Swap Places Depending on the Model

| Workflow | opus-4-7 (n) | opus-4-6 (n) |
|---|---:|---:|
| exact-subagents-v1-cc | 0.67 (10) | **0.93** (5) 🏆 |
| exact-single-context-v1-cc | 0.97 (9) | 0.87 (5) |
| exact-hybrid-v1-cc | **1.00** (5) 🏆 | 0.68 (15) |

`verification_pct`: higher = better; 🏆 per model column — the core statement is precisely that the winner changes depending on the model.

subagents-v1 and hybrid-v1 are **complementary in a model-dependent way**: exact-hybrid-v1-cc is the opus-4-7 optimum (1.00) but unstable on
opus-4-6 (0.68). exact-subagents-v1-cc is stable on opus-4-6 (0.93) but bimodal on opus-4-7
(0.67). single-context-v1 is the least model-sensitive of the three (0.97 / 0.87) — it never wins a column,
but it is also the only workflow that stays above 0.85 on both models.

There is therefore **no universally best workflow** on this axis — the choice is
model-dependent. The practice recommendation derived from this is in
`research/workflow-dev/model-recommendation-matrix.md`.

## F-workflow-model.2 — Mechanism: Orchestration Delegation vs. Explicit Subagent Prompt

exact-hybrid-v1-cc delegates orchestration to the model (skill-invocation semantics in the shared context).
opus-4-7 masters this. opus-4-6 loses the claim half of the spec in ~40 % of the runs — the model
implements only quote and ignores claim entirely (`grep "claim\|payout\|deductible"
claim-office.ts` = 0 hits, `tests_total` nevertheless 19–23 because the internal tests only cover
quote).

subagents-v1 gives every phase an explicit subagent prompt. opus-4-6 benefits from this structure,
while opus-4-7 becomes "overly creative" on subagents-v1 and more often picks the wrong reading when facing ambiguities.
