# RQ-model-quality-oc — Findings

**Setup**: game-of-life-example-mapping × v5.1-testlist-scope-fix-oc × n=5 pro Zelle (30 Runs total, 29 ohne Timeout). Stand 2026-05-28.

## Übersicht

Code-Qualität als primärer Outcome (kleiner = besser außer wo notiert); Korrektheit (`verification_pct`, höher = besser) als Gating-Voraussetzung.

| Metrik | Richtung | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | kimi-k2-6 | deepseek-v4-flash | deepseek-v4-pro |
|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | höher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.57 | **1.00** 🏆 | 0.85 |
| `verification_pct` (std) | kleiner | **0.00** 🏆 | **0.00** 🏆 | **0.00** 🏆 | 0.40 | **0.00** 🏆 | 0.33 |
| `tests_passing` (rate) | höher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | 80% |
| `completed_within_budget` (rate) | höher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | 80% |
| `smell_total` (mean) | kleiner | 3.6 | **2.8** 🏆 | 4.0 | 4.4 | 4.0 | 4.2 |
| `cognitive_max` (mean) | kleiner | **11.4** 🏆 | **11.6** 🏆 | 16.0 | 9.4 | 13.2 | 11.4 |
| `cognitive_avg` (mean) | kleiner | **8.03** 🏆 | **7.8** 🏆 | 14.07 | 8.4 | 8.78 | 10.6 |
| `mccabe_max` (mean) | kleiner | 7.6 | **7.0** 🏆 | 10.4 | 7.6 | 9.4 | 8.6 |
| `mccabe_avg` (mean) | kleiner | **2.91** 🏆 | 3.39 | 6.0 | 4.85 | 3.99 | 3.28 |
| `cc_longest_function` (mean) | kleiner | **18.6** 🏆 | 19.8 | **18.6** 🏆 | 15.2 | 27.6 | 15.0 |
| `cc_avg_loc_per_function` (mean) | kleiner | **7.59** 🏆 | 10.05 | 15.63 | 9.9 | 13.10 | 9.53 |
| `cc_median_loc_per_function` (mean) | kleiner | **3.3** 🏆 | 8.5 | 14.9 | 8.3 | 9.8 | 7.0 |
| `lines_of_code` (mean) | kleiner (bei gleicher Korrektheit) | **38.2** 🏆 | 46.4 | 52.2 | 22.4 | 44.8 | 24.6 |
| `tests_total` (mean) | höher | **9.4** 🏆 | **9.8** 🏆 | 8.4 | 7.0 | **9.2** 🏆 | 8.6 |
| `cycle_count` (mean) | — | 3.0 | 2.2 | 7.0 | 5.0 | 5.4 | 7.6 |
| `refactorings_applied` (mean) | — | 1.6 | 2.4 | 3.6 | 3.4 | 4.8 | 4.6 |
| `predictions_total` (mean) | höher (Skill-Compliance) | **4.8** 🏆 | 4.4 | 0.4 | 2.0 | 1.4 | **6.2** 🏆 |
| `duration_seconds` (mean) | kleiner | 231 | 835 | **153** 🏆 | 1083 | 612 | 2381 |
| `total_tokens` (mean) | kleiner | **1.82 M** 🏆 | 2.96 M | 2.80 M | 2.28 M | 2.71 M | 2.82 M |
| `cost_usd` (mean, $/run) | kleiner (bei gleicher Korrektheit) | $1.84 | $0.74 | $1.06 | $1.06 | **$0.10** 🏆 | $0.37 |
| `cost_usd` (mean, $/perfect-run) | kleiner | $1.84 | $0.74 | $1.06 | $2.65 | **$0.10** 🏆 | $0.46 |

