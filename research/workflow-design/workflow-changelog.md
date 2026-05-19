# Workflow-Changelog: TDD Exact-Coding Workflows

Chronologische Entwicklung der Workflow-Optimierung von v4 bis zum
aktuellen Stand. Fokus auf Entscheidungen, Befunde und Verbleib der
Änderungen.

## v4-exact-subagents — Ausgangspunkt

Alle Phasen (red, green, refactor) als isolierte Task-Subagents.
Maximale Kontexttrennung, höchste Token-Kosten. Jeder Subagent
bekommt frischen Context ohne Memory der vorherigen Phase.

**Stärke**: Isolation erzwingt Disziplin, jede Phase arbeitet
unabhängig.
**Schwäche**: Hoher Token-Verbrauch, red→green verliert Test-Listen-
Kohärenz (Subagent kennt die Plan-Entscheidungen der Test-List-Phase
nicht).

## v6-hybrid — Architektur-Optimum (RQ-7)

Pareto-Optimum aus RQ-7: red/green als Skills im Hauptkontext
(geteilter State), nur Refactor als isolierter Subagent.

**Befund**: Beste Smell-Reduktion + perfekte `verification_pct` auf
claim-office (1.00, n=5). Schlägt v4 (0.67, bimodal) und v5 (0.87)
auf Korrektheit und v7 (green+refactor isoliert) auf allen Achsen.

**Lehre**: Isolation hilft dort, wo Frische-Perspektive Wert hat
(Refactor). Sie schadet dort, wo Kontinuität nötig ist (red→green).

## v6.1–v6.4 — Einzel-Cuts (RQ-8 bis RQ-12)

Vier isolierte Reduktionen gegen v6-hybrid, jeweils ein einziger
Cut:

| Variante | Was entfernt wurde | RQ | Effekt GOL | Effekt claim-office |
|---|---|---|---|---|
| v6.1-no-app | APP-Heuristik aus refactor.md | RQ-8 | kein Effekt | 1.00 (n=3, hält) |
| v6.2-no-rules | Four Rules of Simple Design | RQ-9 | kein Effekt | 1.00 (n=3, hält) |
| v6.3-no-pep | Pep-Talks ("Trust the process" etc.) | RQ-10 | kein Effekt | 1.00 (n=3, hält) |
| v6.4-no-emoji | 🔴🟢🔄📋✅❌ Marker | RQ-11/12 | kein Effekt | 0.93 (n=3, marginal) |

**Befund**: Alle vier Cuts sind einzeln **neutral** auf Korrektheit
(claim-office) und Code-Qualität (GOL).

## v6.5-lean — Skill-Creator-Intervention (RQ-13) ⚠️ KORREKTHEITS-REGRESSION

v6.5-lean bündelt alle vier Cuts **plus** strukturelle Rewrites durch
den `skill-creator`-Skill. Ziel: Theory-of-Mind statt MUSTs,
Reduktion vor Addition.

### Was der skill-creator in v6.5-lean geändert hat

**tdd.md — Orchestrierungsregeln (größter Eingriff):**
- "⚠️ CRITICAL: Skill + Subagent Usage is MANDATORY" →
  "Why skills and subagents are required" + Measurement-Pipeline-Begründung
- Checklist entfernt ("Before Starting Any TDD Work — Complete This Checklist")
- Alle "🚨 INVOKE SKILL" / "DO NOT write..." → einfache Invoke-Anweisungen
- "TDD Mindset"-Pep-Sektion entfernt ("feel counterintuitive", "resist this")
- "Common TDD Failure Modes" entfernt
- "Remember"-Sektion entfernt ("🚨 ALWAYS USE SKILLS", "Trust the process")
- Zusammenfassung: von 126 → 58 Zeilen (~54 % Reduktion)

**red.md — Red-Phase-Skill:**
- Emojis entfernt (🔴 ✅ ❌)
- "Maintain strict discipline" → gekürzt
- "MUST verbatim"-Anweisung → Why-Block: Erklärung, warum der Parser
  zwei separate Prediction-Lines braucht und was passiert, wenn sie
  fehlen

**green.md — Green-Phase-Skill:**
- Mission-Liste (5 Imperative) → Why-Minimality-Absatz (3 Begründungen:
  exposes refactoring opportunities, prevents premature generalization,
  keeps cycle short)
- "Baby steps"-Sprache entfernt
- Strategy-Rules kondensiert

**refactor.md — Refactor-Subagent:**
- Four Rules of Simple Design → **komplett entfernt** (30+ Zeilen)
- Stattdessen Naming-Evaluation als "First Refactoring Priority"
- Step 3 von regel-basierter 4-Stufen-Evaluation → konkrete
  Improvement-Beispiele (rename, extract, inline, simplify conditional)
- "Integration with Project Standards" (Hexagonal, DI, Named exports) →
  entfernt
