# RQ-1.7: v6.2-with-why-cleaned vs v6.1-with-why (game-of-life)

## Übersicht

Baseline (`v6.1-with-why`, n=5) vs. Cleaned (`v6.2-with-why-cleaned`, n=5) auf `game-of-life-example-mapping × opus-4-7-portkey-no-thinking`. Richtungen: ↑ = höher besser, ↓ = kleiner besser.

| Metrik | Richtung | v6.1-with-why | v6.2-with-why-cleaned |
|---|---|---:|---:|
| `tests_passing` rate | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` rate | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_correct_rate` (pooled) | ↑ | 98.8 % | **100 %** 🏆 |
| `refactorings_applied` mean | ↑ | 6.40 (σ 3.21) | **7.80** 🏆 (σ 2.17) |
| `tests_passed_immediately` mean | — | 2.20 (σ 3.03) | 1.40 (σ 3.13) |
| `cycle_count` mean (σ) | — | 8.40 (σ 0.55) | 9.00 (σ 0.71) |
| `code_mass` mean | ↓ | 151.0 (σ 11) | **148.8** 🏆 (σ 10) |
| `smell_total` mean | ↓ | 2.80 (σ 0.84) | **2.60** 🏆 (σ 0.55) |
| `cc_longest_function` mean (σ, max) | ↓ | **9.40** 🏆 (σ 8.29, max 22) | **9.40** 🏆 (σ 6.80, max 18) |
| `cognitive_max` mean (σ, max) | ↓ | 4.80 (σ 5.81, max 15) | **2.80** 🏆 (σ 1.10, max 4) |
| `mccabe_max` mean (σ, max) | ↓ | 4.60 (σ 3.13, max 10) | **3.60** 🏆 (σ 1.14, max 5) |
| `duration_seconds` mean | ↓ | **569** 🏆 | 644 (+13 %) |
| `total_tokens` mean | ↓ | **7.56 M** 🏆 | 8.67 M (+15 %) |

Lesart in zwei Sätzen: Die RQ-1.6-Empfehlung generalisiert auf GoL — v6.2 ist korrektheits-aequivalent (beide 100/100), zeigt eine **deutliche Verbesserung der Spitzen-Komplexitaet** (`cognitive_max` −42 % Mean, σ −81 %; `mccabe_max` −22 % Mean, σ −64 %) und eine moderate Disziplin-Drift (+22 % Refactorings). Kosten-Aufschlag +13 %/+15 % ist im selben Bereich wie auf claim-office.

---

## F-1.1 — Cleanup-Aequivalenz generalisiert: keine Korrektheits-Regression auf GoL

**Statement.** Auf game-of-life-example-mapping bleibt die Korrektheit invariant zwischen v6.1-with-why und v6.2-with-why-cleaned: `tests_passing` 100 %/100 %, `completed_within_budget` 100 %/100 %, `predictions_correct_rate` 98.8 % / 100 %. Damit wiederholt sich das Cleanup-Aequivalenz-Bild aus RQ-1.6 (claim-office) — beide Hauptfindings-Achsen bleiben in der Cross-Kata-Validierung stabil.

**Daten (n=5 pro Zelle).**

| Metrik | v6.1-with-why | v6.2-with-why-cleaned |
|---|---|---|
| `tests_passing` | 5/5 (100 %) | 5/5 (100 %) |
| `completed_within_budget` | 5/5 (100 %) | 5/5 (100 %) |
| `predictions_correct_rate` | 98.8 % (83/84) | 100.0 % (90/90) |

**Rationale.** H0 (Aequivalenz auf GoL) bestätigt. Wie erwartet ist `verification_pct` auf GoL nicht informativ, weil interne Vitest-Tests die einzige Korrektheits-Quelle sind — beide Workflows erreichen 100 %. Der Predictions-Rate-Unterschied (98.8 % → 100 %) ist statistisch im Noise (1 falsche Prediction bei v6.1 ueber 84 Predictions), aber direktional konsistent mit dem RQ-1.6-Befund. H1 (Kata-spezifischer Cleanup-Effekt) ist auf der Korrektheits-Achse damit klar widerlegt.

---

## F-1.2 — Spitzen-Komplexitaet kollabiert: cognitive_max −42 %, mccabe_max −22 %, Streuung stark gekappt

