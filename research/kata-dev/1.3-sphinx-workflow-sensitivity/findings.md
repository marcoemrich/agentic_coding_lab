# RQ-kata-1.3 — Findings: Does sphinx-score resolve a workflow difference?

n=6 per cell, `opus-5-no-thinking`, prompt `example-mapping`. All 24 runs
`exit_reason=ok`, `tests_passing=100%`, `completed_within_budget=100%`.

## Übersicht

Workflow comparison **within** each kata. `v3-basic-tdd` is the minimal
workflow (plain red-green-refactor), `v6.6-lab-split-cc` the elaborate one
(refactor subagent, test-list phase, audit bundle).

### sphinx-score (~183 Code Mass (APP))

| Metric | Richtung | v3-basic-tdd | v6.6-lab-split-cc | Faktor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | kleiner = besser | 11.0 | **5.83** 🏆 | 1.9× |
| `cc_avg_loc_per_function` | kleiner = besser | 8.38 | **3.54** 🏆 | 2.4× |
| `cognitive_max` | kleiner = besser | 1.50 | **1.00** 🏆 | 1.5× |
| `mccabe_max` | kleiner = besser | 2.33 | **2.00** 🏆 | 1.2× |
| `cc_functions` | — (Dekompositionsgrad) | 3.5 | 6.5 | 1.9× |
| Production LoC | — | 77.5 | 57.5 | 0.74× |
| Code Mass (APP) | — | 182.8 | 182.8 | 1.0× |
| `refactorings_applied` | höher = besser | 2.67 | **11.67** 🏆 | 4.4× |
| `cycle_count` | — | 1.5 | 11.67 | 7.8× |
| Correctness (external) | höher = besser | 0.97 | **1.00** 🏆 | — |
| `duration_seconds` | kleiner = besser | **251** 🏆 | 1475 | 5.9× |
| `cost_usd` | kleiner = besser | **$2.64** 🏆 | $12.86 | 4.9× |

### claim-office (758–997 Code Mass (APP))

| Metric | Richtung | v3-basic-tdd | v6.6-lab-split-cc | Faktor |
|---|---|---:|---:|---:|
| `cc_longest_function` (Complexity Peak) | kleiner = besser | 24.33 | **13.83** 🏆 | 1.8× |
| `cc_avg_loc_per_function` | kleiner = besser | 8.90 | **3.19** 🏆 | 2.8× |
| `cognitive_max` | kleiner = besser | 5.33 | **2.00** 🏆 | 2.7× |
| `mccabe_max` | kleiner = besser | 5.33 | **2.83** 🏆 | 1.9× |
| `cc_functions` | — (Dekompositionsgrad) | 14.5 | 38.0 | 2.6× |
| Production LoC | — | 314.7 | 523.0 | 1.7× |
| Code Mass (APP) | — | 758.2 | 997.0 | 1.3× |
| `refactorings_applied` | höher = besser | 2.0 | **44.5** 🏆 | 22× |
| `cycle_count` | — | 5.17 | 45.83 | 8.9× |
| Correctness (external) | höher = besser | **1.00** 🏆 | 0.94 | — |
| `duration_seconds` | kleiner = besser | **330** 🏆 | 5514 | 17× |
| `cost_usd` | kleiner = besser | **$3.89** 🏆 | $78.98 | 20× |

**Caveats zur Tabelle:**
- Trophäen werden **nur innerhalb einer Kata** vergeben. Ein kata-übergreifender
  Vergleich wäre bedeutungslos: `sphinx-score` gewänne jede Kosten-, Komplexitäts-
  und Code-Mass-Zeile allein wegen seiner Aufgabengröße — das misst die Kata, nicht
  den Workflow.
- Correctness-Gating greift hier nicht einschränkend: alle vier Zellen liegen bei
  Correctness (external) ≥ 0.94 und `tests_passing` = 100 %, keine Zelle gewinnt eine
  Qualitätsmetrik durch einen Stub oder Abbruch.
