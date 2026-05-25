---
id: RQ-v62-cleanup-validation-v61-with-why
question: "Veraendern die drei v6.5.1-Audit-Cleanups (Konsistenz, refactor.md-Entkopplung, tdd-experiment-mode-Reframing) — angewendet auf v6.1-with-why — messbar das Workflow-Verhalten auf claim-office, oder ist v6.2-with-why-cleaned eine verhalts-aequivalente Hygiene-Variante der neuen Default-Baseline?"
factors:
  workflow_x_prompt:
    - {workflow: v6.1-with-why,             prompt: example-mapping}  # Baseline (mit Why-Bloecken aus RQ-1.5)
    - {workflow: v6.2-with-why-cleaned,     prompt: example-mapping}  # + Cleanup 2/3/6 aus v6.5.1-Audit
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primaer: Korrektheit (claim-office mit echten Mehrdeutigkeiten)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD-Disziplin (sollte unveraendert bleiben — Cleanups sind kein-behavior-change-intended)
  - predictions_correct_rate
  - refactorings_applied
  - tests_passed_immediately
  - cycle_count
  # Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # Kosten
  - duration_seconds
  - total_tokens
min_replicates: 8
status: aktiv
---

# RQ-v62-cleanup-validation: v6.2-with-why-cleaned vs v6.1-with-why (claim-office)

Veraendern die drei Cleanups aus dem archivierten v6.5.1-blueprint-audit — wenn sie auf v6.1-with-why (RQ-1.5-Gewinner) angewendet werden — messbar das Workflow-Verhalten, oder ist `v6.2-with-why-cleaned` eine sichere Hygiene-Variante, die als neue Default-Baseline dienen kann?

## Motivation

RQ-1.5 hat `v6.1-with-why` als Default-Empfehlung etabliert (Korrektheit invariant zu Baseline, deutlich bessere Code-Qualitaet und engere Streuung). Der v6.5.1-blueprint-audit aus dem Archiv schlug fuenf Cleanup-Klassen vor; drei davon sind reine Kosmetik/Hygiene:

1. **Konsistenz**: `pnpm test:unit:basic` → `pnpm test`, Rule-File-Hyphen-Konvention, Permission-Deduplikation in `settings.json`.
2. **refactor.md-Entkopplung**: TDD-Pipeline-Kopplung (`description`, "After Green phase", "Proceeding to the next test", "Skipping refactoring phase") entfernt; role-neutrale Formulierungen.
3. **tdd-experiment-mode.md-Reframing**: Phantom-HITL-Override raus, positives Statement des autonomen Defaults + Measurement-Pipeline-Rationale.

Die anderen zwei Cleanups (Rationale-Additions, Short-Circuit-Hardening) sind semantisch und bewusst ausgeklammert. Auch der v6.5.1-Skill-Migrations-Hebel ist verworfen — Memory `skills-vs-commands-decision` dokumentiert, dass `commands/` mit Skill-Tool funktioniert.

**Erwartung (Null-Hypothese):** v6.2-with-why-cleaned verhaelt sich wie v6.1-with-why. Cleanups sind kein-behavior-change-intended.

**Risiko:** Die Memory-Note `v6.5-correctness-setback` warnt vor genau diesem Vorgehen — eine fruehere skill-creator-getriebene Cleanup-Welle (v6.5-lean) hat MUSTs entfernt und die Korrektheit zerstoert. Diese RQ ist die Sicherheitspruefung, dass die jetzt angewandten 3 Cleanups nicht denselben Schaden anrichten.

## Workflow-Definition

`v6.2-with-why-cleaned` lebt unter `experiments/workflows/v6.2-with-why-cleaned/` und unterscheidet sich von `v6.1-with-why` nur in den drei oben genannten Achsen:

| File | Aenderung |
|---|---|
| `commands/red.md` Z.54,85 | `pnpm test:unit:basic` → `pnpm test` |
| `commands/green.md` Z.68 | `pnpm test:unit:basic` → `pnpm test` |
| `rules/tdd_with_ts_and_vitest.md` → `rules/tdd-with-ts-and-vitest.md` | Hyphen-Konvention; Referenz in `tdd.md` Z.116 angepasst |
| `settings.json` | `Bash(pnpm test:*)`, `Bash(pnpm install:*)`, `Bash(pnpm run:*)` entfernt (Redundanz zu `Bash(pnpm:*)`) |
| `agents/refactor.md` | description, mission, "Build and Tests"-Sektion role-neutral; Completion-Report ohne "Proceeding to the next test"; Red-Flag "Never skip refactoring phase" → "Never return without attempting at least one improvement" |
| `rules/tdd-experiment-mode.md` | Titel "TDD Autonomous Execution"; HITL-Override-Sektion durch positives Autonomie-Statement ersetzt; "Launch refactor Task subagent" → "Launch the refactor subagent via the Task tool"; "EXPERIMENT MODE:"-Marker im Subagent-Template entfernt |

Saemtliche MUSTs, Why-Bloecke und alle vier MARKERS.md-Marker bleiben **vollstaendig erhalten**. Diff zur Verifikation:
```
diff -r experiments/workflows/v6.1-with-why experiments/workflows/v6.2-with-why-cleaned
```

## Hypothesen

- **H0** (Erwartung) — v6.2-with-why-cleaned ist statistisch nicht von v6.1-with-why unterscheidbar auf `verification_pct`, `cycle_count`, `refactorings_applied`, `predictions_correct_rate`. Cleanups sind kein-behavior-change.
- **H1** (Korrektheits-Bruch) — v6.2 zeigt eine Korrektheits-Regression auf claim-office (verification_pct mean um >=5 pp niedriger oder Outlier-Rate hoch). Eine der drei Cleanup-Achsen war doch verhaltens-relevant. Konsequenz: Cleanup-Achse einzeln retesten, schlimmsten Verdaechtigen (tdd-experiment-mode.md) revertieren.
- **H2** (Disziplin-Drift) — v6.2 zeigt veraenderte TDD-Disziplin (refactorings, cycles, predictions) bei stabiler Korrektheit. Cleanups sind subtil verhaltens-aendernd. Konsequenz: dokumentieren, aber v6.2 vermutlich noch akzeptabel als Default.

## Datenstand

n=8 saubere Runs pro Workflow:
- `v6.1-with-why` (n=8) — uebernommen aus RQ-1.5
- `v6.2-with-why-cleaned` (n=8) — neu erhoben 2026-05-24/25 nach Cleanup-Anwendung

**Caveat Outlier**: Ein `v6.1-with-why`-Run (`2026-05-24_00-08-47`) zeigt cycles=0 + verification=0.27 — Symptom des Nudge-Transcript-Overwrite-Bugs (siehe Memory `nudge-transcript-overwrite-bug`, vor 2026-05-24-Fix). Alle 8 `v6.2`-Runs entstanden nach dem Fix und zeigen end_turn=1. Bei `end_turn==0`-Filterung verbleiben v6.1-with-why n=7, v6.2 n=8. Findings.md addressiert beide Sichten.

**Caveat Routing**: alle 16 Runs sind Portkey-routed mit Opus 4.7 No-Thinking; die zwischenzeitlich aufgetretenen 3-Shard-Cut-Verluste (Memory `portkey-shards-external-cut-risk`) sind durch `end_turn==1`-Filter ausgeschlossen.
