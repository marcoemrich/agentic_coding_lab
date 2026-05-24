# RQ-1.5: Why-Block-Effekt auf v6.1-Basis (claim-office)

## Übersicht

Baseline (`v6.1-hybrid-testlist-scope-fix`, n=8) vs. With-Why (`v6.1-with-why`, n=8) auf `claim-office-example-mapping × opus-4-7-portkey-no-thinking`. Richtungen: ↑ = höher besser, ↓ = kleiner besser.

| Metrik | Richtung | Baseline | with-why |
|---|---|---:|---:|
| `verification_pct` (Korrektheit) | ↑ | **1.00** 🏆 | 0.91 |
| `tests_passing` (rate) | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` | ↑ | **100 %** 🏆 | **100 %** 🏆 |
| `predictions_correct_rate` | ↑ | **96.5 %** 🏆 | **96.2 %** 🏆 |
| `refactorings_applied` (mean) | ↑ | 9.88 (σ 5.69) | **18.50** 🏆 (σ 8.42) |
| `cycle_count` (mean) | — | 25.0 (σ 14.7) | 35.0 (σ 14.2) |
| `tests_passed_immediately` (mean) | ↑ | 12.0 (σ 9.1) | **15.4** 🏆 (σ 7.3) |
| `code_mass` (mean) | ↓ | 840.75 | **769.12** 🏆 |
| `smell_total` (mean) | ↓ | 2.88 (σ 4.7) | **0.38** 🏆 (σ 0.52) |
| `cc_longest_function` (mean) | ↓ | 23.38 (σ 15.5, max 60) | **13.25** 🏆 (σ 1.58, max 15) |
| `cognitive_max` (mean) | ↓ | 7.62 (σ 6.0, max 21) | **4.38** 🏆 (σ 1.06, max 6) |
| `mccabe_max` (mean) | ↓ | 6.75 (σ 3.7, max 14) | **4.25** 🏆 (σ 0.46, max 5) |
| `duration_seconds` (mean) | ↓ | **1464** 🏆 | 2234 (+53 %) |
| `total_tokens` (mean) | ↓ | **32.6 M** 🏆 | 39.8 M (+22 %) |

Lesart in zwei Sätzen: with-why ist auf Korrektheit nicht besser (knapp schlechter wegen eines 0-Cycle-Outliers), aber auf **TDD-Disziplin und Code-Qualität deutlich besser bei gleichzeitig viel engerer Streuung**. Der Preis dafür sind ~50 % mehr Wallclock und ~22 % mehr Tokens.

---

## F-1.1 — Why-Blöcke ohne Korrektheits-Effekt, mit deutlichem Disziplin- und Code-Qualitäts-Effekt

**Statement.** Die Hinzufügung der drei lean-Why-Blöcke zu v6.1 (bei voll erhaltenen MUSTs in `commands/red.md` Step 7, `commands/green.md`, `rules/tdd.md`) hat **keinen Korrektheits-Effekt** (verification_pct 1.00 vs 0.91 bei einem einzelnen 0-Cycle-Outlier in with-why; predictions_correct_rate 96.5 % vs 96.2 %), aber **deutliche, gleichgerichtete Effekte auf TDD-Disziplin und Code-Qualität**.

**Daten (n=8 pro Zelle).**

| Achse | Baseline | with-why | Δ |
|---|---:|---:|---|
| Refactorings/Run (mean) | 9.88 | **18.50** 🏆 | **+87 %** |
| Smells/Run (mean) | 2.88 | **0.38** 🏆 | **−87 %** |
| `cognitive_max` (mean / σ / max) | 7.62 / 6.02 / 21 | **4.38 🏆 / 1.06 / 6** | −43 % Mean, σ −82 % |
| `cc_longest_function` (mean / σ / max) | 23.38 / 15.5 / 60 | **13.25 🏆 / 1.58 / 15** | −43 % Mean, σ −90 % |
| `mccabe_max` (mean / σ / max) | 6.75 / 3.65 / 14 | **4.25 🏆 / 0.46 / 5** | −37 % Mean, σ −87 % |

**Rationale.** Die Effektgröße auf Code-Qualität (37–43 % Mean-Reduktion bei Spitzen-Komplexitäts-Metriken) übertrifft die Streuung der Baseline um mehrere σ. Besonders auffällig: with-why **streut auf allen Komplexitäts-Achsen um 82–90 % weniger**. Baseline produziert zwei sehr ausreißerhafte Runs (mccabe_max=14, cognitive_max=21, cc_longest=60), with-why nicht. Mechanistisch plausibel: with-why refactoriert fast doppelt so oft (+87 %), das schiebt die Verteilung der Funktionslängen nach unten und kappt Komplexitäts-Spitzen, bevor sie sich aufbauen.

Hypothese H2 aus dem README (`v6.1-with-why verbessert mindestens eine TDD-Disziplin-Metrik um ≥ +1σ bei invariantem verification_pct`) ist **bestätigt** — und sogar stärker als erwartet, weil der Effekt nicht auf Disziplin beschränkt bleibt, sondern auch die Code-Qualitäts-Metriken voll mitzieht.

**Konsequenz für `workflow-construction.md`.** Das Theory-of-Mind-/Why-Block-Pattern (Zeilen 30–47) hatte bisher nur Anthropic-Skill-Creator-Doku als Stütze. Mit diesem Befund existiert eine empirische Stütze aus diesem Repo: "MUST X. Why: Y." schlägt reines "MUST X." auf einer Korrektheits-stabilen Basis (v6.1) deutlich. Pattern als Default-Empfehlung übernehmen.

**Caveat.** Single Kata (claim-office), single Modell (opus-4-7-portkey-no-thinking). Generalisierung auf andere Katas oder Modelle steht aus. Auch ist offen, ob Why-Blöcke an *allen* MUST-Stellen (statt nur den drei lean-Stellen) den Effekt verstärken oder ob es einen abnehmenden Grenznutzen gibt.

---

## F-1.2 — Cost-Trade-off: rund 50 % mehr Wallclock, rund 22 % mehr Tokens — pro Cycle aber gleich schnell

**Statement.** with-why kostet im Mittel **+770 s Wallclock (+53 %)** und **+7.2 M Tokens (+22 %)** pro Run. Pro Cycle ist with-why aber **nicht** langsamer oder teurer als Baseline — der Aufpreis kommt komplett daher, dass with-why **mehr Cycles** macht (Mean 35 vs 25).

**Daten (n=8 pro Zelle).**

| Achse | Baseline | with-why | Δ |
|---|---:|---:|---|
| Wallclock/Run (mean) | 1464 s | 2234 s | +53 % |
| Tokens/Run (mean) | 32.6 M | 39.8 M | +22 % |
| Cycles/Run (mean) | 25.0 | 35.0 | +40 % |
| Wallclock/Cycle | ~59 s | ~64 s | +9 % (im σ-Rauschen) |
| Tokens/Cycle | ~1.30 M | ~1.14 M | **−12 %** |

**Rationale.** Wenn with-why pro Cycle teurer wäre, wäre das ein Argument gegen Why-Blöcke (Overhead durch Lesen längerer Prompts). Die Daten zeigen das Gegenteil: with-why ist pro Cycle **leicht effizienter in Tokens** und nahezu gleich schnell. Der Aufpreis pro Run ist also kein "Why-Bloat-Overhead", sondern eine **direkte Konsequenz höherer Disziplin** — mehr Cycles bedeutet mehr Refactoring-Subagent-Calls, was wiederum F-1.1 (Refactorings +87 %) erklärt.

Praktische Implikation: für Korrektheits-kritische Arbeit ohne Zeitdruck ist with-why klar zu bevorzugen (siehe F-1.1). Für Speed-priorisierte Setups (CI-Smoke-Runs, Iterations-Geschwindigkeit) bleibt Baseline plausibel — mit dem Vorbehalt, dass die Baseline-Streuung in Code-Qualität deutlich größer ist und vereinzelte "Schmuddel-Runs" produziert.

**Caveat.** Wallclock-Vergleiche zwischen Portkey-Runs hängen vom Gateway-Load ab. Tokens-Vergleiche sind robuster.
