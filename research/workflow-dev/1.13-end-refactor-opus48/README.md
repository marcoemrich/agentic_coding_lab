---
id: RQ-end-refactor-opus48
question: "Does the exact-hybrid-v5-end-refactor-cc result from RQ-1.12 (correctness intact, code quality >= hybrid-v4, token cost ~hybrid-v4) hold on Opus 4.8 (no-thinking) — or does the additional end-refactor pass fake claim-office completeness on the new model (the bundle-break pattern from RQ-1.9/RQ-1.10)?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v4-cleaned-cc,        prompt: example-mapping}  # Baseline: per-cycle APP refactor
    - {workflow: exact-hybrid-v4.4-metric-refactor-cc,  prompt: example-mapping}  # per-cycle metric-driven (ESLint/McCabe pre/post per cycle)
    - {workflow: exact-hybrid-v5-end-refactor-cc,            prompt: example-mapping}  # hybrid-v4 per-cycle + an additional end-refactor pass (whole src/, iterative, metric-driven)
  kata_base: [claim-office, game-of-life]
controls:
  model: opus-4-8-no-thinking
outcomes:
  # primary: correctness (the bundle-break risk shows up here first; cf. RQ-1.9/RQ-1.10)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code quality (the end refactor targets whole-src metrics explicitly)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD discipline (sanity: the per-cycle part of hybrid-v5 is byte-identical to hybrid-v4)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.13: exact-hybrid-v5-end-refactor-cc on Opus 4.8 — does the RQ-1.12 result hold across models? (claim-office)

