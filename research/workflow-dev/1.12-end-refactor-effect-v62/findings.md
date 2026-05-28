# RQ-end-refactor-v62 — Findings

Verbessert ein zusätzlicher iterativer End-Refactor-Pass über die ganze `src/` (v6.5-end-refactor) die Code-Qualität auf claim-office gegenüber dem Per-Cycle-Baseline-Workflow (v6.2-with-why-cleaned) und dem rein per-cycle metric-driven Refactor (v6.4-metric-driven-refactor) — ohne Korrektheit oder TDD-Disziplin zu beschädigen?

Daten: 8 v6.2 + 5 v6.4 + 5 v6.5, alle `claim-office-example-mapping`, alle `opus-4-7-portkey-no-thinking` (Portkey-Gateway via Vertex EU). Quelle: [summary.md](summary.md), [runs.csv](runs.csv).

## Übersicht

Aggregierte Means pro Outcome. Trophy 🏆 = bester Wert in der Spalte (Spread ≥ 1 σ); bei Ties alle. Korrektheits-Gating: Quality-/Kosten-Trophies werden nur vergeben, wenn `verification_pct` und `tests_passing` der Zelle "grün" sind (alle drei Workflows hier erfüllen das, also kein Filter aktiv).

### Code-Qualität (kleiner = besser)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `mccabe_avg` | `cc_longest_function` | `cc_avg_loc_per_function` | `code_mass` | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 5.00 | 1.91 | 4.50 | 1.53 | 12.4 | 4.22 | **878.5** ↑ | 0.38 |
| v6.4-metric-driven-refactor | **2.40** 🏆 | **1.27** 🏆 | **3.00** 🏆 | 1.40 | 13.0 | 4.37 | 804.6 | **0.00** 🏆 |
| v6.5-end-refactor | 2.80 | 1.39 | 3.40 | **1.44** | **11.0** 🏆 | **3.66** 🏆 | **780.4** 🏆 | **0.00** 🏆 |

- `mccabe_avg`-Spread 1.53→1.40→1.44 ist < 1 σ aller Zellen — kein Pokal, alle innerhalb des Rauschens.
- `smell_total`-Tie: v6.4 und v6.5 beide bei 0; v6.2 hat 3 von 8 Runs mit smell≥1.

### Korrektheit (höher = besser; Sanity)

| Workflow | `tests_passing %` | `verification_pct` (Mean) | `verification_pct` (Min) | `completed_within_budget %` |
|---|---:|---:|---:|---:|
| v6.2-with-why-cleaned | **100** 🏆 | 0.96 | 0.73 | **100** 🏆 |
| v6.4-metric-driven-refactor | **100** 🏆 | **0.99** 🏆 | 0.93 | **100** 🏆 |
| v6.5-end-refactor | **100** 🏆 | **0.99** 🏆 | 0.93 | **100** 🏆 |

### TDD-Disziplin (Sanity, kein einzelner Pokal)

| Workflow | `cycle_count` (Mean) | `refactorings_applied` (Mean) | `predictions_correct_rate %` | `tests_passed_immediately` (Mean) |
|---|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 37.4 | 24.9 | **97.2** 🏆 | 15.1 |
| v6.4-metric-driven-refactor | 40.2 | 30.4 | 89.6 | 7.0 |
| v6.5-end-refactor | 35.8 | 23.6 | 94.4 | 14.6 |

### Kosten (kleiner = besser)

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) |
|---|---:|---:|
| v6.2-with-why-cleaned | **2530** 🏆 | **44.4 M** 🏆 |
| v6.4-metric-driven-refactor | 5284 | 102.3 M |
| v6.5-end-refactor | 3014 | **42.4 M** 🏆 |

- Token-Trophy-Tie: v6.5 (42.4 M) liegt knapp unter v6.2 (44.4 M) — Spread < 1 σ.

---

## F-1.12.1 — v6.5-end-refactor hält Korrektheit; H1 bestätigt

Der zusätzliche End-Refactor-Pass beschädigt die Korrektheit auf claim-office nicht. Alle 5/5 v6.5-Runs schreiben `experiment-done.txt`, bestehen alle internen Vitest-Tests und erreichen `verification_pct ≥ 0.93` (Mean 0.99, identisch zu v6.4 und +0.03 über v6.2 — innerhalb 1 σ). Das in RQ-1.9/RQ-1.10 dokumentierte Bundle-Bruch-Risiko ist hier nicht aufgetreten.

| Workflow | n | tests_passing | verification_pct (Mean / Min) | completed_within_budget |
|---|---:|:-:|---:|:-:|
| v6.2-with-why-cleaned | 8 | 8/8 (100 %) | 0.96 / 0.73 | 8/8 |
| v6.4-metric-driven-refactor | 5 | 5/5 (100 %) | 0.99 / 0.93 | 5/5 |
| v6.5-end-refactor | 5 | 5/5 (100 %) | **0.99 / 0.93** | 5/5 |

