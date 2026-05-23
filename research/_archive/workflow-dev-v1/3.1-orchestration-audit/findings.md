# RQ-audit Findings

## Übersicht

Primär-Outcomes je Zelle (n=10 je Workflow, opus-4-7-no-thinking, game-of-life-example-mapping). 🏆 = bester Wert pro Outcome.

| Outcome (Richtung)                                  | v6.5-lean           | v6.5.1-orchestration-audited |
|-----------------------------------------------------|---------------------|------------------------------|
| Smell-Summe (`smell_total`, kleiner = besser)       | 2.2 ± 0.42          | **2.0 ± 0** 🏆               |
| Code-Mass (APP) (`code_mass`, kleiner = besser)     | **143.9 ± 6.06** 🏆 | 146.7 ± 11.53                |
| Spitzen-Komplexität (`cc_longest_function`)         | **12.7 ± 5.79** 🏆  | 13.1 ± 6.30                  |
| `refactorings_applied` (höher = besser)             | 6.9 ± 2.33          | **7.8 ± 0.42** 🏆            |
| `tests_passed_immediately` (kleiner = besser)       | 1.4 ± 2.27          | **0 ± 0** 🏆                 |
| `predictions_correct_rate` (höher = besser, pooled) | **100 %** 🏆        | 98.9 % (175/177)             |
| `total_tokens` (kleiner = besser)                   | **7.41 M ± 1.58** 🏆| 8.53 M ± 0.60                |
| `duration_seconds` (kleiner = besser)               | **623.6 ± 137** 🏆  | 726.1 ± 87                   |
| `tests_passing` / `verification_pct`                | 100 % / 100 %       | 100 % / 100 %                |

---

## F-audit.1 — Mandatory-Procedure-Preamble eliminiert Over-Implementation

`tests_passed_immediately` fällt von 1.4 ± 2.27 (max 5) auf **0 ± 0**. In zehn v6.5.1-Runs hat *kein* Test sofort nach dem Red-Switch grün gestanden.

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| v6.5-lean | 1.4 | 2.27 | 0 | 5 |
| v6.5.1-orchestration-audited | 0 | 0 | 0 | 0 |

Mechanismen: Mandatory-Procedure-Preamble (alle sieben Red-Schritte verpflichtend, kein Skip bei vorzeitig grünen Tests) plus "Wrong Predictions Are Data" (kein retroaktives Umschreiben → keine nachgelagerten Implementationen, die das nächste it.todo schon mit-erledigen).

---

## F-audit.2 — Refactoring-Disziplin steigt und stabilisiert massiv

`refactorings_applied` 6.9 ± 2.33 → **7.8 ± 0.42**. Mittelwert +13 %, σ ein Sechstel.

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| v6.5-lean | 6.9 | 2.33 | 3 | 10 |
| v6.5.1-orchestration-audited | 7.8 | 0.42 | 7 | 8 |

Die expliziten Rationales in `refactor.md` ("MUST attempt at least one refactoring" mit Measurement-Pipeline-Begründung; "Make ONE improvement at a time" mit Bisectability-Begründung) plus der konkrete Refactor-Bar (name tightening / APP mass ≥1 / removable smell) tragen — der Pflicht-Floor wird jetzt zuverlässig getroffen.

---

## F-audit.3 — Code-Qualität gleichwertig, mit leichtem Smell-Floor-Gewinn

Code-Mass (APP), Spitzen-Komplexität, `cognitive_max`, `mccabe_max` liegen je innerhalb 1 σ — keine Verschlechterung. Smell-Summe sinkt knapp und perfekt konsistent: 2.2 ± 0.42 → **2.0 ± 0**.

| outcome | v6.5-lean | v6.5.1 |
|---|---|---|
| `code_mass`         | 143.9 ± 6.06 | 146.7 ± 11.53 |
| `smell_total`       | 2.2 ± 0.42   | 2.0 ± 0       |
| `cc_longest_function` | 12.7 ± 5.79 | 13.1 ± 6.30  |
| `cognitive_max`     | 5.1 ± 3.84   | 5.6 ± 3.17    |
| `mccabe_max`        | 4.5 ± 2.01   | 4.9 ± 1.45    |

Das Audit-Bundle verschlechtert die Quality-Champion-Position von v6.5-lean nicht; bei der Smell-Summe verschiebt sich der Mode-Wert sauber auf 2 (kein Run mehr mit 3 Smells).

---

## F-audit.4 — Audit-Bundle kostet ~15 % Tokens und ~16 % Wallclock

| outcome | v6.5-lean | v6.5.1 | Δ |
|---|---:|---:|---:|
| `total_tokens` | 7.41 M ± 1.58 | 8.53 M ± 0.60 | +15 % |
| `duration_seconds` | 623.6 ± 137 | 726.1 ± 87 | +16 % |

Die Hypothese H3 (Tokens neutral ±5 %) ist widerlegt. Die Audit-Erweiterungen (Why-Blocks, Mandatory-Procedure-Preamble, "Wrong Predictions Are Data"-Block, Refactor-Bar-Konkretisierung) ergänzen netto Text. Im selben Zug sinkt die Streuung beider Kostenmetriken: σ Tokens 1.58 → 0.60 (−62 %), σ Duration 137 → 87 (−36 %) — der Workflow ist teurer, aber deutlich planbarer.

---

## F-audit.5 — Streuung sinkt fast überall

Vergleich der σ-Werte über die wichtigsten Outcomes:

| outcome | σ v6.5-lean | σ v6.5.1 | Faktor |
|---|---:|---:|---:|
| `smell_total`             | 0.42  | 0    | 0    |
| `refactorings_applied`    | 2.33  | 0.42 | 0.18 |
| `tests_passed_immediately`| 2.27  | 0    | 0    |
| `cycle_count`             | 0.63  | 0.42 | 0.67 |
| `total_tokens` (M)        | 1.58  | 0.60 | 0.38 |
| `duration_seconds`        | 137   | 87   | 0.64 |
| `cognitive_max`           | 3.84  | 3.17 | 0.83 |
| `mccabe_max`              | 2.01  | 1.45 | 0.72 |
| `code_mass`               | 6.06  | 11.53| 1.90 |
| `cc_longest_function`     | 5.79  | 6.30 | 1.09 |

Bis auf `code_mass` (σ verdoppelt sich) reduziert v6.5.1 die Streuung über alle Outcomes. Die TDD-Disziplin-Metriken sind quasi deterministisch geworden. Die `code_mass`-Streuung kommt aus zwei v6.5.1-Outliern (162) — bei n=10 als Einzelbeobachtung zu werten, kein systematischer Drift.
