# RQ-tdd-quality Findings

Katas: `game-of-life` (library form, training-known) and `claim-office` (CLI, novel with ambiguities). Model: `opus-4-7-no-thinking` (Portkey OR direct, OR-match). 8 workflows (6 on the TDD axis + 2 non-TDD controls v8a/v8b) × 2 katas = 16 cells, n=103 runs.

## Methodological Note — Silent Workflow Drops and Aborted Refactor Loops

During the claim-office collection, one v6.1 run occurred with a missing `experiment-done.txt`: the model stopped calling tools, Claude exited with `exit_code=0`/`exit_reason=ok`, but the workflow did not run to completion — a stop after the test list before the first red cycle (63 s, 11 assistant messages).

In addition, a v6.1 claim-office run with an aborted refactor loop was removed: `exit_reason=ok` and all tests green, but only 4 instead of the typical 5+ cycles, 10 instead of 14–27 functions, longest function 60 LoC (median 17). The profile is inconsistent with normal v6.1 behavior — the refactor subagent did not decompose the implementation.

These two runs were removed from the n=5 cells and replaced by fresh runs, or not replaced (n=7 for v6.1 claim-office is > min_replicates=5). Rationale: for the TDD workflow question, what matters is the outcome of the workflow that **ran through**, not full-autonomy stability. In practical use (HITL), an aborted refactor would be fixed by a resume/re-trigger; only under full autonomy does it become a problem. Full-autonomy stability is a research question in its own right (cf. RQ-stability) and lies outside the scope of this RQ.

## Overview — Code Quality per Workflow

All metrics in the tables: lower = better. 🏆 = best value per column (also multiple times in case of a tie). **Never averaged across katas** — game-of-life (~30–40 Production LoC) and claim-office (~150–320 Production LoC) are not comparable.

### Kata: game-of-life

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot              | 10 | 18.8 | 12.8 | 31.7 | 4.8 | 33.6 | 155.0 |
| v2-iterative            | 10 | 16.2 | 11.6 | 32.1 | 4.1 | 32.5 | 157.8 |
| v3-basic-tdd            | 10 | 21.8 | 13.7 | 32.5 | 6.0 | 31.9 | 165.6 |
| v4.1-testlist-scope-fix |  5 | **6.4** 🏆 | **5.0** 🏆 | 16.4 | **2.4** 🏆 | 32.0 | 156.6 |
| v5.1-testlist-scope-fix |  5 | 17.6 | 10.2 | 20.8 | 4.8 | **26.6** 🏆 | 154.0 |
| v6.1-hybrid-…           | 10 | 6.5 | 5.2 | **14.2** 🏆 | **2.4** 🏆 | 29.2 | 153.7 |
| v8a-delayed-refactor-agent  |  5 | 10.6 | 7.4 | 17.6 | 3.0 | 31.2 | **142.0** 🏆 |
| v8b-delayed-refactor-native |  5 | 9.0 | 6.8 | 17.6 | **2.4** 🏆 | 31.0 | 145.8 |

### Kata: claim-office

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot              |  5 | 12.2 | 8.4 | 40.4 | 11.6 | 269.4 | 835.4 |
| v2-iterative            |  5 | 11.4 | 8.4 | 41.4 | 15.8 | 268.6 | 851.0 |
| v3-basic-tdd            |  5 | 19.8 | 15.4 | 51.6 | 16.8 | 317.4 | 992.4 |
| v4.1-testlist-scope-fix |  5 | 26.8 ⚠️ | 16.0 ⚠️ | 40.8 | 13.2 | **156.8** 🏆 | **621.6** 🏆 |
| v5.1-testlist-scope-fix |  6 | 14.8 | 10.2 | 32.7 | 6.8 | 167.2 | 692.7 |
| v6.1-hybrid-…           |  7 | **5.7** 🏆 | **5.7** 🏆 | **18.1** 🏆 | **1.3** 🏆 | 191.1 | 861.3 |
| v8a-delayed-refactor-agent  |  5 | 7.4 | 6.6 | 28.4 | 4.0 | 245.6 | 813.8 |
| v8b-delayed-refactor-native |  5 | 11.0 | 8.0 | 35.8 | 6.2 | 238.8 | 780.2 |

