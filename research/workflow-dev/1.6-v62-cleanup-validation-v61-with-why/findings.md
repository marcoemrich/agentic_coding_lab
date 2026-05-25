# RQ-1.6: v6.2-with-why-cleaned vs v6.1-with-why (claim-office)

## Übersicht

Baseline (`v6.1-with-why`, n=8) vs. Cleaned (`v6.2-with-why-cleaned`, n=8) auf `claim-office-example-mapping × opus-4-7-portkey-no-thinking`. Richtungen: ↑ = höher besser, ↓ = kleiner besser.

| Metrik | Richtung | v6.1-with-why | v6.2-with-why-cleaned |
|---|---|---:|---:|
| `verification_pct` (Korrektheit) mean | ↑ | 0.91 (σ 0.26) | **0.96** 🏆 (σ 0.09) |
| `tests_passing` rate | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` rate | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_correct_rate` (pooled) | ↑ | 96.2 % (n=7) | **97.2 %** 🏆 (n=8) |
| `refactorings_applied` mean | ↑ | 18.50 (σ 8.42, min 0) | **24.88** 🏆 (σ 6.90, min 18) |
| `tests_passed_immediately` mean | — | 15.38 (σ 7.27) | 15.12 (σ 5.84) |
| `cycle_count` mean (σ, min) | — | 35.00 (σ 14.22, min 0) | 37.38 (σ 1.60, min 35) |
| `code_mass` mean | ↓ | **769.12** 🏆 (σ 197) | 878.50 (σ 91) |
| `smell_total` mean | ↓ | **0.38** 🏆 | **0.38** 🏆 |
| `cc_longest_function` mean | ↓ | 13.25 (σ 1.58) | **12.38** 🏆 (σ 1.41) |
| `cognitive_max` mean | ↓ | **4.38** 🏆 (σ 1.06) | 5.00 (σ 1.77) |
| `mccabe_max` mean | ↓ | **4.25** 🏆 (σ 0.46) | 4.50 (σ 0.76) |
| `duration_seconds` mean | ↓ | **2234** 🏆 | 2530 (+13 %) |
| `total_tokens` mean | ↓ | **39.78 M** 🏆 | 44.44 M (+12 %) |

Lesart in zwei Sätzen: Die drei v6.5.1-Cleanups (Konsistenz, refactor.md-Entkopplung, tdd-experiment-mode-Reframing) beschädigen die v6.1-with-why-Baseline **nicht** — alle Korrektheits- und Disziplin-Achsen liegen im Baseline-Korridor oder leicht darüber, bei deutlich engerer Streuung. Der Preis sind moderat höhere Kosten (+13 % Wallclock, +12 % Tokens), getrieben durch +34 % Refactorings.

---

## F-1.1 — Cleanups sind verhaltens-äquivalent zur Baseline; keine Korrektheits-Regression

**Statement.** v6.2-with-why-cleaned zeigt auf claim-office mit Opus 4.7 Portkey-no-thinking keine Korrektheits-Regression gegenüber v6.1-with-why. Verification-Pct-Mean liegt mit 0.96 leicht über Baseline 0.91, die Streuung kollabiert von σ 0.26 auf σ 0.09 (−65 %). Tests-Passing und Completed-Within-Budget sind in beiden Zellen bei 100 %.

**Daten (n=8 pro Zelle).**

| Metrik | v6.1-with-why | v6.2-with-why-cleaned |
|---|---|---|
| `verification_pct` mean / σ / min | 0.91 / 0.26 / 0.27 | **0.96 / 0.09 / 0.73** |
| Runs mit verif = 1.0 | 6/8 | 6/8 |
| Runs mit verif ≥ 0.9 | 6/8 | 7/8 |
| Runs mit verif < 0.5 | 1/8 (0.27) | 0/8 |
| `tests_passing` | 100 % | 100 % |

**Rationale.** H0 (Cleanups verhaltens-neutral) ist bestätigt. Die zentrale Sorge — eine Wiederholung des v6.5-lean-Schadens (siehe Memory `v6.5-correctness-setback`, wo skill-creator-getriebene Reduktionen die Korrektheit zerstörten) — ist widerlegt. Die drei jetzt angewendeten Cleanups (Konsistenz-Renames, refactor.md-Decoupling, tdd-experiment-mode-Reformulierung) haben MUSTs, Why-Blöcke und alle vier MARKERS.md-Marker unangetastet gelassen; das schlägt sich messbar in stabiler Korrektheit nieder. H1 (Korrektheits-Bruch) ist klar widerlegt.

