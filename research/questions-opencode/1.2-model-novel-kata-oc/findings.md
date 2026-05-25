# RQ-model-novel-oc — Findings

**Setup**: claim-office-example-mapping × v5.1-testlist-scope-fix-oc × n=5 pro Zelle (20 Runs total). Stand 2026-05-25.

## Übersicht

Korrektheit außen (`verification_pct`, höher = besser) als primärer Outcome; Code-Qualitäts-Metriken sekundär (kleiner = besser außer wo notiert).

| Metrik | Richtung | opus-4-7-portkey | kimi-k2-6 | gemini-3-5-flash | minimax-m2-7 |
|---|---|---|---|---|---|
| `verification_pct` (mean) | höher | **1.00** 🏆 | 0.84 | 0.80 | 0.04 |
| `verification_pct` (std) | kleiner | **0.00** 🏆 | 0.26 | 0.45 | 0.09 |
| `smell_total` (mean) | kleiner | **0.8** 🏆 | 20 | 18 | 10.2 |
| `cognitive_max` (mean) | kleiner | **9.8** 🏆 | 21.8 | 40.2 | 11.4 |
| `mccabe_max` (mean) | kleiner | **7.6** 🏆 | 17.6 | 23.4 | **7.6** 🏆 |
| `cc_longest_function` (mean) | kleiner | **25.4** 🏆 | 54.4 | 98.4 | 30.0 |
| `code_mass` (mean) | — | 759.6 | 741 | 526 | 364.4 |
| `cycle_count` (mean) | — | 1.2 | 2.0 | 2.2 | 4.8 |
| `predictions_total` (mean) | — | 2.4 | 0.4 | 0.4 | 2.6 |
| `duration_seconds` (mean) | kleiner | 664 | 1811 | **395** 🏆 | 1428 |

`code_mass`, `cycle_count`, `predictions_total` sind ambivalente Metriken ohne klare Richtung — kein Pokal (Mehr ist nicht automatisch besser).

---

## F-1.1 — Opus 4.7 dominiert claim-office-EM via OpenCode vollständig

Opus erreicht über alle 5 Replikate perfekte Korrektheit außen (15/15 in jedem Run, `verification_pct = 1.00 ± 0.00`) bei gleichzeitig niedrigster Code-Mass-relativer Komplexität: `smell_total = 0.8` (4 Runs mit 0, 1 Run mit 1), `cognitive_max = 9.8`, längste Funktion 25.4 LoC im Schnitt. Konsistenz-Spread ist minimal (`code_mass` std 34 bei mean 760, `cc_longest_function` std 3.4).

**Datenbasis**:

| Run | verification | smell_total | cognitive_max | code_mass |
|---|---|---|---|---|
| Replikate (n=5) | 15/15 (×5) | 0–1 | 8–12 | 717–797 |
| mean ± std | 1.00 ± 0.00 | 0.8 ± 0.45 | 9.8 ± 1.79 | 759.6 ± 33.8 |

Auf allen drei Achsen (Korrektheit, Code-Qualität, Konsistenz) führend — kein Tradeoff sichtbar.

---

## F-1.2 — Kimi K2.6 und Gemini 3.5 Flash: Spitzen-Korrektheit mit Varianz-Tail

Beide Modelle erreichen in der Mehrzahl der Runs perfekte Verifikation, fallen aber je einmal deutlich ab — der Spread zeigt sich erst bei n=5:

| Modell | verification-Verteilung (n=5) | mean | std |
|---|---|---|---|
| kimi-k2-6 | 15, 15, 15, 12, 6 | 0.84 | 0.26 |
| gemini-3-5-flash | 15, 15, 15, 15, 0 | 0.80 | 0.45 |

