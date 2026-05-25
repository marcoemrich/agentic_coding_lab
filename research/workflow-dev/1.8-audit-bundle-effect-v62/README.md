---
id: RQ-audit-bundle-v62
question: "Reproduziert das Audit-Bundle (Rationale-Ergaenzungen + Red-Phase-Hardening) auf der v6.2-with-why-cleaned-Basis die in der archivierten RQ-audit gegen v6.5-lean gemessenen Effekte (Disziplin-Plus, Streuungs-Schrumpf, Token/Wallclock-Aufschlag bei Korrektheits-Erhalt)?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # Baseline (aktuelle Default-Basis aus RQ-1.6)
    - {workflow: v6.3-audit-bundle,     prompt: example-mapping}  # + Klasse-2-Rationales + Klasse-3-Red-Hardening
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: game-of-life
outcomes:
  # primaer: TDD-Disziplin (die Klasse-3-Aenderungen zielen direkt auf Red-Phase-Disziplin)
  - tests_passed_immediately
  - refactorings_applied
  - predictions_correct_rate
  - cycle_count
  # Code-Qualitaet (Sanity: Bundle darf nicht verschlechtern)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # Korrektheit (Sanity)
  - tests_passing
  - completed_within_budget
  # Kosten (Bundle ergaenzt netto Text; Aufschlag erwartet)
  - duration_seconds
  - total_tokens
min_replicates: 10
status: aktiv
---

# RQ-1.8: v6.3-audit-bundle vs v6.2-with-why-cleaned (game-of-life)

Reproduziert das Audit-Bundle die in der archivierten [RQ-audit](../../_archive/workflow-dev-v1/3.1-orchestration-audit/findings.md) gegen v6.5-lean gemessenen Effekte, wenn es stattdessen auf v6.2-with-why-cleaned aufgesetzt wird?

## Motivation

Die archivierte RQ-audit (n=10, opus-4-7-no-thinking, GoL-example-mapping) hat fuer das Audit-Bundle gegenueber v6.5-lean klare Effekte gezeigt:

- `tests_passed_immediately` 1.4 ± 2.27 → **0 ± 0** (Mandatory-Procedure-Preamble eliminiert vorzeitige Green-States).
- `refactorings_applied` 6.9 ± 2.33 → 7.8 ± 0.42 (Refactor-Rationale + konkreter Bar; σ −82 %).
- Code-Qualitaet innerhalb 1 σ, Smell-Floor sauber 2.0 ± 0.
- Kosten: +15 % Tokens, +16 % Wallclock.
- σ schrumpft fast ueberall (Workflow wird deutlich planbarer).

Diese Effekte sind aber **bundle-gemessen gegen die archivierte v6.5-lean-Linie** — eine Linie, die ihrerseits andere Reduktionen mitbringt (PEP raus, Emojis raus, MUSTs reduziert) und auf claim-office korrektheits-defekt war (siehe Memory `v6-rebuild-new-base`, `v6.5-correctness-setback`).

Die aktuelle Default-Basis ist `v6.2-with-why-cleaned` (RQ-1.6). Auf dieser Basis sind drei Klassen der Audit-Aenderungen noch nicht eingebaut:

- **Klasse 2 — Rationale-Ergaenzungen:** measurement-pipeline-Rationale fuer Pflicht-Refactoring, Bisectability-Rationale fuer ONE-at-a-time, konkreter Drei-Pfad-Bar fuer "no improvement possible", Green-Phase-Generalization-Rationale in test-list Step 3.
- **Klasse 3 — Red-Phase-Hardening:** Mandatory-Procedure-Preamble, Streichung der "STOP and explain"-Klauseln in Steps 3/6, Ersatz des "Prediction Failure Protocol"-Blocks durch "Wrong Predictions Are Data" (Verbot von retroaktivem Backfilling).
- **Klasse 4 — Agent-Decoupling:** bereits in v6.2 angekommen (refactor.md ist rollenneutral), nicht erneut adressiert.
- **Mechanism-Alignment (commands→skills):** v6-Linien-Entscheidung, bewusst nicht uebernommen (siehe `workflow-construction.md`).

Diese RQ misst die Klasse-2-+-Klasse-3-Wirkung **isoliert auf der v6.2-Basis** — ohne die in v6.5-lean enthaltenen weiteren Reduktionen. Damit wird die Frage beantwortet: **Ist das Audit-Bundle eine eigenstaendige Verbesserung der aktuellen Default-Basis, oder war der RQ-audit-Effekt nur die Reparatur einer kaputten v6.5-lean-Basis?**

## Workflow-Definition

- **v6.2-with-why-cleaned (Baseline)** — aktuelle Default-Basis aus RQ-1.6. Why-Bloecke + Hygiene-Cleanups, ansonsten volle MUST/CRITICAL-Imperative + PEP + Emoji.
- **v6.3-audit-bundle (neu)** — v6.2 + Klasse-2-Rationales + Klasse-3-Red-Hardening + opt-in `HUMAN-IN-THE-LOOP.md`-Profil (im Workflow-Root, nicht in `.claude/rules/`, daher kein Auto-Load und kein Mess-Effekt im autonomen Default).

Voller Diff: `diff -r experiments/workflows/v6.2-with-why-cleaned experiments/workflows/v6.3-audit-bundle`. Detail-Begruendungen in `experiments/workflows/v6.3-audit-bundle/CHANGES.md`.

## Hypothesen

