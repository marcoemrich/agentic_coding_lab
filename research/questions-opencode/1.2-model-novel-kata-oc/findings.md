# RQ-model-novel-oc — Findings

**Setup**: claim-office-example-mapping × v5.1-testlist-scope-fix-oc × n=5 pro Zelle (25 Runs total). Stand 2026-05-25.

## Übersicht

Korrektheit außen (`verification_pct`, höher = besser) als primärer Outcome; Code-Qualitäts-Metriken sekundär (kleiner = besser außer wo notiert).

| Metrik | Richtung | opus-4-7-portkey | glm-5-1 | kimi-k2-6 | gemini-3-5-flash | minimax-m2-7 |
|---|---|---|---|---|---|---|
| `verification_pct` (mean) | höher | **1.00** 🏆 | **1.00** 🏆 | 0.84 | 0.80 | 0.04 |
| `verification_pct` (std) | kleiner | **0.00** 🏆 | **0.00** 🏆 | 0.26 | 0.45 | 0.09 |
| `smell_total` (mean) | kleiner | **0.8** 🏆 | 4.0 | 20 | 18 | 10.2 |
| `cognitive_max` (mean) | kleiner | **9.8** 🏆 | 12.2 | 21.8 | 40.2 | 11.4 |
| `mccabe_max` (mean) | kleiner | **7.6** 🏆 | 9.2 | 17.6 | 23.4 | 7.6 |
| `cc_longest_function` (mean) | kleiner | **25.4** 🏆 | 28.8 | 54.4 | 98.4 | 30.0 |
| `code_mass` (mean) | kleiner (bei gleicher Korrektheit) | **759.6** 🏆 | 816 | 741 | 526 | 364.4 |
| `total_tokens` (mean) | kleiner (bei gleicher Korrektheit) | **8.06 M** 🏆 | 10.97 M | 6.65 M | 7.02 M | 8.48 M |
| `cost_usd` (mean, $/run) | kleiner (bei gleicher Korrektheit) | $5.90 | **$2.10** 🏆 | $2.78 | $2.23 | $2.40 |
| `cycle_count` (mean) | — | 1.2 | 2.0 | 2.0 | 2.2 | 4.8 |
| `predictions_total` (mean) | — | 2.4 | 4.0 | 0.4 | 0.4 | 2.6 |
| `duration_seconds` (mean) | kleiner | **664** 🏆 | 1726 | 1811 | 395 | 1428 |

`cycle_count` und `predictions_total` sind ambivalente Metriken ohne klare Richtung — kein Pokal. Bei `code_mass`, `total_tokens` und `cost_usd` ist weniger besser, aber nur bei vergleichbarer Korrektheit aussagekräftig: MiniMax' niedrige Werte sind Stub-Artefakt (verification 0.04), Flash' Werte werden vom 3-LoC-Abbruch-Run (siehe F-1.2) gezogen — deshalb dort kein Pokal. Cost-Effizienz bei tatsächlich nutzbarer Korrektheit: siehe F-1.6.

**Trophy-Regel zur Korrektheits-Gating**: Pokale für Qualitäts-/Effizienz-Metriken (`smell_*`, `cognitive_*`, `mccabe_*`, `cc_*`, `duration_seconds`, `total_tokens`, `cost_usd`) werden nur an Modelle mit `verification_pct = 1.0` vergeben. Begründung: niedrige Komplexität / kurze Dauer / niedrige Kosten bei nicht-korrekter Implementierung misst nicht das was die Metrik vorgibt zu messen, sondern Stub- oder Abbruch-Artefakte. In dieser Studie sind Opus und GLM 5.1 vpt=1.0 — beide qualifizieren sich. Pokal-Vergabe innerhalb dieses Pools: Opus gewinnt Code-Qualität (Smells, Komplexität, Code-Mass) und Wallclock; GLM 5.1 gewinnt Cost. `total_tokens` an Opus (8.06 M vs 10.97 M).

**Cost-Berechnung**: per-Run aus `transcript-metrics.json.total_tokens` × Pricing per 1M Token. Quellen 2026-05-25: Anthropic Pricing-Seite (Opus), OpenRouter API `/api/v1/models` (GLM/Kimi/MiniMax), Vertex Standard (Gemini Flash).

| Modell | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| minimax-m2-7 (OpenRouter) | $0.279 | $1.20 | $0.279 (keine Cache-Rate von OpenRouter gelistet → input-Rate als konservative Obergrenze) |

Portkey-Markup nicht eingerechnet (Portkey listet keinen modell-spezifischen Aufschlag, Gateway-Plan-Kosten sind separate Tier-Pauschalen).

