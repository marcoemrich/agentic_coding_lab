---
id: RQ-bullets
question: "Sind die drei redundanten Bullet-Listen in v6.5.1-orchestration-audited dekorativ (Cut spart Tokens, Disziplin/Quali halten) oder Pattern-Match-Anker (Cut schadet)?"
factors:
  workflow_x_prompt:
    - {workflow: v6.5.1-orchestration-audited, prompt: example-mapping}
    - {workflow: v6.5.2-bullets-cut,           prompt: example-mapping}
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

# RQ-bullets: v6.5.2-bullets-cut — Sind redundante Bullet-Listen Anker oder Dekoration?

Das `claude_orchestration`-Audit hat in v6.5.1 drei Bullet-Listen als verbatim-Duplikate bereits vorhandener Sections markiert (`AUDIT.md` Finding 10). v6.5.2-bullets-cut entfernt diese drei Blöcke — netto −38 Zeilen über zwei Files. Frage: trägt das gestrichene Material, oder ist es Wiederholungs-Dekoration?

## Motivation

Behavior-preserving-cuts-Regel: wenn Inhalt anderswo im File schon steht, ist die Wiederholung kosmetisch. Im RQ-rules wurde das für die "Four Rules of Simple Design" empirisch bestätigt (−8.5 % Tokens, keine Quali-Regression). Hier dieselbe Logik auf eine kleinere Skala:

- **`refactor.md` „Remember"-Section** (−8 Z.): Bullets wiederholen Mission und Important Guidelines.
- **`refactor.md` „Important Guidelines" DO/DON'T** (−16 Z.): jeder DO-Bullet entspricht einem Mission-Punkt oder einer Process-Step; jeder DON'T-Bullet invertiert eine Refactoring-Rule.
- **`red/SKILL.md` „Important Guidelines" DO/DON'T** (−14 Z.): DOs duplizieren Red Phase Rules, DONTs sind durch Mandatory-Procedure-Preamble + "Wrong Predictions Are Data" abgedeckt.

Netto: `refactor.md` 270 → 245, `red/SKILL.md` 173 → 159.

Die zweite Hypothese (Bullets sind Pattern-Match-Anker) wäre die Gegenposition: das Modell verarbeitet Listen anders als Fließtext-Sections, redundante Listen verstärken den Effekt. Wenn das stimmt, müssten Disziplin-Metriken regredieren — insbesondere `tests_passed_immediately` (Mandatory-Procedure-Schutz) und `refactorings_applied` (Pflicht-Floor).

## Workflow-Definition

- **v6.5.1-orchestration-audited (Baseline, n=10 aus RQ-audit-Pool)**: aktueller Disziplin-Champion mit Bullets.
- **v6.5.2-bullets-cut (neu, n=10)**: identisch bis auf die drei gestrichenen Bullet-Blöcke.

## Hypothesen

- **H1 (TDD-Disziplin hält)**: `refactorings_applied`, `tests_passed_immediately`, `cycle_count`, `predictions_correct_rate` liegen innerhalb 1 σ der v6.5.1-Werte (7.8 ± 0.42 / 0 ± 0 / 7.8 ± 0.42 / 98.9 %). σ darf nicht steigen.
- **H2 (Code-Qualität hält)**: `code_mass`, `smell_total`, `cc_longest_function`, `cognitive_max`, `mccabe_max` innerhalb 1 σ der v6.5.1-Werte.
- **H3 (Tokens sinken)**: −38 Zeilen Workflow-Files bedeuten weniger Working-Memory-Inhalt. Erwartung: −1 bis −5 % `total_tokens`. Falls Effekt nicht messbar, war der Cut neutral aber ungefährlich.
- **H4 (Streuung stabil)**: σ in keiner Outcome-Metrik um Faktor >1.5 höher als bei v6.5.1.
- **H5 (Korrektheit)**: 100 % tests_passing und 100 % verification_pct.
- **H6 (Falsifikations-Kriterium)**: wenn H1 oder H2 regrediert (Mittelwert verschiebt sich um >1 σ in ungünstige Richtung *oder* σ verdoppelt sich), fungieren Bullets als Pattern-Match-Anker — Cut war schädlich, v6.5.2 wird *nicht* promotet.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen, beide example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows × 1 Kata)
Replikate: n = 10 je Zelle
Runs:      20 total (10 v6.5.1 aus RQ-audit-Pool + 10 neue v6.5.2-bullets-cut)
```

## Caveats

- **Single Kata, single Modell**: opus-4-7-no-thinking auf game-of-life. Cross-Model und Cross-Kata sind Folge-RQs, falls v6.5.2 promotet wird.
- **Reine Reduktion, keine Verhaltensänderung intendiert**: anders als RQ-audit (Rationale + Hardening hinzufügt) ist RQ-bullets nur Streichung. Vergleichbar zu RQ-rules (Four Rules raus) auf kleinerer Skala.
- **Token-Effekt klein erwartet**: −38 Zeilen über zwei Files ≈ <1 % der Working-Memory-Last. H3 prüft, ob der Effekt überhaupt messbar wird.
- **n=10**: ausreichend für Mittelwert-Signal; σ-Vergleich zu v6.5.1 wegen der dort sehr engen Bänder (σ=0 bei tests_passed_immediately, σ=0.42 bei refactorings_applied) sensitiv für jede Streuungs-Zunahme.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.5.1-orchestration-audited, v6.5.2-bullets-cut}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.

## Quellen

- Externes Audit-Framework: https://github.com/chdalski/claude_orchestration
- Audit-Detail: `experiments/workflows/v6.5.2-bullets-cut/AUDIT.md`
- Change-Log: `experiments/workflows/v6.5.2-bullets-cut/CHANGES.md`
- Vorgänger-RQ: `research/workflow-dev/3.1-orchestration-audit/`
