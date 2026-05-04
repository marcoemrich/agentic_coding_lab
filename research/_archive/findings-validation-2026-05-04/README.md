# Archiv: Findings-Validation 2026-05-04

Eingefrorener Snapshot der Re-Evaluation der alten 235-Run-Studie auf
Basis der bereinigten 137-Run-Datenbasis (Stand vor Kata-Cleanup).

Dieser Stand wurde am 2026-05-04 archiviert, nachdem die Findings auf
die [aktuellen Forschungsfragen](../../) verteilt und die zugrunde
liegenden Daten (alte `results/`-Aggregationen) verworfen wurden.

## Inhalt

- `findings.md` — Re-Evaluation aller 21 Befunde der alten Studie
  gegen die neuen Daten (`smart-subset`, `game-of-life-fair`,
  `game-of-life-stability`). Status pro Befund: ✅ haltbar / ⚠️
  revidiert / ❌ verworfen / 🚫 nicht prüfbar.
- `old-findings.md` — Originale Aussagen der alten 235-Run-Studie
  (Quelle der re-evaluierten Befunde).
- `experiment-overview-v2.md` — Methoden-Übersicht der alten Studie.

## Mapping auf aktuelle RQs

Die 21 Befunde wurden wie folgt verteilt:

| Alte ID | Aktuelles Finding |
|---|---|
| A1 | [RQ-1 F-1.1](../../RQ-1-workflow-effect/findings.md#f-11) |
| A2 | [RQ-1 F-1.2](../../RQ-1-workflow-effect/findings.md#f-12) |
| A3 + A7 | [RQ-1 F-1.3](../../RQ-1-workflow-effect/findings.md#f-13) |
| A4 + C7 | [RQ-4 F-4.2](../../RQ-4-workflow-model-interaction/findings.md#f-42) |
| A5 | [RQ-4 F-4.3](../../RQ-4-workflow-model-interaction/findings.md#f-43) |
| A6 | [RQ-1 F-1.4](../../RQ-1-workflow-effect/findings.md#f-14) |
| A8 | [RQ-1 F-1.5](../../RQ-1-workflow-effect/findings.md#f-15) |
| A9 | [RQ-1 F-1.6](../../RQ-1-workflow-effect/findings.md#f-16) |
| B1 | [RQ-3 F-3.1](../../RQ-3-model-and-thinking/findings.md#f-31) |
| B2 | [RQ-3 F-3.2](../../RQ-3-model-and-thinking/findings.md#f-32) |
| B3 | [RQ-4 F-4.4](../../RQ-4-workflow-model-interaction/findings.md#f-44) |
| C1 | [RQ-4 F-4.1](../../RQ-4-workflow-model-interaction/findings.md#f-41) |
| C2 + C4 + C5 + C9 | [research/README.md Kata-Constraint](../../README.md#kata-constraint-code-quality-signal-nur-auf-game-of-life) |
| C3 | Pipeline-Bug-Notizen in `MEMORY.md`, kein RQ-Finding |
| C6 | [RQ-1 F-1.7](../../RQ-1-workflow-effect/findings.md#f-17) |
| C8 | [RQ-1 F-1.8](../../RQ-1-workflow-effect/findings.md#f-18) |

## Reproduzierbarkeit

Alle Befunde lassen sich durch Re-Aggregation der bestehenden Runs
mit `experiments/aggregate-by-query.py` auf die jeweiligen RQs
nachbauen. Die alten `results/game-of-life-{fair,stability}/`-CSVs
wurden nach diesem Archivieren verworfen, weil sie aus den
Run-Verzeichnissen jederzeit reproduzierbar sind.
