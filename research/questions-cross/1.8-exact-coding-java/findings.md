# Findings — RQ-exact-coding-java

## Overview

All values are cell means at `n=5`. Comparisons are only within the same model and kata; the three methods are the columns. **Inline** is the minimal inline-TDD instruction, **EXACT v1** the shared-context Predictive TDD workflow, **EXACT v1.1** the same workflow with the Refactor step delegated to an isolated subagent.

Correctness and budget completion are higher = better; complexity, method size, duration, and cost are lower = better. Bold values with 🏆 mark the winner of that row. A trophy is shared when the gap to the best cell is smaller than that cell's own standard deviation; three trophies in a row therefore read as "no effect".

### Correctness and budget

| Model | Kata | Correctness (external) Inline | EXACT v1 | EXACT v1.1 | Within budget Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| GPT-5.6 SOL | Claim Office | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| Opus 5 | Game of Life | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| Opus 5 | Claim Office | **1.00** 🏆 | 0.97 | 0.97 | **100 %** 🏆 | **100 %** 🏆 | 80 % |

### Complexity Peak

| Model | Kata | Cognitive max Inline | EXACT v1 | EXACT v1.1 | McCabe max Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 9.8 | **5.8** 🏆 | **6.0** 🏆 | 8.2 | **4.2** 🏆 | **4.4** 🏆 |
| GPT-5.6 SOL | Claim Office | 9.8 | **5.8** 🏆 | 7.8 | 10.4 | **7.4** 🏆 | **7.8** 🏆 |
| Opus 5 | Game of Life | **5.0** 🏆 | **4.6** 🏆 | **7.0** 🏆 | **3.8** 🏆 | **3.8** 🏆 | **4.8** 🏆 |
| Opus 5 | Claim Office | 6.6 | 4.4 | **3.4** 🏆 | 6.2 | **4.4** 🏆 | **4.2** 🏆 |

### Method size (NCSS)

| Model | Kata | NCSS max Inline | EXACT v1 | EXACT v1.1 | NCSS avg Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 14.0 | **7.4** 🏆 | **7.0** 🏆 | 7.26 | **3.84** 🏆 | **3.62** 🏆 |
| GPT-5.6 SOL | Claim Office | 32.6 | **24.4** 🏆 | **27.8** 🏆 | 7.75 | 5.64 | **3.71** 🏆 |
| Opus 5 | Game of Life | **7.0** 🏆 | **7.0** 🏆 | **7.6** 🏆 | **3.65** 🏆 | **3.60** 🏆 | **4.08** 🏆 |
| Opus 5 | Claim Office | 19.4 | 12.6 | **9.8** 🏆 | 4.89 | 4.05 | **3.10** 🏆 |

### Efficiency

| Model | Kata | Duration Inline | EXACT v1 | EXACT v1.1 | Cost Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | **195 s** 🏆 | 916 s | 2,256 s | **$0.42** 🏆 | $2.21 | $5.92 |
| GPT-5.6 SOL | Claim Office | **296 s** 🏆 | 1,996 s | 6,072 s | **$0.58** 🏆 | $5.25 | $17.78 |
| Opus 5 | Game of Life | **251 s** 🏆 | 756 s | 2,652 s | **$1.41** 🏆 | $5.88 | $11.22 |
| Opus 5 | Claim Office | **347 s** 🏆 | 1,313 s | 5,509 s | **$2.88** 🏆 | $15.33 | $33.69 |

### Test strength (Mutation Score)

Higher = better. PIT against the run's own JUnit 5 suite, `n=5` per cell.

| Model | Kata | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 0.86 | **0.90** 🏆 | **0.94** 🏆 |
| GPT-5.6 SOL | Claim Office | 0.81 | 0.91 | **0.94** 🏆 |
| Opus 5 | Game of Life | 0.91 | **0.92** 🏆 | **0.93** 🏆 |
| Opus 5 | Claim Office | 0.88 | 0.93 | **0.96** 🏆 |

Code Mass (APP), Production LoC, Test LoC, test count, method count, and process-marker counts have ambiguous direction and therefore receive no trophy. Smell Total is zero in every cell and has no winner. Every cell clears the correctness gate, so all quality and efficiency rows are eligible.

---

## F-1.8.1 — Neither EXACT Coding variant improves correctness on the Java tasks

Correctness is saturated under inline TDD. GPT-5.6 SOL is perfect under all three methods on both katas, as is Opus 5 on Game of Life. On Claim Office, Opus inline TDD is perfect while both EXACT variants miss one of fifteen scenarios in two of five runs each.

