# RQ-end-refactor-gol — Findings

Haelt der v6.5-end-refactor-Befund auch auf der trainingsbekannten **game-of-life**-Kata: hebt der Whole-src-End-Refactor-Pass die Code-Qualitaet ueber v6.2 — die Voraussetzung fuer eine globale Baseline-Promotion von v6.5?

Daten: 5 v6.2 + 5 v6.5, alle `game-of-life-example-mapping`, alle `opus-4-7-no-thinking` (Direct-API / native OAuth). Quelle: [summary.md](summary.md), [runs.csv](runs.csv).

## Übersicht

Aggregierte Means pro Outcome. Trophy 🏆 = bester Wert (Spread ≥ 1 σ); bei Ties beide. GoL ist reine Code-Qualitaets-Kata — kein Correctness-Gating, aber Korrektheit als Sanity gepruft (beide Zellen 5/5 `tests_passing`, `verification_pct` = 1.0).

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `cc_longest_function` | `cc_avg_loc_per_function` | `smell_total` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 3.4 | 2.7 | 4.0 | **10.0** | **3.87** | 1.6 | **154.8** 🏆 |
| v6.5-end-refactor | **3.0** | **2.2** | **3.2** | 9.8 | 4.08 | **0.0** 🏆 | 168.0 |

- `cognitive_max` / `cognitive_avg` / `mccabe_max` / `cc_longest_function` / `cc_avg_loc_per_function`: alle Δ **< 1 σ** → kein Trophy, ununterscheidbar.
- Nur `smell_total` (1.6 → 0.0, deterministisch) ist ein robuster v6.5-Vorteil. `code_mass` ist robust schlechter (v6.5 +8.5 %).

### Korrektheit + Disziplin + Kosten (Sanity)

| Workflow | `tests_passing %` | `verification_pct` | `cycle_count` | `predictions_correct_rate %` | `duration_s` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | **100** 🏆 | **1.0** 🏆 | 8.8 | **100** 🏆 | **898** 🏆 | **10.1 M** 🏆 |
| v6.5-end-refactor | **100** 🏆 | **1.0** 🏆 | 9.6 | **100** 🏆 | 1332 | 12.3 M |

---

## F-1.14.1 — Auf game-of-life ist v6.5 kein robuster Code-Qualitaets-Gewinn ueber v6.2

Anders als auf claim-office (RQ-1.12/1.13, wo der End-Pass die Komplexitaet messbar senkte) sind die Komplexitaets-Metriken auf GoL zwischen v6.2 und v6.5 **statistisch ununterscheidbar** — alle Differenzen liegen innerhalb 1 σ:

| Metrik | v6.2 (Mean) | v6.5 (Mean) | Δ | v6.5-σ | innerhalb 1 σ? |
|---|---:|---:|---:|---:|:-:|
| `cognitive_max` | 3.4 | 3.0 | −0.4 | 2.24 (ein Run = 7) | ✓ |
| `cognitive_avg` | 2.7 | 2.2 | −0.5 | 1.04 | ✓ |
| `mccabe_max` | 4.0 | 3.2 | −0.8 | 0.45 | ✓ (knapp) |
| `cc_longest_function` | 10.0 | 9.8 | −0.2 | 2.59 | ✓ |
| `cc_avg_loc_per_function` | 3.87 | 4.08 | +0.21 (schlechter) | 1.38 | ✓ |

Der einzige robuste v6.5-Vorteil ist `smell_total` (v6.2 1.6 → v6.5 **0.0**, σ=0): der End-Pass eliminiert die wenigen GoL-ESLint-Smells deterministisch. Umgekehrt ist `code_mass` bei v6.5 robust **hoeher** (154.8 → 168.0, Δ ≈ 1 σ) — der End-Pass fuegt auf GoL netto Code hinzu (z. B. extrahierte Hilfsfunktionen), statt zu konsolidieren.

