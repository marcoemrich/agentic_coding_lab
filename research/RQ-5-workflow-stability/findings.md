# RQ-5 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie stabil ist die Code-Qualitaet pro Workflow ueber Replikate, und unter
welchen Bedingungen ist n=3 als Replikat-Anzahl ausreichend?**

Datenbasis: 60 Runs (6 Zellen × n=10), Stand 2026-05-15. Modell
`opus-4-7-no-thinking`, Kata `game-of-life` (Library-Form) mit explizitem
API-Vertrag. Stabilitaets-Analyse via Subsampling
(`research/RQ-5-workflow-stability/subsample-analysis.py`).

---

## Übersicht: Code-Qualität nach Workflow (n=10)

| Workflow | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | n |
|---|---:|---:|---:|---:|---:|---:|
| v1-oneshot (prose) | 155.00 | 4.80 | 12.80 | 18.80 | 31.70 | 10 |
| v2-iterative (prose) | 157.80 | 4.10 | 11.60 | 16.20 | 32.10 | 10 |
| v3-basic-tdd (EM) | 165.60 | 6.00 | 13.70 | 21.80 | 32.50 | 10 |
| v4-exact-subagents (EM) | 166.60 | 2.60 | **4.50** | **4.40** | **8.10** | 10 |
| v5-exact-single-context (EM) | **152.60** | 4.10 | 8.90 | 14.50 | 17.40 | 10 |
| v6-hybrid (EM) | 158.60 | **2.20** | **4.50** | 5.20 | 13.10 | 10 |

Bester Wert pro Spalte fett. Kleiner = besser.

---

## F-5.1 — RQ-4-Hauptbefund (v4 dominiert Code-Komplexität, v3 ist Schlusslicht) repliziert bei n=10 mit gleichem Vorzeichen ✅ stabil

**Aussage**: Bei n=10 wird das in RQ-4 mit n=3 beobachtete Muster
vollständig bestätigt:

| Metrik | RQ-4 (n=3) | RQ-5 (n=10) | Ranking-Änderung? |
|---|---|---|---|
| `cognitive_max` v4 best | 2.83 | 4.40 | unverändert (v4 stark vorn) |
| `cognitive_max` v3 worst | 23.33 | 21.80 | unverändert (v3 hinten) |
| `mccabe_max` v4 best | 4.00 | 4.50 | unverändert |
| `cc_longest_function` v4 best | 9.33 | 8.10 | unverändert |
| `smell_total` v4 best | 2.50 | 2.60 | unverändert |

v4 bleibt auf allen vier Komplexitäts-Outcomes klar Erster, v3 bleibt
Schlusslicht. **H4 (RQ-4-Befund hält bei n=10) bestätigt** — die zentralen
Aussagen aus F-4.1/F-4.2 sind kein n=3-Artefakt.

**Datenbasis**: 50 Runs (10 pro Zelle). Mittelwert-Drift gegenüber RQ-4
(n=3) typischerweise < 15 % bei Komplexitäts-Outcomes.

**Wichtige Verschiebung im mittleren Feld**: Die Reihenfolge zwischen v1,
v2 und v5 auf `cognitive_max` ändert sich:

- RQ-4 (n=3): v2 (16.7) < v5 (18.3) < v1 (20.7)
- RQ-5 (n=10): v5 (14.5) < v2 (16.2) < v1 (18.8)

v5 rutscht aus der Mitte des Felds in den vorderen Bereich. Die n=3-Werte
für v5 waren von wenigen hohen Runs dominiert; bei n=10 zeigt sich eine
breitere Verteilung mit niedrigerem Mittel. Das ist der erste konkrete
Hinweis darauf, dass n=3 für Workflows mit hoher Streuung (siehe F-5.2)
ranking-instabil ist.

---

## F-5.2 — Workflow-Stabilität ist nicht uniform; v4 hat 10 %-Outlier-Rate trotz tiefem typischen Wert; v5 ist breitestes Workflow ✅ stabil

**Aussage**: Stabilitäts-Kennzahlen pro Zelle (cognitive_max als Hauptbeispiel):

| Workflow | μ | σ | CV (σ/μ) | IQR | Outlier-Rate (>2σ) |
|---|---:|---:|---:|---:|---:|
| v3-basic-tdd | 21.80 | 3.43 | 0.157 | 5.50 | 0 % |
| v1-oneshot | 18.80 | 3.40 | 0.181 | 3.25 | 10 % |
| v2-iterative | 16.20 | 3.40 | 0.210 | 5.00 | 0 % |
| v5-exact-single-context | 14.50 | 4.59 | 0.316 | 7.75 | 10 % |
| v6-hybrid | 5.20 | **2.30** | 0.442 | ~3 | **0 %** |
| v4-exact-subagents | 4.40 | 4.25 | 0.965 | **1.25** | 10 % |