⚠️ v4.1 claim-office is bimodal (`cognitive_max` σ=24, max=68) — occasional extreme misdirections. See F-tdd-quality.9.

Correctness **differs** between the two katas: on game-of-life all 8 workflows are at `verification_pct=1.00`. On claim-office it varies between 0.28 (v1+v2, vibe-coding without tests) and 1.00 (v3, v5.1, v6.1, v8a) — see F-tdd-quality.4 and F-tdd-quality.8. `mutation_score` was collected only for v1/v2/v3 on game-of-life (0.95 ± 0.01 in all three).

## F-tdd-quality.1 — Strict Phase-Structured Workflows with a Refactor Phase Lower the Complexity Peaks Drastically

On game-of-life, v4.1 and v6.1 reach `cognitive_max ≈ 6–7` and `mccabe_max ≈ 5` — these are ~⅓ of the values of v1/v2/v3 (`cognitive_max ≈ 16–22`, `mccabe_max ≈ 12–14`). `cc_longest_function` halves accordingly (13–16 vs. 32). `smell_total` also halves (≈2.3 vs. 4–6).

On claim-office the pattern holds **even more clearly** for v6.1: `cognitive_max` 5.7, `mccabe_max` 5.7, `cc_longest_function` 18.1 — all the lowest values of the entire matrix. v4.1, by contrast, breaks down on claim-office (see F-tdd-quality.9) — it does stay at the top on `code_mass` and `cc_loc` (621.6/156.8, each the best across all workflows), but collapses on branching complexity.

Plausible mechanic: v4.1 and v6.1 prescribe a dedicated refactor phase per cycle that explicitly reduces complexity — and both separate implementation (green) and refactor architecturally (v4.1 via an isolated subagent, v6.1 via a dedicated refactor subagent in the hybrid). The refactor discipline shows up directly in the complexity peaks, not in `cc_loc` — the code does not become shorter, but flatter.

## F-tdd-quality.2 — Naive "use TDD" (v3) Brings No Complexity Advantage over Non-TDD (v1/v2) on game-of-life

On game-of-life, v3 is at or slightly above v1/v2 in *all* complexity metrics: `cognitive_max` 21.8 (v3) vs. 18.8/16.2 (v1/v2), `mccabe_max` 13.7 vs. 12.8/11.6, `smell_total` 6.0 vs. 4.8/4.1, `code_mass` 165.6 vs. 155/157.8. Function sizes (`cc_longest_function`, `cc_loc`) are comparable.

On claim-office, v3 is even **clearly worse** than v1/v2 in almost all metrics: `cognitive_max` 19.8 vs. 12.2/11.4, `mccabe_max` 15.4 vs. 8.4/8.4, `cc_longest_function` 51.6 vs. 40.4/41.4, `cc_loc` 317.4 vs. 269.4/268.6, `code_mass` 992.4 vs. 835.4/851.0. The naive "use TDD" approach produces the heaviest code of the whole matrix on the novel kata — the test-first increments drive the implementation into a fragmented structure without a structured cleanup rhythm.

Plausible mechanic: v3 is a single agent with the minimal instruction "use TDD" and without an enforced red-green-refactor rhythm — no isolated refactor step, no phase structure. On a training-known kata the model produces an orderly solution even without TDD; on a novel kata v3 appends test satisfaction to test satisfaction incrementally — without periodic refactoring the result becomes clunkier than even a poor oneshot solution. The measurable quality advantage only comes from the structured refactor discipline of the strict workflows (F-tdd-quality.1). The "use TDD" label alone does not suffice — the lever is the enforced refactor step in the rhythm, not the test-first instruction.

Hypothesis H1 ("v3/v4.1/v5.1 show lower complexity than v1/v2") therefore does *not* hold uniformly for all TDD workflows — v3 reaches (game-of-life) or falls below (claim-office) the non-TDD level; only v4.1 (game-of-life) and v6.1 (both katas) separate themselves clearly.

