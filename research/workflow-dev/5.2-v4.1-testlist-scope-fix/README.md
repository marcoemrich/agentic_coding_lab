---
id: RQ-testlist-fix
question: "Verbessert die v4.1-testlist-scope-fix-Variante die verification_pct auf claim-office-example-mapping gegenüber v4-exact-subagents — und gilt der Effekt konsistent über Opus 4.7 (Direct API) und Opus 4.6 (Portkey)?"
factors:
  workflow:
    - v4-exact-subagents
    - v4.1-testlist-scope-fix
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
  - cycle_count
  - refactorings_applied
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-testlist-fix: v4.1-testlist-scope-fix Korrektheits-Effekt auf Opus (ohne Thinking)

## Motivation

v4-exact-subagents zeigt auf `claim-office-example-mapping` historisch eine bimodale verification_pct (≈0.67 im Mittel, mit Runs zwischen 0.20 und 1.00). v4.1-testlist-scope-fix wurde mit der Absicht entwickelt, die Test-List-Scope-Probleme zu adressieren, die in v4-Subagent-Runs die Korrektheits-Streuung erzeugen.

Diese RQ misst, ob v4.1 die verification_pct auf claim-office-example-mapping signifikant gegenüber v4 hebt — und ob der Effekt unabhängig vom Modell-Routing (Direct API Opus 4.7 vs. Portkey Opus 4.6) ist.

## Hypothesen

- **H1 (v4.1 hebt Korrektheit):** v4.1 erreicht im Mittel höhere verification_pct als v4 auf claim-office-example-mapping; insbesondere weniger Low-Outlier-Runs (<0.40).
- **H2 (Modell-unabhängig):** Der v4→v4.1-Effekt ist auf opus-4-7-no-thinking und opus-4-6-portkey-no-thinking ähnlich (gleiche Richtung, vergleichbare Größe). Sonst ist der Fix modell-spezifisch und nicht generalisierbar.

## Design

- 2 Workflows × 2 Modelle × 1 Prompt-Stil = 4 Zellen
- min_replicates = 5 pro Zelle, n=20 insgesamt
- Reuse aus `experiments/runs/`:
  - v4 × opus-4-7-no-thinking: 7 Runs vorhanden (10.05. + 15.05.) → 0 Refill
  - v4 × opus-4-6-portkey-no-thinking: 5 Runs vorhanden (19.05.) → 0 Refill
  - v4.1 × opus-4-7-no-thinking: 0 → 5 Refill
  - v4.1 × opus-4-6-portkey-no-thinking: 0 → 5 Refill

## Erwartetes Ergebnis-Muster

Wenn H1+H2: v4.1 in beiden Modell-Spalten klar über v4, geringere Streuung, Low-Outlier-Quote sinkt.

Wenn nur H1, nicht H2: Effekt nur in einem Modell — der Fix wäre dann modell-spezifisch und müsste vor Übernahme in die Workflow-Default-Pipeline auf weiteren Modellen geprüft werden.

Wenn weder H1 noch H2: v4.1 verschiebt nicht die Korrektheit; Test-List-Scope ist nicht die dominante Ursache der v4-Bimodalität.

## Methodisches Detail: Routing-Split

opus-4-7 läuft Direct API, opus-4-6-portkey über Portkey-Gateway. `batch.sh` wählt das Config-Dir per Plan, nicht per Run — der Refill braucht **zwei Batch-Plans** (Direct und Portkey getrennt), sequentiell ausgeführt.
