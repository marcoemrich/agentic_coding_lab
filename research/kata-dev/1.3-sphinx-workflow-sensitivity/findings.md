# RQ-kata-1.3 — Findings: Does sphinx-score resolve a workflow difference?

n=6 per cell, `opus-5-no-thinking`, prompt `example-mapping`. All 36 runs
`exit_reason=ok`, `tests_passing=100%`, `completed_within_budget=100%`.

`game-of-life` is the reference kata: it sits at practically the same Code Mass
(APP) as `sphinx-score` (196.8 vs. 182.8) and is the lab's established
code-quality kata. It separates size from kata design — anything sphinx-score
fails to resolve that game-of-life resolves at the same size is a property of
the kata, not of its scale.

## Übersicht

Workflow comparison **within** each kata. `v3-basic-tdd` is the minimal
workflow (plain red-green-refactor), `v6.6-lab-split-cc` the elaborate one
(refactor subagent, test-list phase, audit bundle).

### sphinx-score (~183 Code Mass (APP))

| Metric | Richtung | v3-basic-tdd | v6.6-lab-split-cc | Faktor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | kleiner = besser | 11.00 | **5.83** 🏆 | 1.9× |
| `cc_avg_loc_per_function` | kleiner = besser | 8.38 | **3.54** 🏆 | 2.4× |
| `cognitive_max` | kleiner = besser | 1.50 | **1.00** 🏆 | 1.5× |
| `mccabe_max` | kleiner = besser | 2.33 | **2.00** 🏆 | 1.2× |
| `cc_functions` | — (Dekompositionsgrad) | 3.50 | 6.50 | 1.9× |
| Production LoC | — | 77.5 | 57.5 | 0.74× |
| `refactorings_applied` | höher = besser | 2.67 | **11.67** 🏆 | 4.4× |
| `cycle_count` | — | 1.50 | 11.67 | 7.8× |
| Correctness (external) | höher = besser | 0.97 | **1.00** 🏆 | — |
| `duration_seconds` | kleiner = besser | **251** 🏆 | 1475 | 5.9× |
| `cost_usd` | kleiner = besser | **$2.64** 🏆 | $12.86 | 4.9× |

### game-of-life (~196 Code Mass (APP))

| Metric | Richtung | v3-basic-tdd | v6.6-lab-split-cc | Faktor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | kleiner = besser | 14.50 | **7.50** 🏆 | 1.9× |
| `cc_avg_loc_per_function` | kleiner = besser | 6.48 | **3.46** 🏆 | 1.9× |
| `cognitive_max` | kleiner = besser | 7.17 | **1.17** 🏆 | 6.1× |
| `mccabe_max` | kleiner = besser | 5.67 | **2.50** 🏆 | 2.3× |
| `cc_functions` | — (Dekompositionsgrad) | 4.83 | 8.50 | 1.8× |
| Production LoC | — | 55.0 | 53.5 | 0.97× |
| `refactorings_applied` | höher = besser | 0.33 | **8.83** 🏆 | 27× |
| `cycle_count` | — | 3.67 | 10.33 | 2.8× |
| Correctness (external) | höher = besser | **1.00** 🏆 | **1.00** 🏆 | — |
| `duration_seconds` | kleiner = besser | **167** 🏆 | 1145 | 6.9× |
| `cost_usd` | kleiner = besser | **$1.72** 🏆 | $10.82 | 6.3× |

### claim-office (758–997 Code Mass (APP))

| Metric | Richtung | v3-basic-tdd | v6.6-lab-split-cc | Faktor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | kleiner = besser | 24.33 | **13.83** 🏆 | 1.8× |
| `cc_avg_loc_per_function` | kleiner = besser | 8.90 | **3.19** 🏆 | 2.8× |
| `cognitive_max` | kleiner = besser | 5.33 | **2.00** 🏆 | 2.7× |
| `mccabe_max` | kleiner = besser | 5.33 | **2.83** 🏆 | 1.9× |
| `cc_functions` | — (Dekompositionsgrad) | 14.50 | 38.00 | 2.6× |
| Production LoC | — | 314.7 | 523.0 | 1.7× |
| `refactorings_applied` | höher = besser | 2.00 | **44.50** 🏆 | 22× |
| `cycle_count` | — | 5.17 | 45.83 | 8.9× |
| Correctness (external) | höher = besser | **1.00** 🏆 | 0.94 | — |
| `duration_seconds` | kleiner = besser | **330** 🏆 | 5514 | 17× |
| `cost_usd` | kleiner = besser | **$3.89** 🏆 | $78.98 | 20× |

