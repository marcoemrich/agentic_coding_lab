# RQ-end-refactor-opus48 — Findings

Haelt der exact-hybrid-v5-end-refactor-cc-Befund aus RQ-1.12 auf **Opus 4.8 (no-thinking)**: bleibt die Korrektheit intakt, liefert der End-Refactor-Pass mindestens hybrid-v4-Code-Qualitaet, tritt das Bundle-Bruch-Muster aus RQ-1.9/RQ-1.10 (Self-Termination, `verification_pct`-Kollaps) auf dem neuen Modell auf — und reproduziert die **Kata-Asymmetrie** aus F-1.12.2 (End-Pass wirkt auf mehrteiligen Codebasen, ist auf einteiligen Libraries Rauschen)?

Daten: 30 Runs, `example-mapping`, `opus-4-8-no-thinking` (Direct-API). Pro Kata 5 hybrid-v4 + 5 hybrid-v4.4 + 5 v6.5. Quelle: [summary.md](summary.md), [runs.csv](runs.csv).

**Methodik-Hinweis:** Die beiden Katas werden **nie gemittelt** (claim-office Code-Mass ~870 vs game-of-life ~168) — jede hat ihren eigenen Block, der Workflow-Vergleich findet ausschliesslich *innerhalb* einer Kata statt.

## Übersicht

Spitzen-Komplexitaet `cognitive_max` als primaerer Code-Qualitaets-Indikator (kleiner = besser). 🏆 = bester Wert je Kata (Spread ≥ 1 σ).

| Kata | hybrid-v4 (Baseline) | hybrid-v4.4 (per-cycle) | hybrid-v5 (end-refactor) |
|---|---:|---:|---:|
| claim-office | 3.6 | 3.6 | **2.8** 🏆 |
| game-of-life | 5.6 | 3.2 | **2.4** 🏆 |

Auf **beiden** Katas hat hybrid-v5 die niedrigste Spitzen-Komplexitaet. Auf claim-office liegt hybrid-v4.4 gleichauf mit der hybrid-v4-Baseline (kein per-cycle-Gewinn), auf game-of-life sinkt `cognitive_max` monoton hybrid-v4 → hybrid-v4.4 → v6.5. Die Rangordnung weicht damit von der 4.7-Studie (RQ-1.12, dort hybrid-v4.4 robuster Spitzen-Sieger) ab — der wirksame Refactor-Hebel ist auch modellabhaengig.

---

## Kata claim-office (mehrteilige CLI-Codebasis: cli.ts + domain.ts)

Trophy 🏆 = bester Wert in der Spalte (Spread ≥ 1 σ); bei Ties alle. Korrektheits-Gating: Quality-/Kosten-Trophies nur fuer Zellen mit grüner Korrektheit. hybrid-v4 hat 1/5 Runs mit `verification_pct = 0` (echter CLI-Vertragsbruch, siehe F-1.13.2) — die hybrid-v4-Quality-Means schliessen diesen Run mit ein, ein 🏆 fuer hybrid-v4 wird aber nur vergeben, wo hybrid-v4 trotz des Ausreissers fuehrt.

### Korrektheit (höher = besser; primär)

| Workflow | `verification_pct` (rate %) | `tests_passing %` | `completed_within_budget %` |
|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 80 | **100** 🏆 | 80 |
| exact-hybrid-v4.4-metric-refactor-cc | **100** 🏆 | **100** 🏆 | **100** 🏆 |
| exact-hybrid-v5-end-refactor-cc | **100** 🏆 | **100** 🏆 | **100** 🏆 |

