# RQ-end-refactor-gol — Findings

Halten die metric-driven-Refactor-Workflows v6.4 (per-cycle) und v6.5 (end-refactor) auf der trainingsbekannten **game-of-life**-Kata einen Code-Qualitaets-Gewinn ueber die v6.2-Baseline — die Voraussetzung fuer eine globale Baseline-Promotion?

Daten: 5 v6.2 + 5 v6.4 + 5 v6.5, alle `game-of-life-example-mapping`, alle `opus-4-7-no-thinking` (Direct-API / native OAuth). Quelle: [summary.md](summary.md), [runs.csv](runs.csv).

Alle drei Arme teilen denselben v6.2-Per-Cycle-Kern; sie unterscheiden sich nur im Refactor-Hebel: **v6.2** ohne Zusatz-Pass, **v6.4** mit metric-driven Refactor *innerhalb jedes Cycles*, **v6.5** mit einmaligem Whole-src-End-Pass nach dem letzten Green-Cycle.

## Übersicht

Aggregierte Means pro Outcome. Trophy 🏆 = bester Wert (Spread ≥ 1 σ); bei Ties bzw. "kein Effekt" mehrere/keine. GoL ist reine Code-Qualitaets-Kata — kein Correctness-Gating, aber Korrektheit als Sanity gepruft (alle drei Zellen 5/5 `tests_passing`, `verification_pct` = 1.0).

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `cc_longest_function` | `smell_total` | Code-Mass (APP) |
|---|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 3.4 | 2.7 | 4.0 | 10.0 | 1.6 | **154.8** 🏆 |
| v6.4-metric-driven-refactor | **2.2** 🏆 | **1.83** 🏆 | 3.4 | **8.4** 🏆 | **0.0** 🏆 | 168.4 |
| v6.5-end-refactor | 3.0 | 2.2 | 3.2 | 9.8 | **0.0** 🏆 | 168.0 |

- `cognitive_max` / `cognitive_avg`: v6.4 ist robuster Sieger (Δ ≥ 1 σ ueber v6.2). v6.5 bleibt durch einen Ausreisser ununterscheidbar von v6.2.
- `mccabe_max`: alle drei innerhalb 1 σ → kein Trophy.
- `cc_longest_function`: v6.4 niedrigster Mean, aber Spread < 1 σ gegen v6.5/v6.2 — Trophy nur als Tendenz; siehe F-1.14.1.
- `smell_total`: v6.4 und v6.5 eliminieren die GoL-Smells deterministisch (σ=0), v6.2 nicht → beide Trophy.
- Code-Mass: v6.2 robust am kleinsten; **beide** Refactor-Varianten fuegen netto Code zu.

### Korrektheit + Disziplin + Kosten (Sanity / höher = besser bei Disziplin, kleiner = besser bei Kosten)

| Workflow | `tests_passing %` | `verification_pct` | `cycle_count` | `predictions_correct_rate %` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | **100** 🏆 | **1.0** 🏆 | 8.8 | **100** 🏆 | **898** 🏆 | **10.1 M** 🏆 |
| v6.4-metric-driven-refactor | **100** 🏆 | **1.0** 🏆 | 9.4 | 98.9 | 1064 | 11.0 M |
| v6.5-end-refactor | **100** 🏆 | **1.0** 🏆 | 9.6 | **100** 🏆 | 1332 | 12.3 M |

---

## F-1.14.1 — Auf game-of-life ist v6.4 (per-cycle) der robuste Komplexitaets-Sieger, nicht v6.5 (end-refactor)

Der per-cycle-Refactor v6.4 senkt die Spitzen- und Durchschnitts-Komplexitaet auf GoL **messbar** unter die v6.2-Baseline; der End-Refactor v6.5 dagegen ist von v6.2 statistisch ununterscheidbar:

