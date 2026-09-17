---
id: RQ-end-refactor-v62
question: "Does a metric-driven refactor pass improve code quality over the per-cycle baseline workflow (exact-hybrid-v4-cleaned-cc) — and does the lever work purely per-cycle (exact-hybrid-v4.4-metric-refactor-cc) or as an additional whole-src end pass (exact-hybrid-v5-end-refactor-cc) — without damaging correctness or TDD discipline, and does the result hold across two kata types (the multi-file CLI codebase claim-office vs the single-file library game-of-life)?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v4-cleaned-cc,        prompt: example-mapping}  # Baseline: per-cycle APP refactor
    - {workflow: exact-hybrid-v4.4-metric-refactor-cc,  prompt: example-mapping}  # per-cycle metric-driven (ESLint/McCabe pre/post per cycle)
    - {workflow: exact-hybrid-v5-end-refactor-cc,            prompt: example-mapping}  # hybrid-v4 per-cycle + an additional end-refactor pass (whole src/, iterative, metric-driven)
  kata_base: [claim-office, game-of-life]  # claim-office = multi-file CLI codebase (cli.ts + domain.ts), game-of-life = single-file library
controls:
  model:
    any:
      - opus-4-7-portkey-no-thinking  # claim-office routing (Portkey gateway via .env; native opus-4-7-no-thinking returns 400 without x-portkey-provider, see RQ diary 2026-05-27)
      - opus-4-7-no-thinking          # game-of-life routing (direct API / native OAuth) + reused v6.4 claim-office runs from RQ-1.11 (same .env route, different label)
outcomes:
  # primary: code quality (the end refactor targets whole-src metrics explicitly)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD discipline (sanity: the per-cycle part of hybrid-v5 is byte-identical to hybrid-v4; cycle metrics should match hybrid-v4)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # correctness (sanity: the end refactor must not break claim-office verification — cf. the bundle risk from RQ-1.9/RQ-1.10)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # cost (the additional end pass = iterative ESLint+McCabe calls after the last cycle)
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.12: metric-driven refactor (hybrid-v4.4 per-cycle / hybrid-v5 end) vs the hybrid-v4 baseline — across two kata types

Does a metric-driven refactor pass deliver a measurable code quality gain over the plain hybrid-v4 per-cycle baseline — and does the lever work better **continuously** (hybrid-v4.4, refactor in every cycle) or as a **one-off whole-src end pass** (hybrid-v5, after the last green cycle) — without falling into the bundle-break pattern from RQ-1.9 / RQ-1.10? Tested on two kata types: the multi-file CLI codebase **claim-office** (cli.ts + domain.ts, cross-file duplication possible) and the single-file library **game-of-life** (no cross-file lever).

## Motivation

RQ-1.11 showed that hybrid-v4.4 (metric-driven **per cycle**) preserves correctness on claim-office (see `1.11-metric-driven-refactor-effect-v62/findings.md`). What stayed open: is an **additional** whole-src pass after the last green cycle worth it? Hypotheses that raise the question:

- Per-cycle refactoring sees only the freshly touched code in each cycle. **Cross-file duplication** (e.g. `cli.ts` ↔ `domain.ts` on claim-office) and **cumulative complexity** in a function that grows through many small cycles are invisible at per-cycle scope.
- Naming decisions that a per-cycle refactor makes early rest on an incomplete picture of the function. Only after the last test is it clear what the function really does.
- If the per-cycle refactor is too conservative (reverting when in doubt), a second, focused pass with access to the whole codebase and stable tests can be bolder.

`exact-hybrid-v5-end-refactor-cc` tests whether this additional pass delivers the expected gain without sacrificing the correctness robustness established in hybrid-v4.4.

## Workflow definition

`exact-hybrid-v5-end-refactor-cc` lives under `experiments/workflows/exact-coding/opus/exact-hybrid-v5-end-refactor-cc/` and differs from `exact-hybrid-v4-cleaned-cc` in exactly three files:

| File | Change relative to hybrid-v4 |
|---|---|
| `.claude/agents/refactor.md` | **byte-identical** (the per-cycle refactor stays hybrid-v4 APP-driven) |
| `.claude/agents/end-refactor.md` | **NEW** — subagent for the final pass, with the deterministic mechanisms from hybrid-v4.4 (ESLint pre/post, McCabe computation, APP, SonarJS cognitive) extended to whole-src scope; iterates ONE-change-at-a-time until no metric improves further |
| `.claude/rules/tdd.md` | the "Which Tool to Use" table gains an end-refactor row; step 6 (end-refactor task call) added |
| `.claude/rules/tdd-experiment-mode.md` | the autonomous workflow gains step 4 (end refactor); the done marker comes only after the end refactor returns |

Deliberately NOT included (forbidden per `CLAUDE.md` → "Keine numerischen Schwellwerte in Workflow-Prompts"):

- No "if cognitive > N then refactor" thresholds in the end-refactor prompt.
- No iteration limit (the stop criterion is qualitative: "no metric improves further").
- No ESLint config changes.

The four MARKERS (skill calls `/test-list`, `/red`, `/green`; task calls `refactor`; `experiment-done.txt`) stay untouched. The end-refactor call is an additional `Task({subagent_type: "end-refactor"})` call **before** the `experiment-done.txt` write.

## Hypotheses