**Trophy-Regel zur Korrektheits-Gating**: Pokale für Qualitäts-/Effizienz-Metriken gehen nur an Modelle mit `verification_pct = 1.0`. Kimi-K2 fällt mit 0.57 mean (3 von 5 Runs unter 0.5) aus dem Pool — seine niedrigen `cognitive_max` (9.4), niedrigen `lines_of_code` (22.4) und kurzen Funktionen sind teilweise Stub-Artefakte (zu wenige Tests). DeepSeek-V4-Pro fällt knapp mit 0.85 aus dem Pool — 4/5 Runs sind perfekt, aber 1 Run timed out bei 0.27 verification, dadurch zählen seine niedrigen `code_mass` (124) und `lines_of_code` (24.6) nicht als saubere Sieger. `cycle_count` und `refactorings_applied` sind ambivalent (mehr Cycles ≠ besser, je nach Skill-Compliance) — kein Pokal. `predictions_total` ist hier ausnahmsweise mit Richtung notiert: misst Compliance mit dem v5.1-Skill-Format.

`cognitive_max`, `cognitive_avg` und `cc_longest_function`: Opus und GLM sind unter 1 σ getrennt — Spread-Regel → beide 🏆. Bei `cc_longest_function` ist Flash exakt gleichauf mit Opus (18.6) → drittes 🏆.

**Cost-Berechnung**: per-Run aus `transcript-metrics.json.total_tokens` × Pricing per 1M Token. Quellen 2026-05-28: Anthropic Pricing-Seite (Opus), OpenRouter API (GLM/Kimi/DeepSeek), Vertex Standard (Gemini Flash). `reasoning`-Tokens werden zur output-Rate abgerechnet. DeepSeek-Cache-Read ist auf OpenRouter nicht explizit ausgewiesen; konservative Schätzung 25 % des Input-Preises.

| Modell | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| deepseek-v4-flash (OpenRouter) | $0.10 | $0.20 | $0.025 (25%) |
| deepseek-v4-pro (OpenRouter) | $0.44 | $0.87 | $0.11 (25%) |

Portkey-Gateway-Markup nicht eingerechnet.

**Cost-Aufschlüsselung pro Mittel-Run** (Tokens als Mittelwert über n=5):

| Modell | input → cost | output (+reasoning) → cost | cache_read → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 116 k × $5.00 = $0.58 | 16.9 k × $25.00 = $0.42 | 1.68 M × $0.50 = $0.84 | **$1.84** |
| glm-5-1 | 144 k × $0.98 = $0.14 | 30.9 k × $3.08 = $0.10 | 2.79 M × $0.18 = $0.50 | **$0.74** |
| kimi-k2-6 | 371 k × $0.73 = $0.27 | 27.7 k × $3.49 = $0.10 | 1.88 M × $0.37 = $0.70 | **$1.06** |
| gemini-3-5-flash | 400 k × $1.50 = $0.60 | 11.2 k × $9.00 = $0.10 | 2.39 M × $0.15 = $0.36 | **$1.06** |
| deepseek-v4-flash | 299 k × $0.10 = $0.03 | 30.5 k × $0.20 = $0.01 | 2.38 M × $0.025 = $0.06 | **$0.10** |
| deepseek-v4-pro | 110 k × $0.44 = $0.05 | 32.9 k × $0.87 = $0.03 | 2.68 M × $0.11 = $0.29 | **$0.37** |

`$/perfect-run` skaliert mit dem Anteil der Runs mit `verification_pct = 1.0`: Kimi $1.06/Run × (5/2 verified) = **$2.65** pro korrekter Lösung. DeepSeek-V4-Pro $0.37/Run × (5/4 verified) = **$0.46**. Andere Modelle 5/5 verified → unverändert.

---

## F-1.1 — Opus 4.7 schreibt die kompakteste Implementierung

Opus liefert die kürzeste Lösung über alle Code-Volumen- und Funktions-Größen-Metriken (LoC, code_mass, cc_avg/median_loc_per_function) **bei voller externer Korrektheit** und hat zugleich den niedrigsten Token-Verbrauch (1.82 M vs 2.28–2.96 M der anderen Modelle mit `verification_pct = 1.0`).

