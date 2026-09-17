---
id: RQ-audit-bundle-claim-office
question: "Does the RQ-1.8 result (the audit bundle stabilizes discipline and is code-quality-neutral on the hybrid-v4 base × game-of-life) generalize to the novel claim-office kata, or does the pattern flip there as it already did for reductions in RQ-1.4?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v4-cleaned-cc, prompt: example-mapping}  # Baseline (default since RQ-1.6)
    - {workflow: exact-hybrid-v4.3-audit-bundle-cc,     prompt: example-mapping}  # + audit bundle (class 2 + class 3)
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primary: correctness (claim-office is the correctness kata)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline (the audit bundle targets red/refactor discipline directly)
  - tests_passed_immediately
  - refactorings_applied
  - predictions_correct_rate
  - cycle_count
  # code quality (sanity)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 8
status: aktiv
---

# RQ-1.9: exact-hybrid-v4.3-audit-bundle-cc vs exact-hybrid-v4-cleaned-cc (claim-office)

Does the RQ-1.8 result (the audit bundle stabilizes discipline and is code-quality-neutral) generalize to the novel `claim-office-example-mapping` kata, or does the pattern flip there?

## Motivation

RQ-1.8 showed, on `game-of-life-example-mapping × opus-4-7-portkey-no-thinking` (n=10):

- `tests_passed_immediately` 0.7 → **0 ± 0** (the mandatory-procedure preamble eliminates premature greens deterministically).
- `refactorings_applied` 7.9 → 8.7 at σ −64 % (refactor rationale + three-path bar).
- Code quality ±1 σ, correctness 100 % / 100 % for both.
- Cost: +16 % tokens, **wallclock neutral** (a break with the v6.5-lean→v6.5.1 precedent).

But that result was measured on GoL — the training-familiar, correctness-saturated kata. The hybrid-v2 reduction line has repeatedly shown that workflow effects are **kata-specific**:

- Pep/emoji reduction was correctness-invariant on GoL but broke on claim-office (RQ-1.4: −3 to −20 pp correctness).
- The cleanup bundle was more effective on claim-office than on GoL (RQ-1.6 vs RQ-1.7: the refactor.md decoupling drove +34 % refactorings on claim-office, only +10 % on GoL).

This RQ tests whether the audit bundle effect on claim-office points in the same direction as on GoL — or whether the mandatory-procedure preamble + three-path bar scale differently on a multi-iteration kata with genuine ambiguities.

## Workflow definition

Identical to RQ-1.8 — exact-hybrid-v4-cleaned-cc (default baseline) vs exact-hybrid-v4.3-audit-bundle-cc (default baseline + the remaining audit-bundle items from the archived v6.5.1 audit). Full diff:

```
diff -r experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc experiments/workflows/exact-coding/opus/exact-hybrid-v4.3-audit-bundle-cc
```

Per-item justifications in `experiments/workflows/exact-coding/opus/exact-hybrid-v4.3-audit-bundle-cc/CHANGES.md`.

## Hypotheses

- **H1 (correctness)** — Both workflows ≥ 95 % `verification_pct` on average. The audit bundle must not regress. Anchor-specific: in RQ-1.6, exact-hybrid-v4-cleaned-cc came in at mean 0.96; hybrid-v4.3 is expected in the same region.
- **H2 (tests_passed_immediately drops)** — Identical pattern to GoL: hybrid-v4.3 shows ≤ 1 run with a premature green; hybrid-v4 shows greater variability (claim-office has more ambiguity test steps, hence potentially more opportunities to over-implement).
- **H3 (refactoring discipline)** — `refactorings_applied` rises by at least 10 % with a marked σ reduction. On claim-office (more iterations than GoL) the effect could be stronger than the +10 % on GoL.
- **H4 (cost)** — +15–20 % tokens expected (in parallel to RQ-1.8). Wallclock: uncertain — if the GoL wallclock neutrality was driven by saved premature-green detours, the same mechanism could apply on claim-office. If not, +15 % as in the RQ-audit precedent.
- **H5 (kata-specific flip)** — Falsifier: if the audit bundle costs correctness on claim-office (e.g. because the backfill ban in "Wrong Predictions Are Data" destabilizes the agent on genuine ambiguity predictions), the bundle would not be promotable on claim-office — hybrid-v4.3 would remain a GoL-specific code-quality champion without default-baseline status.

## Design

```
Factor:  workflow_x_prompt — 2 levels, both example-mapping
Control: model            — opus-4-7-portkey-no-thinking
Control: kata_base        — claim-office

Cells:      2 (2 workflows × 1 kata)
Replicates: n = 8 per cell (matched to RQ-1.6)
Runs:       16 total (8 hybrid-v4 from the RQ-1.6 pool + 8 new hybrid-v4.3)
```

The replicate count is n=8 rather than the n=10 of RQ-1.8 because claim-office, at ~37 min/run, is far more expensive than GoL (~10 min/run), and n=8 already produced unambiguous statements about the cleanup effect in RQ-1.6. If the data support a strong statement (e.g. an unambiguous correctness break or correctness gain), it can be extended to n=10.

Because of the longer sessions on claim-office: single-shard or at most 2 shards (memory `portkey-shards-external-cut-risk` — 3+ parallel Portkey shards with Opus 4.7 × claim-office can have sessions cut externally).

## Caveats

- **Bundle, not isolated effects** — as in RQ-1.8: given a positive bundle result, which class carries it remains open (class-2 rationales vs class-3 red hardening). Follow-up RQs possible.
- **claim-office correctness is not saturated** — unlike GoL, hybrid-v4.3 can also break downward here (cf. RQ-1.4: reductions broke correctness on the same kata). H1 is not sanity but real differentiation.
- **n=8 is thin for σ statements** — the variance-shrink result from RQ-1.8 (`refactorings_applied` σ by a factor of 0.36) needs n≥10 for stable σ comparisons. n=8 suffices for a mean plus a direction, not for a precise σ reduction.
- **predictions_correct_rate interpretation** — if hybrid-v4.3 lands markedly below hybrid-v4 on claim-office (with its genuine ambiguities), the RQ-1.8 reading ("the wrong-predictions block makes honest wrong predictions visible") does not transfer automatically. On claim-office it could equally mean a loss of discipline — that needs per-run inspection.

## Findings

See [findings.md](findings.md) (follows after the batch run).

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v4-cleaned-cc, exact-hybrid-v4.3-audit-bundle-cc}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

The hybrid-v4 baseline pool from RQ-1.6 (n=8) is reusable; ~8 new hybrid-v4.3 runs are needed.

## Sources

- Preceding RQ on GoL: [RQ-1.8](../1.8-audit-bundle-effect-v62/findings.md) — audit-bundle effect isolated on the hybrid-v4 base.
- Baseline RQ: [RQ-1.6](../1.6-v62-cleanup-validation-v61-with-why/findings.md) — hybrid-v4 established as default on claim-office.
- Reduction-flip precedent: [RQ-1.4](../1.4-pep-emoji-claim-office/findings.md) — reductions break correctness on claim-office.
- hybrid-v4.3 workflow diff: `experiments/workflows/exact-coding/opus/exact-hybrid-v4.3-audit-bundle-cc/CHANGES.md`.
