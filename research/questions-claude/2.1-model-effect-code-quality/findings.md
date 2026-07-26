# RQ-model-quality Findings

Persistent collection of the insights on the question:
**How strongly do the available models (Sonnet 4.6, Opus 4.6,
Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality
on a training-known kata under the strongest workflow?**

Data basis: 38 runs (10 cells × n=3, plus additional
opus-4-7-no-thinking replicates from the RQ-tdd-quality pool → n=10 there, and
opus-4-8-no-thinking with n=4). Workflow v4-exact-subagents, kata
game-of-life-example-mapping with an explicit API contract
(`nextGeneration(cells: Cell[]): Cell[]`). Internal correctness view via the
vitest tests written by the agent, external view via the module-import adapter
`game-of-life-verification/` (15 scenarios).

---

## Overview: Code Quality by Model (means)

| Model | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| opus-5 | 172.67 | 1.67 | 3.00 | 2.00 | 6.33 | **1.00** 🏆 | 3 |
| opus-5-no-thinking | 149.33 | **1.67** 🏆 | 2.67 | 1.67 | 5.33 | **1.00** 🏆 | 3 |
| fable-5 | 163.00 | 3.00 | **2.00** 🏆 | **1.00** 🏆 | 8.33 | **1.00** 🏆 | 3 |
| fable-5-no-thinking | 163.33 | 2.33 | 2.67 | 1.67 | 6.67 | **1.00** 🏆 | 3 |
| opus-4-8 | **145.33** 🏆 | 2.67 | 4.33 | 5.33 | **4.33** 🏆 | **1.00** 🏆 | 3 |
| opus-4-8-no-thinking | 190.50 | 3.00 | 4.25 | 4.75 | 11.50 | **1.00** 🏆 | 4 |
| opus-4-7 | 159.00 | 2.33 | 3.33 | 3.00 | 7.00 | **1.00** 🏆 | 3 |
| opus-4-7-no-thinking | 166.60 | 2.60 | 4.50 | 4.40 | 8.10 | **1.00** 🏆 | 10 |
| opus-4-6-portkey | 173.00 | 4.33 | 6.67 | 12.00 | 19.33 | **1.00** 🏆 | 3 |
| opus-4-6-portkey-no-thinking | 175.67 | 4.33 | 7.67 | 13.00 | 18.67 | **1.00** 🏆 | 3 |
| sonnet-4-6 | 178.00 | 5.67 | 6.33 | 11.00 | 21.67 | **1.00** 🏆 | 3 |
| sonnet-4-6-no-thinking | 166.67 | 3.33 | 6.00 | 5.00 | 15.00 | 0.73 | 3 |

Best value per column in bold + 🏆. Lower = better (except `verification_pct`: higher = better).
Quality trophies are correctness-gated: only cells with `verification_pct = 1.0`
are trophy-eligible (sonnet-4-6-no-thinking with 0.73 excluded).
`verification_pct`: eleven cells tied at 1.00 → ties, all 🏆.
`smell_total`: opus-5-no-thinking sets the new best value at 1.67 (opus-5 with thinking is tied on the mean, but with a higher spread of σ 1.53).

Opus 5 and Fable 5 share the complexity peak: Fable 5 (with thinking)
holds `cognitive_max` 1.0 and `mccabe_max` 2.0 narrowly ahead of Opus 5, while Opus 5 sets
the lowest Smell Total (1.67). Opus 4.8 (with thinking) remains the **most compact
code** (`code_mass` 145.3, `cc_longest_function` 4.3). Three complementary
quality winners: Fable 5 / Opus 5 for the lowest complexity, Opus 4.8 for
the lowest Code Mass.

---

## F-model-quality.1 — Correctness (internal + external) on v4 Is Almost Model-Independently Perfect

**Statement**: `tests_passing` is at 100 % for all twelve model cells (44/44
runs). `verification_pct` is likewise at 1.00 in eleven of twelve cells
— the explicit API contract (`Cell = [number, number]`,
`nextGeneration(cells: Cell[]): Cell[]`) almost completely eliminates the previously observed
representation mismatches. Both Fable 5 cells, both
Opus 4.8 cells and both Opus 5 cells deliver 15/15 in all replicates.

The only exception: **sonnet-4-6-no-thinking** with `verification_pct = 0.73`
— 2/3 runs perfect (15/15), one run with 3/15 (see F-model-quality.5).

**Data basis**: 44 runs, 15 verification scenarios per run.

**Consequence**: On v4 + game-of-life + Direct-API/Portkey Opus + Sonnet,
correctness is no longer a differentiating characteristic. Code-quality ranking statements
are based on correct code.

---

## F-model-quality.2 — Model Ranking: Fable 5 and Opus 5 Lead on Complexity, Opus 4.8 on Code Mass; All Three Clearly Ahead of Opus 4.6 and Sonnet

**Statement**: Three models with different profiles share the top position.
**Fable 5** and **Opus 5** deliver the lowest Complexity Peak
(`cognitive_max` 1.0 and 2.0 respectively, `mccabe_max` 2.0 and 3.0 — all near the
theoretical minimum), **Opus 4.8** the lowest Code Mass and the shortest
longest function (`code_mass` 145.3, `cc_longest_function` 4.3). Opus 5 additionally
sets the lowest Smell Total (1.67). All three are clearly ahead of Opus 4.7
(solid midfield) and considerably ahead of Opus 4.6 and Sonnet:

| Metric (with thinking) | fable-5 | opus-5 | opus-4-8 | opus-4-7 | opus-4-6-portkey | sonnet-4-6 |
|---|---:|---:|---:|---:|---:|---:|
| `code_mass` | 163.00 | 172.67 | **145.33** 🏆 | 159.00 | 173.00 | 178.00 |
| `cc_longest_function` | 8.33 | 6.33 | **4.33** 🏆 | 7.00 | 19.33 | 21.67 |
| `smell_total` | 3.00 | **1.67** 🏆 | 2.67 | 2.33 | 4.33 | 5.67 |
| `mccabe_max` | **2.00** 🏆 | 3.00 | 4.33 | 3.33 | 6.67 | 6.33 |
| `cognitive_max` | **1.00** 🏆 | 2.00 | 5.33 | 3.00 | 12.00 | 11.00 |

Lower = better; 🏆 = best model per metric (row), correctness-gated
(all six cells here at `verification_pct = 1.0`).

The gap between the leading group and Opus 4.6 is substantial: on `cognitive_max`
a factor of ~12× separates Fable 5 (1.0) from Opus 4.6 (12.0), on
`cc_longest_function` a factor of ~4.5× separates Opus 4.8 (4.3) from Opus 4.6 (19.3). The
three leading profiles are complementary: Fable 5 and Opus 5 keep the
Complexity Peak trivial but write somewhat more code; Opus 4.8 minimizes
the Code Mass but packs the logic more densely (higher `cognitive_max`/`mccabe_max`).
Opus 5 combines almost trivial complexity with the lowest Smell Total in the
field and thereby shifts the previous two-way trade-off (Fable complexity vs
Opus 4.8 Code Mass) to a third, smell-poor option.

**Data basis**: fable-5 n=3, opus-5 n=3, opus-4-8 n=3, opus-4-7 n=3,
opus-4-6-portkey n=3, sonnet-4-6 n=3 (each with thinking).

**Note on the ordering**: Sonnet ahead of Opus 4.6 (in the no-thinking comparison,
see overview) is a reversal of the naive model-tier intuition
("Opus > Sonnet"). A plausible explanation: Sonnet (no-thinking) simply produces
*shorter, less generalized* code, whereas Opus 4.6 tends to build a
more complete abstraction (cf. F-model-quality.3 — Opus 4.6 +
thinking even degrades).

---

## F-model-quality.3 — Thinking Does Not Act Uniformly; Strong on Code Size for Opus 4.8, Neutral for Opus 4.6, Negative on cognitive_max for Sonnet

**Statement**: Within-model deltas (thinking vs. no-thinking, ∆ negative = better
with thinking):

| Model | ∆ `code_mass` | ∆ `smell_total` | ∆ `mccabe_max` | ∆ `cognitive_max` | ∆ `cc_longest_function` |
|---|---:|---:|---:|---:|---:|
| fable-5 | −0.33 | +0.67 | −0.67 | −0.67 | +1.66 |
| opus-4-8 | **−45.17** | −0.33 | +0.08 | +0.58 | −7.17 |
| opus-4-7 | −8.67 | −0.17 | −0.67 | +0.17 | −2.33 |
| opus-4-6-portkey | −2.67 | 0.00 | −1.00 | −1.00 | +0.66 |
| sonnet-4-6 | +11.33 | +2.34 | +0.33 | **+6.00** | +6.67 |

∆ table (thinking effect, ∆ negative = better with thinking) — not a model competition, hence no 🏆.
The bold marks the strongest effects: **−45.17** (strongest improvement, Opus 4.8 on `code_mass`)
and **+6.00** (strongest degradation, Sonnet on `cognitive_max`).

- **Fable 5**: Thinking effect small and inconsistent throughout (all |∆| < 2),
  effectively neutral. Fable 5 reaches its trivial Complexity Peak equally with and
  without thinking — the low `cognitive_max`/`mccabe_max` is
  not a thinking artifact but model-intrinsic.
- **Opus 4.8**: Thinking acts **strongly on code size** — `code_mass`
  falls by 45 (190 → 145) and the longest function more than halves
  (11.5 → 4.3). On the pure complexity scores, by contrast, the effect is
  slightly negative (`cognitive_max` +0.58, `mccabe_max` +0.08): with thinking
  Opus 4.8 packs the logic more compactly into fewer/shorter functions, which
  raises the density per function marginally.
- **Opus 4.7**: Thinking effect small, essentially neutral with a slight
  tendency toward more compact code and shorter functions. The cognitive complexity
  rises marginally (+0.17).
- **Opus 4.6**: Thinking effect small and inconsistent — slightly better on
  complexity, slightly worse on the longest function. Effectively neutral.
- **Sonnet 4.6**: Thinking **degrades** across all five outcomes,
  especially `cognitive_max` (5.00 → 11.00, more than a doubling).

H3 (thinking effect stronger on Opus than on Sonnet, both positive) is
falsified: on Sonnet the effect is clearly negative. A plausible
mechanic: Sonnet uses thinking to construct a more elegant/complete abstraction
that, however, introduces more branches and helper logic
(higher cognitive complexity).

**Condition**: n = 3 in the Opus 4.8, Opus 4.6 and Sonnet cells,
σ_cognitive on sonnet-4-6 very high at 7.81 (range 2–16). The jumps in the
means are sign-consistent across several metrics, but at n=3
replication is desirable.

---

## F-model-quality.4 — Token Costs: Fable 5 and Sonnet/Opus 4.7 the Cheapest, Opus 4.8 the Most Expensive; Wallclock Uniform

**Statement**: Token consumption (mean) and wallclock time by model:

| Model | `total_tokens` (mean) | `duration_seconds` (mean) |
|---|---:|---:|
| sonnet-4-6-no-thinking | 2.21 M | 1116.7 |
| fable-5-no-thinking | **2.26 M** 🏆 | 1158.0 |
| sonnet-4-6 | 2.41 M | 846.3 |
| opus-4-7 | 2.49 M | **827.7** 🏆 |
| opus-4-7-no-thinking | 2.56 M | 1162.9 |
| fable-5 | 2.64 M | 1269.0 |
| opus-4-6-portkey | 2.93 M | 956.3 |
| opus-4-8-no-thinking | 3.17 M | 1045.5 |
| opus-4-8 | 3.80 M | 1017.0 |
| opus-4-6-portkey-no-thinking | 3.87 M | 1160.7 |

Lower = better; 🏆 = best model per column, correctness-gated
(sonnet-4-6-no-thinking with `verification_pct = 0.73` is not trophy-eligible despite the lowest
token value — the low consumption partly reflects a
faulty run, not genuine frugality; the token trophy therefore goes to
fable-5-no-thinking as the cheapest correct cell).

The spread between the cheapest correct model (fable-5-no-thinking ~2.3 M) and
the most expensive (opus-4-6-no-thinking ~3.9 M, opus-4-8 ~3.8 M) is a factor of ~1.7×.
**Fable 5 combines the lowest complexity (F-model-quality.2) with a cheap
token budget** — unlike Opus 4.8, whose compact output (lowest
Code Mass) is bought with the highest inference budget (~1.4× compared to
Fable 5).

Wallclock is predominantly at ~14–21 min/run; individual opus-4-7-no-thinking
replicates spread strongly upward (pool n=10, max 3923 s).

**Consequence**: On v4, model choice is a trade-off between code compactness
(Opus 4.8 ahead on `code_mass`) and the combination of low complexity
and token budget (Fable 5 ahead). Fable 5 is the best all-rounder — trivial
Complexity Peak at a favorable cost; Opus 4.8 pays off when minimal
Code Mass is the goal and the higher token budget is acceptable.

---

## F-model-quality.5 — Contract Conformance Almost Fully Achieved Under an Explicit API Contract; One Sonnet Outlier Redefines `Cell` as an Object

**Statement**: With an explicit API contract in the kata prompt
(`type Cell = [number, number]; export function nextGeneration(cells: Cell[]): Cell[]`)
the previously observed representation mismatches almost completely
disappear. A single outlier remains:

| Run | Model | Chosen signature | `verification_pct` |
|---|---|---|---:|
| `2026-05-14_21-09-13_…_sonnet-4-6-no-thinking` | sonnet-4-6-no-thinking | `Cell = { x: number; y: number }` (object) | 0.20 |

All other 37 runs adhere to the `[number, number]` tuple form (or
its superset `number[]`) and reach 15/15 — including all six
Fable 5 runs and all seven Opus 4.8 runs. The Sonnet deviation shows: the
explicit prompt contract
drastically reduces representation drift (Sonnet previously 6/6 runs `boolean[][]`
→ now 5/6 runs tuple), but does not eliminate it in all cases.

**Data basis**: 38 runs, manual inspection of the `nextGeneration` signatures
in `src/game-of-life.ts`.

**Suspected mechanic**: Sonnet (no-thinking) occasionally interprets `type Cell = [number, number]`
as "some Cell type" and replaces it with a supposedly
more expressive object form. At n=3 one outlier is 33 % of the cell —
a larger n is needed for a stable frequency estimate.

**Condition**: n=3 in the affected cell.

---

## Caveats

- **Single workflow**: Only v4-exact-subagents. Other workflows could
  produce different model rankings (cf. RQ-tdd-quality F-tdd-quality.1).
- **Single kata**: Only Game of Life (library form, example-mapping).
  Mars-rover as a second code-quality carrier remains open.
- **Opus 4.6 via Portkey**: Findings about `opus-4-6-portkey*` are not
  automatically transferable to Direct-API Opus 4.6.
- **Fable 5 / Opus 4.8 native API only**: `fable-5*` and `opus-4-8*` run
  via the native Anthropic API (CLI 2.1.170, blanked `ANTHROPIC_*` env,
  native OAuth), not via Portkey. A routing confound relative to the
  Portkey Opus 4.6 cells exists but is assumed here to be uncritical for the
  code-quality metrics.
- **n = 3 per cell** (except opus-4-7-no-thinking with n=10 thanks to
  RQ-tdd-quality pooling, opus-4-8-no-thinking with n=4): σ is high in individual
  outcomes — the thinking deltas (F-model-quality.3) and the
  representation outlier (F-model-quality.5) need replication at
  n=3. Fable 5 reaches its best values on
  `cognitive_max`/`mccabe_max` with σ ≤ 0.58 (very tight), so the low
  Complexity Peak is stable across the three replicates.
- **API contract introduced**: All runs in this data basis use the
  explicit API contract in the prompt (commit `0902a4f`). Earlier findings
  about representation choice without an explicit contract are not directly
  comparable.
