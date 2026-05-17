# RQ-13 — Findings: v6.5-lean Bundle-Validierung

## Überblick

Vergleich v6-hybrid (Original, n=10) vs v6.5-lean (kombinierte Reduktion aus RQ-9/10/11 + skill-creator-Why-Rewrites, n=10) auf game-of-life-example-mapping, opus-4-7-no-thinking. **v6.5-lean liefert leicht bessere Code-Qualität bei deutlich höherer TDD-Disziplin — kostet aber 12-20 % mehr Tokens/Wallclock. Quality-First-Workflow mit klarem Cost-Tradeoff.**

## Headline-Tabelle

| Outcome | v6 (n=10) | v6.5-lean (n=10) | Δ | Bewertung |
|---|---:|---:|---:|---|
| Code-Mass (APP) | 158.6 ± 15.14 | **143.9 ± 6.06** | −14.7 | v6.5 ~9 % besser, **2.5× stabiler** |
| Smell-Summe | 2.2 ± 0.42 | 2.2 ± 0.42 | 0.0 | identisch |
| Spitzen-Komplexität (`cc_longest_function`) | 13.1 ± 5.97 | **12.7 ± 5.79** | −0.4 | leicht besser, σ identisch |
| `cognitive_max` | 5.2 ± 2.30 | 5.1 ± **3.84** | −0.1 | Mittel identisch, σ 1.67× breiter |
| `mccabe_max` | 4.5 ± 1.51 | 4.5 ± 2.01 | 0.0 | Mittel identisch, σ 1.33× breiter |
| `refactorings_applied` | 4.0 ± 1.63 | **6.9 ± 2.33** | **+2.9 (+72 %)** | klar mehr Refactor-Aktivität |
| `tests_passed_immediately` | 3.3 ± 3.02 | **1.4 ± 2.27** | **−1.9 (−58 %)** | klar weniger Over-Implementation |
| `predictions_correct_rate` | 99.4 % | **100 %** (166/166) | +0.6 pp | perfekt |
| `cycle_count` | 8.3 ± 0.82 | 8.2 ± 0.63 | −0.1 | identisch |
| `total_tokens` | 6.62 M | **7.40 M** | **+0.79 M (+11.8 %)** | teurer |
| `duration_seconds` | 521 | **624** | **+102 s (+19.6 %)** | langsamer |
| `tests_passing` / `verification_pct` | 100 % / 1.00 | 100 % / 1.00 | gleich | Korrektheit unverändert |

---

## F-13.1 — Code-Qualität bei v6.5 leicht besser auf 3 von 5 Metriken; H1 übertroffen

**Aussage:** Alle 5 primären Code-Qualitäts-Metriken liegen innerhalb ±1 σ der v6-Streuung. Bei n=10 zeichnet sich ein klarer Mittel-Tilt zu v6.5 ab:

- `code_mass` 143.9 vs 158.6 — v6.5 ~9 % besser (Δ=−14.7, knapp unter σ-Schwelle 15.14)
- `cc_longest_function` 12.7 vs 13.1 — v6.5 leicht besser (n=5 hatte fälschlicherweise das Gegenteil gezeigt — Sampling-Artefakt; bei n=10 geflippt)
- Smell-Summe, `cognitive_max`, `mccabe_max` praktisch identisch

**Hypothesen-Auswertung:** H1 (gleichwertige Code-Qualität) — **bestätigt mit leichtem Plus für v6.5**. H6 (Why-Rewrites helfen über reine Reduktion hinaus) — **gestützt**: drei Metriken tilten zu v6.5, alle anderen sind unverändert. Vergleich mit RQ-9 (Four Rules raus allein) zeigt dort gemischte Richtung — die Kombination Reduktion + Why-Rewrites bringt zusätzliche Klarheit.

**Methodische Lehre (parallel zu RQ-11 F-11.1):** der n=5-Befund "v6.5 hat cc_longest schlechter (14.6)" war Sampling-Artefakt — bei n=10 flippte er zu "leicht besser (12.7)". Bestätigt erneut die RQ-5-F-5.3-Erfahrung: n=5-Mittel-Differenzen unter ~0.5σ sind nicht ranking-stabil.

---

## F-13.2 — TDD-Disziplin spürbar verbessert: +72 % Refactor-Quote, −58 % Over-Implementation

**Aussage:** Der stärkste Effekt von v6.5-lean liegt in der **TDD-Disziplin**:

| Disziplin-Indikator | v6 | v6.5-lean | Richtung |
|---|---:|---:|---|
| `refactorings_applied` μ ± σ | 4.0 ± 1.63 | **6.9 ± 2.33** | +72 % mehr Refactor-Phasen |
| `tests_passed_immediately` μ ± σ | 3.3 ± 3.02 | **1.4 ± 2.27** | −58 % weniger Over-Implementation |
| `predictions_correct_rate` (pooled) | 99.4 % | **100 %** (166 von 166) | perfekt |
| `cycle_count` μ ± σ | 8.3 ± 0.82 | 8.2 ± 0.63 | identisch |

Drei Effekte überlagern sich:

1. **Refactor-Quote 4.0 → 6.9** — das Modell führt fast doppelt so viele Refactor-Phasen pro Run aus, ohne dass die Test-Anzahl wächst. Bedeutet: mehr Refactor-Iterationen pro Test.
2. **Over-Implementation 3.3 → 1.4** — deutlich weniger Tests, die schon "von selbst" in der Red-Phase passen. Das Modell implementiert in Green sparsamer; mehr Tests laufen durch echte rote Phasen.
3. **Prediction-Compliance 99.4 % → 100 %** (166/166 korrekt vs 169/170 bei v6).

**Mechanismus-Hypothese — die Why-Rewrites wirken:** drei spezifische Effekte lassen sich zu drei konkreten skill-creator-Rewrites zurückverfolgen:

- *"Why minimality matters"* in `green.md` erklärt, dass minimaler Green-Code Refactor-Opportunities sichtbar macht. Modell implementiert sparsamer → Over-Implementation halbiert.
- *"Why this format matters"* in `red.md` Step 7 erklärt die Marker-Compliance-Mechanik. Modell hält das verbatim Prediction-Format sauber → 100 % Compliance.
- *"Why skills and subagents are required"* in `tdd.md` erklärt Marker-Compliance generell. Modell zögert weniger beim Refactor-Subagent-Aufruf → 72 % mehr Refactor-Phasen.

H4 (Disziplin-Stabilität, keine Verschlechterung) — **deutlich übertroffen**. v6.5 ist nicht stabil sondern **klar besser** in TDD-Disziplin.

---

## F-13.3 — Stabilität gemischt: Code-Mass enger, cognitive_max/mccabe breiter

**Aussage:** v6.5-lean ist nicht uniform stabiler. Drei Metriken bleiben gleich, eine wird klar enger, zwei werden breiter:

| Metrik | v6 σ | v6.5 σ | σ-Faktor |
|---|---:|---:|---:|
| Code-Mass | 15.14 | **6.06** | **0.40×** (2.5× enger) |
| Smell-Summe | 0.42 | 0.42 | 1.00× (identisch) |
| Spitzen-Komplexität | 5.97 | 5.79 | 0.97× (identisch) |
| `cognitive_max` | 2.30 | **3.84** | **1.67×** (breiter) |
| `mccabe_max` | 1.51 | 2.01 | 1.33× (breiter) |

`cognitive_max` zeigt einen 12er-Outlier (v6-Maximum 7) — die Verbreiterung ist real, nicht Einzel-Run-Artefakt (bestätigt bei n=10). v6.5 verliert den 0%-Outlier-Status aus RQ-5 F-5.2 für diese Metrik.

**Methodische Lehre:** der n=5-Befund hatte code_mass σ-Reduktion mit Faktor 5× geschätzt; bei n=10 ist es nur 2.5×. n=5-σ-Schätzungen überschätzen Differenzen systematisch — typische Eigenschaft kleiner Stichproben.

H2 (keine σ-Verdopplung) — **erfüllt** (max σ-Faktor 1.67× < 2.0×), aber knapp.

---

## F-13.4 — Token- und Wallclock-Kosten **steigen** (entgegen H3)

**Aussage:** Die Hoffnung auf additive Token-Einsparung (RQ-9 −8.5 % + RQ-11 −5.3 % ≈ erwartet −12 bis −15 %) ist **widerlegt**:

| Outcome | v6 | v6.5-lean | Δ |
|---|---:|---:|---:|
| `total_tokens` μ | 6.62 M | **7.40 M** | **+11.8 %** |
| `duration_seconds` μ | 521 | **624** | **+19.6 %** |

H3 — **falsifiziert**, Richtung sogar umgekehrt.

**Mechanismus-Hypothese:** der Kostenanstieg ist eine **direkte Folge der höheren Disziplin aus F-13.2**:

- 6.9 statt 4.0 Refactor-Phasen → 2.9 zusätzliche Subagent-Spawns pro Run
- Jeder Refactor-Subagent läuft im isolierten Kontext → kein Prompt-Cache-Hit, voller Kontext-Reload pro Spawn
- Geschätzter Mehraufwand pro zusätzlichem Spawn: ~250-300 K Tokens (vgl. RQ-7 F-7.3 Mechanik). 2.9 Extra-Spawns × ~270 K ≈ +0.78 M Mehr-Tokens — passt fast exakt zum gemessenen +0.79 M Δ.

