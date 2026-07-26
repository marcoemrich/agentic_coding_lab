# RQ-model-quality-cursor — Findings

Model effect (Opus / Composer / Grok) on code quality and TDD discipline over the **cursor-cli harness** (`cursor-agent`), kata `game-of-life-example-mapping`, workflow `v6.2.1-phase-continuation-cursor`. n=5 per cell, all 15 runs correct (correctness internal & external 100 % each, all `completed_within_budget`).

Model IDs: `opus-cursor` → `claude-opus-4-8-medium`, `composer-cursor` → `composer-2.5`, `grok-cursor` → `cursor-grok-4.5-medium`.

## Overview

Primary code-quality metrics (all **lower = better**) plus correctness. Since all three models reach 100 % correctness (internal), the quality trophies are not constrained by correctness — all cells qualify.

| Metric (direction) | opus-cursor | composer-cursor | grok-cursor |
|---|---:|---:|---:|
| `cognitive_max` (Cognitive Peak, ↓) | 16.6 | **8.2** 🏆 | 10.6 |
| `cognitive_avg` (↓) | 15.3 | **5.93** 🏆 | 7.2 |
| `mccabe_max` (↓) | 10.6 | **7.6** 🏆 | 8.8 |
| `mccabe_avg` (↓) | 4.33 | **2.63** 🏆 | 3.38 |
| `smell_total` (Smell Total, ↓) | 4.0 | **3.4** 🏆 | 3.6 |
| Production LoC `lines_of_code` (↓) | **27.8** 🏆 | 59.2 | 42.8 |
| Code Mass (APP) `code_mass` (↓) | **141.8** 🏆 | 182.2 | 149.2 |
| Correctness (internal) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_total` (marker usage) | 18.4 | 7.0 | 9.8 |
| `duration_seconds` (↓) | 198 | **120.8** 🏆 | 169 |
| `total_tokens` (↓) | 1.74 M | **768 k** 🏆 | 1.17 M |

`cost_usd` is missing for all runs — the cursor-cli path (Cursor subscription) provides no inline cost per run.

---

## F-1.1 — Composer writes the least complex, Opus the most concise solution

On the cursor-cli harness the three models spread clearly along two **opposing** quality axes:

- **composer-cursor** wins every complexity metric: `cognitive_max` 8.2 vs. 16.6 (opus), `cognitive_avg` 5.93 vs. 15.3, `mccabe_max` 7.6, `mccabe_avg` 2.63, `smell_total` 3.4.
- **opus-cursor** wins the volume metrics: Production LoC 27.8 vs. 59.2 (composer), Code Mass (APP) 141.8.

| Axis | opus | composer | grok |
|---|---:|---:|---:|
| `cognitive_max` (↓) | 16.6 | **8.2** 🏆 | 10.6 |
| `mccabe_avg` (↓) | 4.33 | **2.63** 🏆 | 3.38 |
| Production LoC (↓) | **27.8** 🏆 | 59.2 | 42.8 |

The spread is large for `cognitive_avg` (opus 15.3 vs. composer 5.93, ~2.5× at σ≈3.8) and likewise for Production LoC (opus 27.8 vs. composer 59.2 at σ≈6). Both clearly > 1σ.

**Rationale (code inspection confirms the metrics):** Opus packs the entire logic into one dense `nextGeneration` with triply nested loops (`dx`/`dy` + `continue` guard) — few lines, high cognitive load per line. Composer extracts `NEIGHBOR_OFFSETS` as a constant plus `cellKey()`/`parseKey()` helpers and separates the survival and birth pass into flat individual steps — more lines, but every unit simple. **Parsimony (little code) and low complexity come apart here**: the most concise model is not the least complex one. grok-cursor sits in between on both axes.

---

## F-1.2 — Model spread confirmed: the cursor-cli harness is discriminating

The harness makes model differences measurable (H3 confirmed). Over `cognitive_max` and `mccabe_avg` the three models separate clearly, at a consistent 100 % correctness — the spread is therefore a pure quality signal, not a correctness confound.

Composer is also **more efficient**: shortest runtime (120.8 s vs. opus 198 s) and fewest tokens (768 k vs. opus 1.74 M) — at equal correctness and the lowest complexity. This answers H2 (Composer as unknown): Composer does not merely keep up in code quality, it leads on the complexity and efficiency axes.

---

## F-1.3 — Opus uses the TDD marker mechanics most densely

`predictions_total` spreads strongly: opus 18.4 vs. grok 9.8 vs. composer 7.0. So opus runs more explicit prediction markers per run, with a likewise high hit rate (`predictions_correct` 18.4/18.4). `cycle_count`, by contrast, lies closer together (opus 8.4, composer 7.6, grok 9.6).

**Rationale:** Higher `predictions_total` means denser use of the workflow marker path, **not** automatically higher TDD discipline (parallel to the pi/oc finding). Composer reaches the same correctness and better complexity values with fewer markers — marker compliance and result quality are decoupled here.

---

## Caveats

- **Separate tariff confound:** Cost runs through the Cursor subscription, not Requesty (pi/OC) or the Anthropic list price (CC). `cost_usd` is therefore empty; cross-harness cost comparisons with this RQ are not possible.
- **Routing/harness confound:** All cells run over cursor-cli with the cursor-specific workflow. No 1:1 transfer of the model values to RQ-model-quality (CC) / -oc / -pi. The Opus cross-check (H1) against the other harnesses is still pending.
- `verification_pct` = 100 % mirrors `tests_passing` here (game-of-life has no external verification suite); the correctness anchor is `tests_passing` (internal).
