---
id: RQ-app-vs-four-rules-sol
question: "On the OpenAI subscription route, does a refactor brief that optimises APP mass (v6.2.1) decompose worse than one governed by the Four Rules of Simple Design alone (basic-sol-tdd) — at constant model, harness, kata and prompt style?"
factors:
  workflow:
    - v3-basic-tdd-pi                  # floor: TDD without architecture, no refactor brief
    - basic-sol-tdd-pi                 # Four Rules only, no mass metric
    - v6.2.1-phase-continuation-pi     # Opus-derived line, APP mass in the refactor brief
controls:
  model:
    # Label variants of the same configuration, not different models: both ids
    # resolve to pi_model "openai-codex/gpt-5.6-sol" with the same pi-config
    # profile and thinking=false (run-batch.sh:802-803). Canonical label first.
    # See "Model `any:` rationale" below.
    any: [gpt-5-6-sol-codex, gpt-5-6-sol-codex-no-thinking]
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primary: decomposition — the axis the APP brief is expected to move
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  # mechanism witness: APP mass is what the v6.2.1 brief optimises. Expected to
  # run *against* the decomposition metrics. Reported without trophy.
  - code_mass
  # blind-spot controls: these must NOT separate if the mechanism is what the
  # RQ claims — a callback chain scores well on them. See "Metric blind spot".
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  # correctness — gate, not differentiator
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline — n/a on the v3 cell (no phase markers)
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-app-vs-four-rules-sol: Does the APP Brief Suppress Decomposition on Sol?

## The question this answers

`RQ-native-sol-workflows-sub` (workflow-dev/1.16) closes with an open question it
could not answer from its own cells: *"Does the inline arm's advantage come from the
methodology or from the removal of APP?"*

The observation that motivates it sits across two RQs rather than inside one. On
`game-of-life-example-mapping`, same model, same route, same kata, same prompt style:

| Cell | `cc_avg_loc_per_function` | Code Mass (APP) | Refactor brief |
|---|---:|---:|---|
| `v3-basic-tdd-pi` | 6.75 | 176.4 | — (no brief) |
| `basic-sol-tdd-pi` | 7.27 | 162.8 | Four Rules of Simple Design |
| `v6.2.1-phase-continuation-pi` | **11.53** | **153.2** | Four Rules **+ APP mass** |

The APP-optimising cell has the **lowest** mass and the **worst** decomposition, and
those two facts are not independent. `v6.2.1-phase-continuation-pi/.pi/agents/refactor.md`
prescribes the mass table that makes extraction expensive:

> **Invocation** (Mass: 2): Function calls

An extracted function is charged twice — once for existing, once per call site.
Minimising mass therefore rewards inlining. The brief does carry a guard
("Rule 2 trumps APP: Clarity over low mass"), which is precisely what this RQ tests:
whether Sol weighs that guard or optimises the number.

That reading is currently **inferred from a cross-RQ comparison**, and on the small
kata where every cell sits inside 1 σ on most metrics. This RQ tests it directly, on
the kata where the effect has room to show.

## Why claim-office, and why this is not a cell in RQ-1.16

`claim-office` is the only kata in this lab where decomposition metrics measure
decomposition rather than function length. RQ-1.16's sphinx rows make the contrast
concrete — there, every cell produces essentially **one** production function, so
`cc_avg`, `cc_median` and `cc_longest` collapse onto the same number:

| | sphinx | game-of-life | claim-office |
|---|---:|---:|---:|
| function count (`basic-sol-tdd`) | 1.0 | ~6 | 9.8 |
| `cc_avg` vs `cc_median` | identical | close | 6.60 vs 4.70 |

On claim-office the two diverge, i.e. there is a real length distribution and real
structure to be judged. It is also the kata where RQ-1.16 found its one decisive
result (F-1.16.1), so the third cell lands next to a known, non-tied contrast.

This is a separate RQ rather than a fourth cell in RQ-1.16 because RQ-1.16 is a
**methodology** comparison — native Sol line against the structureless floor. Adding
the Opus-derived v6.2.1 line to its `workflow_x_prompt` list would change what that RQ
is about and re-open a factor it deliberately holds closed. Here the axis is the
refactor brief, and v3 is carried over as the shared floor so both RQs anchor on the
same baseline.

**Consequence: `v6.2.1-phase-continuation-pi` × claim-office has no runs on any Sol
route** (checked 2026-08-17 — 0 directories). It must be filled as part of this RQ.
The two other cells exist and are reused unchanged from RQ-1.16.

## Model `any:` rationale — binding

The existing cells carry the model label `gpt-5-6-sol-codex`, the existing v6.2.1
Codex runs carry `gpt-5-6-sol-codex-no-thinking`. These are **not** two models and not
two routes. `run-batch.sh` maps both to the same pi model string
(`openai-codex/gpt-5.6-sol`), both use the `pi-config` profile, and both record
`thinking: false`. The `-no-thinking` suffix is a label inherited from
`RQ-route-effect-pi`'s 2×2 matrix, where it distinguishes a *pi-config profile*, not a
route.

Per F-1.3.5 reasoning is on regardless on this route — `--thinking off` sets pi's
level, not whether the Responses API reasons. So the suffix carries no measurable
difference here, which is the documented condition for `controls.model: {any: [...]}`.

