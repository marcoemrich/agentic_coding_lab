---
id: RQ-app-subordination-measurement-sol
question: "On the OpenAI subscription route, does subordinating APP mass to the Four Rules recover the decomposition that the unsubordinated brief suppresses — and does adding pre/post measurement improve the result further, at what cost in duration as the measurement moves from the model to deterministic tools?"
factors:
  workflow:
    - basic-sol-tdd-pi                        # reference: Four Rules only, no APP, no measurement
    - basic-sol-tdd-app-pi                    # A:  + APP subordinated under Rule 4, qualitative
    - basic-sol-tdd-app-measured-model-pi     # B1: A + pre/post measurement, model computes all three
    - basic-sol-tdd-app-measured-eslint-pi    # B2: A + ESLint for cognitive/McCabe, mass by hand
    - basic-sol-tdd-app-measured-tool-pi      # B3: A + ESLint + AST script, model computes nothing
controls:
  model:
    # Label variants of one configuration, not two models: both resolve to pi
    # model "openai-codex/gpt-5.6-sol", same pi-config profile, thinking=false.
    # Canonical label first. Inherited from RQ-1.17 — see "Model `any:`" below.
    any: [gpt-5-6-sol-codex, gpt-5-6-sol-codex-no-thinking]
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primary: decomposition — the axis the subordinated brief should recover
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  # decomposition witnesses — these are what B1/B2/B3 measure during the run
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  # mechanism witness: mass is what the brief subordinates. Expected to rise
  # where decomposition improves. Reported without trophy — see RQ-1.17.
  - code_mass
  - cc_functions
  - cc_loc
  # correctness — gate, not differentiator
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost — the second half of the question, and the axis the gradient is built on
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-app-subordination-measurement-sol: Can APP Be Rehabilitated, and What Does Measuring Cost?

## The question this answers

