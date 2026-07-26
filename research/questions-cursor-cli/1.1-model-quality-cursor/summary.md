# RQ-model-quality-cursor — Summary

**Status: offen (n=0).** cursor-cli-Harness noch nicht verdrahtet (Walking Skeleton).

| | |
|---|---|
| **Frage** | Modell-Effekt (Opus / Composer / Grok) auf Code-Qualität & TDD-Disziplin über den cursor-cli-Harness |
| **Kata** | game-of-life-example-mapping |
| **Workflow** | v6.2.1-phase-continuation-cursor (von v6.2.1-pi abgeleitet, Refactor inline) |
| **Harness** | cursor-cli (`cursor-agent`), Auth `CURSOR_API_KEY` |
| **Zellen** | 3 (opus-cursor, composer-cursor, grok-cursor) — Lab-Variant-IDs vorläufig |
| **Runs** | 0 / 15 (n=5 pro Zelle geplant) |
| **Primär-Outcomes** | `smell_total`, `cognitive_max`, `mccabe_max` (kleiner = besser), gegated durch `tests_passing` |

## Nächste Schritte

1. `cursor-agent --help` / Smoke-Test → reale `--model`-Strings + JSON-Schema.
2. Fünf Harness-Bausteine bauen (siehe [Subtree-README](../README.md#die-fünf-harness-bausteine-analog-pi)).
3. cursor-cli-Workflow mit `.cursor/`-Marker anlegen.
4. Erstbatch via `/run-rq RQ-model-quality-cursor`.
