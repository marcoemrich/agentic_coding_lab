# RQ-context Findings

Kata: `claim-office-example-mapping` (novel). Modell: `opus-4-7-no-thinking` (Portkey ODER Direct, OR-match). 4 Kontext-Architekturen mit derselben Test-Listen-Disziplin: v4.1 (alle 4 Phasen als isolierte Subagents), v5.1 (alle 4 Phasen als Skills im Shared-Context), v6.1 (Red/Green Skill, Refactor isoliert), v7.1 (Test-Liste/Red Skill, Green und Refactor isoliert). n=17 Runs.

## Übersicht — Code-Qualität, Korrektheit, Kosten

🏆 = bester Wert pro Spalte. Richtungen: `cognitive_max`/`mccabe_max`/`cc_longest_function`/`smell_total`/`code_mass`/`cc_loc`/`duration_seconds`/`total_tokens` kleiner = besser; `verification_pct` höher = besser. Bei Spreads kleiner 1 σ wird 🏆 auf alle nahen Werte verteilt.

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `code_mass` | `cc_loc` | `verification_pct` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v4.1 (alle isoliert) | 5 | 26.8 ± 24.1 | 16.0 ± 9.0 | 40.8 ± 27.1 | 13.2 ± 7.5 | **621.6 ± 65.6** 🏆 | **156.8 ± 38.0** 🏆 | 0.96 ± 0.09 | 3 229 ± 920 | **14.10 M ± 2.99** 🏆 |
| v5.1 (alle geteilt) | 6 | 14.8 ± 4.2 | 10.2 ± 2.6 | 32.7 ± 10.2 | 6.8 ± 7.6 | 692.7 ± 78.8 | 167.2 ± 27.9 | **1.00 ± 0** 🏆 | **641 ± 122** 🏆 | 18.73 M ± 5.35 |
| v6.1 (Refactor isoliert) | 3 | **4.3 ± 1.5** 🏆 | **5.0 ± 1.7** 🏆 | **16.7 ± 6.7** 🏆 | **1.3 ± 1.2** 🏆 | 920.7 ± 55.2 | 184.3 ± 4.9 | **1.00 ± 0** 🏆 | 1 424 ± 781 | 30.16 M ± 18.56 |
| v7.1 (Green + Refactor isoliert) | 3 | **5.0 ± 1.0** 🏆 | **4.67 ± 0.58** 🏆 | **19.3 ± 2.5** 🏆 | **2.3 ± 2.3** 🏆 | 801 ± 3.6 | 187.3 ± 29.2 | 0.98 ± 0.04 | 1 970 ± 715 | 26.11 M ± 6.20 |

`tests_passing` und `completed_within_budget` sind in allen vier Zellen 100 %. `mutation_score` wurde für diese RQ nicht erhoben.

## F-context.1 — Refactor-Subagent liefert den Komplexitäts-Vorteil; zusätzliche Green-Isolation ändert das Bild nicht

v6.1 und v7.1 — beide mit isoliertem Refactor-Subagent, v7.1 zusätzlich mit isoliertem Green-Subagent — erreichen praktisch identische Komplexitäts-Spitzen: `cognitive_max` 4.3 / 5.0, `mccabe_max` 5.0 / 4.67, `cc_longest_function` 16.7 / 19.3, `smell_total` 1.3 / 2.3. Alle paarweisen Differenzen liegen innerhalb ihrer σ. v5.1 (alle Phasen geteilt) liegt deutlich darüber (cognitive_max 14.8, mccabe_max 10.2), v4.1 (alle isoliert) am schlechtesten und mit der größten Streuung (σ cognitive_max=24.1).

Die plausible Lesart wird durch v7.1 geschärft: der Architektur-Vorteil entsteht ausschließlich aus dem **isolierten Refactor-Subagent**, dem gemeinsamen Element von v6.1 und v7.1. Das zusätzliche Isolieren der Green-Phase (v7.1) bringt keinen zusätzlichen Komplexitäts-Hub. Wenn alle vier Phasen isoliert laufen (v4.1), schadet das auf claim-office — die isolierten Subagents müssen die Gesamt-Architektur ohne Kontext immer wieder neu konstruieren und akkumulieren strukturelle Komplexität über die 44.6 Cycles (F-context.4), die keine einzelne Phase als Ganzes sieht.

