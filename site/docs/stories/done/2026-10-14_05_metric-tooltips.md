# Metric tooltips

Status: done
Source: the user's decision on 2026-10-14 about readable column names: the headers keep the metric ids and gain a tooltip instead.

## Story

Each metric column header keeps its metric id and explains the metric in one short sentence on hover, so outsiders can read a table without the README.

## Built

Implemented with the `exact-coding` skill; three new tests, 124 Vitest tests in all. Every entry in `experiments/metrics-registry.yaml` has a `description:`, one sentence written for readers outside the lab and derived from README "Metrics", the glossary in `generate-snapshot-skeleton.py`, `analyze-run.sh` (`cli_built`, `lines_of_code`) and `docker/run-batch.sh` (the `tcr_*_commits`). No direction in the sentence, because the header's arrow already gives it. `src/metric-registry.spec.ts` requires a description ending in a full stop for every registry metric. `headerTooltip()` in `ResultTable.tsx` puts the sentence in the header's `title`; a test-list-boundary metric keeps its warning on a second line (`⚠ not comparable across the test-list boundary: …`).

One existing test changed its wording, not its claim: "leaves predictions_correct_rate unflagged" had checked "no warning" as "no title"; it now checks that the title holds no boundary warning.
