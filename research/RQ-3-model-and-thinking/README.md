---
id: RQ-3
question: "Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf Output-Qualität und Effizienz?"
factors:
  model:
    - opus-4-7
    - opus-4-7-no-thinking
    - sonnet-4-6
    - sonnet-4-6-no-thinking
    - haiku-4-5
  kata_base: [game-of-life, claim-office]
controls:
  workflow: v4-exact-subagents
  prompt: example-mapping
outcomes:
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - code_mass
  - smell_total
  - cc_longest_function
  - mccabe_max
  - cognitive_max
  - duration_seconds
  - total_tokens
  - context_utilization_pct
  - completed_within_budget    # Praktikabilität: Anteil Runs, die im 90-min-Budget fertig wurden
min_replicates: 3
status: aktiv
---

# RQ-3: Modell- und Thinking-Effekt

Wirken sich Modell-Klasse (Opus 4.7 / Sonnet 4.6 / Haiku 4.5) und
Adaptive/Extended Thinking auf das Ergebnis aus, wenn Workflow,
Prompt-Stil und Kata konstant gehalten werden?

## Modell-Spektrum

| Lab-Varianten-ID | Klasse | Thinking |
|---|---|---|
| `opus-4-7`               | Opus 4.7 | Adaptive |
| `opus-4-7-no-thinking`   | Opus 4.7 | aus |
| `sonnet-4-6`             | Sonnet 4.6 | Extended |
| `sonnet-4-6-no-thinking` | Sonnet 4.6 | aus |
| `haiku-4-5`              | Haiku 4.5 | Extended |

Hinweis: Thinking-Mode ist hier in die Lab-Varianten-ID kodiert, weil
das Run-Setup ihn so behandelt (siehe `experiments/record-run.sh`,
`MODEL_CONFIGS`). Der Faktor heißt `model` und enthält die
Thinking-Variante als Suffix. Mapping zu API-IDs siehe
Top-README, Abschnitt [Model Configurations](../../README.md#model-configurations).

Haiku ohne Thinking wird derzeit nicht erhoben — falls relevant, müsste
`haiku-4-5-no-thinking` ergänzt werden.

## Design-Begründung

**Kontrolle auf v4-exact-subagents**: Stärkster TDD-Workflow,
differenziert die Modelle am deutlichsten (aus früheren Findings:
schwache Modelle versagen hier am ehesten).

**Kontrolle auf example-mapping**: Erfüllt Workflow-Constraint für v4
und gibt allen Modellen die gleiche Test-Hilfe.

**Kontrolle auf game-of-life**: Komplex genug, um Modell-Unterschiede
sichtbar zu machen.

## Untersuchte Hypothesen

- H1: Opus liefert robustere `tests_passing` als Sonnet, Sonnet als
  Haiku.
- H2: Adaptive/Extended Thinking reduziert `smell_total`,
  `cc_longest_function` und `mccabe_max`/`cognitive_max` (mehr
  Reflexion → bessere Designs, simplere Funktionen).
- H3: Schwächere Modelle erzeugen größere `code_mass` (defensivere
  Implementierungen).
- H4: Thinking erhöht `duration_seconds` ohne proportionale
  Korrektheits-Verbesserung außer auf v4/v5 (siehe RQ-4).

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs mit
`workflow=v4-exact-subagents`,
`prompt=example-mapping`,
`kata=game-of-life-example-mapping` und
`model ∈ {opus-4-7, opus-4-7-no-thinking, sonnet-4-6, sonnet-4-6-no-thinking, haiku-4-5}`.

Aktuelle Datenbasis aus den 68 verbliebenen Runs entsprechend filtern.