## F-tdd-quality.3 — Single Context (v5.1) Loses the Complexity Advantage of the Phase-Isolated Subagents (v4.1) — But Only on game-of-life

v5.1 and v4.1 carry the same phase-script content (test-list-scope-fix, test list → red → green → refactor) and differ only in the invocation mechanism: v4.1 spawns a fresh subagent per phase (isolated context), v5.1 invokes skills in the same context.

On **game-of-life**, v5.1 shows values at the v1/v2/v3 level in the peak metrics:

| Metric (lower = better) | v4.1 (isolated) | v5.1 (shared) | Factor v5.1 / v4.1 |
|---|---:|---:|---:|
| `cognitive_max` | **6.4** 🏆 | 17.6 | 2.8× |
| `mccabe_max`    | **5.0** 🏆 | 10.2 | 2.0× |
| `cc_longest_function` | **16.4** 🏆 | 20.8 | 1.3× |
| `smell_total`   | **2.4** 🏆 | 4.8 | 2.0× |

On **claim-office the ordering reverses** — v5.1 clearly beats v4.1:

| Metric (lower = better) | v4.1 (isolated) | v5.1 (shared) |
|---|---:|---:|
| `cognitive_max` | 26.8 ⚠️ | **14.8** 🏆 |
| `mccabe_max`    | 16.0 ⚠️ | **10.2** 🏆 |
| `cc_longest_function` | 40.8 | **32.7** 🏆 |
| `smell_total`   | 13.2 | **6.8** 🏆 |

Plausible mechanic: on the short game-of-life test list the fresh subagent context helps, because each phase can survey the whole test list in isolation; on the long claim-office test list the fresh context loses coherence per cycle and re-interprets spec ambiguities differently. v5.1 with its shared context benefits from spec consistency within a session. The hybrid v6.1 (skill red/green in the shared context + isolated refactor subagent) combines both strengths and dominates claim-office across the branching and size metrics — see RQ-context (4.3) F-context.1 for the explicit decomposition.

## F-tdd-quality.4 — Correctness Is Workflow-Dependent on a Novel Kata; v1/v2 Vibe-Coding Collapses on claim-office

`verification_pct` is **structurally different** on the two katas:

| Kata | v1 | v2 | v3 | v4.1 | v5.1 | v6.1 | v8a | v8b |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| game-of-life | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| claim-office | **0.28** | **0.28** | 1.00 | 0.96 | 1.00 | 1.00 | 1.00 | 0.97 |

On game-of-life all 8 workflows are at 100 % (15/15 verification scenarios) — the workflow effect is invisible here, because the model has memorized the solution. On claim-office (novel with ambiguities), **v1 and v2** drop to ~28 % (4/15) — for the vibe-coding prose variant the model writes a solution that fails in 11 of 15 scenarios. All workflows with a **test-writing phase** (v3+, v8a/v8b) stay at ≥ 96 %; most reach 100 %. The smaller deviations at v4.1 (0.96) and v8b (0.97) come from 1 run each with `verification_pct ∈ {0.80, 0.87}` (implementation bugs that do not quite cover the spec — not silent workflow drops).

**H4 (correctness independent of the workflow) refuted.** The workflow effect on correctness is kata-dependent: invisible on training-known katas, dominant on novel katas. The vibe-coding workflows v1/v2 without tests drop out; even writing tests after the fact (v8a/v8b) is enough to reach TDD level — see F-tdd-quality.8.

## F-tdd-quality.5 — The Cost Range Between Workflows Spans an Order of Magnitude; Strict Workflows Are 5–50× More Expensive; Kata Complexity Scales Linearly

### game-of-life

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| v1-oneshot              | 88 | 994 k |
| v2-iterative            | 83 | 967 k |
| v3-basic-tdd            | **75** 🏆 | **799 k** 🏆 |
| v4.1-testlist-scope-fix | 838 | 4.32 M |
| v5.1-testlist-scope-fix | 293 | 8.40 M |
| v6.1-hybrid-…           | 508 | 6.94 M |
| v8a-delayed-refactor-agent  | 143 | 1.18 M |
| v8b-delayed-refactor-native | 116 | 1.32 M |

