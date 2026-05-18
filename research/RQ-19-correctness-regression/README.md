---
id: RQ-19
question: "An welcher Stelle in der Optimierungskette v6 → v6.5 → v6.5.1 → v6.5.2 → v6.5.3 → v6.5.4 (→ v6.6) ist die verification_pct-Regression auf claim-office-example-mapping entstanden? v6-hybrid liefert 1.0 ± 0, v6.5.4 nur 0.40 ± 0.43 — die Stufe dazwischen ist nicht beobachtet."
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,                       prompt: example-mapping}
    - {workflow: v6.1-no-app,                     prompt: example-mapping}
    - {workflow: v6.2-no-rules,                   prompt: example-mapping}
    - {workflow: v6.3-no-pep,                     prompt: example-mapping}
    - {workflow: v6.4-no-emoji,                   prompt: example-mapping}
    - {workflow: v6.5-lean,                       prompt: example-mapping}
    - {workflow: v6.5.1-orchestration-audited,    prompt: example-mapping}
    - {workflow: v6.5.2-bullets-cut,              prompt: example-mapping}
    - {workflow: v6.5.3-targeted-cuts,            prompt: example-mapping}
    - {workflow: v6.5.4-refactor-cut-only,        prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: claim-office
outcomes:
  - verification_pct
  - verification_passed
  - tests_passing
  - tests_total
  - cycle_count
  - refactorings_applied
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 3
status: aktiv
---

# RQ-19: verification_pct-Regression in der v6-Optimierungs-Kette lokalisieren

## Motivation

RQ-18.1 hat unerwartet gezeigt, dass v6.5.4 auf `claim-office-example-mapping × opus-4-7-no-thinking` nur 0.40 ± 0.43 `verification_pct` erreicht (3 perfekte Runs, 7 zwischen 0 und 0.20). Historische Daten aus RQ-7 / RQ-1 zeigen aber:

- v4-exact-subagents: 0.67 (bimodal)
- v5-exact-single-context: 0.87 (1 Outlier)
- **v6-hybrid: 1.00** (n=5, perfekt)

Die gesamte v6.5er-Reduktionskette (RQ-13 → RQ-17) wurde ausschließlich auf game-of-life gemessen, weil GOL keine externe Verification-Suite hat. Damit war die Korrektheits-Achse für die letzten ~5 Workflow-Iterationen blind. v6-hybrid → v6.5.4 ist eine 60-Punkte-Regression, deren Quelle in einer der Reduktions-Stufen versteckt ist.

## Hypothesen

- **H1 (Lokalisierung möglich)**: einer der Sprünge v6→v6.5, v6.5→v6.5.1, v6.5.1→v6.5.2, v6.5.2→v6.5.3, v6.5.3→v6.5.4 produziert den Großteil des Abfalls. → n=3-Probe sollte den Bruchpunkt zumindest grob zeigen.
- **H2 (Bullet-Cut als Verdächtiger)**: v6.5.2 (alle Cuts) bzw. v6.5.3 (zwei Cuts) waren auf GOL Quality-Champions. Möglich, dass die "Remember"-Bullets aus `refactor.md` nicht nur Code-Qualität, sondern auch Korrektheit absichern. → wenn der Sprung v6.5.1→v6.5.2 deutlich ist, hängt Korrektheit am Bullet-Anker.
- **H3 (Why-Rewrites als Verdächtiger)**: v6.5-lean hat alle Cuts gebündelt + skill-creator-Why-Rewrites in einem Schritt. Wenn der Abfall schon bei v6.5-lean voll da ist, sind die Why-Rewrites verdächtig.

## Erwartetes Ergebnis-Muster

Wenn H2 stimmt: v6-hybrid ≈ v6.5-lean ≈ v6.5.1 = 1.0, dann Sprung auf 0.4–0.7 bei v6.5.2 oder v6.5.3, bleibt unten bei v6.5.4.

Wenn H3 stimmt: Sprung schon bei v6.5-lean (1.0 → 0.5±).

## n=3 Triage

Die Probe ist bewusst klein (n=3 pro Workflow), um schnell zu identifizieren, *wo* der Bruch ist. Nach Identifikation der verdächtigen Stufe wird diese Stufe und die Nachbar-Stufen auf n=10 nachgeschärft, um den Effekt statistisch abzusichern.

## Methodisches Defizit, das RQ-19 aufdeckt

Die v6.5er-RQs waren auf Code-Qualität fokussiert und haben Korrektheit-außen nicht in der Outcome-Liste geführt. Lehre: **mindestens eine Korrektheits-Stichprobe pro Workflow-Iteration**, auch wenn die RQ primär Code-Qualität untersucht. Vorschlag für `workflow-construction.md`: Pflicht-Smoke auf claim-office-example-mapping × n=3 vor jedem n=10-Quality-Batch.
