---
id: RQ-21
question: "Hängt die Güte eines TDD-Workflows vom Modell ab — gibt es einen universell besten Workflow, oder tauschen verschiedene Workflows je nach Modell die Plätze?"
factors:
  workflow:
    - v4-exact-subagents
    - v5-exact-single-context
    - v6-hybrid
  model:
    - opus-4-7-no-thinking
    - opus-4-6-portkey-no-thinking
controls:
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  - verification_pct
  - verification_passed
  - tests_passing
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-21: Workflow×Modell-Interaktion — gibt es einen universell besten Workflow?

## Motivation

Die Workflow-Entwicklung (siehe `research/workflow-dev/`) optimiert TDD-Workflows meist auf
*einem* Modell (`opus-4-7-no-thinking`). Diese RQ stellt die generische Frage dahinter: Ist die
gemessene Workflow-Güte überhaupt auf andere Modelle übertragbar, oder ist sie modell-spezifisch?

Der Befund hat direkte Konsequenzen für die Praxis agentischen Codings: Wenn Workflows
modell-abhängig sind, gibt es keine universelle „beste" Workflow-Empfehlung — die Wahl muss am
eingesetzten Modell ausgerichtet werden. Die daraus abgeleitete Empfehlungs-Matrix lebt in
`research/workflow-dev/model-recommendation-matrix.md`.

Die Daten stammen aus der Korrektheits-Messung auf `claim-office-example-mapping` (novel Kata,
externe Verifikations-Suite). Die drei Workflows decken die Architektur-Achse ab: v4 (alle Phasen
isolierte Subagents), v5 (alles Single-Context), v6 (Hybrid: red/green shared, refactor isoliert).

## Hypothesen

- **H1 (modell-abhängig):** Die Rangfolge der Workflows auf `verification_pct` ist nicht über beide
  Modelle stabil — mindestens ein Workflow-Paar tauscht die Plätze.
- **H2 (Mechanismus):** v6-hybrid delegiert Orchestrierung an das Modell (Skill-Invocation im
  shared Context) und profitiert von stärkeren Modellen; v4 gibt jeder Phase einen expliziten
  Subagent-Prompt und stützt schwächere Modelle.

## Erwartetes Ergebnis-Muster

Wenn H1: v6 ist auf dem stärkeren Modell oben, v4 auf dem schwächeren — die Workflow-Empfehlung ist
dann notwendig modell-bedingt. Wenn nicht: ein Workflow dominiert über beide Modelle, und die
Empfehlung kann modell-unabhängig gegeben werden.

## Verwandte RQs

- Lokalisierung der Korrektheits-Regression in der v6.5-Kette (woraus dieser Befund stammt):
  `research/workflow-dev/5.1-correctness-regression/` (F-19.1–F-19.5, F-19.7, F-19.8).
- Modell-Effekt auf novel Kata generell: `research/questions/2.2-model-effect-novel-kata/`.
- Abgeleitete Praxis-Empfehlung: `research/workflow-dev/model-recommendation-matrix.md`.
