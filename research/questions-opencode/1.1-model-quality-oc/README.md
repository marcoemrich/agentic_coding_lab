---
id: RQ-model-quality-oc
question: "Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle (Opus 4.7 via Portkey + vier Nicht-Anthropic-Modelle aus dem Portkey-Catalog) in Code-Qualität und TDD-Disziplin auf game-of-life-example-mapping mit dem v5.1-testlist-scope-fix-oc-Workflow?"
factors:
  model:
    - opus-4-7-portkey
    - kimi-k2-6
    - minimax-m2-7
    - gemini-2-5-pro
    - gemini-3-5-flash
controls:
  workflow: v5.1-testlist-scope-fix-oc
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primär: Code-Qualität (game-of-life trägt das Code-Qualitäts-Signal)
  - code_mass
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - lines_of_code
  - smell_total
  - smell_complexity
  - smell_magic_numbers
  - smell_duplication
  # sekundär: Korrektheit (innen — game-of-life hat keine externe Suite)
  - tests_passing
  - tests_total
  # tertiär: TDD-Disziplin (jetzt verfügbar dank v5.1-oc + parse_opencode_transcript)
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # Kontext
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-model-quality-oc: Modell-Effekt auf Code-Qualität (OpenCode-Harness)

## Motivation

Mit OpenCode als zweitem Harness werden Modelle erreichbar, die über Claude Code nicht laufen — Kimi K2, MiniMax M2, Gemini 2.5 Pro, Gemini 3.5 Flash (alle via Portkey, OpenRouter/Vertex-Backends). Opus 4.7 läuft auf beiden Harnessen und dient hier als Anker.

Diese RQ misst den **Modell-Effekt auf Code-Qualität und TDD-Disziplin** in einem harness-konstanten Setting (alle Zellen OpenCode, alle gleicher Workflow, alle gleiche Kata). Sie ist das **direkte Pendant** zum bestehenden RQ-model-quality (Claude-Code-Seite, v4-exact-subagents × example-mapping) — aber mit v5.1-Workflow statt v4 (OpenCode hat keinen sauberen Subagent-Equivalent, v5.1 ist das ehrlichste TDD-Pendant). Workflow-Unterschied muss bei Findings-Vergleichen explizit benannt werden, KEIN 1:1-Transfer.

`game-of-life-example-mapping` als Kata: trägt das Code-Qualitäts-Signal (`smell_total`, `cognitive_max`, etc. differenzieren) UND ist mit v5.1's TDD-Mechanik example-mapping-kompatibel (v5 erlaubt alle drei Prompt-Stile). claim-office wird parallel in RQ-model-novel-kata-oc untersucht (Korrektheit als primärer Outcome).

## Vorhandene Daten

- **Stand 2026-05-25**: Keine Runs für irgendeine Zelle dieser RQ. Erstbatch komplett offen.
- v1-Skeleton-Smokes (claim-office × v1-oneshot-oc) zählen NICHT — anderer Workflow und andere Kata.
- v5.1-oc-Smoke (claim-office × v5.1-testlist-scope-fix-oc × opus) hat gezeigt: v5.1-oc liefert verification_pct=1.0, cycle_count >= 2, refactorings >= 1, predictions_correct 4/4 (100%). Mechanik funktioniert.

## Hypothesen

- **H1 (Opus-Anker)**: opus-4-7-portkey liefert die niedrigsten Werte bei `cognitive_max` und `smell_total` — bestätigt, dass das Opus-4.7-Niveau via OpenCode-Routing erhalten bleibt (sonst ist OC-Harness wertloser Confound).
- **H2 (Nicht-Anthropic-Spreizung)**: Die vier Nicht-Anthropic-Modelle (Kimi, MiniMax, beide Gemini) zeigen eine messbare Spreizung über `smell_total` und `cognitive_max` — d.h. der OpenCode-Harness ist diskriminationsfähig genug, um Modell-Unterschiede sichtbar zu machen.
- **H3 (Flash vs Pro innerhalb Gemini)**: gemini-3-5-flash liegt bei `code_mass` und `smell_total` schlechter als gemini-2-5-pro — der erwartete Flash-vs-Pro-Trade-off zeigt sich auch im OpenCode-Setup.
- **H4 (Skill-Tool-Compliance modellabhängig)**: `cycle_count` und `refactorings_applied` zeigen über die fünf Modelle Spreizung — manche Modelle nutzen den `skill`-Tool diszipliniert, andere driften nach 1-2 Cycles in inline-Mode (siehe Skeleton-Befund). Niedriger cycle_count ist NICHT automatisch schwächere TDD-Disziplin, sondern auch Compliance mit der Skill-Affordance.

## Methodologische Anmerkungen

- Alle fünf Modelle laufen via Portkey, aber mit unterschiedlichen Backprovidern (Vertex EU für Opus, Vertex für Gemini, OpenRouter für Kimi/MiniMax). Backprovider-Routing-Effekte sind in den Lab-Variant-IDs implizit gepinnt; ein wechselnder Backprovider würde eine neue Lab-Variant brauchen.
- `n=5` per Cell folgt Memory [[replicates-n-reliability]] (Default für mittleres Feld).
- v5.1-Workflow erzwingt Test-First-TDD mit `skill`-Tool-Aufrufen. Beobachtbare Drift in `cycle_count` (Skeleton: nur 2 von ~18 Cycles via Skill-Tool erfasst) ist eine Workflow-Compliance-Eigenschaft, kein Parser-Bug. Bei Findings unterscheiden: "Modell A hat höhere TDD-Disziplin" ≠ "Modell A nutzt den Skill-Tool öfter".
- TDD-Disziplin-Metriken (`cycle_count`, `predictions_*`, `refactorings_applied`) sind dank `parse_opencode_transcript.py` ab 2026-05-25 für OC-Runs verfügbar.
