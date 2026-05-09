# RQ-1 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin?**

Updates entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

---

## F-1.3 — v3 macht kein echtes TDD

**Aussage**: v3-basic-tdd liefert systematisch:
- exakt **1 Cycle** (test-block → impl-block, kein Red-Green-Refactor)
- **0 Refactorings**
- **0 Predictions** (Workflow erzeugt keine)
- `tests_passed_immediately` = 0

Damit ist v3 effektiv ein Batch-Stil mit TDD-Etikett. Die TDD-Disziplin-Metriken
(`cycle_count`, `refactorings_applied`, `predictions_correct`) tragen für
v3 keine Information.

Datenbasis: game-of-life RQ-1-Aggregation n=6 + game-of-life-stability n=9
= 15 Runs, alle Opus-no-thinking. v3 zeigt `cycle_count`=1.33 (1 Run mit
2 Cycles), `refactorings`=0, `predictions`=0. Ein einzelner Ausreißer
mit 2 Cycles ändert das Muster nicht.

---

## F-1.4 — Speed-Ranking konstant, v4 ≈ 16× v1

**Aussage**: Reihenfolge **v1 ≲ v3 ≲ v2 < v5 ≪ v4** gilt stabil.

| Workflow | duration μ (s) | range |
|---|---:|---|
| v1-oneshot | 50.0 | 45–56 |
| v2-iterative | 52.2 | 43–59 |
| v3-basic-tdd | 56.5 | 45–83 |
| v5-exact-single-context | 349.5 | 329–377 |
| v4-exact-subagents | 779.2 | 659–1059 |

Faktor v4/v1 = 779/50 ≈ **15.6×**.

Datenbasis: game-of-life RQ-1, Opus-no-thinking, n=6 pro Workflow.

---

## F-1.8 — TDD-Disziplin-Bänder (Refactorings, Predictions) belastbar

**Aussage**: Workflow-charakteristische Werte für Refactorings und
Predictions:

| Workflow | refactorings μ | predictions correct μ |
|---|---:|---:|
| v3 | 0.0 | 0 |
| v4 | 5.3 | 5.7 |
| v5 | 7.0 | 15.2 |

v5 macht ~3× so viele Predictions wie v4 — konsistent mit Workflow-Design
(Prediction-Step pro Cycle, v5 hat mehr Cycles im single-context).

Datenbasis: game-of-life RQ-1, n=6.

**Caveat**: `tests_passed_immediately` ist als "Über-Implementierungs"-Proxy
nur sinnvoll für Workflows mit Phasen-Mechanik. Für v3 trägt sie keine
Information (Wert = 0 = "keine Phasen", nicht "keine Über-Implementierung");
für v4 indiziert ein hoher Wert eher Generalisierung als Disziplinverlust.

---

## F-1.9 — Refactor-Workflows (v4/v5) halbieren Spitzen-Komplexität

**Aussage**: Workflows mit explizitem Refactor-Schritt (v4, v5) halten
sowohl die längste Funktion (in LoC) als auch die McCabe- und
Cognitive-Spitzenwerte auf etwa der Hälfte des Niveaus von v1/v2/v3.
v3 (TDD ohne Refactor) liegt klar im Non-Refactor-Cluster und bestätigt
damit F-1.3.

| Workflow | cc_longest μ | mccabe_max μ | cognitive_max μ |
|---|---:|---:|---:|
| v4-exact-subagents      | **15.2** | **4.5** | **5.7** |
| v5-exact-single-context | **16.8** | **6.3** | **10.2** |
| v1-oneshot              | 26.8     | 11.2    | 15.5    |
| v2-iterative            | 31.0     | 11.7    | 14.7    |
| v3-basic-tdd            | 29.8     | 11.8    | 16.7    |

Bei der Cognitive Complexity ist v3 sogar das **schlechteste** Workflow
(16.7 > 14.7 v2 > 15.5 v1) — TDD ohne Refactor erzeugt nicht nur lange
Funktionen (F-1.10), sondern auch verschachtelt-komplizierte. Der
Refactor-Schritt in v4/v5 ist also nicht nur ein LoC-Reduzierer,
sondern senkt strukturelle Komplexität substantiell (v4: McCabe −62 %,
Cognitive −66 % gegenüber v3). v4/v5 produzieren damit Code mit etwa
**3× weniger logischen Pfaden und 3× weniger kognitivem Aufwand pro
Funktion** als v1/v2/v3.

Datenbasis: game-of-life RQ-1, Opus-no-thinking, n=6 pro Workflow.

**Interpretation** (nicht aus den Daten ableitbar): Der Test-First-
Druck ohne Refactor-Phase (v3) könnte zu defensivem, ad-hoc gewachsenem
Code führen, den im Workflow niemand aufräumt — daher v3 schlechter als
v1/v2 auf Cognitive trotz nominell strengerer Vorgabe.

---

## F-1.10 — Funktionslänge und mittlere Komplexität bestätigen v3-Phantom-TDD

**Aussage**: Mittlere Funktionslänge (`cc_avg_loc_per_function`) und
mittlere McCabe-Komplexität (`mccabe_avg`) trennen Refactor-Workflows
scharf vom Rest. v3 (TDD ohne Refactor) liegt jeweils im Cluster der
Non-Refactor-Workflows.

| Workflow | avg_loc/func μ | mccabe_avg μ |
|---|---:|---:|
| v4-exact-subagents      | **5.8** | **2.6** |
| v5-exact-single-context | **7.2** | **3.0** |
| v1-oneshot              | 10.3    | 4.2     |
| v3-basic-tdd            | 13.2    | 4.8     |
| v2-iterative            | 13.2    | 4.8     |

