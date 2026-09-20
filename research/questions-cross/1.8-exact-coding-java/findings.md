# Findings — RQ-exact-coding-java

## Overview

All values are cell means at `n=5`. Comparisons are only within the same model and kata. Correctness is higher = better; complexity, duration, tokens, and cost are lower = better. Bold values with 🏆 mark the observed winner. Equal or practically indistinguishable cells share the trophy.

| Model | Kata | Correctness (external), Inline | Correctness (external), EXACT | Cognitive Complexity max, Inline | Cognitive Complexity max, EXACT | McCabe max, Inline | McCabe max, EXACT |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | **1.00** 🏆 | **1.00** 🏆 | 9.8 | **5.8** 🏆 | 8.2 | **4.2** 🏆 |
| GPT-5.6 SOL | Claim Office | **1.00** 🏆 | **1.00** 🏆 | 9.8 | **5.8** 🏆 | 10.4 | **7.4** 🏆 |
| Opus 5 | Game of Life | **1.00** 🏆 | **1.00** 🏆 | **5.0** 🏆 | **4.6** 🏆 | **3.8** 🏆 | **3.8** 🏆 |
| Opus 5 | Claim Office | **1.00** 🏆 | 0.97 | 6.6 | **4.4** 🏆 | 6.2 | **4.4** 🏆 |

| Model | Kata | Duration Inline | Duration EXACT | Tokens Inline | Tokens EXACT | Cost Inline | Cost EXACT |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | **195 s** 🏆 | 916 s | **223k** 🏆 | 2.45 M | **$0.42** 🏆 | $2.21 |
| GPT-5.6 SOL | Claim Office | **296 s** 🏆 | 1,996 s | **290k** 🏆 | 7.74 M | **$0.58** 🏆 | $5.25 |
| Opus 5 | Game of Life | **251 s** 🏆 | 756 s | **1.29 M** 🏆 | 6.19 M | **$1.41** 🏆 | $5.88 |
| Opus 5 | Claim Office | **347 s** 🏆 | 1,313 s | **2.64 M** 🏆 | 19.07 M | **$2.88** 🏆 | $15.33 |

| Model | Kata | Methods Inline → EXACT | Maximum method NCSS Inline | Maximum method NCSS EXACT |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 6.4 → 9.6 | 14.0 | **7.4** 🏆 |
| GPT-5.6 SOL | Claim Office | 22.0 → 19.6 | 32.6 | **24.4** 🏆 |
| Opus 5 | Game of Life | 9.8 → 13.4 | **7.0** 🏆 | **7.0** 🏆 |
| Opus 5 | Claim Office | 34.0 → 39.4 | 19.4 | **12.6** 🏆 |

Code Mass (APP), Production LoC, Test LoC, test count, method count, and process-marker counts have ambiguous direction and therefore receive no trophy. Smell Total is zero in every cell and has no winner. All quality and efficiency cells pass the correctness gate.

---

## F-1.8.1 — EXACT Coding does not improve correctness on the Java tasks

Correctness is saturated under inline TDD. GPT-5.6 SOL is perfect under both methods on both katas, as is Opus 5 on Game of Life. On Claim Office, Opus inline TDD is perfect while EXACT Coding misses one of fifteen scenarios in two runs (`verification_pct` mean 0.97, minimum 0.93).

| Model | Kata | Inline TDD | EXACT Coding |
|---|---|---:|---:|
| GPT-5.6 SOL | Game of Life | 1.00 ± 0.00 | 1.00 ± 0.00 |
| GPT-5.6 SOL | Claim Office | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Opus 5 | Game of Life | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Opus 5 | Claim Office | 1.00 ± 0.00 | 0.97 ± 0.04 |

Correctness (internal) and completion within budget are 100% in all eight cells. The Java evidence therefore provides no correctness justification for the additional workflow structure. The small Opus Claim Office difference is an observed downside, but at `n=5` it is not evidence of a stable correctness regression.

---

## F-1.8.2 — EXACT Coding lowers Java complexity clearly on SOL and on Opus Claim Office

The strongest product-quality effect is lower per-method complexity. On GPT-5.6 SOL, EXACT Coding lowers both Cognitive Complexity and McCabe maxima on both katas. Opus shows the same direction on Claim Office, while Game of Life is indistinguishable within replicate variation.

| Model | Kata | Cognitive max Inline → EXACT | McCabe max Inline → EXACT | Cognitive avg Inline → EXACT | McCabe avg Inline → EXACT |
|---|---|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 9.8 → 5.8 | 8.2 → 4.2 | 4.73 → 2.24 | 4.38 → 1.64 |
| GPT-5.6 SOL | Claim Office | 9.8 → 5.8 | 10.4 → 7.4 | 3.24 → 2.22 | 3.52 → 2.71 |
| Opus 5 | Game of Life | 5.0 → 4.6 | 3.8 → 3.8 | 2.10 → 1.75 | 1.61 → 1.57 |
| Opus 5 | Claim Office | 6.6 → 4.4 | 6.2 → 4.4 | 2.18 → 1.49 | 2.13 → 1.75 |

