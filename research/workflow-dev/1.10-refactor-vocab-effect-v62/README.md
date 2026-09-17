---
id: RQ-refactor-vocab-v62
question: "Does an additive vocabulary block in the refactor agent (cyclomatic + cognitive complexity, single responsibility, smell→move table) improve code quality on the exact-hybrid-v4-cleaned-cc base without significantly impairing correctness or cost?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v4-cleaned-cc, prompt: example-mapping}  # Baseline (current default base from RQ-1.6 / RQ-1.7)
    - {workflow: exact-hybrid-v4.1-refactor-vocab-cc,   prompt: example-mapping}  # + vocabulary block (complexity awareness, SRP, smell table)
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-4-7-portkey-no-thinking
outcomes:
  # primary: code quality (the vocabulary block targets complexity recognition directly)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD discipline (sanity: the additive block must not disturb refactor behavior)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  # correctness (sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # cost (additive text → slight surcharge expected)
  - duration_seconds
  - total_tokens
min_replicates: 5
status: answered
---

# RQ-1.10: exact-hybrid-v4.1-refactor-vocab-cc vs exact-hybrid-v4-cleaned-cc (GoL + claim-office)

Does an additive vocabulary block in the `refactor` agent — cyclomatic/cognitive complexity definitions, an operationalization of single responsibility, a smell→move table — improve the code quality produced, without impairing correctness or cost?

## Motivation

The `refactor` agent in hybrid-v4 carries only **Naming Evaluation** + **Simple Design Rules** + **APP mass** as its central refactor vocabulary. Complexity (McCabe, cognitive), single responsibility and the classic smell→move mapping (Fowler vocabulary) are not named. The agent therefore lacks part of the vocabulary in which structural problems can be framed — and the lab measures exactly those problems later (`cognitive_*`, `mccabe_*`, `cc_longest_function`, `smell_complexity`).

An earlier attempt (the archived RQ-19-refactor-vocab-extended) was invalid because it built on a hybrid-v1.x line since recognized as correctness-defective (see memory `v6-rebuild-new-base`, `v6.5-correctness-setback`). The now-stable default base is `exact-hybrid-v4-cleaned-cc` (RQ-1.6 / RQ-1.7). That is what makes the retry on the same, healthy substrate meaningful at all.

The block is deliberately:
- **purely additive** (Naming Evaluation, APP, process steps, examples, red flags, remember floor byte-identical),
- **free of numeric thresholds** (no "cognitive_max < 15", no "LoC < 50") — qualitative language, conforming to the workflow convention "no thresholds in workflow prompts" (see `CLAUDE.md`),
- **deliberately Goodhart-resistant** ("No thresholds. These lenses are vocabulary for seeing and naming — not a quota for how many smells must be addressed per refactor pass.").

## Workflow definition

- **exact-hybrid-v4-cleaned-cc (baseline)** — current default base from RQ-1.6. Naming Evaluation as the only structured refactor vocabulary above APP.
- **exact-hybrid-v4.1-refactor-vocab-cc (new)** — hybrid-v4 + the blocks "Complexity Awareness (Second Refactoring Priority)" + "Single Responsibility (Naming + Cognitive together)" + "Common Smells and Typical Refactoring Moves" (10-entry table), inserted between Naming Evaluation and Rule 3.

Full diff: `diff -r experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc experiments/workflows/_archive/exact-coding/opus/exact-hybrid-v4.1-refactor-vocab-cc` (41-line insert after line 45 of `refactor.md`, otherwise byte-identical).

## Hypotheses

- **H1 (code quality)** — On game-of-life at least one of the primary complexity metrics (`cognitive_max`, `cognitive_avg`, `mccabe_max`) drops measurably against the baseline without another primary metric rising markedly at the same time. The SRP vocabulary and smell table additionally tend to push `cc_longest_function` and `cc_avg_loc_per_function` down (more extracted helpers).
- **H2 (correctness)** — `tests_passing ≥ 95 %` on game-of-life; `verification_pct` on claim-office within 1 σ of the hybrid-v4 baseline. The additive vocabulary block must not regress correctness — a smoke test against the bundle risk seen in RQ-1.8/1.9 (see memory `audit-bundle-kata-asymmetry`).
- **H3 (TDD discipline neutral)** — `refactorings_applied`, `cycle_count`, `predictions_correct_rate` each within 1 σ of the baseline. The block adds vocabulary, it does not change the process.
- **H4 (cost)** — Additive text (~41 lines) → +5–10 % `total_tokens`, wallclock largely unchanged (no additional tool call).
- **H5 (kata asymmetry)** — The effect size may differ between game-of-life and claim-office. If *stronger* on claim-office (more complex domain, more need for helper extraction): expected. If *negative* on claim-office (comparable to the RQ-1.9 result for the audit bundle): a result that blocks re-promotion.
- **H0 (falsifier)** — None of the primary complexity metrics moves measurably on either kata, or correctness regresses on claim-office: the vocabulary extension is empirically redundant to the existing naming/APP vocabulary, and hybrid-v4 stays the default. The vocabulary extension can then be booked as an effect-free language update and not promoted.

