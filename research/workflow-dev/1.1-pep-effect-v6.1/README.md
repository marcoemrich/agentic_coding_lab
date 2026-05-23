---
id: RQ-pep-v6.1
question: "Liefern psychologische Begruendungen ('pep talks') in den Red- und Green-Skill-Prompts auf v6.1-Basis einen messbaren Code-Qualitaets- oder TDD-Disziplin-Vorteil ueber rein operationale Anweisungen?"
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}
    - {workflow: v6.1-no-pep,                    prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
outcomes:
  # primaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD-Disziplin (besonders relevant fuer Green-Phase-Reduktion)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Kosten
  - duration_seconds
  - total_tokens
  # Korrektheit (Sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-pep-v6.1: Pep-Talk-Effekt auf v6.1-Basis (Re-Run)

Liefern die motivierenden bzw. begruendenden Anteile der **Red- und Green-Skill-Prompts** einen messbaren Code-Qualitaets- oder TDD-Disziplin-Vorteil — oder reichen die nuechternen operationalen Anweisungen allein? Wiederholung der archivierten RQ-pep auf der neuen, korrekturgefixten v6.1-Basis.

## Motivation

Die alte RQ-pep (`_archive/workflow-dev-v1/2.3-pep-effect/`) baute auf der v6-hybrid-Linie, die spaeter als korrektheits-defekt identifiziert wurde (Bruch v6-hybrid → v6.5-lean). Die neue Basis `v6.1-hybrid-testlist-scope-fix` korrigiert den Test-List-Scope-Bug und ist seit dem v6-Rebuild der valide Ausgangspunkt fuer Reduktions-Experimente. Befunde aus der alten Linie sind potenziell durch den Bug konfundiert — daher Wiederholung.

Die `MARKERS.md` klassifiziert "Psychological Resistance"-Sektionen und "Trust the process"-Pep-Talks weiterhin als **decorative content (safe to drop)**. RQ-pep-v6.1 prueft diese Klassifikation gegen v6.1.

Konkret: in `commands/green.md` steckt eine 12-zeilige "Psychological Resistance"-Sektion plus motivierende Inline-Kommentare in den Code-Bloecken. In `commands/red.md` ist die psychologische Last gering — "Maintain strict discipline" und ein "// Intentionally wrong"-Kommentar.

## Workflow-Definition

- **v6.1-hybrid-testlist-scope-fix (Kontrolle, n=5)**: Red- und Green-Skills mit vollem Prompt inkl. psychologischer Begruendungen, Pep-Talks, motivierender Inline-Kommentare und der "Psychological Resistance"-Sektion. Identisch zu v6-hybrid auf Red/Green-Skill-Ebene; nur `test-list.md` differiert (Spec-Coverage-Fix).
- **v6.1-no-pep (neu, n=5)**: identisch zu v6.1-hybrid-testlist-scope-fix, einzige Aenderungen in `commands/red.md` und `commands/green.md` (1:1 uebernommen aus dem archivierten v6.3-no-pep, da v6-Red/Green und v6.1-Red/Green byte-identisch sind):
  - **green.md**: Komplette "Psychological Resistance"-Sektion entfernt (12 Zeilen). Motivierende Inline-Kommentare in Code-Beispielen entfernt ("// Minimal - just make the test pass", "// Perfect - minimal", "// Still simple", "// NOW generalize"). Reassurance-Wortwahl ersetzt: "Baby steps" → "Smallest change", "Simple is better: Hardcoded returns are perfectly fine" → "Hardcoded returns are allowed", "Take baby steps" → "Take small steps", "Approach: [explain why this is minimal]"-Zeile gestrichen. Section-Headings entschlackt.
  - **red.md**: Mission-Eintrag "Maintain strict discipline -" gestrichen, Code-Kommentar "// Intentionally wrong" entfernt.
- **Was bleibt unveraendert**: alle operationalen Process-Steps, Code-Beispiele (ohne Reassurance-Kommentare), DO/DON'T-Listen, Prediction-Format inkl. Step-7-Verbatim-Anweisung in red.md, Refactor-Subagent (mit APP + Four Rules + Naming-Eval), `test-list.md` (mit Scope-Fix), alle Rules-Files.

## Hypothesen

- **H1 (Pep-Talks wirkungslos)**: v6.1-no-pep produziert auf den primaeren Code-Qualitaets-Metriken statistisch ununterscheidbare Werte zu v6.1-hybrid (Median-Differenz innerhalb ±1 σ der v6.1-Streuung).
  Konsequenz bei H1: psychologische Begruendungen in Red/Green sind Prompt-Ballast — Klassifikation bestaetigt, no-pep kann mit weiteren Reduktionen kombiniert werden.
- **H2 (Pep-Talks helfen messbar)**: v6.1-no-pep verschlechtert sich auf mindestens zwei der fuenf primaeren Metriken um ≥ +1 σ mit konsistenter Richtung.
  Konsequenz bei H2: "Trust the process"-Wortwahl traegt — MARKERS-Klassifikation muss korrigiert werden.
- **H3 (Spezifischer Disziplin-Effekt)**: Da die Psychological-Resistance-Sektion explizit gegen Over-Implementation argumentiert, ist `tests_passed_immediately` der sensitivste Indikator. Erwartung bei H2-Variante: v6.1-no-pep hat hoeheren `tests_passed_immediately`-Mittelwert.
- **H4 (Pep-Talks kosten)**: v6.1-no-pep spart Tokens und/oder Wallclock messbar (≥ 5%). Wahrscheinlich klein, weil die entfernten Bloecke nur einen Bruchteil der Gesamt-Token-Last ausmachen.
- **H5 (Replikation)**: Das Ergebnis-Muster matched die alte RQ-pep-Linie. Abweichung waere ein Indiz, dass die v6-Linie tatsaechlich durch den Test-List-Scope-Bug konfundiert war.

**A-priori Erwartung:** MARKERS-Klassifikation + Reduktions-Serie (Four Rules wirkungslos) sprechen fuer H1. RQ-app hat aber gezeigt, dass Null-Effekt nicht der Default sein darf — Daten muessen pruefen.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6.1-hybrid-testlist-scope-fix, v6.1-no-pep), beide mit example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5
Runs:      10 total (keine Wiederverwendung — keine v6.1-hybrid-Runs auf direct-API opus-4-7-no-thinking vorhanden)
```

## Caveats

- **Single Kata, single Modell, n=5**: identisch zur archivierten RQ-pep. Erweiterung auf claim-office und groesseres n nach Bedarf.
- **Asymmetrische Reduktion**: in green.md ist deutlich mehr psychologischer Inhalt als in red.md. Ein Effekt, falls vorhanden, kommt vermutlich primaer aus green.md.
- **Mechanismus-Trennung schwierig**: ein H2-Effekt liesse offen, *welcher* Pep-Talk-Bestandteil die Wirkung traegt.
- **Direct-API-Modell**: opus-4-7-no-thinking ohne Portkey-Routing — kein single-shard-Zwang noetig fuer 10 Runs, aber pro Memory-Konvention nicht sharden.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1-no-pep}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
