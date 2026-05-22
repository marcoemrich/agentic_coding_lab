# RQ-emoji — Findings: Emojis in Workflow-Prompts

## Übersicht

Vergleich v6-hybrid (mit Emojis) vs v6.4-no-emoji (ohne Emojis) auf game-of-life-example-mapping, opus-4-7-no-thinking, **beide n=10**. **Bei n=10 sind die Code-Qualitäts-Mittel praktisch ununterscheidbar (3 von 5 Metriken praktisch identisch, gemischte Richtung), Streuung bleibt etwas breiter ohne Emojis, Tokens und Wallclock klar günstiger. Refactor-Quote leicht reduziert (−17 %), Over-Implementation leicht erhöht (+21 %).**

| Metrik | v6 (mit Emojis) μ±σ | v6.4 (ohne Emojis) μ±σ | Δ | v6 σ-Schwelle | über Schwelle? |
|---|---:|---:|---:|---:|:---:|
| Code-Mass (APP) | 158.6 ± 15.14 | **158.3 ± 12.50** 🏆 | −0.3 | 15.14 | nein (praktisch identisch) |
| Smell-Summe | **2.2 ± 0.42** 🏆 | 2.5 ± 0.71 | +0.3 | 0.42 | nein (knapp drunter) |
| Spitzen-Komplexität (`cc_longest_function`) | 13.1 ± 5.97 | **12.8 ± 6.20** 🏆 | −0.3 | 5.97 | nein (v6.4 leicht besser) |
| `cognitive_max` | **5.2 ± 2.30** 🏆 | 5.3 ± 4.03 | +0.1 | 2.30 | nein (praktisch identisch) |
| `mccabe_max` | 4.5 ± 1.51 | **4.3 ± 1.95** 🏆 | −0.2 | 1.51 | nein (v6.4 leicht besser) |

Bei n=10 ist die Richtung **klar gemischt**: 2 Metriken leicht zu v6 (smell), 2 leicht zu v6.4 (cc_longest, mccabe), 2 praktisch identisch (code_mass, cognitive_max). Der n=5-Befund "4 von 5 zu v6 getiltet" war Sampling-Artefakt.

---

## F-emoji.1 — Emojis haben keinen messbaren Effekt auf Code-Qualitäts-Mittelwerte

**Aussage:** Bei n=10 liegen alle Median-Differenzen weit unter ±1σ der v6-Streuung (maximaler Effekt: Smell +0.3 vs σ=0.42, also 70 % der Schwelle). Die Richtung ist gemischt — kein Hinweis auf einen systematischen Code-Qualitäts-Effekt durch Emoji-Entfernung.

**Hypothesen-Auswertung:**
- H1 (Emojis wirkungslos auf Code-Qualität) — **bestätigt** bei n=10. Die n=5-Beobachtung "konsistente Tilt zu v6" war Sampling-Variation.
- H2 (Emojis helfen messbar) — **falsifiziert**.

**Vergleich mit RQ-rules (Four Rules):** sehr ähnliches Muster. Beide Reduktionen ohne Mittel-Effekt auf Code-Qualität.

---

## F-emoji.2 — Streuung steigt bei 3 von 5 Metriken, abgeschwächt gegenüber n=5

**Aussage:** v6.4 zeigt bei 3 Metriken größere Streuung als v6 — der Effekt bleibt bei n=10 sichtbar, aber kleiner als bei n=5:

| Metrik | v6 σ | v6.4 σ | σ-Faktor (n=10) | σ-Faktor (n=5) |
|---|---:|---:|---:|---:|
| Code-Mass | 15.14 | 12.50 | 0.83× | 0.90× |
| Smell-Summe | 0.42 | 0.71 | **1.69×** | 2.12× |
| Spitzen-Komplexität | 5.97 | 6.20 | 1.04× | 0.89× |
| `cognitive_max` | 2.30 | 4.03 | **1.75×** | 2.05× |
| `mccabe_max` | 1.51 | 1.95 | 1.29× | 1.58× |

`cognitive_max` zeigt weiterhin einen 15er-Outlier in v6.4 (Maximum 15 vs v6-Max 7) — v6.4 verliert den 0%-Outlier-Status von v6 (RQ-stability F-stability.2). Bei n=10 zwar mit nur **1 von 10** Outlier-Runs, aber konsistent mit dem n=5-Befund.

**Mechanismus-Hypothese:** Emojis scheinen als visuelle Anker im Prompt eine leichte Stabilitäts-Wirkung zu haben. Der Effekt ist real, aber klein — vergleichbar mit dem Übergang RQ-rules → RQ-pep (Four Rules wirkungslos auf σ, Pep-Talks zeigen mixed-σ).

---

## F-emoji.3 — Schwache Disziplin-Drift bei n=10: weniger Refactorings, mehr Over-Implementation

**Aussage:** Während Code-Qualität gleich bleibt, zeigen zwei TDD-Disziplin-Indikatoren leichte Drift:

| Outcome | v6 | v6.4 | Δ |
|---|---:|---:|---:|
| `cycle_count` μ±σ | 8.3 ± 0.82 | 8.3 ± 1.06 | identisch |
| `refactorings_applied` μ±σ | 4.0 ± 1.63 | **3.3 ± 0.67** | **−17 %** |
| `predictions_correct_rate` | 99.4 % (169/170) | 97.6 % (164/168) | −1.8 pp |
| `tests_passed_immediately` μ±σ | 3.3 ± 3.02 | **4.0 ± 2.91** | **+21 %** |
| Korrektheit-innen / -außen | 100 % / 100 % | 100 % / 100 % | gleich |