| Metrik | v6.2 (Mean) | v6.4 (Mean) | v6.5 (Mean) | v6.4 vs v6.2 | v6.5 vs v6.2 |
|---|---:|---:|---:|---|---|
| `cognitive_max` | 3.4 | **2.2** | 3.0 | −1.2 (≈ 1.3 σ) **robust** | −0.4 (< 1 σ) |
| `cognitive_avg` | 2.7 | **1.83** | 2.2 | −0.87 (> 1 σ) **robust** | −0.5 (< 1 σ) |
| `mccabe_max` | 4.0 | 3.4 | 3.2 | −0.6 (< 1 σ) | −0.8 (< 1 σ) |
| `cc_longest_function` | 10.0 | 8.4 | 9.8 | −1.6 (< 1 σ, σ groß) | −0.2 (< 1 σ) |

v6.5 wird von einem Ausreisser gepraegt: 4 der 5 v6.5-Runs haben `cognitive_max` = 2, einer hat 7 (σ 2.24). Ohne diesen Run laege v6.5 klar unter v6.2 — mit ihm ist der Mean-Vorsprung Rauschen. v6.4 hat diese Streuung nicht (σ 0.84): der Komplexitaets-Gewinn ist hier stabil ueber alle 5 Runs.

Plausibilisierung des Mechanismus: Auf der winzigen, einteiligen GoL-Library (Code-Mass ~155–168, kein cli.ts + domain.ts) hat der **Whole-src-Hebel** des End-Pass kaum Angriffsflaeche — es gibt keine Cross-file-Duplication zu konsolidieren. Der **per-cycle**-Hebel von v6.4 greift dagegen lokal in jedem Cycle, wo gerade Komplexitaet entsteht, und braucht keine kata-uebergreifende Substanz. Auf GoL ist damit der laufende Hebel wirksamer als der einmalige.

Beim Smell-Abbau sind beide Refactor-Varianten gleichauf: v6.4 und v6.5 erreichen deterministisch `smell_total` = 0 (σ=0), v6.2 bleibt bei 1.6. Das ist der einzige Code-Qualitaets-Punkt, an dem v6.5 v6.2 robust schlaegt.

---

## F-1.14.2 — Beide Refactor-Varianten erhoehen Code-Mass; v6.2 bleibt die parsimonischste Baseline

Trotz besserer Komplexitaet kostet der Refactor auf GoL **mehr** Code-Mass (APP) — bei beiden Varianten:

| Workflow | Code-Mass (APP) Mean | σ | vs v6.2 |
|---|---:|---:|---|
| v6.2-with-why-cleaned | **154.8** | 14.75 | — |
| v6.4-metric-driven-refactor | 168.4 | 7.44 | +8.8 % (≈ 1 σ) **robust** |
| v6.5-end-refactor | 168.0 | 8.6 | +8.5 % (≈ 1 σ) **robust** |

Beide Refactor-Varianten konsolidieren auf GoL nicht, sondern fuegen netto Code zu — typischerweise durch extrahierte Hilfsfunktionen, die die Spitzen-Komplexitaet einzelner Funktionen senken (v6.4 erfolgreich, s. F-1.14.1), aber die Gesamt-Code-Mass anheben. Auf einer einteiligen Kata ohne Duplication ist dieser Trade-off (mehr Funktionen, je kleiner) der einzige verfuegbare Refactor-Hebel. Wer auf GoL **minimale** Code-Mass priorisiert, faehrt mit v6.2; wer **minimale Spitzen-Komplexitaet** will, mit v6.4.

---

## F-1.14.3 — Korrektheit und TDD-Disziplin unveraendert; Kosten steigen mit der Refactor-Intensitaet

Alle drei Zellen sind korrektheits-makellos (5/5 `tests_passing`, `verification_pct` = 1.0). Die TDD-Disziplin ist ueber alle Arme intakt (`cycle_count` 8.8 / 9.4 / 9.6, `predictions_correct_rate` 100 % / 98.9 % / 100 % — der eine v6.4-Fehlschuss ist 93/94 pooled, kein Disziplin-Bruch). Der Per-Cycle-Anteil von v6.5 ist byte-identisch zu v6.2.

