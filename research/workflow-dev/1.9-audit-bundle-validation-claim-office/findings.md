# RQ-audit-bundle-claim-office Findings

## Übersicht

Primär-Outcomes je Zelle (n=8 je Workflow, opus-4-7-portkey-no-thinking, claim-office-example-mapping). 🏆 = bester Wert pro Outcome; Outcomes, deren v6.3-Wert durch frühes Run-Abbruch verzerrt ist, bekommen keinen Pokal.

| Outcome (Richtung)                                          | v6.2-with-why-cleaned | v6.3-audit-bundle              |
|-------------------------------------------------------------|-----------------------|--------------------------------|
| Korrektheit (außen) (`verification_pct`, höher = besser)    | **0.96 ± 0.09** 🏆    | 0.35 ± 0.41 (bi-modal)         |
| `tests_passing` (Sanity)                                    | 100 %                 | 100 %                          |
| `completed_within_budget` (Sanity)                          | 100 %                 | 100 %                          |
| `cycle_count` (für claim-office höher = vollständiger)      | **37.4 ± 1.6** 🏆     | 11.3 ± 6.1                     |
| `tests_passed_immediately` (kleiner = besser)               | 15.1 ± 5.84           | **0.6 ± 1.41** 🏆 (aber Kontext) |
| `refactorings_applied` (Kontext-abhängig — folgt cycle_count) | 24.9 ± 6.90         | 12.0 ± 9.97                    |
| `predictions_correct_rate` (höher = besser, pooled)         | 97.2 %                | 94.9 %                         |
| Code-Mass (APP) (`code_mass`, hier irreführend)             | 878.5 ± 91.4          | 441.5 ± 335.6 (durch frühen Stopp) |
| Smell-Summe (`smell_total`, kleiner = besser)               | **0.38 ± 0.74**       | 0.50 ± 0.76                    |
| Spitzen-Komplexität (`cc_longest_function`)                 | 12.4 ± 1.41           | 13.1 ± 7.06                    |
| `total_tokens` (durch frühen Stopp niedriger, kein Win)     | 44.4 M ± 3.4          | 16.7 M ± 15.0                  |
| `duration_seconds` (durch frühen Stopp niedriger, kein Win) | 2530 ± 401            | 1059 ± 943                     |

---

## F-1.9.1 — Audit-Bundle bricht Korrektheit auf claim-office von 96 % auf 35 %

`verification_pct` fällt von 0.96 ± 0.09 (alle Runs ≥ 0.73) auf **0.35 ± 0.41** (bi-modale Verteilung, 6 von 8 Runs unter 0.30).

| workflow | mean | σ | min | max |
|---|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 0.96 | 0.09 | 0.73 | 1.00 |
| v6.3-audit-bundle     | 0.35 | 0.41 | 0.00 | 1.00 |

Der Bruch ist nicht von der Art "Implementation ist falsch", sondern "Implementation ist unvollständig": die internen `tests_passing` zeigen 100 %, der CLI baut (cli_built=true), aber der Agent erklärt sich mitten in der Kata fertig.

Damit ist H5 (Falsifizierer aus dem RQ-README) eingetreten: das Audit-Bundle ist auf claim-office nicht eigenständig wirksam. v6.3 bleibt GoL-spezifischer Code-Quality-Champion ohne claim-office-Default-Baseline-Status.

---

## F-1.9.2 — Bi-modale Vollständigkeit: 6 von 8 Runs stoppen vorzeitig

`cycle_count` fällt von 37.4 ± 1.6 (claim-office hat 41 Test-Schritte; v6.2 vollendet alle) auf **11.3 ± 6.1** mit extremer Streuung. `experiment-done.txt` fehlt in 6 von 8 v6.3-Runs.

| outcome | v6.2 | v6.3 |
|---|---:|---:|
| cycle_count mean | 37.4 | 11.3 |
| cycle_count σ | 1.6 | 6.1 |
| duration_seconds mean | 2530 (~42 min) | 1059 (~18 min) |
| duration_seconds σ | 401 | 943 |
| `experiment-done.txt` present | 0/8 (v6.2-Konvention) | 2/8 |

Die zwei v6.3-Runs mit `experiment-done.txt` erreichen `verification_pct = 1.0` (12 Cycles in 13 min und 25 Cycles in 56 min). Die sechs ohne erreichen 0.00–0.27 mit 7–14 Cycles und 8–19 min Wallclock — der Agent gibt mitten in der Test-Liste auf, ohne expliziten Done-Marker.