### claim-office

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| v1-oneshot              | 231 | **2.11 M** 🏆 |
| v2-iterative            | 244 | 2.12 M |
| v3-basic-tdd            | 312 | 3.28 M |
| v4.1-testlist-scope-fix | 3229 | 14.10 M |
| v5.1-testlist-scope-fix | 641 | 18.73 M |
| v6.1-hybrid-…           | 1569 | 34.54 M ⚠️ |
| v8a-delayed-refactor-agent  | 308 | 2.12 M |
| v8b-delayed-refactor-native | **276** 🏆 | 3.45 M |

On claim-office, the strict TDD workflows cost **3–10× more** than on game-of-life — and v6.1 has the largest token range (σ=12 M, max 44.85 M). On claim-office, v4.1 takes on average **54 minutes per run** — combined with the bimodal risk (F-tdd-quality.9), the worst cost-quality trade-off of the entire matrix.

On both katas, v8a/v8b are at the v1/v2/v3 cost level (~1–3 M tokens, 2–5 min) and deliver (on claim-office) considerably better branching complexity than v1/v2/v3 and correctness comparable to the strict TDD workflows — see F-tdd-quality.6 and F-tdd-quality.8.

## F-tdd-quality.6 — Vibe + End Refactoring Reaches the Volume Level of the Strict TDD Workflows at Non-TDD Cost; Branching Complexity Remains Weaker

The non-TDD control group v8a/v8b (phase 1 implementation without tests → phase 2 tests against `prompt.md` → phase 3 a single refactor) reaches the level of the strict TDD workflows on the volume metrics at a fraction of the cost.

### game-of-life

| Workflow | `code_mass` | `cc_longest_function` | `cognitive_max` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|
| v4.1 (periodic refactor) | 156.6 | 16.4 | **6.4** 🏆 | 838 | 4.32 M |
| v6.1 (periodic refactor) | 153.7 | **14.2** 🏆 | 6.5 | 508 | 6.94 M |
| **v8a (end refactor, agent)** | **142.0** 🏆 | 17.6 | 10.6 | 143 | **1.18 M** 🏆 |
| **v8b (end refactor, command)** | 145.8 | 17.6 | 9.0 | **116** 🏆 | 1.32 M |

### claim-office

| Workflow | `code_mass` | `cc_longest_function` | `cognitive_max` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|
| v4.1 (periodic refactor) | **621.6** 🏆 | 40.8 | 26.8 ⚠️ | 3229 | 14.10 M |
| v6.1 (periodic refactor) | 861.3 | **18.1** 🏆 | **5.7** 🏆 | 1569 | 34.54 M |
| **v8a (end refactor, agent)** | 813.8 | 28.4 | 7.4 | 308 | **2.12 M** 🏆 |
| **v8b (end refactor, command)** | 780.2 | 35.8 | 11.0 | **276** 🏆 | 3.45 M |

H5 (the periodicity of refactoring matters) is **kata-dependent**:
- On game-of-life: v8a/v8b are almost level with v4.1/v6.1 on `code_mass` and `cc_longest_function`; `cognitive_max` remains v4.1/v6.1-dominated (6.4/6.5 vs 9.0/10.6).
- On claim-office: v6.1 clearly dominates on branching complexity (`cognitive_max` 5.7 vs v8a/b 7.4/11.0) and function size (`cc_longest_function` 18.1 vs 28.4/35.8). v4.1 (the code-volume champion at 621.6), by contrast, delivers the worst branching complexity (26.8 ⚠️) — no workflow dominates *all* metrics on claim-office.

Reading: a single end refactoring after vibe-coding reduces code volume comparably to periodic refactoring, but not the branching depth within individual functions. On a complex kata with longer functions the periodicity advantage becomes more visible — the TDD refactor per cycle decomposes functions early, while an end refactor only smooths them superficially. Consistent with RQ-delayed-refactor "the TDD advantage is branching complexity, not substance".

