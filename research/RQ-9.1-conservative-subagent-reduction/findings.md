# RQ-9.1 — Findings

## F-9.1.1 — Konservative Reduktion hält Cognitive Complexity stabil

Die konservative Reduktion (v4.2, −67 %) hält `cognitive_max` auf dem
Niveau des Originals (v4), während die aggressive Reduktion (v4.1, −82 %)
es ansteigen lässt.

| Outcome | v4 (1454 Z.) | v4.2 (484 Z.) | v4.1 (262 Z.) |
|---|---|---|---|
| `cognitive_max` | **11.8 ± 5.5** | **11.8 ± 4.1** | 14.0 ± 5.4 |
| `mccabe_max` | **7.5 ± 2.7** | 8.8 ± 1.7 | 9.3 ± 4.0 |
| `cc_longest_function` (Spitzen-Komplexität) | **16.8 ± 6.1** | 20.3 ± 8.2 | 25.3 ± 2.2 |
| `smell_total` (Smell-Summe) | 3.8 ± 1.7 | **3.3 ± 1.5** | 3.5 ± 1.3 |
| `code_mass` (Code-Mass APP) | 157.8 ± 38.6 | 157.0 ± 29.6 | 175.5 ± 29.5 |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

Die Hypothese ist teilweise bestätigt: `cognitive_max` ist identisch,
`mccabe_max` und `smell_total` liegen innerhalb 1σ. Allerdings steigt
`cc_longest_function` auch bei der konservativen Reduktion leicht
(16.8 → 20.3), wenn auch deutlich weniger als bei v4.1 (→ 25.3).

---

## F-9.1.2 — Die konservative Reduktion spart 25 % Wallclock-Zeit bei gleichen Tokens

| Outcome | v4 | v4.2 | v4.1 |
|---|---|---|---|
| `duration_seconds` | **1116 ± 192** | **842 ± 82** | 656 ± 137 |
| `total_tokens` | 4.8M ± 0.9M | 5.0M ± 0.6M | **3.7M ± 0.7M** |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

v4.2 ist 25 % schneller als v4 bei nahezu gleichen Tokens (5.0M vs 4.8M).
v4.1 ist nochmals schneller (656s) und braucht deutlich weniger Tokens
(3.7M), bezahlt aber mit höherer Funktionslänge.

Die Zeitersparnis bei v4.2 kommt hauptsächlich von kürzeren
Subagent-Prompts → schnellere Prompt-Verarbeitung pro Spawn, nicht von
weniger Spawns (die Cycle-Counts sind vergleichbar).

---

## F-9.1.3 — Die Reduktions-Schwelle für Subagent-Prompts liegt zwischen 484 und 262 Zeilen

| Variante | Zeilen | `cognitive_max` | `cc_longest_function` |
|---|---|---|---|
| v4 (original) | 1454 | 11.8 | 16.8 |
| v4.2 (konservativ) | 484 | **11.8** | 20.3 |
| v4.1 (aggressiv) | 262 | 14.0 | 25.3 |

Zwischen v4.2 und v4.1 liegt die Schwelle, ab der die Reduktion fachlich
tragende Inhalte trifft. Die Inhalte die v4.2 behält und v4.1 nicht —
APP-Formel, Naming-Evaluation-Template, Baby-Steps-Progression,
Refactoring-Beispiel — sind teilweise tragend für die Funktionslänge,
aber nicht für die Cognitive Complexity.

Für zukünftige Workflow-Optimierungen: `cognitive_max` ist robust
gegenüber Prompt-Kürzung, `cc_longest_function` reagiert empfindlicher.
Die Funktions-Extraktion (die `cc_longest_function` senkt) braucht
explizite Beispiele im Subagent-Prompt — die Komplexitäts-Regeln
(die `cognitive_max` treiben) werden auch implizit befolgt.
