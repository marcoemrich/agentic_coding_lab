# RQ-tdd-quality Findings

Katas: `game-of-life` (library form, training-known) and `claim-office` (CLI, novel with ambiguities). Model: `opus-4-7-no-thinking` (Portkey OR direct, OR-match). 8 workflows (6 on the TDD axis + 2 non-TDD controls end-refactor-only-v1-agent/end-refactor-only-v1-native) × 2 katas = 16 cells, n=103 runs.

## Methodological Note — Silent Workflow Drops and Aborted Refactor Loops

During the claim-office collection, one hybrid-v2 run occurred with a missing `experiment-done.txt`: the model stopped calling tools, Claude exited with `exit_code=0`/`exit_reason=ok`, but the workflow did not run to completion — a stop after the test list before the first red cycle (63 s, 11 assistant messages).

In addition, a hybrid-v2 claim-office run with an aborted refactor loop was removed: `exit_reason=ok` and all tests green, but only 4 instead of the typical 5+ cycles, 10 instead of 14–27 functions, longest function 60 LoC (median 17). The profile is inconsistent with normal hybrid-v2 behavior — the refactor subagent did not decompose the implementation.

These two runs were removed from the n=5 cells and replaced by fresh runs, or not replaced (n=7 for hybrid-v2 claim-office is > min_replicates=5). Rationale: for the TDD workflow question, what matters is the outcome of the workflow that **ran through**, not full-autonomy stability. In practical use (HITL), an aborted refactor would be fixed by a resume/re-trigger; only under full autonomy does it become a problem. Full-autonomy stability is a research question in its own right (cf. RQ-stability) and lies outside the scope of this RQ.

## Overview — Code Quality per Workflow

All metrics in the tables: lower = better. 🏆 = best value per column (also multiple times in case of a tie). **Never averaged across katas** — game-of-life (~30–40 Production LoC) and claim-office (~150–320 Production LoC) are not comparable.

### Kata: game-of-life

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-oneshot-v1-cc              | 10 | 18.8 | 12.8 | 31.7 | 4.8 | 33.6 | 155.0 |
| baseline-iterative-v1-cc            | 10 | 16.2 | 11.6 | 32.1 | 4.1 | 32.5 | 157.8 |
| baseline-inline-tdd-v1-cc            | 10 | 21.8 | 13.7 | 32.5 | 6.0 | 31.9 | 165.6 |
| exact-subagents-v2-testlist-fix-cc |  5 | **6.4** 🏆 | **5.0** 🏆 | 16.4 | **2.4** 🏆 | 32.0 | 156.6 |
| exact-single-context-v2-testlist-fix-cc |  5 | 17.6 | 10.2 | 20.8 | 4.8 | **26.6** 🏆 | 154.0 |
| v6.1-hybrid-…           | 10 | 6.5 | 5.2 | **14.2** 🏆 | **2.4** 🏆 | 29.2 | 153.7 |
| baseline-end-refactor-only-v1-agent-cc  |  5 | 10.6 | 7.4 | 17.6 | 3.0 | 31.2 | **142.0** 🏆 |
| baseline-end-refactor-only-v1-native-cc |  5 | 9.0 | 6.8 | 17.6 | **2.4** 🏆 | 31.0 | 145.8 |

### Kata: claim-office

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-oneshot-v1-cc              |  5 | 12.2 | 8.4 | 40.4 | 11.6 | 269.4 | 835.4 |
| baseline-iterative-v1-cc            |  5 | 11.4 | 8.4 | 41.4 | 15.8 | 268.6 | 851.0 |
| baseline-inline-tdd-v1-cc            |  5 | 19.8 | 15.4 | 51.6 | 16.8 | 317.4 | 992.4 |
| exact-subagents-v2-testlist-fix-cc |  5 | 26.8 ⚠️ | 16.0 ⚠️ | 40.8 | 13.2 | **156.8** 🏆 | **621.6** 🏆 |
| exact-single-context-v2-testlist-fix-cc |  6 | 14.8 | 10.2 | 32.7 | 6.8 | 167.2 | 692.7 |
| v6.1-hybrid-…           |  7 | **5.7** 🏆 | **5.7** 🏆 | **18.1** 🏆 | **1.3** 🏆 | 191.1 | 861.3 |
| baseline-end-refactor-only-v1-agent-cc  |  5 | 7.4 | 6.6 | 28.4 | 4.0 | 245.6 | 813.8 |
| baseline-end-refactor-only-v1-native-cc |  5 | 11.0 | 8.0 | 35.8 | 6.2 | 238.8 | 780.2 |

