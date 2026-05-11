---
id: RQ-10
question: "Wie unterscheiden sich Opus 4.7 und Opus 4.6 hinsichtlich Code-Qualität unter den Workflows v4 und v5?"
factors:
  model:
    - opus-4-7
    - opus-4-7-no-thinking
    - opus-4-6-portkey
    - opus-4-6-portkey-no-thinking
  workflow_x_prompt:
    - {workflow: v4-exact-subagents,      prompt: example-mapping}
    - {workflow: v5-exact-single-context,  prompt: example-mapping}
  kata_base: [game-of-life]
controls: {}
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
  - predictions_correct
  - predictions_total
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 4
status: aktiv
---

# RQ-10: Modell-Vergleich Opus 4.7 vs. 4.6 — Einfluss auf Code-Qualität

## Motivation

RQ-9 zeigt, dass der Subagent-Workflow (v4) niedrigere Komplexität produziert
als der Single-Context-Workflow (v5/v5.1), auch bei gleichem Modell. Gleichzeitig
deuten informelle Vergleiche darauf hin, dass Opus 4.7 unter v4 nochmals
bessere Code-Qualität liefert als Opus 4.6 (McCabe ~4.5 vs ~7.5, Cognitive
~5 vs ~12). Diese RQ trennt den Modell-Effekt sauber vom Workflow-Effekt,
indem beide Faktoren orthogonal variiert werden.

## Design

**Faktoren** (vollständig gekreuzt):

- `model`: 4 Stufen (Opus 4.7 mit/ohne thinking × Opus 4.6 mit/ohne thinking)
- `workflow_x_prompt`: 2 Stufen (v4 × example-mapping, v5 × example-mapping)

→ 8 Zellen × 4 Replikate = 32 Zielruns.

**Kata**: `game-of-life` — einzige Kata mit verlässlichem
Code-Qualitäts-Signal (mars-rover hat zu wenig Smells).

**Kein Control `kata_base`**: Kata ist implizit über `kata_base` im
Frontmatter fixiert.

## Portkey-Routing

Zellen mit `opus-4-6-portkey` und `opus-4-6-portkey-no-thinking` laufen über
das Portkey-Gateway (`CLAUDE_CONFIG_DIR=~/.claude.portkey`). Zellen mit
`opus-4-7` und `opus-4-7-no-thinking` laufen über die direkte Anthropic-API.

Konsequenz: in einem Batch-Lauf können nicht alle 8 Zellen gemischt werden —
Portkey-Runs brauchen `CLAUDE_CONFIG_DIR`, Direct-API-Runs nicht. Der
Fill-Plan muss daher in zwei Teile gesplittet werden (oder manuell
nacheinander gefahren werden).

## Hypothesen

1. **Modell-Effekt**: Opus 4.7 produziert niedrigere `mccabe_max`,
   `cognitive_max` und `smell_total` als Opus 4.6, unabhängig vom Workflow.
2. **Thinking-Effekt**: Thinking-Varianten produzieren kompaktere Lösungen
   (niedrigere `cc_longest_function`, niedrigere `code_mass`).
3. **Interaktion**: der Qualitätsvorteil von 4.7 ist unter v4 (Subagents)
   größer als unter v5 (Single-Context), weil Subagents stärker von der
   Modell-Qualität pro Einzelschritt profitieren.

## Findings

Siehe [findings.md](findings.md) (entsteht nach erstem Datenlauf).
