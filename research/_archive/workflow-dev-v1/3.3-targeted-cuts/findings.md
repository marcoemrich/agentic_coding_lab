# RQ-targeted Findings

## Übersicht

Primär-Outcomes je Zelle (n=10 je Workflow, opus-4-7-no-thinking, game-of-life-example-mapping). 🏆 = bester Wert pro Outcome (auch geteilt).

| Outcome (Richtung)                                  | v6.5.1-orchestration-audited | v6.5.2-bullets-cut    | v6.5.3-targeted-cuts |
|-----------------------------------------------------|------------------------------|-----------------------|----------------------|
| Smell-Summe (`smell_total`, kleiner = besser)       | **2.0 ± 0** 🏆               | 2.1 ± 0.32            | **2.0 ± 0** 🏆       |
| Code-Mass (APP) (`code_mass`, kleiner = besser)     | **146.7 ± 11.53** 🏆         | **146.7 ± 13.39** 🏆  | 150.7 ± 13.93        |
| Spitzen-Komplexität (`cc_longest_function`)         | 13.1 ± 6.30                  | 13.1 ± 4.09           | **12.0 ± 3.40** 🏆   |
| `cognitive_max` (kleiner = besser)                  | 5.6 ± 3.17                   | 4.0 ± 2.16            | **3.5 ± 1.43** 🏆    |
| `mccabe_max` (kleiner = besser)                     | 4.9 ± 1.45                   | **4.1 ± 0.74** 🏆     | 4.3 ± 0.67           |
| `refactorings_applied` (höher = besser)             | 7.8 ± 0.42                   | 7.6 ± 1.26            | **8.3 ± 0.67** 🏆    |
| `cycle_count` (höher = besser)                      | 7.8 ± 0.42                   | 7.7 ± 1.06            | **8.3 ± 0.67** 🏆    |
| `tests_passed_immediately` (kleiner = besser)       | **0 / 10** 🏆                | 1 / 10                | **0 / 10** 🏆        |
| `predictions_correct_rate` (höher = besser, pooled) | 98.9 % (175/177)             | **99.4 % (153/154)** 🏆 | 95.8 % (159/166)   |
| `total_tokens` (kleiner = besser)                   | 8.53 M ± 0.60                | **7.21 M ± 1.35** 🏆  | 8.56 M ± 1.48        |
| `duration_seconds` (kleiner = besser)               | 726.1 ± 87                   | **694.8 ± 111** 🏆    | 752.1 ± 146          |
| `tests_passing` / `verification_pct`                | 100 % / 100 %                | 100 % / 100 %         | 100 % / 100 %        |

Lesart: drei verschiedene Pareto-Profile. v6.5.3 gewinnt fast alle Quality- und Disziplin-Mean-Metriken, verliert aber den Token-Win von v6.5.2 vollständig (Kosten zurück auf v6.5.1-Niveau, sogar marginal höher) — und überraschend bei `predictions_correct_rate` (95.8 %).

---

## F-targeted.1 — Floor-Anker bestätigt: "Remember"-Sektion trägt das Disziplin-Floor

Zwei Floor-Metriken springen mit der "Remember"-Sektion zwischen v6.5.1/v6.5.3 (enthält "Remember") und v6.5.2 (entfernt) — die mid-file DO/DON'T-Blöcke haben keinen Einfluss:

| outcome (Floor)         | v6.5.1 ("Remember" da)| v6.5.2 ("Remember" weg) | v6.5.3 ("Remember" da)|
|-------------------------|----------------------:|------------------------:|----------------------:|
| `tests_passed_immediately` | 0 / 10              | 1 / 10                  | 0 / 10                |
| `refactorings_applied` min | 7                   | 5                       | 7                     |
| `refactorings_applied` σ  | 0.42                | 1.26                    | 0.67                  |
| `cycle_count` σ           | 0.42                | 1.06                    | 0.67                  |

v6.5.3 reproduziert den perfekten 0/10-Floor von v6.5.1 und den 7er-Refactor-Floor — obwohl die beiden mid-file DO/DON'T-Blöcke gestrichen sind. Damit ist die Floor-Anker-Hypothese gestützt: die **end-of-file "Remember"-Position** ist die strukturell tragende — eine letzte Lese-Position als finaler Invariant-Pass kurz vor dem Subagent-Output. Die mid-file DO/DON'Ts waren Pattern-Match-Noise ohne Floor-Wirkung.

---

## F-targeted.2 — v6.5.3 ist neuer Quality-Champion: `cognitive_max` 5.6 → 3.5

Drei Komplexitäts-Metriken erreichen mit v6.5.3 ihr Minimum über alle drei Workflows:

| outcome              | v6.5.1        | v6.5.2          | v6.5.3            | Δ vs v6.5.1 |
|----------------------|---------------|-----------------|-------------------|------------:|
| `cognitive_max`      | 5.6 ± 3.17    | 4.0 ± 2.16      | **3.5 ± 1.43**    | −37 %       |
| `cc_longest_function`| 13.1 ± 6.30   | 13.1 ± 4.09     | **12.0 ± 3.40**   | −8 %        |
| `mccabe_max`         | 4.9 ± 1.45    | 4.1 ± 0.74      | 4.3 ± 0.67        | −12 %       |