| Modell | lines_of_code | cc_avg_loc | cc_median_loc | total_tokens |
|---|---|---|---|---|
| **opus-4-7-portkey** | **38.2** 🏆 | **7.59** 🏆 | **3.3** 🏆 | **1.82 M** 🏆 |
| glm-5-1 | 46.4 | 10.05 | 8.5 | 2.96 M |
| gemini-3-5-flash | 52.2 | 15.63 | 14.9 | 2.80 M |
| deepseek-v4-flash | 44.8 | 13.10 | 9.8 | 2.71 M |
| kimi-k2-6\* | 22.4 | 9.9 | 8.3 | 2.28 M |
| deepseek-v4-pro\* | 24.6 | 9.53 | 7.0 | 2.82 M |

\* nicht trophy-fähig (verification_pct < 1.0).

Der Median-LoC/Funktion von 3.3 (vs 7.0–14.9 bei den anderen) bedeutet: Opus extrahiert konsequent kleine Helper. Bei `cc_avg_loc_per_function` ist Opus mit 7.59 etwa halb so kompakt wie Gemini Flash (15.63) und 40 % kompakter als DeepSeek-V4-Flash (13.10).

---

## F-1.2 — GLM 5.1 hält Opus-Niveau in Komplexität

GLM 5.1 erreicht über `smell_total`, `cognitive_*` und `mccabe_max` Werte gleich oder besser als Opus 4.7. Beide schlagen Gemini Flash und DeepSeek-V4-Flash deutlich (Cognitive-Max-Spread 1.6–4.4 Punkte).

| Metrik | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | deepseek-v4-flash |
|---|---|---|---|---|
| smell_total | 3.6 | **2.8** 🏆 | 4.0 | 4.0 |
| cognitive_max | **11.4** 🏆 | **11.6** 🏆 | 16.0 | 13.2 |
| cognitive_avg | **8.03** 🏆 | **7.8** 🏆 | 14.07 | 8.78 |
| mccabe_max | 7.6 | **7.0** 🏆 | 10.4 | 9.4 |
| mccabe_avg | **2.91** 🏆 | 3.39 | 6.0 | 3.99 |

GLM 5.1 bestätigt damit auch hier (game-of-life) den Eindruck aus RQ-model-novel-oc (claim-office): nahezu Opus-Qualität zu OpenRouter-Preisen. Im Code-Volumen ist Opus aber deutlich kompakter (F-1.1).

---

## F-1.3 — Kimi-K2 schreibt zu wenige Tests, scheitert an externer Verifikation

5/5 Kimi-Runs melden `tests_passing=true`, aber nur 2/5 erreichen `verification_pct = 1.0` (übrige: 0.20, 0.27, 0.40). Mittlere `tests_total` ist mit 7.0 die niedrigste (vs Opus 9.4, GLM 9.8, Flash 8.4, deepseek-flash 9.2) bei höchster Streuung (std 2.74, Range 4–9).

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

Flash ist mit 153 s/Run der mit Abstand schnellste (Opus 231 s, deepseek-flash 612 s, GLM 835 s, Kimi 1083 s, deepseek-pro 2381 s) und erreicht volle Korrektheit, schreibt aber den komplexesten Code: höchster `cognitive_max` (16), `cognitive_avg` (14.07), `mccabe_max` (10.4), `mccabe_avg` (6.0) und die längsten Funktionen im Durchschnitt (cc_avg 15.63 vs Opus 7.59). Trade-off: Geschwindigkeit gegen Wartbarkeit.

---

## F-1.5 — Skill-Tool-Compliance ist modellabhängig

v5.1-oc verlangt Prediction-Marker pro Red-Phase. Über die sechs Modelle entstehen vier verschiedene Compliance-Profile:

| Modell | predictions_total (mean) | predictions_correct (mean) | Compliance-Profil |
|---|---|---|---|
| deepseek-v4-pro | **6.2** 🏆 | 5.6 (90%) | Konsistent, format-treu |
| opus-4-7-portkey | **4.8** 🏆 | 4.8 (100%) | Konsistent, format-treu |
| glm-5-1 | 4.4 | 4.4 (100%) | Konsistent, format-treu |
| kimi-k2-6 | 2.0 | 2.0 (100%) | Partiell, driftet in inline-Mode |
| deepseek-v4-flash | 1.4 | 1.4 (100%) | Partiell, driftet in inline-Mode |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | Ignoriert das Format praktisch ganz |

