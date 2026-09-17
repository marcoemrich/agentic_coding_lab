---
id: RQ-metric-driven-refactor-v62
question: "Does a refactor agent that measures deterministic metrics itself pre/post (ESLint smells, SonarJS cognitive complexity, McCabe cyclomatic complexity) and reports APP mass alongside them improve code quality on claim-office relative to the baseline exact-hybrid-v4-cleaned-cc workflow — without damaging correctness or TDD discipline?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v4-cleaned-cc,        prompt: example-mapping}  # Baseline (current default base from RQ-1.6)
    - {workflow: exact-hybrid-v4.4-metric-refactor-cc,  prompt: example-mapping}  # + tool calls (ESLint pre/post) + McCabe computation alongside APP
  kata_base: [claim-office]
controls:
  model:
    any:
      - opus-4-7-no-thinking          # canonical for new hybrid-v4.4 fill runs (subscription tokens, single-shard)
      - opus-4-7-portkey-no-thinking  # accepted for reused hybrid-v4 baseline runs (Portkey gateway)
outcomes:
  # primary: code quality (the metrics drive the refactor directly)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD discipline (sanity: the extra tool calls must not disturb refactor frequency)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # correctness (sanity: bundle risk from RQ-1.9/RQ-1.10 vs claim-office)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # cost (pre/post tool calls + a larger refactor prompt → slight surcharge expected)
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.11: exact-hybrid-v4.4-metric-refactor-cc vs exact-hybrid-v4-cleaned-cc (claim-office)

Does a deterministically measuring refactor agent change code quality on a novel kata with genuine ambiguities — without falling into the bundle-break pattern from RQ-1.9 (`exact-hybrid-v4.3-audit-bundle-cc`) and RQ-1.10 (`exact-hybrid-v4.1-refactor-vocab-cc`)?

## Motivation

The `refactor` agent in the hybrid-v1.x line has so far left the assessment of code quality to the model itself (APP mass computation, naming evaluation, qualitative smell description). Two preceding extension attempts failed on claim-office:

- **RQ-1.9** (`exact-hybrid-v4.3-audit-bundle-cc`): additional rationale blocks + red-phase hardening. Clearly positive on GoL; on claim-office `verification_pct` 0.96 → 0.35 (self-stop in 6/8 runs).
- **RQ-1.10** (`exact-hybrid-v4.1-refactor-vocab-cc`): a purely additive vocabulary block in the refactor agent (complexity awareness, SRP, smell→move table). Code quality within 1-σ noise on GoL; on claim-office `verification_pct` 0.96 → 0.23 (self-stop in 4/5 runs).

Both cases show the same pattern: self-termination after < ½ the baseline cycles, internal `tests_passing = true` (the tests written are green), external `verification_pct` collapses. Which component triggers the self-stop behavior cannot be decided from bundle results.

`exact-hybrid-v4.4-metric-refactor-cc` tests a mechanistically different hypothesis: **instead of adding vocabulary, the agent calls deterministic tools and lets the numbers steer the refactor**.

## Workflow definition

`exact-hybrid-v4.4-metric-refactor-cc` lives under `experiments/workflows/exact-coding/opus/exact-hybrid-v4.4-metric-refactor-cc/` and differs from `exact-hybrid-v4-cleaned-cc` in exactly one file: `.claude/agents/refactor.md`. All other files (`commands/test-list.md`, `commands/red.md`, `commands/green.md`, `rules/tdd.md`, `rules/tdd-with-ts-and-vitest.md`, `rules/tdd-experiment-mode.md`, `settings.json`) are byte-identical to the baseline. The four MARKERS (skill calls, "Red Phase Complete", prediction lines, `experiment-done.txt`) are untouched.

The extensions in `refactor.md` are:

| Component | Description | Source |
|---|---|---|
| **Step 0 — pre-measurement (ESLint)** | call `pnpm exec eslint src/ --format json`; extract smells (a list with rule-id, location, message) and SonarJS cognitive complexity per function from the output | tool call (the Bash skill is already permitted via `settings.json`) |
| **Step 3 — McCabe cyclomatic complexity** | per function: start at 1, +1 for each if/else-if/case/&&/‖/?:/for/while/catch. Identify the worst-case function as the refactor target; minimization angles are enumerated in the prompt (guard clauses, lookup tables, polymorphism) | agent-internal computation, analogous to the APP mass computation (step 2) |
| **Step 5 — post-measurement (ESLint)** | call ESLint again, compute the smell and cognitive delta | tool call |
| **Step 6 — document decision** | pre/post block across ALL four metrics (smells, cognitive, APP, McCabe); explicit clause "if a metric got worse: revert and take an alternative angle" | prompt content |
| **APP** | kept unchanged (alongside, not replacing) | inherited from the baseline |