## Design

```
Factor:  workflow_x_prompt — 2 levels (exact-hybrid-v4-cleaned-cc, exact-hybrid-v4.1-refactor-vocab-cc), both example-mapping
Factor:  kata_base         — 2 levels (game-of-life, claim-office)
Control: model             — opus-4-7-portkey-no-thinking

Cells:      4 (2 workflows × 2 katas)
Replicates: n = 5 per cell
Runs:       20 total
```

n=5 by default (memory `replicates-n-reliability`: n=5 for sanity / a middling statement; n≥7 only for tight σ comparisons). Given a clear bundle signal or a need for σ reduction, this can be topped up to n=10.

Portkey routing, shards possible (GoL has short sessions, claim-office medium; no notable cut risk at n=5, cf. memory `portkey-shards-external-cut-risk`).

## Caveats

- **Bundle, three sub-blocks at once** — complexity awareness + SRP + smell table are added in one step. Given a positive result, which sub-block carries it remains open. Follow-up RQs (complexity-only, SRP-only, smell-table-only) are possible if a bundle effect materializes and disambiguation becomes important.
- **Goodhart risk (training bias)** — the complexity definitions ("Each `if`, `else if`, ...") name constructs that appear in the measurement metrics. The model could avoid those constructs mechanically without any structural gain (e.g. replacing an `if` chain with a wider lookup table that inflates `cc_loc`). Hence the cross-check: if `cognitive_max` drops but `cc_loc` rises proportionally, the result is Goodhart-tinted. The block is deliberately worded so the "cognitive vs McCabe" trade-off is named explicitly — but that does not eliminate the risk.
- **Kata asymmetry** — game-of-life is code-quality-primary, claim-office correctness-primary. The vocabulary block is a code quality intervention; claim-office comes along in this RQ as **sanity**. If a code quality gain appears on claim-office without a loss of correctness: strong; if only GoL benefits: expected (kata fit); if correctness falls on claim-office: stop.
- **Mass vs cognitive conflict** — APP mass and cognitive complexity can point in different directions (e.g. helper extraction lowers cognitive but adds `invocation` mass). The block adds cognitive as a second lens without demoting APP. The effect on `code_mass` is therefore open — it can rise or fall.
- **Single model** — `opus-4-7-portkey-no-thinking`. Memory `opus-46-vs-47-not-equivalent` warns against switching models within a workflow chain; cross-model validation on Sonnet or Haiku is reserved for a follow-up RQ should a bundle effect materialize.

## Findings

See [findings.md](findings.md). Answered: **H0 (falsifier) applies.**

- **H1 (code quality) refuted** — on game-of-life none of the primary complexity metrics moves beyond 1 σ; `code_mass` rises by 12 %.
- **H2 (correctness) refuted** — `verification_pct` on claim-office 0.96 → 0.23, 4/5 runs ≤ 0.13. No result within 1 σ of the baseline.
- **H3 (discipline neutral) confirmed on game-of-life**, refuted on claim-office (`cycle_count` 37.4 → 16.0 as a consequence of the abort, F-1.10.3).
- **H4 (cost) confirmed on game-of-life** (+15.5 % tokens); not evaluable on claim-office because the agent stops early.
- **H5 (kata asymmetry) confirmed, in the negative direction** — the case named in H5 as a re-promotion blocker has occurred (same pattern as RQ-1.9).

**Consequence:** `exact-hybrid-v4.1-refactor-vocab-cc` discarded, moved to `experiments/workflows/_archive/`. `exact-hybrid-v4-cleaned-cc` remains the default. Aggregating this RQ requires `--allow-archived`.

## Data source

All runs in `experiments/runs/` with
`workflow ∈ {exact-hybrid-v4-cleaned-cc, exact-hybrid-v4.1-refactor-vocab-cc}`,
`kata ∈ {game-of-life-example-mapping, claim-office-example-mapping}`,
`model = opus-4-7-portkey-no-thinking`.

hybrid-v4 baseline runs can be reused from RQ-1.6 (GoL) and RQ-1.9 (claim-office) where model and prompt style match exactly. Otherwise refill to n=5 per cell.

## Sources

- hybrid-v4 workflow: `experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc/.claude/agents/refactor.md`.
- exact-hybrid-v4.1-refactor-vocab-cc diff: `diff -r experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc experiments/workflows/_archive/exact-coding/opus/exact-hybrid-v4.1-refactor-vocab-cc`.
- Baseline RQs: [RQ-1.6](../1.6-v62-cleanup-validation-v61-with-why/findings.md), [RQ-1.7](../1.7-v62-cleanup-validation-gol/findings.md), [RQ-1.9](../1.9-audit-bundle-validation-claim-office/findings.md).
- Kata-asymmetry precedent: [RQ-1.8](../1.8-audit-bundle-effect-v62/findings.md) (GoL-positive) vs [RQ-1.9](../1.9-audit-bundle-validation-claim-office/findings.md) (claim-office-negative).
- Workflow convention: `CLAUDE.md` section "Editing workflows" ("Keine numerischen Schwellwerte in Workflow-/Agent-Prompts").