- `verification_pct` ist hier rate-basiert (Anteil Runs mit pct = 1.0). hybrid-v4: 4/5 perfekt, 1/5 bei 0.0. hybrid-v4.4 und hybrid-v5: 5/5 perfekt.
- hybrid-v4 `completed_within_budget` 80 % = 1 Timeout-Run (separat vom CLI-Vertragsbruch).

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `cc_avg_loc_per_function` | `code_mass` | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 3.6 | 4.0 | 24.6 | 4.24 | 895 | 1.0 |
| exact-hybrid-v4.4-metric-refactor-cc | 3.6 | 4.0 | **15.6** 🏆 | 4.44 | **843** 🏆 | **0.0** 🏆 |
| exact-hybrid-v5-end-refactor-cc | **2.8** 🏆 | **3.2** 🏆 | 16.0 | **3.81** 🏆 | 872.6 | **0.0** 🏆 |

- `mccabe_avg` (1.47 / 1.48 / 1.47) und `smell_complexity` (0/0/0) sind über alle drei Workflows praktisch identisch — kein Pokal, in der Tabelle weggelassen.
- `cc_longest_function`: hybrid-v4.4 (15.6) und hybrid-v5 (16.0) liegen innerhalb 1 σ zueinander; beide deutlich unter hybrid-v4 (24.6, σ 7.64).

### Kosten (kleiner = besser)

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) |
|---|---:|---:|
| exact-hybrid-v4-cleaned-cc | 4159 | **82.3 M** 🏆 |
| exact-hybrid-v4.4-metric-refactor-cc | **3064** 🏆 | 91.7 M |
| exact-hybrid-v5-end-refactor-cc | 3221 | 89.0 M |

- Alle drei Token-Means liegen innerhalb ~1 σ (σ je 13–33 M); der Token-Trophy fuer hybrid-v4 ist knapp und nicht robust.
- hybrid-v4-Wallclock-Mean (4159 s) ist durch den Timeout-Run (7201 s) nach oben gezogen; Median liegt niedriger.

---

## Kata game-of-life (einteilige Library, kein Cross-file-Hebel)

Alle 15 Runs gruen (`tests_passing` 5/5, `verification_pct` 1.0, `completed_within_budget` 5/5 je Workflow) — kein Korrektheits-Gating noetig, keine Bundle-Bruch-Spur. 🏆 = bester Wert je Spalte (Spread ≥ 1 σ).

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `cc_longest_function` | `cc_avg_loc_per_function` | `code_mass` | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 5.6 | 3.87 | 5.0 | 11.8 | 4.89 | 171.8 | 2.0 |
| exact-hybrid-v4.4-metric-refactor-cc | 3.2 | 2.7 | **3.6** 🏆 | **8.6** 🏆 | 4.75 | **164.2** 🏆 | **0.0** 🏆 |
| exact-hybrid-v5-end-refactor-cc | **2.4** 🏆 | **2.1** 🏆 | 3.4 | 9.4 | 4.76 | 168.4 | **0.0** 🏆 |

- `cognitive_max` 5.6 → 3.2 → 2.4 sinkt monoton; v6.5-Vorsprung gegen hybrid-v4 ≈ 2.3 σ (robust).
- `mccabe_max` 3.6 vs 3.4 (hybrid-v4.4/hybrid-v5) liegen innerhalb 1 σ zueinander; beide unter hybrid-v4 (5.0, σ 1.41).
- `code_mass` 171.8 / 164.2 / 168.4: alle innerhalb 1 σ (σ 10–19) — auf der kleinen Library **kein** Code-Mass-Unterschied zwischen den Workflows.
- `cc_avg_loc_per_function` 4.89 / 4.75 / 4.76: praktisch identisch.

### Kosten (kleiner = besser)

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) | σ Tokens |
|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | **579** 🏆 | **7.4 M** 🏆 | 1.7 M |
| exact-hybrid-v4.4-metric-refactor-cc | 679 | 9.2 M | 1.2 M |
| exact-hybrid-v5-end-refactor-cc | 747 | 9.0 M | 1.2 M |

- Kosten steigen monoton mit der Refactor-Intensitaet: hybrid-v5 +29 % Wallclock / +22 % Tokens, hybrid-v4.4 +17 % / +25 % gegen hybrid-v4. Der Refactor-Aufschlag ist robust (Spread > 1 σ).

---