**Statement.** v6.2-with-why-cleaned reduziert die Spitzen-Komplexitaet auf GoL deutlich gegenueber v6.1-with-why. `cognitive_max` faellt im Mean von 4.80 auf 2.80 (−42 %) bei einer Streuungs-Reduktion von σ 5.81 auf σ 1.10 (−81 %); `mccabe_max` faellt von 4.60 auf 3.60 (−22 %) bei σ 3.13 → σ 1.14 (−64 %). Die Maxima reduzieren sich entsprechend (cognitive_max 15 → 4, mccabe_max 10 → 5).

**Daten (n=5 pro Zelle).**

| Metrik (↓ = besser) | v6.1-with-why | v6.2-with-why-cleaned | Δ |
|---|---:|---:|---|
| `cognitive_max` mean / σ / max | 4.80 / 5.81 / 15 | **2.80 / 1.10 / 4** | −42 % Mean, σ −81 % |
| `mccabe_max` mean / σ / max | 4.60 / 3.13 / 10 | **3.60 / 1.14 / 5** | −22 % Mean, σ −64 % |
| `cc_longest_function` mean / σ / max | 9.40 / 8.29 / 22 | 9.40 / 6.80 / 18 | = Mean, σ −18 %, max −18 % |

**Rationale.** Das Streuung-Kollaps-Pattern ist auffaellig: v6.1-with-why produziert vereinzelt sehr ausreisser-hafte Runs (cognitive_max=15, mccabe_max=10, longest=22), v6.2 nicht. Mechanistisch plausibel: die +22 % Refactorings (siehe F-1.3) treiben die Verteilung der Komplexitaets-Spitzen nach unten. Das gleiche Muster wurde in RQ-1.5 fuer v6.1-with-why vs v6.1-hybrid auf claim-office dokumentiert (σ −82–90 % auf Komplexitaets-Spitzen) und tritt hier in der naechsten Reduktions-Iteration wieder auf.

`code_mass` (151.0 → 148.8) und `smell_total` (2.8 → 2.6) zeigen kleine, im Noise liegende Verbesserungen — keine Verschlechterung wie auf claim-office, wo `code_mass` +14 % stieg. Auf der trainings-bekannten GoL-Kata bringt v6.2 also tendenziell *konsistentere und leicht kleinere* Implementierungen, waehrend auf claim-office das Code-Volumen leicht waechst (mehr Tests vollstaendig implementiert).

---

## F-1.3 — Disziplin-Drift uebertraegt sich auf GoL: +22 % Refactorings (claim-office: +34 %)

**Statement.** v6.2-with-why-cleaned refactoriert auf GoL +22 % haeufiger als v6.1-with-why (6.40 → 7.80 mean, σ 3.21 → 2.17). Der absolute Effekt ist kleiner als auf claim-office (+34 %), die Richtung aber gleich. `cycle_count` ist beinahe identisch (8.40 → 9.00), `tests_passed_immediately` faellt von 2.20 auf 1.40 (mehr Tests werden im Red erst erzeugt statt direkt zu greenen).

**Daten (n=5 pro Zelle).**

| Metrik (↑ = besser fuer Disziplin) | v6.1-with-why | v6.2-with-why-cleaned | Δ |
|---|---:|---:|---|
| `refactorings_applied` mean / σ | 6.40 / 3.21 | **7.80 / 2.17** | +22 % Mean, σ −32 % |
| `cycle_count` mean / σ / range | 8.40 / 0.55 / 8–9 | 9.00 / 0.71 / 8–10 | +7 % |
| `tests_passed_immediately` mean | 2.20 | 1.40 | −36 % (Disziplin-Verbesserung) |
| `predictions_correct_rate` | 98.8 % | **100 %** | +1.2 pp |

**Rationale.** H1 (Kata-spezifischer Cleanup-Effekt) ist auch auf der Disziplin-Achse widerlegt — der refactor.md-Entkopplungs-Effekt ist nicht claim-office-spezifisch, sondern produziert auch auf GoL zusaetzliche Refactor-Subagent-Spawns. Die kleinere Effektgroesse (+22 % vs +34 %) ist plausibel: GoL hat weniger Cycles (mean 9 vs 37 auf claim-office), also weniger absolute Iterationen, in denen sich der Drift aufbauen kann.

Die `tests_passed_immediately`-Reduktion (2.20 → 1.40, −36 %) zeigt, dass v6.2 *strikter im Red* bleibt — mehr Tests werden tatsaechlich rot, bevor der Green-Skill sie passend macht. Das ist ein qualitativer Disziplin-Gewinn, der in RQ-1.6 auf claim-office nicht sichtbar war (dort waren beide bei ~15).

---

## F-1.4 — Kosten-Aufschlag konsistent: +13 % Wallclock, +15 % Tokens

