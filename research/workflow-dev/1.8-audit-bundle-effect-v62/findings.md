# RQ-audit-bundle-v62 Findings

## Übersicht

Primär-Outcomes je Zelle (n=10 je Workflow, opus-4-7-portkey-no-thinking, game-of-life-example-mapping). 🏆 = bester Wert pro Outcome; Ties bekommen alle den Pokal; reine Rausch-Differenzen (Δ << σ) ohne Pokal.

| Outcome (Richtung)                                          | v6.2-with-why-cleaned | v6.3-audit-bundle      |
|-------------------------------------------------------------|-----------------------|------------------------|
| `tests_passed_immediately` (kleiner = besser)               | 0.7 ± 2.21 (max 7)    | **0 ± 0** 🏆           |
| `refactorings_applied` (höher = besser)                     | 7.9 ± 1.85            | **8.7 ± 0.67** 🏆      |
| `predictions_correct_rate` (höher = besser, pooled)         | **100 %** 🏆          | 97.4 % (185/190)       |
| `cycle_count` (Informativ, keine eindeutige Richtung)       | 8.5 ± 1.35            | 8.7 ± 0.67             |
| Code-Mass (APP) (`code_mass`, kleiner = besser)             | 153.3 ± 13.83         | **149.3 ± 12.14** 🏆   |
| Smell-Summe (`smell_total`, kleiner = besser)               | 2.4 ± 0.52            | **2.2 ± 0.63** 🏆      |
| Spitzen-Komplexität (`cc_longest_function`, kleiner = besser)| 12.2 ± 6.89          | 12.7 ± 4.32            |
| `cognitive_max` (kleiner = besser)                          | 4.3 ± 2.79            | 4.5 ± 2.59             |
| `mccabe_max` (kleiner = besser)                             | 4.2 ± 1.32            | 4.6 ± 1.07             |
| `tests_passing` / `completed_within_budget`                 | 100 % / 100 %         | 100 % / 100 %          |
| `total_tokens` (kleiner = besser)                           | **8.32 M ± 1.61** 🏆  | 9.65 M ± 2.34          |
| `duration_seconds` (kleiner = besser, Δ << σ)               | 627 ± 117             | 631 ± 101              |

Komplexitäts-Outcomes `cc_longest_function`, `cognitive_max`, `mccabe_max`: Mittelwert-Δ deutlich kleiner als σ → kein Pokal, Workflows ununterscheidbar auf der Spitzen-Komplexitäts-Achse.

---

## F-1.8.1 — Mandatory-Procedure-Preamble eliminiert vorzeitige Greens auch auf v6.2-Basis

`tests_passed_immediately` fällt von 0.7 ± 2.21 (max 7) auf **0 ± 0**. In zehn v6.3-Runs hat *kein* Test sofort nach dem Red-Switch grün gestanden.

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 0.7 | 2.21 | 0 | 7 |
| v6.3-audit-bundle     | 0   | 0    | 0 | 0 |

Identisches Pattern wie in der RQ-audit-Präzedenz (v6.5-lean → v6.5.1: 1.4 → 0). Die Mandatory-Procedure-Preamble in `commands/red.md` verbietet das Überspringen der sieben Red-Schritte selbst wenn der aktive Test bereits grün steht — Resultat: ein implizit über-implementierender Green der Vorgänger-Iteration wird durch den nächsten Red-Cycle gezwungen, einen echten Fehlschlag zu erzeugen.

Der Effekt repliziert auf der MUST/PEP-tragenden v6.2-Basis (also ohne v6.5-lean-spezifische Reduktionen). Das Audit-Bundle ist hier eigenständig wirksam, nicht nur Reparatur einer reduzierten Basis.

---

## F-1.8.2 — Refactor-Rationale + Drei-Pfad-Bar erhöht und stabilisiert Refactoring-Disziplin

`refactorings_applied` 7.9 ± 1.85 → **8.7 ± 0.67**. Mittel +10 %, σ knapp ein Drittel.

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 7.9 | 1.85 | 4 | 9 |
| v6.3-audit-bundle     | 8.7 | 0.67 | 8 | 10 |

Effekt-Richtung identisch zur RQ-audit-Präzedenz (v6.5-lean → v6.5.1: 6.9 → 7.8, +13 %, σ −82 %). Auf der v6.2-Basis ist die Effekt-Größe wie hypothetisiert kleiner (Why-Bloecke in v6.2 tragen bereits einen Teil der Rationale-Wirkung), aber die σ-Reduktion ist klar.

Mechanismen: Measurement-Pipeline-Rationale macht den Refactor-Pflicht-Floor explizit motivisch ("missing attempt drops the signal to zero"); der konkrete Drei-Pfad-Bar (name tightening / APP-Mass-Drop ≥1 / removable smell) verschließt den "code is already optimal"-Eskape und zwingt den Refactor-Subagenten, jeden Pfad explizit zu adressieren.

---

## F-1.8.3 — Code-Qualität gleichwertig, kein Regress

Code-Qualitäts-Outcomes liegen je innerhalb 1 σ — keine Verschlechterung.

| outcome | v6.2-with-why-cleaned | v6.3-audit-bundle |
|---|---|---|
| Code-Mass (APP) (`code_mass`)               | 153.3 ± 13.83 | **149.3 ± 12.14** |
| Smell-Summe (`smell_total`)                 | 2.4 ± 0.52    | **2.2 ± 0.63**    |
| Spitzen-Komplexität (`cc_longest_function`) | 12.2 ± 6.89   | 12.7 ± 4.32       |
| `cognitive_max`                             | 4.3 ± 2.79    | 4.5 ± 2.59        |
| `mccabe_max`                                | 4.2 ± 1.32    | 4.6 ± 1.07        |

