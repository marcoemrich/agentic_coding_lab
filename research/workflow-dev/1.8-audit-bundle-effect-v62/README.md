---
id: RQ-audit-bundle-v62
question: "Does the audit bundle (rationale additions + red-phase hardening) reproduce, on the exact-hybrid-v4-cleaned-cc base, the effects measured in the archived RQ-audit against v6.5-lean (discipline gain, variance shrink, token/wallclock surcharge while preserving correctness)?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v4-cleaned-cc, prompt: example-mapping}  # Baseline (current default base from RQ-1.6)
    - {workflow: exact-hybrid-v4.3-audit-bundle-cc,     prompt: example-mapping}  # + class-2 rationales + class-3 red hardening
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: game-of-life
outcomes:
  # primary: TDD discipline (the class-3 changes target red-phase discipline directly)
  - tests_passed_immediately
  - refactorings_applied
  - predictions_correct_rate
  - cycle_count
  # code quality (sanity: the bundle must not degrade it)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # correctness (sanity)
  - tests_passing
  - completed_within_budget
  # cost (the bundle adds net text; a surcharge is expected)
  - duration_seconds
  - total_tokens
min_replicates: 10
status: aktiv
---

# RQ-1.8: exact-hybrid-v4.3-audit-bundle-cc vs exact-hybrid-v4-cleaned-cc (game-of-life)

Does the audit bundle reproduce the effects measured in the old RQ-audit (oneshot-v1 generation, `3.1-orchestration-audit`; deleted in `953841cb`) against v6.5-lean, when it is layered onto exact-hybrid-v4-cleaned-cc instead?

## Motivation

The archived RQ-audit (n=10, opus-4-7-no-thinking, GoL example-mapping) showed clear effects for the audit bundle relative to v6.5-lean:

- `tests_passed_immediately` 1.4 ± 2.27 → **0 ± 0** (the mandatory-procedure preamble eliminates premature green states).
- `refactorings_applied` 6.9 ± 2.33 → 7.8 ± 0.42 (refactor rationale + concrete bar; σ −82 %).
- Code quality within 1 σ, smell floor cleanly at 2.0 ± 0.
- Cost: +15 % tokens, +16 % wallclock.
- σ shrinks almost everywhere (the workflow becomes markedly more predictable).

But these effects are **bundle-measured against the archived v6.5-lean line** — a line that itself carries other reductions (PEP removed, emoji removed, MUSTs reduced) and was correctness-defective on claim-office (see memory `v6-rebuild-new-base`, `v6.5-correctness-setback`).

The current default base is `exact-hybrid-v4-cleaned-cc` (RQ-1.6). Three classes of the audit changes are not yet built into that base:

- **Class 2 — rationale additions:** measurement-pipeline rationale for mandatory refactoring, bisectability rationale for ONE-at-a-time, concrete three-path bar for "no improvement possible", green-phase generalization rationale in test-list step 3.
- **Class 3 — red-phase hardening:** mandatory-procedure preamble, removal of the "STOP and explain" clauses in steps 3/6, replacement of the "Prediction Failure Protocol" block with "Wrong Predictions Are Data" (ban on retroactive backfilling).
- **Class 4 — agent decoupling:** already landed in hybrid-v4 (refactor.md is role-neutral), not addressed again.
- **Mechanism alignment (commands→skills):** a hybrid-v1-line decision, deliberately not adopted (see `workflow-construction.md`).

This RQ measures the class-2 + class-3 effect **in isolation on the hybrid-v4 base** — without the further reductions contained in v6.5-lean. That answers the question: **is the audit bundle a standalone improvement to the current default base, or was the RQ-audit effect merely the repair of a broken v6.5-lean base?**

## Workflow definition

- **exact-hybrid-v4-cleaned-cc (baseline)** — current default base from RQ-1.6. Why blocks + hygiene cleanups, otherwise full MUST/CRITICAL imperatives + PEP + emoji.
- **exact-hybrid-v4.3-audit-bundle-cc (new)** — hybrid-v4 + class-2 rationales + class-3 red hardening + opt-in `HUMAN-IN-THE-LOOP.md` profile (in the workflow root, not in `.claude/rules/`, hence no auto-load and no measurement effect in the autonomous default).

Full diff: `diff -r experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc experiments/workflows/exact-coding/opus/exact-hybrid-v4.3-audit-bundle-cc`. Per-item justifications in `experiments/workflows/exact-coding/opus/exact-hybrid-v4.3-audit-bundle-cc/CHANGES.md`.

## Hypotheses

