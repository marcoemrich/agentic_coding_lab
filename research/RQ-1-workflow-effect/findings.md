# RQ-1 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin?**

Quelle der initialen Findings: `_archive/findings-validation-2026-05-04/`
(re-evaluierte alte 235-Run-Studie, Zellen A1–A9, C6, C8). Spätere
Updates entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

Status-Legende siehe [`research/README.md`](../README.md#findings-status-legende).

---

## F-1.1 — TDD ⇒ einfacherer Code, aber nur mit echtem Refactor · ⚠️ revidiert

**Aussage**: TDD reduziert `code_mass` und `smell_complexity` **nur dann**,
wenn der Workflow einen expliziten Refactor-Schritt erzwingt (v4, v5).
v3-basic-tdd reduziert `smell_complexity` NICHT — landet bei 1.3 gleichauf
mit den Non-TDD-Baselines v1/v2.

**Datenbasis** (game-of-life, Opus-no-thinking, n=6 pro Workflow, Stand
2026-05-04):

| Workflow | code_mass μ | smell_complexity μ |
|---|---:|---:|
| v3-basic-tdd | 156.8 | 1.7 |
| v5-exact-single-context | 157.0 | 1.0 |
| v2-iterative | 163.0 | 1.2 |
| v1-oneshot | 164.2 | 1.3 |
| v4-exact-subagents | 169.0 | **0.0** |

v5 reduziert `smell_complexity` (1.0) gegenüber Non-TDD (1.2–1.3), aber
nicht so stark wie v4 (0.0). v4 ist KEIN Mass-Reduzierer (höchster
`code_mass`-Wert). v3 hat sogar die HÖCHSTE `smell_complexity` (1.7) —
"TDD-Etikett ohne Refactor" ist im Schnitt schlechter als gar kein TDD.

Quelle: ehemals A1, alte Studie revidiert; n=3 → n=6 in 2026-05-04.

---

## F-1.2 — v2-iterative und v3-basic-tdd teilen den schlechtesten smell_total · ⚠️ revidiert

**Aussage**: Bei n=6 liegen v2 (`smell_total`=4.7) und v3 (4.3) fast
gleichauf an der Spitze; v1 (3.7) und v5 (3.2) liegen niedriger, v4 (2.5)
am tiefsten. Δ zwischen v2 und v3 ist nur 0.4 — v2 ist nicht mehr eindeutig
der Spitzenreiter.

| Workflow | smell_total μ |
|---|---:|
| v4-exact-subagents | 2.5 |
| v5-exact-single-context | 3.2 |
| v1-oneshot | 3.7 |
| v3-basic-tdd | 4.3 |
| v2-iterative | 4.7 |

Generalisierung über andere Katas bleibt 🚫 nicht prüfbar.

Quelle: ehemals A2; revidiert 2026-05-04 mit n=6.

---

## F-1.3 — v3 macht kein echtes TDD · ✅ haltbar

**Aussage**: v3-basic-tdd liefert systematisch:
- exakt **1 Cycle** (test-block → impl-block, kein Red-Green-Refactor)
- **0 Refactorings**
- **0 Predictions** (Workflow erzeugt keine)
- `tests_passed_immediately` = 0

Damit ist v3 effektiv ein Batch-Stil mit TDD-Etikett. Die TDD-Disziplin-Metriken
(`cycle_count`, `refactorings_applied`, `predictions_correct`) tragen für
v3 keine Information.

Datenbasis (Stand 2026-05-04): game-of-life RQ-1-Aggregation n=6 +
game-of-life-stability n=9 = 15 Runs, alle Opus-no-thinking.
Bei n=6 zeigt v3 `cycle_count`=1.33 (1 Run mit 2 Cycles), `refactorings`=0,
`predictions`=0. Ein einzelner Ausreißer mit 2 Cycles ändert das Muster
nicht.

Quelle: ehemals A3 + A7 (beide gleichbedeutend).

---

## F-1.4 — Speed-Ranking konstant, v4 ≈ 14× v1 · ✅ haltbar

**Aussage**: Reihenfolge **v1 ≲ v3 ≲ v2 < v5 ≪ v4** gilt stabil.
Faktor v4/v1 ≈ 14× am oberen Rand der alten Studie.

| Workflow | duration μ (s) | range |
|---|---:|---|
| v1-oneshot | 50.0 | 45–56 |
| v2-iterative | 52.2 | 43–59 |
| v3-basic-tdd | 56.5 | 45–83 |
| v5-exact-single-context | 349.5 | 329–377 |
| v4-exact-subagents | 779.2 | 659–1059 |

Faktor v4/v1 = 779/50 ≈ **15.6×** (vorher 14×).

Datenbasis: game-of-life RQ-1, Opus-no-thinking, n=6 pro Workflow,
Stand 2026-05-04.

Quelle: ehemals A6.

---

## F-1.5 — v4 hat den höchsten "sofort-grün"-Anteil (≠ schlechte Disziplin) · ⚠️ revidiert

**Aussage**: v4 hat in über der Hälfte seiner Cycles (5.2 von 8.5 ≈ 61 %)
direkt grüne Tests, weil generalisierende Implementations-Schritte folgende
Tests bereits abdecken. Das ist **nicht** schlechte TDD-Disziplin — v4
erreicht gleichzeitig `smell_complexity` = 0.

Reihenfolge (n=6, Stand 2026-05-04):

| Workflow | tests_passed_immediately μ |
|---|---:|
| v2 | 0.17 |
| v3 | 0.33 (keine Phasen) |
| v5 | 0.67 |
| v1 | 0.83 |
| v4 | **5.17** |

v5 hält Über-Implementierung gut in Schach (0.67).

Datenbasis: game-of-life RQ-1 n=6.

Quelle: ehemals A8.

---

## F-1.6 — v5 ist code-kompakter als v4 · ⚠️ revidiert (auf game-of-life)

**Aussage (abgeschwächt)**: Bei n=6 ist die LoC-Differenz zwischen v4 und v5
klein. `cc_loc` v5=29.7 ≈ v3=29.8 < v4=31.3 (Δ ≈ 1.5 LoC). `code_mass`
v5=157 < v4=169 (Δ = 12, Test-LoC anteilig). v5 ist NICHT mehr "deutlich
kompakter" — der Unterschied ist marginal. Der echte Effekt liegt bei
`smell_complexity` (v4=0.0 vs. v5=1.0) und bei der Funktionslänge
(s. F-1.10).

| Workflow | cc_loc μ | code_mass μ | smell_complexity μ |
|---|---:|---:|---:|
| v3 | 29.8 | 156.8 | 1.7 |
| v5 | 29.7 | 157.0 | 1.0 |
| v4 | 31.3 | 169.0 | **0.0** |

Datenbasis: game-of-life RQ-1, n=6, Stand 2026-05-04.
Generalisierung über andere Katas: 🚫 nicht prüfbar.

Quelle: ehemals A9; revidiert 2026-05-04.

---

## F-1.7 — Workflow-Ranking ohne Thinking · ⚠️ revidiert

**Aussage**: Auf game-of-life ohne Thinking gilt bei n=6
**v4 > v5 > v1 > v3 > v2** (nach `smell_total` + `smell_complexity`).
Bei n=3 lag v5 noch vor v4 — bei n=6 hat v4 weniger smell_total (2.5 vs.
3.2) bei gleichem oder besserem smell_complexity (0.0 vs. 1.0).

| Rang | Workflow | code_mass μ | smell_total | smell_complexity |
|---|---|---:|---:|---:|
| 1 | v4 | 169.0 | 2.5 | **0.0** |
| 2 | v5 | 157.0 | 3.2 | 1.0 |
| 3 | v1 | 164.2 | 3.7 | 1.3 |
| 4 | v3 | 156.8 | 4.3 | 1.7 |
| 5 | v2 | 163.0 | 4.7 | 1.2 |

v4 schiebt sich nach oben, weil der Refactor-Subagent `smell_complexity`
zuverlässig auf 0 drückt — auf Kosten von `code_mass` (höchster Wert).
v5 ist kompakter, aber lässt einzelne Komplexitäts-Smells durch.

Datenbasis: game-of-life RQ-1, n=6, Stand 2026-05-04.

Quelle: ehemals C6.

---

## F-1.8 — TDD-Disziplin-Bänder (Refactorings, Predictions) belastbar · ✅ haltbar

**Aussage**: Die alten Workflow-charakteristischen Werte halten und
verstärken sich bei n=6:

| Workflow | refactorings μ | predictions correct μ |
|---|---:|---:|
| v3 | 0.0 | 0 |
| v4 | 5.3 | 5.7 |
| v5 | 7.0 | 15.2 |

v5 macht ~3× so viele Predictions wie v4 — konsistent mit Workflow-Design
(Prediction-Step pro Cycle, v5 hat mehr Cycles im single-context).

Datenbasis: game-of-life RQ-1, n=6, Stand 2026-05-04.

**Caveat**: `tests_passed_immediately` ist als "Über-Implementierungs"-Proxy
nur sinnvoll für Workflows mit Phasen-Mechanik. Für v3 trägt sie keine
Information (Wert = 0 = "keine Phasen", nicht "keine Über-Implementierung");
für v4 indiziert ein hoher Wert eher Generalisierung als Disziplinverlust
(s. F-1.5).

Quelle: ehemals C8.

---

## F-1.9 — cc_longest_function trennt TDD-mit-Refactor scharf vom Rest · ✅ haltbar

**Aussage**: Workflows mit explizitem Refactor-Schritt (v4, v5) halten die
Spitzen-Komplexität auf ~15–17, während alle anderen (v1, v2, v3) bei
~27–31 liegen — Δ ≈ 11–14 Punkte. v3 (TDD ohne Refactor) liegt klar im
Non-Refactor-Cluster und bestätigt damit F-1.3.

| Workflow | cc_longest_function μ | range |
|---|---:|---|
| v4-exact-subagents | **15.2** | 8–23 |
| v5-exact-single-context | **16.8** | 2–25 |
| v1-oneshot | 26.8 | 21–31 |
| v3-basic-tdd | 29.8 | 24–44 |
| v2-iterative | 31.0 | 25–41 |

Datenbasis: game-of-life RQ-1, Opus-no-thinking, n=6 pro Workflow,
Stand 2026-05-04.

Quelle: neue n=6 RQ-1-Aggregation 2026-05-04.

---

## F-1.10 — Funktionslänge bestätigt v3-Phantom-TDD · ✅ haltbar

**Aussage**: Mittlere Funktionslänge (`cc_avg_loc_per_function`) trennt
Refactor-Workflows scharf vom Rest:

| Workflow | avg_loc_per_function μ | range |
|---|---:|---|
| v4-exact-subagents | **5.8** | 2–9 |
| v5-exact-single-context | **7.2** | 2–13 |
| v1-oneshot | 10.3 | 8–12 |
| v3-basic-tdd | 13.2 | 10–16 |
| v2-iterative | 13.2 | 10–22 |

v3 schreibt im Mittel **gleich lange Funktionen wie v2** (kein TDD) — TDD-
Etikett ohne Refactor-Schritt führt nicht zu kleineren Funktionen.
Verstärkt F-1.3 (v3 macht kein echtes TDD) und F-1.9 (Refactor-Schritt
trennt cc_longest_function).

Datenbasis: game-of-life RQ-1, Opus-no-thinking, n=6 pro Workflow,
Stand 2026-05-04.

Quelle: neue n=6 RQ-1-Aggregation 2026-05-04.

---

## F-1.11 — Prediction-Trefferquote bei v4 und v5 vergleichbar hoch · ✅ haltbar

**Aussage**: Pooled `predictions_correct / predictions_total` liegt bei
beiden Phasen-Workflows nah an 100 %. Δ < 2 pp.

| Workflow | correct | total | rate |
|---|---:|---:|---:|
| v4-exact-subagents | 34 | 35 | 97.1 % |
| v5-exact-single-context | 91 | 92 | **98.9 %** |

v5 macht ~2.6× so viele Predictions wie v4 (92 vs. 35), weil es mehr
Cycles im single-context durchläuft — **nicht** weil v4 weniger genau
wäre. Verfeinert F-1.8: Predictions-Anzahl unterscheidet die Workflows,
Predictions-Qualität nicht.

v3 produziert keine Predictions und ist daher in der Tabelle nicht
enthalten (s. F-1.3).

Datenbasis: game-of-life RQ-1, Opus-no-thinking, n=6 pro Workflow,
Stand 2026-05-04.

Quelle: neue n=6 RQ-1-Aggregation 2026-05-04.
