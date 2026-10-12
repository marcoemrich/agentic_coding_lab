# Site data export

Status: open
Source: [results-site decisions](../../open-questions.md#pipeline).

## Story

Extend `aggregate-by-query.py` to write `summary.json` alongside `summary.md` from the same pandas pivots, with per-cell/outcome mean, sd, n, null count and coverage including declared but unrun cells. `export-site-data.py` reads this, RQ frontmatter, `LINEAGE.yaml` and the metric registry to write one JSON file per RQ plus `workflows.json` and `meta.json` under gitignored `site/src/data/`. Statistics belong to Python, presentation to TypeScript. The build fails on missing outcome metadata or workflow descriptions and refuses to run during a batch.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped.