- Beschreibung von "Simple Design Rules + APP" → "APP + Naming only"

### Zusammenfassung: v6-hybrid → v6.5-lean

| Datei | Zeilen v6 | Zeilen v6.5 | Änderungs-Art |
|---|---:|---:|---|
| tdd.md | 126 | 58 | Structural Rewrite (Why-Blocks) |
| red.md | 118 | 99 | Why-Block + Emoji-Cut |
| green.md | 65 | 48 | Why-Minimality + Kondensierung |
| refactor.md | 220 | 190 | Four Rules raus + Refocus auf APP/Naming |
| **Total** | **529** | **395** | **−25 %** |

### Befunde

- **GOL Code-Qualität (RQ-13)**: v6.5-lean leicht besser als v6-hybrid
  auf Code-Qualität, stärkster Disziplin-Boost. Bundle trägt.
- **claim-office Korrektheit (RQ-19)**: **verification_pct 0.38 ± 0.54**
  (vs v6-hybrid 1.00). Bruchstelle lokalisiert zwischen v6.4-no-emoji
  (0.93) und v6.5-lean (0.38) — die vier Einzel-Cuts sind nicht der
  Täter, die **Why-Rewrites** sind Hauptverdächtiger (F-19.3).

### Status: ⚠️ auf novel Code nicht einsetzbar

v6.5-lean und alle Folge-Varianten (v6.5.1–v6.5.4, v6.6) produzieren
auf claim-office systematisch falsche Ergebnisse. Die Quality-Wins
auf GOL sind als Messungen valide, aber der Workflow ist für
Korrektheit auf unbekanntem Code nicht vertrauenswürdig.

## v6.5.1–v6.5.4 — Detail-Audits (RQ-14 bis RQ-17)

Aufbauend auf v6.5-lean, Feintuning der Bullet-Blöcke. Alle erben
die Korrektheits-Regression von v6.5-lean.

| Variante | Änderung vs v6.5 | Quality-Effekt (GOL) | Korrektheit (claim-office) |
|---|---|---|---|
| v6.5.1 | + Rationale-Blocks + Short-Circuit-Hardening | σ refactorings ⅙ | 0.36 (defekt) |
| v6.5.2 | − alle DO/DON'T-Bullets − "Remember" | cognitive_max −29 % | 0.51 (defekt) |
| v6.5.3 | − mid-file DO/DON'T, "Remember" behalten | Quality-Champion | 0.73 (n=1, zu dünn) |
| v6.5.4 | nur refactor.md DO/DON'T weg | 100 % Pred-Rate | 0.40 (defekt) |

**Status**: Quality-Erkenntnisse (welche Bullets tragen, welche
schaden) sind valide. Korrektheits-Befunde: alle defekt, nicht als
Workflow einsetzbar.

## v6.6-leaner — Weitere skill-creator-Empfehlungen (RQ-13)

Zusätzlich zu v6.5-lean:
- DO/DON'T-Listen aus red.md und refactor.md entfernt
- test-list.md: "Why test-list first"-Block + "3-6 tests"-Empfehlung
  statt prozeduraler Schritt-Liste

**Befund (RQ-13)**: DO/DON'T-Hypothese teilweise widerlegt: Pred-Rate
−2.5 pp. Test-List-Hint "3-6 tests" senkt cycle_count −27 %.
Korrektheits-Status: nicht auf claim-office getestet, erbt aber
v6.5-lean-Basis → vermutlich defekt.

## Aktueller Stand

**Empfohlener Workflow für Korrektheit**: `v6-hybrid` (original, ohne
skill-creator-Rewrites). Einziger Workflow mit perfekter verification_pct
auf claim-office (1.00, n=5).

**Empfohlener Workflow für Code-Qualität auf trainingsbekanntem Code**:
`v6.5.4-refactor-cut-only` — Quality-Champion auf GOL, 100 % Pred-Rate.
Aber: auf novel Code nicht korrekt.

**Offene Aufgabe**: v6-hybrid + gezielte Quality-Verbesserungen aus
der v6.5er-Kette, die die Korrektheits-Regression nicht auslösen.
Verdächtiger: die Why-Rewrites in tdd.md/red.md/green.md. Nächster
Schritt: v6.5-no-why (alle vier Cuts, aber originale Formulierungen
beibehalten) × claim-office × n=3 — wartet auf Rate-Limit-Reset.

## Verworfene Ideen

- **v7-hybrid-green-refactor**: green + refactor isoliert → Pareto-dominiert von v6
- **v8a/v8b delayed-refactor**: Oneshot + End-Refactor als TDD-Kontrolle.
  GOL-Befunde (F-18.2 "APP-Agent schadet") stellten sich als
  Trainingsdaten-Artefakt heraus. RQ-18 zurückgesetzt auf
  game-of-life-cli (mit Verification) + v6-hybrid als Baseline.