| Model | Kata | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| GPT-5.6 SOL | Claim Office | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Opus 5 | Game of Life | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Opus 5 | Claim Office | 1.00 ± 0.00 | 0.97 ± 0.04 | 0.97 ± 0.04 |

Correctness (internal) is 100 % in all twelve cells. The Java evidence therefore provides no correctness justification for either layer of additional workflow structure — measured against the specification. It does not follow that the suites are equally good: F-1.8.9 shows that the same saturated correctness rests on test suites of clearly different strength. That the same small Opus Claim Office shortfall appears in both EXACT arms makes it more likely to be a property of the workflow's reading of the specification than replicate noise, but at `n=5` per cell it remains an observed downside rather than a demonstrated regression.

---

## F-1.8.2 — EXACT Coding lowers Java Complexity Peak; the isolated Refactor subagent adds nothing beyond it

The shared-context workflow produces the complexity effect. Delegating the Refactor step to an isolated subagent does not deepen it: on three of four model × kata combinations the peak values are unchanged or slightly worse, and only Opus Claim Office improves further.

| Model | Kata | Cognitive max Inline → v1 → v1.1 | McCabe max Inline → v1 → v1.1 | Cognitive avg Inline → v1 → v1.1 | McCabe avg Inline → v1 → v1.1 |
|---|---|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 9.8 → 5.8 → 6.0 | 8.2 → 4.2 → 4.4 | 4.73 → 2.24 → 2.22 | 4.38 → 1.64 → 1.67 |
| GPT-5.6 SOL | Claim Office | 9.8 → 5.8 → 7.8 | 10.4 → 7.4 → 7.8 | 3.24 → 2.22 → 1.97 | 3.52 → 2.71 → 1.87 |
| Opus 5 | Game of Life | 5.0 → 4.6 → 7.0 | 3.8 → 3.8 → 4.8 | 2.10 → 1.75 → 2.08 | 1.61 → 1.57 → 1.86 |
| Opus 5 | Claim Office | 6.6 → 4.4 → 3.4 | 6.2 → 4.4 → 4.2 | 2.18 → 1.49 → 1.38 | 2.13 → 1.75 → 1.37 |

For SOL the inline → v1 reductions are larger than ordinary within-cell variation and repeat across both tasks and both complexity families; the v1 → v1.1 step stays inside it. For Opus, Claim Office improves monotonically across all four measures, while Game of Life is a tie between inline and v1 and gets worse under v1.1 — that cell's `cognitive_max` is 7.0 in every single v1.1 run (σ = 0.00) against 4.6 ± 3.29 under v1.

The averages tell a friendlier story about v1.1 than the maxima do: `cognitive_avg` and `mccabe_avg` drop under the subagent on both Claim Office cells. The subagent distributes complexity more evenly without pulling the worst method down.

---

## F-1.8.3 — The isolated Refactor subagent grows the codebase, most sharply on Opus Claim Office

The shared-context workflow shrinks SOL's Java code. The subagent variant reverses that on every cell: more Production LoC and more Code Mass (APP) than v1 throughout, with Opus Claim Office more than doubling against its own inline baseline.

| Model | Kata | Production LoC Inline → v1 → v1.1 | Code Mass (APP) Inline → v1 → v1.1 | Test LoC Inline → v1 → v1.1 |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 109.2 → 94.4 → 113.4 | 324.4 → 265.8 → 277.4 | 119.2 → 143.8 → 132.2 |
| GPT-5.6 SOL | Claim Office | 292.2 → 206.2 → 314.6 | 1,028.6 → 720.4 → 828.0 | 130.6 → 195.6 → 158.0 |
| Opus 5 | Game of Life | 102.8 → 116.4 → 143.6 | 266.4 → 290.6 → 328.8 | 134.8 → 227.4 → 256.2 |
| Opus 5 | Claim Office | 397.6 → 376.4 → 805.8 | 1,101.4 → 966.2 → 1,316.4 | 425.8 → 536.4 → 614.8 |

Code size has no universally preferred direction, so these values are mechanism evidence rather than automatic quality losses. The Opus Claim Office jump from 376 to 806 Production LoC at unchanged external correctness and a test count that barely moves (53.4 → 51.8) is nevertheless the single largest structural difference in this RQ, and it is produced by a step whose stated purpose is cleanup.

---

## F-1.8.4 — Each layer of structure multiplies the efficiency premium