Plausibilisierung: der End-Refactor-Pass läuft außerhalb der TDD-Cycle-Dynamik mit stabilen Tests als Sicherheitsnetz. Wenn der Pass ein Refactoring versucht, das die Tests rot färbt, wäre das auf dem CLI-Verifikationspfad sofort sichtbar — ist es nicht.

---

## F-1.12.2 — v6.5 reduziert `code_mass` und Funktions-Länge gegenüber v6.2; partielle H2-Bestätigung

Der End-Refactor liefert messbar kompakteren Code gegenüber dem Per-Cycle-Baseline:

- **`code_mass`** v6.2 → v6.5: 878.5 → **780.4** (−11 %, Δ ≈ 1.1 σ).
- **`cc_longest_function`** v6.2 → v6.5: 12.4 → **11.0** (−11 %, Δ ≈ 1.0 σ).
- **`cc_avg_loc_per_function`** v6.2 → v6.5: 4.22 → **3.66** (−13 %, Δ ≈ 1.5 σ).
- **`cognitive_max`** v6.2 → v6.5: 5.0 → 2.8 (−44 %, Δ ≈ 1.3 σ — stärkster Einzeleffekt).
- **`mccabe_max`** v6.2 → v6.5: 4.5 → 3.4 (−24 %, Δ ≈ 1.4 σ).

| Workflow | code_mass | cognitive_max | mccabe_max | cc_longest_function |
|---|---:|---:|---:|---:|
| v6.2-with-why-cleaned | 878.5 | 5.0 | 4.5 | 12.4 |
| v6.5-end-refactor | **780.4** 🏆 | **2.8** | **3.4** | **11.0** 🏆 |

Plausibilisierung: der End-Pass sieht die ganze `src/` (cli.ts + domain.ts) statt nur den im aktuellen Cycle berührten Code. Funktion-Inlining und Parameter-Destructuring über Dateigrenzen sind in den Run-Logs explizit dokumentiert ("inlined `processStep` into `run`", "destructured `processClaim` parameters"). Das deckt sich mit der Hypothese, dass Per-Cycle-Scope Cross-file-Vereinfachungen verpasst.

---

## F-1.12.3 — v6.4 und v6.5 sind auf Code-Qualität nahezu gleichauf; H3 partiell

v6.5 schlägt v6.4 nicht systematisch. Beide Workflows holen einen ähnlichen Code-Qualitäts-Gewinn gegenüber v6.2 — über unterschiedliche Mechanismen:

| Metrik | v6.4 | v6.5 | Δ (v6.4 − v6.5) | Sieger (innerhalb 1 σ?) |
|---|---:|---:|---:|---|
| `cognitive_max` | 2.4 | 2.8 | −0.4 | v6.4 knapp (σ_v6.4=1.34, σ_v6.5=0.84 — innerhalb) |
| `cognitive_avg` | 1.27 | 1.39 | −0.12 | v6.4 knapp (innerhalb) |
| `mccabe_max` | 3.0 | 3.4 | −0.4 | v6.4 knapp (innerhalb) |
| `cc_longest_function` | 13.0 | 11.0 | +2.0 | **v6.5** (σ_v6.4=3.08; Spread ≈ 1 σ) |
| `cc_avg_loc_per_function` | 4.37 | 3.66 | +0.71 | **v6.5** (σ_v6.4=0.52; Spread > 1 σ) |
| `code_mass` | 804.6 | 780.4 | +24 | v6.5 knapp (σ_v6.5=60; innerhalb) |
| `smell_total` | 0.00 | 0.00 | 0 | Tie |

Plausibilisierung: v6.4 fokussiert Per-Cycle auf Spitzen-Komplexität in der gerade berührten Funktion und gewinnt entsprechend bei `cognitive_max`/`mccabe_max`. v6.5 zielt mit dem Whole-src-End-Pass eher auf Cross-file-Konsolidierung (kürzere durchschnittliche Funktion, geringerer code_mass) und kann die Spitzen-Komplexität in einzelnen Funktionen nicht ganz so aggressiv senken, weil die Tests dann schon final sind und revertierte Versuche kostspielig wären.

Praktische Lesart: die beiden Designs sind **komplementär**, nicht redundant. Eine Folge-RQ könnte v6.6 = v6.4 + End-Refactor testen, um zu prüfen, ob beide Mechanismen sich addieren.

---

## F-1.12.4 — v6.5 ist ~43 % schneller und braucht ~58 % weniger Tokens als v6.4; v6.5-Aufschlag über v6.2 nur ~19 % Wallclock, Tokens gleichauf

