# RQ-model-quality-oc — Findings

**Setup**: game-of-life-example-mapping × v5.1-testlist-scope-fix-oc × n=5 pro Zelle (20 Runs total). Stand 2026-05-25.

## Übersicht

Code-Qualität als primärer Outcome (kleiner = besser außer wo notiert); Korrektheit (`verification_pct`, höher = besser) als Gating-Voraussetzung.

| Metrik | Richtung | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | kimi-k2-6 |
|---|---|---|---|---|---|
| `verification_pct` (mean) | höher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.57 |
| `verification_pct` (std) | kleiner | **0.00** 🏆 | **0.00** 🏆 | **0.00** 🏆 | 0.40 |
| `tests_passing` (rate) | höher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| `smell_total` (mean) | kleiner | 3.6 | **2.8** 🏆 | 4.0 | 4.4 |
| `cognitive_max` (mean) | kleiner | **11.4** 🏆 | **11.6** 🏆 | 16.0 | 9.4 |
| `cognitive_avg` (mean) | kleiner | **8.03** 🏆 | **7.8** 🏆 | 14.07 | 8.4 |
| `mccabe_max` (mean) | kleiner | 7.6 | **7.0** 🏆 | 10.4 | 7.6 |
| `mccabe_avg` (mean) | kleiner | **2.91** 🏆 | 3.39 | 6.0 | 4.85 |
| `cc_longest_function` (mean) | kleiner | **18.6** 🏆 | 19.8 | **18.6** 🏆 | 15.2 |
| `cc_avg_loc_per_function` (mean) | kleiner | **7.59** 🏆 | 10.05 | 15.63 | 9.9 |
| `cc_median_loc_per_function` (mean) | kleiner | **3.3** 🏆 | 8.5 | 14.9 | 8.3 |
| `lines_of_code` (mean) | kleiner (bei gleicher Korrektheit) | **38.2** 🏆 | 46.4 | 52.2 | 22.4 |
| `tests_total` (mean) | höher | 9.4 | **9.8** 🏆 | 8.4 | 7.0 |
| `cycle_count` (mean) | — | 3.0 | 2.2 | 7.0 | 5.0 |
| `refactorings_applied` (mean) | — | 1.6 | 2.4 | 3.6 | 3.4 |
| `predictions_total` (mean) | höher (Skill-Compliance) | **4.8** 🏆 | 4.4 | 0.4 | 2.0 |
| `duration_seconds` (mean) | kleiner | 231 | 835 | **153** 🏆 | 1083 |
| `total_tokens` (mean) | kleiner | **1.82 M** 🏆 | 2.96 M | 2.80 M | 2.28 M |
| `cost_usd` (mean, $/run) | kleiner (bei gleicher Korrektheit) | $1.84 | **$0.74** 🏆 | $1.06 | $1.06 |
| `cost_usd` (mean, $/perfect-run) | kleiner | $1.84 | **$0.74** 🏆 | $1.06 | $2.65 |

**Trophy-Regel zur Korrektheits-Gating**: Pokale für Qualitäts-/Effizienz-Metriken gehen nur an Modelle mit `verification_pct = 1.0`. Kimi-K2 fällt mit 0.57 mean (3 von 5 Runs unter 0.5) aus dem Pool — seine niedrigen `cognitive_max` (9.4), niedrigen `lines_of_code` (22.4) und kurzen Funktionen sind teilweise Stub-Artefakte (zu wenige Tests, dadurch zu wenig Logik). `cycle_count` und `refactorings_applied` sind ambivalent (mehr Cycles ≠ besser, je nach Skill-Compliance) — kein Pokal. `predictions_total` ist hier ausnahmsweise mit Richtung notiert: misst Compliance mit dem v5.1-Skill-Format.

`cognitive_max`, `cognitive_avg` und `cc_longest_function`: Opus und GLM sind unter 1 σ getrennt — Spread-Regel → beide 🏆. Bei `cc_longest_function` ist Flash exakt gleichauf mit Opus (18.6) → drittes 🏆.

**Cost-Berechnung**: per-Run aus `transcript-metrics.json.total_tokens` × Pricing per 1M Token. Quellen 2026-05-25: Anthropic Pricing-Seite (Opus), OpenRouter API (GLM/Kimi), Vertex Standard (Gemini Flash). `reasoning`-Tokens werden zur output-Rate abgerechnet.

| Modell | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |

Portkey-Gateway-Markup nicht eingerechnet.

**Cost-Aufschlüsselung pro Mittel-Run** (Tokens als Mittelwert über n=5):

| Modell | input → cost | output (+reasoning) → cost | cache_read → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 116 k × $5.00 = $0.58 | 16.9 k × $25.00 = $0.42 | 1.68 M × $0.50 = $0.84 | **$1.84** |
| glm-5-1 | 144 k × $0.98 = $0.14 | 30.9 k × $3.08 = $0.10 | 2.79 M × $0.18 = $0.50 | **$0.74** |
| kimi-k2-6 | 371 k × $0.73 = $0.27 | 27.7 k × $3.49 = $0.10 | 1.88 M × $0.37 = $0.70 | **$1.06** |
| gemini-3-5-flash | 400 k × $1.50 = $0.60 | 11.2 k × $9.00 = $0.10 | 2.39 M × $0.15 = $0.36 | **$1.06** |

`$/perfect-run` skaliert mit dem Anteil der Runs mit `verification_pct = 1.0`: Kimi $1.06/Run × (5/2 verified) = **$2.65** pro korrekter Lösung. Opus/GLM/Flash je 5/5 verified → unverändert.