**H1 bestätigt** in der Hybrid-Lesart (Refactor-Isolation senkt Komplexität), aber **die paarweise Hypothese „v4.1 < v5.1 auf Komplexität" wird falsifiziert** — v4.1 liegt auf claim-office sogar schlechter als v5.1 in allen vier Spitzen-Metriken.

**H4 (Stabilität)**: v7.1 ist die stabilste Zelle (σ code_mass=3.6, σ mccabe_max=0.58, σ cognitive_max=1.0). v6.1 zweitstabilster auf den Komplexitäts-Spitzen, v4.1 mit Abstand am unstabilsten. Die ursprüngliche Erwartung (v4.1 am stabilsten) wird klar **falsifiziert**.

## F-context.2 — Refactor-Subagent verteilt Funktionalität auf mehr Bausteine; Green-Isolation bremst den Mehr-Code-Effekt

v4.1 schreibt am wenigsten Code (621.6 LOC), v6.1 am meisten (920.7 LOC, +48 % gegenüber v4.1). v7.1 liegt mit 801 LOC zwischen v5.1 (692.7) und v6.1 — der isolierte Green-Subagent hält den Code-Umfang gegenüber v6.1 niedriger, vermutlich weil ihm die akkumulierte Test-Listen-Diskussion fehlt, die in v6.1 zusätzliche Helper-Strukturen motiviert.

Trotz der Code-Mengen-Unterschiede haben v6.1 und v7.1 ähnlich wenige Smells (1.3 / 2.3) — die strukturelle Sauberkeit kommt aus dem Refactor-Subagent, nicht aus dem Code-Volumen. v4.1 mit 13.2 Smells in 621.6 LOC ist dicht und schwer-strukturiert; v6.1 mit 1.3 Smells in 920.7 LOC ist verteilt und sauber.

Der Befund ist mit der Refactor-Subagent-Mechanik konsistent: ein frischer Refactor-Kontext, der die akkumulierte Implementation als Ganzes sieht (Code-Stand plus optional Red/Green-History bei v6.1), kann gezielt extrahieren und aufteilen. v4.1's isolierter Refactor sieht nur den jeweils aktuellen Code-Stand ohne den Entstehungs-Kontext und neigt zu lokalem Aufräumen statt strukturellem Umbau.

## F-context.3 — Korrektheit unterscheidet die Architekturen nicht

v5.1 und v6.1 erreichen 1.00 verification_pct (15/15 in jedem Run, σ=0). v4.1 erreicht 0.96 mit einem Ausreißer bei 0.8 (12/15), v7.1 erreicht 0.98 mit einem Run bei 14/15. Alle vier Architekturen sind hoch-korrekt; auffällig ist, dass die zwei Architekturen mit Green als isoliertem Schritt (v4.1, v7.1) je einen Ausreißer tragen, die zwei Architekturen mit Green im Shared-Context (v5.1, v6.1) perfekt sind.

**H2 bestätigt**: der Kontext-Architektur-Effekt zeigt sich in Code-Qualität und Kosten, nicht substantiell in der Aussen-Korrektheit. Der Test-List-Scope-Fix dominiert über die Architektur.

## F-context.4 — Vier sehr unterschiedliche Kosten-Profile

| Metrik (kleiner = besser, außer wo markiert) | v4.1 | v5.1 | v6.1 | v7.1 |
|---|---:|---:|---:|---:|
| `duration_seconds` (mean) | 3 229 (~54 min) | **641 (~11 min)** 🏆 | 1 424 (~24 min) | 1 970 (~33 min) |
| `total_tokens` (mean)     | **14.10 M** 🏆 | 18.73 M | 30.16 M | 26.11 M |
| `cycle_count` (mean)      | 44.6 | 5.5 | 24.7 | 18.3 |
| `refactorings_applied`    | 6.8 | 2.2 | 10.7 | 14.0 |

