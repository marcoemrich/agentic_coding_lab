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

**Datenbasis** (game-of-life-fair, Opus-no-thinking, n=3 pro Workflow):

| Workflow | code_mass μ | smell_complexity μ |
|---|---:|---:|
| v1-oneshot | 163.7 | 1.3 |
| v2-iterative | 165.0 | 1.3 |
| v3-basic-tdd | 159.0 | 1.3 |
| v4-exact-subagents | 183.0 | **0.0** |
| v5-exact-single-context | 151.3 | **0.0** |

v4 produziert sogar mehr `code_mass` als v1/v2 — die alte Pauschal-Aussage
"TDD reduziert Mass" ist zu stark. Abgrenzung von v4 vs. v5: v5 ist
zusätzlich code-kompakter (s. F-1.6).

Quelle: ehemals A1, alte Studie revidiert.

---

## F-1.2 — v2-iterative ist (leicht) der schlechteste Workflow auf game-of-life · ⚠️ revidiert

**Aussage**: v2 produziert auf game-of-life den höchsten `smell_total`
(5.3), getrieben durch `smell_magic_numbers` (3.0). Effekt ist klein
(Δ = 1.3 vs. v1) und **nicht** „Over-Engineering durch Komplexität",
sondern "leicht mehr unbenannte Konstanten".

Generalisierung über andere Katas bleibt 🚫 nicht prüfbar (alte Aussage
"konsistent komplexester Code auf allen 7 Katas" wurde nicht
reproduziert).

Quelle: ehemals A2.

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

Datenbasis: game-of-life-fair (n=3) + game-of-life-stability (n=9), beide
Opus-no-thinking. Identisches Muster.

Quelle: ehemals A3 + A7 (beide gleichbedeutend).

---

## F-1.4 — Speed-Ranking konstant, v4 ≈ 14× v1 · ✅ haltbar

**Aussage**: Reihenfolge **v1 ≲ v3 ≲ v2 < v5 ≪ v4** gilt stabil.
Faktor v4/v1 ≈ 14× am oberen Rand der alten Studie.

| Workflow | duration μ (s) | range |
|---|---:|---|
| v1-oneshot | 48.7 | 46–51 |
| v3-basic-tdd | 49.7 | 47–52 |
| v2-iterative | 53.7 | 44–59 |
| v5-exact-single-context | 353.3 | 338–377 |
| v4-exact-subagents | 686.3 | 659–740 |

Datenbasis: game-of-life-fair, Opus-no-thinking, n=3 pro Workflow.

Quelle: ehemals A6.

---

## F-1.5 — v4 hat den höchsten "sofort-grün"-Anteil (≠ schlechte Disziplin) · ⚠️ revidiert

**Aussage**: v4 hat in über der Hälfte seiner Cycles (5.7 von 8.7 ≈ 60 %)
direkt grüne Tests, weil generalisierende Implementations-Schritte folgende
Tests bereits abdecken. Das ist **nicht** schlechte TDD-Disziplin — v4
erreicht gleichzeitig `smell_complexity` = 0.

Reihenfolge:

| Workflow | tests_passed_immediately μ |
|---|---:|
| v3 | 0.0 (keine Phasen) |
| v2 | 0.3 |
| v1 | 0.7 |
| v5 | 1.3 |
| v4 | **5.7** |

v5 hält Über-Implementierung gut in Schach (1.2–1.3).

Datenbasis: game-of-life-fair (n=3) + stability (n=9).

Quelle: ehemals A8.

---

## F-1.6 — v5 ist code-kompakter als v4 · ✅ haltbar (auf game-of-life)

**Aussage**: v5 erreicht ~10–17 % weniger LoC und Mass als v4 bei gleicher
`smell_complexity` (beide 0.0).

| Workflow | LoC μ | mass μ |
|---|---:|---:|
| v4 | 41.0 | 183.0 |
| v5 | **35.7** | **151.3** |

Datenbasis: game-of-life-fair (n=3) + stability (n=9, v4 = 39.6 / v5 = 36.6).
Generalisierung über andere Katas: 🚫 nicht prüfbar.

Quelle: ehemals A9.

---

## F-1.7 — Workflow-Ranking ohne Thinking · ⚠️ revidiert

**Aussage**: Auf game-of-life ohne Thinking gilt
**v5 > v4 > v1 ≈ v3 > v2** (nach LoC + smell_total + smell_complexity)
— **nicht** "v5 > v3 > v4 > v1 > v2" wie in der alten Studie behauptet.

| Rang | Workflow | LoC μ | smell_total | smell_complexity |
|---|---|---:|---:|---:|
| 1 | v5 | 35.7 | 2.3 | 0.0 |
| 2 | v4 | 41.0 | 2.7 | 0.0 |
| 3 | v3 ≈ v1 | 40.3 / 41.0 | 4.0 / 4.0 | 1.3 / 1.3 |
| 5 | v2 | 42.7 | 5.3 | 1.3 |

v4 schiebt sich bei no-thinking auf Position 2 hoch, weil der
Refactor-Subagent auch ohne Reasoning-Bonus `smell_complexity` auf 0
drückt.

Quelle: ehemals C6.

---

## F-1.8 — TDD-Disziplin-Bänder (Refactorings, Predictions) belastbar · ✅ haltbar

**Aussage**: Die alten Workflow-charakteristischen Werte halten:

| Workflow | refactorings μ | predictions correct/total |
|---|---:|---|
| v3 | 0.0 | 0/0 |
| v4 | 4.0 | 15/16 (94 %) |
| v5 | 6.7 | 47/48 (98 %) |

Datenbasis: game-of-life-fair, n=3.

**Caveat**: `tests_passed_immediately` ist als "Über-Implementierungs"-Proxy
nur sinnvoll für Workflows mit Phasen-Mechanik. Für v3 trägt sie keine
Information (Wert = 0 = "keine Phasen", nicht "keine Über-Implementierung");
für v4 indiziert ein hoher Wert eher Generalisierung als Disziplinverlust
(s. F-1.5).

Quelle: ehemals C8.
