---
id: RQ-model-novel-oc
question: "Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle in Korrektheit und TDD-Disziplin auf claim-office-example-mapping mit dem v5.1-testlist-scope-fix-oc-Workflow?"
factors:
  model:
    - opus-4-7-portkey
    - kimi-k2-6
    - minimax-m2-7
    - gemini-3-5-flash
    - glm-5-1
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

## Vorhandene Daten (Stand 2026-05-25)

Aus Routing-Smokes vorhanden (n=1 pro Zelle, counten für `min_replicates`):

| Modell | verification_pct | tests | cycles | preds | done | Wallclock |
|---|---|---|---|---|---|---|
| opus-4-7-portkey | 1.00 (15/15) | 36 | 2 | 4/4 | ✓ | 12 min |
| kimi-k2-6 | 1.00 (15/15) | 46 | 3 | 0/0 | ✓ | 32 min |
| minimax-m2-7 | 0.00 (0/15) | 37 | 1 | 0/2 | ✓ | 35 min |
| gemini-3-5-flash | 1.00 (15/15) | 32 | 2 | 0/0 | ✓ | 8 min |

Bemerkenswert: MiniMax schreibt 37 eigene Tests und macht sie grün, scheitert aber an allen 15 externen Verifikations-Szenarien — klassischer Spec-Misverständnis-Fall, genau der Kata-Mehrdeutigkeits-Effekt wofür claim-office gebaut wurde. Wird sich bei n=5 zeigen ob das systematisch oder Einzelfall ist.

## Modell-Auswahl: warum nur 4 Modelle

Gemini 2.5 Pro wurde am 2026-05-25 aus der RQ entfernt: drei Smoke-Versuche (91s/314s/85s) zeigten konsistent vorzeitigen Abbruch des autonomen Loops nach 1-2 Cycles ohne `experiment-done.txt`. Auch expliziter Continuation-Prompt ("Do NOT stop... continue until experiment-done.txt") änderte nichts — Pro interpretiert ein passierendes `pnpm test` als natürliches Conversation-Ende und stoppt mit empty turn. v5.1-oc-Compatibility-Issue, kein Routing- oder Modell-Stärke-Problem.

## Hypothesen

- **H1 (v5.1-Workflow hebt OC-Niveau)**: opus-4-7-portkey × v5.1-oc × claim-office-EM erreicht `verification_pct` deutlich über dem v1-oneshot-oc-Niveau (0.20) — Skeleton-Befund 1.00 ist konsistent damit. Erwartung: mean >= 0.8 über n=5.
- **H2 (Modell-Spreizung sichtbar)**: Die vier Modelle zeigen über `verification_pct` Spreizung — Smoke deutet bereits an: Opus/Kimi/Flash bei 1.00, MiniMax bei 0.00. Wenn das stabil ist, ist die Spreizung dichotom (15/15 vs 0/15) statt graduell — claim-office als Pass/Fail-Filter für Spec-Verstehen.
- **H3 (Flash überraschend stark)**: gemini-3-5-flash hat im Smoke perfekte Korrektheit (15/15) trotz Flash-Positionierung als "schnelles/kleines" Modell. Bei n=5 prüfen ob das stabil ist oder Glücksfall war (n=1 + bekannt heikle Kata = vorsichtige Interpretation).
- **H4 (TDD-Disziplin und Korrektheit korrelieren NICHT linear)**: Smoke-Befund: Opus 4/4 Predictions + 15/15 Verification; Kimi 0/0 Predictions + 15/15 Verification. Predictions-Format-Compliance ist nicht notwendig für Korrektheit — der TDD-Inhalt (Test-First-Disziplin) wirkt anscheinend unabhängig von der spezifischen Prediction-Marker-Compliance.

## Methodologische Anmerkungen

- Skeleton-Befund `verification_pct=1.0` ist EIN Datenpunkt — Replikate werden zeigen, ob das stabil ist oder Glücksfall. Memory [[replicates-n-reliability]]: n=3 bimodal-erkennend, n=5 für mittlere Sicherheit.
- v5.1-Workflow erzwingt skill-Tool-Aufrufe, aber Agent-Drift nach 1-2 Cycles ist beobachtet (Skeleton: nur 2 Skill-Aufrufe trotz ~18 echter TDD-Cycles). `cycle_count` ist damit konservativ; tatsächliche TDD-Aktivität höher.
- Alle fünf Modelle via Portkey, gemischte Backprovider — siehe RQ-model-quality-oc für Routing-Details.
- Vorhandene v1-oneshot-oc-Smokes auf claim-office (verification 0.20) zeigen den Workflow-Effekt: v1 ohne TDD-Mechanik vs v5.1 mit Skills macht ~50 Prozentpunkte Unterschied bei Opus. Cross-Workflow-Comparison aber Gegenstand einer separaten RQ.
- `cli.ts`-Nudge ist für OC NICHT verdrahtet. Falls Nicht-Anthropic-Modelle systematisch `src/cli.ts` vergessen → `verification_pct=null`. AGENTS.md verlangt cli.ts explizit; v5.1-Smoke hat funktioniert. Beobachten beim ersten Batch.
