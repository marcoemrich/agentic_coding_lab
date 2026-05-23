---
id: RQ-audit
question: "Trägt das claude_orchestration-Audit-Bundle (Mechanism-Alignment, Rationale-Ergänzungen, Short-Circuit-Hardening) messbar zur Code-Qualität oder TDD-Disziplin gegenüber v6.5-lean bei?"
factors:
  workflow_x_prompt:
    - {workflow: v6.5-lean,                    prompt: example-mapping}
    - {workflow: v6.5.1-orchestration-audited, prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life
outcomes:
  # primär: Code-Qualität
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD-Disziplin
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
min_replicates: 10
status: aktiv
---

# RQ-audit: v6.5.1-orchestration-audited — Trägt das externe Audit-Bundle?

v6.5-lean ist seit RQ-lean unser Code-Quality-Champion. Eine externe Audit-Runde gegen das `chdalski/claude_orchestration`-Toolkit (siehe `experiments/workflows/v6.5.1-orchestration-audited/AUDIT.md` und `CHANGES.md`) hat ein Bundle nicht-verhaltensorientierter Änderungen produziert. Diese RQ misst, ob das Bundle empirisch trägt — als isolierter Vergleich `v6.5-lean` vs `v6.5.1-orchestration-audited` unter sonst identischen Bedingungen.

## Motivation

Das Audit fand keinen funktionalen Bug in v6.5-lean (unsere Pipeline liest TDD-Metriken aus `transcript-metrics.json`, daher trägt die `commands/` vs `skills/` Mechanik nicht — siehe Caveats). Was es fand, sind vier Klassen von Änderungen:

1. **Mechanism-Alignment**: `commands/` → `.claude/skills/<name>/SKILL.md` mit korrekter Frontmatter. In *unserer* Pipeline kein Bruch (Transcript-Parser zählt Skill-tool-uses unabhängig vom Ort), in einer aus Toolkit-Sicht „sauberen" Installation wäre das aber die einzig Skill-tool-konforme Form. Konsistenz-Effekt unklar.
2. **Rationale-Ergänzungen**: Warum verbatim `(Correct|Incorrect)`-Format (Marker-Compliance), warum ≥1 Refactoring (Measurement-Pipeline), warum bisectability, warum simple → complex (Green-Generalization). Hypothese: das Modell folgt Regeln zuverlässiger, wenn der Grund mitläuft.
3. **Short-Circuit-Hardening (Red-Phase)**: "Wrong Predictions Are Data" ersetzt "STOP and explain discrepancy". Mandatory-Procedure-Preamble fordert alle sieben Schritte ein. Ziel: keine Skip-Schleife bei abweichender Prediction, kein retroaktives Umschreiben.
4. **Agent-Decoupling**: `refactor.md` als reine Rollen-/Capability-Definition, TDD-Sequenz nur in `tdd.md`. Hypothese: reduziert Doppel-Steuerung und sorgt für klarere Übergabe.

Die explizit **nicht** durchgeführten Änderungen (keine Skill-Migration des Refactor-Agents, keine neuen Files, keine Hook-Mechanik, keine Removal der DO/DON'T-Bullets) sind in CHANGES.md dokumentiert und für spätere isolierte Sub-RQs reserviert.

## Workflow-Definition

- **v6.5-lean (Baseline, n=10 aus RQ-lean-Pool)**: aktueller Quality-Champion.
- **v6.5.1-orchestration-audited (neu, n=10)**: Bundle der Audit-Änderungen, keine Verhaltensänderungen intendiert.

## Hypothesen

- **H1 (Code-Qualität ≥ Baseline)**: code_mass, smell_total, cc_longest_function, cognitive_max, mccabe_max liegen je innerhalb ±1 σ der v6.5-lean-Streuung. Audit-Bundle darf nicht verschlechtern.
- **H2 (Disziplin stabil oder besser)**: cycle_count und refactorings_applied bleiben in v6.5-lean-Bändern. predictions_correct_rate kann sinken — durch "Wrong Predictions Are Data" sind ehrliche Fehl-Predictions explizit zugelassen, retroaktives Backfilling untersagt. tests_passed_immediately bleibt stabil oder sinkt (Mandatory-Procedure-Preamble verhindert Skip bei vorzeitiger Passing-Erkennung).
- **H3 (Tokens neutral)**: Audit-Bundle ergänzt Rationales (Why-Blocks), entfernt aber auch Pipeline-Coupling aus refactor.md und Duplikat-Permissions aus settings.json. Erwartung: ±5 % vs v6.5-lean.
- **H4 (Korrektheit)**: 100 % tests_passing und 100 % verification_pct (Sanity).
- **H5 (Rationale trägt, falls Disziplin steigt)**: wenn refactorings_applied oder cycle_count signifikant über v6.5-lean liegen, trägt die Why-Begründung. Wenn neutral, ist das Bundle kosmetisch (aber nicht schädlich).

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen, beide example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows × 1 Kata)
Replikate: n = 10 je Zelle
Runs:      20 total (10 v6.5-lean aus RQ-lean-Pool + 10 neue v6.5.1-orchestration-audited)
```

## Caveats

- **commands/ vs skills/ Frage offen für Marker-Compliance**: Unsere Pipeline parst Skill-tool-uses unabhängig vom Source-Pfad — `transcript-metrics.json` aller RQ-lean-Runs zeigt funktionsfähige `cycle_count`, `refactorings_applied`, `predictions_correct_rate`. AUDIT.md argumentiert mit Skill-Tool-Konformität (das Tool *findet* commands/-Skills generell nicht). Falls v6.5.1 trotzdem Mehreffekte zeigt, läge das an Rationale/Hardening/Decoupling, nicht an der Ordnerstruktur.
- **Bundle, nicht isolierte Effekte**: Vier Änderungsklassen gleichzeitig. Bei positivem Bundle-Befund bleibt offen, welche Klasse trägt. Folge-RQs (Rationale-only, Hardening-only) sind denkbar.
- **Single Kata, single Modell**: opus-4-7-no-thinking auf game-of-life. Cross-Model (sonnet, haiku) und Cross-Kata (mars-rover) als Folge-RQs, falls v6.5.1 promotet wird.
- **n=10**: vergleichbar zu RQ-lean; ausreichend für Mittelwert-Signal, knapp für σ-Stabilität.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.5-lean, v6.5.1-orchestration-audited}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.

## Quellen

- Externes Audit-Framework: https://github.com/chdalski/claude_orchestration
- Audit-Detail: `experiments/workflows/v6.5.1-orchestration-audited/AUDIT.md`
- Change-Log: `experiments/workflows/v6.5.1-orchestration-audited/CHANGES.md`