⚠️ subagents-v2 claim-office is bimodal (`cognitive_max` σ=24, max=68) — occasional extreme misdirections. See F-tdd-quality.9.

Correctness **differs** between the two katas: on game-of-life all 8 workflows are at `verification_pct=1.00`. On claim-office it varies between 0.28 (oneshot-v1+iterative-v1, vibe-coding without tests) and 1.00 (inline-tdd-v1, single-context-v2, hybrid-v2, end-refactor-only-v1-agent) — see F-tdd-quality.4 and F-tdd-quality.8. `mutation_score` was collected only for oneshot-v1/iterative-v1/inline-tdd-v1 on game-of-life (0.95 ± 0.01 in all three).

## F-tdd-quality.1 — Strict Phase-Structured Workflows with a Refactor Phase Lower the Complexity Peaks Drastically

On game-of-life, subagents-v2 and hybrid-v2 reach `cognitive_max ≈ 6–7` and `mccabe_max ≈ 5` — these are ~⅓ of the values of oneshot-v1/iterative-v1/inline-tdd-v1 (`cognitive_max ≈ 16–22`, `mccabe_max ≈ 12–14`). `cc_longest_function` halves accordingly (13–16 vs. 32). `smell_total` also halves (≈2.3 vs. 4–6).

On claim-office the pattern holds **even more clearly** for hybrid-v2: `cognitive_max` 5.7, `mccabe_max` 5.7, `cc_longest_function` 18.1 — all the lowest values of the entire matrix. subagents-v2, by contrast, breaks down on claim-office (see F-tdd-quality.9) — it does stay at the top on `code_mass` and `cc_loc` (621.6/156.8, each the best across all workflows), but collapses on branching complexity.

Plausible mechanic: subagents-v2 and hybrid-v2 prescribe a dedicated refactor phase per cycle that explicitly reduces complexity — and both separate implementation (green) and refactor architecturally (subagents-v2 via an isolated subagent, hybrid-v2 via a dedicated refactor subagent in the hybrid). The refactor discipline shows up directly in the complexity peaks, not in `cc_loc` — the code does not become shorter, but flatter.

## F-tdd-quality.2 — Naive "use TDD" (inline-tdd-v1) Brings No Complexity Advantage over Non-TDD (oneshot-v1/iterative-v1) on game-of-life

On game-of-life, inline-tdd-v1 is at or slightly above oneshot-v1/iterative-v1 in *all* complexity metrics: `cognitive_max` 21.8 (inline-tdd-v1) vs. 18.8/16.2 (oneshot-v1/iterative-v1), `mccabe_max` 13.7 vs. 12.8/11.6, `smell_total` 6.0 vs. 4.8/4.1, `code_mass` 165.6 vs. 155/157.8. Function sizes (`cc_longest_function`, `cc_loc`) are comparable.

On claim-office, inline-tdd-v1 is even **clearly worse** than oneshot-v1/iterative-v1 in almost all metrics: `cognitive_max` 19.8 vs. 12.2/11.4, `mccabe_max` 15.4 vs. 8.4/8.4, `cc_longest_function` 51.6 vs. 40.4/41.4, `cc_loc` 317.4 vs. 269.4/268.6, `code_mass` 992.4 vs. 835.4/851.0. The naive "use TDD" approach produces the heaviest code of the whole matrix on the novel kata — the test-first increments drive the implementation into a fragmented structure without a structured cleanup rhythm.