## F-1.13.1 — exact-hybrid-v5-end-refactor-cc haelt die Korrektheit auf Opus 4.8; RQ-1.12-Kernbefund repliziert

Der zusaetzliche End-Refactor-Pass beschaedigt die Korrektheit auf **keiner** der beiden Katas. Alle 5/5 v6.5-Runs je Kata bestehen alle internen Vitest-Tests und erreichen `verification_pct = 1.0`; auf claim-office schreiben alle 5/5 `experiment-done.txt`. Das in RQ-1.9 / RQ-1.10 dokumentierte Bundle-Bruch-Muster (Self-Termination nach <½ der Baseline-Cycles, `verification_pct`-Kollaps bei intakten internen Tests) tritt auf dem neuen Modell **nicht** auf.

| Kata | Workflow | n | tests_passing | verification_pct (perfekt/n) | completed_within_budget |
|---|---|---:|:-:|:-:|:-:|
| claim-office | exact-hybrid-v4-cleaned-cc | 5 | 5/5 | 3/5 (+1 Timeout, +1 CLI-Bruch) | 4/5 |
| claim-office | exact-hybrid-v4.4-metric-refactor-cc | 5 | 5/5 | 5/5 | 5/5 |
| claim-office | exact-hybrid-v5-end-refactor-cc | 5 | 5/5 | **5/5** | 5/5 |
| game-of-life | exact-hybrid-v4-cleaned-cc | 5 | 5/5 | 5/5 | 5/5 |
| game-of-life | exact-hybrid-v4.4-metric-refactor-cc | 5 | 5/5 | 5/5 | 5/5 |
| game-of-life | exact-hybrid-v5-end-refactor-cc | 5 | 5/5 | **5/5** | 5/5 |

Plausibilisierung: der End-Refactor-Pass laeuft ausserhalb der TDD-Cycle-Dynamik mit stabilen Tests als Sicherheitsnetz; ein Refactoring, das die Tests rot faerbt, waere auf dem CLI-Verifikationspfad sofort sichtbar. hybrid-v5 ist auf 4.8 deckungsgleich mit der RQ-1.12-Beobachtung auf 4.7 (dort ebenfalls 5/5, verification_pct 0.99). Die `cycle_count`-Streuung von hybrid-v5 ist auf 4.8 besonders eng (claim-office σ 1.79, 36–40 Cycles; GoL σ 0.55, 8–9 Cycles) — der Workflow stabilisiert die Cycle-Zahl, statt frueh abzubrechen. Auf GoL feuert der End-Pass in jedem Run (211–256 `end-refactor`-Aufrufe im Transcript), ohne die Korrektheit zu beruehren.

---

## F-1.13.2 — Auf Opus 4.8 ist die nackte hybrid-v4-Baseline weniger robust als hybrid-v4.4/hybrid-v5; ein CLI-Vertragsbruch durch Workflow-Umgehung

Dieses Finding ist claim-office-spezifisch: der CLI-Vertrag wird nur dort gegen eine externe Verifikations-Suite geprueft. Auf game-of-life (vitest-intern, kein CLI-Entry-Point) sind alle 15 Runs perfekt, hybrid-v4 eingeschlossen — die Baseline-Schwaeche zeigt sich nur am externen CLI-Vertrag.

Anders als hybrid-v4.4 und hybrid-v5 (je 5/5 perfekt) hat hybrid-v4 auf claim-office × 4.8 zwei Nicht-perfekte Runs:

1. **CLI-Vertragsbruch (`verification_pct = 0.0`, `cli_built = false`):** Der Agent baute `src/cli.ts` mit einem selbst erfundenen `operation`-Dispatch-Feld im Input-Schema. Die Verifikations-Suite sendet das vereinbarte Schema ohne `operation` → alle 15 Szenarien antworten `Unknown operation: undefined`, exit 1. Die internen Tests (`quote`/`claim` direkt) bleiben gruen (`tests_passing = true`), nur der externe CLI-Vertrag ist verfehlt. Im Transcript begruendet der Agent dies explizit: *"this was a plain file-creation/wiring task, not a TDD cycle, so I created it directly rather than going through the red/green/refactor skills"* — er hat den CLI-Entry-Point bewusst am TDD-Workflow vorbei geschrieben und dabei den Vertrag falsch geraten.
2. **Timeout (`completed_within_budget = false`):** 1 Run lief in das Per-Run-Budget (7201 s); zaehlt als legitimer Befund, nicht als Fehler.

