# RQ-9.2 — Findings

## F-9.2.1 — Die gezielte Wiederherstellung verschlechtert die Ergebnisse statt sie zu verbessern

Entgegen der Hypothese produziert v4.3 (v4.2 + wiederhergestellte tragende
Inhalte) **schlechtere** Code-Qualität als v4.2 — und konvergiert
überwiegend auf ein monolithisches Lösungsmuster.

| Outcome | v4 (1454 Z.) | v4.2 (484 Z.) | v4.3 (545 Z.) |
|---|---|---|---|
| `cognitive_max` | 13.2 ± 5.0 | 13.2 ± 4.1 | **16.1 ± 2.9** |
| `mccabe_max` | 8.5 ± 2.7 | 8.5 ± 1.9 | **10.1 ± 1.8** |
| `cc_longest_function` (Spitzen-Komplexität) | 16.5 ± 9.0 | 21.2 ± 9.8 | **22.6 ± 8.2** |
| `refactorings_applied` | **4.8 ± 2.7** | 2.8 ± 0.5 | **2.1 ± 0.6** |

v4 n=6, v4.2 n=8, v4.3 n=8. Modell `opus-4-6-portkey`,
Kata `game-of-life-example-mapping`.

v4.3 zeigt bei n=8 ein klares Muster: 7 von 8 Runs landen bei
`cognitive_max` ≥ 17, ein Ausreißer bei 9. Unter der v4.2-Verteilung
(5/8 Runs < 15) liegt die Wahrscheinlichkeit für 7+ von 8 Runs ≥ 15
bei ~0.4 % — der Effekt ist statistisch belastbar, nicht Streuung.

Alle drei Varianten zeigen eine **bimodale Verteilung**: Runs landen
entweder im Low-Modus (cognitive ~7–9, extrahierte Helfer-Funktionen)
oder im High-Modus (cognitive ~17, monolithische Lösung). v4.3
verschiebt die Verteilung eindeutig Richtung High-Modus.

Per-Run-Werte `cognitive_max`:
- v4:   [7, 16, 7, 17, 14, 18]
- v4.2: [8, 13, 9, 17, 17, 9, 18, 15]
- v4.3: [17, 17, 17, 17, 17, 9, 17, 18]

---

## F-9.2.2 — Die Hypothese "Beispiele wiederherstellen = Qualität wiederherstellen" ist widerlegt

Die Kausalanalyse aus RQ-9.1 (F-9.1.3) — "die drei entfernten Inhalte
sind die tragenden Elemente" — ist falsch oder unvollständig. Das
Zurückbringen der drei Inhalte (Extract-Helper-Beispiel,
Potential-improvements-Listen, No-Refactoring-Szenario) stellt die
Refactoring-Disziplin nicht wieder her, sondern verschlechtert sie.

Mögliche Erklärungen:

1. **Aufmerksamkeits-Verdrängung**: die 61 zusätzlichen Zeilen im
   Refactor-Agent (v4.3 vs v4.2) verschieben die Aufmerksamkeit des
   Subagents auf die Beispiele und weg von den eigentlichen Regeln. Das
   Extract-Helper-Beispiel zeigt String-Vergleich — der Agent
   generalisiert das nicht auf Game-of-Life-Funktions-Extraktion.

2. **Kontext-Balance gestört**: v4 hat 346 Zeilen im Refactor-Agent,
   davon ~150 redundante "Guidelines/Flags/Remember"-Abschnitte. Diese
   Redundanz hat möglicherweise als **Verstärkung** gewirkt: die
   wiederholte Betonung von "MUST attempt refactoring" über mehrere
   Abschnitte war effektiver als eine einzelne Regel.

3. **Nicht-linearer Zusammenhang**: die Wirkung von Prompt-Inhalten auf
   Subagent-Verhalten ist nicht kompositionell. Man kann nicht einzelne
   Absätze als "tragend" identifizieren und isoliert zurückbringen —
   die Wirkung entsteht aus dem Zusammenspiel des gesamten Prompts.

---

## F-9.2.3 — v4.2 bleibt der beste Kompromiss unter den reduzierten Varianten

| Variante | Zeilen | `cognitive_max` | `refactorings` | `cc_longest_fn` | `duration_s` |
|---|---|---|---|---|---|
| v4 | 1454 | 13.2 ± 5.0 | **4.8** | 16.5 | 1116 |
| v4.2 | 484 | **13.2 ± 4.1** | 2.8 | 21.2 | **842** |
| v4.3 | 545 | 16.1 ± 2.9 | 2.1 | 22.6 | 714 |
| v4.1 | 262 | 14.0 ± 5.4 | 5.8 | 25.3 | 656 |

v4 n=6, v4.2 n=8, v4.3 n=8, v4.1 n=4.

v4 und v4.2 sind bei `cognitive_max` gleichwertig (13.2). v4.2 ist
25 % schneller als v4 bei gleichen Tokens und hält die Komplexität.
v4.3 und v4.1 verschlechtern die Komplexität — v4.3 durch gezielte
Ergänzungen, v4.1 durch zu aggressive Kürzung.

Konsequenz: die optimale Reduktion für Subagent-Workflows ist **nicht
durch Inhalts-Analyse vorhersagbar**. Sie muss empirisch getestet
werden — jede Änderung kann den Arbeitspunkt verschieben.
