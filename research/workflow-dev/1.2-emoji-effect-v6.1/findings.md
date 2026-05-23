# RQ-emoji-v6.1 — Findings

_Haben Decoration-Emojis (✅ ❌ 🔴 🟢 🔄 📋 🚨 ⚠️) in den Workflow-Prompts auf v6.1-Basis einen messbaren Effekt auf Code-Qualitaet oder TDD-Disziplin?_

## Übersicht (Primär-Outcome Code-Qualität — kleiner = besser)

| Outcome | v6.1-hybrid (emoji) | v6.1-no-emoji |
|---|---:|---:|
| `code_mass` (APP) | **147.6** 🏆 | 156.8 |
| `smell_total` | 2.6 | **2.0** 🏆 |
| `cc_longest_function` | 15.0 | **11.4** 🏆 |
| `cognitive_max` | **6.2** 🏆 | 6.6 |
| `mccabe_max` | 5.2 | **4.6** 🏆 |

Trophäen splitten 3:2 zwischen den Workflows, jede einzelne Differenz < 1σ der jeweiligen Streuung — **kein direktionaler Code-Qualitäts-Effekt**. Spreads dominieren die Deltas durchgängig.

---

## F-1.1 — Decoration-Emojis: kein Code-Qualitäts-Effekt, leichte Disziplin-Verschiebung

**Aussage:** Das Entfernen aller 95 Decoration-Emojis (✅ ❌ 🚨 🔴 🟢 🔄 📋 ⚠️) aus den Skill-Commands, dem Refactor-Subagent und `rules/tdd.md` auf v6.1-Basis verschlechtert weder Korrektheit (beide 100% **Korrektheit (außen)** und **Korrektheit (innen)**) noch Code-Qualität. Es verschiebt aber das TDD-Verhalten: **no-emoji refactoriert häufiger** und implementiert **seltener vorab** (weniger `tests_passed_immediately`) — dieselbe Richtung wie in [RQ-pep-v6.1](../1.1-pep-effect-v6.1/findings.md) F-1.1.

| Metrik (Richtung) | v6.1-hybrid (emoji) | v6.1-no-emoji | Δ |
|---|---:|---:|---|
| `refactorings_applied` (höher = aktiver) | 4.2 (std 2.28) | **5.4** 🏆 (std 2.88) | +29% |
| `tests_passed_immediately` (kleiner = disziplinierter) | 4.8 (std 2.95) | **2.2** 🏆 (std 3.03) | −54% |
| `cycle_count` | 8.4 | 8.8 | ≈ |
| `predictions_correct_rate` | **98.8%** 🏆 | 97.7% | ≈ |
| **Korrektheit (außen)** (`verification_pct`) | **100%** 🏆 | **100%** 🏆 | = |
| **Korrektheit (innen)** (`tests_passing`) | **100%** 🏆 | **100%** 🏆 | = |

**Begründung:** Die Disziplin-Verschiebung in dieselbe Richtung wie RQ-pep-v6.1 ist auffällig — zwei unabhängige Reduktionen (no-pep, no-emoji) erzeugen beide mehr Refactoring und weniger Sofort-Grün. Spreads (std ≈ Mittelwert bei `tests_passed_immediately`) verbieten aber eine starke Lesart. Eine sparsame Erklärung: weniger Prompt-Drumherum lässt das Modell stärker dem reinen Prozess folgen. Die Differenz im `predictions_correct_rate` (98.8 → 97.7) ist trivial und liegt im Rauschen — die ✅/❌-Marker im Prediction-Template wirken **nicht** als Disziplin-Anker. Hyphen-Parsing (`- Correct`/`- Incorrect`) funktioniert problemlos.

---

## F-1.2 — Decoration-Emojis sparen keine Tokens

**Aussage:** Entgegen der Erwartung spart `v6.1-no-emoji` keine Tokens — beide Workflows liegen im Bereich 7–8 M Tokens, der no-emoji-Trend ist sogar leicht teurer.

| Metrik (kleiner = besser) | v6.1-hybrid (emoji) | v6.1-no-emoji |
|---|---:|---:|
| `total_tokens` (Mittel) | **7.17 M** 🏆 | 7.78 M |
| `duration_seconds` (Mittel) | **597 s** 🏆 | 669 s |

**Begründung:** Die 95 Emojis machen mengenmäßig nur einen Bruchteil der Gesamt-Token-Last aus (a-priori erwartet). Trotzdem ist H3 (≥ 5 % Einsparung) damit **widerlegt**. Der leicht negative Trend (+8.5 % Tokens, +12 % Wallclock) liegt vermutlich an den größeren Refactor-Phasen in no-emoji (+29 % `refactorings_applied`); jede zusätzliche Refactor-Phase kostet Tokens.

---

## Status der Hypothesen

| Hypothese | Status | Beleg |
|---|---|---|
| **H1** Emojis wirkungslos auf Code-Qualität | bestätigt | 5 Metriken split 3:2, alle Δ < 1σ |
| **H2** Emojis helfen messbar | nicht bestätigt | kein konsistenter Richtungs-Trend |
| **H3** Emojis sparen Tokens ≥ 5 % | widerlegt | +8.5 % Tokens, +12 % Wallclock in no-emoji |
| **H4** Prediction-Disziplin-Effekt durch ✅/❌ | nicht bestätigt | Δ 1.1 pp trivial; Hyphen-Parser funktioniert |
| **H5** Replikation der alten RQ-emoji (v6-Linie) | bestätigt | H1-Lesart konsistent; Korrektheit beider Workflows 100/100 |

**Konsequenz für MARKERS-Klassifikation:** Emoji-Header (`🔴`/`🟢`/`🔄`/`📋`) und ✅/❌-Status-Marker bleiben als **decorative content (safe to drop)** klassifiziert. Die CLAUDE.md-Regel "Only use emojis if the user explicitly requests it" kann ohne Code-Qualitäts- oder Korrektheits-Schaden auf die Workflow-Files angewendet werden — `v6.1-no-emoji` ist als Reduktion freigegeben.
wsa