Deliberately NOT included (forbidden per `CLAUDE.md` → "Keine numerischen Schwellwerte in Workflow-Prompts"):

- No statement like "if cognitive > 15 then refactor" or similar in the prompt.
- No auto-revert loop with an iteration limit.
- No ESLint config changes (the existing thresholds in `eslint.config.mjs` are pipeline infrastructure, not workflow content).

## Hypotheses

- **H1 (correctness, primary):** hybrid-v4.4 preserves correctness on claim-office (`verification_pct` ≥ 0.85, `experiment-done.txt` in ≥ 80 % of runs). It does not incur the bundle risk, because the mechanism is deterministic rather than vocabulary-driven.
- **H2 (code quality):** hybrid-v4.4 reduces `cognitive_max` and `mccabe_max` measurably against the baseline (at least 1 σ effect size), because pre/post measuring gives the agent objective triggers.
- **H3 (TDD discipline, sanity):** `cycle_count`, `refactorings_applied`, `predictions_correct_rate` stay within 1 σ of the baseline. If not, the tool calls disturb the TDD loop, which would be an independent result.
- **H4 (cost):** Token and wallclock surcharge from two tool calls per cycle plus the McCabe computation. Expected +10–20 % tokens, wallclock depending on cycle count.

## Data situation at RQ start

Sample smoke 2026-05-27 (claim-office-example-mapping × hybrid-v4.4 × opus-4-7-no-thinking, native API, n=2 after clearing subscription-cap runs):

| Run | ver_pct | cycles | refactorings | done.txt | wallclock |
|---|---:|---:|---:|---|---:|
| 2026-05-27_03-39-46 | **1.00** (15/15) | 38 | 37 | ✓ | 5000s |
| 2026-05-27_14-28-32-2 | **0.93** (14/15) | 42 | n/a | ✓ | 9197s |

Mean ver_pct (n=2) = 0.965, both with done.txt present. The 0.85 acceptance threshold is met for now; H1 is consistent with the sample but needs n=5 for a defensible statement.

Two further runs from the 05-27 sample were subscription-cap and external-session-cut artifacts respectively (see memory `v64-stress-postmortem.md`); they were retroactively marked `subscription-capped` / `external-session-cut` and do not count. The detection fix in `run-batch.sh` that they triggered should recognize such artifacts immediately from 2026-05-27 onward and divert them into the retry path.

## Caveats

- **Routing asymmetry:** The 18 reused hybrid-v4 baseline runs sit under `opus-4-7-portkey-no-thinking` (Portkey gateway via Vertex EU). The hybrid-v4.4 runs are produced under `opus-4-7-no-thinking` (native API, subscription tokens). Both cells are merged via `controls.model: {any: [...]}` — the memory note `controls-model-or-match.md` covers this mechanism. Assumption: routing does not influence the outcome on opus-4-7. A later cross-replication of one cell (hybrid-v4.4 on Portkey or hybrid-v4 native) would test that assumption more sharply, but is secondary to the primary workflow comparison.
- **Single-shard for hybrid-v4.4:** Subscription tokens are under load; parallel shards raise the cap risk. From 2026-05-27, `run-batch.sh` does fix empty-log cuts (retry with backoff), but every cut costs additional wallclock. Run hybrid-v4.4 fill runs one at a time.
- **Bundle caveat (causal localization):** hybrid-v4.4 combines three changes — (a) the ESLint call, (b) the McCabe computation alongside APP, (c) pre/post discipline with a revert clause. If an effect becomes visible, those three are not separated from one another. A later sub-RQ could test (a) in isolation (ESLint only, no McCabe) if the bundle effect justifies an ablation.
- **claim-office only:** GoL is left for a possible follow-up RQ. The GoL smoke (n=1) ran cleanly (9 cycles, 18/18 predictions, ver 1.0), but that is not a code quality result.

## Status / next steps

1. Generate the batch plan (`batch-plan-from-rq.py`); the 2 existing hybrid-v4.4 runs are recognized as hits, missing runs are filled.
2. Fill batch single-shard, native API, `ANTHROPIC_*=""` override for subscription routing.
3. Aggregate via `aggregate-by-query.py`, write `findings.md` per the `/run-rq` skill conventions (trophy convention, spot-check before aggregation, plausibility cross-check).

## Findings

See [findings.md](findings.md) (to be filled with the `/run-rq` skill once n=5 is reached).
