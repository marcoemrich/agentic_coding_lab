---
id: RQ-emoji
question: "Haben Emojis in den Workflow-Prompts (Skills + Refactor-Agent + rules/tdd.md) einen messbaren Effekt auf Code-Qualitaet oder TDD-Disziplin?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,     prompt: example-mapping}
    - {workflow: v6.4-no-emoji, prompt: example-mapping}
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
  # TDD-Disziplin (besonders relevant — Predictions sind emoji-markiert)
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

# RQ-emoji: Emojis in Workflow-Prompts — Disziplin- oder Qualitaets-Effekt?

Haben die rund 85 Emojis (✅ 43×, ❌ 26×, 🚨 6×, 🔴/🟢/🔄/📋/⚠️ 9×) in den Skill-Commands und im Refactor-Subagent von v6-hybrid einen messbaren Effekt auf TDD-Disziplin oder Code-Qualitaet — oder sind sie reine Decoration?

## Motivation

Vierte Reduktions-RQ in der v6-Serie. Nach APP (RQ-app traegt), Four Rules (RQ-rules redundant) und Pep-Talks (RQ-pep mixed) ist die naechste isolierte Komponente die Emoji-Dekoration. Hintergrund:

1. **CLAUDE.md des Repos** verbietet explizit Emojis in eigenen Files (`"Only use emojis if the user explicitly requests it"`). Die Workflow-Prompts widersprechen dieser Regel — RQ-emoji prueft, ob das gerechtfertigt ist.
2. **RQ-pep F-pep.2** zeigte einen ueberraschend grossen Effekt der "strict discipline"-Streichung in red.md auf `predictions_correct_rate` (−6.9 pp). Wenn Wortwahl in red.md so messbar wirkt, koennten visuelle Marker wie ✅/❌ in den Prediction-Templates aehnliche Effekte haben.

## Workflow-Definition

- **v6-hybrid (Kontrolle, n=10 aus RQ-stability-Pool)**: vollstaendige Emoji-Dekoration ueber alle 5 Workflow-Files (`red.md`, `green.md`, `test-list.md`, `refactor.md`, `rules/tdd.md`).
- **v6.4-no-emoji (neu, n=5 inkl. Smoke)**: alle Emojis entfernt:
  - ✅/❌ aus DO/DON'T-Listen, Process-Check-Sub-Steps und Output-Templates ersatzlos
  - **Parser-kritisch**: `✅ Correct` / `❌ Incorrect` in den Red-Phase-Prediction-Templates → `- Correct` / `- Incorrect` umgeschrieben. Der Parser-Regex `(- \| ✅ \| ❌) (Correct\|Incorrect)` akzeptiert beide Varianten.
  - 🚨, 🔴, 🟢, 🔄, 📋, ⚠️ aus Headern und Bullet-Points ersatzlos
- **Smoke validiert** (1 Run): `predictions_total = 18` (2.25 × cycle_count=8), 18/18 correct, `tests_passing = true`, `verification_pct = 1.00`. Parser erkennt Hyphen-Variante korrekt.
- **Was bleibt unveraendert**: alle operationalen Anweisungen, Process-Steps, APP, Four Rules, Pep-Talks, Refactor-Subagent-Logik, alle Rules-Files. Einziger Unterschied: keine visuellen Marker mehr.

## Hypothesen

- **H1 (Emojis wirkungslos auf Code-Qualitaet)**: alle 5 primaeren Metriken (`code_mass`, `smell_total`, `cc_longest_function`, `cognitive_max`, `mccabe_max`) innerhalb ±1 σ der v6-Streuung.
- **H2 (Emojis helfen messbar)**: mindestens 2 Metriken > +1 σ schlechter mit konsistenter Richtung.
- **H3 (Emojis kosten Tokens)**: ≥ 5 % Einsparung in v6.4. **A-priori klein** erwartet — die ~85 Emojis machen mengenmaessig nur einen Bruchteil der Token-Last aus.
- **H4 (Prediction-Disziplin-Effekt)**: besonders sensitiv ist `predictions_correct_rate`, weil die ✅/❌ direkt im Prediction-Output-Template stehen. Parallel zur RQ-pep F-pep.2 koennte die visuelle Markierung als Disziplin-Anker wirken. Smoke-Run zeigt **100 % Compliance**, also kein Signal in diese Richtung — Voll-Batch muss das verifizieren.

**A-priori Erwartung**: Mix aus H1 und (sehr schwacher) H3. Smoke-Daten deuten auf H1 hin.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6-hybrid, v6.4-no-emoji), beide mit example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5
Runs:      15 total
           — 10 v6-Runs wiederverwendet aus RQ-stability
           — 5 v6.4-no-emoji Runs (1 Smoke + 4 Batch-Fill)
```

## Caveats

- **n=5, single Kata, single Modell**: identische Limitierungen wie RQ-app bis RQ-pep.
- **Smoke zaehlt als Daten**: methodisch sauber, weil der Smoke-Run unter denselben Bedingungen lief wie die Batch-Runs. Die Smoke-Validierung diente nur dem Marker-Compliance-Check (passed), nicht der Datenauswahl.
- **Parser-Kompatibilitaet bestaetigt**: Hyphen-Variante "- Correct"/"- Incorrect" wird vom Parser korrekt als Prediction erkannt. Risiko von "Prediction-Loss" durch Format-Aenderung ist im Voll-Batch zu pruefen (war im Smoke null).

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6-hybrid, v6.4-no-emoji}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
