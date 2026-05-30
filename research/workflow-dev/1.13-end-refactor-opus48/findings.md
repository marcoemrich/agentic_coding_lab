# RQ-end-refactor-opus48 — Findings

Haelt der v6.5-end-refactor-Befund aus RQ-1.12 auf **Opus 4.8 (no-thinking)**: bleibt die Korrektheit auf claim-office intakt, liefert der End-Refactor-Pass mindestens v6.2-Code-Qualitaet, und tritt das Bundle-Bruch-Muster aus RQ-1.9/RQ-1.10 (Self-Termination, `verification_pct`-Kollaps) auf dem neuen Modell auf?

Daten: 5 v6.2 + 5 v6.4 + 5 v6.5, alle `claim-office-example-mapping`, alle `opus-4-8-no-thinking` (Direct-API / native OAuth). Quelle: [summary.md](summary.md), [runs.csv](runs.csv).

## Übersicht

Aggregierte Means pro Outcome. Trophy 🏆 = bester Wert in der Spalte (Spread ≥ 1 σ); bei Ties alle. Korrektheits-Gating: Quality-/Kosten-Trophies nur fuer Zellen mit grüner Korrektheit. v6.2 hat 1/5 Runs mit `verification_pct = 0` (echter CLI-Vertragsbruch, siehe F-1.13.2) — die v6.2-Quality-Means schliessen diesen Run mit ein, ein 🏆 fuer v6.2 wird aber nur vergeben, wo v6.2 trotz des Ausreissers fuehrt.

### Korrektheit (höher = besser; primär)

| Workflow | `verification_pct` (rate %) | `tests_passing %` | `completed_within_budget %` |
|---|---:|---:|---:|
| v6.2-with-why-cleaned | 80 | **100** 🏆 | 80 |
| v6.4-metric-driven-refactor | **100** 🏆 | **100** 🏆 | **100** 🏆 |
| v6.5-end-refactor | **100** 🏆 | **100** 🏆 | **100** 🏆 |

- `verification_pct` ist hier rate-basiert (Anteil Runs mit pct = 1.0). v6.2: 4/5 perfekt, 1/5 bei 0.0. v6.4 und v6.5: 5/5 perfekt.
- v6.2 `completed_within_budget` 80 % = 1 Timeout-Run (separat vom CLI-Vertragsbruch).

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `cc_avg_loc_per_function` | `code_mass` | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 3.6 | 4.0 | 24.6 ↑ | 4.24 | 895 | 1.0 |
| v6.4-metric-driven-refactor | 3.6 | 4.0 | **15.6** 🏆 | 4.44 | **843** 🏆 | **0.0** 🏆 |
| v6.5-end-refactor | **2.8** 🏆 | **3.2** 🏆 | 16.0 | **3.81** 🏆 | 872.6 | **0.0** 🏆 |

- `mccabe_avg` (1.47 / 1.48 / 1.47) und `smell_complexity` (0/0/0) sind über alle drei Workflows praktisch identisch — kein Pokal, in der Tabelle weggelassen.
- `cc_longest_function`: v6.4 (15.6) und v6.5 (16.0) liegen innerhalb 1 σ zueinander; beide deutlich unter v6.2 (24.6, σ 7.64).

### Kosten (kleiner = besser)

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) |
|---|---:|---:|
| v6.2-with-why-cleaned | 4159 | **82.3 M** 🏆 |
| v6.4-metric-driven-refactor | **3064** 🏆 | 91.7 M |
| v6.5-end-refactor | 3221 | 89.0 M |

- Alle drei Token-Means liegen innerhalb ~1 σ (σ je 13–33 M); der Token-Trophy fuer v6.2 ist knapp und nicht robust.
- v6.2-Wallclock-Mean (4159 s) ist durch den Timeout-Run (7201 s) nach oben gezogen; Median liegt niedriger.

---

## F-1.13.1 — v6.5-end-refactor haelt die Korrektheit auf Opus 4.8; RQ-1.12-Kernbefund repliziert

Der zusaetzliche End-Refactor-Pass beschaedigt die Korrektheit auf claim-office × opus-4-8 nicht. Alle 5/5 v6.5-Runs schreiben `experiment-done.txt`, bestehen alle internen Vitest-Tests und erreichen `verification_pct = 1.0`. Das in RQ-1.9 / RQ-1.10 dokumentierte Bundle-Bruch-Muster (Self-Termination nach <½ der Baseline-Cycles, `verification_pct`-Kollaps bei intakten internen Tests) tritt auf dem neuen Modell **nicht** auf.

| Workflow | n | tests_passing | verification_pct (perfekt/n) | completed_within_budget |
|---|---:|:-:|:-:|:-:|
| v6.2-with-why-cleaned | 5 | 5/5 | 3/5 (+1 Timeout, +1 CLI-Bruch) | 4/5 |
| v6.4-metric-driven-refactor | 5 | 5/5 | 5/5 | 5/5 |
| v6.5-end-refactor | 5 | 5/5 | **5/5** | 5/5 |

