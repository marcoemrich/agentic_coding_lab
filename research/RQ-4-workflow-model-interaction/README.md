---
id: RQ-4
question: "Profitieren schwächere Modelle stärker von strikteren Workflows als starke?"
factors:
  workflow_x_prompt:
    - {workflow: v1-oneshot,              prompt: prose}
    - {workflow: v3-basic-tdd,            prompt: example-mapping}
    - {workflow: v4-exact-subagents,      prompt: example-mapping}
    - {workflow: v5-exact-single-context, prompt: example-mapping}
  model:
    - opus-4-7-no-thinking
    - sonnet-4-6
    - haiku-4-5
controls:
  kata_base: game-of-life
outcomes:
  - tests_passing
  - code_mass
  - smell_total
  - cc_longest_function
min_replicates: 3
status: aktiv
---

# RQ-4: Wechselwirkung Workflow × Modell

Profitieren schwächere Modelle (Haiku) stärker von strikteren
TDD-Workflows als starke Modelle (Opus)? Mit anderen Worten: Hängt die
Workflow-Effekt-Größe vom Modell ab?

Diese RQ überlagert [RQ-1](../RQ-1-workflow-effect/) (Workflow allein)
und [RQ-3](../RQ-3-model-and-thinking/) (Modell allein) und sucht nach
**Interaktions-Effekten**.

## Reduziertes Faktor-Design

Volldesign wäre 5 Workflows × 5 Modelle = 25 Zellen × n=3 = 75 Runs.
Reduziert auf 4 × 3 = 12 Zellen × n=3 = **36 Runs**:

- **Workflow**: v1 (oneshot, kein TDD), v3 (mildes TDD), v4 (multi-context
  TDD), v5 (single-context TDD). Lässt v2 weg, weil es nah an v1 liegt.
  v4 und v5 beide drin, weil sich gerade hier interessante
  Modell-Unterschiede zeigen könnten (single- vs. multi-context).
- **Modell**: opus-4-7-no-thinking, sonnet-4-6, haiku-4-5. Lässt
  Thinking-Varianten weg (orthogonal zu RQ-3).

## Design-Begründung

**Workflow-Constraint** beachtet: v1 → prose, v3/v4/v5 → example-mapping
(siehe [`research/README.md`](../README.md#workflow--erlaubte-prompt-stile)).

**Kein v2**: Reduziert Run-Aufwand. v2 ist v1 zu ähnlich, um zusätzliches
Interaktions-Signal zu liefern.

**Kein Thinking**: Hier interessiert reiner Modell×Workflow-Effekt;
Thinking ist Gegenstand von RQ-3.

## Untersuchte Hypothesen

- H1 (Schwach-stark-Asymmetrie): Striktere Workflows verbessern Haikus
  `tests_passing` deutlich, Opus' nur marginal.
- H2 (TDD-Floor-Lifting): Smells reduzieren sich bei schwachen Modellen
  durch v4/v5 stärker als bei starken (= TDD hebt das Mindest-Niveau).
- H3 (Diminishing-returns für Opus): Opus erreicht mit v3 schon
  Code-Quality-Niveau, das v4/v5 nur noch wenig verbessert.
- H4 (v4-vs-v5 modellabhängig): v5 (single-context) hilft schwachen
  Modellen mehr als v4, weil weniger Subagent-Übergänge zu
  Kontext-Verlust führen — oder umgekehrt.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/`, die zu einem
`(workflow, prompt)`-Paar aus dem Faktor-Pairing gehören und mit einem
der drei Modelle und `kata=game-of-life-{prompt}` matchen.

Bei Bedarf können Runs aus RQ-1 (Workflow-Spalte v1/v3/v4 mit Opus) und
RQ-3 (Modell-Spalte v4 mit allen Modellen) wiederverwendet werden — die
Selektor-Query nimmt automatisch alle matching Runs.