- **H1 (correctness, primary):** hybrid-v5 preserves correctness on claim-office (`verification_pct` ≥ 0.85, `experiment-done.txt` in ≥ 80 % of runs). The bundle risk from RQ-1.9 / RQ-1.10 is avoided because the end pass runs deterministically and outside the TDD loop (no interference with cycle dynamics).
- **H2 (code quality vs hybrid-v4):** hybrid-v5 reduces `cognitive_max`, `mccabe_max` and `cc_longest_function` measurably against hybrid-v4 (at least 1 σ effect size).
- **H3 (code quality vs hybrid-v4.4):** hybrid-v5 is at least **level** with hybrid-v4.4 on code quality metrics; H3' (stronger): whole-src scope sees additional cross-file improvements → an even lower `code_mass` mean or less `smell_total`.
- **H4 (TDD discipline, sanity):** `cycle_count`, `refactorings_applied`, `predictions_correct_rate` stay within 1 σ of the hybrid-v4 baseline in hybrid-v5 — the per-cycle part is byte-identical, so the cycle metrics should not diverge. A divergence would itself be a result (e.g. if knowing about the end pass demotivates the per-cycle refactor).
- **H5 (cost):** Token and wallclock surcharge against hybrid-v4 from the end pass; against hybrid-v4.4 presumably comparable or higher (the end pass iterates, hybrid-v4.4 only measures per cycle). Expected +5–25 % tokens depending on how many improvements are iterated.

## Data situation

6 cells (3 workflows × 2 katas), all at ≥ min_replicates=5 — 43 runs in the pool, none new needed:

| Kata | Workflow | n | routing mix |
|---|---|---:|---|
| claim-office | hybrid-v4 / hybrid-v4.4 / hybrid-v5 | 8 / 5 / 5 | all portkey |
| game-of-life | hybrid-v4 | 15 | 5 native + 10 portkey |
| game-of-life | hybrid-v4.4 | 5 | native |
| game-of-life | hybrid-v5 | 5 | native |

The game-of-life cells were run partly native (RQ-1.14 fill), partly portkey (older workflow-dev runs); `controls.model: {any: [...]}` treats both as the same model (see caveat).

## Caveats

- **Label asymmetry (no routing difference any more):** Since 2026-05-25 every run in the container goes through `experiments/docker/.env` (Portkey gateway via Vertex EU). The model labels (`opus-4-7-no-thinking` vs `opus-4-7-portkey-no-thinking`) differ only as a CLI argument in `MODEL_CONFIGS`: the Portkey label sets `@vertex-eu-global/...`, the non-Portkey label the bare `claude-opus-4-7`. Since 2026-05-27 the bare label produces a `400 x-portkey-config required` (Portkey cannot resolve the provider without the prefix) — hence the canonical model for the v6.5 fill is `opus-4-7-portkey-no-thinking`. The 5 reused hybrid-v4.4 runs from RQ-1.11 carry the old label `opus-4-7-no-thinking` but took the same Portkey path; `controls.model: {any: [...]}` merges both.
- **Single-shard for hybrid-v5:** Long iterative end-refactor sessions on Opus 4.7 × claim-office carry a cut risk under parallel Portkey shards (memory `portkey-shards-external-cut-risk.md`); run fill runs one at a time.
- **The end-refactor pass is iterative with no hard limit:** If a run finds many improvements, the end pass can consume several thousand tokens and a lot of wallclock. The TDD cycle part is decoupled from that (the cycles were already complete), but `duration_seconds` and `total_tokens` will on average sit above hybrid-v4.
- **Bundle caveat (causal localization):** The end-refactor agent combines (a) whole-src scope, (b) iterative multiple refactorings, (c) pre/post measurement. If hybrid-v5 beats hybrid-v4.4, it is not separable whether the extra effect comes from the whole-src view or from the repeated iteration.
- **Routing mix (`any:` across Portkey + native):** opus-4-7 is treated as the **same model** across both routings — code quality and correctness are routing-invariant (same weights, same outputs). **But `duration_seconds` and `total_tokens` are not:** different hardware and caching strategy per route. In routing-mixed cells (game-of-life hybrid-v4: 5 native + 10 portkey) the cost mean is therefore a mixed mean and **not** readable as a clean comparison. Consequence for the findings: costs are reported separately per routing, cost trophies only within the same routing.
- **Cross-comparing absolute values between the katas is off limits:** claim-office (Code Mass (APP) ~800) and game-of-life (Code Mass (APP) ~160) are **never** averaged (repo methodology). Each kata gets its own block in the findings; the workflow comparison happens exclusively *within* a kata.

## Status / next steps

Complete — all 6 cells at n ≥ 5 (43 runs). This RQ unites the formerly separate claim-office study (RQ-1.12) and game-of-life study (previously RQ-1.14, now merged in here). Result in [findings.md](findings.md): on **both** katas the per-cycle refactor hybrid-v4.4 lowers the Complexity Peak furthest below hybrid-v4; the end refactor hybrid-v5 is level with hybrid-v4.4 on claim-office but shows no robust gain on the single-file GoL library (and is the most expensive there). Correctness/discipline intact everywhere. No global v6.5 promotion over hybrid-v4; metric-driven refactor is worth it, but the effective point of leverage is kata-dependent.

## Findings

See [findings.md](findings.md).
