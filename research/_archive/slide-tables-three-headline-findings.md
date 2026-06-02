# Slide Tables — Headline Findings

Condensed tables for talk slides. No workflow version names, no model names, no prose —
just the contrast. Full data + provenance in the cited RQ findings.

---

## 1 — Example-Mapping is the dominant correctness lever on novel tasks

Correctness on a novel task, by spec style and model tier (higher = better):

| Model | Prose | User-story | Example-mapping | Δ vs. prose |
|---|---:|---:|---:|---:|
| Opus 4.6 | 23 % | 23 % | **87 %** 🏆 | **+64 pp** |
| Sonnet 4.6 | 23 % | 17 % | **71 %** 🏆 | **+48 pp** |
| Haiku 4.5 | 0 % | 0 % | 0 % | — |

*User-story ≈ prose — only concrete examples move the needle. But the lever is model-gated: a weak model stays at zero in every style.*

---

## 2 — Strict TDD improves code quality measurably

The same pattern holds on both a training-known task and a novel one (all metrics smaller = better).

### Known task (game-of-life, n = 10)

| Approach | Cognitive complexity | Cyclomatic complexity | Longest function (LOC) | Code smells |
|---|---:|---:|---:|---:|
| Vibe-coding | 16–19 | 12–13 | 32 | 4–5 |
| Naive "just use TDD" | 22 | 14 | 33 | 6 |
| TDD with refactor in the cycle | **5** 🏆 | **5** 🏆 | **13** 🏆 | **2** 🏆 |

### Novel task (claim-office, n = 5)

| Approach | Cognitive complexity | Cyclomatic complexity | Longest function (LOC) | Code smells |
|---|---:|---:|---:|---:|
| Vibe-coding | 11–12 | 8 | 40–41 | 12–16 |
| Naive "just use TDD" | 20 | 15 | 52 | 17 |
| TDD with refactor in the cycle | **6** 🏆 | **6** 🏆 | **18** 🏆 | **1** 🏆 |

*The lever is the enforced refactor step in the cycle — not the TDD label. Just telling the agent to "use TDD" produces the worst code of all, worse than no TDD — and that holds on both tasks.*