**Statement.** v6.2 kostet auf GoL +75 s Wallclock (+13 %) und +1.10 M Tokens (+15 %) pro Run. Der Aufschlag liegt im selben Bereich wie auf claim-office (+13 % / +12 % in RQ-1.6).

**Daten (n=5 pro Zelle).**

| Metrik (↓ = besser) | v6.1-with-why | v6.2-with-why-cleaned | Δ |
|---|---:|---:|---|
| `duration_seconds` mean | **569** 🏆 (σ 171) | 644 (σ 140) | +13 % |
| `total_tokens` mean | **7.56 M** 🏆 (σ 1.88 M) | 8.67 M (σ 1.57 M) | +15 % |
| `cycle_count` mean | 8.40 | 9.00 | +7 % |
| `total_tokens / cycle` (≈) | 0.90 M | 0.96 M | +7 % |

**Rationale.** H2 (Kosten-Aequivalenz auf GoL) ist widerlegt — v6.2 ist auch auf GoL spuerbar teurer. Der Kosten-Aufschlag pro Cycle ist mit +7 % Tokens/Cycle hoeher als auf claim-office (+5 %), aber immer noch klein. Wie auf claim-office reduziert sich die Streuung sowohl bei `duration_seconds` (σ 171 → 140) als auch bei `total_tokens` (σ 1.88 M → 1.57 M) — v6.2 ist konsistenter in den Kosten, was ein operationaler Vorteil bei Wallclock-Budgetierung ist.

---

## Status der Hypothesen

| Hypothese | Status | Beleg |
|---|---|---|
| **H0** Cleanup-Aequivalenz auf GoL | bestaetigt | Korrektheit 100/100, Disziplin-/Code-Qualitaets-Drift in gleicher Richtung wie auf claim-office |
| **H1** Kata-spezifischer Cleanup-Effekt | klar widerlegt | +22 % refactorings auf GoL (vs +34 % auf claim-office), gleiche Richtung; Code-Qualitaet auf GoL sogar staerker verbessert (cognitive_max −42 %) |
| **H2** Kosten-Aequivalenz auf GoL | widerlegt | +13 % Wallclock, +15 % Tokens — fast identisch zur claim-office-Differenz |

## Konsequenzen

1. **v6.2-with-why-cleaned-Empfehlung haelt fuer GoL.** Die in RQ-1.6 etablierte Default-Baseline ist auch auf der trainings-bekannten Kata verhalts-aequivalent und produziert sogar staerkere Code-Qualitaets-Vorteile (cognitive_max −42 %, mccabe_max −22 %). Die Empfehlung in [`workflow-construction.md`](../workflow-construction.md) bleibt unveraendert; die Cross-Kata-Validierung verstaerkt sie.
2. **Komplexitaets-Streuungs-Kollaps ist ein wiederkehrendes Muster.** Das in RQ-1.5 (v6.1-with-why vs v6.1-hybrid auf claim-office) zuerst dokumentierte Phaenomen — σ-Reduktion von 80–90 % auf cognitive_max/longest_function — tritt jetzt in der naechsten Workflow-Iteration (v6.2 vs v6.1-with-why) auf GoL erneut auf. Das spricht fuer einen robusten Mechanismus: mehr Refactorings → konsistentere Spitzen-Komplexitaet, kata- und workflow-iterations-unabhaengig.
3. **Offene Fragen fuer Folge-RQs:**
   - Halten die Befunde auf anderen Modellen (Sonnet, Haiku, Direct API ohne Portkey)?
   - Lohnen die +13 % Wallclock — gibt es eine v6.3-Variante, die nur eine der drei Cleanup-Achsen behaelt und kostenoptimaler ist?
   - Sind die +22 % Refactorings auf GoL "echte" Verbesserungen (Code wird besser durch jede Iteration) oder Overshooting (Refactorings ohne marginalen Wert)? Mutation-Score-Messung waere die direkte Pruefung.

**Caveat n=5.** Replikate-Anzahl bewusst kleiner als RQ-1.6 (n=8), weil der Test eine Cross-Kata-Validierung des bereits dokumentierten Effekts ist, kein Erstnachweis. Bei n=5 sind alle Effektgroessen-Schaetzungen mit groesseren Konfidenz-Intervallen behaftet; insbesondere die starke `cognitive_max`-Reduktion (−81 % σ) sollte bei Bedarf auf n=8 erweitert werden, bevor sie in eine generelle Methodik-Empfehlung uebernommen wird.
