# Complete the metric registry

Status: done
Source: [site data export](2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

The site data export stops when a declared outcome has no entry in `experiments/metrics-registry.yaml`. After the superseded discipline outcomes left the RQs, the main RQs still declared 36 metrics without an entry, in 41 of 46 RQs. Every metric an RQ may declare gets an entry; outcomes that were never collected or that only split an aggregate leave the RQs.

## Built

`experiments/metrics-registry.yaml` has 64 entries; every outcome a main RQ declares has one, and the site data export runs on the real data (46 RQ files, 49 workflow descriptions). Only consolidated metrics are rated: in TDD discipline `tdd_discipline` and `predictions_correct_rate`, every component and count is informative. Sub-metrics such as `verification_passed`/`_total` and `predictions_correct`/`_total` stay available as informative for an RQ that wants them. New groups: Size (all informative; Code Mass stays the meaningful size) and Test quality (`mutation_score` now higher). The smell sub-counters left the outcomes of 18 RQs, leaving `smell_total`; the four never-collected names left RQ-tdd-effect-code-quality. Stacks stay uncompared by RQ design; no flag was built.

The site follows with `exact-coding`: a rated, boundary-comparable metric (`predictions_correct_rate`) keeps its trophy, an informative TDD component (`red_batch_max`) gets none, and Size and Test quality get their own group headers (84 tests).
