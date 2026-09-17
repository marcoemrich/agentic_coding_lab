---
id: RQ-pep-emoji-v6.1
question: "Are the effects of the pep and emoji reductions on the hybrid-v2 base additive (two independent channels) or jointly carried (a single 'prompt scaffolding' mechanism)?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2-testlist-fix-cc, prompt: example-mapping}  # pep + emoji  (baseline)
    - {workflow: exact-hybrid-v2.1-no-pep-cc,                    prompt: example-mapping}  # no-pep + emoji
    - {workflow: exact-hybrid-v2.2-no-emoji-cc,                  prompt: example-mapping}  # pep + no-emoji
    - {workflow: exact-hybrid-v2.3-no-pep-no-emoji-cc,           prompt: example-mapping}  # neither
controls:
  model:
    any:
      - opus-4-7-portkey-no-thinking  # canonical for new fill runs (portkey, sharded)
      - opus-4-7-no-thinking          # accepted for reused baseline runs (direct API)
  kata_base: game-of-life
outcomes:
  # primary: code quality
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD discipline (interaction between pep & emoji expected)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # cost
  - duration_seconds
  - total_tokens
  # correctness (sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-pep-emoji-v6.1: Pep + emoji combined (2×2 interaction test)

Do the pep reduction ([RQ-pep-v6.1](../1.1-pep-effect-v6.1/README.md)) and the emoji reduction ([RQ-emoji-v6.1](../1.2-emoji-effect-v6.1/README.md)) on the hybrid-v2 base act through **two independent channels** (additive effect) or through a **shared mechanism** (e.g. "less prompt scaffolding lets the model follow the process more strictly" — then subadditive or even flat)?

## Motivation

Both single reductions showed the same discipline pattern on the hybrid-v2 base (more `refactorings_applied`, fewer `tests_passed_immediately`) without correctness or code quality damage:

| Effect | RQ-pep-v6.1 (F-1.1) | RQ-emoji-v6.1 (F-1.1) |
|---|---|---|
| `refactorings_applied` | +67 % (4.2 → 7.0) | +29 % (4.2 → 5.4) |
| `tests_passed_immediately` | −75 % (4.8 → 1.2) | −54 % (4.8 → 2.2) |
| Code quality | indistinguishable | indistinguishable |
| Correctness | 100 % / 100 % | 100 % / 100 % |

Two explanations are compatible with these single-factor data:

- **Hypothesis A (additive)**: pep and emoji address different model behaviours. The combination should sum both effects — e.g. `refactorings_applied` toward +67 % + 29 % = ~+96 % (≈ 4.2 → 8.2), `tests_passed_immediately` ~ the product of the reduction factors (0.25 × 0.46 ≈ 0.12, i.e. 4.2 → ≈ 0.6).
- **Hypothesis B (shared mechanism)**: both remove a "reassurance/decoration layer". The channel saturates — the combination acts no more strongly than the stronger single intervention (i.e. ≈ no-pep alone).

The resulting consequence for the reduction recipe ([v6-reduction-recipe.md](../v6-reduction-recipe.md)) differs: under (A) the combination is worth taking as the next step, under (B) further reductions are redundant to the stronger single reduction and the reduction path must be sought elsewhere.

## Workflow definition

- **exact-hybrid-v2-testlist-fix-cc** (pep + emoji): baseline, 5 runs reused from RQ-pep-v6.1 / RQ-emoji-v6.1.
- **exact-hybrid-v2.1-no-pep-cc** (no-pep + emoji): 5 runs reused from RQ-pep-v6.1.
- **exact-hybrid-v2.2-no-emoji-cc** (pep + no-emoji): 5 runs reused from RQ-emoji-v6.1.
- **exact-hybrid-v2.3-no-pep-no-emoji-cc** (neither, new, n=5): combines both reductions.
  - Base: exact-hybrid-v2.1-no-pep-cc
  - Change: the same decoration emoji strip operation as in exact-hybrid-v2.2-no-emoji-cc (95 emojis removed: ✅ ❌ 🚨 🔴 🟢 🔄 📋 ⚠️). Predictions `✅ Correct`/`❌ Incorrect` → `- Correct`/`- Incorrect`. ❓ in `test-list.md` kept as a semantic spec reference.
  - Verification: MARKERS compliance (`Red Phase Complete:` + two prediction lines per cycle + verbatim clause) intact. Diff to exact-hybrid-v2.1-no-pep-cc = 253 lines (pure emoji strip, comparable to v6.1-hybrid → exact-hybrid-v2.2-no-emoji-cc = 253 lines).

