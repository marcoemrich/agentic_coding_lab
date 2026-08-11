# RQ-kata-1.2 — Findings

Does `sphinx-score` carry an example-mapping effect, and is it sharper than
on `claim-office`?

Data base: 24 runs, 4 cells × n=6, all `exit_reason = ok`,
`v6.6-lab-split-cc` × `opus-5-no-thinking`.

## Übersicht

Correctness (external) — `verification_pct`, höher = besser. Trophy per kata,
since the two katas have different verification suites (16 vs. 15 scenarios)
and their absolute levels are not comparable.

| kata | example-mapping | prose | gap |
|---|---:|---:|---:|
| sphinx-score | **1.00** 🏆 (σ 0) | 0.15 (σ 0.06) | **0.85** |
| claim-office | **0.94** 🏆 (σ 0.03) | 0.27 (σ 0.00) | 0.67 |

Cost and shape, same cells. Quality/efficiency trophies are **correctness-gated**:
only `sphinx-score-example-mapping` reaches `verification_pct = 1.0`, so it is the
only cell eligible for a 🏆 on the non-correctness rows. The prose columns are
listed for reference, not as competitors — their low numbers come from
implementing a smaller, wrong rule set.

| Metric (Richtung) | sphinx em | sphinx prose | claim-office em | claim-office prose |
|---|---:|---:|---:|---:|
| Correctness (internal) — `tests_passing` (höher = besser) | **100 %** 🏆 | 100 % | 100 % | 100 % |
| `cost_usd` (kleiner = besser) | **$12.86** 🏆 | $14.64 | $78.98 | $47.76 |
| `duration_seconds` (kleiner = besser) | **1475** 🏆 | 1262 | 5514 | 3605 |
| `total_tokens` (kleiner = besser) | **19.1 M** 🏆 | 21.7 M | 136.1 M | 80.4 M |
| `cycle_count` (höher = besser) | **11.7** 🏆 | 15.0 | 45.8 | 35.7 |
| Complexity Peak — `cc_longest_function` (kleiner = besser) | **5.8** 🏆 | 6.3 | 13.8 | 11.8 |
| `cognitive_max` (kleiner = besser) | **1.0** 🏆 | 1.0 | 2.0 | 1.5 |
| Code Mass (APP) — `code_mass` (kleiner = besser) | **182.8** 🏆 | 144.2 | 997.0 | 808.3 |
| Smell Total — `smell_total` (kleiner = besser) | **0** 🏆 | 0 | 0 | 0 |

---

## F-1.2.1 — The pinned examples carry the entire correctness signal on sphinx-score

Removing the examples from the `sphinx-score` prompt drops Correctness (external)
from a perfect 1.00 to 0.15 — the kata is essentially unsolvable from its rule
text alone.

| cell | n | `verification_pct` mean | min | max | σ |
|---|---:|---:|---:|---:|---:|
| sphinx-score-example-mapping | 6 | 1.00 | 1.00 | 1.00 | 0.00 |
| sphinx-score-prose | 6 | 0.15 | 0.06 | 0.25 | 0.06 |

The gap is 0.85 at σ ≤ 0.06 on both sides — roughly 14 σ, with no overlap
between the cells' ranges. **H1 confirmed.**

Two properties make this a clean instrument rather than a mere difficulty
difference. The example-mapping cell has σ = 0, so the pinned readings are
reproducibly reachable; nothing is left to luck once the examples are present.
The prose cell never reaches even half the suite (max 0.25), which matches the
ambiguity pre-test: four ambiguities, each with a model-majority reading that
differs from the pinned one, compound multiplicatively across the scenarios.

The prose runs are not failures of execution. Correctness (internal) is 100 %
in all six, `cli_built` is true, and all complete within budget. The agents
build a coherent, well-tested implementation of a *different* rule set — which
is exactly the effect the kata was constructed to isolate.

---

## F-1.2.2 — The effect is sharper on sphinx-score than on claim-office, but both katas carry it

Both katas lose most of their Correctness (external) when the examples are
removed. `sphinx-score` loses more, and it loses to a lower floor.

| kata | example-mapping | prose | gap | prose floor |
|---|---:|---:|---:|---:|
| sphinx-score | 1.00 | 0.15 | 0.85 | 0.06–0.25 |
| claim-office | 0.94 | 0.27 | 0.67 | 0.27 flat |

**H2 confirmed**, with a caveat on how much the difference means. Part of the
0.18 gap difference is a ceiling artefact: claim-office starts at 0.94 rather
than 1.00, so 0.06 of its missing gap is headroom it never had. Corrected for
that, the difference narrows to about 0.12 — still in sphinx-score's favor, but
not the dominant part of the story.

The more informative difference is the shape of the prose floor. All six
claim-office prose runs score exactly 0.27 (4/15 scenarios, σ = 0): without
examples the model converges on one specific wrong reading, reproducibly. The
sphinx-score prose runs spread from 0.06 to 0.25 — different runs land on
different combinations of the four ambiguities. That spread is what the kata
was built for; it makes the example-mapping lever visible as *information*
rather than as a single missing rule.

