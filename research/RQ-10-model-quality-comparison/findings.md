# RQ-10 — Findings

## F-10.1 — Opus 4.7 produziert niedrigere Komplexität als Opus 4.6

Unter beiden Workflows (v4, v5) erzeugt Opus 4.7 systematisch niedrigere
Komplexitätswerte als Opus 4.6.

| Outcome | v4 × 4.7 | v4 × 4.6 | v5 × 4.7 | v5 × 4.6 |
|---|---|---|---|---|
| `mccabe_max` | **4.3 ± 1.0** | 7.5 ± 2.7 | **8.0 ± 2.2** | 10.3 ± 1.5 |
| `cognitive_max` | **4.8 ± 2.1** | 11.8 ± 5.5 | **11.8 ± 4.1** | 16.8 ± 0.5 |
| `smell_total` (Smell-Summe) | **2.0 ± 0.0** | 3.8 ± 1.7 | **3.5 ± 0.6** | 4.5 ± 1.0 |
| `cc_longest_function` (Spitzen-Komplexität) | 14.3 ± 6.7 | 16.8 ± 6.1 | **10.3 ± 10.9** | 22.8 ± 2.5 |

n = 4 pro Zelle (thinking-Varianten), Kata `game-of-life-example-mapping`.

Der Modell-Effekt ist unter v4-Subagents stärker ausgeprägt als unter
v5-Single-Context: `cognitive_max` Faktor 2.5× bei v4 (4.8 → 11.8) vs.
Faktor 1.4× bei v5 (11.8 → 16.8). Subagents verstärken den
Qualitätsvorteil des besseren Modells, weil jeder Einzelschritt stärker
vom Modell abhängt.

---

## F-10.2 — Thinking hat keinen konsistenten Einfluss auf Code-Qualität

Der Unterschied zwischen Thinking- und No-Thinking-Varianten ist gering
und nicht in eine konsistente Richtung.

| Outcome | 4.7 think | 4.7 no-think | 4.6 think | 4.6 no-think |
|---|---|---|---|---|
| `mccabe_max` (v4) | 4.3 | 5.3 | 7.5 | **5.8** |
| `cognitive_max` (v4) | **4.8** | 5.3 | 11.8 | **7.8** |
| `smell_total` (v4) | **2.0** | 2.5 | 3.8 | **3.0** |
| `mccabe_max` (v5) | **8.0** | 6.3 | 10.3 | 11.0 |
| `cognitive_max` (v5) | 11.8 | **10.2** | 16.8 | 17.0 |

n = 4 pro Zelle, Kata `game-of-life-example-mapping`.

Bei Opus 4.6 ist no-thinking unter v4 sogar **besser** als thinking
(`cognitive_max` 7.8 vs 11.8). Bei Opus 4.7 ist der Unterschied marginal
(4.8 vs 5.3). Thinking scheint für Code-Qualität bei game-of-life nicht
entscheidend — die Aufgabe ist vermutlich nicht komplex genug, um von
der erweiterten Denkzeit zu profitieren.

---

## F-10.3 — Workflow-Effekt und Modell-Effekt sind additiv

Beide Faktoren wirken unabhängig und kumulieren: die beste Kombination
ist v4 × Opus 4.7 (`cognitive_max` 4.8), die schlechteste ist
v5 × Opus 4.6 (`cognitive_max` 16.8).

| Kombination | `cognitive_max` | `mccabe_max` | `smell_total` |
|---|---|---|---|
| v4 × Opus 4.7 | **4.8** | **4.3** | **2.0** |
| v4 × Opus 4.6 | 11.8 | 7.5 | 3.8 |
| v5 × Opus 4.7 | 11.8 | 8.0 | 3.5 |
| v5 × Opus 4.6 | **16.8** | **10.3** | **4.5** |

Thinking-Varianten; n = 4 pro Zelle, Kata `game-of-life-example-mapping`.

Die Code-Mass (APP) zeigt dagegen keinen systematischen Unterschied
(146–176 über alle Zellen) — die "Menge" Code ist ähnlich, aber die
besseren Kombinationen verteilen sie auf mehr, kürzere, weniger
komplexe Funktionen.

---

## F-10.4 — v5 × Opus 4.6 produziert deterministisch hohe Komplexität

v5 × Opus 4.6 (beide Thinking-Varianten) zeigt eine extrem enge Varianz
bei `cognitive_max`:

| Zelle | `cognitive_max` (mean ± std) |
|---|---|
| v5 × opus-4-6-portkey | 16.8 ± 0.5 |
| v5 × opus-4-6-portkey-no-thinking | **17.0 ± 0.0** |

4 von 4 Runs bei no-thinking landen auf exakt `cognitive_max = 17`.
Das deutet auf ein **deterministisches Lösungsmuster** hin: Opus 4.6
im Single-Context konvergiert auf eine monolithische `nextGeneration`-Funktion
mit verschachtelten Schleifen. Die Kombination aus größerem Kontext
(Single-Context) und schwächerem Modell (4.6) eliminiert die
Lösungsvielfalt.

---

## F-10.5 — Subagents verbrauchen weniger Tokens, brauchen aber mehr Wallclock-Zeit

| Workflow × Modell | `duration_seconds` | `total_tokens` |
|---|---|---|
| v4 × 4.7 | **1322 ± 93** | **3.7M ± 0.3M** |
| v4 × 4.7-nt | 1087 ± 326 | **3.1M ± 0.5M** |
| v4 × 4.6 | 1116 ± 192 | 4.8M ± 0.9M |
| v4 × 4.6-nt | 866 ± 151 | 4.3M ± 0.6M |
| v5 × 4.7 | 475 ± 92 | 11.3M ± 2.4M |
| v5 × 4.7-nt | **350 ± 17** | 8.8M ± 1.1M |
| v5 × 4.6 | 619 ± 155 | 11.8M ± 3.0M |
| v5 × 4.6-nt | 570 ± 65 | 10.0M ± 1.1M |