- **H1 (discipline)** — The discipline effects measured in RQ-audit on v6.5-lean reproduce in the same direction on the hybrid-v4 base: `tests_passed_immediately` drops (preamble effect), `refactorings_applied` rises with markedly tighter variance (rationale + three-path bar). The effect size may be smaller than in the v6.5-lean repair, since hybrid-v4 already carries why blocks.
- **H2 (correctness)** — Both workflows ≥ 95 % `tests_passing`. The audit bundle must not regress on GoL.
- **H3 (code quality neutral)** — `code_mass`, `cc_longest_function`, `cognitive_max`, `mccabe_max` each stay within 1 σ of the hybrid-v4 variance. The smell floor (if hybrid-v4 is not already at 2.0) shifts toward 2.0.
- **H4 (cost)** — The audit bundle adds net text → +10–20 % tokens and wallclock expected, in parallel to the RQ-audit observation (+15 % / +16 %).
- **H5 (variance shrink)** — The σ reduction observed almost everywhere in RQ-audit replicates. If `cycle_count` σ and `refactorings_applied` σ drop markedly, the hardening effect is confirmed; if not, the σ reduction in RQ-audit was a v6.5-lean repair artifact.
- **H0 (falsifier)** — If none of the discipline effects is measurable on the already-MUST/PEP-carrying hybrid-v4 base, the audit bundle is empirically redundant to the MUST/emoji/PEP situation. In that case hybrid-v4 stays the default base; hybrid-v4.3 is not promoted.

## Design

```
Factor:  workflow_x_prompt — 2 levels, both example-mapping
Control: model            — opus-4-7-portkey-no-thinking
Control: kata_base        — game-of-life

Cells:      2 (2 workflows × 1 kata)
Replicates: n = 10 per cell
Runs:       20 total
```

The replicate count n=10 mirrors the RQ-audit precedent and exceeds the RQ-1.7 n=5 (see memory `replicates-n-reliability`: n=5 for sanity, n≥7 for the middle ground, n=10 for tight σ comparisons, which are central here).

Single-shard sequential; parallel as 2 containers is fine (GoL has short sessions, no notable Portkey cut risk, cf. memory `portkey-shards-external-cut-risk`).

## Caveats

- **Bundle, not isolated effects** — four item classes are imported at once (mission rationale, three-path bar, step-4 bisectability, test-list step-3 rationale, red preamble, STOP removal, wrong-predictions block). Given a positive bundle result, which part carries it remains open. Follow-up RQs (class-2 only vs class-3 only) are possible if a bundle effect materializes.
- **Single kata, single model** — `game-of-life-example-mapping × opus-4-7-portkey-no-thinking`. Cross-kata validation on `claim-office-example-mapping` as a follow-up RQ if hybrid-v4.3 is promoted (see RQ-1.6 result: the refactor.md decoupling acts more strongly on claim-office than on GoL).
- **GoL correctness is saturated** — both workflows should land near 100 % `tests_passing`. H2 is sanity, not differentiation. If the bundle effect is only bought by a loss of correctness, the GoL result misleads — claim-office then becomes mandatory.
- **The hybrid-v4 base already carries why blocks** — the class-2 rationales are partly additive to the exact-hybrid-v3-with-why-cc effect. If the exact-hybrid-v3-with-why-cc why blocks already carry most of the rationale effect, expect smaller effect sizes than in RQ-audit (which ran against v6.5-lean without a full why build-out).
- **HITL.md is opt-in and auto-load-free** — the hybrid-v4.3 measured in the default run contains no HITL mechanics. If a HITL comparison is wanted later, it needs a separate variant (`v6.3-hitl`) and its own RQ.

## Findings

See [findings.md](findings.md) (follows after the batch run).

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v4-cleaned-cc, exact-hybrid-v4.3-audit-bundle-cc}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

hybrid-v4 baseline runs already exist from RQ-1.7 (n=5); n=10 may therefore mean +5 refill runs on hybrid-v4 plus 10 new runs on hybrid-v4.3.

## Sources

- Precedent: RQ-audit of the oneshot-v1 generation (`3.1-orchestration-audit`) — bundle against v6.5-lean. Directory deleted in `953841cb`, retrievable via `git show 953841cb^:research/_archive/workflow-dev-v1/3.1-orchestration-audit/findings.md`.
- hybrid-v4.3 workflow diff: `experiments/workflows/exact-coding/opus/exact-hybrid-v4.3-audit-bundle-cc/CHANGES.md`.
- HITL profile: `experiments/workflows/exact-coding/opus/exact-hybrid-v4.3-audit-bundle-cc/HUMAN-IN-THE-LOOP.md`.
- Baseline RQ: [RQ-1.6](../1.6-v62-cleanup-validation-v61-with-why/findings.md) (hybrid-v4 established as default).
