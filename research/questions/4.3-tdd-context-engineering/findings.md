# RQ-context Findings

Kata: `claim-office-example-mapping` (novel). Modell: `opus-4-7-no-thinking` (Portkey ODER Direct, OR-match). 3 Kontext-Architekturen mit derselben Test-Listen-Disziplin: v4.1 (alle 4 Phasen als isolierte Subagents), v5.1 (alle 4 Phasen als Skills im Shared-Context), v6.1 (Red/Green als Skill im Shared-Context, Refactor als isolierter Subagent). n=14 Runs.

## Übersicht — Code-Qualität, Korrektheit, Kosten

🏆 = bester Wert pro Spalte. Richtungen: `cognitive_max`/`mccabe_max`/`cc_longest_function`/`smell_total`/`code_mass`/`cc_loc`/`duration_seconds`/`total_tokens` kleiner = besser; `verification_pct` höher = besser.

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `code_mass` | `cc_loc` | `verification_pct` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v4.1 (alle isoliert)  | 5 | 26.8 ± 21.5 | 16.0 ± 8.0 | 40.8 ± 24.3 | 13.2 ± 6.7 | **621.6 ± 58.7** 🏆 | **156.8 ± 34.0** 🏆 | 0.96 ± 0.08 | 3 229 ± 823 | **14.10 M ± 2.68** 🏆 |
| v5.1 (alle geteilt)   | 6 | 14.8 ± 3.8  | 10.2 ± 2.4 | 32.7 ± 9.3  |  6.8 ± 6.9 | 692.7 ± 71.9 | 167.2 ± 25.5 | **1.00 ± 0** 🏆 | **641 ± 111** 🏆 | 18.73 M ± 4.89 |
| v6.1 (Hybrid: Red/Green geteilt, Refactor isoliert) | 3 | **4.3 ± 1.3** 🏆 | **5.0 ± 1.4** 🏆 | **16.7 ± 5.4** 🏆 | **1.3 ± 0.9** 🏆 | 920.7 ± 45.1 | 184.3 ± 4.0 | **1.00 ± 0** 🏆 | 1 424 ± 638 | 30.16 M ± 15.15 |

`tests_passing` und `completed_within_budget` sind in allen drei Zellen 100 %. `mutation_score` wurde für diese RQ nicht erhoben.

## F-context.1 — Refactor-Subagent allein liefert die Komplexitäts-Reduktion; volle Phasen-Isolation schadet

v6.1 erreicht in allen vier Spitzen-Metriken die besten Werte: `cognitive_max` 4.3 (vs. 14.8 bei v5.1 und 26.8 bei v4.1), `mccabe_max` 5.0 (vs. 10.2 vs. 16.0), `cc_longest_function` 16.7 (vs. 32.7 vs. 40.8), `smell_total` 1.3 (vs. 6.8 vs. 13.2). v4.1 — vollständige Phasen-Isolation — liegt in jeder dieser vier Metriken am schlechtesten, mit gleichzeitig der grössten Streuung (σ(cognitive_max) 21.5 vs. 3.8 vs. 1.3).

Die plausible Lesart: der Architektur-Vorteil entsteht ausschliesslich aus dem **isolierten Refactor-Subagent** (gemeinsames Element von v4.1 und v6.1). Wenn Red und Green zusätzlich isoliert laufen (v4.1), schadet das auf claim-office — die isolierten Subagents müssen die Gesamt-Architektur ohne Kontext immer wieder neu konstruieren und akkumulieren strukturelle Komplexität über die 44.6 Cycles (F-context.4), die keine einzelne Phase als Ganzes sieht.

**H1 bestätigt** in der Hybrid-Lesart (Refactor-Isolation senkt Komplexität), aber **die paarweise Hypothese „v4.1 < v5.1 auf Komplexität" wird falsifiziert** — v4.1 liegt auf claim-office sogar schlechter als v5.1 in allen vier Spitzen-Metriken.

**H4 (Stabilität)**: v6.1 hat die kleinste Streuung in allen Komplexitäts-Spitzen (σ um Faktor 3–17 kleiner als v4.1). v5.1 ist zweitstabilster, v4.1 mit Abstand am unstabilsten. Die ursprüngliche Erwartung (v4.1 am stabilsten) wird klar **falsifiziert**.

## F-context.2 — Mehr Code, weniger Smells: v6.1 produziert die umfangreichste, aber strukturell sauberste Lösung

`code_mass` und `cc_loc` ordnen sich umgekehrt zu den Komplexitäts-Metriken: v4.1 schreibt am wenigsten Code (621.6 LOC), v6.1 am meisten (920.7 LOC, +48 % gegenüber v4.1). Trotzdem hat v6.1 90 % weniger Smells (1.3 vs. 13.2). Lesart: v4.1 schreibt dichten, schwer-strukturierten Code; v6.1 verteilt dieselbe Funktionalität auf mehr, kleinere Bausteine.

Der Befund ist mit der Refactor-Subagent-Mechanik konsistent: ein frischer Refactor-Kontext, der die akkumulierte Implementation als Ganzes sieht (Red/Green-History aus dem Single-Context plus Code-Stand), kann gezielt extrahieren und aufteilen — was zwar mehr Code-Zeilen, aber bessere Strukturierung erzeugt. v4.1's isolierter Refactor sieht nur den jeweils aktuellen Code-Stand ohne den Entstehungs-Kontext und neigt zu lokalem Aufräumen statt strukturellem Umbau.