Die Kosten skalieren monoton mit dem Refactor-Aufwand:

| Workflow | `duration_s` | vs v6.2 | `total_tokens` | vs v6.2 |
|---|---:|---|---:|---|
| v6.2-with-why-cleaned | **898** | — | **10.1 M** | — |
| v6.4-metric-driven-refactor | 1064 | +18 % | 11.0 M | +9 % |
| v6.5-end-refactor | 1332 | +48 % | 12.3 M | +22 % |

v6.4 holt den robusten Komplexitaets-Gewinn (F-1.14.1) zu **deutlich geringerem** Aufschlag als v6.5: +18 % Wallclock / +9 % Tokens gegen +48 % / +22 %. Der End-Pass von v6.5 zahlt auf GoL also den hoechsten Preis fuer den schwaechsten Effekt — auf der kleinen Codebasis schlaegt der fixe End-Pass-Overhead voll durch, ohne dass der Whole-src-Hebel etwas zu konsolidieren findet.

---

## F-1.14.4 — Keine globale v6.5-Baseline-Promotion; der wirksame Refactor-Hebel ist kata-abhaengig

Zusammengefuehrt ueber alle End-/Per-Cycle-Refactor-RQs:

| Achse | Korrektheit | Komplexitaet vs v6.2 | Kosten vs v6.2 |
|---|---|---|---|
| v6.5 · claim-office × opus-4-7 (RQ-1.12) | gehalten | **besser** (Code-Mass −11 %, `cognitive_max` −44 %) | ~v6.2-Tokens |
| v6.5 · claim-office × opus-4-8 (RQ-1.13) | gehalten | **besser** (`cognitive_max` −22 %, `mccabe_max` −20 %) | ~v6.2-Tokens |
| v6.5 · game-of-life × opus-4-7 (RQ-1.14) | gehalten | **gleichauf** (nur `smell_total`; `cognitive_max` Rauschen) | +48 % Wallclock, +22 % Tokens |
| v6.4 · game-of-life × opus-4-7 (RQ-1.14) | gehalten | **besser** (`cognitive_max` −35 %, `cognitive_avg` −32 %) | +18 % Wallclock, +9 % Tokens |

Der **End-Refactor v6.5** wirkt dort, wo es Cross-file-Substanz zu konsolidieren gibt (zweiteilige claim-office-Codebasis), und bringt auf der winzigen, einteiligen GoL-Library keinen robusten Komplexitaets-Gewinn bei vollem Kosten-Aufschlag. Der **per-cycle-Refactor v6.4** dreht das Bild auf GoL um: er senkt die Spitzen-Komplexitaet stabil und guenstiger als v6.5.

Konsequenz fuer die Baseline: v6.5 ist **kein** genereller v6.2-Ersatz. Die Workflow-Empfehlung bleibt aufgaben-/kata-abhaengig:

- **Mehrteilige, nicht-triviale Codebasen** (CLI + Domain, mehrere Module): v6.5-End-Refactor — dort liefert der Whole-src-Pass den groessten Hebel (claim-office RQ-1.12/1.13).
- **Kleine, einteilige Aufgaben** mit lokal entstehender Komplexitaet: v6.4-per-cycle — robuster Komplexitaets-Gewinn zu moderatem Aufschlag (GoL RQ-1.14).
- **Wenn minimale Code-Mass und Kosten Vorrang haben**: v6.2 — beide Refactor-Varianten erhoehen Code-Mass und Wallclock.

Damit reiht sich der Befund in das wiederkehrende "Kata-abhaengige Empfehlung"-Muster ein (vgl. RQ-1.4, RQ-1.8/1.9): kein Refactor-Workflow-Sieger generalisiert ueber Kata-Typen.
