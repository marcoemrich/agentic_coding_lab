# RQ-9.2 — Findings

## F-9.2.1 — Die gezielte Wiederherstellung verschlechtert die Ergebnisse statt sie zu verbessern

Entgegen der Hypothese produziert v4.3 (v4.2 + wiederhergestellte tragende
Inhalte) **schlechtere** Code-Qualität als v4.2 — und konvergiert
deterministisch auf ein monolithisches Lösungsmuster.

| Outcome | v4 (1454 Z.) | v4.2 (484 Z.) | v4.3 (545 Z.) |
|---|---|---|---|
| `cognitive_max` | 11.8 ± 5.5 | **11.8 ± 4.1** | **17.0 ± 0.0** |
| `mccabe_max` | 7.5 ± 2.7 | 8.8 ± 1.7 | **11.0 ± 0.0** |
| `cc_longest_function` (Spitzen-Komplexität) | 16.8 ± 6.1 | 20.3 ± 8.2 | **25.0 ± 0.8** |
| `smell_total` (Smell-Summe) | 3.8 ± 1.7 | 3.3 ± 1.5 | 4.0 ± 0.0 |
| `code_mass` (Code-Mass APP) | 157.8 ± 38.6 | 157.0 ± 29.6 | **124.0 ± 3.5** |
| `refactorings_applied` | 6.0 ± 2.6 | 2.5 ± 0.6 | **1.8 ± 0.5** |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

Auffällig: `cognitive_max` 17.0 ± 0.0, `mccabe_max` 11.0 ± 0.0 — alle
vier Runs produzieren exakt dieselbe Komplexität. Das ist das gleiche
deterministische Muster wie v5 × Opus 4.6 (RQ-10, F-10.4): eine
monolithische `nextGeneration`-Funktion mit verschachtelten Schleifen,
21–26 LoC, kein Helfer extrahiert.

---

## F-9.2.2 — Die Hypothese "Beispiele wiederherstellen = Qualität wiederherstellen" ist widerlegt

Die Kausalanalyse aus RQ-9.1 (F-9.1.3) — "die drei entfernten Inhalte
sind die tragenden Elemente" — ist falsch oder unvollständig. Das
Zurückbringen der drei Inhalte (Extract-Helper-Beispiel,
Potential-improvements-Listen, No-Refactoring-Szenario) stellt die
Refactoring-Disziplin nicht wieder her.

Mögliche Erklärungen:

1. **Aufmerksamkeits-Verdrängung**: die 61 zusätzlichen Zeilen im
   Refactor-Agent (v4.3 vs v4.2) verschieben die Aufmerksamkeit des
   Subagents auf die Beispiele und weg von den eigentlichen Regeln. Das
   Extract-Helper-Beispiel zeigt String-Vergleich — der Agent generalisiert
   das nicht auf Game-of-Life-Funktions-Extraktion.

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
| v4 | 1454 | 11.8 | **6.0** | **16.8** | 1116 |
| v4.2 | 484 | **11.8** | 2.5 | 20.3 | **842** |
| v4.3 | 545 | 17.0 | 1.8 | 25.0 | 714 |
| v4.1 | 262 | 14.0 | 5.8 | 25.3 | 656 |

v4.2 ist der einzige reduzierte Workflow, der `cognitive_max` auf
v4-Niveau hält. v4.3 verschlechtert diesen Wert durch die gezielten
Ergänzungen. Die konservative Reduktion (v4.2) scheint einen stabilen
Arbeitspunkt zu treffen, der durch zusätzliche Inhalte eher gestört als
verbessert wird.

Konsequenz: die optimale Reduktion für Subagent-Workflows ist **nicht
durch Inhalts-Analyse vorhersagbar**. Sie muss empirisch getestet werden
— jede Änderung kann den Arbeitspunkt verschieben.