v5.1 ist 5× schneller als v4.1 und 3× schneller als v7.1 — der Single-Context ohne Subagent-Spawns dominiert die Wallclock-Wertung. v4.1 verbraucht die wenigsten Tokens — isolierte Subagent-Kontexte wachsen linear, der v5.1-Single-Context kumuliert, und v6.1 kombiniert kumulierten Single-Context mit zusätzlichem Refactor-Subagent → höchster Token-Verbrauch. v7.1 (zwei Subagent-Phasen) ist überraschend **günstiger** als v6.1 (eine Subagent-Phase) — vermutlich, weil der Green-Subagent ohne kumulierten Single-Context kürzer und fokussierter arbeitet als Green-im-Shared-Context und damit den späteren Refactor entlastet.

Die `cycle_count`-Spreizung zeigt vier qualitativ verschiedene Arbeitsmodi: v5.1 mit nur 5.5 Cycles und 1.7 sofort-grünen Tests arbeitet in groben Schritten; v4.1 mit 44.6 Cycles und 22.2 sofort-grünen Tests zerlegt sehr fein und produziert oft Pre-Implementation in Red; v6.1 (24.7 Cycles) und v7.1 (18.3 Cycles) liegen dazwischen, mit der höchsten Refactor-Rate aller Workflows (v7.1 14.0/Run, v6.1 10.7/Run vs. v4.1 6.8 und v5.1 2.2) — die isolierten Refactor-Subagents „arbeiten" sichtbar mehr.

**H3 (v4.1 < v5.1 < v6.1 Tokens) für die ersten drei Zellen bestätigt**, aber **H3 für v7.1 falsifiziert**: v7.1 (26.1 M) liegt unter v6.1 (30.2 M), nicht darüber.

**H5 (Wallclock-Ordnung v5.1 < Hybride < v4.1) bestätigt** — v7.1 (1 970s) zwischen v6.1 (1 424s) und v4.1 (3 229s), näher an v6.1 als an v4.1.

## F-context.5 — Zwei Hybrid-Positionen mit ähnlicher Code-Qualität, unterschiedlichem Kosten-Profil

Auf der Code-Qualitäts-Dimension liegen v6.1 und v7.1 praktisch gleichauf (alle 4 Spitzen-Metriken innerhalb 1 σ; je 4 🏆 in der Übersicht). v6.1 ist minimal sauberer in `smell_total` und `cognitive_max`; v7.1 hat dafür **niedrigeren Code-Umfang** (801 vs. 921 LOC), **niedrigeren Token-Verbrauch** (26 vs. 30 M) und die **kleinste Streuung** über alle Metriken. Wallclock umgekehrt: v6.1 ~24 min, v7.1 ~33 min.

Es gibt keinen Pareto-Sieger: v4.1 dominiert auf Code-Kompaktheit und Token-Effizienz, v5.1 auf Wallclock und (knapp) Korrektheit, v6.1/v7.1 auf Code-Qualitäts-Spitzen. Für ein Anwendungsprofil mit Fokus auf strukturelle Code-Qualität bei moderaten Kosten ist v7.1 die effizientere Hybrid-Variante; v6.1 die minimal sauberere Wahl mit höheren Tokens. v4.1 hat unter dieser claim-office-Evidenz keinen klaren Use-Case — niedrigster Code-Umfang, aber alle Qualitäts-Spitzen die schlechtesten und die höchste Streuung.

## Cross-RQ-Bezug

Die Befunde dieser RQ präzisieren den Context-Engineering-Effekt auf claim-office gegenüber dem Befund auf game-of-life in [RQ-tdd-quality F-tdd-quality.3](../4.1-tdd-effect-code-quality/findings.md):

- Auf game-of-life (RQ-tdd-quality, 2-Punkt-Vergleich): v4.1 hatte die niedrigsten Komplexitäts-Spitzen, v5.1 verlor diesen Vorteil. v6.1 dort ebenfalls niedrige Spitzen (cognitive_max 7.7).
- Auf claim-office (diese RQ, 4-Punkt-Vergleich): v6.1 und v7.1 dominieren gleichauf, v5.1 zweitbester, v4.1 verliert deutlich.

Auf der einfacheren, trainingsbekannten Kata genügt die vollständige Phasen-Isolation; auf der komplexeren, novel Kata wird die Phasen-Isolation kontraproduktiv und nur die Refactor-Isolation trägt zur Strukturqualität bei. Cross-Kata-Replikation auf einer dritten Kata (z.B. mars-rover) bleibt offen, um zwischen den beiden Lesarten ("Kata-Komplexität" vs. "Kata-Vertrautheit") zu trennen.