Plausibilisierung: der End-Refactor-Pass laeuft ausserhalb der TDD-Cycle-Dynamik mit stabilen Tests als Sicherheitsnetz; ein Refactoring, das die Tests rot faerbt, waere auf dem CLI-Verifikationspfad sofort sichtbar. v6.5 ist auf 4.8 deckungsgleich mit der RQ-1.12-Beobachtung auf 4.7 (dort ebenfalls 5/5, verification_pct 0.99). Die `cycle_count`-Streuung von v6.5 ist auf 4.8 sogar besonders eng (σ 1.79, 36–40 Cycles), d. h. der Workflow stabilisiert die Cycle-Zahl, statt frueh abzubrechen.

---

## F-1.13.2 — Auf Opus 4.8 ist die nackte v6.2-Baseline weniger robust als v6.4/v6.5; ein CLI-Vertragsbruch durch Workflow-Umgehung

Anders als v6.4 und v6.5 (je 5/5 perfekt) hat v6.2 auf 4.8 zwei Nicht-perfekte Runs:

1. **CLI-Vertragsbruch (`verification_pct = 0.0`, `cli_built = false`):** Der Agent baute `src/cli.ts` mit einem selbst erfundenen `operation`-Dispatch-Feld im Input-Schema. Die Verifikations-Suite sendet das vereinbarte Schema ohne `operation` → alle 15 Szenarien antworten `Unknown operation: undefined`, exit 1. Die internen Tests (`quote`/`claim` direkt) bleiben gruen (`tests_passing = true`), nur der externe CLI-Vertrag ist verfehlt. Im Transcript begruendet der Agent dies explizit: *"this was a plain file-creation/wiring task, not a TDD cycle, so I created it directly rather than going through the red/green/refactor skills"* — er hat den CLI-Entry-Point bewusst am TDD-Workflow vorbei geschrieben und dabei den Vertrag falsch geraten.
2. **Timeout (`completed_within_budget = false`):** 1 Run lief in das Per-Run-Budget (7201 s); zaehlt als legitimer Befund, nicht als Fehler.

| Workflow | perfekt | CLI-Bruch (cli_built=false) | Timeout | tests_passing |
|---|:-:|:-:|:-:|:-:|
| v6.2-with-why-cleaned | 3/5 | 1/5 | 1/5 | 5/5 |
| v6.4-metric-driven-refactor | 5/5 | 0/5 | 0/5 | 5/5 |
| v6.5-end-refactor | 5/5 | 0/5 | 0/5 | 5/5 |

Plausibilisierung: v6.4 und v6.5 erben denselben Per-Cycle-Anteil wie v6.2, ergaenzen aber einen deterministischen Mess-/Refactor-Schritt am Code (v6.4 per Cycle, v6.5 am Ende), der den ganzen `src/`-Baum noch einmal anfasst — inklusive `cli.ts`. Dieser zusaetzliche Whole-src-Kontakt kann den fehlerhaften CLI-Vertrag korrigieren, bevor der Run endet. Bei v6.2 fehlt dieser zweite Blick. Mit n=5 ist das ein einzelner Datenpunkt und keine belastbare Rate — aber das Muster (4.8 nimmt sich beim CLI-Wiring Freiheiten, die der Vertrag nicht hergibt) deckt sich mit der modell-abhaengigen Drift, fuer die RQ-1.13 angelegt wurde.

---

## F-1.13.3 — v6.5 fuehrt bei Spitzen-Komplexitaet, v6.4 bei Funktionslaenge/Code-Mass; beide schlagen v6.2

Auf den Code-Qualitaets-Metriken sind v6.4 und v6.5 nahezu gleichauf und beide besser als v6.2 — wie schon auf 4.7 (RQ-1.12) ueber komplementaere Mechanismen:

| Metrik | v6.2 | v6.4 | v6.5 | Sieger |
|---|---:|---:|---:|---|
| `cognitive_max` | 3.6 | 3.6 | **2.8** | v6.5 (σ 0.84–1.14) |
| `mccabe_max` | 4.0 | 4.0 | **3.2** | v6.5 (σ 0–0.71) |
| `cc_longest_function` | 24.6 | **15.6** | 16.0 | v6.4 ≈ v6.5 |
| `cc_avg_loc_per_function` | 4.24 | 4.44 | **3.81** | v6.5 |
| `code_mass` | 895 | **843** | 872.6 | v6.4 ≈ v6.5 (σ 53–102) |
| `smell_total` | 1.0 | **0.0** | **0.0** | v6.4 = v6.5 |

Plausibilisierung: v6.5 senkt die Spitzen-Komplexitaet einzelner Funktionen am staerksten (`cognitive_max` −22 %, `mccabe_max` −20 % gegenueber v6.2) und liefert die kuerzeste durchschnittliche Funktion. v6.4 fuehrt knapp bei `cc_longest_function` und `code_mass`. Die Differenzen v6.4 ↔ v6.5 liegen durchweg innerhalb 1 σ — die beiden Designs sind auch auf 4.8 komplementaer, nicht redundant. Auf 4.7 (RQ-1.12) lag v6.5 bei `code_mass` knapp vorn; auf 4.8 dreht sich diese Detail-Rangfolge, ohne dass eine der beiden Methoden systematisch fuehrt.

