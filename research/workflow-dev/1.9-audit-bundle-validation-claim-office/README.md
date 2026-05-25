---
id: RQ-audit-bundle-claim-office
question: "Generalisiert der RQ-1.8-Befund (Audit-Bundle wirkt Disziplin-stabilisierend und Code-Qualitaets-neutral auf v6.2-Basis × game-of-life) auch auf die novel claim-office-Kata, oder kippt das Pattern dort wie schon in RQ-1.4 fuer Reduktionen geschehen?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # Baseline (Default seit RQ-1.6)
    - {workflow: v6.3-audit-bundle,     prompt: example-mapping}  # + Audit-Bundle (Klasse 2 + Klasse 3)
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primaer: Korrektheit (claim-office ist die Korrektheits-Kata)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD-Disziplin (Audit-Bundle zielt direkt auf Red-/Refactor-Disziplin)
  - tests_passed_immediately
  - refactorings_applied
  - predictions_correct_rate
  - cycle_count
  # Code-Qualitaet (Sanity)
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

# RQ-1.9: v6.3-audit-bundle vs v6.2-with-why-cleaned (claim-office)

Generalisiert der RQ-1.8-Befund (Audit-Bundle wirkt Disziplin-stabilisierend und Code-Qualitaets-neutral) auf die novel `claim-office-example-mapping`-Kata, oder kippt das Pattern dort?

## Motivation

RQ-1.8 hat auf `game-of-life-example-mapping × opus-4-7-portkey-no-thinking` (n=10) gezeigt:

- `tests_passed_immediately` 0.7 → **0 ± 0** (Mandatory-Procedure-Preamble eliminiert vorzeitige Greens deterministisch).
- `refactorings_applied` 7.9 → 8.7 bei σ −64 % (Refactor-Rationale + Drei-Pfad-Bar).
- Code-Qualitaet ±1 σ, Korrektheit 100 % / 100 % bei beiden.
- Kosten: +16 % Tokens, **Wallclock neutral** (Bruch zur v6.5-lean→v6.5.1-Praezedenz).

Dieser Befund ist aber auf GoL gemessen — der trainings-bekannten, korrektheits-saturierten Kata. Die v6.1-Reduktionslinie hat wiederholt gezeigt, dass Workflow-Effekte **kata-spezifisch** sind:

- Pep-/Emoji-Reduktion auf GoL korrektheits-invariant, brach auf claim-office (RQ-1.4: −3 bis −20 pp Korrektheit).
- Cleanup-Bundle auf claim-office staerker wirksam als auf GoL (RQ-1.6 vs RQ-1.7: refactor.md-Entkopplung trieb auf claim-office +34 % Refactorings, auf GoL nur +10 %).

Diese RQ prueft, ob die Audit-Bundle-Wirkung auf claim-office in derselben Richtung wie auf GoL liegt — oder ob die Mandatory-Procedure-Preamble + Drei-Pfad-Bar auf einer Multi-Iteration-Kata mit echten Mehrdeutigkeiten anders skaliert.

## Workflow-Definition

Identisch zu RQ-1.8 — v6.2-with-why-cleaned (Default-Baseline) vs v6.3-audit-bundle (Default-Baseline + restliche Audit-Bundle-Items aus archiviertem v6.5.1-Audit). Voller Diff:

```
diff -r experiments/workflows/v6.2-with-why-cleaned experiments/workflows/v6.3-audit-bundle
```

Detail-Begruendungen in `experiments/workflows/v6.3-audit-bundle/CHANGES.md`.

## Hypothesen