---

## F-1.2.3 — Removing the examples makes runs cheaper, and this is an information effect rather than an early stop

`prose` runs are cheaper on both katas, sharply so on claim-office. This is the
pattern the RQ flagged in advance as a possible early-stop artefact, so it needs
checking rather than reporting.

| cell | `cost_usd` | `duration_seconds` | `cycle_count` | `refactorings_applied` | `code_mass` |
|---|---:|---:|---:|---:|---:|
| sphinx-score-example-mapping | $12.86 | 1475 | 11.7 | 11.7 | 182.8 |
| sphinx-score-prose | $14.64 | 1262 | 15.0 | 9.8 | 144.2 |
| claim-office-example-mapping | $78.98 | 5514 | 45.8 | 44.5 | 997.0 |
| claim-office-prose | $47.76 | 3605 | 35.7 | 31.0 | 808.3 |

**H3 is refuted for claim-office and holds for sphinx-score.** On claim-office
the prose runs cost 40 % less and run 35 % shorter. On sphinx-score cost is
flat to slightly higher ($12.86 → $14.64) and cycle count actually rises
(11.7 → 15.0), while duration drops 14 % — all well inside the run-to-run
spread (σ $9.02 on the prose cell alone).

The claim-office reduction is not an early stop. The prose runs complete within
budget (6/6), keep Correctness (internal) at 100 %, and still run 35.7 TDD
cycles with 31 refactorings — a full, disciplined run. What shrinks is the
*specified surface*: Code Mass (APP) falls from 997 to 808 and `cc_functions`
from 38 to 29.3, because the examples in the example-mapping prompt name
scenarios that the prose text leaves implicit. Fewer pinned scenarios mean
fewer tests to write and fewer branches to implement. The agent does the same
amount of work per unit of specified behavior; there is simply less specified
behavior.

The practical consequence for reading other RQs: on claim-office, prompt style
and run cost are coupled, so a cost comparison across prompt styles on that
kata is not a clean measurement of workflow efficiency. On sphinx-score they are
not coupled, which makes it the better carrier if cost is an outcome.

---

## F-1.2.4 — Decomposition quality is prompt-invariant; only the amount of code changes

Removing the examples does not degrade how the code is factored. Per-unit
structure metrics stay flat; only the totals shrink with the smaller specified
surface.

| Metric | sphinx em | sphinx prose | claim-office em | claim-office prose |
|---|---:|---:|---:|---:|
| Complexity Peak — `cc_longest_function` | 5.8 (σ 1.9) | 6.3 (σ 1.0) | 13.8 (σ 3.2) | 11.8 (σ 2.8) |
| `cc_avg_loc_per_function` | 3.54 (σ 1.11) | 3.28 (σ 0.85) | 3.19 (σ 0.23) | 3.09 (σ 0.23) |
| `cognitive_max` | 1.0 (σ 0) | 1.0 (σ 0) | 2.0 (σ 1.1) | 1.5 (σ 0.55) |
| `mccabe_max` | 2.0 (σ 0) | 2.0 (σ 0) | 2.8 (σ 0.75) | 3.0 (σ 0.63) |
| Smell Total — `smell_total` | 0 | 0 | 0 | 0 |
| `lines_of_code` | 57.5 | 43.0 | 523.0 | 358.8 |
| `cc_functions` | 6.5 | 6.0 | 38.0 | 29.3 |

**H4 confirmed.** Every per-unit structure metric lands within 1 σ across prompt
styles on both katas — `cc_avg_loc_per_function` moves by 0.26 and 0.10 at
σ 0.85–1.11 and σ 0.23; `cognitive_max` and `mccabe_max` are identical on
sphinx-score and differ by 0.5 and 0.2 on claim-office at comparable σ.
Smell Total is 0 in all 24 runs.

What does move are the totals — `lines_of_code` and `cc_functions` drop with the
smaller specified surface, consistent with F-1.2.3. So the two axes separate
cleanly: the examples pin *which* rule gets implemented and *how much* of it,
the workflow governs *how well* it is factored. Prompt quality and workflow
quality can be read independently on these metrics, which is what the RQ needed
to establish before the sphinx-score decomposition numbers can be used elsewhere.

---

## Caveats

- **Single model, single workflow.** All 24 runs are `opus-5-no-thinking` ×
  `v6.6-lab-split-cc`. Whether the prose floor is this low for weaker models is
  RQ-kata-1.1's question, not this one's.
- **claim-office's ceiling.** Its example-mapping cell sits at 0.94, not 1.00,
  so its measured gap understates the effect by up to 0.06. The correction is
  applied in F-1.2.2.
- **The two verification suites are not commensurable** (16 vs. 15 scenarios,
  different granularity). Gaps are compared per kata; the absolute Correctness
  (external) values are not.
- **`cost_usd` is a list-price baseline** (token × price), not a billed amount —
  Requesty reports no inline cost.
