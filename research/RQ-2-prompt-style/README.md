---
id: RQ-2
question: "Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit?"
factors:
  prompt: [prose, example-mapping, user-story]
  kata_base: [claim-office]
controls:
  workflow: v4-exact-subagents
  model: opus-4-7-no-thinking
outcomes:
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
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

Konfiguration: `experiments/katas/claim-office-{prose, example-mapping, user-story}/prompt.md`.

## Design-Begründung

**Workflow-Constraint**: Diese RQ ist nur auf TDD-Workflows (v3/v4/v5)
sinnvoll, weil v1/v2 nur prose erlauben (siehe Methoden-Constraint im
[`research/README.md`](../README.md#workflow--erlaubte-prompt-stile)).
Default: `v4-exact-subagents` als der angestrebte Lab-Workflow. Die
Frage, ob der Prompt-Stil-Effekt workflow-abhängig ist, behandelt
[RQ-6](../RQ-6-prompt-style-x-workflow/) als eigene Interaktions-RQ.

**Kontrolle ausschließlich auf claim-office**: game-of-life ist als
Mehrdeutigkeits-Aufdecker für Prompt-Stile **nicht brauchbar**. Die Spec
inkl. Beispiele ist in den Trainingsdaten der Modelle — Modelle "kennen"
die korrekte Lösung bereits, unabhängig davon, ob der Prompt Beispiele
mitliefert oder nicht. claim-office ist eigens als Novel-Kata mit
konstruierten Mehrdeutigkeiten (HPSMV-Domäne) entwickelt; nur hier
unterscheiden sich die Stile messbar in Korrektheit
(`verification_pct`).

**Single Model (opus-4-7-no-thinking)**: eliminiert
Modell-Konfundierung. Modell-Effekte sind Gegenstand von
[RQ-3](../RQ-3-model-and-thinking/).

## Untersuchte Hypothesen

- H1: example-mapping erhöht `verification_pct` deutlich gegenüber prose
  und user-story (Beispiele lösen Mehrdeutigkeiten direkt auf).
- H2: user-story erzeugt mehr `code_mass` als prose (mehr
  Interpretations-Spielraum → defensivere Implementierung).
- H3: prose und example-mapping liefern vergleichbare `smell_total`,
  user-story tendenziell schlechter.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow=v4-exact-subagents`, `model=opus-4-7-no-thinking`,
`kata=claim-office-{prose|example-mapping|user-story}`.

Aktuelle Datenbasis (Stand 2026-05-09): laufender
`claim-office-fill`-Batch füllt die drei Zellen auf je n=3.