## F-tdd-quality.7 — The Subagent Mechanism for the End Refactor Beats the Slash Command on the Large Kata; Level on the Small Kata

The two non-TDD arms isolate the **refactor delivery mechanism** at identical refactor content: v8a spawns a fresh refactor subagent (`.claude/agents/refactor.md`, Task tool), v8b invokes the same content as a slash command (`.claude/commands/refactor.md`, Skill tool) inline in the main session context. Both refactor specs are byte-identical (Four Rules of Simple Design + APP mass + naming evaluation + mandatory attempt). Phase 1 and phase 2 are likewise identical.

On **game-of-life both mechanisms are practically level**:

| Metric (lower = better) | v8a (subagent) | v8b (command) |
|---|---:|---:|
| `cognitive_max` mean | 10.6 (max 15) | **9.0** (max 17) |
| `mccabe_max` mean | 7.4 (max 9) | **6.8** (max 11) |
| `cc_longest_function` mean | 17.6 (max 27) | 17.6 (max 27) |
| `smell_total` mean | 3.0 | **2.4** |
| `total_tokens` mean | **1.18 M** | 1.32 M |
| `code_mass` mean | **142.0** | 145.8 |

All differences lie within 1 σ (e.g. `cognitive_max` σ_v8a=4.93, σ_v8b=4.47); no systematic advantage of either mechanism.

On **claim-office, v8a (subagent) clearly dominates on Complexity Peak and token efficiency**:

| Metric (lower = better) | v8a (subagent) | v8b (command) |
|---|---:|---:|
| `cognitive_max` mean | **7.4** (max 10) | 11.0 (max 19) |
| `mccabe_max` mean | **6.6** (max 9) | 8.0 (max 13) |
| `cc_longest_function` mean | **28.4** (max 30) | 35.8 (max 49) |
| `smell_total` mean | **4.0** | 6.2 |
| `total_tokens` mean | **2.12 M** | 3.45 M |
| `verification_pct` mean | **1.00** | 0.97 |
| `code_mass` mean | 813.8 | **780.2** |

v8a leads on 6 of 7 metrics; on `cc_longest_function` the range is particularly tight (v8a max 30, v8b max 49 — the subagent prevents the outlier functions). v8b needs 63 % more tokens and produces wider distributions.

**H6 (subagent delivery matters independently of the content) confirmed on claim-office; no separation on game-of-life.** Plausible mechanic: the fresh subagent context relieves the refactor of anchoring bias from phases 1/2 — on the small, training-known game-of-life codebase the bias effect is small and both mechanisms deliver similarly; on the larger novel claim-office codebase with 240+ LoC per solution, the inline command (v8b) carries implicit assumptions from the preceding phases into the refactor, whereas the subagent (v8a) starts afresh with the refactor. Consistent with RQ-delayed-refactor / F-delayed-refactor.2 (the refactor mechanism is non-trivial), now cleanly isolated from content effects.

## F-tdd-quality.8 — A Test-Writing Phase Rescues Correctness on a Novel Kata; Pure Vibe-Coding Fails

On the novel kata `claim-office` with ambiguities, the **presence of a test-writing phase** is the decisive lever for correctness — not its position (before or after implementation):

| Workflow | Test phase? | n | `verification_pct` mean | min |
|---|---|---:|---:|---:|
| v1-oneshot (prose) | no | 5 | **0.28** | 0.20 |
| v2-iterative (prose) | no | 5 | **0.28** | 0.20 |
| v4.1-testlist-scope-fix (em) | TDD strict | 5 | 0.96 | 0.80 |
| v8b-delayed-refactor-native (em) | after impl | 5 | 0.97 | 0.87 |
| v3-basic-tdd (em) | TDD strict | 5 | 1.00 | 1.00 |
| v5.1-testlist-scope-fix (em) | TDD strict | 6 | 1.00 | 1.00 |
| v6.1-hybrid-… (em) | TDD strict | 7 | 1.00 | 1.00 |
| v8a-delayed-refactor-agent (em) | after impl | 5 | 1.00 | 1.00 |