Plausible mechanic: inline-tdd-v1 is a single agent with the minimal instruction "use TDD" and without an enforced red-green-refactor rhythm — no isolated refactor step, no phase structure. On a training-known kata the model produces an orderly solution even without TDD; on a novel kata inline-tdd-v1 appends test satisfaction to test satisfaction incrementally — without periodic refactoring the result becomes clunkier than even a poor oneshot solution. The measurable quality advantage only comes from the structured refactor discipline of the strict workflows (F-tdd-quality.1). The "use TDD" label alone does not suffice — the lever is the enforced refactor step in the rhythm, not the test-first instruction.

Hypothesis H1 ("inline-tdd-v1/subagents-v2/single-context-v2 show lower complexity than oneshot-v1/iterative-v1") therefore does *not* hold uniformly for all TDD workflows — inline-tdd-v1 reaches (game-of-life) or falls below (claim-office) the non-TDD level; only subagents-v2 (game-of-life) and hybrid-v2 (both katas) separate themselves clearly.

## F-tdd-quality.3 — Single Context (single-context-v2) Loses the Complexity Advantage of the Phase-Isolated Subagents (subagents-v2) — But Only on game-of-life

single-context-v2 and subagents-v2 carry the same phase-script content (test-list-scope-fix, test list → red → green → refactor) and differ only in the invocation mechanism: subagents-v2 spawns a fresh subagent per phase (isolated context), single-context-v2 invokes skills in the same context.

On **game-of-life**, single-context-v2 shows values at the oneshot-v1/iterative-v1/inline-tdd-v1 level in the peak metrics:

| Metric (lower = better) | subagents-v2 (isolated) | single-context-v2 (shared) | Factor single-context-v2 / subagents-v2 |
|---|---:|---:|---:|
| `cognitive_max` | **6.4** 🏆 | 17.6 | 2.8× |
| `mccabe_max`    | **5.0** 🏆 | 10.2 | 2.0× |
| `cc_longest_function` | **16.4** 🏆 | 20.8 | 1.3× |
| `smell_total`   | **2.4** 🏆 | 4.8 | 2.0× |

On **claim-office the ordering reverses** — single-context-v2 clearly beats subagents-v2:

| Metric (lower = better) | subagents-v2 (isolated) | single-context-v2 (shared) |
|---|---:|---:|
| `cognitive_max` | 26.8 ⚠️ | **14.8** 🏆 |
| `mccabe_max`    | 16.0 ⚠️ | **10.2** 🏆 |
| `cc_longest_function` | 40.8 | **32.7** 🏆 |
| `smell_total`   | 13.2 | **6.8** 🏆 |

Plausible mechanic: on the short game-of-life test list the fresh subagent context helps, because each phase can survey the whole test list in isolation; on the long claim-office test list the fresh context loses coherence per cycle and re-interprets spec ambiguities differently. single-context-v2 with its shared context benefits from spec consistency within a session. The hybrid hybrid-v2 (skill red/green in the shared context + isolated refactor subagent) combines both strengths and dominates claim-office across the branching and size metrics — see RQ-context (4.3) F-context.1 for the explicit decomposition.

## F-tdd-quality.4 — Correctness Is Workflow-Dependent on a Novel Kata; oneshot-v1/iterative-v1 Vibe-Coding Collapses on claim-office

`verification_pct` is **structurally different** on the two katas:

| Kata | oneshot-v1 | iterative-v1 | inline-tdd-v1 | subagents-v2 | single-context-v2 | hybrid-v2 | end-refactor-only-v1-agent | end-refactor-only-v1-native |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| game-of-life | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| claim-office | **0.28** | **0.28** | 1.00 | 0.96 | 1.00 | 1.00 | 1.00 | 0.97 |