Flash ist **bimodal** (4× perfekt, 1× Total-Fail) — der 0/15-Run hat zusätzlich `tests_passing = false` und `code_mass = 3` (nahezu leere Implementierung), also Workflow-Abbruch, nicht Spec-Misverständnis. Kimi degradiert graduell (12/15, 6/15) ohne Internen-Test-Fail. Beide schaffen Top-Niveau, aber n=5 enthüllt eine Reliability-Lücke gegenüber Opus' deterministischer Perfektion.

---

## F-1.3 — MiniMax M2.7: stabiles Spec-Misverständnis, kein Einzelfall

Über 5 Replikate erreicht MiniMax nur einmal überhaupt einen Treffer (3/15), sonst 0/15 (mean 0.04, std 0.09). 4 von 5 Runs sind grün in den internen Tests (`tests_passing = true`) bei im Schnitt 30.8 selbst geschriebenen Tests — das Modell baut konsistent eine andere Spec als die Verifikations-Suite erwartet. Der Smoke-Befund (n=1: 0/15) und die Probe (n=3: 0,3,0) bestätigen sich vollständig.

| Run | verification | tests_passing | tests_total | code_mass |
|---|---|---|---|---|
| Replikate (n=5) | 0, 0, 0, 0, 3 | true ×4, false ×1 | 2–54 | 18–700 |

Klassischer claim-office-Mehrdeutigkeits-Effekt: das Modell liest die EM-Spec selbstkonsistent, aber abweichend von der intendierten Auflösung. Bestätigt die Konstruktion der Kata als robuster Filter für Spec-Verstehen (Memory `[[kata-construction-pretest-required]]`).

---

## F-1.4 — Predictions-Format-Compliance ist NICHT prädiktiv für Korrektheit

Die Marker-Compliance des v5.1-oc-Workflows (Prediction-Lines im Red-Phase-Block) korreliert nicht mit `verification_pct`:

| Modell | predictions_total | predictions_correct | verification_pct |
|---|---|---|---|
| opus-4-7-portkey | 2.4 | 2.4 (100%) | 1.00 |
| minimax-m2-7 | 2.6 | 2.2 (85%) | 0.04 |
| kimi-k2-6 | 0.4 | 0.4 (100%) | 0.84 |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | 0.80 |

MiniMax hat die höchste Prediction-Frequenz (2.6/Run) bei der schlechtesten Korrektheit; Kimi und Flash ignorieren das Format weitgehend (0.4/Run) und sind trotzdem nahe am Top. Marker-Compliance misst die Adoption der Workflow-Affordance, nicht den TDD-Inhalt. Bestätigt H4 aus dem RQ-README.

---

## F-1.5 — Code-Mass-Spread innerhalb Modell: Flash und MiniMax bimodal/breit

`code_mass` und `cycle_count` zeigen pro Modell sehr unterschiedliche Streuung:

| Modell | code_mass range | code_mass std | cycle_count range |
|---|---|---|---|
| opus-4-7-portkey | 717–797 | 34 | 1–2 |
| kimi-k2-6 | 674–800 | 58 | 1–3 |
| gemini-3-5-flash | 3–680 | 293 | 1–4 |
| minimax-m2-7 | 18–700 | 290 | 1–18 |

Opus und Kimi schreiben konsistent ~750 LoC; Flash und MiniMax triggern die "es war fertig"-Heuristik variabel — Flash kann mit 3 LoC abbrechen (siehe F-1.2 Bimodalität), MiniMax variiert zwischen Minimal-Stub und voller Implementierung. `cycle_count = 18` bei einem MiniMax-Run (Outlier) deutet auf Loop-Verhalten ohne Abschluss — der Run lief zwar im Budget durch (`completed_within_budget = true`), aber die Anzahl Red-Skill-Aufrufe ist 9× höher als der Median.

Folgerung: Workflow-Selbstabbruch-Heuristik ist modellabhängig; sie schützt nicht zuverlässig vor "Modell hört zu früh auf" (Flash-Bimodalität) oder "Modell loop-t bis Budget-Cap" (MiniMax-Outlier).