Caveat: Alle drei `code_mass`-Means liegen mit grosser Streuung dicht beieinander (722–993 Spannweite). Der Code-Qualitaets-Vorsprung von v6.4/v6.5 ueber v6.2 ist bei `cc_longest_function` und `smell_total` am deutlichsten, bei `code_mass` schwach.

---

## F-1.13.4 — Kosten: alle drei Workflows auf 4.8 innerhalb eines σ; kein v6.5-Tokenaufschlag

Anders als auf 4.7 (wo v6.4 ~2.4× so viele Tokens wie v6.2/v6.5 brauchte) liegen auf 4.8 alle drei Workflows eng beieinander:

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) | σ Tokens |
|---|---:|---:|---:|
| v6.2-with-why-cleaned | 4159 | 82.3 M | 32.7 M |
| v6.4-metric-driven-refactor | 3064 | 91.7 M | 31.5 M |
| v6.5-end-refactor | 3221 | 89.0 M | 13.4 M |

Der v6.5-End-Pass erzeugt auf 4.8 **keinen** nennenswerten Tokenaufschlag gegenueber v6.2 (+8 % im Mean, klar innerhalb σ) und ist bei der Wallclock sogar guenstiger als v6.2 (deren Mean der Timeout-Run hochzieht). v6.4s 4.7-Token-Strafe (~2.4×) repliziert auf 4.8 **nicht** — 4.8 fuehrt die Per-Cycle-Messungen offenbar deutlich token-sparsamer aus. v6.5 hat zudem die mit Abstand engste Token- und Wallclock-Streuung (σ 13.4 M; Wallclock σ 378 s), d. h. die vorhersagbarsten Kosten der drei.

---

## F-1.13.5 — TDD-Disziplin auf 4.8 für alle drei Workflows intakt

Cycle-Metriken bestaetigen, dass der Per-Cycle-Anteil auf 4.8 sauber laeuft:

| Metrik | v6.2 | v6.4 | v6.5 |
|---|---:|---:|---:|
| `cycle_count` | 33.6 | 40.8 | 37.8 |
| `refactorings_applied` | 36.0 | 25.8 | 28.0 |
| `predictions_correct_rate` | 99.7 % | 99.8 % | 99.5 % |
| `tests_passed_immediately` | 16.2 | 12.0 | 11.2 |

`predictions_correct_rate` liegt fuer alle drei bei ~99.5–99.8 % (pooled) — Opus 4.8 trifft seine Red-Phase-Vorhersagen auf claim-office nahezu perfekt. v6.5 hat die engste `cycle_count`-Streuung (σ 1.79), die v6.2-Streuung ist am groessten (σ 12.03), getrieben vom CLI-Bruch-Run (17 Cycles) und dem Timeout-Run. Keine Demotivation des Per-Cycle-Refactors durch den Wissen um den End-Pass nachweisbar.

---

## Operative Lehren (nicht-RQ-Findings)

- **opus-4-8 Direct-API: transienter Portkey-400 beim ersten Call.** Der v6.5-Smoke-Run starb initial an `API Error: 400 Either x-portkey-config or x-portkey-provider header is required` (exit 1, kein `429` → keine run-batch.sh-Retry-Erfassung). Ein identischer Wiederholungslauf lief sauber durch; zwei weitere opus-4-8-Runs am selben Tag waren ebenfalls grün. Der 400er ist transient/konfig-abhaengig, kein deterministischer Modell- oder Routing-Defekt. Der `MODEL_CONFIGS`-Kommentar in `run-batch.sh` ("Env-Vars blanked → native OAuth") ist veraltet — opus-4-8 laeuft faktisch ueber dieselbe Portkey-`.env`-Route wie 4.7, nur mit nacktem Modell-Label. Folgerisiko: ein 400er in einem Multi-Run-Batch bleibt ersatzlos liegen (kein Auto-Retry). Wer das vermeiden will, muss `400 x-portkey-config` in der run-batch.sh-Transient-Detection ergaenzen.
- **TDD-Marker stehen in `transcript-metrics.json`, nicht in `metrics.json.final_metrics`.** `final_metrics.cycle_count` u. a. sind direkt nach dem Container-Run `null`; `aggregate-by-query.py` zieht die Werte korrekt aus `transcript-metrics.json` (cycle_count, predictions_total). Das ist der Normalzustand (auch die 4.7-Runs aus RQ-1.12 zeigen ihn), kein 4.8-Regressionsbug — kein manuelles Host-`analyze-run.sh`-Nachziehen noetig.
- **Routing-Konfundierung gegenüber RQ-1.12:** opus-4-8 (Direct-API) und die RQ-1.12-Zahlen (opus-4-7-Portkey/Vertex-EU) teilen keine Zelle. Cross-RQ-Vergleiche der Absolutwerte (z. B. v6.5 code_mass 780 auf 4.7 vs 872 auf 4.8) sind routing- UND modell-konfundiert und nur als Kontext zu lesen, nicht als reiner Modell-Effekt.
