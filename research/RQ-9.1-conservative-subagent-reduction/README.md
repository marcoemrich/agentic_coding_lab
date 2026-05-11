---
id: RQ-9.1
question: "Lässt sich der Subagent-Workflow (v4) ohne Qualitätsverlust reduzieren, wenn nur echte Redundanz entfernt wird?"
factors:
  workflow_x_prompt:
    - {workflow: v4-exact-subagents,  prompt: example-mapping}
    - {workflow: v4.2-conservative,   prompt: example-mapping}
  kata_base: [game-of-life]
controls:
  model: opus-4-6-portkey
outcomes:
  - tests_passing
  - code_mass
  - cc_loc
  - cc_avg_loc_per_function
  - cc_longest_function
  - mccabe_max
  - mccabe_avg
  - cognitive_max
  - cognitive_avg
  - smell_total
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 4
status: aktiv
---

# RQ-9.1: Konservative Subagent-Workflow-Reduktion

## Motivation

RQ-9 zeigt zwei Ergebnisse:
1. **v5 → v5.1** (Single-Context, −67 %): Code-Qualität bleibt neutral.
2. **v4 → v4.1** (Subagents, −82 %): `cc_longest_function` steigt von
   16.8 auf 25.3 — die aggressive Reduktion hat fachlich tragende Inhalte
   entfernt.

RQ-9.1 testet eine **konservative** Reduktion (v4.2), die nur echte
Redundanz entfernt und fachliche Anleitungen behält:
- APP-Formel und Component-Werte bleiben
- Naming-Evaluation-Template bleibt
- Baby-Steps-Progression (ein Beispiel) bleibt
- Refactoring-Szenario (eines von drei) bleibt
- Prozess-Schritte bleiben vollständig

Entfernt werden:
- "Psychological Resistance"-Abschnitte
- "Red Flags"-Listen (redundant mit den Regeln)
- "Remember"-Abschnitte
- "Important Guidelines" DO/NOT-Listen (redundant mit Prozess-Schritte)
- "Integration with Project Standards" (irrelevant für Experiment)
- Redundante Templates und Code-Beispiele (2. und 3. Szenario)
- tdd.md: Task-Call-Beispiele (7× `🚨 LAUNCH AGENT`), TDD Mindset, Self-Check

## Reduktions-Umfang

| Variante | Zeilen | Reduktion vs. v4 |
|---|---|---|
| v4 (original) | 1454 | — |
| v4.2 (konservativ) | 484 | −67 % |
| v4.1 (aggressiv) | 262 | −82 % |

## Hypothese

v4.2 erreicht **vergleichbare Code-Qualität** wie v4 — insbesondere
`cc_longest_function` ≈ 16.8 (nicht 25.3 wie bei v4.1) — bei niedrigerer
`duration_seconds` und `total_tokens`.

## Portkey-Routing

Wie RQ-9: `opus-4-6-portkey` über Portkey-Gateway.

## Findings

Siehe [findings.md](findings.md) (entsteht nach erstem Datenlauf).
