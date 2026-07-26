---
id: RQ-workflow-model
question: "Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model?"
factors:
  workflow:
    - v4-exact-subagents
    - v5-exact-single-context
    - v6-hybrid
  model:
    - opus-4-7-no-thinking
    - opus-4-6-portkey-no-thinking
controls:
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  - verification_pct
  - verification_passed
  - tests_passing
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-workflow-model: Workflow × Model Interaction — Is There a Universally Best Workflow?

## Motivation

Workflow development (see `research/workflow-dev/`) mostly optimizes TDD workflows on
*one* model (`opus-4-7-no-thinking`). This RQ asks the generic question behind that: is the
measured workflow quality transferable to other models at all, or is it model-specific?

The finding has direct consequences for the practice of agentic coding: if workflows are
model-dependent, there is no universal "best" workflow recommendation — the choice must be
aligned with the model in use. The recommendation matrix derived from this lives in
`research/workflow-dev/model-recommendation-matrix.md`.

The data comes from the correctness measurement on `claim-office-example-mapping` (novel kata,
external verification suite). The three workflows cover the architecture axis: v4 (all phases
isolated subagents), v5 (everything single-context), v6 (hybrid: red/green shared, refactor isolated).

## Hypotheses

- **H1 (model-dependent):** The ranking of the workflows on `verification_pct` is not stable across both
  models — at least one workflow pair swaps places.
- **H2 (mechanism):** v6-hybrid delegates orchestration to the model (skill invocation in the
  shared context) and benefits from stronger models; v4 gives every phase an explicit
  subagent prompt and supports weaker models.

## Expected Result Pattern

If H1 holds: v6 is on top on the stronger model, v4 on the weaker one — the workflow recommendation is
then necessarily model-dependent. If not: one workflow dominates across both models, and the
recommendation can be given independently of the model.

## Related RQs

- Localization of the correctness regression in the v6.5 chain (from which this finding originates):
  `research/workflow-dev/5.1-correctness-regression/` (F-regression.1–F-regression.5, F-regression.7, F-regression.8).
- Model effect on a novel kata in general: `research/questions/2.2-model-effect-novel-kata/`.
- Derived practice recommendation: `research/workflow-dev/model-recommendation-matrix.md`.