Drei Stabilitäts-Profile:

- **v1/v2/v3** sind "**bandförmig**": σ ~3.4 mit moderatem IQR (3–6),
  Werte konzentriert um den Mittel. Diese Workflows produzieren konsistent
  ähnliche Code-Qualität — sowohl die Mittel-Werte als auch die
  einzelnen Runs sind vergleichbar.
- **v4 ist "**konzentriert mit Tail**": IQR nur 1.25 (8/10 Runs in [2, 4]),
  aber ein Ausreißer bei 17 zieht σ und Mittel hoch. Median = 3, gegenüber
  Mittel = 4.4. Die typische v4-Performance ist *deutlich besser* als der
  Mittelwert suggeriert — aber 1 in 10 Runs entgleist.
- **v5 ist "**breit**": σ 4.59, IQR 7.75. v5-Runs sind generell
  unvorhersagbar in der Komplexität — der Shared-Context lässt
  pfadabhängig sehr unterschiedliche Implementationen entstehen.
- **v6 ist "**kompakt ohne Tail**": σ 2.30, alle 10 Runs in [1, 7],
  0 % Outlier-Rate. v6 erreicht v4-nahe Median-Performance (5.2 vs 4.4)
  ohne den 1/10-Refactor-Aussetzer von v4. Plausible Mechanik: der
  isolierte Refactor-Subagent wird in jedem TDD-Zyklus formal aufgerufen
  (siehe F-5.6, cycle σ=0.82) — der "Refactor-Phase übersprungen"-
  Failure-Mode aus v4 ist durch die Hybrid-Konstruktion strukturell
  ausgeschlossen.

Der **CV ist als alleiniges Stabilitätsmaß irreführend**: v4 hat CV 0.965
(höchste relative Streuung), obwohl 9/10 Runs in einem extrem engen
Bereich [2, 4] liegen — das kommt nur daher, dass μ klein ist und ein
Ausreißer die σ-Schätzung dominiert. IQR und Outlier-Rate erzählen die
korrekte Geschichte: v4 ist *im typischen Fall* der stabilste Workflow,
mit gelegentlichen Refactor-Aussetzern.

**Datenbasis**: 50 Runs. Outlier-Rate-Spalte mit n=10 sehr grob (ein
einzelner Ausreißer = 10 %).

**Mechanik des v4-Ausreißers** (manuell inspiziert): Der eine v4-Run mit
cognitive_max=17 enthält die gesamte Logik in einer einzigen 28-zeiligen
Arrow-Function — die Refactor-Phase hat den Code nicht in kleinere
Funktionen aufgeteilt. Korrektheit ist trotzdem 100 %. Das suggeriert
einen seltenen Fehlermodus, bei dem v4 in der Refactor-Subagent-Phase
keine Strukturverbesserung vornimmt.

---

## F-5.3 — Bei n=3 ist die volle Workflow-Rangordnung nur in ~25–60 % der Fälle korrekt; v4 als "Bester" ist robuster ✅ stabil

**Aussage**: Aus 1000 zufälligen Trials, in denen jeder Zelle ein
Dreier-Subsample entnommen und daraus die Workflow-Rangordnung berechnet
wird, ergibt sich folgende Trefferrate gegenüber der n=10-Wahrheits-
Rangordnung:

| Metrik | P(n=3-Ranking = n=10-Ranking) | n=10-Ranking |
|---|---:|---|
| `code_mass` | 15.9 % | v5 < v1 < v2 < v3 < v4 |
| `smell_total` | 25.2 % | v4 < v2 ≈ v5 < v1 < v3 |
| `cc_longest_function` | 23.6 % | v4 < v5 < v1 < v2 < v3 |
| `mccabe_max` | 62.5 % | v4 < v5 < v2 < v1 < v3 |
| `cognitive_max` | 50.5 % | v4 < v5 < v2 < v1 < v3 |

Zur Einordnung: bei 5! = 120 möglichen Rangordnungen wäre Zufall 0.83 %.
Alle Werte sind also weit über Zufall.