On game-of-life all 8 workflows are at 100 % (15/15 verification scenarios) — the workflow effect is invisible here, because the model has memorized the solution. On claim-office (novel with ambiguities), **oneshot-v1 and iterative-v1** drop to ~28 % (4/15) — for the vibe-coding prose variant the model writes a solution that fails in 11 of 15 scenarios. All workflows with a **test-writing phase** (inline-tdd-v1+, end-refactor-only-v1-agent/end-refactor-only-v1-native) stay at ≥ 96 %; most reach 100 %. The smaller deviations at subagents-v2 (0.96) and end-refactor-only-v1-native (0.97) come from 1 run each with `verification_pct ∈ {0.80, 0.87}` (implementation bugs that do not quite cover the spec — not silent workflow drops).

**H4 (correctness independent of the workflow) refuted.** The workflow effect on correctness is kata-dependent: invisible on training-known katas, dominant on novel katas. The vibe-coding workflows oneshot-v1/iterative-v1 without tests drop out; even writing tests after the fact (end-refactor-only-v1-agent/end-refactor-only-v1-native) is enough to reach TDD level — see F-tdd-quality.8.

## F-tdd-quality.5 — The Cost Range Between Workflows Spans an Order of Magnitude; Strict Workflows Are 5–50× More Expensive; Kata Complexity Scales Linearly

### game-of-life

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| baseline-oneshot-v1-cc              | 88 | 994 k |
| baseline-iterative-v1-cc            | 83 | 967 k |
| baseline-inline-tdd-v1-cc            | **75** 🏆 | **799 k** 🏆 |
| exact-subagents-v2-testlist-fix-cc | 838 | 4.32 M |
| exact-single-context-v2-testlist-fix-cc | 293 | 8.40 M |
| v6.1-hybrid-…           | 508 | 6.94 M |
| baseline-end-refactor-only-v1-agent-cc  | 143 | 1.18 M |
| baseline-end-refactor-only-v1-native-cc | 116 | 1.32 M |

### claim-office

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| baseline-oneshot-v1-cc              | 231 | **2.11 M** 🏆 |
| baseline-iterative-v1-cc            | 244 | 2.12 M |
| baseline-inline-tdd-v1-cc            | 312 | 3.28 M |
| exact-subagents-v2-testlist-fix-cc | 3229 | 14.10 M |
| exact-single-context-v2-testlist-fix-cc | 641 | 18.73 M |
| v6.1-hybrid-…           | 1569 | 34.54 M ⚠️ |
| baseline-end-refactor-only-v1-agent-cc  | 308 | 2.12 M |
| baseline-end-refactor-only-v1-native-cc | **276** 🏆 | 3.45 M |

On claim-office, the strict TDD workflows cost **3–10× more** than on game-of-life — and hybrid-v2 has the largest token range (σ=12 M, max 44.85 M). On claim-office, subagents-v2 takes on average **54 minutes per run** — combined with the bimodal risk (F-tdd-quality.9), the worst cost-quality trade-off of the entire matrix.

On both katas, end-refactor-only-v1-agent/end-refactor-only-v1-native are at the oneshot-v1/iterative-v1/inline-tdd-v1 cost level (~1–3 M tokens, 2–5 min) and deliver (on claim-office) considerably better branching complexity than oneshot-v1/iterative-v1/inline-tdd-v1 and correctness comparable to the strict TDD workflows — see F-tdd-quality.6 and F-tdd-quality.8.

## F-tdd-quality.6 — Vibe + End Refactoring Reaches the Volume Level of the Strict TDD Workflows at Non-TDD Cost; Branching Complexity Remains Weaker

The non-TDD control group end-refactor-only-v1-agent/end-refactor-only-v1-native (phase 1 implementation without tests → phase 2 tests against `prompt.md` → phase 3 a single refactor) reaches the level of the strict TDD workflows on the volume metrics at a fraction of the cost.

### game-of-life