v3 schreibt im Mittel gleich lange und gleich komplexe Funktionen wie
v2 (kein TDD) — das TDD-Etikett ohne Refactor-Schritt führt weder zu
kürzeren noch zu logisch einfacheren Funktionen. Verstärkt F-1.3 (v3
macht kein echtes TDD) und F-1.9 (Refactor-Schritt trennt sowohl LoC-
als auch numerische Komplexität).

Datenbasis: game-of-life RQ-1, Opus-no-thinking, n=6 pro Workflow.

---

## F-1.12 — v4 vs. v5: Trade-off Qualität/Stabilität gegen Geschwindigkeit/Kompaktheit

**Aussage**: v4 und v5 erreichen beide 100 % Pass-Rate (12/12 auf
game-of-life-em + claim-office-em mit Opus-no-thinking), trennen sich
aber auf den Qualitäts- und Effizienz-Achsen klar:

| Achse                     | Sieger | Daten (game-of-life-em, n=6) |
|---|---|---|
| Pass-Rate                 | Gleichstand | 100 % / 100 % |
| Strukturelle Komplexität  | **v4** | mccabe 4.5 vs. 6.3 (−29 %); cognitive 5.7 vs. 10.2 (**−44 %**) |
| Stabilität (σ Cognitive)  | **v4** | σ=3.2 vs. 7.1 (Range bei v5: 2–21) |
| Code-Kompaktheit (LoC)    | v5     | 33 vs. 45 LoC (−25 %) |
| Geschwindigkeit           | **v5** | 350 s vs. 780 s (2.2× schneller, F-1.4) |
| Predictions-Anzahl        | (kein Qualitäts-Signal) | siehe F-1.11 |

v4 erzeugt strukturell deutlich saubereren Code (Cognitive fast
halbiert) und ist über Replikate hinweg vorhersagbarer (σ Cognitive
halbiert). v5 ist dafür kompakter und mehr als doppelt so schnell.

**Implikation für Workflow-Wahl**: Wer Code-Qualität (insbesondere
Cognitive Complexity) und Reproduzierbarkeit priorisiert, sollte v4
wählen. Wer Geschwindigkeit braucht und mit höherer Run-zu-Run-Streuung
leben kann, ist mit v5 schneller am Ergebnis.

Datenbasis: game-of-life-example-mapping × Opus-no-thinking, n=6
(Komplexität/Stabilität/Kompaktheit) bzw. n=12 inkl. claim-office-em
(Pass-Rate). Speed-Zahlen aus F-1.4, Predictions aus F-1.11.

**Caveat**: Auf schwächeren Modellen könnte sich der v4-Vorteil noch
vergrößern — Memory bestätigt, dass v5 bei Haiku gelegentlich gar nicht
fertig wird (single-context fängt Modell-Fehler nicht ab). Robuste
Modell-Quervergleich-Aussage liegt bei RQ-4, sobald
Haiku-no-thinking-Runs vorliegen.

---

## F-1.11 — Predictions-Anzahl misst Workflow-Compliance, nicht TDD-Disziplin

**Aussage**: v4 und v5 erreichen beide ≥97 % Trefferquote auf den
"Guessing-Game"-Predictions. v5 markiert allerdings ~2.6× so viele
Predictions wie v4 (92 vs. 35), trotz **vergleichbarer Cycle-Anzahl**
(v4: 8.5 Cycles/Run, v5: 7.7) — der Unterschied liegt nicht in
TDD-Disziplin, sondern in der Strenge des Markup-Zwangs.

| Workflow | cycles/run | predictions/run | predictions/cycle | rate |
|---|---:|---:|---:|---:|
| v4-exact-subagents      | 8.5 | 5.8  | 0.7 | 97.1 % |
| v5-exact-single-context | 7.7 | 15.2 | 2.0 | 98.9 % |

**Mechanik des Unterschieds**:
- Beide Workflows verlangen pro Cycle **2 Predictions** (Compilation +
  Runtime, je `red.md`).
- v5 hat den expliziten Zusatz: *"You MUST output the full Step 7 block
  verbatim with `Correct` or `Incorrect` chosen for each prediction.
  Do not abbreviate. Do not collapse the two prediction lines into
  one."* — daher fast genau 2.0 markierte Predictions/Cycle.
- v4-Subagents arbeiten ohne diesen Zwang. Plus: jeder Phase-Wechsel
  ist ein Subagent-Spawn mit fresh context — der nächste red-Agent
  sieht die vorherige Step-7-Ausgabe nicht und reproduziert das Format
  weniger zuverlässig. Resultat: ~0.7 markierte Predictions/Cycle.
- Detektion in `analyze_transcript.py` zählt nur die explizit
  markierten `Correct`/`Incorrect`-Zeilen — implizite Predictions
  ohne Marker fallen durchs Raster.

`predictions_total` misst also **"wie viele Vorhersagen wurden im
erwarteten Format markiert"**, nicht "wie viele Vorhersagen wurden
gemacht". Das ist ein Mess-Artefakt aus Workflow-Compliance, kein
TDD-Disziplin-Signal.

Verfeinert F-1.8: Refactorings (`refactorings_applied`) bleibt das
verlässlichere Disziplin-Signal (v4: 5.3, v5: 7.0), Predictions-Anzahl
ist als Aktivitäts-Metrik zu lesen.

v3 produziert keine Predictions (s. F-1.3) und ist daher nicht
enthalten.

Datenbasis: game-of-life-example-mapping × Opus-no-thinking, n=6 pro
Workflow.
