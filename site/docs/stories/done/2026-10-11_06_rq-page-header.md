# RQ page header

Status: done
Source: [results-site decisions](../../open-questions.md#rq-page).
Depended on: [export the header fields](2026-10-14_01_export-header-fields.md).

## Story

As a reader outside the lab, I want each RQ page to open with the question, what was varied, what was held fixed, when the runs happened, where the source lives and whether the RQ was closed early, so that I understand what the table below measures before I read it. The story sets up Astro with one page per main RQ at `rq/<id>/` and adds the per-table run lists that stand in for drill-down.

## Built

Implemented with the `exact-coding` skill; the specification is `src/RqHeader.spec.tsx` (25 tests, R1–R7) and the "Run list under a kata table" block in `src/ResultTable.spec.tsx` (R8), 28 new tests in all. `RqHeader.tsx` renders title, question, closed banner and the meta list (`Varies`, `Held fixed`, `Runs`, `Source`); the Runs line lives in `rq-runs-summary.ts` (ok runs only, UTC dates, coverage on ok runs), the run lists in `run-links.ts`. Astro 7 with `@astrojs/react` builds one page per exported RQ from `src/pages/rq/[id].astro`; the result table is a `client:load` island so its column sort works. `pnpm build` writes all 46 pages; the browser `<title>` was checked in the built HTML rather than by a test.

Deviations and side effects:

- Workflow links read `/workflows/#<name>`. The existing table linked to `/workflows#<name>`; both now share `workflow-link.ts`, and the table's test moved to the new form. The GitHub base lives once, in `github-link.ts`.
- R8 relabels and reorders the run list the result table already had (`Runs` → `Runs behind this table`); its existing test was updated rather than duplicated.
- The first build stopped on one `ok` run without `started_at`. On the user's call the lab data was fixed instead of the site (commit "Backfill the missing start time of one pi run").
- Absolute links (`/workflows/`) assume the site is served from the domain root. A GitHub Pages project site would need Astro's `base`; deployment is not part of this story.