**Caveat Outlier-Asymmetrie.** Der v6.1-with-why-Datensatz enthält einen extremen Outlier (`2026-05-24_00-08-47`, verif=0.27, cycles=0, dur=1030s) — das ist ein Symptom des Nudge-Transcript-Overwrite-Bugs (Memory `nudge-transcript-overwrite-bug`), der bis 2026-05-24 die Pipeline betraf. Alle v6.2-Runs entstanden nach dem Pipeline-Fix. Filtert man bei v6.1-with-why auf `end_turn=1`-Runs (n=7), liegt dort Verification bei 7/7 = 1.0 — also strikt höher als v6.2-with-why 6/8 = 0.75 (Mean=0.96). Diese Asymmetrie verzerrt die Übersichts-Trophy: v6.2 hat 🏆 wegen besserem Mean inkl. Outlier, ohne Outlier-Vergleich ist v6.1 besser. Sicher ist: v6.2 ist nicht *schlechter*, der genaue Vorzeichen-Effekt ist im Noise bei n=8.

---

## F-1.2 — Disziplin-Drift: mehr Refactorings, engere Streuung

**Statement.** v6.2 refactoriert deutlich häufiger (+34 %) und stoppt nicht mehr früh: `cycle_count` streut nur noch von 35–40 (σ 1.6, vs. v6.1 σ 14.2 mit Range 0–42). Auch `refactorings_applied` σ reduziert sich von 8.42 auf 6.90; die min steigt von 0 auf 18 (kein Refactoring-Aussetzer mehr).

**Daten (n=8 pro Zelle).**

| Metrik | v6.1-with-why | v6.2-with-why-cleaned | Δ |
|---|---:|---:|---|
| `refactorings_applied` mean / σ / min | 18.50 / 8.42 / 0 | **24.88 / 6.90 / 18** | +34 % Mean, σ −18 % |
| `cycle_count` mean / σ / range | 35.00 / 14.22 / 0–42 | **37.38 / 1.60 / 35–40** | +7 % Mean, σ −89 % |
| `predictions_correct_rate` | 96.2 % | **97.2 %** | +1 pp |
| `tests_passed_immediately` mean | 15.38 | 15.12 | ≈ |

**Rationale.** H2 (Disziplin-Drift bei stabiler Korrektheit) ist teilweise bestätigt. v6.2 zeigt insbesondere bei `refactorings_applied` einen messbaren Anstieg über die Baseline. Mechanistisch plausibel: Die `refactor.md`-Entkopplung (role-neutrale Sprache statt "TDD Refactor Phase specialist" + Wegfall der "Proceeding to the next test"-Coda) entfernt eine implizite Verkettungs-Hemmung — der Subagent betrachtet sich nicht mehr als Teil einer endlichen TDD-Sequenz und liefert mehr Iterations. Die Cycle-Streuung-Kompression von σ 14.22 auf σ 1.60 ist ebenfalls auffällig, allerdings stark durch den einen v6.1-Outlier (cycles=0) gehoben — siehe Caveat in F-1.1.

Die Predictions-Korrektheit steigt minimal (+1 pp), bleibt im Rauschen. Die Tests-Passed-Immediately-Werte sind quasi identisch — die Cleanups haben weder Disziplin geschwächt noch hardgekoppelte Vorausplanung verstärkt.

---

## F-1.3 — Code-Qualität neutral bis leicht verschlechtert; Smells unverändert

**Statement.** Die Code-Qualitäts-Metriken zeigen ein gemischtes Bild: `smell_total` ist identisch (beide 0.38), `cc_longest_function` leicht besser in v6.2 (12.38 vs 13.25), aber `code_mass` (+14 %), `cognitive_max` (+14 %) und `mccabe_max` (+6 %) sind in v6.2 leicht erhöht. Keiner der Anstiege überschreitet 1σ der jeweiligen Streuung.

**Daten (n=8 pro Zelle).**

| Metrik (↓ = besser) | v6.1-with-why | v6.2-with-why-cleaned |
|---|---:|---:|
| `code_mass` mean | **769.12** 🏆 (σ 197) | 878.50 (σ 91) |
| `smell_total` mean | **0.38** 🏆 | **0.38** 🏆 |
| `cc_longest_function` mean | 13.25 (σ 1.58) | **12.38** 🏆 (σ 1.41) |
| `cognitive_max` mean | **4.38** 🏆 (σ 1.06) | 5.00 (σ 1.77) |
| `mccabe_max` mean | **4.25** 🏆 (σ 0.46) | 4.50 (σ 0.76) |