## F-context.3 — Korrektheit unterscheidet die Architekturen nicht

v5.1 und v6.1 erreichen 1.00 verification_pct (15/15 in jedem Run, σ=0). v4.1 erreicht 0.96 mit einem Ausreißer bei 0.8 (12/15). Klassifikatorisch sind alle drei hoch-korrekt; v4.1 trägt eine einzige Korrektheits-Lücke, vermutlich in derselben Zelle, die auch die Komplexitäts-Ausreißer trägt (im `runs.csv` verifizierbar).

**H2 bestätigt**: der Kontext-Architektur-Effekt zeigt sich in Code-Qualität und Kosten, nicht in der Aussen-Korrektheit. Der Test-List-Scope-Fix dominiert über die Architektur.

## F-context.4 — Drei sehr unterschiedliche Kosten-Profile

| Metrik (kleiner = besser) | v4.1 | v5.1 | v6.1 |
|---|---:|---:|---:|
| `duration_seconds` (mean) | 3 229 (~54 min) | **641 (~11 min)** 🏆 | 1 424 (~24 min) |
| `total_tokens` (mean)     | **14.10 M** 🏆 | 18.73 M | 30.16 M |
| `cycle_count` (mean)      | 44.6 | 5.5 | 24.7 |

v5.1 ist 5× schneller als v4.1 und 2.2× schneller als v6.1 — der Single-Context ohne Subagent-Spawns dominiert die Wallclock-Wertung. v4.1 verbraucht die wenigsten Tokens — isolierte Subagent-Kontexte wachsen linear, der v5.1-Single-Context kumuliert, und v6.1 kombiniert kumulierten Single-Context mit zusätzlichem Refactor-Subagent → höchster Token-Verbrauch.

Die `cycle_count`-Spreizung zeigt drei qualitativ verschiedene Arbeitsmodi: v5.1 mit nur 5.5 Cycles und 1.67 sofort-grünen Tests arbeitet in groben Schritten; v4.1 mit 44.6 Cycles und 22.2 sofort-grünen Tests zerlegt sehr fein und produziert oft Pre-Implementation in Red; v6.1 liegt mit 24.7 Cycles und 13.0 sofort-grünen Tests dazwischen, mit der mit Abstand höchsten Refactor-Rate (10.7 pro Run vs. 6.8 bei v4.1 und 2.2 bei v5.1) — der isolierte Refactor-Subagent „arbeitet" sichtbar mehr.

**H3 (v4.1 < v5.1 < v6.1 Tokens)** bestätigt, mit grossem Abstand zwischen den drei Stufen.

**H5 (v5.1 deutlich schneller als v4.1)** bestätigt — v4.1 ≈ 5× v5.1 in Wallclock. v6.1 zahlt den Refactor-Spawn-Overhead nur einmal pro Cycle (statt 4× pro Cycle bei v4.1) und liegt entsprechend zwischen den beiden Polen.

## F-context.5 — Hybrid-Position dominiert auf Code-Qualität, ist aber kein Pareto-Sieger

Über alle Outcomes hinweg liegt v6.1 auf der Code-Qualitäts-Dimension klar vorn (alle 4 Spitzen-Metriken 🏆), zahlt dafür mit 2.1× v5.1's Token-Kosten und 2.2× v5.1's Wallclock — und schreibt 33 % mehr Code. Es gibt keinen einzigen Workflow, der alle Dimensionen gewinnt: v4.1 dominiert auf Code-Kompaktheit und Token-Effizienz, v5.1 auf Wallclock und Korrektheit (knapp), v6.1 auf Code-Qualitäts-Spitzen und Smell-Dichte.

Für ein Anwendungsprofil, in dem strukturelle Code-Qualität wichtiger ist als Wallclock und Token-Kosten, ist v6.1 die klare Wahl. Wenn Geschwindigkeit dominiert, gewinnt v5.1 (mit nahezu denselben Komplexitäts-Werten wie v6.1 auf game-of-life, siehe RQ-tdd-quality). v4.1 hat unter dieser claim-office-Evidenz keinen klaren Use-Case — niedrigster Code-Umfang, aber alle Qualitäts-Spitzen die schlechtesten und die höchste Streuung.

## Cross-RQ-Bezug

Die Befunde dieser RQ präzisieren den Context-Engineering-Effekt auf claim-office gegenüber dem Befund auf game-of-life in [RQ-tdd-quality F-tdd-quality.3](../4.1-tdd-effect-code-quality/findings.md):

- Auf game-of-life (RQ-tdd-quality, 2-Punkt-Vergleich): v4.1 hatte die niedrigsten Komplexitäts-Spitzen, v5.1 verlor diesen Vorteil. v6.1 dort ebenfalls niedrige Spitzen (cognitive_max 7.7).
- Auf claim-office (diese RQ, 3-Punkt-Vergleich): v6.1 dominiert, v5.1 zweitbester, v4.1 verliert deutlich.

Auf der einfacheren, trainingsbekannten Kata genügt die vollständige Phasen-Isolation; auf der komplexeren, novel Kata wird die Phasen-Isolation kontraproduktiv und nur die Refactor-Isolation trägt zur Strukturqualität bei. Cross-Kata-Replikation auf einer dritten Kata (z.B. mars-rover) bleibt offen, um zwischen den beiden Lesarten ("Kata-Komplexität" vs. "Kata-Vertrautheit") zu trennen.
