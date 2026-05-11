---
id: RQ-9.2
question: "Stellt die gezielte Wiederherstellung der drei identifizierten tragenden Inhalte die Refactoring-Disziplin und Funktionslänge wieder her?"
factors:
  workflow_x_prompt:
    - {workflow: v4-exact-subagents,  prompt: example-mapping}
    - {workflow: v4.2-conservative,   prompt: example-mapping}
    - {workflow: v4.3-targeted,       prompt: example-mapping}
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
min_replicates: 8
status: aktiv
---

# RQ-9.2: Gezielte Wiederherstellung tragender Subagent-Prompt-Inhalte

## Motivation

RQ-9.1 zeigt, dass die konservative Reduktion (v4.2) zwar `cognitive_max`
stabil hält, aber `refactorings_applied` von 6.0 auf 2.5 senkt und
`cc_longest_function` von 16.8 auf 20.3 ansteigen lässt. Die
Diff-Analyse identifiziert drei tragende Inhalte im Refactor-Subagent,
die v4.2 entfernt hat:

1. **Szenario "Extract Helper"** — das einzige Beispiel einer
   Funktions-Extraktion
2. **"Potential improvements"-Listen** — konkrete Handlungsoptionen pro
   Simple-Design-Rule
3. **Szenario "No Refactoring Needed"** — Vorlage für begründete
   Ablehnung

v4.3 bringt diese drei Inhalte zurück (+61 Zeilen, 484 → 545 Zeilen)
und belässt alle anderen Kürzungen von v4.2.

## Hypothese

v4.3 erreicht die **Refactoring-Disziplin und Funktionslänge** von v4
(`refactorings_applied` ≈ 6, `cc_longest_function` ≈ 17) bei
gleichzeitig **stabiler `cognitive_max`** (≈ 12) und niedrigerer
`duration_seconds` als v4.

Wenn bestätigt: die drei identifizierten Inhalte sind die tragenden
Elemente, und v4.3 ist der optimale Subagent-Workflow.

## Portkey-Routing

Wie RQ-9: `opus-4-6-portkey` über Portkey-Gateway.

## Findings

Siehe [findings.md](findings.md) (entsteht nach erstem Datenlauf).
