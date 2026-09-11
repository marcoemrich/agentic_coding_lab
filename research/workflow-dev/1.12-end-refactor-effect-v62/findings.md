# RQ-end-refactor-v62 — Findings

Liefert ein metric-driven Refactor-Pass einen Code-Qualitaets-Gewinn ueber die hybrid-v4-Per-Cycle-Baseline — und greift der Hebel besser **laufend** (hybrid-v4.4 per-cycle) oder als **einmaliger Whole-src-End-Pass** (hybrid-v5)? Geprueft auf zwei Kata-Typen: mehrteilige CLI-Codebasis **claim-office** (cli.ts + domain.ts) und einteilige Library **game-of-life**.

Daten: 43 Runs, `example-mapping`, opus-4-7. Quelle: [summary.md](summary.md), [runs.csv](runs.csv).

**Methodik-Hinweis:** Die beiden Katas werden **nie gemittelt** (claim-office Code-Mass ~800 vs game-of-life ~160) — jede hat ihren eigenen Block, der Workflow-Vergleich findet ausschliesslich *innerhalb* einer Kata statt. opus-4-7 lief ueber zwei Routings (portkey/native), als dasselbe Modell behandelt: Code-Qualitaet und Korrektheit sind routing-invariant, `duration_seconds`/`total_tokens` nicht (Hardware/Caching) → Kosten pro Routing getrennt, Kosten-Trophies nur innerhalb gleichen Routings.

## Übersicht

Spitzen-Komplexitaet `cognitive_max` als primaerer Code-Qualitaets-Indikator (kleiner = besser). 🏆 = bester Wert je Kata (Spread ≥ 1 σ).

| Kata | hybrid-v4 (Baseline) | hybrid-v4.4 (per-cycle) | hybrid-v5 (end-refactor) |
|---|---:|---:|---:|
| claim-office | 5.0 | **2.4** 🏆 | 2.8 |
| game-of-life | 4.0 | **2.2** 🏆 | 3.0 |

Auf **beiden** Katas senkt der per-cycle-Refactor hybrid-v4.4 die Spitzen-Komplexitaet am staerksten. hybrid-v5 liegt dazwischen — auf claim-office nahe hybrid-v4.4, auf GoL nahe der Baseline (F-1.12.1 / F-1.12.2).

---

## Kata claim-office (mehrteilige CLI-Codebasis: cli.ts + domain.ts)

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `mccabe_avg` | `cc_longest_function` | `cc_avg_loc_per_function` | Code-Mass (APP) | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 5.00 | 1.91 | 4.50 | 1.53 | 12.4 | 4.22 | 878.5 | 0.38 |
| exact-hybrid-v4.4-metric-refactor-cc | **2.40** 🏆 | **1.27** 🏆 | **3.00** 🏆 | 1.40 | 13.0 | 4.37 | 804.6 | **0.00** 🏆 |
| exact-hybrid-v5-end-refactor-cc | 2.80 | 1.39 | 3.40 | **1.44** | **11.0** 🏆 | **3.66** 🏆 | **780.4** 🏆 | **0.00** 🏆 |

- `mccabe_avg`-Spread 1.53→1.40→1.44 ist < 1 σ — kein Pokal.
- `smell_total`-Tie: hybrid-v4.4 und hybrid-v5 beide 0; hybrid-v4 hat 3 von 8 Runs mit smell ≥ 1.

### Korrektheit + Disziplin (Korrektheit höher = besser)

| Workflow | `tests_passing %` | `verification_pct` (Mean / Min) | `cycle_count` | `refactorings_applied` | `predictions_correct_rate %` |
|---|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | **100** 🏆 | 0.96 / 0.73 | 37.4 | 24.9 | **97.2** 🏆 |
| exact-hybrid-v4.4-metric-refactor-cc | **100** 🏆 | **0.99** 🏆 / 0.93 | 40.2 | 30.4 | 89.6 |
| exact-hybrid-v5-end-refactor-cc | **100** 🏆 | **0.99** 🏆 / 0.93 | 35.8 | 23.6 | 94.4 |

