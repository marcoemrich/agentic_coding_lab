---
id: RQ-7
question: "Wirkt sich dedizierte Subagents-pro-Phase (v4) gegenüber Single-Context (v5) auf Code-Qualität und TDD-Disziplin aus, bei sonst identischem Phasen-Skript?"
factors:
  workflow: [v4-exact-subagents, v5-exact-single-context]
  kata_base: [claim-office, game-of-life]
controls:
  prompt: example-mapping
  model: opus-4-7-no-thinking
outcomes:
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - cc_loc
  - code_mass
  - cc_avg_loc_per_function
  - cc_longest_function
  - smell_total
  - smell_complexity
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_correct_rate
  - tests_passed_immediately
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-7: Subagents-Effekt (v4 vs v5)

v4-exact-subagents und v5-exact-single-context teilen sich **denselben
Phasen-Skript-Inhalt** (Predictor + Red + Green + Refactor mit gleichen
Regeln). Der einzige systematische Unterschied:

| | v4-exact-subagents | v5-exact-single-context |
|---|---|---|
| Phase = | dedizierter Subagent (eigener Kontext, frischer System-Prompt) | Phase im selben Konversations-Kontext |
| Kontext-Übergang | Subagent-Spawn, isoliert | nahtlos, gleiche History |
| Token-Profil | mehr (jeder Subagent liest Prompt-Inputs neu) | weniger (kumulativ) |

Die Frage: **Macht das Aufsplitten in Subagents einen messbaren
Unterschied** — auf Code-Qualität (smell_total, cc_longest_function),
TDD-Disziplin (predictions_correct, refactorings_applied) und Effizienz
(duration_seconds, total_tokens)?

## Forschungsmotivation

Subagents-pro-Phase haben zwei plausible, gegenläufige Effekte:

1. **Pro Subagents**: jeder Phasen-Schritt startet mit fokussiertem
   Kontext, keine Drift aus vorherigen Phasen, härtere
   Phasen-Disziplin.
2. **Contra Subagents**: jeder Phasenwechsel kostet Re-Establishment
   des Kontexts (Code lesen, State rekonstruieren), möglicher Verlust
   von Mikro-Entscheidungen aus vorheriger Phase, höhere Token-Kosten.

Die Beobachtung aus dem ersten claim-office-Run-Block legt nahe, dass
v4 deutlich aufwendiger ist (~58 min vs ~5 min für v3), bei gleicher
verification_pct, aber sehr niedrigerem `smell_total` (2 vs ~17–20)
und kompakterem `cc_loc` (28 vs ~100–125). Diese RQ verifiziert das
Muster gegen den methodisch sauberen Vergleichspartner v5.

## Design-Begründung

**Single-factor Workflow (v4 vs v5)**: alle anderen Workflow-Aspekte
sind kontrolliert, weil v4 und v5 inhaltlich denselben Skript haben.

**Prompt = example-mapping**: für TDD-Workflows der Default-Stil
(siehe Methoden-Constraint), maximale Test-Anker-Information.

**Beide Katas (claim-office + game-of-life)**: claim-office liefert
das Korrektheits-Signal (verification_pct, dort sind Mehrdeutigkeiten),
game-of-life liefert das Code-Qualitäts-Signal (smell_total,
cc_longest_function differenzieren dort).

**Single Model (opus-4-7-no-thinking)**: hält RQ-7 single-factor in
Modell-Dimension.

## Untersuchte Hypothesen

- H1: v4 produziert weniger `code_mass` und `smell_total` als v5
  (frischer Kontext pro Phase → kompaktere Implementierung,
  diszipliniertere Refactor-Phase).
- H2: v4 zeigt höhere `predictions_correct_rate` als v5 (Predictor-
  Subagent kann nicht von vorheriger Konversation lecken).
- H3: v4 braucht deutlich mehr `duration_seconds` und `total_tokens`
  als v5 (mehrfaches Kontext-Re-Establishment).
- H4: `verification_pct` ist zwischen v4 und v5 vergleichbar — das
  Skript bestimmt die Korrektheit, nicht die Subagent-Topologie.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v4-exact-subagents, v5-exact-single-context}`,
`prompt=example-mapping`,
`model=opus-4-7-no-thinking`,
`kata ∈ {claim-office-example-mapping, game-of-life-example-mapping}`.

Aktuelle Datenbasis (Stand 2026-05-09):
- claim-office × v4: 1 Run vorhanden, 2 ausstehend (laufender Batch
  enthält v4-Slots für andere Modelle, aber nur 1 weiteren no-thinking-
  Run; 2 Nachzieh-Runs nötig).
- claim-office × v5: 3 Runs ausstehend (im laufenden Batch enthalten).
- game-of-life × v4 / v5: aus den smart-subset / game-of-life-fair-
  Batches abgedeckt.