Wo Predictions geschrieben werden, sind sie zu nahezu 100 % korrekt — d.h. der Marker-Drop ist kein Genauigkeits-Problem, sondern eine Format-Compliance-Frage. Bestätigt H3 aus dem RQ-README: niedriger `cycle_count` (Flash 7.0) bei niedrigem `predictions_total` (0.4) ist nicht "schwache TDD-Disziplin", sondern fehlende Skill-Format-Erkennung. Gleichzeitig zeigt deepseek-v4-pro mit 6.2 predictions_total die höchste Skill-Compliance — und auch die höchste `cycle_count` (7.6).

---

## F-1.6 — DeepSeek-V4-Flash: günstigster Pfad zur korrekten Lösung

DeepSeek-V4-Flash erreicht volle externe Korrektheit (5/5 perfect, std 0.00) bei einem Per-Run-Cost von ~$0.10 — eine Größenordnung unter den nächst-günstigen Modellen (GLM-5.1 $0.74, deepseek-v4-pro $0.37, gemini-flash und kimi $1.06). Bei `tests_total` (9.2) und `mccabe_avg` (3.99) liegt es im Mittelfeld, in der Code-Größe (LoC 44.8, code_mass 189) am oberen Ende — der Trade-off ist klar: günstig + korrekt vs kompakt.

| Modell | $/perfect-run | duration | LoC | cognitive_max |
|---|---|---|---|---|
| **deepseek-v4-flash** | **$0.10** 🏆 | 612 s | 44.8 | 13.2 |
| glm-5-1 | $0.74 | 835 s | 46.4 | **11.6** 🏆 |
| gemini-3-5-flash | $1.06 | **153 s** 🏆 | 52.2 | 16.0 |
| opus-4-7-portkey | $1.84 | 231 s | **38.2** 🏆 | **11.4** 🏆 |

Für reine Korrektheit ohne Komplexitäts-Anspruch ist Flash hier 18× günstiger als Opus. Der Code-Volumen-Aufpreis (44.8 vs 38.2 LoC) ist gering.

---

## F-1.7 — DeepSeek-V4-Pro: Skill-Compliance-Champion, aber Tail-Risk in Duration

DeepSeek-V4-Pro produziert mit `predictions_total = 6.2` und `cycle_count = 7.6` die strukturierteste TDD-Kette aller Modelle — über Opus (4.8) und GLM (4.4) hinaus. Die Predictions-Accuracy bleibt mit 90 % hoch (5.6/6.2).

ABER: 1 von 5 Runs hat den 7202 s Container-Timeout erreicht (`verification_pct = 0.27`, `tests_passing = false`); die mittlere Duration ist mit 2381 s die höchste aller Modelle und mit std=2704 s extrem variabel (Range 854–7202 s). Die anderen 4 Runs sind bei perfect verification stabil bei ~1100 s.

| Run | duration_s | verification_pct | predictions_total | cycle_count |
|---|---|---|---|---|
| 1 (timeout) | 7202 | 0.27 | 3 | 6 |
| 2 | 1326 | 1.00 | 6 | 7 |
| 3 | 854 | 1.00 | 5 | 8 |
| 4 | 1417 | 1.00 | 7 | 8 |
| 5 | 1107 | 1.00 | 11 | 9 |

Befund ist parallel zu Gemini-2.5-Pro im RQ-README dokumentierten Skill-Loop-Issue, aber mit milderer Ausprägung (4/5 statt 0/3 Erfolge). Für Produktiv-Einsatz braucht Pro Auto-Recovery-Mechanik oder kürzeren Timeout — im Lab-Setting reicht das `completed_within_budget = 80 %`-Signal aus.