Dennoch: **die volle 5-Workflow-Ordnung lässt sich mit n=3 nicht
zuverlässig rekonstruieren**, insbesondere im mittleren Feld (v1, v2, v5
auf cognitive_max). Bei `cc_longest_function` und `smell_total` reicht
n=3 nur in ~25 % der Fälle.

Das heißt aber nicht, dass alle Aussagen aus n=3 wertlos sind:

- **Reproduzierbarkeits-Score** (Anteil der Dreier-Subsamples mit Mittel
  innerhalb ±20 % des n=10-Mittels): bei v1, v2, v3 ≥ 0.92 auf allen
  Outcomes. n=3 liefert hier robuste Mittelwert-Schätzungen.
- **v4 als Sieger auf cognitive_max** ist auch bei n=3-Subsamples
  zuverlässig erkennbar — v4 hat einen ~3× kleineren typischen Wert als
  jeder andere Workflow.
- **v3 als Schlusslicht auf cognitive_max** ebenso robust (v3 mean 21.8,
  σ 3.43; kein anderer Workflow erreicht diese Werte).

Die Schwäche von n=3 liegt im **mittleren Feld** — v1 vs v2 vs v5
unterscheiden sich bei cognitive_max um ~2–5 Punkte bei σ ~3.4, das ist
mit n=3 nicht trennscharf.

**Konsequenz für die Lab-Methodologie**:
- Aussagen wie "v4 ist deutlich besser als alles andere" oder "v3 ist
  schlechter als non-TDD": **n=3 reicht** (große Effektstärke + tiefe
  IQRs der nicht-v4-Workflows).
- Aussagen wie "Workflow A ist marginal besser als Workflow B" (z.B.
  v2 vs v5): **n=10+ erforderlich**, sonst Rangordnung instabil.

---

## F-5.4 — Korrektheit bleibt bei n=10 modell-/workflow-unabhängig 100 % ✅ stabil

**Aussage**: Über alle 60 Runs (inklusive der 10 neuen v6-hybrid-Runs)
erreicht jeder Workflow `tests_passing = 100 %` und `verification_pct = 1.00`.
Die in RQ-4 F-4.4 dokumentierte Korrektheits-Stabilität unter API-Vertrag
wird durch das größere n bestätigt: keine versteckten Outlier-Failures, die
in n=3 unentdeckt geblieben wären.

**Datenbasis**: 60 Runs (6 Workflows × n=10), je 15 Verifikations-Szenarien.

---

## F-5.5 — Token-Verbrauch zeigt extrem hohe Streuung bei v4 und v5 ⚠️ bedingt

**Aussage**: Token-Verbrauch (n=10):

| Workflow | μ | σ | CV |
|---|---:|---:|---:|
| v3-basic-tdd | 799 074 | 187 141 | 0.234 |
| v1-oneshot | 993 521 | 223 585 | 0.225 |
| v2-iterative | 966 999 | 175 027 | 0.181 |
| v4-exact-subagents | 2 561 890 | 382 603 | 0.149 |
| v5-exact-single-context | 8 355 280 | 2 889 180 | 0.346 |

**v5 ist sowohl absolut am teuersten als auch relativ am instabilsten**:
einzelne v5-Runs schwanken zwischen 4.6 M und 11.7 M Tokens. v4 hat
relative Stabilität (CV 0.15), aber **wallclock-σ** ist mit 984 s sehr
hoch (Max-Run = 3923 s ≈ 65 min vs. typischen ~14 min) — ein einzelner
v4-Run brauchte fast 5× so lange wie der Median.

**Konsequenz für Cost-Planung**: v5-Token-Budgets müssen großzügig
ausgelegt werden (worst-case ~12 M); v4-Wallclock-Budgets ebenfalls
großzügig (worst-case ~65 min). Bei kommerzieller Nutzung beider
Workflows sind diese Tails einzukalkulieren.

**Bedingung**: ⚠️ bedingt — n=10 ist zur Tail-Charakterisierung knapp;
für robuste Tail-Quantile (P99, P95) wäre n=30+ nötig.

---

## F-5.6 — TDD-Disziplin bildet workflow-charakteristische Banden ✅ stabil

**Aussage**: Die vier TDD-Disziplin-Indikatoren (`cycle_count`,
`refactorings_applied`, `predictions_correct_rate`, `tests_passed_immediately`)
trennen die sechs Workflows in **vier Disziplin-Klassen**:

| Workflow | `cycle_count` μ±σ | `refactorings_applied` μ±σ | `predictions_correct_rate` | `tests_passed_immediately` μ±σ | Disziplin-Klasse |
|---|---:|---:|---:|---:|---|
| v1-oneshot | 1.0 ± 0 | 0.0 ± 0 | — | 1.0 ± 0 | **strukturell-leer** |
| v2-iterative | 1.0 ± 0 | 0.0 ± 0 | — | 1.0 ± 0 | **strukturell-leer** |
| v3-basic-tdd | 1.5 ± 0.97 | 0.1 ± 0.32 | — | 0.5 ± 0.97 | **Phantom-TDD** |
| v5-exact-single-context | 6.7 ± **2.67** | 6.0 ± **3.09** | 100.0 % | 0.9 ± 1.66 | **breitbandige Disziplin** |
| v4-exact-subagents | 7.8 ± 0.92 | 5.9 ± 2.02 | 98.0 % | 3.3 ± 2.87 | **enge Bänder, strenge Disziplin** |
| v6-hybrid | **8.3 ± 0.82** | 4.0 ± 1.63 | 99.4 % | 3.3 ± 3.02 | **engste Bänder, strengste Disziplin** |

**Rationale**: Die vier Klassen sind über drei Indikatoren konsistent
definiert:

- **v1/v2 (strukturell-leer)**: keine Zyklen, keine Refactorings, keine
  Predictions — strukturell ohne TDD-Disziplin (Workflow-Definition).
  `tests_passed_immediately = 1` ist Artefakt des Metriken-Codes:
  die nachträgliche Tests-after-Implementation laufen alle zugleich grün
  durch.

- **v3 (Phantom-TDD)**: trotz formaler TDD-Aufforderung im Workflow keine
  echten Zyklen (μ=1.5 — typischerweise ein einziger Mega-Zyklus),
  praktisch keine Refactorings (μ=0.1), kein konsistentes Prediction-Format
  (`predictions_total = 0` über alle 10 Runs, deshalb aus der Rate-Spalte
  ausgenommen). Repliziert das F-1.10-Muster aus dem Archiv (`rqs-v1`):
  v3 erfüllt TDD nur nominell.

- **v4 / v6 (enge Bänder, strenge Disziplin)**: cycle σ < 1.0,
  refactorings σ ≈ 1.6–2.0, predictions ≥ 98 %. v6 hat sogar das engste
  cycle-Band überhaupt (σ=0.82), erzwungen durch die Hybrid-Konstruktion:
  jeder Zyklus muss vom Refactor-Subagent formal abgeschlossen werden,
  bevor die nächste Red-Phase im Main-Context startet.

- **v5 (breitbandige Disziplin)**: gleich hohe Mittelwerte wie v4 in
  Zyklen und Refactorings, aber **3–4× breitere Streuung**
  (refactorings σ=3.09 vs v4-σ=2.02). Der geteilte Single-Context erlaubt
  unterschiedliche Pfad-Realisierungen — ein Run kann 0 Refactorings
  haben, ein anderer 8. Auf der langen CLI-Kata claim-office kollabiert
  diese Streuung in einen klaren Disziplin-Verlust (RQ-7 F-7.4):
  v5 fällt dort auf 3.4 Zyklen, während v4 und v6 bei 25–37 bleiben.

`tests_passed_immediately` (Indikator für Over-Implementation): v4 und v6
haben den höchsten Mittelwert (3.3). Plausibel: in beiden Workflows wird
die Test-Liste vorab vollständig angelegt, anschließend wird der erste
echte Test grün gemacht — dabei werden mehrere `it.todo`-Tests durch die
minimale Green-Implementierung mit-erfüllt. Das ist kein Disziplin-Bruch
im engeren Sinn, sondern strukturelle Folge der Test-First-Phase.

**Datenbasis**: 60 Runs (6 Workflows × n=10), `opus-4-7-no-thinking`,
`game-of-life-example-mapping` und `game-of-life-prose` (für v1/v2). Bei
v3 fällt `predictions_correct_rate` aus, weil v3 das Prediction-Format
nicht konsequent emittiert.

**Konsequenz für die Workflow-Auswahl**: Die Disziplin-Bänder sind
*orthogonal* zur Code-Qualität — v5 erreicht hohe Disziplin-Mittel mit
breiter Streuung, v6 erreicht ähnliche Mittel mit engster Streuung. Wenn
*Reproduzierbarkeit der Disziplin-Indikatoren* selbst ein Workflow-Ziel ist
(z.B. für audit-fähige Entwicklungs-Logs), ist v6 die robusteste Wahl.

---

