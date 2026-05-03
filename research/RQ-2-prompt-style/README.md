---
id: RQ-2
question: "Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit?"
factors:
  prompt: [prose, example-mapping, user-story]
controls:
  workflow: v4-exact-subagents
  kata: game-of-life
  model: claude-opus-4-7-no-thinking
outcomes:
  - tests_passing
  - code_mass
  - smell_total
  - cc_longest_function
  - predictions_correct
  - duration_seconds
min_replicates: 3
status: aktiv
---

# RQ-2: Prompt-Stil-Effekt

Wirkt sich der Prompt-Stil — Prosa-Regeln, Regel-mit-Beispielen,
oder User-Story — auf das Ergebnis aus, wenn Workflow und Modell
konstant gehalten werden?

## Prompt-Stile

| Stil | Beschreibung |
|---|---|
| **prose** | Beschreibung der Regeln in Prosa, keine Test-Beispiele. |
| **example-mapping** | Regel + 1–3 konkrete Input/Output-Beispiele pro Regel. |
| **user-story** | "Als X möchte ich Y, damit Z" — Beschreibung ohne Beispiele. |

Konfiguration: `experiments/katas/game-of-life-{prose, example-mapping, user-story}/prompt.md`.

## Design-Begründung

**Workflow-Constraint**: Diese RQ ist nur auf TDD-Workflows (v3/v4/v5)
sinnvoll, weil v1/v2 nur prose erlauben (siehe Methoden-Constraint im
[`research/README.md`](../README.md#workflow--erlaubte-prompt-stile)).
Default: `v4-exact-subagents` als der angestrebte Lab-Workflow. Falls der
Prompt-Stil-Effekt workflow-abhängig vermutet wird, kann die RQ später
auf v3/v5 erweitert werden.

**Kontrolle auf game-of-life**: Einzige Kata mit verlässlichem
Code-Quality-Signal in allen drei Prompt-Stilen verfügbar.

## Untersuchte Hypothesen

- H1: example-mapping erhöht `tests_passing` (Beispiele machen Tests
  ableitbar).
- H2: user-story erzeugt mehr `code_mass` (mehr Interpretations-Spielraum
  → defensivere Implementierung).
- H3: prose und example-mapping liefern vergleichbare `smell_total`,
  user-story tendenziell schlechter.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow=v4-exact-subagents`, `model=claude-opus-4-7-no-thinking`,
`kata=game-of-life-{prose|example-mapping|user-story}`.

Aktuelle Datenbasis: 9 Runs aus dem ehemaligen
`game-of-life-stability`-Batch (n=3 pro Stil).
