# RQ-9.1 — Findings

## F-9.1.1 — Konservative Reduktion hält Cognitive Complexity stabil, aber Refactoring-Disziplin sinkt

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
| `refactorings_applied` | **6.0 ± 2.6** | **2.5 ± 0.6** | 5.8 ± 3.8 |

n = 4 pro Zelle, Modell `opus-4-6-portkey`, Kata `game-of-life-example-mapping`.

Die Hypothese ist teilweise bestätigt: `cognitive_max` ist identisch,
`mccabe_max` und `smell_total` liegen innerhalb 1σ. Allerdings steigt
`cc_longest_function` auch bei der konservativen Reduktion leicht
(16.8 → 20.3), und `refactorings_applied` fällt deutlich von 6.0 auf
2.5.

Der Rückgang der Refactorings erklärt den Anstieg der Funktionslänge:
weniger Refactorings → weniger Funktions-Extraktionen → längere
Einzelfunktionen. Die Regel "MUST attempt at least one refactoring" ist
in v4.2 erhalten — aber der Subagent befolgt sie weniger enthusiastisch.
Die entfernten Beispiele waren offenbar motivierender als die Regel
allein.

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

## F-9.1.3 — Identifizierte tragende Inhalte im Refactor-Subagent

Die Diff-Analyse zwischen v4 und v4.2 zeigt zwei Kategorien entfernter
Inhalte, die sich auf die Refactoring-Disziplin auswirken:

### Tragende Entfernungen (erklären den Refactoring-Rückgang)

1. **Szenario 2: "Extract Helper"** (v4 Zeilen 256–292) — das einzige
   Refactoring-Beispiel, das eine **Funktions-Extraktion** demonstriert
   (zwei ähnliche Funktionen → gemeinsamer Helfer `countDifferences`).
   v4.2 behält nur Szenario 1 (Naming-Verbesserung), das keine
   Extraktion zeigt. Ohne ein konkretes Extraktions-Beispiel sieht der
   Subagent weniger Anlass, Funktionen aufzuteilen.

2. **"Potential improvements"-Listen** (v4 Zeilen 129–154) — konkrete
   Handlungsoptionen pro Simple-Design-Rule:
   - Rule 2: "Extract explaining variables", "Restructure for readability"
   - Rule 3: "Extract helper functions", "Consolidate similar logic"
   - Rule 4: "Remove unused functions", "Inline unnecessary extractions"

   v4.2 ersetzt diese mit "Evaluate each rule systematically" — eine
   Anweisung ohne konkrete Optionen. Der Subagent braucht die
   expliziten Optionen als Checkliste, um Verbesserungspotenzial zu
   erkennen.

3. **Szenario 3: "No Refactoring Needed"** (v4 Zeilen 294–308) — zeigt
   explizit wie eine begründete Ablehnung aussieht. Ohne dieses Beispiel
   tendiert der Subagent dazu, schneller "no refactoring needed" zu
   entscheiden, weil die Schwelle niedriger liegt.

### Redundante Entfernungen (kein messbarer Effekt)

- "Important Guidelines" DO/NOT-Listen (v4 Zeilen 218–234) — redundant
  mit den Simple Design Rules und Prozess-Schritten
- "Red Flags" (v4 Zeilen 310–317) — Wiederholung der Regeln als
  Negativ-Liste
- "Integration with Project Standards" (v4 Zeilen 319–335) — irrelevant
  für das Experiment
- "Remember" (v4 Zeilen 337–346) — motivationale Zusammenfassung

### Konsequenz

Ein optimaler v4.3 müsste die tragenden Inhalte (Szenario 2,
Potential-improvements-Listen, Szenario 3) zurückbringen und die
redundanten Entfernungen beibehalten. Geschätzter Umfang: ~550 Zeilen
(+70 gegenüber v4.2).

---

## F-9.1.4 — Die Reduktions-Schwelle variiert nach Metrik

