---
id: RQ-10
question: "Liefern psychologische Begruendungen ('pep talks') in den Red- und Green-Skill-Prompts einen messbaren Code-Qualitaets- oder TDD-Disziplin-Vorteil ueber rein operationale Anweisungen?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,   prompt: example-mapping}
    - {workflow: v6.3-no-pep, prompt: example-mapping}
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

# RQ-10: Psychologische Begruendungen in Red/Green-Skills — notwendig oder Ballast?

Liefern die motivierenden bzw. begruendenden Anteile der **Red- und Green-Skill-Prompts** einen messbaren Code-Qualitaets- oder TDD-Disziplin-Vorteil — oder reichen die nuechternen operationalen Anweisungen allein?

## Motivation

Die Reduktions-Serie (RQ-8: APP, RQ-9: Four Rules) zielt darauf ab, einzelne Prompt-Bausteine im v6-hybrid-Workflow auf ihre Wirkung zu pruefen. Bisher betraf das den **Refactor-Subagent**. RQ-10 wendet das Pattern auf die **Skill-Commands fuer Red und Green** an, die im Main-Context laufen.

Die `MARKERS.md` des Repos klassifiziert "Psychological Resistance"-Sektionen, "Trust the process"-Pep-Talks und aehnliche motivierende Bloecke als **decorative content (safe to drop)**. Diese Klassifikation ist aber bisher nicht empirisch validiert — RQ-10 holt das nach.

Konkret: in `commands/green.md` steckt eine 12-zeilige "Psychological Resistance"-Sektion ("You will feel resistance: 'This is too simple' → That's correct! Minimal is the way ... Trust the process. Simple steps compound into elegant solutions.") plus zahlreiche motivierende Inline-Kommentare in den Beispiel-Code-Bloecken. In `commands/red.md` ist die psychologische Last gering — nur "Maintain strict discipline" und ein "// Intentionally wrong"-Kommentar.

## Workflow-Definition

- **v6-hybrid (Kontrolle, n=10 aus RQ-5-Pool)**: Red- und Green-Skills mit vollem Prompt inkl. psychologischer Begruendungen, Pep-Talks, motivierender Inline-Kommentare und der "Psychological Resistance"-Sektion.
- **v6.3-no-pep (neu, n=5)**: identisch zu v6, einzige Aenderungen in `commands/red.md` und `commands/green.md`:
  - **green.md**: Komplette "Psychological Resistance"-Sektion entfernt (12 Zeilen mit "Trust the process", "Simple steps compound into elegant solutions"). Motivierende Inline-Kommentare in Code-Beispielen entfernt ("// Minimal - just make the test pass", "// Perfect - minimal", "// Still simple", "// NOW generalize"). Reassurance-Wortwahl ersetzt: "Baby steps" → "Smallest change", "Simple is better: Hardcoded returns are perfectly fine" → "Hardcoded returns are allowed", "Take baby steps" → "Take small steps", "Approach: [explain why this is minimal]" Zeile gestrichen. Section-Headings ("Preferred for Early Tests", "When Multiple Tests", "Only When Forced") entschlackt.
  - **red.md**: Mission-Eintrag "Maintain strict discipline -" gestrichen, Code-Kommentar "// Intentionally wrong" entfernt.
- **Was bleibt unveraendert**: alle operationalen Process-Steps, Code-Beispiele (ohne Reassurance-Kommentare), DO/DON'T-Listen, Prediction-Format inkl. Step-7-Verbatim-Anweisung in red.md, Refactor-Subagent (mit APP + Four Rules + Naming-Eval), test-list.md, alle Rules-Files.

## Hypothesen

- **H1 (Pep-Talks wirkungslos)**: v6.3 produziert auf den primaeren Code-Qualitaets-Metriken statistisch ununterscheidbare Werte zu v6 (Median-Differenz innerhalb ±1 σ der v6-Streuung).
  Konsequenz bei H1: psychologische Begruendungen in Red/Green sind Prompt-Ballast. v6.3 koennte mit RQ-9 (v6.2) zu einem dual-reduzierten v6.4 (no-pep + no-rules) kombiniert werden.
- **H2 (Pep-Talks helfen messbar)**: v6.3 verschlechtert sich auf mindestens zwei der fuenf primaeren Metriken um ≥ +1 σ mit konsistenter Richtung.
  Konsequenz bei H2: "Trust the process"-Wortwahl traegt — entgegen der MARKERS-Klassifikation. Bleibt im Workflow.
- **H3 (Spezifischer Disziplin-Effekt)**: Da die Psychological-Resistance-Sektion explizit gegen Over-Implementation argumentiert ("'I should implement ahead' → Resist this strongly"), ist `tests_passed_immediately` der sensitivste Indikator. Erwartung bei H2-Variante: v6.3 hat hoeheren `tests_passed_immediately`-Mittelwert (mehr Over-Implementation in Green-Phase ohne psychologischen Anker).
- **H4 (Pep-Talks kosten)**: v6.3 spart Tokens und/oder Wallclock messbar (≥ 5%) durch den schlankeren Prompt. Wahrscheinlich klein, weil die entfernten Bloecke nur einen kleinen Teil der Gesamt-Token-Last ausmachen.

**A-priori Erwartung:** Die `MARKERS.md`-Klassifikation als decorative content + die Erkenntnisse aus RQ-9 (Four Rules wirkungslos) sprechen fuer H1. RQ-8 (APP wirkt) hat aber gezeigt, dass ein Null-Effekt nicht der Default sein darf — das Daten-Muster muss gepruet werden.

**Falsifikation H1:** v6.3 deutlich schlechter als v6, insbesondere wenn `tests_passed_immediately` steigt (H3-Mechanismus). Konsequenz: Pep-Talks haben tatsaechlich Disziplin-Effekt, MARKERS-Klassifikation muss korrigiert werden.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6-hybrid, v6.3-no-pep), beide mit example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5
Runs:      15 total
           — 10 v6-Runs wiederverwendet aus RQ-5 (n=10 game-of-life-example-mapping)
           — 5 neue v6.3-no-pep Runs
```

## Caveats

- **Single Kata, single Modell, n=5**: identische Limitierungen wie RQ-8/RQ-9. Erweiterung auf claim-office und n=10 nach Bedarf.
- **Asymmetrische Reduktion**: in green.md ist deutlich mehr psychologischer Inhalt als in red.md (Psychological Resistance Section, 12 Zeilen + motivierende Kommentare). Ein Effekt, falls vorhanden, kommt vermutlich primaer aus green.md.
- **Mechanismus-Trennung schwierig**: ein H2-Effekt liesse offen, *welcher* Pep-Talk-Bestandteil die Wirkung traegt — die Psychological-Resistance-Sektion, die Bold-Hervorhebungen, die Inline-Kommentare oder die Reassurance-Wortwahl. Eine differenzierte Analyse waere eine Folge-RQ.
- **Kontext zur Reduktions-Serie**: dies ist die **dritte** Reduktions-RQ in Serie (nach RQ-8 APP, RQ-9 Four Rules). Falls H1 bestaetigt, koennte ein konsolidiertes v6.4 (Four Rules raus + Pep-Talks raus) als naechster Reduktions-Schritt geprueft werden.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6-hybrid, v6.3-no-pep}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