- `cc_functions`, `cycle_count`, Production LoC und Code Mass (APP) sind ambivalent
  (mehr Funktionen = feinere Zerlegung, aber auch mehr Code) und bekommen daher
  keine Trophäe.
- `smell_total` ist in allen 24 Runs 0 und diskriminiert auf dieser Modellstufe nicht.

---

## F-1.1 — sphinx-score resolves the workflow difference in decomposition

`sphinx-score` separates the minimal von der elaborierten Workflow-Variante auf
allen vier Dekompositions-Metriken, in derselben Richtung wie `claim-office`.
H1 ist bestätigt, das Metrik-Floor-Szenario aus dem README tritt nicht ein.

| Metric | v3 | v6.6 | Faktor | σ (v3 / v6.6) |
|---|---:|---:|---:|---|
| `cc_longest_function` | 11.0 | 5.83 | 1.9× | 1.90 / 1.94 |
| `cc_avg_loc_per_function` | 8.38 | 3.54 | 2.4× | 1.42 / 1.11 |
| `cc_functions` | 3.5 | 6.5 | 1.9× | 0.55 / 1.64 |

**Begründung:** Der Abstand bei `cc_longest_function` beträgt 5.2 Punkte bei
σ ≈ 1.9 — also rund 2.7 σ, deutlich über der 1-σ-Schwelle. `cc_avg_loc_per_function`
trennt mit 4.8 Punkten bei σ ≈ 1.3 noch schärfer (≈ 3.8 σ). Die Wertebereiche
überlappen nicht: v3 liegt bei `cc_longest_function` zwischen 8 und 13, v6.6
zwischen 2 und 7. Die Befürchtung aus dem README — beide Zellen kollabieren auf
`cc_longest_function` ≈ 7 — trifft nicht zu; der Smoke-Run mit 48 LoC und Peak 7
war ein v6.6-Wert, und v3 landet systematisch darüber.

---

## F-1.2 — The relative gap is as large on sphinx-score as on claim-office

H2 (kleinerer Abstand auf der kleineren Kata) ist für die Dekompositions-Metriken
**widerlegt**. Die relativen Faktoren sind praktisch identisch, obwohl
`claim-office` rund 4.8× so viel Code Mass (APP) hat.

| Metric | sphinx Faktor | claim-office Faktor |
|---|---:|---:|
| `cc_longest_function` | 1.9× | 1.8× |
| `cc_avg_loc_per_function` | 2.4× | 2.8× |
| `mccabe_max` | 1.2× | 1.9× |
| `cognitive_max` | 1.5× | 2.7× |

**Begründung:** Bei den beiden Längen-Metriken deckt sich der Faktor über die
Katas hinweg. Die beiden Komplexitäts-Metriken sind auf sphinx schwächer, und
zwar aus einem Floor-Effekt heraus: `cognitive_max` liegt bei v6.6 in allen sechs
Runs exakt bei 1 (σ = 0), `mccabe_max` exakt bei 2 (σ = 0) — beides ist der
kleinstmögliche Wert für eine nichttriviale Funktion. Der Abstand ist hier nicht
klein, weil der Workflow weniger wirkt, sondern weil nach unten kein Platz mehr
ist. Für Workflow-RQs heißt das: `cc_longest_function` und
`cc_avg_loc_per_function` auf sphinx verwenden, `cognitive_max`/`mccabe_max` nicht.

---

## F-1.3 — The refactoring mechanism carries over, at a quarter of the amplitude

H3 ist bestätigt: `refactorings_applied` trennt die Workflows auch auf
`sphinx-score`. Der Verstärkungsfaktor fällt aber von 22× auf 4.4×.

| Kata | v3 | v6.6 | Faktor |
|---|---:|---:|---:|
| sphinx-score | 2.67 | 11.67 | 4.4× |
| claim-office | 2.0 | 44.5 | 22× |