---

## F-1.1 — Opus 4.7 und GLM 5.1 erreichen vollständige Korrektheit; Tradeoff Code-Qualität ↔ Kosten

Zwei Modelle erreichen über alle 5 Replikate perfekte Korrektheit außen (15/15 in jedem Run, `verification_pct = 1.00 ± 0.00`): Opus 4.7 und GLM 5.1. Auf den sekundären Achsen ist die Wahl ein klarer Tradeoff:

| Metrik | opus-4-7-portkey | glm-5-1 | Sieger |
|---|---|---|---|
| smell_total mean ± std | 0.8 ± 0.45 | 4.0 ± 6.16 | Opus 5× besser |
| cognitive_max mean ± std | 9.8 ± 1.79 | 12.2 ± 4.15 | Opus 24 % niedriger |
| mccabe_max mean | 7.6 | 9.2 | Opus 21 % niedriger |
| cc_longest_function mean | 25.4 | 28.8 | Opus 12 % niedriger |
| code_mass mean ± std | 759.6 ± 33.8 | 816 ± 68.6 | Opus 7 % kleiner, halb so streuend |
| duration_seconds mean | 664 | 1726 | Opus 2.6× schneller |
| **cost_usd / Run** | **$5.90** | **$2.10** | **GLM 2.8× billiger** |

GLM 5.1 zeigt zwei bimodale Code-Qualitäts-Runs (smell 14 und 6) zwischen drei sauberen (smell 0) — das erklärt die σ-Streuung. Korrektheit bleibt davon unberührt.

Pattern: Bei reiner **Korrektheits-Garantie** ist GLM 5.1 die klar bessere Wahl (gleiche Determinismus, ~drittel der Kosten, Tradeoff: ~2.6× Wallclock und etwas weniger sauberer Code). Wenn Code-Qualität (Lesbarkeit, Komplexität) ein hartes Ziel ist, lohnt sich der Opus-Aufpreis.

---

## F-1.2 — Kimi K2.6 und Gemini 3.5 Flash: Spitzen-Korrektheit mit Varianz-Tail

Beide Modelle erreichen in der Mehrzahl der Runs perfekte Verifikation, fallen aber je einmal deutlich ab — der Spread zeigt sich erst bei n=5:

| Modell | verification-Verteilung (n=5) | mean | std |
|---|---|---|---|
| kimi-k2-6 | 15, 15, 15, 12, 6 | 0.84 | 0.26 |
| gemini-3-5-flash | 15, 15, 15, 15, 0 | 0.80 | 0.45 |

Flash ist **bimodal** (4× perfekt, 1× Total-Fail) — der 0/15-Run hat zusätzlich `tests_passing = false` und `code_mass = 3` (nahezu leere Implementierung), also Workflow-Abbruch, nicht Spec-Misverständnis. Kimi degradiert graduell (12/15, 6/15) ohne Internen-Test-Fail. Beide schaffen Top-Niveau, aber n=5 enthüllt eine Reliability-Lücke gegenüber Opus' deterministischer Perfektion.

---

## F-1.3 — MiniMax M2.7: stabiles Spec-Misverständnis, kein Einzelfall

Über 5 Replikate erreicht MiniMax nur einmal überhaupt einen Treffer (3/15), sonst 0/15 (mean 0.04, std 0.09). 4 von 5 Runs sind grün in den internen Tests (`tests_passing = true`) bei im Schnitt 30.8 selbst geschriebenen Tests — das Modell baut konsistent eine andere Spec als die Verifikations-Suite erwartet. Der Smoke-Befund (n=1: 0/15) und die Probe (n=3: 0,3,0) bestätigen sich vollständig.

| Run | verification | tests_passing | tests_total | code_mass |
|---|---|---|---|---|
| Replikate (n=5) | 0, 0, 0, 0, 3 | true ×4, false ×1 | 2–54 | 18–700 |

Klassischer claim-office-Mehrdeutigkeits-Effekt: das Modell liest die EM-Spec selbstkonsistent, aber abweichend von der intendierten Auflösung. Bestätigt die Konstruktion der Kata als robuster Filter für Spec-Verstehen (Memory `[[kata-construction-pretest-required]]`).

---

## F-1.4 — Predictions-Format-Compliance ist NICHT prädiktiv für Korrektheit

Die Marker-Compliance des v5.1-oc-Workflows (Prediction-Lines im Red-Phase-Block) korreliert nicht mit `verification_pct`:

| Modell | predictions_total | predictions_correct | verification_pct |
|---|---|---|---|
| glm-5-1 | 4.0 | 4.0 (100%) | 1.00 |
| minimax-m2-7 | 2.6 | 2.2 (85%) | 0.04 |
| opus-4-7-portkey | 2.4 | 2.4 (100%) | 1.00 |
| kimi-k2-6 | 0.4 | 0.4 (100%) | 0.84 |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | 0.80 |

Die zwei extremsten Prediction-Frequenzen liegen an entgegengesetzten Korrektheits-Enden: GLM 4.0/Run mit perfekter Korrektheit, MiniMax 2.6/Run mit fast Null-Korrektheit. Kimi und Flash ignorieren das Format weitgehend (0.4/Run) und sind trotzdem nahe am Top. Marker-Compliance misst die Adoption der Workflow-Affordance, nicht den TDD-Inhalt. Bestätigt H4 aus dem RQ-README.

---

## F-1.5 — Code-Mass-Spread innerhalb Modell: Flash und MiniMax bimodal/breit

`code_mass` und `cycle_count` zeigen pro Modell sehr unterschiedliche Streuung:

| Modell | code_mass range | code_mass std | cycle_count range |
|---|---|---|---|
| opus-4-7-portkey | 717–797 | 34 | 1–2 |
| glm-5-1 | 705–877 | 69 | 1–3 |
| kimi-k2-6 | 674–800 | 58 | 1–3 |
| gemini-3-5-flash | 3–680 | 293 | 1–4 |
| minimax-m2-7 | 18–700 | 290 | 1–18 |

Opus, GLM und Kimi schreiben konsistent ~700–880 LoC mit moderater Streuung (std 34–69); Flash und MiniMax triggern die "es war fertig"-Heuristik variabel — Flash kann mit 3 LoC abbrechen (siehe F-1.2 Bimodalität), MiniMax variiert zwischen Minimal-Stub und voller Implementierung. `cycle_count = 18` bei einem MiniMax-Run (Outlier) deutet auf Loop-Verhalten ohne Abschluss — der Run lief zwar im Budget durch (`completed_within_budget = true`), aber die Anzahl Red-Skill-Aufrufe ist 9× höher als der Median.

Folgerung: Workflow-Selbstabbruch-Heuristik ist modellabhängig; sie schützt nicht zuverlässig vor "Modell hört zu früh auf" (Flash-Bimodalität) oder "Modell loop-t bis Budget-Cap" (MiniMax-Outlier).

---

## F-1.6 — Cost-Effizienz pro perfektem Lauf: GLM 5.1 deterministisch UND günstig

Bei der einfachen "Cost pro Run"-Sicht (Übersichts-Tabelle) sehen GLM ($2.10), Flash ($2.23) und MiniMax ($2.40) am günstigsten aus. Aussagekräftiger ist die Frage: was kostet ein **garantiert perfekter** Lauf (verification 1.00, also 15/15), inklusive der Retries die für die Misserfolge nötig wären?

| Modell | n_perfect / n | $/Run (mean) | $/perfekter Run (cond.) | erwartet $/perfekt-Resultat (mit Retry) |
|---|---|---|---|---|
| glm-5-1 | 5/5 | 2.10 | 2.10 | **$2.10** 🏆 (deterministisch) |
| opus-4-7-portkey | 5/5 | 5.90 | 5.90 | $5.90 (deterministisch) |
| gemini-3-5-flash | 4/5 | 2.23 | 2.69 | $2.78 |
| minimax-m2-7 | 0/5 | 2.40 | — | ∞ (kein perfekter Lauf in n=5) |
| kimi-k2-6 | 3/5 | 2.78 | 2.27 | $4.63 |

"Erwartet" = totale Kosten der 5 Runs / Anzahl perfekter Runs — operativ: wenn ein perfektes Ergebnis das Ziel ist und Nicht-Perfekt-Läufe verworfen werden, dann ist das die Kosten-pro-Akzeptanz-Größe.

GLM 5.1 gewinnt klar: deterministisch perfekt (5/5) zu $2.10/Run, ~3× billiger als Opus' $5.90 bei gleicher Verlässlichkeit. Kimi und Flash konkurrieren auf der Cost-Achse, aber beide haben Reliability-Tail: Kimi degradiert (3/5 perfekt) und verteuert sich erwartet auf $4.63; Flash hat einen Total-Fail (4/5 → $2.78 erwartet, knapp hinter GLM aber stochastisch). MiniMax fällt komplett aus.

Pokal an GLM 5.1: günstigster deterministisch perfekter Lauf im vpt=1.0-Pool. Opus bleibt für hohe Code-Qualitäts-Ansprüche relevant (F-1.1), nicht für reine Korrektheits-Garantie.
