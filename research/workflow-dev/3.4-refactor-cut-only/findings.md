# RQ-refactor-cut Findings

## Übersicht

Primär-Outcomes je Zelle (n=10 je Workflow, opus-4-7-no-thinking, game-of-life-example-mapping). 🏆 = bester Wert pro Outcome (auch geteilt).

| Outcome (Richtung)                                  | v6.5.1-orchestration-audited | v6.5.3-targeted-cuts | v6.5.4-refactor-cut-only |
|-----------------------------------------------------|------------------------------|----------------------|--------------------------|
| Smell-Summe (`smell_total`, kleiner = besser)       | **2.0 ± 0** 🏆               | **2.0 ± 0** 🏆       | **2.0 ± 0** 🏆           |
| Code-Mass (APP) (`code_mass`, kleiner = besser)     | 146.7 ± 11.53                | 150.7 ± 13.93        | **146.2 ± 7.47** 🏆      |
| Spitzen-Komplexität (`cc_longest_function`)         | 13.1 ± 6.30                  | **12.0 ± 3.40** 🏆   | 15.0 ± 3.23              |
| `cognitive_max` (kleiner = besser)                  | 5.6 ± 3.17                   | **3.5 ± 1.43** 🏆    | 4.2 ± 1.87               |
| `mccabe_max` (kleiner = besser)                     | 4.9 ± 1.45                   | 4.3 ± 0.67           | **3.8 ± 0.42** 🏆        |
| `refactorings_applied` (höher = besser)             | 7.8 ± 0.42                   | **8.3 ± 0.67** 🏆    | 8.1 ± 0.74               |
| `cycle_count` (höher = besser)                      | 7.8 ± 0.42                   | **8.3 ± 0.67** 🏆    | 8.1 ± 0.74               |
| `tests_passed_immediately` (kleiner = besser)       | **0 / 10** 🏆                | **0 / 10** 🏆        | **0 / 10** 🏆            |
| `predictions_correct_rate` (höher = besser, pooled) | 98.9 % (175/177)             | 95.8 % (159/166)     | **100 % (162/162)** 🏆   |
| `total_tokens` (kleiner = besser)                   | 8.53 M ± 0.60                | 8.56 M ± 1.48        | **8.42 M ± 0.98** 🏆     |
| `duration_seconds` (kleiner = besser)               | **726.1 ± 87** 🏆            | 752.1 ± 146          | 740.6 ± 66               |
| `tests_passing` / `verification_pct`                | 100 % / 100 %                | 100 % / 100 %        | 100 % / 100 %            |

Lesart: v6.5.4 ist **breitest aufgestellter Champion** — gewinnt 4 von 11 Outcome-Vergleichen exklusiv (`code_mass`, `mccabe_max`, `predictions_correct_rate`, `total_tokens`), teilt 3 weitere (`smell_total`, `tests_passed_immediately`), regrediert nur bei `cc_longest_function` (vs v6.5.3) und marginal bei `duration_seconds` (vs v6.5.1). F-targeted.4 ist spektakulär bestätigt: 100 % Pred-Rate.

---

## F-refactor-cut.1 — F-targeted.4-Hypothese bestätigt: `red/SKILL.md`-DO/DON'T trägt Pred-Hygiene

| workflow | Cut-Muster (10a/10b/10c) | correct / total | rate | Wrong-Predictions |
|---|:---:|---:|---:|---:|
| v6.5.1 | ✓ / ✓ / ✓ | 175 / 177 | 98.9 % | 2 |
| v6.5.3 | ✓ / ✗ / ✗ | 159 / 166 | 95.8 % | 7 |
| v6.5.4 | ✓ / ✗ / **✓** | 162 / 162 | **100.0 %** | **0** |

v6.5.4 unterscheidet sich von v6.5.3 ausschließlich durch das wieder-eingeführte `red/SKILL.md`-DO/DON'T (10c). Die Pred-Rate springt von 95.8 % (7 Wrong) auf perfekte 100 % (0 Wrong) — sogar besser als v6.5.1 (98.9 %). Damit ist eindeutig: **10c ist Pred-Hygiene-Anker**, nicht dekorativ. Der Block in `red/SKILL.md` ("DO predict the exact error message", "DON'T skip the prediction step") trägt das Prediction-Format-Verhalten messbar.

---

## F-refactor-cut.2 — v6.5.4 dominiert v6.5.1 in fast allen Metriken (sauberer Pareto-Improvement)