`cognitive_max` σ sinkt sogar unter v6.5.2 (1.43 vs 2.16). Hypothese: die mid-file DO/DON'T-Blöcke waren *kontraproduktiv* für die Komplexität — sie schwemmten den Refactor-Subagent mit Wiederholungen zu, die Aufmerksamkeit von der konkreten Code-Bewertung abzogen. Ohne sie + mit erhaltenem "Remember"-Floor entscheidet der Subagent komplexitäts-orientierter.

---

## F-targeted.3 — Token-Win von v6.5.2 ist NICHT übertragbar: "Remember" treibt Refactor-Tiefe

| outcome           | v6.5.1            | v6.5.2 (alle drei Cuts) | v6.5.3 (nur DO/DON'T weg) |
|-------------------|-------------------|-------------------------|---------------------------|
| `total_tokens`    | 8.53 M ± 0.60     | **7.21 M ± 1.35**       | 8.56 M ± 1.48             |
| `duration_seconds`| 726.1 ± 87        | **694.8 ± 111**         | 752.1 ± 146               |
| `refactorings_applied` Mittel | 7.8       | 7.6                     | 8.3                       |

Obwohl v6.5.3 nur 8 Zeilen mehr Workflow-Text hat als v6.5.2 (die "Remember"-Sektion), liegen seine Tokens 19 % höher (auf v6.5.1-Niveau, sogar marginal darüber). Der Effekt kann nicht aus dem direkten Text-Volumen kommen. Stützende Beobachtung: v6.5.3 macht **mehr** Refactorings im Schnitt (8.3 vs v6.5.2's 7.6), bei längeren Phasen.

Lesart: "Remember" treibt den Refactor-Subagent zu *tieferer* Refactor-Arbeit — mehr Iterationen, längere Edit-Sequenzen, höhere Tokens, aber besseres Quality-Ergebnis. v6.5.2's Token-Win kam also primär aus *kürzeren* Refactor-Phasen, nicht aus dem entfernten Text. Pareto-Wahl steht: niedrige Tokens (v6.5.2) ↔ stabiles Floor + bessere Quality (v6.5.3).

---

## F-targeted.4 — v6.5.3 zeigt überraschend schlechtere `predictions_correct_rate` (95.8 %)

| workflow | correct / total | rate    | Wrong-Predictions |
|---|---:|---:|---:|
| v6.5.1-orchestration-audited | 175 / 177 | 98.9 % | 2 |
| v6.5.2-bullets-cut           | 153 / 154 | 99.4 % | 1 |
| v6.5.3-targeted-cuts         | 159 / 166 | 95.8 % | 7 |

v6.5.3 hat sieben Wrong-Predictions über 10 Runs — Faktor 3.5 mehr als v6.5.1 und Faktor 7 mehr als v6.5.2. Das passt nicht in das sonstige Disziplin-Bild (alle anderen Disziplin-Metriken halten oder verbessern sich).

Plausibelste Lesart: die DO/DON'T-Streichung in `red/SKILL.md` (14 Z.) hat einen Block entfernt, der explizit Wrong-Prediction-Mechaniken absicherte ("DO predict the exact error", "DON'T skip the prediction step"). v6.5.2 hat denselben Cut, aber durch *gleichzeitig* fehlende "Remember" sind die Cycles dort schon kürzer und die Gelegenheiten für Wrong-Predictions geringer — Confounder. In v6.5.3 läuft der volle Cycle-Floor, aber ohne den Red-Phase-Schutz.

→ Folge-RQ-Kandidat: v6.5.4 = v6.5.3 + Wiederherstellung des `red/SKILL.md`-DO/DON'T-Blocks. Falls `predictions_correct_rate` zurück auf ≥99 % springt ohne andere Metriken zu verschlechtern, wäre v6.5.4 der saubere Pareto-Optimum.

---

## F-targeted.5 — Drei verschiedene Champion-Profile

Die drei Workflows besetzen drei verschiedene Pareto-Punkte:

| Ziel                                | empfohlener Workflow              | Begründung |
|-------------------------------------|-----------------------------------|------------|
| niedrigste Komplexität              | **v6.5.3-targeted-cuts**          | `cognitive_max` −37 % vs v6.5.1, `cc_longest_function` −8 %, σ jeweils niedrigste |
| niedrigste Token-Kosten             | **v6.5.2-bullets-cut**            | −15 % Tokens; verliert aber Disziplin-Floor und Smell-Determinismus |
| deterministischste TDD-Disziplin    | **v6.5.1-orchestration-audited**  | σ refactorings_applied 0.42 (niedrigste); 98.9 % Pred-Rate; perfekter `tests_passed_immediately = 0` |
| beste Pred-Rate                     | v6.5.2 (99.4 %) / v6.5.1 (98.9 %) | v6.5.3 fällt auf 95.8 % zurück |
| Korrektheit (innen + außen)         | alle drei gleichwertig            | 100 % / 100 % in jeder Zelle |

**Promotion-Empfehlung**: v6.5.3 ist der **neue Quality-Champion**, ohne v6.5.1 oder v6.5.2 zu verdrängen — die drei haben verschiedene Zielfunktionen. Falls eine Wahl getroffen werden muss: für Quality+Disziplin v6.5.3, für Cost v6.5.2.
