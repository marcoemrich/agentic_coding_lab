# Result table look

Status: done
Source: the user's review of the first local build on 2026-10-14 ("the prototype looked much better").

## Story

The RQ result table takes the approved prototype's look (`site/prototype/template.html`): borders, tabular figures, a sticky label column, dimmed secondary lines, trophy and gap colours that work in light and dark mode, and a table that scrolls on its own instead of widening the page. The table stories had built the behaviour but carried over only the header tokens; the table had no styles, fixed light inline colours, and no fonts.

## Built

Implemented with the `exact-coding` skill. One bug fixed test-first: the header row had no cell above the row labels, so every metric header sat one column to the left of its values. `src/ResultTable.spec.tsx` ("Result table look") now pins one header cell per row cell, the label header naming the varying factors. Two specification changes, agreed with the user: the trophy test asserts the `win` class instead of a set inline background (`src/trophies-and-comparability.spec.tsx`), and the under-replicated test asserts the class and no inline background (`src/gaps-and-coverage.spec.tsx`). 113 Vitest tests.

`ResultTable.tsx` carries the prototype's classes (`scroll`, `res`, `lab`, `legend`, `dir`, `warnmark`, `win`, `runs`, `banner warn`). `src/styles/site.css` takes the prototype's result-table rules and the tokens `--win`, `--warn`, `--warn-bg` and `--gap` in all three theme blocks; an under-replicated label uses `--warn-bg`, a not-run row `--gap`. `layouts/Page.astro` loads Newsreader and Public Sans from Google Fonts. The trophy now follows the value, before its secondary line.

Deviations from the prototype: the sort control stays a `<button>`, styled as plain header text; metric headers show the raw metric id and do not wrap, because the prototype's display names are not in the metric registry, and breaking ids at underscores with `<wbr>` changed the buttons' accessible names. Not rendered yet, though `buildResultTables` provides it: the metric group header row, row labels other than the workflow (a model-varying RQ shows `model` in the header but no model per row), the test-list/ad-hoc tag, run dates, and the dimmed `± sd`.