**Caveat:** this is the assumption the `any:` rests on. If a cell behaves anomalously,
the label split is the first thing to re-check, together with the pi-config profile
actually mounted for that batch.

## Metric blind spot — and why it is an outcome here

RQ-1.14 and RQ-1.16 both record that `code_mass`, `cognitive_max` and `mccabe_max`
fail to detect missing abstraction: Cognitive Complexity resets its nesting counter at
every function boundary, and APP has no notion of nesting at all. A single long
function built from callback chains scores *better* on all three than the same logic
split into named domain functions.

In those RQs that is a limitation to work around. **Here it is part of the prediction.**
If the mechanism is what this RQ claims, the metrics should split into two groups:

- `cc_avg_loc_per_function`, `cc_median_loc_per_function`, `cc_longest_function`
  separate — the APP cell decomposes worse.
- `cognitive_max`, `mccabe_max`, `code_mass` do **not** separate against the APP cell,
  or separate in its favour — because they are the metrics the callback trick defeats.

A result where all metrics move together would falsify the mechanism and point at a
plain quality difference between the two workflow lines instead.

`cc_avg_loc_per_function` is the binding decision metric, `cc_median_loc_per_function`
the robustness check against outliers. Neither measures naming. `code_mass` is
reported without a trophy — here explicitly as the mechanism witness, not as a
quality ranking.

## Measurement limit — v3 cell

Inherited from RQ-1.14 and RQ-1.16: **TDD-discipline metrics are not defined on v3.**
It prescribes no phase markers, so `cycle_count`, `refactorings_applied` and
`predictions_correct_rate` are reported as **n/a**, never as 0, and carry no trophy in
those rows. Correctness and code-quality metrics are unaffected — they are measured
externally from the source tree.

## Hypotheses

- **H1 (APP suppresses decomposition).** `v6.2.1-phase-continuation-pi` lands worse
  than `basic-sol-tdd-pi` on `cc_avg_loc_per_function` and `cc_median_loc_per_function`
  by more than 1 σ, while reaching **lower** Code Mass, and does not separate against
  it on `cognitive_max`/`mccabe_max`.
  → The APP brief is the driver. RQ-1.16's open question is answered: the native line's
  advantage comes substantially from removing APP, not only from the methodology. The
  lever for the v-line on Sol is the refactor brief, not the architecture.
- **H2 (line effect, not brief effect).** The APP cell is worse on decomposition *and*
  on `cognitive_max`/`smell_total`, i.e. every metric moves together.
  → The mechanism above is not supported; what separates the lines is general quality,
  and the APP brief is a bystander. Reading the game-of-life numbers as an APP effect
  would then be a mis-attribution.
- **H3 (no effect on the large kata).** All three cells sit inside 1 σ on the
  decomposition metrics, as they do on game-of-life and sphinx.
  → The game-of-life gap was kata-specific or noise at n=5. F-1.16.1's advantage is
  then attributable to the methodology after all, and APP is exonerated.
- **H4 (correctness regression).** The APP cell drops below the 100 % that both
  existing cells reach on this kata.
  → Disqualifying for a recommendation regardless of its decomposition numbers, and
  worth reading against F-1.16.4, where the RQ-1.16 subagent arm failed on exactly the
  late multi-step scenarios.

Reading rule inherited from RQ-1.14: absolute thresholds are not comparable across
models or routes. Only ranking and direction *within this RQ* are evaluated.

## Caveats

1. **Two cells are reused, one is new.** `v3-basic-tdd-pi` and `basic-sol-tdd-pi` ran
   2026-08-16 as part of RQ-1.16; the v6.2.1 cell is filled later. Any drift on the
   subscription route between those dates sits in the new cell alone — there is no
   third workflow to cross-check it against, unlike RQ-1.16 where v3 spans all katas.
2. **The brief is not the only difference.** `v6.2.1-phase-continuation-pi` and
   `basic-sol-tdd-pi` differ in skill structure and phase vocabulary as well as in the
   refactor brief. This RQ isolates the axis better than the cross-RQ comparison it
   replaces, but not perfectly. The clean isolation — swapping the APP brief *into* the
   native line, holding architecture constant — remains the follow-up.
3. **Reasoning is a constant, not a factor** (F-1.3.5), and it is on in every cell
   including v3.
4. **Cost figures are route-internal.** The subscription route bills per subscription;
   `cost_usd` is a list-price estimate. Compare within this RQ only.
5. **No continuation overlay on v3 or the native cell.** v6.2.1 carries its own
   phase-continuation section. Systematic `completed_within_budget = false` in any cell
   is read as a harness stall, not a workflow effect.

## Open questions

- Does the effect reproduce on the Requesty route, where F-1.3.6 documents a route
  effect on exactly these metrics? → the same three cells on `gpt-5-6-sol`.
- Does it appear on Opus, or is it Sol-specific? `v6.2.1` × `opus-5-requesty` reaches
  `cc_avg_loc_per_function` 2.62 on game-of-life — the best value in the comparison,
  with the same APP brief. That suggests Opus weighs the "clarity trumps APP" guard
  that Sol appears to ignore, which would make this an instruction-following finding
  rather than a brief-design finding.
- If H1 holds: does removing only the mass table from the v6.2.1 refactor agent, leaving
  everything else intact, recover the decomposition? → the decisive isolation, and the
  cheapest workflow change the result would license.