**Rationale.** Die `code_mass`-Differenz (769 → 879) ist substanziell, fällt aber kleiner aus als die v6.1-Streuung (σ 197) und kann zum Teil daher kommen, dass mehr v6.2-Runs alle Tests vollständig implementieren (kein "halbfertiger" Outlier wie der 0.27-v6.1-Run, der die v6.1-code_mass nach unten zog). Die Komplexitäts-Spitzen (`cognitive_max`, `mccabe_max`) steigen leicht, bleiben aber im einstelligen Bereich und ohne `high_count`-Verstöße.

Die Smells-Gleichheit (0.38 / 0.38) ist das stärkste Signal: das Refactor-Subagent-Verhalten kappt weiterhin Smells konsistent.

---

## F-1.4 — Kosten-Aufschlag durch Mehr-Refactorings: +13 % Wallclock, +12 % Tokens

**Statement.** v6.2 kostet im Mittel +296 s Wallclock (+13 %) und +4.66 M Tokens (+12 %) pro Run. Der Aufpreis ist konsistent mit der erhöhten Refactor-Aktivität aus F-1.2 (+34 % Refactorings, +7 % Cycles).

**Daten (n=8 pro Zelle).**

| Metrik (↓ = besser) | v6.1-with-why | v6.2-with-why-cleaned | Δ |
|---|---:|---:|---|
| `duration_seconds` mean | **2234** 🏆 (σ 550) | 2530 (σ 401) | +13 % |
| `total_tokens` mean | **39.78 M** 🏆 (σ 16.1 M) | 44.44 M (σ 3.4 M) | +12 % |
| `cycle_count` mean | 35.00 | 37.38 | +7 % |
| `total_tokens / cycle` (≈) | 1.14 M | 1.19 M | +5 % |

**Rationale.** Pro Cycle ist v6.2 nur marginal teurer als v6.1 (+5 % Tokens/Cycle, im σ-Rauschen). Der Aufpreis pro Run kommt fast vollständig aus den +7 % Cycles und insbesondere den +34 % Refactorings. Die Streuung von `total_tokens` reduziert sich drastisch (σ 16.1 M → 3.4 M); v6.2 ist also signifikant **vorhersagbarer** in den Kosten — die Quasi-Halbierung der Wallclock-Streuung ebenfalls.

---

## Status der Hypothesen

| Hypothese | Status | Beleg |
|---|---|---|
| **H0** Cleanups verhaltens-äquivalent | überwiegend bestätigt | Korrektheit, Tests, Budget identisch; geringfügige Drifts in Disziplin/Code-Mass im Noise-Bereich |
| **H1** Korrektheits-Bruch ≥ 5 pp | klar widerlegt | verification_pct mean 0.91 → 0.96 (+5 pp), tests_passing 100 %/100 %, kein Failure-Modus reproduziert |
| **H2** Disziplin-Drift bei stabiler Korrektheit | teilweise bestätigt | refactorings_applied +34 %, cycle_count-Streuung gekappt — beides ohne Korrektheits-Schaden |

## Konsequenzen

1. **v6.2-with-why-cleaned wird neue Default-Baseline** für claim-office-RQs mit Opus 4.7 No-Thinking. v6.1-with-why bleibt als Vorgänger-Referenz im Inventar, wird aber nicht mehr aktiv verwendet.
2. **Eintrag in `workflow-construction.md`** (Inventar-Tabelle + Tragende Befunde) zieht v6.2 als neue Empfehlung auf.
3. **Offene Fragen** für Folge-RQs:
   - Hält das Cleanup-Bild auf game-of-life (trainings-bekannte Kata)?
   - Hält es auf anderen Modellen (Sonnet, Haiku, ohne Portkey)?
   - Lohnen die +13 % Wallclock — oder gibt es eine v6.3-Variante, die nur eine der drei Cleanup-Achsen behält und die Kosten reduziert?

**Caveat Single-Cell-Validierung.** n=8 reicht für "keine grobe Regression", nicht für strenge Gleichheits-Beweise. Insbesondere die Korrektheits-Differenz (1.0 vs 0.96 ohne v6.1-Outlier) ist innerhalb n=8 nicht von Noise zu trennen. v6.2 ist bei Übernahme als neue Baseline für mindestens eine weitere Modell- oder Kata-Achse zu validieren, bevor es generalisiert empfohlen wird.
