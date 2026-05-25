---
id: RQ-v62-cleanup-validation-gol
question: "Generalisiert das Cleanup-Aequivalenz-Ergebnis aus RQ-1.6 (claim-office) auch auf die trainings-bekannte game-of-life-Kata, oder zeigt v6.2-with-why-cleaned dort einen anderen Effekt als auf claim-office?"
factors:
  workflow_x_prompt:
    - {workflow: v6.1-with-why,             prompt: example-mapping}  # Baseline (mit Why-Bloecken aus RQ-1.5)
    - {workflow: v6.2-with-why-cleaned,     prompt: example-mapping}  # + Cleanup 2/3/6 aus v6.5.1-Audit
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: game-of-life
outcomes:
  # primaer: Code-Qualitaet (auf GoL ist Korrektheit saturiert)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # Korrektheit (zur Bestaetigung dass GoL nicht bricht)
  - tests_passing
  - completed_within_budget
  # TDD-Disziplin
  - predictions_correct_rate
  - refactorings_applied
  - tests_passed_immediately
  - cycle_count
  # Kosten
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.7: v6.2-with-why-cleaned vs v6.1-with-why (game-of-life)

Generalisiert der RQ-1.6-Befund (Cleanups verhalts-aequivalent zu v6.1-with-why auf claim-office) auch auf die trainings-bekannte `game-of-life-example-mapping`-Kata, oder zeigen sich dort andere Effekte?

## Motivation

RQ-1.6 hat auf `claim-office-example-mapping × opus-4-7-portkey-no-thinking` festgestellt: v6.2-with-why-cleaned ist gegenueber v6.1-with-why verhalts-aequivalent — keine Korrektheits-Regression, leichte Disziplin-Drift (mehr Refactorings, engere Streuung), moderate Kosten (+13 % Wallclock).

Die [v6.1-Reduktions-Linie](../1.1-pep-effect-v6.1/findings.md) hat aber wiederholt gezeigt, dass Workflow-Effekte **kata-spezifisch** sind:
- Pep-/Emoji-Reduktion war auf GoL korrektheits-invariant, brach aber auf claim-office.
- Disziplin-Pattern (welcher Workflow refactoriert mehr) kehrt sich teilweise zwischen GoL und claim-office um.

Diese RQ prueft, ob die Cleanup-Aequivalenz aus RQ-1.6 modell-aequivalent ist oder ob GoL ein anderes Bild liefert.

**Erwartung:** Auf GoL ist `verification_pct` / `tests_passing` typischerweise saturiert (beide Workflows nahe 100 %), sodass die Korrektheits-Achse keine Differenz aufzeigt. Spannend wird der Disziplin- und Code-Qualitaets-Vergleich.

## Workflow-Definition

Identisch zu RQ-1.6 — v6.2-with-why-cleaned ist v6.1-with-why + die drei Hygiene-Cleanups aus dem archivierten v6.5.1-blueprint-audit (Konsistenz-Renames, refactor.md-Entkopplung, tdd-experiment-mode-Reframing). Diff:

```
diff -r experiments/workflows/v6.1-with-why experiments/workflows/v6.2-with-why-cleaned
```

## Hypothesen

- **H0** (Erwartung) — v6.2-with-why-cleaned ist auf GoL ebenfalls verhalts-aequivalent zu v6.1-with-why auf Korrektheit, mit eventuell schwacher Disziplin-/Code-Qualitaets-Drift in derselben Richtung wie auf claim-office (mehr Refactorings, leichte Verbesserung der Spitzen-Komplexitaet).
- **H1** (Kata-Spezifischer Cleanup-Effekt) — Auf GoL zeigt v6.2 *kein* Refactorings-Plus (claim-office: +34 %). Die in RQ-1.6 beobachtete refactor.md-Entkopplungs-Wirkung ist auf die Multi-Iteration-Komplexitaet von claim-office angewiesen.
- **H2** (Kosten-Aequivalenz) — Auf GoL ist v6.2 nicht teurer als v6.1-with-why, weil die kuerzere Kata weniger Iterationen produziert und der refactor.md-Kopplungs-Effekt sich nicht aufbaut.

## Datenstand

n=5 pro Zelle, neu erhoben 2026-05-25:
- `v6.1-with-why` (n=5)
- `v6.2-with-why-cleaned` (n=5)

Beide single-shard sequenziell gefahren (parallel als 2 Container, da kurze GoL-Sessions kein nennenswertes Portkey-Cut-Risiko zeigen — siehe Memory `portkey-shards-external-cut-risk`).

Replikate-Anzahl: n=5 statt n=8 wie RQ-1.6, weil GoL deutlich kuerzer ist (~10 min/Run vs ~37 min/Run) und damit weniger Aufschluss pro Replikat liefert; n=5 reicht fuer einen Cross-Kata-Validierungs-Sanity-Check. Falls die Daten eine starke Aussage stuetzen (z.B. eindeutige Disziplin-Drift), kann auf n=8 erweitert werden.