### Kosten (pro Routing getrennt — kleiner = besser)

| Workflow | Routing | n | `duration_s` | `total_tokens` |
|---|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | portkey | 8 | 2530 | 44.4 M |
| exact-hybrid-v5-end-refactor-cc | portkey | 5 | 3014 | 42.4 M |
| exact-hybrid-v4.4-metric-refactor-cc | native | 5 | 5284 | 102.3 M |

Kosten-Trophy bewusst **nicht** vergeben: hybrid-v4.4 lief native, hybrid-v4/hybrid-v5 portkey — kein routing-sauberer Vergleich. Innerhalb portkey ist hybrid-v5 (42.4 M, 3014 s) gegen die hybrid-v4-Baseline (44.4 M, 2530 s) token-gleichauf bei ~+19 % Wallclock — der reine End-Pass-Aufschlag. Der hohe hybrid-v4.4-Absolutwert ist routing-konfundiert, die hohe Streuung aber real (F-1.12.4).

---

## Kata game-of-life (einteilige Library, kein Cross-file-Hebel)

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `cc_longest_function` | `cc_avg_loc_per_function` | Code-Mass (APP) | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 4.00 | 2.83 | 4.13 | 11.47 | 4.75 | **153.8** 🏆 | 2.13 |
| exact-hybrid-v4.4-metric-refactor-cc | **2.20** 🏆 | **1.83** 🏆 | 3.40 | **8.40** 🏆 | 4.66 | 168.4 | **0.00** 🏆 |
| exact-hybrid-v5-end-refactor-cc | 3.00 | 2.20 | **3.20** | 9.80 | **4.08** | 168.0 | **0.00** 🏆 |

- `mccabe_max` 4.13→3.40→3.20: alle innerhalb 1 σ → kein robuster Sieger.
- hybrid-v4 hat die kleinste Code-Mass (beide Refactor-Varianten fuegen auf der winzigen Library netto Code zu).

### Korrektheit + Disziplin (Korrektheit höher = besser)

| Workflow | `tests_passing %` | `verification_pct` | `cycle_count` | `refactorings_applied` | `predictions_correct_rate %` |
|---|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | **100** 🏆 | **1.0** 🏆 | 8.6 | 8.2 | **100** 🏆 |
| exact-hybrid-v4.4-metric-refactor-cc | **100** 🏆 | **1.0** 🏆 | 9.4 | 9.4 | 98.9 |
| exact-hybrid-v5-end-refactor-cc | **100** 🏆 | **1.0** 🏆 | 9.6 | 9.6 | **100** 🏆 |

### Kosten (pro Routing getrennt — kleiner = besser)

| Workflow | Routing | n | `duration_s` | `total_tokens` |
|---|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | native | 5 | 898 | 10.1 M |
| exact-hybrid-v4.4-metric-refactor-cc | native | 5 | 1064 | 11.0 M |
| exact-hybrid-v5-end-refactor-cc | native | 5 | 1332 | 12.3 M |
| exact-hybrid-v4-cleaned-cc | portkey | 10 | 627 | 8.3 M |

Unter **native** (vergleichbar): hybrid-v4.4 +18 % Wallclock / +9 % Tokens, hybrid-v5 +48 % / +22 % gegen hybrid-v4 — hybrid-v4.4 holt den Komplexitaets-Gewinn guenstiger. Die portkey-hybrid-v4-Zeile ist nur informativ; die niedrigere Wallclock ist Routing-Effekt (anderes Caching), kein Workflow-Effekt.

---

## F-1.12.1 — Auf beiden Katas ist der per-cycle-Refactor hybrid-v4.4 der robuste Spitzen-Komplexitaets-Sieger

Der laufende metric-driven Refactor (hybrid-v4.4) senkt `cognitive_max` und `cognitive_avg` auf **beiden** Kata-Typen am staerksten unter die hybrid-v4-Baseline:

| Metrik | Kata | hybrid-v4 | hybrid-v4.4 | hybrid-v5 | hybrid-v4.4 vs hybrid-v4 |
|---|---|---:|---:|---:|---|
| `cognitive_max` | claim-office | 5.0 | **2.4** | 2.8 | −2.6 (≈ 1.5 σ) **robust** |
| `cognitive_max` | game-of-life | 4.0 | **2.2** | 3.0 | −1.8 (> 1 σ) **robust** |
| `cognitive_avg` | claim-office | 1.91 | **1.27** | 1.39 | −0.64 (≈ 1 σ) **robust** |
| `cognitive_avg` | game-of-life | 2.83 | **1.83** | 2.2 | −1.0 (> 1 σ) **robust** |

Der Effekt ist kata-uebergreifend stabil: ein Refactor, der in *jedem* Cycle lokal die gerade entstandene Komplexitaet abbaut, haelt die Spitzen-Komplexitaet niedriger als sowohl die refactor-arme Baseline als auch der einmalige End-Pass. Auf claim-office stuetzt die groessere hybrid-v4-Stichprobe (n=8) den Baseline-Wert; auf GoL hat hybrid-v4.4 die niedrigste Streuung aller drei Arme (σ 0.84) — der Gewinn ist dort stabil ueber alle 5 Runs.

Korrektheit bleibt dabei unangetastet (F-1.12.3): das Bundle-Bruch-Risiko aus RQ-1.9/1.10 tritt bei keiner Variante auf.

---

## F-1.12.2 — Der End-Refactor hybrid-v5 wirkt nur auf der mehrteiligen Codebasis; auf der einteiligen Library ist er Rauschen

Der einmalige Whole-src-End-Pass (hybrid-v5) verhaelt sich kata-abhaengig:

- **claim-office** (cli.ts + domain.ts): hybrid-v5 ist mit hybrid-v4.4 weitgehend gleichauf (`cognitive_max` 2.8 vs 2.4, Spread < 1 σ) und liefert die **kleinste** Code-Mass (780.4 vs hybrid-v4 878.5, −11 %, Δ ≈ 1.1 σ), die **kuerzeste** Funktion (`cc_longest_function` 11.0, −11 %) und die **kompakteste** durchschnittliche Funktion (`cc_avg_loc_per_function` 3.66, −13 %, Δ ≈ 1.5 σ). Hier hat der Whole-src-Blick echte Cross-file-Substanz zu konsolidieren — Funktion-Inlining und Parameter-Destructuring ueber Dateigrenzen sind in den Run-Logs explizit dokumentiert ("inlined `processStep` into `run`", "destructured `processClaim` parameters").
- **game-of-life** (einteilig): hybrid-v5 `cognitive_max` 3.0 ist von hybrid-v4 (4.0) statistisch ununterscheidbar — gepraegt von einem Ausreisser (4 von 5 Runs = 2, einer = 7; σ 2.24). Code-Mass steigt sogar (168.0 vs 153.8). Auf der winzigen Library gibt es keine Cross-file-Duplication, an der der End-Pass ansetzen koennte.

Der einzige kata-uebergreifend robuste v6.5-Vorteil ist `smell_total` = 0 (deterministisch, wie hybrid-v4.4) gegen die hybrid-v4-Restsmells (claim-office 0.38, GoL 2.13).

Mechanismus-Lesart: hybrid-v4.4 (per-cycle) und hybrid-v5 (whole-src-end) sind auf der mehrteiligen Kata **komplementaer** — hybrid-v4.4 fokussiert lokale Spitzen-Komplexitaet in der gerade beruehrten Funktion, hybrid-v5 die Cross-file-Konsolidierung (kuerzere durchschnittliche Funktion, geringere Code-Mass). Eine Folge-RQ koennte hybrid-v6 = hybrid-v4.4 + End-Refactor testen, ob sich beide Mechanismen addieren.

---

## F-1.12.3 — Korrektheit und TDD-Disziplin überall intakt; kein Bundle-Bruch

