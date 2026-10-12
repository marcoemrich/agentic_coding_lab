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

- **Done:** the RQ result table (layout, value formatting, gaps, trophies and
  comparability), built with EXACT Coding in `site/src/`. Its tests are the specification;
  the Example Mapping it came from was removed once implemented.
- **Open stories for the first iteration**, sliced out of that Example Mapping:
  - RQ page header: question, varied and fixed factors, run span, source link, closed banner
  - Findings section: collapsed `findings.md` under an "AI-generated" warning
  - RQ index grouped by harness subtree
  - Workflow page with profiles from `LINEAGE.yaml`
  - Site data export: `summary.json` from the aggregator and `export-site-data.py`

## Later

- Charts: distributions, curves, metrics over time.
- Free filtering over the whole run pool.
- Drill-down from a cell to single runs (code, `metrics.json`, transcript).
- Before/after view for workflow tuning; the workflow tree with a change description per edge.
- Tracing a finding's conclusion back to the metrics; a human approval step for findings.
- The form of answers — classic hypotheses may not be the right shape.
- A thematic index instead of the per-harness-subtree grouping, together with curation.