## Hypotheses

- **H1 (additive)**: `refactorings_applied` in exact-hybrid-v2.3-no-pep-no-emoji-cc is ≥ 7.5 (≥ the no-pep value plus a third of the no-emoji effect).
- **H2 (shared mechanism / saturated)**: `refactorings_applied` and `tests_passed_immediately` in exact-hybrid-v2.3-no-pep-no-emoji-cc do not differ significantly from exact-hybrid-v2.1-no-pep-cc alone (Δ < 1σ in both metrics).
- **H3 (correctness invariant)**: all 4 workflows stay at 100 % `verification_pct` and 100 % `tests_passing`.
- **H4 (code quality stays indistinguishable)**: none of the 5 primary code quality metrics shows a > 1σ consistent trend across the 4 workflows.
- **H5 (token cost)**: exact-hybrid-v2.3-no-pep-no-emoji-cc consumes *more* tokens than v6.1-hybrid (trend from RQ-emoji-v6.1 F-1.2: additional refactor phases cost more than the removed decoration tokens save). Expectation: ≈ midway between no-pep and no-emoji, or slightly above.

**A-priori expectation:** the most likely reading is **H2 (saturated)** — both reductions remove related "reassurance/signpost" layers, and the model already has a tight process skeleton. But the data has to decide; if H1 were confirmed, the reduction channels would in fact be orthogonal and the next reduction step (e.g. APP explanations, why blocks) would be expected to act as an independent further lever.

## Design

```
Factor:  workflow_x_prompt — 4 levels (all with example-mapping)
           exact-hybrid-v2-testlist-fix-cc   (pep + emoji, baseline)
           exact-hybrid-v2.1-no-pep-cc                      (no-pep + emoji)
           exact-hybrid-v2.2-no-emoji-cc                    (pep + no-emoji)
           exact-hybrid-v2.3-no-pep-no-emoji-cc             (neither, new)
Control: model            — opus-4-7-no-thinking
Control: kata_base        — game-of-life

Cells:      4 (4 workflows x 1 kata)
Replicates: n = 5
Runs:       20 total
            — 5 exact-hybrid-v2-testlist-fix-cc (reuse RQ-pep-v6.1)
            — 5 exact-hybrid-v2.1-no-pep-cc                    (reuse RQ-pep-v6.1)
            — 5 exact-hybrid-v2.2-no-emoji-cc                  (reuse RQ-emoji-v6.1)
            — 5 exact-hybrid-v2.3-no-pep-no-emoji-cc           (new)
```

**Reuse is clean:** all 3 existing cells ran under identical control conditions (opus-4-7-no-thinking × game-of-life-example-mapping). `aggregate-by-query.py` collects all matching runs automatically.

## Caveats

- **Single kata, single model**: identical to the sister RQs. A generalization to claim-office would additionally give a sharp test of the "keep ❓" decision (claim-office actively uses ❓ spec syntax).
- **n=5 per cell**: important for the interaction reading, because 1σ thresholds depend sensitively on the spread. For borderline results, possibly extend to n=10 via claim-office or Sonnet.
- **Confounder refactor token cost**: any token increase in exact-hybrid-v2.3-no-pep-no-emoji-cc is not necessarily a "worse prompt efficiency" finding, but a consequence of additional refactor phases (see the RQ-emoji-v6.1 F-1.2 discussion).
- **Routing asymmetry (caveat)**: the 15 reused baseline runs (v6.1-hybrid, exact-hybrid-v2.1-no-pep-cc, exact-hybrid-v2.2-no-emoji-cc) were produced under `opus-4-7-no-thinking` (direct API). The 5 new exact-hybrid-v2.3-no-pep-no-emoji-cc runs run under `opus-4-7-portkey-no-thinking` (Portkey gateway). The cells are merged via `controls.model: {any: [...]}` (OR match) — see memory `controls-model-or-match.md`. Assumption: the routing does not influence the outcome. A replication of the no-pep-no-emoji cell on direct API would test that assumption more sharply, but is secondary for the interaction comparison.

## Findings

See [findings.md](findings.md).

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v2-testlist-fix-cc, exact-hybrid-v2.1-no-pep-cc, exact-hybrid-v2.2-no-emoji-cc, exact-hybrid-v2.3-no-pep-no-emoji-cc}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