Plausibilisierung: Die GoL-Codebasis ist winzig (`code_mass` ~155 vs ~870 auf claim-office) und einteilig (Library, kein cli.ts + domain.ts). Der Whole-src-Hebel des End-Pass — Cross-file-Duplication finden, kumulative Komplexitaet ueber viele Cycles abbauen — hat hier kaum Angriffsflaeche. Das bestaetigt die in F-1.12.3 formulierte H2'-Hypothese: auf einer simplen, einteiligen Kata ist der End-Pass-Effekt klein bis abwesend.

Ein Ausreisser praegt die v6.5-Komplexitaets-Means: 4 der 5 Runs haben `cognitive_max` = 2, einer hat 7 (σ 2.24). Ohne diesen Run laege v6.5 klar unter v6.2 — mit ihm ist der Mean-Vorsprung Rauschen. Bei n=5 ist das nicht aufloesbar.

---

## F-1.14.2 — Korrektheit und TDD-Disziplin auf GoL unveraendert; Kosten-Aufschlag durch den End-Pass

Beide Zellen sind korrektheits-makellos (5/5 `tests_passing`, `verification_pct` = 1.0, `predictions_correct_rate` 100 % pooled). Der Per-Cycle-Anteil ist byte-identisch zu v6.2; die Cycle-Metriken bestaetigen das (`cycle_count` 8.8 vs 9.6, innerhalb 1 σ).

Kosten: v6.5 braucht **+48 % Wallclock** (898 → 1332 s) und **+22 % Tokens** (10.1 M → 12.3 M) — der reine End-Pass-Aufschlag. Relativ ist der Wallclock-Aufschlag groesser als auf claim-office (~+19 %), weil die GoL-Basis-Session viel kuerzer ist und der fixe End-Pass-Overhead staerker durchschlaegt. Der End-Pass zahlt auf GoL also vollen Preis fuer einen nur marginalen Qualitaets-Effekt (`smell_total`).

---

## F-1.14.3 — v6.5 ist claim-office-spezifisch wirksam; keine globale Baseline-Promotion ueber v6.2

Zusammengefuehrt ueber alle drei End-Refactor-RQs:

| Achse | Korrektheit | Code-Qualitaet vs v6.2 | Kosten |
|---|---|---|---|
| claim-office × opus-4-7 (RQ-1.12) | gehalten | **besser** (code_mass −11 %, cognitive_max −44 %) | ~v6.2-Tokens |
| claim-office × opus-4-8 (RQ-1.13) | gehalten | **besser** (cognitive_max −22 %, mccabe_max −20 %) | ~v6.2-Tokens |
| game-of-life × opus-4-7 (RQ-1.14) | gehalten | **gleichauf** (nur smell_total besser; code_mass schlechter) | +48 % Wallclock, +22 % Tokens |

Der End-Refactor-Pass wirkt dort, wo es **Substanz zu konsolidieren** gibt — die zweiteilige claim-office-Codebasis mit echter Cross-file-Duplication. Auf der winzigen, einteiligen GoL-Library bringt er keinen robusten Komplexitaets-Gewinn, kostet aber vollen Wallclock-/Token-Aufschlag.

Konsequenz fuer die Baseline: v6.5 ist **kein** genereller v6.2-Ersatz. Die Empfehlung bleibt **kata-/aufgaben-spezifisch**: fuer mehrteilige, nicht-triviale Codebasen (CLI + Domain, mehrere Module) ist v6.5 der staerkere Quality-Workflow; fuer kleine einteilige Aufgaben rechtfertigt der End-Pass-Aufschlag den marginalen Gewinn nicht — dort bleibt v6.2 die effizientere Wahl. Damit reiht sich v6.5 in das wiederkehrende "Kata-abhaengige Empfehlung"-Muster ein (vgl. RQ-1.4): nicht jeder Workflow-Sieger generalisiert ueber Kata-Typen.