- **H1 (Disziplin)** — Die in RQ-audit auf v6.5-lean gemessenen Disziplin-Effekte reproduzieren in derselben Richtung auf der v6.2-Basis: `tests_passed_immediately` faellt (Preamble-Wirkung), `refactorings_applied` steigt mit deutlich engerer Streuung (Rationale + Drei-Pfad-Bar). Effektgroesse darf kleiner sein als bei der v6.5-lean-Reparatur, da v6.2 schon Why-Bloecke mitbringt.
- **H2 (Korrektheit)** — Beide Workflows ≥ 95 % `tests_passing`. Audit-Bundle darf auf GoL nicht regredieren.
- **H3 (Code-Qualitaet neutral)** — `code_mass`, `cc_longest_function`, `cognitive_max`, `mccabe_max` liegen je innerhalb 1 σ der v6.2-Streuung. Smell-Floor (sofern bei v6.2 noch nicht bei 2.0) verschiebt sich Richtung 2.0.
- **H4 (Kosten)** — Audit-Bundle ergaenzt netto Text → +10–20 % Tokens und Wallclock erwartet, parallel zur RQ-audit-Beobachtung (+15 % / +16 %).
- **H5 (Streuungs-Schrumpf)** — Die in RQ-audit fast ueberall beobachtete σ-Reduktion repliziert. Wenn `cycle_count`-σ und `refactorings_applied`-σ deutlich sinken, ist die Hardening-Wirkung bestaetigt; wenn nicht, ist die σ-Reduktion in RQ-audit ein v6.5-lean-Reparatur-Artefakt gewesen.
- **H0 (Falsifizierer)** — Wenn auf der bereits-MUST/PEP-tragenden v6.2-Basis keiner der Disziplin-Effekte messbar wird, ist das Audit-Bundle empirisch redundant zur MUST/Emoji/PEP-Lage. In dem Fall bleibt v6.2 die Default-Basis; v6.3 wird nicht promotet.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen, beide example-mapping
Kontrolle: model            — opus-4-7-portkey-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows × 1 Kata)
Replikate: n = 10 je Zelle
Runs:      20 total
```

Replikate-Anzahl n=10 spiegelt die RQ-audit-Praezedenz und liegt ueber dem RQ-1.7-n=5 (siehe Memory `replicates-n-reliability`: n=5 fuer Sanity, n≥7 fuer mittleres Feld, n=10 fuer enge σ-Vergleiche, die hier zentral sind).

Single-shard sequenziell, parallel als 2 Container OK (GoL kurze Sessions, kein nennenswertes Portkey-Cut-Risiko, vgl. Memory `portkey-shards-external-cut-risk`).

## Caveats

- **Bundle, nicht isolierte Effekte** — vier Item-Klassen werden gleichzeitig importiert (Mission-Rationale, Drei-Pfad-Bar, Step-4-Bisectability, test-list-Step-3-Rationale, Red-Preamble, STOP-Streichung, Wrong-Predictions-Block). Bei positivem Bundle-Befund bleibt offen, welcher Anteil traegt. Folge-RQs (Klasse-2-only vs Klasse-3-only) sind moeglich, falls Bundle-Effekt eintritt.
- **Single Kata, single Modell** — `game-of-life-example-mapping × opus-4-7-portkey-no-thinking`. Cross-Kata-Validierung auf `claim-office-example-mapping` als Folge-RQ, falls v6.3 promotet wird (siehe RQ-1.6-Befund: refactor.md-Entkopplung wirkt auf claim-office staerker als auf GoL).
- **GoL-Korrektheit ist saturiert** — beide Workflows duerften nahe 100 % `tests_passing` liegen. H2 ist Sanity, nicht Differenzierung. Wenn der Bundle-Effekt nur durch Korrektheitsverlust erkauft wird, taeuscht der GoL-Befund — claim-office ist dann zwingend.
- **v6.2-Basis bringt schon Why-Bloecke** — die Klasse-2-Rationales sind teilweise additiv zur v6.1-with-why-Wirkung. Wenn die v6.1-with-why-Why-Bloecke bereits den groessten Teil der Rationale-Wirkung tragen, ist mit kleineren Effekt-Groessen als in RQ-audit (die gegen v6.5-lean ohne Why-Vollausbau lief) zu rechnen.
- **HITL.md ist opt-in und auto-load-frei** — die im Default-Run gemessene v6.3 enthaelt keine HITL-Mechanik. Wenn spaeter ein HITL-Vergleich gewuenscht ist, braucht es eine separate Variante (`v6.3-hitl`) und einen eigenen RQ.

## Findings

Siehe [findings.md](findings.md) (folgt nach Batch-Lauf).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.2-with-why-cleaned, v6.3-audit-bundle}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.

v6.2-Baseline-Runs liegen aus RQ-1.7 bereits (n=5) vor; n=10 bedeutet ggf. +5 Refill-Runs auf v6.2 plus 10 neue Runs auf v6.3.

## Quellen

- Archivierte Praezedenz: [RQ-audit](../../_archive/workflow-dev-v1/3.1-orchestration-audit/) — Bundle gegen v6.5-lean.
- v6.3-Workflow-Diff: `experiments/workflows/v6.3-audit-bundle/CHANGES.md`.
- HITL-Profil: `experiments/workflows/v6.3-audit-bundle/HUMAN-IN-THE-LOOP.md`.
- Baseline-RQ: [RQ-1.6](../1.6-v62-cleanup-validation-v61-with-why/findings.md) (v6.2 als Default etabliert).