v1/v2 without tests fall to 28 % (4/15 verification scenarios). As soon as any phase writes tests against the spec, correctness jumps to ≥ 96 %. The strict TDD workflows v3/v5.1/v6.1 as well as v8a (delayed refactor via subagent) reach 100 %; v4.1 and v8b are at 96–97 % with one run each below 1.00 (implementation bugs that miss individual verification scenarios — not silent workflow drops).

On game-of-life this lever is **invisible** (all 8 workflows at 100 %), because the model has memorized the solution. The finding manifests itself only on novel katas.

Consequence for open question #4 ("is a single end refactoring after vibe-coding sufficient?"): **Yes for correctness, if the tests written after the fact cover the spec** — v8a (with the scope-fix obligation "Cover every spec example" in phase 2) reaches 100 % on claim-office, level with v3/v5.1/v6.1 (strict TDD); v8b 97 %, close to v4.1. Code quality is a separate axis (see F-tdd-quality.6/.7).

Caveat: v1/v2 use the `prose` prompt, v8a/v8b `example-mapping`. The `example-mapping` spec is in fact an implicit test spec — the effect could partly be attributable to the prompt style, not only to the test phase. RQ-prompt-correctness (1.1) showed, however, that example mapping alone brings only ~5 pp over prose on v5; the effect measured here (+68 pp) is too large for a pure prompt-style effect.

## F-tdd-quality.9 — The v6.1 Hybrid Is the Most Robust TDD Workflow Across Both Katas; v4.1 Is Kata-Unstable

Per-kata complexity ranking on `cognitive_max` (lower = better):

| Rank | game-of-life | claim-office |
|---:|---|---|
| 1 | **v4.1** (6.4) 🏆 | **v6.1** (5.7) 🏆 |
| 2 | v6.1 (6.5) | v8a (7.4) |
| 3 | v8b (9.0) | v8b (11.0) |
| 4 | v8a (10.6) | v2-iterative (11.4) |
| 5 | v2-iterative (16.2) | v1-oneshot (12.2) |
| 6 | v5.1 (17.6) | v5.1 (14.8) |
| 7 | v1-oneshot (18.8) | v3-basic-tdd (19.8) |
| 8 | v3-basic-tdd (21.8) | v4.1 (26.8) ⚠️ bimodal |

Strict phase-structured workflows (v6.1, v4.1) occupy the leading places on both katas (with the v4.1 exception on claim-office); the v8 control group follows directly behind. The weakest TDD workflows (v3, v5.1) and v1+prose share the rear third. **v6.1 is the only workflow that lands in the top 2 on both katas** and holds the top position on claim-office in 4 of 6 quality metrics.

**On claim-office, v4.1 crashes from rank 1 to rank 8** (`cognitive_max` mean 26.8, σ=24, max=68) — bimodal with occasional extreme misdirections. On game-of-life, v4.1 is the most stable performer. Reading: the v4.1 advantage (phase-isolated subagents) only carries on a kata whose test list the model can survey immediately. On claim-office with ~15 test scenarios and many ambiguities, the fresh context loses coherence per phase — the subagent re-interprets the spec per cycle. v6.1 (hybrid: skill red/green in the shared context + isolated refactor) avoids this effect, because red and green share the same context.

Recommendation: **v6.1 as the robust default choice** across kata complexity. Use v4.1 only on katas with a compact test list, otherwise there is a collapse risk.

Caveat: n=5 per claim-office cell, n=10 for v1/v2/v3 game-of-life. v4.1 claim-office `cognitive_max` σ=24 — the mean is dominated by 1–2 outliers. A larger n could shift the picture, but not the bimodal risk.

## Practical Recommendation — Code Quality vs Token Price

### Clarification of the Core Question

The original research motivation was: *is the TDD cycle with continuous refactoring per cycle more valuable than vibe-coding with a single end refactoring?* The data is unambiguous:

**Yes, continuous refactoring in the TDD cycle produces measurably better code quality.** On claim-office (a complex novel kata), v6.1 clearly wins on 5 of 6 code-quality metrics against the end-refactor controls:

| Metric (lower = better) | v6.1 (periodic) | v8a (end refactor, agent) | v8b (end refactor, command) | Winner |
|---|---:|---:|---:|---|
| `cognitive_max` | **5.7** | 7.4 | 11.0 | **v6.1** |
| `mccabe_max` | **5.7** | 6.6 | 8.0 | **v6.1** |
| `cc_longest_function` | **18.1** | 28.4 | 35.8 | **v6.1** |
| `smell_total` | **1.3** | 4.0 | 6.2 | **v6.1** |
| `cc_loc` | **191** | 246 | 239 | **v6.1** |
| `code_mass` | 861 | 814 | **780** | v8b (narrowly) |

v6.1 dominates the branching and structure metrics throughout; v8b wins only narrowly on `code_mass` (a reduction of ~9 %). On game-of-life the pattern is consistent (v6.1 `cognitive_max` 6.5 vs v8a/v8b 10.6/9.0; `cc_longest` 14.2 vs 17.6/17.6). The periodicity thesis holds uniformly.

### The Trade-off: Token and Wallclock Price

This quality is **not free**. On claim-office:

| Workflow | `cognitive_max` | `total_tokens` | `duration_s` | Token ratio |
|---|---:|---:|---:|---:|
| v8a-delayed (agent) | 7.4 | **2.12 M** | 308 | 1.0× |
| v8b-delayed (command) | 11.0 | 3.45 M | **276** | 1.6× |
| v6.1-hybrid | **5.7** | 34.54 M | 1569 | **16×** |
| v4.1-strict | 26.8 ⚠️ | 14.10 M | 3229 | 7× |

v6.1 costs **16× more tokens and ~5× more wallclock** than v8a for a reduction of 7.4 → 5.7 in `cognitive_max` (and further improvements on `cc_longest`, `smell_total`, `cc_loc`). That is the honest balance sheet.

### Recommendation by Use Case

| Situation | Workflow | Rationale |
|---|---|---|
| **Long-lived production code** — read, refactored, extended often; onboarding-relevant | **v6.1-hybrid** | Best branching complexity on both katas; the token surcharge amortizes over the code's lifetime |
| **Maintenance-critical code** with high correctness demands that is not changed frequently | **v6.1-hybrid** or **v5.1** | On claim-office, v5.1 is the second-best TDD workflow on `cognitive_max` (14.8) at ~½ the tokens of v6.1 |
| **Prototyping / throwaway code** — touched rarely or never again | **v8b-delayed-refactor-command** | Lowest wallclock among the workflows with a test-writing phase; correctness 0.97 level with v4.1; `cognitive_max` (11.0) is acceptable for a short lifetime |
| **High iteration frequency** under a token budget — many small tasks, frequent re-runs | **v8a-delayed-refactor-agent** | ~16× cheaper than v6.1; `cognitive_max` 7.4 (vs v6.1 5.7) is not ideal but acceptable for a short lifetime; 100 % correctness on claim-office |
| **Pure vibe-coding without tests** | **Not recommended for novel problems** | v1/v2 break down to 28 % correctness on a novel kata; the test-writing phase from v8a/v8b is the cheapest insurance against this |
| **Correctness counts more than quality** (e.g. scripts, tooling, glue code) | **v3-basic-tdd** | 100 % correctness on claim-office at 3.28 M tokens — the cheapest correctness workflow; accepts the worst code quality (cog 19.8, largest `code_mass`) as the price |

v4.1-strict remains **not generally recommended** because of the bimodal risk on longer test lists (claim-office σ=24, max cog=68). Only on katas with a compact, surveyable test spec.

### What This Recommendation Does NOT Cover

- **Model dependence**: all findings apply to `opus-4-7-no-thinking`. On Sonnet/Haiku the ordering can shift (cf. F-emoji-cross-model in RQ-emoji-cross-model: workflow reductions are not model-agnostic).
- **Domain dependence**: the katas are ~30–320 LoC of library/CLI code. The findings are not directly transferable to web apps, database code, or async systems.
- **Team factors**: HITL workflows (a human reviews the cycle), pair-programming setups, and IDE integration are outside the scope.