EXACT Coding is slower and more token-intensive than inline TDD in every contrast, and the isolated Refactor subagent multiplies that premium again. The cost ladder is monotonic in all four model × kata combinations.

| Model | Kata | Duration Inline → v1 → v1.1 | Tokens Inline → v1 → v1.1 | Cost Inline → v1 → v1.1 |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 195 s → 916 s → 2,256 s | 223k → 2.45 M → 4.45 M | $0.42 → $2.21 → $5.92 |
| GPT-5.6 SOL | Claim Office | 296 s → 1,996 s → 6,072 s | 290k → 7.74 M → 15.68 M | $0.58 → $5.25 → $17.78 |
| Opus 5 | Game of Life | 251 s → 756 s → 2,652 s | 1.29 M → 6.19 M → 13.82 M | $1.41 → $5.88 → $11.22 |
| Opus 5 | Claim Office | 347 s → 1,313 s → 5,509 s | 2.64 M → 19.07 M → 51.02 M | $2.88 → $15.33 → $33.69 |

The v1 → v1.1 step alone costs roughly two to three and a half times as much and runs two and a half to four times as long. Against inline TDD, v1.1 costs eight to thirty times as much and runs ten to twenty times as long. The Opus Claim Office cell reaches 51 M tokens and $33.69 per run and is the only cell in the RQ that misses the time budget (one of five runs, `completed_within_budget` 80 %); that run's tests were green and its external verification perfect, so the budget miss is a cost symptom, not a failure.

Inline TDD therefore remains the stronger Java default when correctness and efficiency dominate. EXACT v1 is justified where the measured complexity reduction is worth roughly five times the cost; v1.1's additional premium buys no correctness and, outside Opus Claim Office, no lower Complexity Peak.

---

## F-1.8.5 — PMD threshold smells do not discriminate these Java cells

Smell Total is zero in all 60 runs after treating Cognitive Complexity and Cyclomatic Complexity findings as score carriers rather than smells. The configured threshold-oriented PMD rules therefore provide no workflow discrimination on these katas, across all three methods.

The continuous per-method complexity scores remain informative and produce the differences in F-1.8.2. For this Java stack, Cognitive Complexity and McCabe metrics should be preferred over binary PMD smell counts when evaluating small kata implementations.

---

## F-1.8.6 — The isolated Refactor subagent trades many small methods for a lower typical method size

Per-method NCSS measures functional decomposition without conflating method bodies with imports, declarations, or blank lines. Both EXACT variants lower method size against inline TDD on SOL and on Opus Claim Office. The subagent's distinctive move is quantity: it roughly doubles the method count on both Claim Office cells while cutting typical method size.

| Model | Kata | Methods Inline → v1 → v1.1 | NCSS max Inline → v1 → v1.1 | NCSS avg Inline → v1 → v1.1 | NCSS median Inline → v1 → v1.1 |
|---|---|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 6.4 → 9.6 → 12.0 | 14.0 → 7.4 → 7.0 | 7.26 → 3.84 → 3.62 | 6.4 → 3.3 → 3.0 |
| GPT-5.6 SOL | Claim Office | 22.0 → 19.6 → 39.0 | 32.6 → 24.4 → 27.8 | 7.75 → 5.64 → 3.71 | 4.3 → 4.2 → 2.2 |
| Opus 5 | Game of Life | 9.8 → 13.4 → 13.4 | 7.0 → 7.0 → 7.6 | 3.65 → 3.60 → 4.08 | 3.3 → 3.1 → 4.1 |
| Opus 5 | Claim Office | 34.0 → 39.4 → 62.0 | 19.4 → 12.6 → 9.8 | 4.89 → 4.05 → 3.10 | 3.4 → 3.2 → 2.2 |

Method count has no monotonic quality direction: decomposition can add focused methods while removing duplication, or reduce methods by eliminating unnecessary indirection. The NCSS distribution supplies the interpretable signal. Under v1.1 the median method shrinks to roughly two statements on both Claim Office cells — the decomposition is real, but it arrives together with the code growth of F-1.8.3, so it is redistribution into more, smaller units rather than removal of code.

---

## F-1.8.7 — Predictive accuracy is unaffected by where the Refactor step runs

The Predictive TDD mechanism itself transfers to the isolated-subagent architecture without loss. Prediction accuracy is pooled over all cycles of the five runs per cell.

