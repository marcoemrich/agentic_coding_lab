---
id: RQ-model-quality-oc
question: "Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle (Opus 4.7 via Portkey + vier Nicht-Anthropic-Modelle aus dem Portkey-Catalog) in Code-Qualität auf game-of-life-prose mit dem v1-oneshot-oc-Workflow?"
factors:
  model:
    - opus-4-7-portkey
    - kimi-k2-6
    - minimax-m2-7
    - gemini-2-5-pro
    - gemini-3-5-flash
controls:
  workflow: v1-oneshot-oc
  kata_base: game-of-life
  prompt: prose
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

Diese RQ misst den **Modell-Effekt auf Code-Qualität** in einem harness-konstanten Setting (alle Zellen OpenCode, alle gleicher Workflow, alle gleiche Kata). Sie ist das **direkte Pendant** zum bestehenden RQ-model-quality (Claude-Code-Seite), aber mit anderem Workflow (v1 statt v4) und anderem Prompt-Stil (prose statt example-mapping) — daher KEIN 1:1-Transfer der Befunde.

`game-of-life-prose` als Kata, weil sie unter den aktiven Katas das Code-Qualitäts-Signal trägt (`smell_total`, `cognitive_max`, etc. differenzieren). claim-office-prose wird parallel in RQ-model-novel-kata-oc untersucht (Korrektheit als primärer Outcome).

## Vorhandene Daten

- **Stand 2026-05-25**: Keine Runs für irgendeine Zelle dieser RQ. Erstbatch komplett offen.
- Smoke-Runs mit v1-oneshot-oc existieren nur auf claim-office, nicht auf game-of-life — also keine Vorab-Beobachtungen.

## Hypothesen

- **H1 (Opus-Anker)**: opus-4-7-portkey liefert die niedrigsten Werte bei `cognitive_max` und `smell_total` — bestätigt, dass das Opus-4.7-Niveau via OpenCode-Routing erhalten bleibt (sonst ist OC-Harness wertloser Confound).
- **H2 (Nicht-Anthropic-Spreizung)**: Die vier Nicht-Anthropic-Modelle (Kimi, MiniMax, beide Gemini) zeigen eine messbare Spreizung über `smell_total` und `cognitive_max` — d.h. der OpenCode-Harness ist diskriminationsfähig genug, um Modell-Unterschiede sichtbar zu machen.
- **H3 (Flash vs Pro innerhalb Gemini)**: gemini-3-5-flash liegt bei `code_mass` und `smell_total` schlechter als gemini-2-5-pro — der erwartete Flash-vs-Pro-Trade-off zeigt sich auch im OpenCode-Setup.

## Methodologische Anmerkungen

- v1-oneshot-oc liefert keine TDD-Disziplin-Metriken (`cycle_count`, `predictions_*`, `refactorings`) — diese bleiben 0 und sind aus den Outcomes ausgeklammert.
- Alle fünf Modelle laufen via Portkey, aber mit unterschiedlichen Backprovidern (Vertex EU für Opus, Vertex für Gemini, OpenRouter für Kimi/MiniMax). Backprovider-Routing-Effekte sind in den Lab-Variant-IDs implizit gepinnt; ein wechselnder Backprovider würde eine neue Lab-Variant brauchen.
- `n=5` per Cell folgt Memory [[replicates-n-reliability]] (Default für mittleres Feld).
