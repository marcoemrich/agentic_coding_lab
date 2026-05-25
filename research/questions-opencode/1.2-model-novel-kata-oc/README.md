---
id: RQ-model-novel-oc
question: "Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle in Korrektheit und TDD-Disziplin auf claim-office-example-mapping mit dem v5.1-testlist-scope-fix-oc-Workflow?"
factors:
  model:
    - opus-4-7-portkey
    - kimi-k2-6
    - minimax-m2-7
    - gemini-2-5-pro
    - gemini-3-5-flash
controls:
  workflow: v5.1-testlist-scope-fix-oc
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primär: Korrektheit außen (claim-office hat externe Verification-Suite)
  - verification_pct
  - verification_passed
  - verification_total
  # sekundär: Code-Qualität
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # tertiär: TDD-Disziplin (v5.1-oc liefert diese dank parse_opencode_transcript)
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # Kontext
  - tests_passing
  - tests_total
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-model-novel-oc: Modell-Effekt auf novel Kata (OpenCode-Harness)

## Motivation

Parallel zu RQ-model-quality-oc (game-of-life, Code-Qualität), aber auf der härteren Achse: **Spec-Verstehen und Vollständigkeit der Implementierung**. `claim-office-example-mapping` ist eine novel Kata mit fünf bewusst konstruierten Mehrdeutigkeiten und einer externen Verification-Suite (15 Szenarien) — keine reine Training-Recall-Übung wie game-of-life.

RQ-model-novel (CC-Seite) hat gezeigt, dass `verification_pct` auf claim-office Modelle stärker differenziert als jede Code-Qualitäts-Metrik auf game-of-life. Diese RQ überträgt den Test auf die OpenCode-Seite mit fünf neuen Modellen und dem v5.1-Workflow (TDD mit Skills).

## Vorhandene Daten

- **opus-4-7-portkey × v5.1-testlist-scope-fix-oc × claim-office-example-mapping**: n=1 aus Skeleton-Smoke 2026-05-25 mit `verification_pct=1.00` (15/15 perfekt). Counted für `min_replicates`.
- v1-Smokes (claim-office × v1-oneshot-oc × opus-4-7-portkey, n=2 mit verification_pct ≈ 0.20) zählen NICHT für diese RQ (anderer Workflow).
- Alle anderen Zellen offen.

## Hypothesen

- **H1 (v5.1-Workflow hebt OC-Niveau)**: opus-4-7-portkey × v5.1-oc × claim-office-EM erreicht `verification_pct` deutlich über dem v1-oneshot-oc-Niveau (0.20) — der Skeleton-Run mit 1.0 ist konsistent damit. Erwartung: mean >= 0.8 über n=5.
- **H2 (Modell-Spreizung sichtbar)**: Die fünf Modelle zeigen über `verification_pct` eine größere Spreizung als ihre Code-Qualitäts-Spreizung auf game-of-life — claim-office exponiert Spec-Verstehen, das auf trainings-vertrauten Katas verdeckt bleibt.
- **H3 (Flash schwach auf Korrektheit)**: gemini-3-5-flash hat deutlich niedrigere `verification_pct` als gemini-2-5-pro — Spec-Vollständigkeit ist der erste Trade-off, den schnellere/kleinere Modelle einbüßen.
- **H4 (TDD-Disziplin und Korrektheit korrelieren)**: Modelle mit höherem `cycle_count` (mehr Skill-Tool-Aufrufe) zeigen tendenziell höhere `verification_pct`. Hinweis auf Workflow-Compliance als Erfolgsfaktor, nicht nur Modell-Stärke.

## Methodologische Anmerkungen

- Skeleton-Befund `verification_pct=1.0` ist EIN Datenpunkt — Replikate werden zeigen, ob das stabil ist oder Glücksfall. Memory [[replicates-n-reliability]]: n=3 bimodal-erkennend, n=5 für mittlere Sicherheit.
- v5.1-Workflow erzwingt skill-Tool-Aufrufe, aber Agent-Drift nach 1-2 Cycles ist beobachtet (Skeleton: nur 2 Skill-Aufrufe trotz ~18 echter TDD-Cycles). `cycle_count` ist damit konservativ; tatsächliche TDD-Aktivität höher.
- Alle fünf Modelle via Portkey, gemischte Backprovider — siehe RQ-model-quality-oc für Routing-Details.
- Vorhandene v1-oneshot-oc-Smokes auf claim-office (verification 0.20) zeigen den Workflow-Effekt: v1 ohne TDD-Mechanik vs v5.1 mit Skills macht ~50 Prozentpunkte Unterschied bei Opus. Cross-Workflow-Comparison aber Gegenstand einer separaten RQ.
- `cli.ts`-Nudge ist für OC NICHT verdrahtet. Falls Nicht-Anthropic-Modelle systematisch `src/cli.ts` vergessen → `verification_pct=null`. AGENTS.md verlangt cli.ts explizit; v5.1-Smoke hat funktioniert. Beobachten beim ersten Batch.
