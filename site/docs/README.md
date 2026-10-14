# Results site — open the lab's data to a wider audience

Status: early idea, scoped from a freeform session on 2026-10-11.
Open questions: [open-questions.md](open-questions.md).

## Problem

1. **Only one person can use the lab.** The data is valuable, but reading it takes knowing
   the repo layout, the RQ frontmatter, the workflow names and the metric caveats. Nobody
   outside can follow it, check it, or correct it.
2. **Findings don't carry the weight.** Generated findings and hypotheses are often slop:
   either observations irrelevant to the decisions at hand, or wrong conclusions because the
   context is too entangled for the generator. Early findings were reworked by hand; as
   that stopped, quality drifted.
3. **What does carry the weight is the RQ itself** — the question, and through it the
   factors, controls and outcomes that decide what is measured and shown. The value is in
   the runs and the data collection.
4. **Presentation is inconsistent across RQs.** Different table layouts; standard deviation
   sometimes inline (`9.88 (σ 5.69)`), sometimes as `mean ± sd`, sometimes its own column;
   metrics as rows in one RQ, as columns in another; trophy rules restated in prose each time.
5. **Workflow evolution is hard to follow.** Workflow names say little, renames add noise.
   It is really a tree of descent, but you can't see where a workflow branched, what changed
   at each step (drop emojis, add why blocks, move refactor into a subagent, …), why a branch
   was discarded. `LINEAGE.yaml` has the parent/child structure but a change description
   (`note:`) only on some edges.

Why it matters: the LLM tooling community builds skills and makes architecture claims
without measuring whether they help. The lab measures. Opening it up is the point —
transparent, reproducible, correctable science. Nothing is to be hidden.

## Two audiences, two use cases

- **Community**: answered general questions — does TDD pay off, what does Example Mapping
  do to the resulting code.
- **Workflow development** (the user harness): after a small skill change, what did it do
  to the metrics. Needs before/after and the workflow tree.

RQs split along the same line: general RQs vs. workflow-development RQs.

## Shape

- The core is the **runs**; **RQs are entry points** (predefined filters over the run pool:
  factors, controls, kata, harness, model, workflow). Only for an RQ is it guaranteed that
  the runs exist.
- Combining several RQs is **not** a goal.
- Time matters on two axes:
  - **Calendar time** — when runs happened, because uncontrolled side effects can creep in
    (e.g. undocumented provider/proxy changes).
  - **Workflow evolution** — the axis that matters for harness development.

## First iteration (deliberately lightweight)

Detailed decisions: [open-questions.md](open-questions.md#decided).

- Static pages on GitHub Pages, generated locally with Astro and React islands. Little
  architectural overhead, zero effort for readers.
- All 46 main RQs (`research/questions-*/`); workflow-development RQs come later.
- Per RQ page: question, factors, controls, and **the table**, formatted consistently.
- **Gaps made visible**: metric not collected at the time vs. combination never run.
- When the runs happened is visible.
- Existing findings (answers, hypotheses) **optionally expandable**, behind a clear warning:
  AI-generated, not human-validated.
- **Workflow descriptions** for every workflow that appears in a table — what it is, what is
  special about it, how it differs from the others — so outsiders can read the comparison.
- Tables only; no drill-down below the cell.

## Progress

Each story has its own file in [`stories/open/`](stories/open/) or
[`stories/done/`](stories/done/), named `<date>_<sequence>_<story-name>.md`. The date
records the source session, not the completion date; the sequence
runs across open and done stories for that date. Open story files
keep their Example Mapping in the same file once discussed; pending mappings are
marked as such. Done stories have no Example Mapping section.

- **Done:** the RQ result table (layout, value formatting, gaps, trophies and
  comparability), built with EXACT Coding in `site/src/`. Its tests are the specification;
  the original Example Mapping was removed once implemented.
  - [Result table layout](stories/done/2026-10-11_01_result-table-layout.md)
  - [Value formatting](stories/done/2026-10-11_02_value-formatting.md)
  - [Gaps and coverage](stories/done/2026-10-11_03_gaps-and-coverage.md)
  - [Trophies and comparability](stories/done/2026-10-11_04_trophies-and-comparability.md)
  - [Site data export](stories/done/2026-10-11_05_site-data-export.md)
- **Done, lab side:**
  - [Exit reason classification](stories/done/2026-10-12_01_exit-reason-classification.md)
  - [Drop completed_within_budget](stories/done/2026-10-12_02_drop-completed-within-budget.md)
  - [Normalise the completed exit reason](stories/done/2026-10-12_03_normalise-completed-exit-reason.md)
  - [Usable-run replicates](stories/done/2026-10-12_05_usable-run-replicates.md)
  - [Python test infrastructure](stories/done/2026-10-12_07_python-test-infrastructure.md)
  - [Complete the metric registry](stories/done/2026-10-12_08_complete-metric-registry.md)
  - [Stable aggregator output](stories/done/2026-10-12_09_stable-aggregator-output.md)
  - [Broken-run cleanup](stories/done/2026-10-12_06_broken-run-cleanup.md)
- **Done, site data:**
  - [Export the header fields](stories/done/2026-10-14_01_export-header-fields.md)
  - [Build command](stories/done/2026-10-12_04_build-command.md) — `experiments/build-site.py`: aggregate, export, Astro build
- **Done, site pages:**
  - [RQ page header](stories/done/2026-10-11_06_rq-page-header.md) — sets up Astro, one page per main RQ
- **Open stories for the first iteration:**
  - [RQ index](stories/open/2026-10-11_07_rq-index.md)
  - [Findings section](stories/open/2026-10-11_08_findings-section.md)
  - [Workflow page](stories/open/2026-10-11_09_workflow-page.md)

## Later

- Charts: distributions, curves, metrics over time.
- Free filtering over the whole run pool.
- Drill-down from a cell to single runs (code, `metrics.json`, transcript).
- Before/after view for workflow tuning; the workflow tree with a change description per edge.
- Tracing a finding's conclusion back to the metrics; a human approval step for findings.
- The form of answers — classic hypotheses may not be the right shape.
- A thematic index instead of the per-harness-subtree grouping, together with curation.
- Keeping the git state and the site export in sync automatically (the site shows which
  commit it was built from).
