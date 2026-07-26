# RQ-model-quality-cc-vs-pi — Findings

Opus (`opus-4-8`) via the **Claude Code** vs. the **pi path**, each **with and without thinking**, kata `game-of-life-example-mapping`, v6.2 workflow generation. n=5 per cell (20 runs), all correct (Correctness internal 100 %).

CC cells: `v6.2-with-why-cleaned` (`opus-4-8-requesty` = thinking, `opus-4-8-no-thinking`). pi cells: `v6.2.1-phase-continuation-pi` (`opus-4-8` = thinking, `opus-4-8-no-thinking`). All routed via Requesty/Vertex-EU.

## Overview

Complexity/code quality (all **lower = better**). All cells 100 % correct → quality trophies not correctness-gated.

| Metric (direction) | CC thinking | CC no-think | pi thinking | pi no-think |
|---|---:|---:|---:|---:|
| `cognitive_max` (↓) | **5.0** 🏆 | 5.6 | 9.6 | 8.2 |
| `cognitive_avg` (↓) | **3.17** 🏆 | 3.87 | 5.57 | 7.4 |
| `mccabe_avg` (↓) | 2.16 | **2.11** 🏆 | 2.9 | 3.13 |
| Smell Total `smell_total` (↓) | 2.2 | 2.0 | 3.4 | **1.2** 🏆 |
| Production LoC `lines_of_code` (↓) | 44.6 | 40.0 | **35.2** 🏆 | 42.2 |
| Code Mass (APP) `code_mass` (↓) | 158.6 | 171.8 | **149.2** 🏆 | 159.6 |
| Correctness (internal) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `duration_seconds` (↓) | 718.6 | 579.2 | 339.4 | **318** 🏆 |

`cost_usd`: all cells via Requesty (values in `summary.md`).

---

## F-1.1 — The harness effect on complexity dominates the thinking effect

Across both thinking levels, CC-Opus writes less complex code than pi-Opus:

| `cognitive_max` (↓) | thinking | no-thinking |
|---|---:|---:|
| **CC** | 5.0 | 5.6 |
| **pi** | 9.6 | 8.2 |

The harness difference (CC ~5 vs. pi ~8–10) is larger and more consistent than the thinking difference *within* a harness. The harness/workflow path is therefore the stronger driver of the code-quality profile, not the reasoning level.

**Caveat (workflow line):** CC runs `v6.2-with-why-cleaned` (`commands`/`rules`), pi runs `v6.2.1-phase-continuation` (`skills`/`extensions`/`AGENTS.md`) — two lines of the v6.2 generation, treated as equivalent by convention. The effect is harness OR workflow line, not separable.

---

## F-1.2 — Thinking does not reliably reduce code complexity on either harness

The intuitive effect ("more reasoning → tidier code") does not appear:

- **CC**: thinking vs. no-thinking practically identical (`cognitive_max` 5.0 vs. 5.6, `cognitive_avg` 3.17 vs. 3.87). Thinking has no effect on code complexity here.
- **pi**: no-thinking actually worsens `cognitive_avg` (5.57 → 7.4) with sharply increased spread (σ 1.87 → 5.9). Driven by a real outlier run that puts the entire logic into a single dense function (`cognitive_avg` = 17 at 27 LoC) — the same density pattern as cursor-Opus in [RQ-model-quality-cursor](../../questions-cursor-cli/1.1-model-quality-cursor/findings.md). Without thinking the structure becomes less reliable, not worse in the mean-without-outlier.

Conclusion: on these harnesses, thinking affects the *spread* of Opus-4-8's complexity more than its *mean* — with thinking the runs are more consistent (smaller σ), without thinking dense single-function outliers appear.

---

## F-1.3 — pi is more parsimonious and faster, CC less complex and more smell-stable

- **Parsimony**: pi-thinking writes the fewest Production LoC (35.2) and the lowest Code Mass (149.2). CC spreads across more lines.
- **Runtime**: pi is markedly faster at both thinking levels (~318–339 s vs. CC ~579–719 s). Thinking costs noticeable time on CC (719 vs. 579 s), barely any on pi (339 vs. 318 s).
- **Complexity/smells**: CC leads consistently on `cognitive_*`; `smell_total` is stably low on CC (2.0–2.2, small σ), fluctuating on pi (1.2–3.4, large σ).

The parsimony/complexity tradeoff from the cursor RQ is confirmed: the more parsimonious path (pi) is not the less complex one (CC).

---

## Caveats

- **Workflow line (central):** CC (with-why-cleaned) and pi (phase-continuation) are two lines of the v6.2 generation; harness and line are not separable (F-1.1).
- `cost_usd` of all cells via Requesty — comparable.
- `verification_pct` = 100 % mirrors `tests_passing` (game-of-life has no external suite).
- The elevated σ of the pi-no-thinking cell is real (genuine density-outlier run), not a parser artifact.
