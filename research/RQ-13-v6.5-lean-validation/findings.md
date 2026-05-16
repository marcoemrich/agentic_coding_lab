# RQ-13 — Findings: v6.5-lean Bundle-Validierung

## Überblick

Vergleich v6-hybrid (Original, n=10) vs v6.5-lean (kombinierte Reduktion aus RQ-9/10/11 + skill-creator-Why-Rewrites, n=5) auf game-of-life-example-mapping, opus-4-7-no-thinking. **v6.5-lean liefert gleichwertige bis leicht bessere Code-Qualität bei deutlich höherer TDD-Disziplin — kostet aber 14-20 % mehr Tokens/Wallclock. Kein einseitiger Sieg, sondern ein neuer Quality-vs-Cost-Tradeoff.**

## Headline-Tabelle

| Outcome | v6 (n=10) | v6.5-lean (n=5) | Δ | Bewertung |
|---|---:|---:|---:|---|
| Code-Mass (APP) | 158.6 ± 15.14 | **145.0 ± 3.00** | −13.6 | v6.5 leicht besser, **5× stabiler** |
| Smell-Summe | 2.2 ± 0.42 | 2.2 ± 0.45 | 0.0 | identisch |
| Spitzen-Komplexität | 13.1 ± 5.97 | 14.6 ± 6.84 | +1.5 | innerhalb σ |
| `cognitive_max` | 5.2 ± 2.30 | 5.2 ± **4.09** | 0.0 | Mittel identisch, σ 1.78× breiter |
| `mccabe_max` | 4.5 ± 1.51 | 4.6 ± 2.07 | +0.1 | identisch |
| `refactorings_applied` | 4.0 ± 1.63 | **6.8 ± 2.68** | **+2.8 (+70 %)** | klar mehr Refactor-Aktivität |
| `tests_passed_immediately` | 3.3 ± 3.02 | **1.8 ± 2.49** | **−1.5 (−45 %)** | klar weniger Over-Implementation |
| `predictions_correct_rate` | 99.4 % | **100 %** (86/86) | +0.6 pp | perfekt |
| `cycle_count` | 8.3 ± 0.82 | 8.4 ± 0.89 | +0.1 | identisch |
| `total_tokens` | 6.62 M | **7.52 M** | **+0.90 M (+13.6 %)** | teurer |
| `duration_seconds` | 521 | **628** | **+107 s (+20.5 %)** | langsamer |
| `tests_passing` / `verification_pct` | 100 % / 1.00 | 100 % / 1.00 | gleich | Korrektheit unverändert |

---

## F-13.1 — Code-Qualitäts-Mittel gleichwertig oder leicht besser; H1 bestätigt

**Aussage:** Alle 5 primären Code-Qualitäts-Metriken liegen innerhalb ±1 σ der v6-Streuung. Smell-Summe, `cognitive_max` und `mccabe_max` sind praktisch identisch zwischen v6 und v6.5. `code_mass` liegt bei v6.5 ~9 % unter v6 (145 vs 158.6) — knapp unter der Schwelle, aber konsistent in dieselbe Richtung über alle 5 v6.5-Runs (min 140, max 148, σ nur 3.0).

**Hypothesen-Auswertung:** H1 (gleichwertige Code-Qualität) — **bestätigt**. H6 (Why-Rewrites helfen über reine Reduktion hinaus, messbar an Code-Qualität) — **schwach gestützt**: nur Code-Mass zeigt klare Tendenz, die übrigen Metriken sind unverändert.

**Vergleich mit RQ-9 (Four Rules raus allein):** dort waren alle Mittel-Differenzen innerhalb ±1 σ mit gemischter Richtung. v6.5 zeigt jetzt **konsistentere Richtung** auf Code-Mass — Hinweis, dass die Bundle-Wirkung > Summe der Einzel-Effekte, aber bei n=5 grenzwertig.

---

## F-13.2 — TDD-Disziplin spürbar verbessert: +70 % Refactor-Quote, −45 % Over-Implementation

**Aussage:** Der auffälligste Effekt von v6.5-lean liegt nicht in der Code-Qualität, sondern in der **TDD-Disziplin**:

| Disziplin-Indikator | v6 | v6.5-lean | Richtung |
|---|---:|---:|---|
| `refactorings_applied` μ | 4.0 | **6.8** | +70 % mehr Refactor-Phasen |
| `tests_passed_immediately` μ | 3.3 | **1.8** | −45 % weniger Over-Impl |
| `predictions_correct_rate` (pooled) | 99.4 % | **100 %** (86/86 korrekt) | perfekt |
| `cycle_count` μ | 8.3 | 8.4 | identisch |