| Workflow | `code_mass` | `cc_longest_function` | `cognitive_max` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|
| subagents-v2 (periodic refactor) | 156.6 | 16.4 | **6.4** 🏆 | 838 | 4.32 M |
| hybrid-v2 (periodic refactor) | 153.7 | **14.2** 🏆 | 6.5 | 508 | 6.94 M |
| **end-refactor-only-v1-agent (end refactor, agent)** | **142.0** 🏆 | 17.6 | 10.6 | 143 | **1.18 M** 🏆 |
| **end-refactor-only-v1-native (end refactor, command)** | 145.8 | 17.6 | 9.0 | **116** 🏆 | 1.32 M |

### claim-office

| Workflow | `code_mass` | `cc_longest_function` | `cognitive_max` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|
| subagents-v2 (periodic refactor) | **621.6** 🏆 | 40.8 | 26.8 ⚠️ | 3229 | 14.10 M |
| hybrid-v2 (periodic refactor) | 861.3 | **18.1** 🏆 | **5.7** 🏆 | 1569 | 34.54 M |
| **end-refactor-only-v1-agent (end refactor, agent)** | 813.8 | 28.4 | 7.4 | 308 | **2.12 M** 🏆 |
| **end-refactor-only-v1-native (end refactor, command)** | 780.2 | 35.8 | 11.0 | **276** 🏆 | 3.45 M |

H5 (the periodicity of refactoring matters) is **kata-dependent**:
- On game-of-life: end-refactor-only-v1-agent/end-refactor-only-v1-native are almost level with subagents-v2/hybrid-v2 on `code_mass` and `cc_longest_function`; `cognitive_max` remains subagents-v2/v6.1-dominated (6.4/6.5 vs 9.0/10.6).
- On claim-office: hybrid-v2 clearly dominates on branching complexity (`cognitive_max` 5.7 vs end-refactor-only-v1-agent/b 7.4/11.0) and function size (`cc_longest_function` 18.1 vs 28.4/35.8). subagents-v2 (the code-volume champion at 621.6), by contrast, delivers the worst branching complexity (26.8 ⚠️) — no workflow dominates *all* metrics on claim-office.

Reading: a single end refactoring after vibe-coding reduces code volume comparably to periodic refactoring, but not the branching depth within individual functions. On a complex kata with longer functions the periodicity advantage becomes more visible — the TDD refactor per cycle decomposes functions early, while an end refactor only smooths them superficially. Consistent with RQ-delayed-refactor "the TDD advantage is branching complexity, not substance".

## F-tdd-quality.7 — The Subagent Mechanism for the End Refactor Beats the Slash Command on the Large Kata; Level on the Small Kata

The two non-TDD arms isolate the **refactor delivery mechanism** at identical refactor content: end-refactor-only-v1-agent spawns a fresh refactor subagent (`.claude/agents/refactor.md`, Task tool), end-refactor-only-v1-native invokes the same content as a slash command (`.claude/commands/refactor.md`, Skill tool) inline in the main session context. Both refactor specs are byte-identical (Four Rules of Simple Design + APP mass + naming evaluation + mandatory attempt). Phase 1 and phase 2 are likewise identical.

On **game-of-life both mechanisms are practically level**:

| Metric (lower = better) | end-refactor-only-v1-agent (subagent) | end-refactor-only-v1-native (command) |
|---|---:|---:|
| `cognitive_max` mean | 10.6 (max 15) | **9.0** (max 17) |
| `mccabe_max` mean | 7.4 (max 9) | **6.8** (max 11) |
| `cc_longest_function` mean | 17.6 (max 27) | 17.6 (max 27) |
| `smell_total` mean | 3.0 | **2.4** |
| `total_tokens` mean | **1.18 M** | 1.32 M |
| `code_mass` mean | **142.0** | 145.8 |

All differences lie within 1 σ (e.g. `cognitive_max` σ_v8a=4.93, σ_v8b=4.47); no systematic advantage of either mechanism.

On **claim-office, end-refactor-only-v1-agent (subagent) clearly dominates on Complexity Peak and token efficiency**:

| Metric (lower = better) | end-refactor-only-v1-agent (subagent) | end-refactor-only-v1-native (command) |
|---|---:|---:|
| `cognitive_max` mean | **7.4** (max 10) | 11.0 (max 19) |
| `mccabe_max` mean | **6.6** (max 9) | 8.0 (max 13) |
| `cc_longest_function` mean | **28.4** (max 30) | 35.8 (max 49) |
| `smell_total` mean | **4.0** | 6.2 |
| `total_tokens` mean | **2.12 M** | 3.45 M |
| `verification_pct` mean | **1.00** | 0.97 |
| `code_mass` mean | 813.8 | **780.2** |

end-refactor-only-v1-agent leads on 6 of 7 metrics; on `cc_longest_function` the range is particularly tight (end-refactor-only-v1-agent max 30, end-refactor-only-v1-native max 49 — the subagent prevents the outlier functions). end-refactor-only-v1-native needs 63 % more tokens and produces wider distributions.

**H6 (subagent delivery matters independently of the content) confirmed on claim-office; no separation on game-of-life.** Plausible mechanic: the fresh subagent context relieves the refactor of anchoring bias from phases 1/2 — on the small, training-known game-of-life codebase the bias effect is small and both mechanisms deliver similarly; on the larger novel claim-office codebase with 240+ LoC per solution, the inline command (end-refactor-only-v1-native) carries implicit assumptions from the preceding phases into the refactor, whereas the subagent (end-refactor-only-v1-agent) starts afresh with the refactor. Consistent with RQ-delayed-refactor / F-delayed-refactor.2 (the refactor mechanism is non-trivial), now cleanly isolated from content effects.

## F-tdd-quality.8 — A Test-Writing Phase Rescues Correctness on a Novel Kata; Pure Vibe-Coding Fails

On the novel kata `claim-office` with ambiguities, the **presence of a test-writing phase** is the decisive lever for correctness — not its position (before or after implementation):

| Workflow | Test phase? | n | `verification_pct` mean | min |
|---|---|---:|---:|---:|
| baseline-oneshot-v1-cc (prose) | no | 5 | **0.28** | 0.20 |
| baseline-iterative-v1-cc (prose) | no | 5 | **0.28** | 0.20 |
| exact-subagents-v2-testlist-fix-cc (em) | TDD strict | 5 | 0.96 | 0.80 |
| baseline-end-refactor-only-v1-native-cc (em) | after impl | 5 | 0.97 | 0.87 |
| baseline-inline-tdd-v1-cc (em) | TDD strict | 5 | 1.00 | 1.00 |
| exact-single-context-v2-testlist-fix-cc (em) | TDD strict | 6 | 1.00 | 1.00 |
| v6.1-hybrid-… (em) | TDD strict | 7 | 1.00 | 1.00 |
| baseline-end-refactor-only-v1-agent-cc (em) | after impl | 5 | 1.00 | 1.00 |

oneshot-v1/iterative-v1 without tests fall to 28 % (4/15 verification scenarios). As soon as any phase writes tests against the spec, correctness jumps to ≥ 96 %. The strict TDD workflows inline-tdd-v1/single-context-v2/hybrid-v2 as well as end-refactor-only-v1-agent (delayed refactor via subagent) reach 100 %; subagents-v2 and end-refactor-only-v1-native are at 96–97 % with one run each below 1.00 (implementation bugs that miss individual verification scenarios — not silent workflow drops).

On game-of-life this lever is **invisible** (all 8 workflows at 100 %), because the model has memorized the solution. The finding manifests itself only on novel katas.

Consequence for open question #4 ("is a single end refactoring after vibe-coding sufficient?"): **Yes for correctness, if the tests written after the fact cover the spec** — end-refactor-only-v1-agent (with the scope-fix obligation "Cover every spec example" in phase 2) reaches 100 % on claim-office, level with inline-tdd-v1/single-context-v2/hybrid-v2 (strict TDD); end-refactor-only-v1-native 97 %, close to subagents-v2. Code quality is a separate axis (see F-tdd-quality.6/.7).