## F-5.7 — Test-Stärke (`mutation_score`) hat eigenes Stabilitätsprofil; v6-hybrid ist stabilster Workflow, v4 instabilster ✅ stabil

**Aussage**: Mutation-Score (Anteil gekillter Mutanten, Stryker) zeigt eine
**andere** Stabilitätsrangfolge als die Code-Komplexitäts-Metriken aus
F-5.1/F-5.2. Auf game-of-life (n=10 pro Workflow):

| Workflow | `mutation_score` mean | std | min | max |
|---|---:|---:|---:|---:|
| **v6-hybrid** | **0.953** | **0.005** | 0.940 | 0.957 |
| v2-iterative | 0.954 | 0.006 | 0.939 | 0.960 |
| v1-oneshot | 0.953 | 0.009 | 0.933 | 0.962 |
| v3-basic-tdd | 0.949 | 0.009 | 0.938 | 0.962 |
| v5-exact-single-context | 0.945 | 0.036 | 0.843 | 0.965 |
| **v4-exact-subagents** | 0.908 | **0.080** | **0.735** | 0.957 |

**Auffälligkeiten:**

- **v6-hybrid** liefert die niedrigste Streuung (σ=0.005) UND zugleich den
  höchsten Mean (gleichauf mit v1/v2). In Komplexitäts-Metriken war v4
  dominant; in Test-Stärke ist v6 dominant. Die Hybrid-Architektur
  (Skill-basierte Red/Green + isolierter Refactor) scheint die Test-Stärke-
  Streuung von v4 zu eliminieren ohne die Test-Stärke selbst zu verlieren.
- **v4** zeigt erneut sein in F-5.2 dokumentiertes Tail-Risiko: σ=0.080,
  min 0.735 — mehrere v4-Runs liegen deutlich unterhalb des typischen
  v4-Werts. Die isolierte Green-Phase scheint gelegentlich schwache
  Test-Generalisierung zu erzeugen.
- **v5** hat ebenfalls erhöhte Streuung (σ=0.036, min 0.843) — single-context
  ist robuster als v4 in Test-Stärke, aber nicht so glatt wie v1/v2/v3/v6.
- v1/v2/v3 (non-TDD oder minimal-TDD) clustern bei mean ≈0.95, σ≈0.008 —
  trotz unterschiedlicher Workflow-Philosophie nicht unterscheidbar in
  Test-Stärke auf game-of-life.

**Konsequenz für H1 (n=3-Frage)**: Für `mutation_score` wäre n=3 bei v4
besonders unzuverlässig — drei Ziehungen aus einer Verteilung mit σ=0.080
und min 0.735 können je nach Glück ein völlig anderes v4-Bild liefern.
Bei v6 und v1/v2/v3 wäre n=3 dagegen ausreichend (σ < 0.01). Die
**Outlier-Asymmetrie aus F-5.2 wiederholt sich für Test-Stärke**: v4 hat
eine breite Schwanzverteilung, andere Workflows nicht.

**Datenbasis**: 60 Runs game-of-life, opus-4-7-no-thinking, EM für
v3/v4/v5/v6 bzw. prose für v1/v2. Stryker 8.6.0.

---

## Caveats

- **Single model**: Nur `opus-4-7-no-thinking`. Modell-Wechsel könnte das
  Stabilitäts-Bild verschieben — RQ-3 deutet auf höhere Sonnet-Streuung
  hin, aber nur bei n=3.
- **Single kata**: Nur Game of Life (Library-Form). Andere Katas
  (claim-office, mars-rover) könnten andere Stabilitäts-Profile zeigen,
  insbesondere wenn das Problem stärker variablen Lösungs-Raum hat.
- **Tail-Schätzung**: n=10 gibt grobe σ-Schätzungen mit breiten
  Konfidenzintervallen. Outlier-Raten von 10 % entsprechen jeweils einem
  einzelnen Run — die wahre Rate kann zwischen 0 und 30 % liegen.
- **Subsampling als Validitäts-Mass**: Die `P(n=3-Ranking = n=10-Ranking)`-
  Zahlen sind selbst aus 50 Runs abgeleitet — ein hypothetisches n=20
  könnte feinere Bedingungen für n=3-Zuverlässigkeit zeigen.
- **v4-Refactor-Aussetzer**: Der 1/10-Run mit cognitive=17 ist ein
  konkreter Verbesserungsanlass für den v4-Workflow (Refactor-Phase muss
  zuverlässiger ausgelöst werden). Ist nicht Teil dieser RQ, aber
  dokumentiert für künftige Workflow-Iterationen.
