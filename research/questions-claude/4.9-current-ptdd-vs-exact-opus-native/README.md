---
id: RQ-current-ptdd-vs-exact-opus-native
question: "On native Opus 5, how does the current SOL Predictive-TDD workflow compare with the default EXACT Coding workflow on correctness, decomposition, development behavior, and efficiency?"
factors:
  workflow_x_prompt:
    - {workflow: exact-sol-v1.5-tcr-parity-domain-trial-cc, prompt: example-mapping}
    - {workflow: exact-hybrid-v2-testlist-fix-cc, prompt: example-mapping}
controls:
  model: opus-5-no-thinking
  kata_base: claim-office
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  - code_mass
  - cc_loc
  - test_lines
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: geplant
---

# RQ-current-ptdd-vs-exact-opus-native: Current PTDD vs. Default EXACT Coding on Native Opus

## Question

Does the current SOL Predictive-TDD workflow transfer to Opus 5 well enough to match or beat the default EXACT Coding workflow, when model, native provider, harness, kata, and prompt style are held constant?

This is a comparison of two complete workflow bundles, not a single-instruction causal isolation:

| Cell | Method | Architecture | Refactor emphasis |
|---|---|---|---|
| `exact-sol-v1.5-tcr-parity-domain-trial-cc` | Predictive TDD with a complete inactive test list | one shared context | Four Rules, domain-responsibility review, mandatory boundary trial |
| `exact-hybrid-v2-testlist-fix-cc` | EXACT Coding Red–Green–Refactor | phase commands plus isolated refactor subagent | Four Rules and APP |

## Why these are the current workflows

- `exact-sol-v1.5-tcr-parity-domain-trial-pi` is the current SOL-line default for large, novel specifications in `model-recommendation-matrix.md`. This RQ uses its content-equivalent Claude Code port.
- `exact-hybrid-v2-testlist-fix-cc` is the current correctness-oriented EXACT Coding baseline for `opus-5-no-thinking` in `workflow-construction.md` and the default source used by the baseline export.
- `claim-office-example-mapping` is used because both recommendations target novel, multi-rule work and because its external verifier prevents internally green but incomplete solutions from being treated as correct.

The earlier `RQ-sol-line-on-opus-cc` does not answer this question. It measured the older `exact-sol-v1-cc` against `exact-hybrid-v4-cleaned-cc`; neither is the current pair named above.

## Routing — binding

Every run uses Claude Code with `opus-5-no-thinking`, whose bare API model id is `claude-opus-5`. `run-batch.sh` detects that native id and blanks the container-global Requesty variables for the invocation, causing Claude Code to use the mounted native Anthropic OAuth credentials. **No Requesty-routed model id may be substituted or pooled into either cell.**

Both cells must be executed in the same native-only batch plan. The route, model, thinking setting, harness, kata, and prompt are controls; only the workflow bundle varies.

## Claude Code port of the SOL workflow

`exact-sol-v1.5-tcr-parity-domain-trial-cc` is a harness port of the current pi workflow, created as a prerequisite for this RQ. The port preserves:

- the complete inactive test-list contract;
- one shared context and one composed PTDD loop;
- prediction/check/narrow-undo semantics, with no method commits or hard resets;
- Four Rules, domain-responsibility review, and mandatory domain-boundary trial;
- stack profiles and parser-visible phase, prediction, refactor, and done markers.

Only harness mechanics change: pi skills/`AGENTS.md` become Claude Code commands/rules, and CC prediction outcomes use the parser-required `✅ Correct` / `❌ Incorrect` form. There are no per-phase subagents in the port.

A port is a possible confound until smoke-tested. Before fill runs, run one `game-of-life-prose` smoke and verify `cycle_count`, `refactorings_applied`, predictions, `tests_passing`, and the done marker. The smoke is not part of either RQ cell.

## Primary contrasts

1. **Correctness:** compare `verification_pct`, `tests_passing`, and completion within budget. Correctness is a gate; code-quality wins from incomplete runs are not actionable.
2. **Decomposition:** `cc_avg_loc_per_function` is primary, with median and longest function as robustness checks. Katas are never averaged.
3. **Complexity and smells:** compare Cognitive Complexity, McCabe, and Smell Total after checking correctness distributions.
4. **Process:** compare prediction accuracy and refactoring behavior, while recognizing that the PTDD cell records inline phase markers and the default cell uses command/subagent events. Raw cycle counts describe each workflow and are not interpreted as an architecture-neutral amount of discipline.
5. **Efficiency:** compare wallclock, tokens, and native Anthropic list-price estimates. `cost_usd` is a comparison value, not a subscription invoice.

`code_mass` is reported without a trophy because it is an ambivalent mechanism metric: lower mass can mean parsimony or missing decomposition.

## Hypotheses

- **H1 — PTDD transfer:** the current PTDD port preserves full external correctness and improves decomposition relative to the default EXACT Coding workflow, reproducing the domain-boundary benefit seen on SOL.
- **H2 — Opus default holds:** the default EXACT Coding workflow matches or beats PTDD on decomposition at equal correctness while using fewer tokens or less wallclock; the SOL promotion is model-specific.
- **H3 — architecture cost:** PTDD is faster or cheaper because it keeps the loop in one context, even if product-quality outcomes are tied.
- **H4 — port sensitivity:** anomalous marker loss, premature termination, or a result sharply inconsistent with the source SOL runs indicates a CC-port problem rather than evidence about PTDD. Diagnose the smoke and transcripts before interpreting the contrast.

## Caveats

1. This compares complete methods. Differences include loop semantics, context architecture, refactor guidance, and trial obligations; no result may be attributed to one component alone.
2. The SOL arm is a new Claude Code port. Harness adaptation is held as narrow as possible but remains a validity risk.
3. Thinking is off in both cells. Results do not automatically transfer to adaptive-thinking Opus 5.
4. One kata and one prompt style bound external validity. This RQ makes no cross-kata average or model-independent recommendation.
5. Query-based aggregation may reuse matching historical default-cell runs only when they have exactly the same workflow, model id, prompt, and kata. Requesty runs never match this RQ.
