---
id: RQ-model-novel
question: "How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life?"
factors:
  model:
    - fable-5-no-thinking
    - opus-5-no-thinking
    - opus-4-8-no-thinking
    - opus-4-7-no-thinking
    - opus-4-6-portkey-no-thinking
controls:
  workflow: v4-exact-subagents
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primary: correctness (external)
  - verification_pct
  - verification_passed
  # secondary: code quality
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # context
  - tests_passing
  - tests_total
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-model-novel: Model Effect on a Novel Kata (claim-office)

## Motivation

RQ-model-quality compares 6 models on `game-of-life-example-mapping` (training-known). Result: all models reach 100 % `verification_pct` (except sonnet-4-6-no-thinking with 0.73). The kata differentiates on code quality but not on correctness — all of them "pass".

On `claim-office-example-mapping` (novel, 5 ambiguities, CLI with an external verification suite), RQ-regression has shown that opus-4-6 systematically delivers poorer spec completeness than opus-4-7: one opus-4-6 run on v6-hybrid ignored the `claim` operation entirely (implementing only `quote`), although the JSON schema example in the spec clearly specifies both.

RQ-model-novel focuses on the strongest Opus models plus Fable 5 (no-thinking, because RQ-model-quality F-model-quality.2 shows that thinking brings no consistent advantage) and gives them the harder challenge. Fable 5 is added as the newest top model in order to test whether it reaches or exceeds the high spec fidelity of opus-4-8/opus-4-6.

## Existing Data

- **opus-4-7-no-thinking × v4 × claim-office-EM**: n=10 from the RQ-workflow-tradeoff pool (mean verification_pct 0.67, bimodal: 4 perfect, 6 between 0.20–0.87)
- **opus-4-6-portkey-no-thinking × v4 × claim-office-EM**: n=5 (4 within budget, 1 timeout), mean verification_pct 0.93
- **opus-4-8-no-thinking × v4 × claim-office-EM**: n=5 collected 2026-05-29 (native API — Opus 4.8 is not yet on Portkey/Vertex; the batch ran with blanked ANTHROPIC_* env vars), mean verification_pct 0.92
- **fable-5-no-thinking × v4 × claim-office-EM**: n=5 collected 2026-06-10/11 (mean verification_pct 0.83, σ 0.10, 0.73–0.93; 4/5 within budget, 1 timeout). Native API (Fable 5 is not yet on Portkey/Vertex; batch with blanked ANTHROPIC_* env vars, native OAuth). Requires Claude Code CLI ≥ 2.1.170.
- **opus-5-no-thinking × v4 × claim-office-EM**: to be newly collected (n=5). Native (`claude-opus-5`, list price $5/$25) via the native bypass in `run-batch.sh` that has been really implemented since 2026-07. Previously the comment only described the env blanking — the older fable-5/opus-4-8 native runs above may in fact have gone via the Requesty route (routing caveat).

## Open Hypotheses

- **H4 (opus-4-8 workflow robustness)**: opus-4-8 has so far only been collected on v4. Does it share the workflow sensitivity of 4-6/4-7 (F-model-novel.2), or is it — as its consistently high v4 correctness suggests — more robust across workflows? A re-check would need opus-4-8 × {v5, v6-hybrid} × claim-office-EM, n≥5.

## Hypotheses

- **H1 (model capability gap on spec completeness)**: opus-4-6 has significantly lower `verification_pct` than opus-4-7 — confirming the RQ-regression observation "implements only half the spec" as a model-specific deficit.
- **H2 (code-quality gap persists)**: opus-4-6 has higher complexity metrics (cognitive_max, mccabe_max), consistent with RQ-model-quality F-model-quality.3 (~2× on GOL).
- **H3 (correctness is the harder axis)**: On claim-office, `verification_pct` differentiates the models more strongly than any code-quality metric — the "harder challenge" exposes differences that were invisible on GOL.