Drei Effekte überlagern sich:

1. **Refactor-Quote steigt von 4.0 auf 6.8** — das Modell führt fast doppelt so viele Refactor-Phasen pro Run aus, ohne dass die Test-Anzahl (cycle_count) wächst. Bedeutet: mehr Refactor-Iterationen pro Test.
2. **Over-Implementation fällt von 3.3 auf 1.8** — weniger Tests, die in der Red-Phase schon "von selbst" passen. Das Modell implementiert weniger spekulativ in der Green-Phase, wodurch mehr Tests echte rote Phasen durchlaufen.
3. **Prediction-Compliance perfekt** — 86 von 86 Predictions korrekt, vs 169/170 bei v6.

**Mechanismus-Hypothese:** Die skill-creator-Why-Rewrites wirken. Drei konkrete Wirkungen lassen sich zu drei spezifischen Rewrite-Stellen zurückverfolgen:

- *"Why minimality matters"* in `green.md` erklärt, dass minimaler Green-Code Refactor-Opportunities sichtbar macht — Modell implementiert sparsamer → weniger `tests_passed_immediately`.
- *"Why this format matters"* in `red.md` Step 7 erklärt die Marker-Compliance-Mechanik — Modell hält das verbatim Format sauberer → 100 % Predictions.
- *"Why skills and subagents are required"* in `tdd.md` erklärt Marker-Compliance generell — Modell zögert nicht beim Aufruf des Refactor-Subagents → mehr Refactor-Phasen.

H4 (Disziplin-Stabilität, keine Verschlechterung) — **deutlich übertroffen**. v6.5 ist nicht stabil sondern **besser** in TDD-Disziplin.

---

## F-13.3 — Stabilität gemischt: Code-Mass dramatisch enger, cognitive_max breiter (Outlier)

**Aussage:** v6.5-lean ist nicht uniform stabiler als v6, sondern zeigt zweiteilige Streuungs-Veränderung:

| Metrik | v6 σ | v6.5 σ | σ-Faktor |
|---|---:|---:|---:|
| Code-Mass | 15.14 | **3.00** | **0.20×** (5× enger!) |
| Smell-Summe | 0.42 | 0.45 | 1.07× |
| Spitzen-Komplexität | 5.97 | 6.84 | 1.15× |
| `cognitive_max` | 2.30 | **4.09** | **1.78×** (breiter) |
| `mccabe_max` | 1.51 | 2.07 | 1.37× |

Code-Mass-Streuung kollabiert von 15.14 auf 3.00 — alle 5 v6.5-Runs liegen in [140, 148], ein extrem enges Band. `cognitive_max` dagegen zeigt einen 12er-Outlier (v6-Maximum war 7), σ verdoppelt sich.

**Caveat:** bei n=5 ist die σ-Schätzung breit. Der 12er-Outlier könnte ein Einzelfall sein (1 von 5 = 20 % Outlier-Rate-Schätzung mit großer Unsicherheit). RQ-11-Lesson-Learned (n=5 → n=10 hat dort die Mittel-Tilt-Beobachtung als Sampling-Artefakt entlarvt) gilt auch hier.

H2 (keine σ-Verdopplung wie RQ-8) — **nicht uniform erfüllt**. cognitive_max zeigt die Verdopplung. Für robuste Stabilitäts-Aussage n=10 nötig.

---

## F-13.4 — Token- und Wallclock-Kosten **steigen** (entgegen Erwartung)

**Aussage:** Die Hoffnung auf additive Token-Einsparung (RQ-9 −8.5 % + RQ-11 −5.3 % ≈ erwartet −12 bis −15 %) ist **widerlegt**:

| Outcome | v6 | v6.5-lean | Δ |
|---|---:|---:|---:|
| `total_tokens` μ | 6.62 M | **7.52 M** | **+13.6 %** |
| `duration_seconds` μ | 521 | **628** | **+20.5 %** |

H3 (additive Einsparung) — **falsifiziert**, Richtung sogar umgekehrt.

**Mechanismus-Hypothese:** der Kostenanstieg ist eine **direkte Folge der höheren Disziplin aus F-13.2**:

- 6.8 statt 4.0 Refactor-Phasen → 6.8 statt 4.0 Subagent-Spawns
- Jeder Refactor-Subagent läuft im isolierten Kontext → kein Prompt-Cache-Hit, voller Kontext-Reload pro Spawn
- Geschätzter Mehraufwand pro zusätzlichem Spawn: ~300-500 K Tokens (vgl. RQ-7 F-7.3 Mechanik). 2.8 Extra-Spawns × ~330 K ≈ 0.9 M Mehr-Tokens — passt zum gemessenen +0.9 M Δ.

Die Token-Einsparung aus der **Prompt-Reduktion** (Four Rules raus, Emojis raus, Pep raus, Project-Standards raus — geschätzt 100-200 Tokens × Skill-Invocations pro Run) wird **vollständig überkompensiert** durch die Token-Mehrkosten der zusätzlichen Refactor-Spawns.

Das ist methodisch ein wichtiger Befund: **Prompt-Reduktion und Workflow-Disziplin sind orthogonale Optimierungsdimensionen**, die sich nicht additiv kombinieren. Eine Reduktion, die *durch* bessere Disziplin Token-Mehrkosten auslöst, kann ihre eigene direkte Einsparung übersteigen.

---

## F-13.5 — Korrektheit unverändert (Sanity)

`tests_passing = 100 %` und `verification_pct = 1.00` über alle 5 v6.5-Runs und alle 10 v6-Runs. Keine Pipeline-Auffälligkeit, keine Marker-Compliance-Probleme. v6.5-lean ist als Workflow valide.

H5 — **bestätigt**.

---

## F-13.6 — Konsequenz: v6.5-lean ist nicht Default-Sieger, sondern Quality-First-Alternative

| Ziel-Profil | Empfehlung |
|---|---|
| Token-Budget primär | v6.4-no-emoji (RQ-11: −5 % Tokens bei gleicher Qualität) |
| Quality + Disziplin primär | **v6.5-lean** (mehr Refactorings, weniger Over-Implementation, perfekte Pred-Rate, mehr Token-Kosten) |
| Default-Drop-in für opus-4-7 | v6-hybrid (RQ-7) bleibt als Baseline, v6.5 erst nach n=10-Validierung |
| Sonnet-Deployment | **v6.4-no-emoji** (RQ-12 F-12.2: 100 % Korrektheit dort, vs 40 % bei v6) |

**Vor Promotion zu Default-Hybrid für opus-4-7-Use-Cases benötigt v6.5-lean:**

1. **n=10 game-of-life Replikation** — bestätigt, ob die cognitive_max-σ-Verbreiterung Sampling-Artefakt ist oder echter Effekt; bestätigt, ob Code-Mass-Vorteil bei größerem n hält.
2. **claim-office Cross-Kata** — die Disziplin-Boosts (+70 % Refactor, −45 % Over-Impl) könnten auf der längeren CLI-Kata stärker ausfallen, gerade dort wo v5-Disziplin in RQ-7 F-7.4 kollabiert. Token-Mehrkosten ebenfalls.
3. **Sonnet-Cross-Model** — RQ-12 F-12.2 hat gezeigt, dass schwächere Modelle anders auf Workflow-Reduktionen reagieren. v6.5 könnte auf Sonnet entweder noch stärker punkten (Why-Rewrites helfen schwächeren Modellen besonders) oder gleich gut wie v6.4.

## Caveats

- **n=5 v6.5-lean**: alle Aussagen über σ und Stabilität sind statistisch grenzwertig. Vor Workflow-Promotion n=10 nötig.
- **Why-Rewrites + Reduktion nicht separierbar**: RQ-13 misst den Bundle-Effekt. Ob die Refactor-Quoten-Steigerung von der Why-Begründung oder von der Prompt-Schlankheit kommt, lässt sich nicht trennen — wäre Folge-RQ.
- **Single Kata, single Modell**: nur game-of-life-example-mapping auf opus-4-7-no-thinking. Generalisierbarkeit der Disziplin-Boosts offen.
- **Outlier in cognitive_max**: 1 v6.5-Run mit cognitive=12. Manuelle Transkript-Inspektion könnte zeigen, ob das ein Disziplin-Aussetzer in der Refactor-Phase war oder eine andere Ursache hat.
- **Token-Mehrkosten quantitative Erklärung**: die Korrelation +2.8 Refactor-Spawns × ~330 K Tokens ≈ +0.9 M Tokens ist konsistent, aber nicht streng kausal nachgewiesen. Pro-Spawn-Tokens variieren mit Kata und Modell.
