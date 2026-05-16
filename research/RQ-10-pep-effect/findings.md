# RQ-10 — Findings: Psychologische Begründungen in Red/Green-Skills

## Übersicht

Vergleich v6-hybrid (mit Pep-Talks, n=10) vs v6.3-no-pep (ohne Pep-Talks, n=5) auf game-of-life-example-mapping, opus-4-7-no-thinking. **Mixed-Result: Code-Qualität praktisch unverändert, aber `predictions_correct_rate` fällt um 6.9 Prozentpunkte — Pep-Talks scheinen die Prediction-Disziplin zu stabilisieren.**

| Metrik | v6 (mit Pep) μ±σ | v6.3 (ohne Pep) μ±σ | Δ | v6 σ-Schwelle | über Schwelle? |
|---|---:|---:|---:|---:|:---:|
| Code-Mass (APP) | 158.6 ± 15.14 | 149.8 ± 21.46 | −8.8 | 15.14 | nein (v6.3 leicht besser) |
| Smell-Summe | 2.2 ± 0.42 | 2.0 ± 0 | −0.2 | 0.42 | nein (v6.3 leicht besser, perfekt enges Band) |
| Spitzen-Komplexität (`cc_longest_function`) | 13.1 ± 5.97 | 15.4 ± 3.97 | +2.3 | 5.97 | nein |
| `cognitive_max` | 5.2 ± 2.30 | 6.2 ± 2.77 | +1.0 | 2.30 | nein |
| `mccabe_max` | 4.5 ± 1.51 | 5.2 ± 1.30 | +0.7 | 1.51 | nein |

Keine Code-Qualitäts-Metrik überschreitet ±1σ-Schwelle. Richtung gemischt: 2 leicht besser (code_mass, smell), 3 leicht schlechter (Komplexitäts-Peaks).

---

## F-10.1 — Pep-Talks haben keinen messbaren Effekt auf Code-Qualität

**Aussage:** Auf keiner der fünf primären Code-Qualitäts-Metriken überschreitet die Median-Differenz zwischen v6 und v6.3 eine Standardabweichung der v6-Streuung. Die Richtung ist gemischt (2 von 5 leicht zu v6.3, 3 von 5 leicht zu v6). Im Daten-Niveau dieser RQ kein Effekt nachweisbar.

**Hypothesen-Auswertung:**
- H1 (Pep-Talks wirkungslos auf Code-Qualität) — **bestätigt für Code-Qualitäts-Outcomes** (gleiche Caveats wie F-9.1: Null-Befund mit n=5).
- H2 (Pep-Talks helfen messbar in Code-Qualität, ≥ +1σ in mindestens zwei Metriken) — **nicht erfüllt** für Code-Qualität.

**Mechanismus-Hypothese:** Die entfernten Pep-Bestandteile ("Trust the process", "Simple steps compound into elegant solutions", "Hardcoded values feel wrong → They're exactly right") zielen auf Modell-Selbstdisziplin in der **Green-Phase**, nicht auf das Code-Qualitäts-Outcome direkt. Code-Qualität entsteht primär im Refactor-Subagent (vgl. RQ-8 F-8.1) — der bleibt in v6.3 vollständig unverändert. Dass Pep-Talks in Red/Green keine Code-Komplexitäts-Wirkung haben, ist mechanistisch plausibel.

---

## F-10.2 — Aber: `predictions_correct_rate` fällt um 6.9 Prozentpunkte (99.4 % → 92.5 %)

**Aussage:** Der einzige TDD-Disziplin-Indikator mit deutlichem Effekt ist die Prediction-Compliance in der Red-Phase:

| Outcome | v6 (mit Pep) | v6.3 (ohne Pep) | Δ |
|---|---:|---:|---:|
| `predictions_correct_rate` (pooled) | **99.4 %** (169/170) | **92.5 %** (74/80) | **−6.9 pp** |
| `cycle_count` μ±σ | 8.3 ± 0.82 | 8.0 ± 0.71 | praktisch identisch |
| `refactorings_applied` μ±σ | 4.0 ± 1.63 | 4.2 ± 2.28 | praktisch identisch |
| `tests_passed_immediately` μ±σ | 3.3 ± 3.02 | 2.2 ± 3.03 | leicht weniger |

In absoluten Zahlen: 6 falsche Predictions bei v6.3 (auf 80 gemessenen) vs 1 bei v6 (auf 170). Die einzige Pep-Reduktion in `red.md` war die Streichung von "Maintain strict discipline" aus Mission-Eintrag #4 und ein Code-Kommentar — überraschend großer Effekt für so eine kleine Änderung.