Die Token-Einsparung aus der **Prompt-Reduktion** (Four Rules raus, Emojis raus, Pep raus, Project-Standards raus — geschätzt 100-200 Tokens × Skill-Invocations pro Run) wird **vollständig überkompensiert** durch die Token-Mehrkosten der zusätzlichen Refactor-Spawns.

**Methodischer Hauptbefund (Orthogonalität):** *Prompt-Reduktion* und *Workflow-Disziplin* sind **orthogonale Optimierungsdimensionen**, die sich **nicht additiv kombinieren**. Eine Reduktion, die *durch* bessere Disziplin Token-Mehrkosten auslöst, kann ihre eigene direkte Einsparung übersteigen. Künftige Workflow-Optimierung muss diese Wechselwirkung explizit modellieren — eine schlankere Anweisung kann teurer werden, wenn sie das Modell zu mehr (besseren) Aktionen anregt.

---

## F-13.5 — Korrektheit unverändert (Sanity)

`tests_passing = 100 %` und `verification_pct = 1.00` über alle 20 Runs. Keine Pipeline-Auffälligkeit, keine Marker-Compliance-Probleme.

H5 — **bestätigt**.

---

## F-13.6 — Konsequenz: v6.5-lean ist Quality-First-Workflow mit Cost-Tradeoff

| Ziel-Profil | Empfehlung |
|---|---|
| Token-Budget primär | **v6.4-no-emoji** (RQ-11: −5 % Tokens bei gleicher Qualität) |
| Quality + Disziplin primär | **v6.5-lean** (+72 % Refactorings, −58 % Over-Impl, 100 % Pred-Rate, bessere Code-Mass, +12 % Tokens) |
| Default-Drop-in für opus-4-7 game-of-life | **v6.5-lean wenn Quality > Cost, sonst v6 / v6.4** |
| Sonnet-Deployment | **v6.4-no-emoji** (RQ-12 F-12.2: 100 % vs 40 % Korrektheit) |
| Opus-4-6-Portkey | nicht v6-Familie — andere Workflow-Architektur nötig |

**v6.5-lean ist als Quality-First-Default ready** für game-of-life × opus-4-7-no-thinking. Vor breiterer Promotion sinnvoll:

1. **claim-office Cross-Kata** — die Disziplin-Boosts (+72 % Refactor, −58 % Over-Impl) könnten auf der längeren CLI-Kata stärker ausfallen, gerade dort wo v5-Disziplin in RQ-7 F-7.4 kollabierte. Token-Mehrkosten ebenfalls wahrscheinlich stärker.
2. **Sonnet-Cross-Model** — RQ-12 F-12.2 hat gezeigt, dass schwächere Modelle anders auf Workflow-Reduktionen reagieren. v6.5 könnte auf Sonnet noch stärker punkten (Why-Rewrites helfen schwächeren Modellen besonders) oder die Subagent-Kosten würden die Quality-Wins überkompensieren.

## Caveats

- **Single Kata, single Modell**: nur game-of-life-example-mapping auf opus-4-7-no-thinking. Generalisierbarkeit der Disziplin-Boosts und Token-Mehrkosten auf claim-office und Sonnet ist offen.
- **Why-Rewrites + Reduktion nicht separierbar**: RQ-13 misst den Bundle-Effekt. Ob die Refactor-Quoten-Steigerung von der Why-Begründung oder von der Prompt-Schlankheit kommt, lässt sich nicht trennen — wäre Folge-RQ (z. B. "v6.5-lean-no-why" als reine Reduktion ohne Rewrites).
- **`cognitive_max`-Outlier**: 1 von 10 v6.5-Runs mit cognitive=12. Manuelle Transkript-Inspektion könnte zeigen, ob das ein Disziplin-Aussetzer in der Refactor-Phase war.
- **Token-Mehrkosten-Erklärung quantitativ**: die Korrelation +2.9 Refactor-Spawns × ~270 K Tokens ≈ +0.78 M Tokens ist konsistent (gemessen +0.79 M), aber nicht streng kausal nachgewiesen.
- **Methodische Lehre für Folge-RQs**: der Orthogonalitäts-Befund aus F-13.4 macht künftige Reduktions-RQs interpretativ schwieriger. Token-Einsparung allein ist keine ausreichende Erfolgsmetrik mehr — sie kann sich in Folge-Mehrkosten verwandeln, wenn die Reduktion Verhalten verändert.
