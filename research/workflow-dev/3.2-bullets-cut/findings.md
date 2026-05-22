# RQ-15 Findings

## Übersicht

Primär-Outcomes je Zelle (n=10 je Workflow, opus-4-7-no-thinking, game-of-life-example-mapping). 🏆 = bester Wert pro Outcome.

| Outcome (Richtung)                                  | v6.5.1-orchestration-audited | v6.5.2-bullets-cut |
|-----------------------------------------------------|------------------------------|--------------------|
| Smell-Summe (`smell_total`, kleiner = besser)       | **2.0 ± 0** 🏆               | 2.1 ± 0.32         |
| Code-Mass (APP) (`code_mass`, kleiner = besser)     | **146.7 ± 11.53** 🏆         | 146.7 ± 13.39      |
| Spitzen-Komplexität (`cc_longest_function`)         | 13.1 ± 6.30                  | **13.1 ± 4.09** 🏆 |
| `cognitive_max` (kleiner = besser)                  | 5.6 ± 3.17                   | **4.0 ± 2.16** 🏆  |
| `mccabe_max` (kleiner = besser)                     | 4.9 ± 1.45                   | **4.1 ± 0.74** 🏆  |
| `refactorings_applied` (höher = besser)             | **7.8 ± 0.42** 🏆            | 7.6 ± 1.26         |
| `cycle_count` (höher = besser)                      | **7.8 ± 0.42** 🏆            | 7.7 ± 1.06         |
| `tests_passed_immediately` (kleiner = besser)       | **0 / 10** 🏆                | 1 / 10             |
| `predictions_correct_rate` (höher = besser, pooled) | 98.9 % (175/177)             | **99.4 % (153/154)** 🏆 |
| `total_tokens` (kleiner = besser)                   | 8.53 M ± 0.60                | **7.21 M ± 1.35** 🏆 |
| `duration_seconds` (kleiner = besser)               | 726.1 ± 87                   | **694.8 ± 111** 🏆 |
| `tests_passing` / `verification_pct`                | 100 % / 100 %                | 100 % / 100 %      |

Lesart: v6.5.2 gewinnt auf **Code-Qualität** (Komplexitäts-Metriken deutlich besser) und **Kosten** (−15 % Tokens, −4 % Wallclock). v6.5.1 gewinnt auf **TDD-Disziplin-Stabilität** (σ in `refactorings_applied`, `cycle_count`, `tests_passed_immediately` jeweils niedriger). Kein universeller Sieger — Trade-off zwischen Quality/Cost und Disziplin-Determinismus.

---

## F-15.1 — Bullet-Cut verbessert Code-Qualität substanziell

Drei Komplexitäts-Metriken sinken deutlich, σ ebenso:

| outcome                | v6.5.1            | v6.5.2            | Δ Mittel | Δ σ |
|------------------------|-------------------|-------------------|---------:|----:|
| `cognitive_max`        | 5.6 ± 3.17        | **4.0 ± 2.16**    | −29 %    | −32 % |
| `mccabe_max`           | 4.9 ± 1.45        | **4.1 ± 0.74**    | −16 %    | −49 % |
| `cc_longest_function`  | 13.1 ± 6.30       | 13.1 ± **4.09**   | 0 %      | −35 % |

Code-Mass (APP) und Smell-Summe bleiben praktisch identisch (146.7 vs 146.7; 2.0 vs 2.1). Hypothese: ohne die DO/DON'T-Bullet-Listen hat der Refactor-Subagent weniger Anker-Noise im Kontext und entscheidet komplexitäts-orientierter — die explizite APP-Mass-Berechnung bleibt erhalten und trägt allein.

---

## F-15.2 — TDD-Disziplin-Mittelwerte halten, Streuung steigt deutlich

Mittelwerte der Disziplin-Metriken bleiben innerhalb 1 σ der v6.5.1-Werte, aber σ verdoppelt/verdreifacht sich:

| outcome                      | v6.5.1            | v6.5.2          | σ-Faktor |
|------------------------------|-------------------|-----------------|---------:|
| `refactorings_applied`       | 7.8 ± 0.42        | 7.6 ± 1.26      | 3.0×     |
| `cycle_count`                | 7.8 ± 0.42        | 7.7 ± 1.06      | 2.5×     |
| `tests_passed_immediately`   | 0 / 10            | 1 / 10          | n. a.    |

H1 (Mittelwerte halten) ist erfüllt, H4 (σ stabil) klar widerlegt. Die in RQ-14 fast deterministischen Bänder lösen sich auf — v6.5.2-Runs sind im Mittel ähnlich diszipliniert, aber das *deterministische Floor-Verhalten* (refactorings_applied: min 7 in v6.5.1, min 5 in v6.5.2) ist verloren. Lesart: die Bullets haben nicht die Mittelwerte getragen, sondern den Pattern-Match-Floor — ohne sie kollabieren Outlier auf die alten v6.5-lean-Niveaus zurück.

---

## F-15.3 — Token-Mittelwert sinkt überraschend stark, σ verdoppelt sich

| outcome           | v6.5.1            | v6.5.2            | Δ Mittel | Δ σ  |
|-------------------|-------------------|-------------------|---------:|-----:|
| `total_tokens`    | 8.53 M ± 0.60     | **7.21 M ± 1.35** | −15 %    | +124 % |
| `duration_seconds`| 726.1 ± 87        | **694.8 ± 111**   | −4 %     | +27 %  |

Die gestrichenen 38 Zeilen ergeben rechnerisch unter 1 % weniger Workflow-Text — der gemessene −15 %-Effekt kommt also nicht aus dem entfernten Text selbst, sondern aus Sekundär-Wirkungen: weniger Bullet-Anker → kürzere Refactor-Phasen mit weniger Edit-Iterationen → weniger Subagent-Tokens. H3 (−1 bis −5 %) ist nach unten widerlegt; der Effekt ist deutlich größer als erwartet.

Die σ-Verdoppelung (0.60 M → 1.35 M) heißt: Cost ist im Mittel günstiger, aber pro Run schlechter vorhersagbar. Min `total_tokens` 4.94 M (best case −42 %), max 9.37 M (schlechter als v6.5.1-max).

---

## F-15.4 — Korrektheit bleibt perfekt, Bullets sind nicht korrektheits-tragend

`tests_passing` 10/10, `verification_pct` 10/10 in beiden Zellen. Die gestrichenen Bullets hatten keinen Anteil an der Test-/Acceptance-Korrektheit.

---

## F-15.5 — Promotion-Lesart: zwei verschiedene Champions

v6.5.2 ist **kein** Drop-in-Ersatz für v6.5.1, sondern ein anderes Profil:

| Ziel                          | empfohlener Workflow              | Begründung |
|-------------------------------|-----------------------------------|------------|
| niedrigste Komplexität        | **v6.5.2-bullets-cut**            | `cognitive_max` −29 %, `mccabe_max` −16 %, σ überall niedriger |
| niedrigste Token-Kosten       | **v6.5.2-bullets-cut**            | −15 % Mittel, allerdings σ verdoppelt |
| deterministischste Disziplin  | **v6.5.1-orchestration-audited**  | σ TDD-Metriken Faktor 2–3 niedriger; perfektes `tests_passed_immediately = 0` |
| Korrektheit (innen + außen)   | beide gleichwertig                | 100 % / 100 % |

Empfehlung: v6.5.2 als neuer Quality-Champion; v6.5.1 bleibt Disziplin-Stability-Champion. Folge-RQ mit n=20 könnte klären, ob die σ-Zunahme bei v6.5.2 ein Erstsignal-Artefakt ist oder strukturell.