For SOL, the maximum reductions are larger than or comparable to ordinary within-cell variation and repeat across both tasks and both complexity families. For Opus, the Claim Office effect repeats across all four measures, but the Game of Life differences are smaller than one standard deviation and should be read as a tie.

---

## F-1.8.3 — SOL produces substantially less Java code under EXACT Coding

On GPT-5.6 SOL, the complexity reduction is accompanied by less Production LoC and lower Code Mass (APP) on both katas. Opus does not reproduce this consistently: Claim Office shrinks, but Game of Life grows.

| Model | Kata | Production LoC Inline → EXACT | Code Mass (APP) Inline → EXACT |
|---|---|---:|---:|
| GPT-5.6 SOL | Game of Life | 109.2 → 94.4 | 324.4 → 265.8 |
| GPT-5.6 SOL | Claim Office | 292.2 → 206.2 | 1,028.6 → 720.4 |
| Opus 5 | Game of Life | 102.8 → 116.4 | 266.4 → 290.6 |
| Opus 5 | Claim Office | 397.6 → 376.4 | 1,101.4 → 966.2 |

Code size has no universally preferred direction, so these values are mechanism evidence rather than automatic quality wins. Together with the complexity results, however, the SOL reductions indicate a smaller and structurally simpler implementation rather than a correctness-defective stub: every SOL cell passes all external scenarios.

---

## F-1.8.4 — The Java complexity benefit carries a large efficiency premium

EXACT Coding is slower and more token-intensive in every model × kata contrast. The premium is much larger than replicate variation and remains even where product quality does not improve.

| Model | Kata | Duration Inline → EXACT | Tokens Inline → EXACT | Cost Inline → EXACT |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 195 s → 916 s | 223k → 2.45 M | $0.42 → $2.21 |
| GPT-5.6 SOL | Claim Office | 296 s → 1,996 s | 290k → 7.74 M | $0.58 → $5.25 |
| Opus 5 | Game of Life | 251 s → 756 s | 1.29 M → 6.19 M | $1.41 → $5.88 |
| Opus 5 | Claim Office | 347 s → 1,313 s | 2.64 M → 19.07 M | $2.88 → $15.33 |

The practical trade-off is model-dependent. SOL exchanges roughly five to seven times the duration for repeatable complexity and size reductions. Opus pays roughly three to four times the duration and five to seven times the tokens, but obtains a clear complexity benefit only on Claim Office. Inline TDD is therefore the stronger Java default when correctness and efficiency dominate; EXACT Coding is justified only when the measured complexity reduction is worth the premium.

---

## F-1.8.5 — PMD threshold smells do not discriminate these Java cells

Smell Total is zero in all 40 runs after treating Cognitive Complexity and Cyclomatic Complexity findings as score carriers rather than smells. The configured threshold-oriented PMD rules therefore provide no workflow discrimination on these katas.

The continuous per-method complexity scores remain informative and produce the differences in F-1.8.2. For this Java stack, Cognitive Complexity and McCabe metrics should be preferred over binary PMD smell counts when evaluating small kata implementations.

---

## F-1.8.6 — EXACT Coding produces smaller Java methods except on Opus Game of Life

Per-method NCSS measures functional decomposition without conflating method bodies with imports, declarations, or blank lines. EXACT Coding lowers the largest method substantially on both SOL katas and on Opus Claim Office. Opus Game of Life remains tied.

| Model | Kata | Methods Inline → EXACT | NCSS max Inline → EXACT | NCSS avg Inline → EXACT | NCSS median Inline → EXACT |
|---|---|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 6.4 → 9.6 | 14.0 → 7.4 | 7.26 → 3.84 | 6.4 → 3.3 |
| GPT-5.6 SOL | Claim Office | 22.0 → 19.6 | 32.6 → 24.4 | 7.75 → 5.64 | 4.3 → 4.2 |
| Opus 5 | Game of Life | 9.8 → 13.4 | 7.0 → 7.0 | 3.65 → 3.60 | 3.3 → 3.1 |
| Opus 5 | Claim Office | 34.0 → 39.4 | 19.4 → 12.6 | 4.89 → 4.05 | 3.4 → 3.2 |

Method count has no monotonic quality direction: decomposition can add focused methods while removing duplication, or reduce methods by eliminating unnecessary indirection. The NCSS distribution supplies the interpretable signal. SOL Game of Life shows the clearest decomposition effect—more methods, with roughly half the maximum and typical method size. SOL Claim Office instead achieves smaller methods with slightly fewer methods, consistent with deletion of unnecessary code. Opus Claim Office adds methods while reducing the largest method; Opus Game of Life shows no material method-size effect.
