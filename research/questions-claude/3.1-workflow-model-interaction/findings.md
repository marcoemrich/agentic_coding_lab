# Findings: RQ-workflow-model — Workflow × Model Interaction

Data basis: `claim-office-example-mapping`, external verification suite (`verification_pct`).
Origin: extracted from the localization RQ `research/workflow-dev/5.1-correctness-regression/`
(formerly F-regression.6), where the subagents-v1/single-context-v1/hybrid-v1 columns arose as a side finding.

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
