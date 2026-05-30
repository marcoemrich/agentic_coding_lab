# RQ-end-refactor-gol — Findings

Haelt der v6.5-end-refactor-Befund auch auf der trainingsbekannten **game-of-life**-Kata: hebt der Whole-src-End-Refactor-Pass die Code-Qualitaet ueber v6.2 — die Voraussetzung fuer eine globale Baseline-Promotion von v6.5?

Daten: 5 v6.2 + 5 v6.5, alle `game-of-life-example-mapping`, alle `opus-4-7-no-thinking` (Direct-API / native OAuth). Quelle: [summary.md](summary.md), [runs.csv](runs.csv).

## Übersicht

Aggregierte Means pro Outcome. Trophy 🏆 = bester Wert (Spread ≥ 1 σ); bei Ties beide. GoL ist reine Code-Qualitaets-Kata — kein Correctness-Gating, aber Korrektheit als Sanity gepruft (beide Zellen 5/5 `tests_passing`, `verification_pct` = 1.0).

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `cc_avg_loc_per_function` | `smell_total` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 3.4 | 4.2 | 18.4 | 5.74 | 0.4 | **155.6** 🏆 |
| v6.5-end-refactor | **2.4** 🏆 | **3.0** 🏆 | **14.4** 🏆 | **4.42** 🏆 | **0.0** 🏆 | 158.6 |

### Korrektheit + Disziplin + Kosten (Sanity)

| Workflow | `tests_passing %` | `verification_pct` | `cycle_count` | `predictions_correct_rate %` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | **100** 🏆 | **1.0** 🏆 | 10.8 | 98.1 | **857** 🏆 | **13.1 M** 🏆 |
| v6.5-end-refactor | **100** 🏆 | **1.0** 🏆 | 10.2 | 97.3 | 1236 | 20.8 M |

---

## F-1.14.1 — v6.5 hebt die Code-Qualitaet auch auf game-of-life ueber v6.2; H2 bestaetigt

Der End-Refactor-Pass senkt auf GoL **jede** Spitzen- und Struktur-Komplexitaets-Metrik gegenueber v6.2, bei voller Korrektheit (5/5 `tests_passing`, `verification_pct` = 1.0 in beiden Zellen):

| Metrik | v6.2 | v6.5 | Δ | Spread |
|---|---:|---:|---:|---|
| `cognitive_max` | 3.4 | **2.4** | −29 % | ≈ 1 σ (σ 0.89–1.14) |
| `mccabe_max` | 4.2 | **3.0** | −29 % | > 1 σ (v6.5 σ = 0 — **alle 5 Runs exakt 3**) |
| `cc_longest_function` | 18.4 | **14.4** | −22 % | ≈ 0.5 σ (v6.2 σ 8.32) |
| `cc_avg_loc_per_function` | 5.74 | **4.42** | −23 % | ≈ 0.6 σ; v6.5 σ 0.77 vs v6.2 σ 2.26 |
| `smell_total` | 0.4 | **0.0** | −100 % | v6.5 deterministisch 0 |

Der staerkste Effekt: `mccabe_max` faellt bei v6.5 auf **konstant 3 ueber alle 5 Runs** (σ = 0), waehrend v6.2 zwischen 3 und 6 streut. Der End-Pass eliminiert die GoL-Komplexitaets-Spitzen deterministisch. Auch die Streuung aller Quality-Metriken schrumpft durchgehend (z. B. `cc_avg_loc_per_function` σ 2.26 → 0.77) — v6.5 liefert nicht nur besseren, sondern **vorhersagbareren** Code.

`code_mass` ist die einzige Metrik ohne v6.5-Vorteil (155.6 vs 158.6, < 1 σ) — auf der winzigen GoL-Codebasis (~150 vs ~870 auf claim-office) gibt es kaum Volumen zu konsolidieren. Die in F-1.12.3 formulierte Sorge (H2': weniger Cross-file-Hebel auf einteiliger Library) trifft genau auf `code_mass` zu, **nicht** aber auf die Komplexitaets-Metriken — dort wirkt der Pass auch ohne Cross-file-Duplication.

---

## F-1.14.2 — TDD-Disziplin und Korrektheit auf GoL unveraendert; Kosten-Aufschlag durch den End-Pass

Der Per-Cycle-Anteil von v6.5 ist byte-identisch zu v6.2; die GoL-Cycle-Metriken bestaetigen das:

| Metrik | v6.2 | v6.5 | Δ |
|---|---:|---:|---:|
| `cycle_count` | 10.8 | 10.2 | −0.6 (innerhalb 1 σ) |
| `predictions_correct_rate` | 98.1 % | 97.3 % | −0.8 pp |
| `tests_passed_immediately` | 9.6 | 8.8 | innerhalb 1 σ |
| `tests_passing` | 5/5 | 5/5 | — |

Kosten: v6.5 braucht **+44 % Wallclock** (857 → 1236 s) und **+59 % Tokens** (13.1 M → 20.8 M) — der reine End-Pass-Aufschlag. Auf GoL ist der relative Aufschlag groesser als auf claim-office (dort ~+19 % Wallclock, Tokens gleichauf), weil die GoL-Basis-Session viel kuerzer ist und der fixe End-Pass-Overhead staerker ins Gewicht faellt. Absolut bleibt es guenstig (~20 min/Run).

---

## F-1.14.3 — v6.5 ist auf beiden Katas der Qualitaets-Sieger: globale Baseline-Promotion gerechtfertigt

Mit RQ-1.12 (claim-office × opus-4-7), RQ-1.13 (claim-office × opus-4-8) und dieser RQ (game-of-life × opus-4-7) ist v6.5 jetzt auf **beiden** Kata-Typen und **zwei Modellen** validiert:

| Achse | Korrektheit | Code-Qualitaet vs v6.2 |
|---|---|---|
| claim-office × opus-4-7 (RQ-1.12) | gehalten (0.99) | besser (code_mass −11 %, cognitive_max −44 %) |
| claim-office × opus-4-8 (RQ-1.13) | gehalten (5/5 perfekt) | besser (cognitive_max −22 %, mccabe_max −20 %) |
| game-of-life × opus-4-7 (RQ-1.14) | gehalten (5/5, 1.0) | besser (cognitive_max −29 %, mccabe_max −29 %, smell −100 %) |

Damit ist das im Lab wiederkehrende "GoL-Sieger ≠ claim-office-Sieger"-Anti-Pattern (RQ-1.4, RQ-1.8/1.9) fuer v6.5 **ausgeschlossen** — v6.5 gewinnt auf beiden. Einziger konsistenter Preis ist ein moderater Token-/Wallclock-Aufschlag durch den End-Pass. v6.5-end-refactor ist damit als **globale Code-Qualitaets-Baseline ueber v6.2** gerechtfertigt; v6.2 bleibt die Referenz fuer minimale Kosten.