Keine Zelle bricht: `tests_passing` = 100 % ueberall, `verification_pct` claim-office 0.96–0.99 / GoL 1.0. Auf claim-office schreiben alle 5/5 v6.5-Runs `experiment-done.txt` und erreichen `verification_pct ≥ 0.93` (Mean 0.99, identisch zu hybrid-v4.4). Das in RQ-1.9/RQ-1.10 dokumentierte Bundle-Bruch-Risiko tritt **nicht** auf — beide Refactor-Varianten lassen die Korrektheit unangetastet.

Plausibilisierung: der End-Refactor-Pass laeuft ausserhalb der TDD-Cycle-Dynamik mit stabilen Tests als Sicherheitsnetz; ein test-rot faerbendes Refactoring waere auf dem CLI-Verifikationspfad sofort sichtbar.

TDD-Disziplin bleibt erhalten. Der Per-Cycle-Anteil von hybrid-v5 ist byte-identisch zu hybrid-v4, und die Cycle-Metriken bestaetigen das (claim-office `cycle_count` 35.8 vs 37.4, `refactorings_applied` 23.6 vs 24.9, `predictions_correct_rate` 94.4 % vs 97.2 % — alle innerhalb 1 σ). Keine Demotivation des Per-Cycle-Refactors durch das Wissen um den End-Pass nachweisbar. Der niedrigere claim-office-v6.4-`predictions_correct_rate` (89.6 % gepoolt) ist Stichproben-Streuung, kein Disziplin-Bruch.

---

## F-1.12.4 — Kosten steigen monoton mit der Refactor-Intensität; per-cycle ist auf großen Codebasen kosten-unvorhersehbar

Kosten sind nur **innerhalb gleichen Routings** vergleichbar. Auf game-of-life (alle native) steigt die Wallclock monoton mit dem Refactor-Aufwand:

| Workflow (GoL, native) | `duration_s` | vs hybrid-v4 | `total_tokens` | vs hybrid-v4 |
|---|---:|---|---:|---|
| exact-hybrid-v4-cleaned-cc | 898 | — | 10.1 M | — |
| exact-hybrid-v4.4-metric-refactor-cc | 1064 | +18 % | 11.0 M | +9 % |
| exact-hybrid-v5-end-refactor-cc | 1332 | +48 % | 12.3 M | +22 % |

Auf der kleinen GoL-Library zahlt der End-Pass hybrid-v5 den hoechsten Aufschlag fuer den schwaechsten Effekt (F-1.12.2); hybrid-v4.4 ist dort das guenstigere Vehikel fuer den Komplexitaets-Gewinn.

Auf claim-office ist der Direkt-Vergleich routing-konfundiert (hybrid-v4.4 native, hybrid-v4/hybrid-v5 portkey), aber ein realer Workflow-Effekt bleibt sichtbar: die native-hybrid-v4.4-Zelle verbraucht ~102 M Tokens (max 9197 s Wallclock) mit grosser Streuung (σ 17 M). Der per-cycle-Refactor misst ESLint + McCabe pre/post in *jedem* der ~40 Cycles und schleift jedesmal den vollen Build plus einen Modell-Roundtrip durch — auf der grossen CLI-Codebasis divergiert das stark. Der gedeckelt-iterative End-Pass (hybrid-v5) ist demgegenueber kosten-vorhersehbarer. **Lesart:** per-cycle-Refactor ist auf grossen Codebasen kosten-unvorhersehbarer als der End-Pass — bei harter Token-/Wallclock-Bremse ist hybrid-v5 das berechenbarere Vehikel.

---

## F-1.12.5 — Keine globale v6.5-Baseline-Promotion; metric-driven Refactor lohnt, der wirksame Hebel-Zeitpunkt ist kata-abhängig

Zusammengefuehrt:

| Achse | claim-office (mehrteilig) | game-of-life (einteilig) |
|---|---|---|
| bester Komplexitaets-Workflow | hybrid-v4.4 (per-cycle), hybrid-v5 nah dran | hybrid-v4.4 (per-cycle), hybrid-v5 = Rauschen |
| End-Pass-Mehrwert (hybrid-v5 vs hybrid-v4.4) | gleichauf + kleinste Code-Mass | keiner, Code-Mass steigt |
| Korrektheit | gehalten (≥ 0.96) | gehalten (1.0) |
| Kosten | hybrid-v4.4 streut stark; hybrid-v5 berechenbar | hybrid-v4.4 +18 %, hybrid-v5 +48 % (native) |

Beide Refactor-Varianten schlagen die hybrid-v4-Baseline bei der Spitzen-Komplexitaet — **metric-driven Refactor lohnt sich** und bricht die Korrektheit nicht. Aber kein Arm ist globaler Sieger:

- Der **per-cycle-Refactor hybrid-v4.4** ist der robusteste Komplexitaets-Hebel ueber beide Kata-Typen — zum Preis hoher, auf grossen Codebasen schlecht vorhersehbarer Kosten.
- Der **End-Refactor hybrid-v5** zahlt sich nur dort aus, wo es Cross-file-Substanz zu konsolidieren gibt (mehrteilige Codebasen): dort liefert er die kleinste Code-Mass bei berechenbareren Kosten. Auf einteiligen Aufgaben ist er voller Aufschlag fuer keinen robusten Gewinn.
- **hybrid-v4** bleibt die parsimonischste Wahl, wenn minimale Code-Mass/Kosten Vorrang vor minimaler Spitzen-Komplexitaet haben (besonders auf kleinen Katas).

hybrid-v5 ist damit **kein** genereller hybrid-v4-Ersatz. Die Empfehlung ist aufgaben-/kata-abhaengig und reiht sich in das wiederkehrende "Kata-abhaengige Empfehlung"-Muster ein (vgl. RQ-1.4, RQ-1.8/1.9): kein Refactor-Workflow-Sieger generalisiert ueber Kata-Typen.

---

## Operative Lehren (nicht-RQ-Findings)

- **External-Session-Cut blieb sichtbar:** 1 von 6 v6.5-Run-Attempts (16 %) lief in einen externen Session-Cut (Run vom 28-05 00:19; `exit=0`, aber `experiment-done.txt` fehlt, `run.log` mid-Red abgebrochen, 6 min Wallclock vs. 37 min Baseline, `end-refactor` nie aufgerufen). Die `run-batch.sh`-Cap-Detection vom 27-05 hat ihn nicht erkannt, weil keine Cap-Signatur im run.log auftauchte — vermutlich Vertex-side cut. Im Refill-Batch (28-05 06:01) hat dieselbe Detection eine andere Session als external cut erkannt und automatisch retry'd; der Retry lief sauber durch. Detection-Heuristik trifft also einen Teil, nicht alle Fälle.
- **Aggregator-Skip-Konvention:** Invalidated runs müssen mit `_` *prefixed* werden (z.B. `_invalidated_<original>_<reason>`). Suffix-`__invalidated` reicht nicht — `aggregate-by-query.py` und `batch-plan-from-rq.py` skippen nur Dirs, die mit `_` beginnen.
- **Container vs. Host analyze-run:** der Refill-Run hatte `analyze_status=ok` im Container, aber `final_metrics.*` waren null. Host-`analyze-run.sh <run_dir>` (mit absolutem Pfad) hat alle Werte nachgetragen. Vor `aggregate-by-query.py` immer mit `jq '.final_metrics.code_mass' …` stichprobenartig prüfen.
- **Routing-gemischte Zellen (game-of-life):** seit dem Merge mit der vormaligen RQ-1.14 enthalten die GoL-Zellen sowohl native (RQ-1.14-Fill) als auch portkey Runs (aeltere Workflow-Dev-Runs). opus-4-7 wird als dasselbe Modell behandelt; nur Kosten-Metriken werden pro Routing getrennt gelesen. Zwei kaputte GoL-v6.5-portkey-Runs (`model may not exist`, 0 cycles) wurden beim Merge aus dem Pool entfernt.