Caveat: oneshot-v1/iterative-v1 use the `prose` prompt, end-refactor-only-v1-agent/end-refactor-only-v1-native `example-mapping`. The `example-mapping` spec is in fact an implicit test spec — the effect could partly be attributable to the prompt style, not only to the test phase. RQ-prompt-correctness (1.1) showed, however, that example mapping alone brings only ~5 pp over prose on single-context-v1; the effect measured here (+68 pp) is too large for a pure prompt-style effect.

## F-tdd-quality.9 — The hybrid-v2 Hybrid Is the Most Robust TDD Workflow Across Both Katas; subagents-v2 Is Kata-Unstable

Per-kata complexity ranking on `cognitive_max` (lower = better):

| Rank | game-of-life | claim-office |
|---:|---|---|
| 1 | **subagents-v2** (6.4) 🏆 | **hybrid-v2** (5.7) 🏆 |
| 2 | hybrid-v2 (6.5) | end-refactor-only-v1-agent (7.4) |
| 3 | end-refactor-only-v1-native (9.0) | end-refactor-only-v1-native (11.0) |
| 4 | end-refactor-only-v1-agent (10.6) | baseline-iterative-v1-cc (11.4) |
| 5 | baseline-iterative-v1-cc (16.2) | baseline-oneshot-v1-cc (12.2) |
| 6 | single-context-v2 (17.6) | single-context-v2 (14.8) |
| 7 | baseline-oneshot-v1-cc (18.8) | baseline-inline-tdd-v1-cc (19.8) |
| 8 | baseline-inline-tdd-v1-cc (21.8) | subagents-v2 (26.8) ⚠️ bimodal |

Strict phase-structured workflows (hybrid-v2, subagents-v2) occupy the leading places on both katas (with the subagents-v2 exception on claim-office); the v8 control group follows directly behind. The weakest TDD workflows (inline-tdd-v1, single-context-v2) and oneshot-v1+prose share the rear third. **hybrid-v2 is the only workflow that lands in the top 2 on both katas** and holds the top position on claim-office in 4 of 6 quality metrics.

**On claim-office, subagents-v2 crashes from rank 1 to rank 8** (`cognitive_max` mean 26.8, σ=24, max=68) — bimodal with occasional extreme misdirections. On game-of-life, subagents-v2 is the most stable performer. Reading: the subagents-v2 advantage (phase-isolated subagents) only carries on a kata whose test list the model can survey immediately. On claim-office with ~15 test scenarios and many ambiguities, the fresh context loses coherence per phase — the subagent re-interprets the spec per cycle. hybrid-v2 (hybrid: skill red/green in the shared context + isolated refactor) avoids this effect, because red and green share the same context.

Recommendation: **hybrid-v2 as the robust default choice** across kata complexity. Use subagents-v2 only on katas with a compact test list, otherwise there is a collapse risk.

Caveat: n=5 per claim-office cell, n=10 for oneshot-v1/iterative-v1/inline-tdd-v1 game-of-life. subagents-v2 claim-office `cognitive_max` σ=24 — the mean is dominated by 1–2 outliers. A larger n could shift the picture, but not the bimodal risk.

## Practical Recommendation — Code Quality vs Token Price

### Clarification of the Core Question

The original research motivation was: *is the TDD cycle with continuous refactoring per cycle more valuable than vibe-coding with a single end refactoring?* The data is unambiguous:

**Yes, continuous refactoring in the TDD cycle produces measurably better code quality.** On claim-office (a complex novel kata), hybrid-v2 clearly wins on 5 of 6 code-quality metrics against the end-refactor controls:

| Metric (lower = better) | hybrid-v2 (periodic) | end-refactor-only-v1-agent (end refactor, agent) | end-refactor-only-v1-native (end refactor, command) | Winner |
|---|---:|---:|---:|---|
| `cognitive_max` | **5.7** | 7.4 | 11.0 | **hybrid-v2** |
| `mccabe_max` | **5.7** | 6.6 | 8.0 | **hybrid-v2** |
| `cc_longest_function` | **18.1** | 28.4 | 35.8 | **hybrid-v2** |
| `smell_total` | **1.3** | 4.0 | 6.2 | **hybrid-v2** |
| `cc_loc` | **191** | 246 | 239 | **hybrid-v2** |
| `code_mass` | 861 | 814 | **780** | end-refactor-only-v1-native (narrowly) |