---

## F-1.1 — Opus 4.7 schreibt die kompakteste Implementierung

Opus liefert die kürzeste Lösung über alle Code-Volumen- und Funktions-Größen-Metriken (LoC, code_mass, cc_avg/median_loc_per_function) **bei voller externer Korrektheit** und hat zugleich den niedrigsten Token-Verbrauch (1.82 M vs 2.28–2.96 M der anderen drei).

| Modell | lines_of_code | cc_avg_loc | cc_median_loc | total_tokens |
|---|---|---|---|---|
| **opus-4-7-portkey** | **38.2** 🏆 | **7.59** 🏆 | **3.3** 🏆 | **1.82 M** 🏆 |
| glm-5-1 | 46.4 | 10.05 | 8.5 | 2.96 M |
| gemini-3-5-flash | 52.2 | 15.63 | 14.9 | 2.80 M |
| kimi-k2-6\* | 22.4 | 9.9 | 8.3 | 2.28 M |

\* nicht trophy-fähig (vpt < 1.0).

Der Median-LoC/Funktion von 3.3 (vs 8.5–14.9) bedeutet: Opus extrahiert konsequent kleine Helper. Bei `cc_avg_loc_per_function` ist Opus mit 7.59 etwa halb so kompakt wie Gemini Flash (15.63).

---

## F-1.2 — GLM 5.1 hält Opus-Niveau in Komplexität

GLM 5.1 erreicht über `smell_total`, `cognitive_*` und `mccabe_max` Werte gleich oder besser als Opus 4.7. Beide schlagen Gemini Flash deutlich (Cognitive-Max-Spread 4.4–4.6 Punkte; `cognitive_avg` 14.07 für Flash vs 7.8/8.03 für GLM/Opus).

| Metrik | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash |
|---|---|---|---|
| smell_total | 3.6 | **2.8** 🏆 | 4.0 |
| cognitive_max | **11.4** 🏆 | **11.6** 🏆 | 16.0 |
| cognitive_avg | **8.03** 🏆 | **7.8** 🏆 | 14.07 |
| mccabe_max | 7.6 | **7.0** 🏆 | 10.4 |
| mccabe_avg | **2.91** 🏆 | 3.39 | 6.0 |

GLM 5.1 bestätigt damit auch hier (game-of-life) den Eindruck aus RQ-model-novel-oc (claim-office): nahezu Opus-Qualität zu OpenRouter-Preisen. Im Code-Volumen ist Opus aber deutlich kompakter (F-1.1).

---

## F-1.3 — Kimi-K2 schreibt zu wenige Tests, scheitert an externer Verifikation

5/5 Kimi-Runs melden `tests_passing=true`, aber nur 2/5 erreichen `verification_pct = 1.0` (übrige: 0.20, 0.27, 0.40). Mittlere `tests_total` ist mit 7.0 die niedrigste (vs Opus 9.4, GLM 9.8, Flash 8.4) bei höchster Streuung (std 2.74, Range 4–9).

Muster: Kimi minimiert die Test-Liste und implementiert dann nur, was die eigene reduzierte Suite verlangt — das interne Vitest läuft grün, die externe `game-of-life-verification`-Suite deckt aber Fälle auf, die Kimi gar nicht erst getestet hat. Das ist exakt das Muster, gegen das `claim-office-verification` ursprünglich gebaut wurde: intern grüne Tests sind kein Korrektheits-Beweis.

| Run | verification_pct | tests_total |
|---|---|---|
| 1 | 1.00 | 9 |
| 2 | 1.00 | 9 |
| 3 | 0.40 | 7 |
| 4 | 0.27 | 6 |
| 5 | 0.20 | 4 |

---

## F-1.4 — Gemini 3.5 Flash: schnell, aber komplexester Code

Flash ist mit 153 s/Run der mit Abstand schnellste (Opus 231 s, GLM 835 s, Kimi 1083 s) und erreicht volle Korrektheit, schreibt aber den komplexesten Code: höchster `cognitive_max` (16), `cognitive_avg` (14.07), `mccabe_max` (10.4), `mccabe_avg` (6.0) und die längsten Funktionen im Durchschnitt (cc_avg 15.63 vs Opus 7.59). Trade-off: Geschwindigkeit gegen Wartbarkeit.

---

## F-1.5 — Skill-Tool-Compliance ist modellabhängig

v5.1-oc verlangt Prediction-Marker pro Red-Phase. Über die vier Modelle entstehen drei verschiedene Compliance-Profile:

| Modell | predictions_total (mean) | predictions_correct (mean) | Compliance-Profil |
|---|---|---|---|
| opus-4-7-portkey | **4.8** 🏆 | 4.8 (100%) | Konsistent, format-treu |
| glm-5-1 | 4.4 | 4.4 (100%) | Konsistent, format-treu |
| kimi-k2-6 | 2.0 | 2.0 (100%) | Partiell, driftet in inline-Mode |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | Ignoriert das Format praktisch ganz |

Wo Predictions geschrieben werden, sind sie zu 100 % korrekt — d.h. der Marker-Drop ist kein Genauigkeits-Problem, sondern eine Format-Compliance-Frage. Bestätigt H3 aus dem RQ-README: niedriger `cycle_count` (Flash 7.0) bei niedrigem `predictions_total` (0.4) ist nicht "schwache TDD-Disziplin", sondern fehlende Skill-Format-Erkennung. Gleichzeitig zeigt Flash die meisten erfassten Cycles (7.0) — die Iterationen sind real, aber nicht über den Skill-Marker dokumentiert.
