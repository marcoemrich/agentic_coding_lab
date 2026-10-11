# Results-site prototype

The approved look-and-feel prototype for the results site, approved 2026-10-11. It is the
visual reference for the Example Mapping in [`../docs/`](../docs/) and is not the
production pipeline.

Open `results-site-prototype.html` in a browser. It is one self-contained file: the data is
inlined, React 18.3.1 and marked 12.0.2 load from cdnjs, the fonts from Google Fonts.
A published copy lives at <https://claude.ai/artifact/97iGMHZ2vrDKjEhdgLVquf> (private).

## What it shows

- The index of all 46 main RQs, grouped by harness subtree, with coverage and run span.
- Full pages for two sample RQs, chosen to exercise the hard cases:
  - RQ-tdd-workflow-comparison-opus55 spans the test-list boundary (⚠ columns without
    trophies, "test list" / "ad hoc" tags).
  - RQ-external-tdd-workflows-opus5 is closed, has a declared cell without runs and
    legacy metrics the external workflows never produced ("n/c").
- A workflow page with the `description:` texts from `LINEAGE.yaml`.

## Simplifications against the decided design

- Data comes straight from the run pool via `aggregate-by-query.py`'s functions, not from
  re-aggregated `runs.csv` plus `summary.json`.
- The metric registry is an inline dict in `extract.py`, not `metrics-registry.yaml`.
- Trophies go to the best mean rounded to two decimals. The decided rule (within one sd)
  is in the Example Mapping, story D.
- Durations show in seconds and only `verification_pct` shows as percent. The Example
  Mapping, story B, decides minutes and percent for every 0–1 metric.
- Workflow links go to the workflow page, not to the workflow's entry.

## Rebuild

From the repo root:

```bash
python3 site/prototype/extract.py site/prototype/results-site-prototype.html
```

Needs PyYAML. Reads the run pool and RQ files only; takes about half a second.