n = 4 pro Zelle, Kata `game-of-life-example-mapping`.

v4-Subagents brauchen 2–3× mehr Wallclock-Zeit (Spawn-Overhead), aber
2–3× weniger Tokens (jeder Subagent startet mit kleinem Kontext).
No-thinking-Varianten sind jeweils schneller und token-effizienter.
Die schnellste Kombination ist v5 × 4.7-no-thinking (350s), die
token-effizienteste ist v4 × 4.7-no-thinking (3.1M).

---
---

# Anhang

## A-10.1 — Detailanalyse: Wie äußert sich der Modell-Effekt im Code?

F-10.1 zeigt den Modell-Effekt in Zahlen. Dieser Anhang erklärt, was
hinter den Zahlen passiert — wie sich der Unterschied konkret im
generierten Code manifestiert.

### Ausgangslage

Alle Runs lösen die gleiche Aufgabe (Game of Life) mit dem gleichen
Workflow-Framework und dem gleichen Prompt. Der einzige Unterschied ist
die Modellversion. Die Frage ist: *was genau* macht 4.7 anders als 4.6?

### Leitmetrik: `cognitive_max`

Cognitive Complexity (SonarSource-Metrik) gewichtet Verschachtelung und
Control-Flow-Brüche stärker als McCabe. Sie misst, wie schwer eine
Funktion *zu lesen* ist — nicht nur wie viele Pfade sie hat.

| | v4 (Subagents) | v5 (Single-Context) |
|---|---|---|
| **Opus 4.7** | **4.8** ± 2.1 | **11.8** ± 4.1 |
| **Opus 4.6** | 11.8 ± 5.5 | 16.8 ± 0.5 |

Die Zahlen bedeuten: die komplexeste Funktion im generierten Code hat
bei 4.7 eine Cognitive Complexity von ~5 (v4) bzw. ~12 (v5), bei 4.6
dagegen ~12 (v4) bzw. ~17 (v5).

### Typisches Code-Muster: Opus 4.7 unter v4

`cognitive_max` ≈ 5. Der Code zerlegt die Logik in 4–5 kleine Funktionen:

- `countNeighbors(cells, x, y)` — zählt lebende Nachbarn
- `isAlive(cells, x, y)` — prüft ob Zelle lebt
- `getDeadNeighbors(cells)` — sammelt tote Nachbarn mit Potenzial
- `nextGeneration(cells)` — Orchestrator, ruft die Helfer auf

Jede Funktion hat 1–2 Kontrollstrukturen. Die höchste
Einzelfunktions-Komplexität liegt bei ~5.

### Typisches Code-Muster: Opus 4.6 unter v5

`cognitive_max` ≈ 17. Der Code packt die Logik in eine oder zwei große
Funktionen:

- `nextGeneration(cells)` enthält verschachtelte Schleifen über Nachbarn
  mit eingebetteten Conditionals für die Überlebensregeln
- Eine einzige Funktion trägt die gesamte Komplexität

### Gleiche Masse, andere Verteilung

Entscheidend: die Code-Mass (APP) ist in beiden Fällen nahezu gleich
(~155–165). Opus 4.7 schreibt nicht *weniger* Code — es verteilt die
gleiche Menge auf mehr, kürzere Funktionen mit niedrigerer
Einzelkomplexität. Die Lösungen sind funktional äquivalent, aber
strukturell verschieden.

### Warum ist der Modell-Effekt unter v4 stärker?

Der Faktor zwischen 4.7 und 4.6 ist bei v4 **2.5×** (`cognitive_max`
4.8 → 11.8), bei v5 nur **1.4×** (11.8 → 16.8). Die
Subagent-Architektur *verstärkt* den Modell-Qualitätsunterschied.

Erklärung:

- **v4-Subagents**: jeder Refactor-Subagent sieht nur die aktuelle
  Funktion in seinem kleinen Kontext. Ein besseres Modell (4.7)
  erkennt in diesem isolierten Blick eher, dass eine Funktion zu lang
  ist, und extrahiert Helfer-Funktionen. Ein schwächeres Modell (4.6)
  lässt die Funktion stehen, weil es den Refactoring-Bedarf nicht
  erkennt.

- **v5-Single-Context**: der Agent sieht den gesamten bisherigen Code
  im Kontext. Hier kann auch 4.6 die Gesamtstruktur sehen — aber es
  neigt trotzdem dazu, monolithisch zu implementieren, weil der
  akkumulierte Kontext die Tendenz zur
  "weiterschreiben statt umstrukturieren"-Strategie verstärkt.

### Einschränkungen

- Nur eine Kata (game-of-life), ein Prompt-Stil (example-mapping),
  n = 4 pro Zelle.
- Opus 4.6 läuft via Portkey-Gateway — theoretisch könnte das Routing
  einen Einfluss haben (in RQ-9 dokumentiert, hier nicht kontrolliert).
- Die Cognitive-Complexity-Schwelle liegt bei game-of-life an der
  `nextGeneration`-Funktion — bei einfacheren Katas
  (string-calculator) wäre der Unterschied unsichtbar, weil die
  Komplexität der Aufgabe zu niedrig ist um Refactoring-Bedarf zu
  erzeugen.