| Variante | Zeilen | `cognitive_max` | `cc_longest_function` | `refactorings` |
|---|---|---|---|---|
| v4 (original) | 1454 | 11.8 | 16.8 | 6.0 |
| v4.2 (konservativ) | 484 | **11.8** | 20.3 | **2.5** |
| v4.1 (aggressiv) | 262 | 14.0 | 25.3 | 5.8 |

Drei Metriken, drei Empfindlichkeiten:

- **`cognitive_max`** ist robust: bleibt bei v4.2 stabil, steigt erst
  bei v4.1. Die Komplexitäts-Regeln werden auch ohne detaillierte
  Beispiele implizit befolgt.

- **`refactorings_applied`** reagiert am empfindlichsten: fällt bei v4.2
  schon auf 2.5. Refactoring-Motivation braucht **konkrete Beispiele**,
  nicht nur Regeln. (Bemerkenswert: v4.1 hat höhere Refactorings als
  v4.2 — möglicherweise weil v4.1 so kurz ist, dass der Agent stärker
  auf eigene Heuristiken zurückfällt.)

- **`cc_longest_function`** folgt den Refactorings: weniger Extraktionen
  → längere Funktionen. Die Kausalkette ist:
  weniger Extraktions-Beispiele → weniger Refactorings →
  längere Funktionen → höhere Spitzen-Komplexität.

Für zukünftige Workflow-Optimierungen: Refactoring-Beispiele sind die
höchstwertigen Prompt-Inhalte im Subagent-Kontext. Sie sollten zuletzt
gekürzt werden.

---

## F-9.1.5 — Die Wirkung der Prompt-Reduktion hängt vom Modell ab

Unter Opus 4.6 sind v4 und v4.2 bei `cognitive_max` gleichwertig. Unter
Opus 4.7 verschlechtert v4.2 die Code-Qualität drastisch.

| Metrik | v4 × 4.7 (n=10) | v4.2 × 4.7 (n=4) | v4 × 4.6 (n=6) | v4.2 × 4.6 (n=8) |
|---|---|---|---|---|
| `cognitive_max` | **4.1 ± 1.8** | 17.8 ± 4.9 | 13.2 ± 5.0 | **13.2 ± 4.1** |
| `mccabe_max` | **4.9 ± 2.0** | 11.0 ± 2.9 | 8.5 ± 2.7 | **8.5 ± 1.9** |
| `smell_total` (Smell-Summe) | **1.1 ± 0.9** | 5.5 ± 1.7 | 3.8 ± 1.7 | **3.3 ± 1.5** |
| `refactorings_applied` | **13.5 ± 5.5** | 3.0 ± 1.2 | 4.8 ± 2.7 | **2.8 ± 0.5** |

Kata `game-of-life-example-mapping`.

Der Effekt ist asymmetrisch: Opus 4.7 profitiert massiv von den
verbose Anweisungen (13.5 Refactorings vs. 3.0 bei v4.2, `cognitive_max`
4.1 vs. 17.8). Opus 4.6 kann mit dem gleichen Material weniger anfangen
(4.8 Refactorings vs. 2.8, `cognitive_max` stabil bei 13.2).

Erklärung: ein stärkeres Modell **extrahiert mehr** aus detaillierten
Prompt-Inhalten — die Refactoring-Beispiele, APP-Berechnungs-Templates
und Checklisten werden von 4.7 aktiv genutzt (13.5 Refactorings pro
Run!), während 4.6 sie großteils ignoriert. Die Reduktion entfernt
Material, das nur das stärkere Modell nutzen konnte.

Konsequenz: **Prompt-Reduktion muss modell-spezifisch dosiert werden.**
Was für Opus 4.6 neutral ist (v4.2), ist für Opus 4.7 destruktiv. Ein
für 4.6 optimierter Workflow ist nicht auf 4.7 übertragbar — und
umgekehrt.