| Workflow | perfekt | CLI-Bruch (cli_built=false) | Timeout | tests_passing |
|---|:-:|:-:|:-:|:-:|
| exact-hybrid-v4-cleaned-cc | 3/5 | 1/5 | 1/5 | 5/5 |
| exact-hybrid-v4.4-metric-refactor-cc | 5/5 | 0/5 | 0/5 | 5/5 |
| exact-hybrid-v5-end-refactor-cc | 5/5 | 0/5 | 0/5 | 5/5 |

Plausibilisierung: hybrid-v4.4 und hybrid-v5 erben denselben Per-Cycle-Anteil wie hybrid-v4, ergaenzen aber einen deterministischen Mess-/Refactor-Schritt am Code (hybrid-v4.4 per Cycle, hybrid-v5 am Ende), der den ganzen `src/`-Baum noch einmal anfasst — inklusive `cli.ts`. Dieser zusaetzliche Whole-src-Kontakt kann den fehlerhaften CLI-Vertrag korrigieren, bevor der Run endet. Bei hybrid-v4 fehlt dieser zweite Blick. Mit n=5 ist das ein einzelner Datenpunkt und keine belastbare Rate — aber das Muster (4.8 nimmt sich beim CLI-Wiring Freiheiten, die der Vertrag nicht hergibt) deckt sich mit der modell-abhaengigen Drift, fuer die RQ-1.13 angelegt wurde.

---

## F-1.13.3 — Metric-driven Refactor lohnt auf beiden Katas; hybrid-v5 fuehrt bei Spitzen-Komplexitaet, hybrid-v4.4/hybrid-v5 sind sonst gleichauf — kein Workflow ist strikt besser

Beide Refactor-Varianten senken die Spitzen-Komplexitaet unter die hybrid-v4-Baseline, auf beiden Katas — **metric-driven Refactor lohnt sich**. Aber "strikt besser auf allen Quality-Metriken" gilt fuer keinen der beiden:

**claim-office (mehrteilig):**

| Metrik | hybrid-v4 | hybrid-v4.4 | hybrid-v5 | Lesart |
|---|---:|---:|---:|---|
| `cognitive_max` | 3.6 | 3.6 | **2.8** | hybrid-v4.4 = hybrid-v4 (kein per-cycle-Gewinn!); hybrid-v5 vorn |
| `mccabe_max` | 4.0 | 4.0 | **3.2** | hybrid-v5 vorn (σ 0–0.71) |
| `cc_longest_function` | 24.6 | **15.6** | 16.0 | hybrid-v4.4 ≈ hybrid-v5, beide ≪ hybrid-v4 |
| `cc_avg_loc_per_function` | 4.24 | 4.44 | **3.81** | hybrid-v5 vorn |
| `code_mass` | 895 | **843** | 872.6 | innerhalb σ (53–102) — schwach |
| `smell_total` | 1.0 | **0.0** | **0.0** | hybrid-v4.4 = hybrid-v5 |

**game-of-life (einteilig):**

| Metrik | hybrid-v4 | hybrid-v4.4 | hybrid-v5 | Lesart |
|---|---:|---:|---:|---|
| `cognitive_max` | 5.6 | 3.2 | **2.4** | sinkt monoton; hybrid-v5 ≈ 2.3 σ unter hybrid-v4 (robust) |
| `cognitive_avg` | 3.87 | 2.7 | **2.1** | sinkt monoton |
| `mccabe_max` | 5.0 | **3.6** | 3.4 | hybrid-v4.4 ≈ hybrid-v5, beide ≪ hybrid-v4 |
| `cc_longest_function` | 11.8 | **8.6** | 9.4 | hybrid-v4.4 ≈ hybrid-v5 |
| `code_mass` | 171.8 | **164.2** | 168.4 | innerhalb σ (10–19) — kein Unterschied |
| `smell_total` | 2.0 | **0.0** | **0.0** | hybrid-v4.4 = hybrid-v5 |

