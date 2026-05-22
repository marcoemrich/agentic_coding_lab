# RQ-tdd-correctness Findings

Kata: `claim-office-example-mapping` (novel). Modell: `opus-4-7-no-thinking` (Portkey ODER Direct, OR-match). 4 TDD-Workflow-Varianten, n=19 Runs.

## Übersicht — Korrektheit pro Workflow

🏆 = bester Wert pro Spalte (auch bei Gleichstand mehrfach). `verification_pct`/`tests_passing`: höher = besser.

| Workflow | n | `verification_pct` (mean ± std) | `verification_passed` / 15 (min – max) | `tests_passing` |
|---|---:|---|---|---|
| v3-basic-tdd               | 5 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v4.1-testlist-scope-fix    | 5 | 0.96 ± 0.09 | 12 – 15 | **100 %** 🏆 |
| v5.1-testlist-scope-fix    | 6 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v6.1-hybrid-…              | 3 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |

`completed_within_budget` ist in allen Zellen 100 %.

## F-tdd-correctness.1 — Drei von vier TDD-Workflows lösen claim-office mit Opus 4.7 perfekt; nur v4.1 verliert vereinzelt Szenarien

Auf der neuartigen claim-office-Kata, die nicht in Trainingsdaten enthalten ist, erreichen v3 (n=5), v5.1 (n=6) und v6.1 (n=3) in jedem einzelnen Run die volle Acceptance-Suite (15/15 Verifikations-Szenarien). v4.1 ist die einzige Variante mit Streuung: 4/5 Runs perfekt, 1 Run bei 12/15 Szenarien → Zell-Durchschnitt 0.96.

Hypothese H1 ("phasen-strukturierte Workflows erreichen höhere Korrektheit als minimal-TDD") wird damit nicht bestätigt — minimal-TDD (v3) liegt auf Augenhöhe mit den strukturierten Workflows. H3 (Nullhypothese: alle Workflows ähnlich hoch >0.8) wird bestätigt.

## F-tdd-correctness.2 — v4.1 erreicht Korrektheit nur über drastisch höheren Aufwand pro Zyklus

Die Aufwands-Profile pro Workflow. 🏆 = bester Wert pro Spalte. Richtungen: `predictions_correct_rate` höher = besser; `duration_seconds`/`total_tokens`/`tests_passed_immediately` kleiner = besser; `cycle_count` und `refactorings_applied` sind ambivalent (kein Pokal).

| Workflow | `cycle_count` (mean) | `refactorings_applied` (mean) | `predictions_correct_rate` | `tests_passed_immediately` (mean) | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|---:|---:|---:|---:|
| v3-basic-tdd            |  3.8 |  1.8 |   —   | **0.6** 🏆 | **312** 🏆 | **3.28 M** 🏆 |
| v4.1-testlist-scope-fix | 44.6 |  6.8 |  92.9 % | 22.2 | 3 229 | 14.10 M |
| v5.1-testlist-scope-fix |  5.5 |  2.2 | **100.0 %** 🏆 |  1.7 |   641 | 18.73 M |
| v6.1-hybrid-…           | 24.7 | 10.7 |  94.9 % | 13.0 | 1 424 | 30.16 M |

v4.1 fährt im Schnitt **44.6 TDD-Zyklen** pro Run (vs. 3.8 bei v3, 5.5 bei v5.1), bei vergleichbarer Korrektheit. Die Wallclock liegt bei ~54 min pro Run gegen ~10 min bei v5.1 und ~5 min bei v3. Tokens 14 M (v4.1) vs. 3.3 M (v3). Trotz dieses Aufwands ist v4.1 das einzige Setup, das einen Korrektheits-Ausreißer (0.8) produziert.

v6.1 ist noch teurer (30 M Tokens, 24.7 Zyklen), erreicht aber konsistente 1.00 — der Hybrid-Aufbau (Skill-Red/Green + Subagent-Refactor) bezahlt also für die Stabilität, nicht für besseren Mittelwert.

## F-tdd-correctness.3 — Predictions-Rate-Vergleich v4.1 vs. v5.1 ist verzerrt durch ungleiche Vorhersage-Basis

`predictions_correct_rate` liegt bei 100 % für v5.1 (39/39), 92.9 % für v4.1 (302/325) und 94.9 % für v6.1 (131/138). Der Nenner ist drastisch unterschiedlich: v5.1 macht ~6.5 Predictions pro Run, v4.1 ~65, v6.1 ~46. Die Predictions-Rate misst hier nicht primär Disziplin, sondern wird durch die Aufgabengröße pro Cycle dominiert — v4.1 zerlegt feiner und nutzt mehr Predictions, hat damit aber auch mehr Gelegenheiten zu Fehlern.

Hypothese H3 aus RQ-tdd-quality („v4.1 hat höhere prediction_accuracy") wird unter dieser Lesart nicht bestätigt. Der Vergleich wird erst belastbar, wenn die Predictions pro Cycle normalisiert werden — derzeit aus den Metriken nicht direkt ableitbar.

## F-tdd-correctness.4 — Wallclock-Spanne ist 10×, Token-Spanne 9×; keine Korrektheits-Korrelation

Über die vier Workflows hinweg:

- günstigster Workflow nach Tokens: **v3 (3.28 M)** — bei 100 % Korrektheit
- günstigster Workflow nach Wallclock: **v3 (5 min)**
- teuerster Workflow nach Tokens: **v6.1 (30.16 M, σ=18.6 M)** — bei 100 % Korrektheit
- teuerster Workflow nach Wallclock: **v4.1 (54 min, σ=15 min)** — bei 0.96 Korrektheit

Für claim-office unter Opus 4.7 ist Korrektheit kein knappes Gut; die Workflow-Wahl bestimmt fast ausschließlich Aufwand und Streuung. v3 dominiert die Korrektheits-pro-Token-Wertung dieser Kata. Strukturierte Workflows rechtfertigen sich auf claim-office nicht durch Korrektheit — ihr Wert liegt in Code-Qualität (siehe RQ-context F-context.2 für die Smell-Unterschiede auf derselben Kata).
