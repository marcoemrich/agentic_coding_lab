# Group order and header terms

Status: done
Source: the user's review of [result table labels](2026-10-14_03_result-table-labels.md) on 2026-10-14.

## Story

A metric group appears once per table, however the RQ orders its outcomes. The page header names its rows with the lab's terms, `Factor(s)` and `Control(s)` instead of `Varies` and `Held fixed`; a short tooltip explains each, so outsiders can still read them.

## Built

Implemented with the `exact-coding` skill; three new tests, 121 Vitest tests in all. Columns keep the frontmatter order within their group, and groups appear in the order of their first column (`gatheredByGroup` in `src/group-headers.ts`, tested in `src/result-table.spec.ts`). This changes the result table's rule 3, which had allowed a group header per run of same-group columns; its comment and one test title now say so, its examples are unchanged. RQ-model-quality now reads Code quality (5 columns), Size, Correctness.

`RqHeader.tsx` labels the rows `Factor(s)` ("Factors are what this RQ varies to compare its cells.") and `Control(s)` ("Controls are what stays fixed in every run."), the sentence as the `dt`'s `title`, marked by a dotted underline. The "(s)" spares a pluralisation rule. Tests in `src/RqHeader.spec.tsx`; the existing header tests look the rows up by the new names.