Zwei Punkte, an denen die Vermutung "hybrid-v4.4/hybrid-v5 strikt besser als hybrid-v4" bricht:

1. **`code_mass`**: auf beiden Katas liegen alle drei Workflows innerhalb 1 σ — der Refactor kauft **keine** kleinere Code-Mass. (Auf 4.7/GoL gewann hybrid-v4 hier sogar; auf 4.8 ist es ein Gleichstand.)
2. **`cognitive_max` auf claim-office**: hybrid-v4.4 (3.6) ist mit hybrid-v4 (3.6) **gleichauf** — der per-cycle-Refactor senkt die Spitzen-Komplexitaet auf der mehrteiligen Kata gar nicht; nur hybrid-v5 (2.8) und nur knapp.

Robust und kata-uebergreifend ist allein `smell_total` = 0 (hybrid-v4.4/hybrid-v5 deterministisch sauber gegen hybrid-v4-Restsmells 1.0 / 2.0) und der `cognitive_max`/`mccabe_max`-Vorsprung von v6.5. Die Rangordnung weicht von 4.7 (RQ-1.12) ab: dort war hybrid-v4.4 der robuste Spitzen-Sieger auf beiden Katas, hier ist es hybrid-v5 — der wirksame Refactor-Hebel ist modellabhaengig.

---

## F-1.13.4 — Kosten kata-abhaengig: auf claim-office alle drei innerhalb σ, auf game-of-life monoton steigend mit Refactor-Intensitaet

**claim-office** — anders als auf 4.7 (wo hybrid-v4.4 ~2.4× so viele Tokens wie hybrid-v4/hybrid-v5 brauchte) liegen alle drei eng beieinander:

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) | σ Tokens |
|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 4159 | 82.3 M | 32.7 M |
| exact-hybrid-v4.4-metric-refactor-cc | 3064 | 91.7 M | 31.5 M |
| exact-hybrid-v5-end-refactor-cc | 3221 | 89.0 M | 13.4 M |

Der v6.5-End-Pass erzeugt auf claim-office **keinen** nennenswerten Tokenaufschlag gegenueber hybrid-v4 (+8 % im Mean, klar innerhalb σ) und ist bei der Wallclock sogar guenstiger als hybrid-v4 (deren Mean der Timeout-Run hochzieht). v6.4s 4.7-Token-Strafe (~2.4×) repliziert auf 4.8 **nicht** — 4.8 fuehrt die Per-Cycle-Messungen offenbar deutlich token-sparsamer aus. hybrid-v5 hat zudem die mit Abstand engste Token- und Wallclock-Streuung (σ 13.4 M; Wallclock σ 378 s), d. h. die vorhersagbarsten Kosten der drei.

**game-of-life** — auf der kleinen Library steigen die Kosten dagegen monoton und robust (Spread > 1 σ):

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) | vs hybrid-v4 |
|---|---:|---:|---|
| exact-hybrid-v4-cleaned-cc | 579 | 7.4 M | — |
| exact-hybrid-v4.4-metric-refactor-cc | 679 | 9.2 M | +17 % s / +25 % tok |
| exact-hybrid-v5-end-refactor-cc | 747 | 9.0 M | +29 % s / +22 % tok |

Auf GoL zahlt der Refactor also einen klaren Aufschlag — und der End-Pass (hybrid-v5) ist hier am teuersten, fuer einen Komplexitaets-Gewinn, der gegenueber hybrid-v4.4 innerhalb σ liegt. Die fehlende Kosten-Spreizung auf claim-office ist Folge der dort dominierenden Per-Cycle-Dynamik (~35–41 Cycles) plus hoher Run-zu-Run-Streuung, die den Refactor-Aufschlag im Rauschen verschwinden laesst.