| Model | Kata | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|
| GPT-5.6 SOL | Game of Life | 97.5 % (158/162) | 99.3 % (140/141) |
| GPT-5.6 SOL | Claim Office | 99.7 % (390/391) | 99.7 % (321/322) |
| Opus 5 | Game of Life | 97.3 % (215/221) | 98.6 % (215/218) |
| Opus 5 | Claim Office | 100 % (543/543) | 99.2 % (499/503) |

All eight cells sit above 97 %, and the differences between the two architectures are within one or two mispredictions per cell. Where the Refactor step runs is therefore independent of how reliably the model predicts its own test outcomes — the prediction discipline lives in the main context in both variants, and moving refactoring out of it neither disturbs nor improves it.

---

## F-1.8.8 — `refactorings_applied` counts different units in the two EXACT arms and must not be compared across them

In `exact-ptdd-v1` the metric comes from the inline `## Refactor` text marker, one per cycle. In `exact-ptdd-v1.1-refactor-subagent` it comes from the delegated subagent sessions, and the resolution chain counts session transcripts. The two numbers are not the same quantity.

| Model | Kata | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|
| GPT-5.6 SOL | Game of Life | 13.8 ± 1.79 | 13.8 ± 1.64 |
| GPT-5.6 SOL | Claim Office | 39.0 ± 2.92 | 26.8 ± 10.92 |
| Opus 5 | Game of Life | 21.4 ± 0.89 | 16.8 ± 9.04 |
| Opus 5 | Claim Office | 52.8 ± 1.30 | 30.6 ± 20.54 |

The σ inflation in the v1.1 cells is a capture artifact, not variance in refactoring behaviour. In two of the ten Claude Code subagent runs the session count collapses to one (`refactorings_applied` = 1 at `cycle_count` 26 and 53) because the whole run's refactoring went through a single reused subagent session; the other eight track `cycle_count` closely. On pi the mapping is nearly one-to-one in nine of ten runs.

Read the metric only within an arm, and read the v1.1 Claude Code cells against `cycle_count` rather than on their own. The product-side evidence for what the subagent actually did is in F-1.8.3 and F-1.8.6, not in this counter.

---

## F-1.8.9 — Mutation Score rises with every layer of workflow structure

Test strength is the one quality dimension where both layers pay off, and the only outcome in this RQ that orders the three methods the same way in all four model × kata combinations.

| Model | Kata | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 0.858 ± 0.052 | 0.904 ± 0.085 | 0.937 ± 0.037 |
| GPT-5.6 SOL | Claim Office | 0.811 ± 0.068 | 0.906 ± 0.034 | 0.943 ± 0.006 |
| Opus 5 | Game of Life | 0.913 ± 0.014 | 0.924 ± 0.012 | 0.933 ± 0.012 |
| Opus 5 | Claim Office | 0.882 ± 0.028 | 0.933 ± 0.024 | 0.963 ± 0.029 |

The size of the effect follows the room available. On Claim Office, the larger task, inline TDD leaves 0.08 (Opus) to 0.13 (SOL) of score on the table against v1.1; on Game of Life, where every method is small enough to be covered almost by accident, the whole ladder spans 0.02 on Opus. The SOL Claim Office inline cell is the weakest suite in the RQ at 0.811, and it is also the cell that writes the fewest tests by a wide margin — 6.4 against 38.6 under v1 (F-1.8.6 table). Its external correctness is nevertheless perfect: fifteen acceptance scenarios do not notice that the unit tests behind them barely constrain the implementation.

Variance shrinks along the same ladder in three of the four combinations — most sharply on SOL Claim Office, from σ 0.068 under inline TDD to σ 0.006 under v1.1, the tightest cluster in the RQ. Opus Claim Office is the exception and stays put (σ 0.028 → 0.029). Where the structured workflows raise the score they also, mostly, make it more predictable.

Read this against F-1.8.4 before drawing a recommendation: the step from inline to v1 buys most of the test strength, and v1.1 adds a further 0.01 to 0.04 for roughly triple the cost again.

**Measurement notes.** The score is PIT (`pitest-maven`) against the run's own JUnit 5 suite, killed plus timed-out over all scoreable mutants, with PIT's default mutator set. Two properties limit how far the number travels. First, every production class is mutated, the CLI entry class included — unlike the TypeScript pipeline, which excludes `src/cli.ts`. Several runs nest their whole domain inside the CLI class, so an exclusion by file would have made the score depend on how the agent split its classes, and that split is itself one of the things this RQ measures. Second, PIT's default mutators are narrower than Stryker's: no block removal, no string- or object-literal mutation. Java scores are therefore comparable across the cells of this RQ, but not against the mutation scores of the TypeScript RQs.