Bei nahezu gleicher Code-Qualität ist v6.5 deutlich günstiger als v6.4:

| Workflow | `duration_seconds` (Mean) | `total_tokens` (Mean) | Tokens-Δ vs v6.5 | Wallclock-Δ vs v6.5 |
|---|---:|---:|---:|---:|
| v6.2-with-why-cleaned | **2530** 🏆 | **44.4 M** | +5 % | −16 % |
| v6.4-metric-driven-refactor | 5284 | 102.3 M | +141 % | +75 % |
| v6.5-end-refactor | 3014 | **42.4 M** 🏆 | — | — |

Token-Aufschlag von v6.5 gegenüber v6.2 ist **vernachlässigbar** (sogar minimal niedriger im Mean, σ ≈ 5 M). Wallclock-Aufschlag +19 % ist der reine End-Pass (Mean 137 s in Run 1, höher in späteren Runs).

Plausibilisierung: v6.4 misst ESLint + McCabe pre/post *in jedem einzelnen Cycle* (Mean 40 cycles). Jede Messung schleift den vollen Build durch und füttert die Ergebnisse in einen weiteren Modell-Roundtrip. v6.5 macht diese Pre/Post-Messung einmal am Ende (1 Pass über alle 5 Runs, je 1× aufgerufen). Das erklärt die ~2.4× höheren Tokens und Wallclock-Werte von v6.4 — der Per-Cycle-Mechanismus zahlt für seinen Code-Qualitäts-Gewinn.

Praktische Lesart: für Workloads mit harter Token-/Wallclock-Bremse ist **v6.5 das günstigere Vehikel** für vergleichbare Code-Qualität. v6.4 lohnt sich nur, wenn die letzten paar Punkte `cognitive_max`/`mccabe_max` kritisch sind.

---

## F-1.12.5 — TDD-Disziplin in v6.5 fast deckungsgleich mit v6.2; H4 bestätigt

Per-Cycle-Anteil von v6.5 ist byte-identisch zu v6.2 (siehe RQ-README, Tabelle der drei geänderten Dateien). Die Cycle-Metriken bestätigen das:

| Metrik | v6.2 | v6.5 | Δ | Innerhalb 1 σ? |
|---|---:|---:|---:|:-:|
| `cycle_count` | 37.4 | 35.8 | −1.6 | ✓ (σ_v6.2=1.6, σ_v6.5=5.3) |
| `refactorings_applied` | 24.9 | 23.6 | −1.3 | ✓ (σ_v6.5=8.5) |
| `predictions_correct_rate` | 97.2 % | 94.4 % | −2.8 pp | ✓ |
| `tests_passed_immediately` | 15.1 | 14.6 | −0.5 | ✓ (σ_v6.5=8.4) |

Keine Demotivation des Per-Cycle-Refactors durch das Wissen um den End-Pass nachweisbar. Der σ-Spread von v6.5 ist allerdings größer als der von v6.2 (insbesondere bei `cycle_count`: σ=5.3 vs 1.6), getrieben vom Min-Run mit nur 29 Cycles. Mit n=5 vs n=8 ist diese Streuungsdifferenz nicht überzubewerten.

---

## Operative Lehren (nicht-RQ-Findings)

- **External-Session-Cut blieb sichtbar:** 1 von 6 v6.5-Run-Attempts (16 %) lief in einen externen Session-Cut (Run vom 28-05 00:19; `exit=0`, aber `experiment-done.txt` fehlt, `run.log` mid-Red abgebrochen, 6 min Wallclock vs. 37 min Baseline, `end-refactor` nie aufgerufen). Die `run-batch.sh`-Cap-Detection vom 27-05 hat ihn nicht erkannt, weil keine Cap-Signatur im run.log auftauchte — vermutlich Vertex-side cut. Im Refill-Batch (28-05 06:01) hat dieselbe Detection eine andere Session als external cut erkannt und automatisch retry'd; der Retry lief sauber durch. Detection-Heuristik trifft also einen Teil, nicht alle Fälle.
- **Aggregator-Skip-Konvention:** Invalidated runs müssen mit `_` *prefixed* werden (z.B. `_invalidated_<original>_<reason>`). Suffix-`__invalidated` reicht nicht — `aggregate-by-query.py` und `batch-plan-from-rq.py` skippen nur Dirs, die mit `_` beginnen.
- **Container vs. Host analyze-run:** der Refill-Run hatte `analyze_status=ok` im Container, aber `final_metrics.*` waren null. Host-`analyze-run.sh <run_dir>` (mit absolutem Pfad) hat alle Werte nachgetragen. Vor `aggregate-by-query.py` immer mit `jq '.final_metrics.code_mass' …` stichprobenartig prüfen.
