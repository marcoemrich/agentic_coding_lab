# Findings section

Status: done
Source: [results-site decisions](../../open-questions.md#rq-page); mapped with the user on 2026-10-15.

## Story

As a reader of an RQ page, I want to expand the lab's findings so far, clearly marked as AI-generated and not human-validated, so that I see the lab's reading without mistaking it for the measured tables.

Beneath all kata tables, an always visible banner “AI-generated, not human-validated.” sits above a collapsed section titled “Findings”; an RQ without `findings.md` shows neither. `findings.md` is rendered as GitHub-flavoured Markdown with its tables untouched, its headings two levels down (capped at h6) and given GitHub-style ids, so the anchors the findings already use keep working. A relative link is resolved against the RQ's directory: another main RQ's `findings.md` goes to that RQ's page (`#findings`, or the finding's own anchor), a `README.md` to the RQ's page without its anchor, any other file and any RQ without a page to GitHub; `http(s)` links stay. Following an anchor into the findings opens the section. Before building, the status markers in RQ-stability and RQ-prompt-known-kata were removed through `/reanalyze` (4e163dcb6).

## Built

Implemented with the `exact-coding` skill; 19 new Vitest tests — 14 in `src/render-findings.spec.ts`, 5 in `src/FindingsSection.spec.tsx` — and 2 pytest tests in `experiments/tests/test_export_site_data.py` (172 Vitest and 129 Python tests in all). `export-site-data.py` carries the text of `findings.md` into the RQ's JSON (`findings_text()`), so the site still reads only `site/src/data/`. `render-findings.ts` renders with `marked` and names headings with `github-slugger`; the link rule lives apart in `findings-links.ts`, `FindingsSection.tsx` holds the markup, and `open-findings.ts` opens the section for an address that points into it, called on load and on `hashchange` from the RQ page. Readings adopted: a link to an RQ's directory itself is treated like any other file; only the findings section opens on an anchor, never another `<details>` such as a run list. Deviations: the rendered page showed findings' lists in two columns, because the run lists' `details ul` rule applied; it is now scoped away from `.md`. The first build after the reanalysis re-aggregated four sister RQs sharing its runs (34bb6f732). Markdown the findings write in a way `marked` does not parse, such as quotes inside `**…**`, shows as written.
