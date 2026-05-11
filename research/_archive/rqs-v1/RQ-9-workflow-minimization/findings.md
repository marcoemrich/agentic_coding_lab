# RQ-9 — Findings

## F-9.1 — Workflow-Reduktion wirkt bei Single-Context (v5→v5.1) neutral, bei Subagents (v4→v4.1) nicht

Im Single-Context-Workflow hat eine −67 %-Reduktion (827 → ~270 Zeilen)
keinen messbaren Einfluss auf die Code-Qualität. Im Subagent-Workflow
verschlechtert eine −82 %-Reduktion (1454 → ~260 Zeilen) die
Spitzen-Komplexität erkennbar.

| Outcome | v4 | v4.1 | v5 | v5.1 |
|---|---|---|---|---|
| `code_mass` (Code-Mass APP) | 157.8 ± 38.6 | 175.5 ± 29.5 | 145.8 ± 19.4 | 162.8 ± 34.5 |
| `mccabe_max` | **7.5 ± 2.7** | 9.3 ± 4.0 | 10.3 ± 1.5 | 8.0 ± 3.5 |
| `cognitive_max` | **11.8 ± 5.5** | 14.0 ± 5.4 | 16.8 ± 0.5 | 12.0 ± 5.8 |
| `cc_longest_function` (Spitzen-Komplexität) | **16.8 ± 6.1** | **25.3 ± 2.2** | 22.8 ± 2.5 | 17.5 ± 7.1 |
| `smell_total` (Smell-Summe) | 3.8 ± 1.7 | 3.5 ± 1.3 | 4.5 ± 1.0 | 3.5 ± 0.6 |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

Der Subagent-Workflow reagiert empfindlicher auf die Reduktion, weil jeder
Subagent ohne vorherigen Kontext startet und stärker auf die expliziten
Anweisungen im Agent-Prompt angewiesen ist. Im Single-Context akkumuliert der
bisherige Gesprächsverlauf als impliziter Kontext — die entfernten
Anweisungs-Blöcke (Refactoring-Beispiele, APP-Tabelle, Failure-Mode-Listen)
waren dort redundant zum bereits sichtbaren Code.

---

## F-9.2 — TDD-Disziplin bleibt über alle vier Workflows erhalten

Die TDD-Struktur (Zyklen, Predictions, Refactorings) wird auch in den
minimierten Varianten korrekt durchlaufen.

| Outcome | v4 | v4.1 | v5 | v5.1 |
|---|---|---|---|---|
| `cycle_count` | 8.5 ± 1.0 | 9.3 ± 1.0 | 7.0 ± 1.2 | 8.5 ± 0.6 |
| `refactorings_applied` | 6.0 ± 2.6 | 7.5 ± 1.3 | 5.5 ± 2.1 | 5.8 ± 3.8 |
| `predictions_correct_rate` (pooled) | 100 % (72/72) | 100 % (82/82) | 96.4 % (54/56) | 100 % (68/68) |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

Die tragenden Elemente sind das Kern-Skript (`tdd-experiment-mode.md` mit der
Agent/Skill-Sequenz `test-list → red → green → refactor`) und die vier
parser-relevanten Marker (siehe `MARKERS.md`). Pep-Talks, Self-Check-Listen
und Wiederholungs-Blöcke sind für die TDD-Disziplin entbehrlich.

---

## F-9.3 — Subagent-Architektur (v4) produziert niedrigere Komplexität als Single-Context (v5/v5.1)

Bei gleichem Modell (`opus-4-6-portkey`) erzeugt der Subagent-Workflow (v4)
systematisch niedrigere Komplexitätswerte als die Single-Context-Varianten.

| Outcome | v4 | v5 | v5.1 |
|---|---|---|---|
| `code_mass` (Code-Mass APP) | 157.8 ± 38.6 | 145.8 ± 19.4 | 162.8 ± 34.5 |
| `mccabe_max` | **7.5 ± 2.7** | 10.3 ± 1.5 | 8.0 ± 3.5 |
| `cognitive_max` | **11.8 ± 5.5** | 16.8 ± 0.5 | 12.0 ± 5.8 |
| `cc_longest_function` (Spitzen-Komplexität) | **16.8 ± 6.1** | 22.8 ± 2.5 | 17.5 ± 7.1 |
| `smell_total` (Smell-Summe) | 3.8 ± 1.7 | 4.5 ± 1.0 | 3.5 ± 0.6 |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

Der Effekt war zuvor (aus RQ-1/2-Daten) nicht vom Modell-Effekt trennbar,
weil v4-Runs ausschließlich auf Opus 4.7 gelaufen waren. Durch die neuen
v4-Runs unter Opus 4.6 ist das Modell als Confounder kontrolliert: der
Qualitätsunterschied ist mindestens teilweise ein Workflow-Effekt.

Mögliche Erklärung: jeder Subagent startet mit kleinem Kontext und sieht nur
die aktuelle Phase — das begrenzt die Komplexität der generierten Lösung pro
Schritt. Im Single-Context akkumuliert der gesamte bisherige Code im Kontext,
was zu monolithischeren Lösungen führen kann.

Bemerkenswert: v5 hat eine extrem enge Varianz bei `cognitive_max`
(16.8 ± 0.5) — fast deterministische High-Complexity-Lösungen. v4 und v5.1
streuen stärker mit niedrigerem Mittelwert.

---

## F-9.4 — v4.1 ist der beste Kompromiss aus Qualität, Zeit und Tokens

| Outcome | v4 | v4.1 | v5 | v5.1 |
|---|---|---|---|---|
| `duration_seconds` | **1116 ± 192** | 656 ± 137 | 619 ± 155 | **498 ± 165** |
| `total_tokens` | 4.8M ± 0.9M | **3.7M ± 0.7M** | 11.8M ± 3.0M | 10.5M ± 3.1M |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

v4 braucht ~2× so lange wie v5/v5.1 (Subagent-Spawns kosten Latenz), aber
verbraucht weniger als die Hälfte der Tokens. v4.1 halbiert die
Wallclock-Zeit von v4 (1116s → 656s) und senkt die Tokens um 22 %
(4.8M → 3.7M) — bei leicht höherer, aber noch akzeptabler Komplexität
(`mccabe_max` 9.3 vs 7.5). v5.1 bleibt die schnellste Variante (498s),
braucht aber 3× so viele Tokens wie v4.1.

---

## F-9.5 — Subagent-Prompts brauchen mehr Kontext als Skill-Commands

Die asymmetrische Wirkung der Reduktion (v5→v5.1 neutral, v4→v4.1 nicht)
zeigt, dass die Architektur bestimmt, wie viel Prompt-Inhalt tragend ist.

- **Single-Context** (v5): der Agent sieht den gesamten bisherigen
  Gesprächsverlauf. Die Refactoring-Beispiele und Failure-Mode-Listen im
  Command-Text sind redundant zum bereits sichtbaren Code und Verlauf.
  Entfernen ist neutral.

- **Subagents** (v4): jeder Subagent startet ohne Vorkontext. Die
  Refactoring-Beispiele und die detaillierte Schritt-für-Schritt-Anleitung
  im Agent-Prompt sind die **einzige** Informationsquelle für das erwartete
  Verhalten. Entfernen erhöht die Funktionslänge messbar
  (`cc_longest_function` 16.8 → 25.3).

Konsequenz: bei zukünftigen Workflow-Reduktionen sollte der Schnitt
architektur-abhängig dosiert werden. Subagent-Prompts vertragen weniger
Kürzung als Single-Context-Commands.
