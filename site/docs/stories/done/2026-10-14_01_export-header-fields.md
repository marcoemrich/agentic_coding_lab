# Export the header fields

Status: done
Source: sliced out of the [RQ page header](../open/2026-10-11_06_rq-page-header.md) mapping on 2026-10-14.
Blocked: [RQ page header](../open/2026-10-11_06_rq-page-header.md).

## Story

As the RQ page header, I need each exported RQ file to carry the RQ's factors, controls, `closed` reason and repository directory, so that the page can render them without reading the frontmatter itself.

## Built

Implemented with the `exact-coding` skill; ten tests in `experiments/tests/test_export_site_data.py` (section "Header fields") are the specification. `export-site-data.py` passes `factors` and `controls` through as parsed, `any:` objects included, and leaves `controls` and `closed` out when unset (`OPTIONAL_FIELDS`). `path` is the RQ directory relative to the repo root, taken as the last three parts of the directory because main RQs always sit at `research/<subtree>/<dir>`. An RQ without `factors` stops the export (`export-site-data: RQ-x: no factors`, exit 1, nothing written). The test fixture now gives every RQ a `factors` block by default.

Against the real data the export writes all 46 RQ files; three carry `closed`, one (RQ-architecture-axis-opus5) has no `controls`.