---

## F-1.13.5 — TDD-Disziplin auf 4.8 für alle drei Workflows intakt, auf beiden Katas

Cycle-Metriken bestaetigen, dass der Per-Cycle-Anteil auf 4.8 sauber laeuft:

| Kata | Metrik | hybrid-v4 | hybrid-v4.4 | hybrid-v5 |
|---|---|---:|---:|---:|
| claim-office | `cycle_count` | 33.6 | 40.8 | 37.8 |
| claim-office | `refactorings_applied` | 36.0 | 25.8 | 28.0 |
| claim-office | `predictions_correct_rate` | 99.7 % | 99.8 % | 99.5 % |
| claim-office | `tests_passed_immediately` | 16.2 | 12.0 | 11.2 |
| game-of-life | `cycle_count` | 8.8 | 9.0 | 8.4 |
| game-of-life | `refactorings_applied` | 5.6 | 7.6 | 7.2 |
| game-of-life | `predictions_correct_rate` | 98.6 % | 100 % | 97.6 % |
| game-of-life | `tests_passed_immediately` | 3.8 | 0.0 | 0.8 |

`predictions_correct_rate` liegt auf beiden Katas bei ~97.6–100 % (pooled) — Opus 4.8 trifft seine Red-Phase-Vorhersagen nahezu perfekt. Auf claim-office hat hybrid-v5 die engste `cycle_count`-Streuung (σ 1.79), die hybrid-v4-Streuung ist am groessten (σ 12.03), getrieben vom CLI-Bruch-Run (17 Cycles) und dem Timeout-Run. Der Per-Cycle-Anteil von hybrid-v5 ist byte-identisch zu hybrid-v4; die Cycle-Zahlen bestaetigen das (GoL 8.4 vs 8.8, claim-office 37.8 vs 33.6 — innerhalb σ). Keine Demotivation des Per-Cycle-Refactors durch das Wissen um den End-Pass nachweisbar.

---

## F-1.13.6 — Keine globale v6.5-Promotion auf 4.8; die F-1.12.2-Kata-Asymmetrie repliziert nur teilweise

Zusammengefuehrt ueber beide Katas:

| Achse | claim-office (mehrteilig) | game-of-life (einteilig) |
|---|---|---|
| bester Komplexitaets-Workflow | hybrid-v5 (`cognitive_max` 2.8); hybrid-v4.4 = hybrid-v4 | hybrid-v5 (2.4), monoton hybrid-v4 > hybrid-v4.4 > hybrid-v5 |
| End-Pass-Mehrwert (hybrid-v5 vs hybrid-v4.4) | knapp vorn bei `cognitive_max`/`mccabe_max` | knapp vorn bei `cognitive_max`, sonst σ-gleich |
| Code-Mass | alle drei innerhalb σ | alle drei innerhalb σ |
| Korrektheit | gehalten (hybrid-v5/hybrid-v4.4 5/5; hybrid-v4 3/5) | gehalten (alle 5/5) |
| Kosten | alle drei innerhalb σ | monoton steigend; hybrid-v5 am teuersten |

Auf beiden Katas schlagen hybrid-v4.4/hybrid-v5 die hybrid-v4-Baseline bei der Spitzen-Komplexitaet und beim `smell_total` — **metric-driven Refactor lohnt sich** und bricht die Korrektheit nicht. Aber kein Arm ist globaler Sieger, und hybrid-v5 ist **kein** genereller hybrid-v4-Ersatz:

- Der **End-Pass hybrid-v5** hat auf 4.8 die niedrigste Spitzen-Komplexitaet auf beiden Katas — anders als auf 4.7, wo er auf der einteiligen GoL-Library reines Rauschen war (F-1.12.2). Die dortige Kata-Asymmetrie repliziert also **nur teilweise**: der `cognitive_max`-Gewinn ueberlebt auf 4.8 auch auf GoL (2.4 vs 5.6, ≈ 2.3 σ). Was **nicht** ueberlebt, ist ein Code-Mass-Vorteil — der war auf 4.7/claim-office der eigentliche End-Pass-Mehrwert (−11 % Cross-file-Konsolidierung), und auf 4.8 liegt `code_mass` auf beiden Katas im σ-Rauschen. Der spezifische Cross-file-Hebel ist auf 4.8 also nicht mehr nachweisbar; was bleibt, ist eine allgemeine Komplexitaets-Senkung.
- Der **per-cycle-Refactor hybrid-v4.4** verliert auf 4.8 seine 4.7-Sonderrolle: auf claim-office senkt er `cognitive_max` gegenueber hybrid-v4 gar nicht (3.6 = 3.6), auf GoL bleibt er hinter v6.5.
- **hybrid-v4** bleibt die parsimonischste Wahl, wenn minimale Code-Mass/Kosten Vorrang haben (besonders auf GoL, wo hybrid-v4 die guenstigsten Kosten hat) — sie ist auf claim-office aber am wenigsten robust (CLI-Vertragsbruch, F-1.13.2).

Die Empfehlung bleibt aufgaben-/modell-abhaengig und reiht sich in das wiederkehrende "Kata-abhaengige Empfehlung"-Muster ein (vgl. RQ-1.4, RQ-1.8/1.9, F-1.12.5): kein Refactor-Workflow generalisiert sauber ueber Kata-Typen **und** Modelle.

---

## Operative Lehren (nicht-RQ-Findings)

- **opus-4-8 Direct-API: transienter Portkey-400 beim ersten Call.** Der v6.5-Smoke-Run starb initial an `API Error: 400 Either x-portkey-config or x-portkey-provider header is required` (exit 1, kein `429` → keine run-batch.sh-Retry-Erfassung). Ein identischer Wiederholungslauf lief sauber durch; zwei weitere opus-4-8-Runs am selben Tag waren ebenfalls grün. Der 400er ist transient/konfig-abhaengig, kein deterministischer Modell- oder Routing-Defekt. Der `MODEL_CONFIGS`-Kommentar in `run-batch.sh` ("Env-Vars blanked → native OAuth") ist veraltet — opus-4-8 laeuft faktisch ueber dieselbe Portkey-`.env`-Route wie 4.7, nur mit nacktem Modell-Label. Folgerisiko: ein 400er in einem Multi-Run-Batch bleibt ersatzlos liegen (kein Auto-Retry). Wer das vermeiden will, muss `400 x-portkey-config` in der run-batch.sh-Transient-Detection ergaenzen.
- **TDD-Marker stehen in `metrics.json` unter `summary_metrics`, nicht unter `final_metrics`.** `final_metrics.cycle_count`/`.refactorings_applied`/`.predictions_*` existieren als Keys gar nicht — `final_metrics` traegt nur Code-/Korrektheits-Metriken (lines_of_code, code_mass, cognitive_*, mccabe_*, tests_passing, verification_*). Die TDD-Disziplin-Felder liegen im Geschwister-Block `summary_metrics` (cycle_count, refactorings_applied, predictions_correct/total), und `aggregate-by-query.py` liest sie korrekt von dort (`sm = metrics.get("summary_metrics")`). Das ist der Normalzustand (auch die 4.7-Runs aus RQ-1.12 zeigen ihn), kein Bug — ein Spot-Check, der `jq .final_metrics.cycle_count` prueft, bekommt faelschlich `null` und sieht aus wie eine stille Null-Metrik; korrekt ist `jq .summary_metrics.cycle_count`.
- **Routing-Konfundierung gegenüber RQ-1.12:** opus-4-8 (Direct-API) und die RQ-1.12-Zahlen (opus-4-7-Portkey/Vertex-EU) teilen keine Zelle. Cross-RQ-Vergleiche der Absolutwerte (z. B. hybrid-v5 code_mass 780 auf 4.7 vs 872 auf 4.8) sind routing- UND modell-konfundiert und nur als Kontext zu lesen, nicht als reiner Modell-Effekt.