`RQ-app-vs-four-rules-sol` (workflow-dev/1.17) established that on Sol the APP
brief actively harms decomposition: the APP-optimising cell reached the **lowest**
Code Mass and the **worst** `cc_avg_loc_per_function` in the field — behind even the
structureless v3 floor. Its refactor brief did carry a guard ("Rule 2 trumps APP:
Clarity over low mass"), and Sol optimised past it.

`RQ-sol-line-on-opus-cc` (questions-claude/4.6) then showed the effect is
**model-specific**: on both Opus generations the same APP brief produced the *best*
decomposition in the field (F-4.6.2, median 2.00 at σ 0.00). Opus weighs the guard;
Sol does not.

That leaves two questions RQ-1.17 posed and could not answer. Its own closing line
asks whether removing the mass table recovers the decomposition. This RQ asks the
stronger version — **not whether removing APP helps, but whether stating its rank
properly does** — and pairs it with the cost question that RQ-1.11 left open.

## The two axes

### Axis 1 — does subordination work? (`basic-sol-tdd-pi` → `-app`)

`basic-sol-tdd-app-pi` takes the native Sol line and rewrites section 4 of the
`predictive-tdd` skill. The Four Rules list is unchanged; what changes is that
Rules 2, 3 and 4 are spelled out:

- **Rule 2** names decomposition as the means to reveal intention, requires cuts
  along **domain seams** rather than mechanical ones, and cites cognitive and
  cyclomatic complexity as *evidence* pointing at candidates — never as targets.
- **Rule 3** separates duplicated knowledge from repeated characters, and yields to
  Rule 2 where de-duplication would cost clarity.
- **Rule 4** carries the APP mass formula, explicitly as a Rule 4 measure, with the
  arithmetic made plain: *extraction almost always raises mass, and that is the
  normal case.* Two prohibitions follow ("never undo an extraction because mass went
  up", "never inline a well-named function to lower mass").

This is the same subordination patch that `v6.7-app-subordinate-cc` applies to the
v-line, rebuilt on the Sol line and extended with the Rule 2/3 elaboration.

### Axis 2 — does measuring help, and what does it cost? (`-app` → B1/B2/B3)

Three arms share the byte-identical brief of Arm A and differ **only** in where the
pre/post numbers come from:

| Arm | Cognitive / McCabe | APP mass |
|---|---|---|
| `-app` | not measured | not measured |
| `-app-measured-model` (B1) | model, by hand | model, by hand |
| `-app-measured-eslint` (B2) | ESLint | model, by hand |
| `-app-measured-tool` (B3) | ESLint | `app-mass.mjs` (AST) |

The gradient exists because of **F-1.4** (RQ-1.11): metric-driven refactoring cost
+109 % duration and +130 % tokens, and the finding attributes the bulk of that not
to the ESLint calls but to the model computing APP and McCabe **by hand** for every
function and documenting the result. No arm in this lab has ever measured
deterministically end-to-end — B3 is the first.

**F-1.3** (RQ-1.11) predicts this is safe to try: per-cycle overhead triggers the
selfstop pathology when it is *semantic* (vocabulary, rationale), but not when it
runs through deterministic tools.

## Measurement mechanics — binding

Two details decide whether B2 and B3 measure anything at all.

**The container's ESLint config cannot report these numbers.** `run-batch.sh`
scaffolds `eslint.config.mjs` with `sonarjs/cognitive-complexity` at threshold 10.
Kata code typically sits at 2–5, so the rule stays silent and an agent calling
`pnpm exec eslint` sees an empty result — then computes by hand anyway. B2 and B3
therefore create a **separate reporting config** (`.eslint.complexity.mjs`) with both
thresholds at 0, which is the same trick `analyze-run.sh` uses post-run. The project's
own config stays untouched and remains the real lint gate.

Consequence to watch: under threshold 0 *every* function warns, with ESLint's fixed
imperative phrasing ("Refactor this function to reduce its Cognitive Complexity from
3 to the 0 allowed"). Both prompts state twice that these warnings are measurement
output and never something to fix. **If a run tries to drive them to zero, that is a
prompt failure, not a workflow result** — check the transcript before reading the
cell's numbers.

**APP mass has no tool in this lab.** The pipeline's `code_mass` is a grep heuristic
living inside `analyze-run.sh`, not a callable command. B3 therefore ships
`app-mass.mjs` inside the workflow (`.pi/tools/`), which walks the TypeScript AST and
counts the six APP components directly. It is copied into the run directory by the
existing recursive `.pi/` copy — no change to `run-batch.sh`.

### The two APP numbers are not the same number — binding

`app-mass.mjs` and the pipeline's `code_mass` measure differently and **will not
agree**. On a sample claim-office run: **297 (AST) vs. 534 (grep)**, despite the AST
value additionally counting the 87 `bindings` the pipeline formula omits entirely.

The divergence is dominated by two grep artefacts:

- `assignments`: **45 (grep) vs. 3 (AST)**. The pattern `[^=!<>]=[^=]` matches every
  line containing `const x = …`, and `grep -c` counts *lines*, not occurrences — then
  multiplies by weight 6, the heaviest component.
- `invocations`: `\w+\s*\(` counts `if (`, `for (` and `return (` as function calls.

Reading rules that follow:

- `code_mass` stays the reported outcome, exactly as in RQ-1.17 — comparable across
  cells because every cell is measured the same way, and **without a trophy**.
- The AST figure is **workflow-internal only**. It never enters the findings table.
- Do not read the two against each other as agreement or disagreement.

## Hypotheses

- **H1 (subordination works).** `-app` beats `basic-sol-tdd-pi` on
  `cc_avg_loc_per_function` and `cc_median_loc_per_function` by more than 1 σ.
  → Stating APP's rank is enough on Sol; the RQ-1.17 damage came from an
  under-specified brief, not from APP as such. The cheapest available fix for the
  v-line on Sol is a brief rewrite, not removing the metric.
- **H2 (subordination is not enough).** `-app` lands inside 1 σ of the reference, or
  worse. → On Sol the mere presence of a mass formula degrades decomposition
  regardless of how it is ranked. F-4.6.2 then reads as an instruction-following
  difference between model families, and the recommendation for Sol is to omit APP.
- **H3 (measuring helps).** At least one of B1/B2/B3 beats `-app` on the
  decomposition metrics by more than 1 σ. → Evidence beats exhortation: naming the
  metrics in prose is weaker than making the model look at them.
- **H4 (determinism is the cheaper half).** B3 reaches B1's quality at materially
  lower `duration_seconds` and `total_tokens`. → F-1.4's cost attribution is
  confirmed, and the operational rule is that metric-driven refactoring should be
  tool-driven. A null result here — B3 no cheaper than B1 — would mean the cost sits
  in the measure-decide-document loop itself, not in the arithmetic.
- **H5 (measurement is inert).** B1/B2/B3 all sit inside 1 σ of `-app` on the quality
  metrics while costing more. → The brief does the work and the measurement is
  ceremony; RQ-1.11's gains would then be attributable to the v-line's end-refactor
  pass rather than to measurement per se.

Reading rule inherited from RQ-1.14: absolute thresholds are not comparable across
models or routes. Only ranking and direction *within this RQ* are evaluated.

## Model `any:` rationale

Inherited unchanged from RQ-1.17. The reference cell's runs carry the label
`gpt-5-6-sol-codex`; `-no-thinking` is a profile label from `RQ-route-effect-pi`'s
2×2 matrix, not a route or a model difference. `run-batch.sh` maps both to
`openai-codex/gpt-5.6-sol` with the same pi-config profile and `thinking: false`, and
per F-1.3.5 reasoning is on regardless on this route.

**Caveat:** if a cell behaves anomalously, the label split is the first thing to
re-check, together with the pi-config profile actually mounted for that batch.

## Caveats

1. **One cell is reused, four are new.** `basic-sol-tdd-pi` × claim-office ran
   2026-08-16 for RQ-1.16 and was reused by RQ-1.17. Any drift on the subscription
   route between then and this batch sits in the four new cells collectively — but
   because all four are filled together, drift cannot explain differences *among*
   them, only their common offset from the reference.
2. **The B-arms are not free of the A-arm's brief.** They inherit it byte-identically,
   so Axis 2 is clean; but a failure of H1 makes the B-arms measurements of a brief
   that does not work, which is still interpretable (does measurement rescue a weak
   brief?) but no longer a recommendation path.
3. **`app-mass.mjs` is new code in the measurement path.** It is verified against a
   real claim-office run and against constructed edge cases (type-only declarations,
   destructuring, compound assignment, spec exclusion), but a defect in it would
   corrupt B3's in-run signal. It cannot corrupt any reported outcome — no findings
   metric derives from it.
4. **Setup cost is inside the measurement.** B2 and B3 write `.eslint.complexity.mjs`
   themselves during preparation rather than receiving it from the scaffold. That is
   deliberate — installing the measurement is part of what measuring costs — but it
   means a few hundred tokens of each B-cell's budget are one-off setup, not per-cycle
   measurement.
5. **Cost figures are route-internal.** The subscription route bills per subscription;
   `cost_usd` is a list-price estimate. Compare within this RQ only.
6. **No phase-continuation overlay.** The Sol line carries its own lab-only block.
   Systematic `completed_within_budget = false` in any cell is read as a harness
   stall, not a workflow effect.

## Open questions

- If H1 holds on Sol: does the same elaborated brief change anything on Opus, where
  the unelaborated one already works (F-4.6.2)? → a ceiling test for brief quality.
- If H4 holds: should `app-mass.mjs` and the threshold-0 config move into the v-line's
  end-refactor agents, where F-1.4 located the cost in the first place?
- Does the Rule 2/3 elaboration carry its weight on its own — i.e. the same brief
  *without* the APP block, isolating "spell out decomposition" from "rank APP"?
- Does the effect reproduce on the Requesty route, where F-1.3.6 documents a route
  effect on exactly these metrics?