hybrid-v2 dominates the branching and structure metrics throughout; end-refactor-only-v1-native wins only narrowly on `code_mass` (a reduction of ~9 %). On game-of-life the pattern is consistent (hybrid-v2 `cognitive_max` 6.5 vs end-refactor-only-v1-agent/end-refactor-only-v1-native 10.6/9.0; `cc_longest` 14.2 vs 17.6/17.6). The periodicity thesis holds uniformly.

### The Trade-off: Token and Wallclock Price

This quality is **not free**. On claim-office:

| Workflow | `cognitive_max` | `total_tokens` | `duration_s` | Token ratio |
|---|---:|---:|---:|---:|
| v8a-delayed (agent) | 7.4 | **2.12 M** | 308 | 1.0× |
| v8b-delayed (command) | 11.0 | 3.45 M | **276** | 1.6× |
| v6.1-hybrid | **5.7** | 34.54 M | 1569 | **16×** |
| v4.1-strict | 26.8 ⚠️ | 14.10 M | 3229 | 7× |

hybrid-v2 costs **16× more tokens and ~5× more wallclock** than end-refactor-only-v1-agent for a reduction of 7.4 → 5.7 in `cognitive_max` (and further improvements on `cc_longest`, `smell_total`, `cc_loc`). That is the honest balance sheet.

### Recommendation by Use Case

| Situation | Workflow | Rationale |
|---|---|---|
| **Long-lived production code** — read, refactored, extended often; onboarding-relevant | **v6.1-hybrid** | Best branching complexity on both katas; the token surcharge amortizes over the code's lifetime |
| **Maintenance-critical code** with high correctness demands that is not changed frequently | **v6.1-hybrid** or **single-context-v2** | On claim-office, single-context-v2 is the second-best TDD workflow on `cognitive_max` (14.8) at ~½ the tokens of hybrid-v2 |
| **Prototyping / throwaway code** — touched rarely or never again | **v8b-delayed-refactor-command** | Lowest wallclock among the workflows with a test-writing phase; correctness 0.97 level with subagents-v2; `cognitive_max` (11.0) is acceptable for a short lifetime |
| **High iteration frequency** under a token budget — many small tasks, frequent re-runs | **baseline-end-refactor-only-v1-agent-cc** | ~16× cheaper than hybrid-v2; `cognitive_max` 7.4 (vs hybrid-v2 5.7) is not ideal but acceptable for a short lifetime; 100 % correctness on claim-office |
| **Pure vibe-coding without tests** | **Not recommended for novel problems** | oneshot-v1/iterative-v1 break down to 28 % correctness on a novel kata; the test-writing phase from end-refactor-only-v1-agent/end-refactor-only-v1-native is the cheapest insurance against this |
| **Correctness counts more than quality** (e.g. scripts, tooling, glue code) | **baseline-inline-tdd-v1-cc** | 100 % correctness on claim-office at 3.28 M tokens — the cheapest correctness workflow; accepts the worst code quality (cog 19.8, largest `code_mass`) as the price |

v4.1-strict remains **not generally recommended** because of the bimodal risk on longer test lists (claim-office σ=24, max cog=68). Only on katas with a compact, surveyable test spec.

### What This Recommendation Does NOT Cover

- **Model dependence**: all findings apply to `opus-4-7-no-thinking`. On Sonnet/Haiku the ordering can shift (cf. F-emoji-cross-model in RQ-emoji-cross-model: workflow reductions are not model-agnostic).
- **Domain dependence**: the katas are ~30–320 LoC of library/CLI code. The findings are not directly transferable to web apps, database code, or async systems.
- **Team factors**: HITL workflows (a human reviews the cycle), pair-programming setups, and IDE integration are outside the scope.