**Caveats zu den Tabellen:**
- Trophäen werden **nur innerhalb einer Kata** vergeben. Ein kata-übergreifender
  Vergleich wäre bedeutungslos: `claim-office` verlöre jede Kosten-, Komplexitäts-
  und Code-Mass-Zeile allein wegen seiner Aufgabengröße — das misst die Kata, nicht
  den Workflow.
- Correctness-Gating greift nicht einschränkend: alle sechs Zellen liegen bei
  Correctness (external) ≥ 0.94 und `tests_passing` = 100 %, keine Zelle gewinnt eine
  Qualitätsmetrik durch einen Stub oder Abbruch.
- `cc_functions`, `cycle_count` und Production LoC sind ambivalent (mehr Funktionen =
  feinere Zerlegung, aber auch mehr Code) und bekommen daher keine Trophäe.
- `smell_total` ist in allen 36 Runs 0 und diskriminiert auf dieser Modellstufe nicht.

---

## F-1.1 — sphinx-score resolves the workflow difference in decomposition

`sphinx-score` separates the minimal von der elaborierten Workflow-Variante auf
allen vier Dekompositions-Metriken, in derselben Richtung wie die beiden
etablierten Katas. H1 ist bestätigt, das Metrik-Floor-Szenario aus dem README
tritt für die Längen-Metriken nicht ein.

| Metric | v3 | v6.6 | Faktor | σ (v3 / v6.6) |
|---|---:|---:|---:|---|
| `cc_longest_function` | 11.00 | 5.83 | 1.9× | 1.90 / 1.94 |
| `cc_avg_loc_per_function` | 8.38 | 3.54 | 2.4× | 1.42 / 1.11 |
| `cc_functions` | 3.50 | 6.50 | 1.9× | 0.55 / 1.64 |

**Begründung:** Der Abstand bei `cc_longest_function` beträgt 5.2 Punkte bei
σ ≈ 1.9 — also rund 2.7 σ, deutlich über der 1-σ-Schwelle. `cc_avg_loc_per_function`
trennt mit 4.8 Punkten bei σ ≈ 1.3 noch schärfer (≈ 3.8 σ). Die Wertebereiche
überlappen nicht: v3 liegt bei `cc_longest_function` zwischen 8 und 13, v6.6
zwischen 2 und 7. Die Befürchtung aus dem README — beide Zellen kollabieren auf
`cc_longest_function` ≈ 7 — trifft nicht zu; der Smoke-Run mit 48 LoC und Peak 7
war ein v6.6-Wert, und v3 landet systematisch darüber.

---

## F-1.2 — The size gap is not the reason: game-of-life resolves more at the same size

H2 (kleinerer Abstand, weil die Kata kleiner ist) ist **widerlegt**.
`game-of-life` hat praktisch dieselbe Code Mass (APP) wie `sphinx-score`
(196.8 vs. 182.8) und trennt trotzdem auf beiden Komplexitäts-Metriken deutlich
schärfer. Der schwache sphinx-Wert ist eine Eigenschaft der Kata, nicht ihrer Größe.

| Metric | sphinx (183) | game-of-life (196) | claim-office (758–997) |
|---|---:|---:|---:|
| `cc_longest_function` | 1.9× | 1.9× | 1.8× |
| `cc_avg_loc_per_function` | 2.4× | 1.9× | 2.8× |
| `cognitive_max` | 1.5× | **6.1×** | 2.7× |
| `mccabe_max` | 1.2× | **2.3×** | 1.9× |

**Begründung:** Bei den Längen-Metriken liefern alle drei Katas denselben Faktor —
`cc_longest_function` liegt überall bei 1.8–1.9×, unabhängig von einem Größen-
unterschied von Faktor 5. Bei den Komplexitäts-Metriken bricht sphinx dagegen als
einziges ein. Der Grund ist ein Floor auf der sphinx-v3-Seite: `cognitive_max`
liegt dort bei 1.50, während game-of-life-v3 bei 7.17 liegt — der minimale Workflow
erzeugt auf sphinx erst gar keine verschachtelte Logik, an der ein Refactoring
ansetzen könnte. In der sphinx-v6.6-Zelle ist der Floor dann absolut:
`cognitive_max` in allen sechs Runs exakt 1 (σ = 0), `mccabe_max` exakt 2 (σ = 0).
Die sphinx-Aufgabe ist also nicht zu klein, sondern **strukturell zu flach** —
sie enthält keine Verzweigungstiefe, die diese Metriken abbilden könnten.

---

## F-1.3 — The refactoring mechanism separates on all three katas

H3 ist bestätigt. `refactorings_applied` trennt die Workflows überall, aber die
Amplitude folgt nicht der Kata-Größe.

| Kata | v3 | v6.6 | Faktor |
|---|---:|---:|---:|
| sphinx-score | 2.67 | 11.67 | 4.4× |
| game-of-life | 0.33 | 8.83 | 27× |
| claim-office | 2.00 | 44.50 | 22× |