- **H1 (Korrektheit)** — Beide Workflows ≥ 95 % `verification_pct` im Mittel. Audit-Bundle darf nicht regredieren. Anker-Spezifisch: in RQ-1.6 lag v6.2-with-why-cleaned bei Mean 0.96; v6.3 wird in derselben Region erwartet.
- **H2 (tests_passed_immediately faellt)** — Identisches Pattern wie auf GoL: v6.3 zeigt ≤ 1 Lauf mit vorzeitigem Green; v6.2 zeigt staerkere Variabilitaet (claim-office hat mehr Mehrdeutigkeits-Test-Schritte, also potentiell mehr Gelegenheiten zum Ueber-Implementieren).
- **H3 (Refactorings-Disziplin)** — `refactorings_applied` steigt um mindestens 10 % bei deutlicher σ-Reduktion. Auf claim-office (mehr Iterations als GoL) koennte der Effekt staerker sein als die +10 % auf GoL.
- **H4 (Kosten)** — +15–20 % Tokens erwartet (parallel RQ-1.8). Wallclock: ungewiss — wenn die GoL-Wallclock-Neutralitaet durch eingesparte vorzeitige-Green-Detours getrieben war, koennte derselbe Mechanismus auf claim-office ebenfalls greifen. Wenn nicht, +15 % wie in der RQ-audit-Praezedenz.
- **H5 (Kata-Spezifisches Kippen)** — Falsifizierer: wenn das Audit-Bundle auf claim-office Korrektheit kostet (z.B. weil das Backfill-Verbot in "Wrong Predictions Are Data" den Agenten bei echten Mehrdeutigkeits-Predictions destabilisiert), waere das Bundle nicht auf claim-office promotbar — v6.3 bliebe GoL-spezifischer Code-Quality-Champion ohne Default-Baseline-Status.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen, beide example-mapping
Kontrolle: model            — opus-4-7-portkey-no-thinking
Kontrolle: kata_base        — claim-office

Zellen:    2 (2 Workflows × 1 Kata)
Replikate: n = 8 je Zelle (matched RQ-1.6)
Runs:      16 total (8 v6.2 aus RQ-1.6-Pool + 8 neue v6.3)
```

Replikate-Anzahl n=8 statt n=10 wie in RQ-1.8, weil claim-office mit ~37 min/Run deutlich teurer ist als GoL (~10 min/Run) und n=8 in RQ-1.6 fuer den Cleanup-Effekt schon eindeutige Aussagen geliefert hat. Falls die Daten eine starke Aussage stuetzen (z.B. eindeutiger Korrektheits-Bruch oder Korrektheits-Plus), kann auf n=10 erweitert werden.

Wegen der laengeren Sessions auf claim-office: single-shard oder maximal 2 Shards (Memory `portkey-shards-external-cut-risk` — 3+ parallele Portkey-Shards mit Opus 4.7 × claim-office koennen Sessions extern abschneiden).

## Caveats

- **Bundle, nicht isolierte Effekte** — wie in RQ-1.8: bei positivem Bundle-Befund bleibt offen, welche Klasse traegt (Klasse 2 Rationales vs Klasse 3 Red-Hardening). Folge-RQs moeglich.
- **claim-office-Korrektheit ist nicht saturiert** — anders als GoL kann v6.3 hier auch nach unten brechen (vgl. RQ-1.4: Reduktionen brachen Korrektheit auf derselben Kata). H1 ist nicht Sanity, sondern echte Differenzierung.
- **n=8 ist knapp fuer σ-Aussagen** — der σ-Schrumpf-Befund aus RQ-1.8 (`refactorings_applied` σ um Faktor 0.36) braucht n≥10 fuer stabile σ-Vergleiche. n=8 ist ausreichend fuer Mittelwert + Richtungs-Aussage, nicht fuer prazise σ-Reduktion.
- **predictions_correct_rate-Interpretation** — wenn auf claim-office (mit echten Mehrdeutigkeiten) v6.3 deutlich unter v6.2 liegt, ist die Lesart aus RQ-1.8 ("Wrong-Predictions-Block macht ehrliche Falsch-Predictions sichtbar") nicht automatisch uebertragbar. Auf claim-office koennte es auch Disziplin-Verlust bedeuten — das braucht Pro-Run-Inspektion.

## Findings

Siehe [findings.md](findings.md) (folgt nach Batch-Lauf).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.2-with-why-cleaned, v6.3-audit-bundle}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

v6.2-Baseline-Pool aus RQ-1.6 (n=8) wiederverwendbar; ~8 neue v6.3-Runs noetig.

## Quellen

- Vorlaufs-RQ auf GoL: [RQ-1.8](../1.8-audit-bundle-effect-v62/findings.md) — Audit-Bundle-Effekt isoliert auf v6.2-Basis.
- Baseline-RQ: [RQ-1.6](../1.6-v62-cleanup-validation-v61-with-why/findings.md) — v6.2 als Default etabliert auf claim-office.
- Reduktions-Kippen-Praezedenz: [RQ-1.4](../1.4-pep-emoji-claim-office/findings.md) — Reduktionen auf claim-office brechen Korrektheit.
- v6.3-Workflow-Diff: `experiments/workflows/v6.3-audit-bundle/CHANGES.md`.