Pattern-Hypothese: das Audit-Bundle (Mandatory-Procedure-Preamble + Refactor-Drei-Pfad-Bar + Wrong-Predictions-Block) erzeugt mehr Per-Cycle-Aufwand auf der Multi-Iteration-Kata, und der Agent interpretiert die Pflicht zur disziplinierten Cycle-Vollendung als implizites Fertig-Signal nach wenigen vollständigen Cycles. Auf der kürzeren GoL-Kata (9 Tests) tritt das nicht zutage.

---

## F-1.9.3 — Mandatory-Preamble eliminiert vorzeitige Greens, aber Effekt-Größe irrelevant durch frühen Stopp

`tests_passed_immediately` fällt von 15.1 ± 5.84 auf **0.6 ± 1.41**. Pattern identisch zur RQ-1.8-Beobachtung auf GoL — die Preamble wirkt mechanisch wie erwartet.

Die Effekt-Größe ist hier aber kein Disziplin-Gewinn: in 6 von 8 v6.3-Runs durchläuft der Agent nur 7–14 Cycles. Vorzeitige Greens hätten dort gar keine Gelegenheit zu entstehen — weil der Agent gar nicht so weit kommt. Die Metrik misst die Preamble-Wirkung, nicht den Disziplin-Zugewinn.

Auf den zwei v6.3-Runs, die durchlaufen (cycle_count 12 und 25, ver=1.0), liegt `tests_passed_immediately` bei 0 und 4 — also auch dort niedriger als die v6.2-Baseline.

---

## F-1.9.4 — Code-Qualitäts-Metriken niedriger, aber durch Unvollständigkeit verzerrt

| outcome | v6.2 | v6.3 | Interpretation |
|---|---:|---:|---|
| Code-Mass (APP) (`code_mass`)               | 878.5 ± 91  | 441.5 ± 336 | v6.3 hat halb so viel Code, weil nur ~⅓ der Tests implementiert |
| `cognitive_max`                             | 5.0 ± 1.77  | 3.4 ± 2.07  | dito — weniger komplexe Funktionen, weil weniger Logik |
| `mccabe_max`                                | 4.5 ± 0.76  | 3.75 ± 1.67 | dito |
| Spitzen-Komplexität (`cc_longest_function`) | 12.4 ± 1.41 | 13.1 ± 7.06 | Mittel gleich; σ verfünffacht (bi-modal) |
| Smell-Summe (`smell_total`)                 | 0.38 ± 0.74 | 0.50 ± 0.76 | beide nahe 0, ununterscheidbar |

Die niedrigeren Komplexitäts-Werte sind kein Code-Qualitäts-Gewinn — sie spiegeln die unvollständige Implementation. Eine fairere Vergleichsbasis wäre die per-Cycle-Komplexität bei gleicher Anzahl implementierter Tests; das misst die Pipeline nicht direkt. Bis dahin sind alle Code-Qualitäts-Outcomes auf dieser Kata zwischen v6.2 und v6.3 nicht aussagekräftig vergleichbar.

---

## F-1.9.5 — Empfehlung: v6.3 nicht als Default-Baseline für claim-office promoten

- v6.2-with-why-cleaned bleibt Default-Baseline für korrektheits-kritische Arbeit auf claim-office × opus-4-7-portkey-no-thinking.
- v6.3-audit-bundle ist auf GoL ein klarer Disziplin- und Code-Qualitäts-Gewinn (RQ-1.8), kippt aber auf claim-office in einen bi-modalen Vollständigkeits-Bruch.
- Folge-Optionen, falls v6.3 reparierbar werden soll:
  - **Isolierte Sub-RQs** für die zwei Audit-Bundle-Klassen (Klasse 2 Rationales vs Klasse 3 Red-Hardening), um zu lokalisieren, welche Klasse das Stopp-Verhalten treibt.
  - **Done-Gate verschärfen**: `tdd-experiment-mode.md` könnte einen expliziten Test-List-Count-vs-aktive-Tests-Check vor `experiment-done.txt` verlangen (analog zum archivierten Audit-Finding 11d).
  - **Cross-Kata-RQ**: derselbe Audit-Bundle-Test auf `mars-rover` (mittelschwer, novel) zur Triangulation, ob das Kippen claim-office-spezifisch oder novel-kata-spezifisch ist.