**Begründung:** Der Faktor sagt hier weniger aus als die Absolutwerte, weil er vom
v3-Nenner dominiert wird: game-of-life erreicht den höchsten Faktor (27×) bei der
*niedrigsten* v6.6-Zahl (8.83) — schlicht weil der minimale Workflow dort fast nie
refactort (0.33). Auf der v6.6-Seite skaliert die Zahl sauber mit dem
Aufgabenumfang (8.83 / 11.67 / 44.50), und sie deckt sich pro Kata weitgehend mit
`cycle_count` (10.33 / 11.67 / 45.83): der elaborierte Workflow führt pro Zyklus
etwa ein Refactoring durch. Für einen Workflow-Vergleich ist die Metrik auf allen
drei Katas brauchbar, für einen Kata-Vergleich nicht.

---

## F-1.4 — sphinx-score has no cost advantage over game-of-life

Als Vor-Screening für Workflow-Effekte kostet `sphinx-score` rund ein Sechstel von
`claim-office` — aber `game-of-life` ist bei gleicher Größe noch etwas günstiger
und trennt besser.

| Kata | Workflow | `duration_seconds` | `cost_usd` | `total_tokens` |
|---|---|---:|---:|---:|
| sphinx-score | v3-basic-tdd | 251 | $2.64 | 2.9 M |
| sphinx-score | v6.6-lab-split-cc | 1475 | $12.86 | 19.1 M |
| game-of-life | v3-basic-tdd | 167 | $1.72 | 2.1 M |
| game-of-life | v6.6-lab-split-cc | 1145 | $10.82 | 15.0 M |
| claim-office | v3-basic-tdd | 330 | $3.89 | 4.5 M |
| claim-office | v6.6-lab-split-cc | 5514 | $78.98 | 136.1 M |

**Begründung:** Ein vollständiger 2×6-Workflow-Vergleich kostet auf game-of-life
rund $75, auf sphinx $93 und auf claim-office $497. Die teure Zelle (elaborierter
Workflow) läuft auf sphinx 25 min und auf game-of-life 19 min, gegenüber 92 min auf
claim-office. Der Kostenvorteil gegenüber claim-office ist also real, aber er ist
kein Argument *für sphinx* — game-of-life liefert ihn ebenfalls und trennt dabei
schärfer (F-1.2).

---

## F-1.5 — Correctness stays saturated and does not separate the workflows

Correctness (external) taugt auf keiner der drei Katas als Trennmetrik für diesen
Workflow-Vergleich.

| Kata | v3 | v6.6 |
|---|---:|---:|
| sphinx-score | 0.97 (σ 0.08) | 1.00 (σ 0) |
| game-of-life | 1.00 (σ 0) | 1.00 (σ 0) |
| claim-office | 1.00 (σ 0) | 0.94 (σ 0.03) |

**Begründung:** Fünf der sechs Zellen liegen bei ≥ 0.97, `tests_passing` ist überall
100 %. game-of-life ist in beiden Zellen exakt gesättigt. Auf sphinx liegt der
einzige Ausreißer bei v3 (ein Run mit 0.81), auf claim-office verliert v6.6
systematisch 0.06 — die Richtung kippt also je nach Kata und ist in beiden Fällen
kleiner als der Messbereich, den ein Workflow-Vergleich bräuchte. Das bestätigt die
Annahme im RQ-README: Der Dekompositions-Effekt ist auf der Qualitäts-, nicht auf
der Korrektheitsachse zu messen.

---

## Verdict für die Kata-Bewertung

Nach dem Bewertungsraster im README trifft Zeile 2 zu: **Lücke vorhanden, aber
kleiner als auf der Referenz** — nicht wegen der Kata-Größe, sondern weil die
sphinx-Aufgabe strukturell flach ist (F-1.2).

`sphinx-score` ist für Workflow-RQs verwendbar, mit zwei Einschränkungen:

- **Nutzbare Metriken:** `cc_longest_function`, `cc_avg_loc_per_function`,
  `cc_functions`, `refactorings_applied`. Nicht nutzbar: `cognitive_max` und
  `mccabe_max` (Floor bei σ = 0 in der v6.6-Zelle), `smell_total` (überall 0).
- **Rolle:** Für Workflow-RQs, die auf Komplexitäts-Metriken zielen, ist
  `game-of-life` die bessere Wahl — gleiche Größe, gleiche Kosten, deutlich mehr
  Auflösung. `sphinx-score` bleibt für Correctness- und Prompt-RQs (RQ-1.1, RQ-1.2)
  im Einsatz, wo seine Eindeutigkeit ein Vorteil ist.