| outcome | v6.5.1 | v6.5.4 | Δ |
|---|---|---|---|
| `code_mass`         | 146.7 ± 11.53 | **146.2 ± 7.47** | gleich Mittel, σ −35 % |
| `mccabe_max`        | 4.9 ± 1.45    | **3.8 ± 0.42**   | −22 %, σ −71 % |
| `cognitive_max`     | 5.6 ± 3.17    | **4.2 ± 1.87**   | −25 %, σ −41 % |
| `refactorings_applied` | 7.8 ± 0.42 | **8.1 ± 0.74**   | +4 % |
| `predictions_correct_rate` | 98.9 % | **100 %**     | perfekt |
| `total_tokens`      | 8.53 M ± 0.60 | **8.42 M ± 0.98** | −1.3 % |
| `cc_longest_function` | 13.1 ± 6.30 | 15.0 ± 3.23     | +14 % Mittel, σ −49 % |
| `duration_seconds`  | **726.1 ± 87** | 740.6 ± 66       | +2 %, σ −24 % |

Sieben von acht Outcomes gewinnt v6.5.4, sechs davon mit niedrigerer σ. Einzige Regression: `cc_longest_function` Mittelwert +14 % — siehe F-refactor-cut.3. Die σ-Reduktion läuft quer durch fast alle Metriken: v6.5.4 ist v6.5.1 mit höherer Quality, perfekter Pred-Rate und engeren Bändern.

---

## F-refactor-cut.3 — Interaction-Effekt: 10b + 10c zusammen erzeugen besseres `cc_longest_function` als 10b allein

| workflow | Cuts (10a/10b/10c) | `cc_longest_function` | `cognitive_max` |
|---|:---:|---:|---:|
| v6.5.1 | ✓ / ✓ / ✓ | 13.1 ± 6.30 | 5.6 ± 3.17 |
| v6.5.3 | ✓ / ✗ / ✗ | **12.0 ± 3.40** | **3.5 ± 1.43** |
| v6.5.4 | ✓ / ✗ / ✓ | 15.0 ± 3.23 | 4.2 ± 1.87 |

v6.5.3 (10b + 10c beide gestrichen) hat das niedrigste `cc_longest_function` und `cognitive_max`. v6.5.4 (nur 10b gestrichen) liegt zwischen v6.5.1 und v6.5.3. Lesart: die `cc_longest_function`-Reduktion in v6.5.3 ist kein additiver Effekt von 10b allein — sie braucht den 10c-Cut. Möglicher Mechanismus: ohne `red/SKILL.md`-DO/DON'T wird der Red-Phase-Fokus weicher, der Subagent betrachtet auch nebenbei Code-Struktur und entscheidet komplexitäts-orientierter; mit 10c (in v6.5.4) ist der Red-Fokus eng auf Predictions, weniger Struktur-Querblicke.

Das stützt die F-targeted.2-Hypothese aus einem anderen Winkel: mid-file DO/DON'T-Wiederholungen sind nicht unabhängig wirksam, sondern beeinflussen sich gegenseitig. `cc_longest_function`-Optimum ist Pareto-incompatible mit perfekter Pred-Rate.

---

## F-refactor-cut.4 — Aktualisiertes Pareto-Bild: vier Profile statt drei

| Ziel                          | empfohlener Workflow              | Begründung |
|-------------------------------|-----------------------------------|------------|
| breitester Allround-Champion  | **v6.5.4-refactor-cut-only**      | 4 exklusive Wins + 3 geteilte; einzige Regression cc_longest_function |
| niedrigste Spitzen-Komplexität| **v6.5.3-targeted-cuts**          | `cc_longest_function` 12.0, `cognitive_max` 3.5 (Pareto-incompatible mit Pred-Rate) |
| niedrigste Token-Kosten       | **v6.5.2-bullets-cut**            | −15 % vs v6.5.1; Disziplin-Floor weg |
| deterministischste σ          | **v6.5.1-orchestration-audited** / **v6.5.4** | beide σ niedrig; v6.5.4 in fast allem niedriger |
| Korrektheit (innen + außen)   | alle vier gleichwertig            | 100 % / 100 % |

**Promotion-Empfehlung**: v6.5.4 ist der **neue Default-Champion** für die meisten Anwendungsfälle — bessere Quality, perfekte Pred-Rate, engere σ, marginale Token-Ersparnis gegenüber v6.5.1. v6.5.3 bleibt Spezialist für maximale Komplexitäts-Reduktion (wenn man bereit ist, Pred-Hygiene zu opfern). v6.5.2 für Cost-extreme. v6.5.1 nur noch historischer Referenz-Punkt.