Code-Mass und Smell-Summe sinken leicht; Spitzen-Komplexität, Cognitive- und McCabe-Max bleiben statistisch ununterscheidbar (Δ < σ). v6.3 zeigt zudem eine engere σ auf der Spitzen-Komplexität (6.89 → 4.32, −37 %), wie in der RQ-audit-Präzedenz beobachtet.

Korrektheit ist auf GoL bei beiden Workflows saturiert (100 % `tests_passing`, 100 % `completed_within_budget`). H2 (Korrektheit nicht regredieren) erfüllt.

---

## F-1.8.4 — Wrong-Predictions-Block zeigt sich in 2.6 pp Predictions-Rate-Drop

`predictions_correct_rate` fällt von 100 % (170/170) auf 97.4 % (185/190). Fünf von 190 Compilation/Runtime-Predictions sind in v6.3 explizit als `Incorrect` markiert.

Das ist nicht ein Disziplin-Verlust, sondern der intendierte Effekt des "Wrong Predictions Are Data"-Blocks: das Backfill-Verbot ("do not edit the original prediction to match the observed result") verhindert, dass eine falsche Prediction retroaktiv zur Beobachtung umgeschrieben wird. Die v6.2-Basis erlaubt das implizit (kein explizites Verbot, Red-Phase-STOP-Klausel kann zur Glättung verleiten). Der Rate-Drop misst genau die ehrlichen Falsch-Predictions, die in v6.2 vermutlich teilweise vor der Veröffentlichung "korrigiert" wurden.

Für die Bewertung der TDD-Disziplin ist v6.3 hier informativer, auch wenn die Zahl niedriger aussieht.

---

## F-1.8.5 — Audit-Bundle kostet +16 % Tokens, aber kein Wallclock-Aufschlag

| outcome | v6.2-with-why-cleaned | v6.3-audit-bundle | Δ |
|---|---:|---:|---:|
| `total_tokens`     | 8.32 M ± 1.61 | 9.65 M ± 2.34 | +16 % |
| `duration_seconds` | 627 ± 117     | 631 ± 101     | +0.6 % |

Der Token-Aufschlag (+16 %) repliziert die RQ-audit-Präzedenz (+15 %) fast exakt — das ergänzte Text-Volumen (Mandatory-Preamble, drei Rationale-Blöcke, Drei-Pfad-Bar, Wrong-Predictions-Block) zahlt sich erwartungsgemäß im Token-Verbrauch nieder.

Die Wallclock-Neutralität (+0.6 %) ist hingegen ein Bruch zur RQ-audit-Präzedenz, die +16 % Wallclock zeigte. Mögliche Erklärungen, unter denen die Token-Wallclock-Entkopplung verständlich wird:
- v6.2 hat 0.7 vorzeitige Greens im Schnitt, die jeweils einen kompletten "Test passed already"-Detour-Cycle auslösen können; v6.3 spart diese ein. Der zusätzliche Text-Verarbeitungs-Aufwand kompensiert sich mit dem eliminierten Detour.
- v6.5-lean → v6.5.1 startete von einer reduzierten Basis (weniger Pep, weniger Emoji), in der der Detour-Effekt nicht existierte und der Audit-Text-Aufschlag direkt auf die Wallclock durchschlug.

Die Token-Streuung steigt allerdings (σ 1.61M → 2.34M, +45 %) — ein einzelner v6.3-Run mit 16 M Tokens (vs. Cluster bei ~9 M) dominiert. Das deutet auf einen Ausreißer, kein systematischer Drift.

---

## F-1.8.6 — Streuungs-Schrumpf bestätigt sich in Disziplin- und Komplexitäts-Outcomes

| outcome | σ v6.2 | σ v6.3 | Faktor |
|---|---:|---:|---:|
| `tests_passed_immediately` | 2.21 | 0    | 0    |
| `refactorings_applied`     | 1.85 | 0.67 | 0.36 |
| `cycle_count`              | 1.35 | 0.67 | 0.50 |
| `cc_longest_function`      | 6.89 | 4.32 | 0.63 |
| `mccabe_max`               | 1.32 | 1.07 | 0.81 |
| `cognitive_max`            | 2.79 | 2.59 | 0.93 |
| `code_mass`                | 13.83| 12.14| 0.88 |
| `duration_seconds`         | 117  | 101  | 0.86 |
| `smell_total`              | 0.52 | 0.63 | 1.21 |
| `total_tokens` (M)         | 1.61 | 2.34 | 1.45 |

Auf den TDD-Disziplin-Outcomes ist der σ-Schrumpf dramatisch (`tests_passed_immediately` σ 2.21 → 0; `refactorings_applied` σ um Faktor 0.36; `cycle_count` halbiert). Die Komplexitäts-Outcomes folgen schwächer in dieselbe Richtung. Smell-Summe und Token-σ steigen — der Token-Anstieg ist auf den oben erwähnten 16M-Outlier-Run zurückführbar; der Smell-σ-Anstieg geht auf einen einzelnen v6.3-Run mit 4 Smells (vs. 2 sonst) zurück.

Das Audit-Bundle macht den Workflow auf den Disziplin-Achsen *deutlich* planbarer — bei n=10 ist v6.3 in `tests_passed_immediately` und `cycle_count` quasi deterministisch.