**Beobachtungen:**
1. **Refactorings −17 %**: v6.4 macht systematisch weniger Refactor-Phasen pro Run (3.3 vs 4.0). Streuung enger (σ=0.67 vs 1.63) — konsistentes Muster. Bei gleicher cycle_count heißt das: das Modell überspringt häufiger das Refactor-Step.
2. **Over-Implementation +21 %**: `tests_passed_immediately` steigt von 3.3 auf 4.0. Mehr Tests passen bereits in der Red-Phase, ohne dass Green-Code geschrieben werden müsste — Hinweis auf mehr Vorab-Implementierung in der Green-Phase.
3. **Prediction-Compliance stabil**: −1.8 pp Differenz, deutlich kleiner als der RQ-pep-Effekt (−6.9 pp bei "strict discipline"-Streichung). H4 (Emoji-Marker als Disziplin-Anker für Predictions) — **nicht bestätigt**.

H4 wurde teilweise umformuliert nach den Daten: nicht die Predictions sind sensitiv, sondern **Refactor-Quote und Over-Implementation in der Green-Phase**. Beide Effekte sind klein (innerhalb σ), aber konsistent in dieselbe Richtung — Hinweis auf einen subtilen Effekt der ✅/❌-Marker in DO/DON'T-Listen, die ohne Emojis weniger als harte Pflicht-Regeln gelesen werden.

---

## F-emoji.4 — Token-Einsparung gerade über 5 %-Schwelle, Wallclock klar günstiger

**Aussage:**

| Outcome | v6 | v6.4 | Δ |
|---|---:|---:|---:|
| `total_tokens` μ | 6.62 M | 6.27 M | **−5.3 %** |
| `duration_seconds` μ | 521 | 486 | **−6.8 %** |

H3 (Tokens ≥ 5 %) — **bestätigt** bei n=10 (n=5 war 3.4 %, knapp drunter). Beide Kosten-Outcomes klar zugunsten v6.4.

**Vergleich der vier Reduktions-RQs (Token-Einsparung):** APP −8 %, Four Rules −8.5 %, Pep ±0 %, Emojis −5.3 %. Größenordnung entspricht ungefähr dem Volumen des entfernten Prompt-Blocks (APP/Four Rules > Emojis > Pep).

---

## F-emoji.5 — Konsequenz: bedingter Reduktions-Erfolg

Vier Reduktions-RQs im Vergleich (jetzt alle bei n=10 für v6 + RQ-Workflow):

| RQ | Reduktion | Qualität μ | Stabilität σ | Disziplin | Kosten | Verdict |
|---|---|:---:|:---:|:---:|:---:|:---:|
| RQ-app | APP raus | ⬇️ alle schlechter | ⬆️ verdoppelt | ➡️ | −8 % | APP bleibt |
| RQ-rules | Four Rules raus | ➡️ | ➡️ | ➡️ | −8.5 % | **Four Rules raus** |
| RQ-pep | Pep raus | ➡️ | gemischt | ⚠️ pred −7 pp | ±0 % | mehr Daten |
| **RQ-emoji (n=10)** | **Emojis raus** | ➡️ | ⚠️ 3/5 σ leicht breiter | ⚠️ refactor −17%, over-impl +21% | **−5 % Tokens, −7 % Wallclock** | **bedingter Erfolg** |

**v6.4-no-emoji ist OK zu entfernen, aber mit Vorbehalten:**
- ✅ Code-Qualitäts-Mittel unverändert
- ✅ Korrektheit unverändert
- ✅ Token-Einsparung klar über 5 %-Schwelle
- ✅ Wallclock klar günstiger
- ⚠️ Streuung bei 3 von 5 Metriken leicht erhöht (σ-Faktoren 1.3-1.75×)
- ⚠️ Refactor-Quote sinkt um 17 %
- ⚠️ Over-Implementation steigt um 21 %

**Empfehlung für die nächste Optimierungsstufe:**

1. **v6.5 (Four Rules + Emojis raus)** als Reduktions-Bundle testen — beide Reduktionen sind individuell bestätigt unkritisch in Code-Qualität, kombiniert sollten sie additive Token-Einsparung bringen.
2. **Disziplin-Drift im Auge behalten**: falls v6.5 noch stärkere Drift zeigt (z. B. refactor −30 %, over-impl +40 %), könnten Emojis nicht endgültig raus, sondern nur die nicht-DO/DON'T-Verwendungen (Phase-Header, Prediction-Templates).
3. **Cross-Kata-Validierung auf claim-office** vor breiter Promotion — bei längeren Aufgaben könnten die σ-Effekte stärker werden.

## Caveats

- **n=10 v6.4, single Kata, single Modell**: konsistent mit RQ-stability-Tiefe für v6. claim-office-Replikation steht aus.
- **n=5 → n=10 Lehre**: die n=5-Beobachtung "v6.4 in 4 von 5 Metriken leicht schlechter" war Sampling-Artefakt — bei n=10 flippte das Bild. Bestätigt RQ-stability F-stability.3 (n=3-Rankings instabil) für n=5-Mittel-Differenzen unter ~0.5σ.
- **Disziplin-Drift statistisch grenzwertig**: Refactorings-Δ und tests_passed_immediately-Δ liegen beide unter σ. Bei n=20 wäre das schärfer.
- **Parser-Hyphen-Variante**: 168 von 168 Predictions wurden erkannt (verlustfrei). Keine Marker-Daten verloren.