**Mechanismus-Hypothese:** Das Wort "discipline" in der Red-Phase-Mission scheint das Modell tatsächlich zu strafferer Prediction-Compliance zu führen. Ohne diesen Anker entstehen mehr Predictions, die unprägnant geraten und in der Verifikation als "Incorrect" eingestuft werden. **Plausibel, aber bei n=5 (= 80 Predictions) statistisch grenzwertig** — die wahre Rate könnte zwischen 88 % und 97 % liegen (95%-Konfidenzintervall).

H3 (mehr Over-Implementation in Green-Phase ohne Pep) — **falsifiziert** in dieser RQ: `tests_passed_immediately` ist sogar leicht *niedriger* bei v6.3 (2.2 vs 3.3). Der Disziplin-Effekt aus F-10.2 sitzt in der Red-Phase, nicht in der Green-Phase.

---

## F-10.3 — Keine Token- oder Wallclock-Einsparung — entgegen Hypothese H4

**Aussage:** Die Reduktion der Pep-Bestandteile ist mengenmäßig zu klein, um messbare Einsparungen zu erzeugen:

| Outcome | v6 | v6.3 | Differenz |
|---|---:|---:|---:|
| `total_tokens` μ | 6.62 M | 6.69 M | **+1.0 %** (statistisch null) |
| `duration_seconds` μ | 521 | 559 | **+7.3 %** (innerhalb σ) |

H4 (Pep-Talks kosten ≥ 5 % Tokens/Wallclock) — **falsifiziert**. Die entfernten Bestandteile (~15 Zeilen über zwei Skills) sind in der Gesamt-Token-Last unsichtbar.

**Konsequenz:** Die Token-Argumentation für eine Pep-Reduktion entfällt. Falls Pep-Talks entfernt werden sollen, muss das Argument *qualitativ* sein (z. B. Prompt-Klarheit, Maintenance) — nicht *quantitativ* (Tokens).

---

## F-10.4 — Konsequenz für die Workflow-Optimierung

Im Vergleich der drei Reduktions-RQs:

| RQ | Reduktion | Code-Qualität | Stabilität | Disziplin | Tokens | Verdict |
|---|---|:---:|:---:|:---:|:---:|:---:|
| RQ-8 (F-8.x) | APP raus | ⬇️ alle schlechter | ⬆️ σ verdoppelt | ➡️ | −8 % | APP bleibt |
| RQ-9 (F-9.x) | Four Rules raus | ➡️ unverändert | ➡️ unverändert | ➡️ | −8.5 % | **Four Rules können raus** |
| RQ-10 (F-10.x) | Pep-Talks raus | ➡️ unverändert | gemischt | ⚠️ pred-rate −7 pp | ±0 % | **Mixed — vor Entscheidung mehr Daten** |

v6.3-no-pep ist **kein eindeutiger Reduktions-Erfolg** wie v6.2 — der Pred-Rate-Abfall ist ein konkretes Warnsignal, das bei n=5 zu wenig Daten hat für eine endgültige Bewertung. Bevor Pep-Talks in einen konsolidierten v6.4-Reduktions-Bundle aufgenommen werden, sollte:

1. **n auf 10 v6.3-Runs erhöht** werden, um die Pred-Rate-Differenz statistisch zu verifizieren (95%-KI bei n=10 mit ~170 Predictions wäre deutlich enger).
2. **Pep-Subkomponenten differenziert getestet** werden — die Hypothese ist, dass "strict discipline" in red.md mehr Wirkung hat als die "Psychological Resistance"-Sektion in green.md (weil red.md die Predictions enthält, die im Outcome-Signal sichtbar werden).

## Caveats

- **n=5 v6.3, n=80 Predictions**: die 6.9-pp-Differenz hat ein breites Konfidenzintervall. Bei n=10 wäre die Aussage robuster.
- **Asymmetrische Pep-Reduktion**: green.md hat den größeren Pep-Block (12-zeilige Psychological-Resistance-Sektion), red.md nur kleine Edits. Das Hauptsignal (pred-rate) sitzt aber in red.md — ein Hinweis, dass die scheinbar kleine "strict discipline"-Streichung mehr Effekt hat als die scheinbar große Resistance-Sektion-Streichung.
- **Single Kata, single Modell**: identische Limitierungen wie RQ-8/RQ-9.
- **Mixed-Result-Interpretation**: das Daten-Muster lässt zwei Lesarten zu: (a) "Pep-Talks wirken subtil über Disziplin, nicht über Qualität" — bestätigt MARKERS-Klassifikation nur teilweise; (b) "Daten-Rauschen bei n=5, kein echter Effekt" — bestätigt MARKERS voll. Folgestudie nötig.