**Begründung:** Der Unterschied entsteht auf der v6.6-Seite, nicht auf der v3-Seite:
die minimale Workflow-Variante refactort auf beiden Katas gleich selten (2.67 vs. 2.0),
während die elaborierte von 44.5 auf 11.67 fällt. `cycle_count` bewegt sich im
Gleichschritt (45.83 → 11.67), und beide Werte sind pro Kata identisch — v6.6 führt
pro Zyklus genau ein Refactoring durch. Die Zahl der Zyklen skaliert mit dem
Aufgabenumfang, also bildet `refactorings_applied` auf der kleinen Kata den
Mechanismus zwar korrekt ab, aber mit entsprechend weniger Auflösung.

---

## F-1.4 — sphinx-score costs a fifth of claim-office for the same workflow verdict

Beide Katas führen zum selben Workflow-Urteil, aber der Preis unterscheidet sich
um eine Größenordnung. Als Vor-Screening für Workflow-Effekte ist `sphinx-score`
damit brauchbar.

| Kata | Workflow | `duration_seconds` | `cost_usd` | `total_tokens` |
|---|---|---:|---:|---:|
| sphinx-score | v3-basic-tdd | 251 | $2.64 | 2.9 M |
| sphinx-score | v6.6-lab-split-cc | 1475 | $12.86 | 19.1 M |
| claim-office | v3-basic-tdd | 330 | $3.89 | 4.5 M |
| claim-office | v6.6-lab-split-cc | 5514 | $78.98 | 136.1 M |

**Begründung:** Die teure Zelle (elaborierter Workflow) kostet auf sphinx $12.86
statt $78.98 — Faktor 6.1 — und läuft 25 min statt 92 min. Ein vollständiger
2×6-Workflow-Vergleich kostet auf sphinx rund $93 gegenüber $497 auf claim-office.
Bei v3 ist der Abstand klein ($2.64 vs. $3.89), weil die minimale Variante von der
Aufgabengröße kaum abhängt; der Ersparnis-Effekt entsteht ausschließlich in der
Zelle mit dem aufwendigen Workflow.

---

## F-1.5 — Correctness stays saturated and does not separate the workflows

Correctness (external) taugt auf beiden Katas nicht als Trennmetrik für diesen
Workflow-Vergleich — die Richtung kippt sogar je nach Kata.

| Kata | v3 | v6.6 |
|---|---:|---:|
| sphinx-score | 0.97 (σ 0.08) | 1.00 (σ 0) |
| claim-office | 1.00 (σ 0) | 0.94 (σ 0.03) |

**Begründung:** Drei der vier Zellen liegen bei ≥ 0.97, `tests_passing` ist überall
100 %. Auf sphinx liegt der einzige Ausreißer bei v3 (ein Run mit 0.81), auf
claim-office verliert v6.6 systematisch 0.06. Beide Abweichungen sind kleiner als
der Messbereich, den ein Workflow-Vergleich bräuchte. Das bestätigt die Annahme im
RQ-README: Der Dekompositions-Effekt ist auf der Qualitäts-, nicht auf der
Korrektheitsachse zu messen.

---

## Verdict für die Kata-Bewertung

Nach dem Bewertungsraster im README trifft Zeile 2 zu: **Lücke vorhanden, aber
kleiner als auf claim-office** — allerdings nur bei den Komplexitäts-Metriken und
beim Refactoring-Zähler; bei den beiden Längen-Metriken ist sie gleich groß.

`sphinx-score` ist damit nicht auf Correctness- und Prompt-RQs beschränkt, sondern
auch für Workflow-RQs verwendbar, mit zwei Einschränkungen:

- **Nutzbare Metriken:** `cc_longest_function`, `cc_avg_loc_per_function`,
  `cc_functions`, `refactorings_applied`. Nicht nutzbar: `cognitive_max` und
  `mccabe_max` (Floor bei σ = 0 in der v6.6-Zelle), `smell_total` (überall 0).
- **Rolle:** günstiges Vor-Screening bei einem Fünftel der Kosten. Effekte, die
  auf `cognitive_max`/`mccabe_max` beruhen, vor der Veröffentlichung auf
  claim-office bestätigen.