RQ-1.12 showed, on **opus-4-7-(portkey-)no-thinking**: the additional iterative end-refactor pass (hybrid-v5) preserves correctness (`verification_pct` 0.99, 5/5 `experiment-done.txt`), delivers more compact code than hybrid-v4 (`code_mass` −11 %, `cognitive_max` −44 %), is practically level with hybrid-v4.4 on code quality, and costs only ~hybrid-v4 tokens in doing so (instead of v6.4's ~2.4×). RQ-1.13 tests whether that result holds on **Opus 4.8 (no-thinking)**.

## Motivation

Reductions and additive bundles are **not model-agnostic** (memory `opus-46-vs-47-not-equivalent`, oneshot-v1 archive RQ-emoji-cross-model: on Sonnet-4-6 removing emoji multiplies correctness, on opus-4-6 both variants fail equally). The entire hybrid-v1.x line was measured primarily on opus-4-7. Before hybrid-v5 can serve as a cross-model default recommendation, it needs a replication on the new flagship model.

The specific concern: the **bundle-break pattern** from RQ-1.9 (exact-hybrid-v4.3-audit-bundle-cc) and RQ-1.10 (exact-hybrid-v4.1-refactor-vocab-cc) — the agent self-terminates on claim-office after <½ the baseline cycles, `code_mass` halved, internal tests green, but external `verification_pct` collapses (0.96 → 0.35 / 0.23). hybrid-v5 avoided that pattern on opus-4-7. It is not settled a priori that it will stay absent on opus-4-8: a more capable model could drive the end pass more aggressively and declare itself "done" earlier.

## Workflow definition

Identical to RQ-1.12 — `exact-hybrid-v5-end-refactor-cc` differs from `exact-hybrid-v4-cleaned-cc` in exactly the files `.claude/agents/end-refactor.md` (NEW), `.claude/rules/tdd.md` and `.claude/rules/tdd-experiment-mode.md` (end-refactor step added); `.claude/agents/refactor.md` is byte-identical to hybrid-v4. The four MARKERS stay untouched; the end refactor is an additional `Task({subagent_type: "end-refactor"})` call **before** the `experiment-done.txt` write. Full description: `../1.12-end-refactor-effect-v62/README.md`.

## Hypotheses

- **H1 (correctness, primary):** hybrid-v5 preserves correctness on claim-office × opus-4-8 (`verification_pct` ≥ 0.85, `experiment-done.txt` in ≥ 80 % of runs). No bundle break as in RQ-1.9 / RQ-1.10.
- **H2 (RQ-1.12 replication):** The ranking of the three workflows on the code quality outcomes is preserved on opus-4-8 (hybrid-v5 ≈ hybrid-v4.4 < hybrid-v4 on `code_mass` / function length; hybrid-v4.4 narrowly ahead on `cognitive_max` / `mccabe_max`).
- **H3 (cost replication):** hybrid-v5 stays markedly cheaper than hybrid-v4.4 (tokens & wallclock), with a moderate surcharge over hybrid-v4.
- **H4 (model effect, secondary):** At the same workflow, opus-4-8 tends to deliver equal or better correctness/code quality than opus-4-7 (cross-comparison against the RQ-1.12 numbers — **context only, not causal**, given the routing difference; see caveats).

**Falsification of H1:** If hybrid-v5 falls into the self-termination pattern on opus-4-8 (verification_pct collapses while internal tests stay intact), the end pass is model-sensitive and must not be recommended without per-model validation.

## Data situation at RQ start

Existing runs in the pool (as of 2026-05-30):

| Workflow | claim-office | game-of-life | note |
|---|---:|---:|---|
| `exact-hybrid-v4-cleaned-cc`        | 5 | 0 | claim-office present (1 ver=0 outlier, 1 timeout — both legitimate findings); GoL new |
| `exact-hybrid-v4.4-metric-refactor-cc`  | 5 | 0 | claim-office present; GoL new |
| `exact-hybrid-v5-end-refactor-cc`            | 5 | 0 | claim-office present; GoL new |

The **claim-office** half (15 runs, 05-29/05-30) is fully collected. Open is the **game-of-life** half: 3 cells × n=5 = **15 runs** to be collected fresh (direct API/native, single-shard). (The RQ-1.12 runs are opus-4-7/Portkey and do not count here, given the fixed `controls.model`.)

## Design

```
Factor:  workflow   — 3 levels (hybrid-v4 / hybrid-v4.4 / hybrid-v5), prompt = example-mapping fixed
Control: model      — opus-4-8-no-thinking (direct API / native OAuth)
Control: kata_base  — claim-office

Cells:      3
Replicates: n = 5
Runs:       15 total (all new)
```

## Caveats

- **Routing difference to RQ-1.12 (no cross-pooling!):** opus-4-8 is **not** available on Portkey/Vertex and runs direct API over native OAuth (`~/.claude/.credentials.json`); `run-batch.sh` blanks the Portkey `.env` routing vars for this (comment in `MODEL_CONFIGS`). RQ-1.12 ran Portkey-via-Vertex-EU. The two RQs therefore share **no** cell — the H4 cross-comparison against RQ-1.12 is routing-confounded and is to be read as context only, not as a causal model effect. Anyone wanting the pure model effect would need both models on the same routing.
- **Single-shard mandatory:** Direct-API batches must not be sharded (rate-limit pressure, memory `feedback-direct-single-shard`). All 15 runs one at a time.
- **Subscription cap risk (direct-API-specific):** Long iterative end-refactor sessions × claim-office can run into a subscription cap; the Anthropic CLI then leaves the container with `exit=0` ("Waiting for retry window"). `run-batch.sh` has fixed that in the exit-0 path since 2026-05-27 (memory `v64-stress-postmortem`) — still spot-check `jq .run_status.exit_reason` + the presence of `experiment-done.txt` before aggregating.
- **The end-refactor pass is iterative with no hard limit:** hybrid-v5's `duration_seconds` / `total_tokens` sit above hybrid-v4 on average; the TDD cycle part is decoupled from that.
- **Bundle caveat (causal localization):** The end-refactor agent combines whole-src scope + iterative multiple refactorings + pre/post measurement. An effect cannot be localized to any one of those components.
- **Kata asymmetry (the RQ-1.12 lesson):** The v6.5 end pass works on the **multi-file** claim-office codebase (cross-file consolidation) but was noise on the **single-file** game-of-life library (F-1.12.2). The GoL cells therefore primarily test whether this kata-dependent difference reproduces on opus-4-8 — not whether hybrid-v5 wins there. Katas are **never averaged**.

## Status / next steps

1. exact-hybrid-v5-end-refactor-cc smoke run (n=1, claim-office-example-mapping, **opus-4-8-no-thinking**) for sanity: cycle_count >= 3, refactorings_applied >= 1, the end pass runs, `experiment-done.txt` gets written.
2. Generate the batch plan (`batch-plan-from-rq.py`); all 15 cells are recognized as fill (no hits in the pool).
3. Fill batch **single-shard**, direct API/native OAuth (no Portkey).
4. Aggregate via `aggregate-by-query.py`, write `findings.md` per the `/run-rq` skill conventions (trophy convention, spot-check before aggregation, plausibility cross-check, 🏆 in the overview table).

## Findings

See [findings.md](findings.md) (to be filled with the `/run-rq` skill once n=5 per workflow is reached).
