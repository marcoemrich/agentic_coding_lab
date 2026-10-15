# Open questions — results site

## Deferred

- **Curation.** The first iteration ships all 46 main RQs (see Scope below), so curation is no
  longer a prerequisite. It comes back with a thematic index ("does TDD pay off", "prompt
  style", …), which is also when the per-subtree grouping gets replaced.
- **Workflow-development RQs.** Out of scope for the first step. This also defers the question
  whether they get their own page shape (predecessor vs. successor, "this is what changed")
  and a per-workflow `change:` field to feed it.

## Decided

### Goal and frame

- **Success criterion.** The link can be shown in a talk or post, and the user reads the site
  instead of `summary.md`. The second half means the site must carry what `summary.md` carries:
  coverage, `n`, every declared outcome.
- **Scope.** All 46 RQs under `research/questions-*/`. `closed` RQs get a banner with the
  reason from `closed:`. An RQ without runs yet (e.g. `1.12-ptdd-verification-split`) is
  listed in the index as "no data yet" and gets no page.
- **Language.** English, like the rest of the repo.
- **Freshness.** Rolling, not frozen: every page carries a "data as of <build time>" stamp.
  Frozen snapshots remain the job of `research/reports/`.
- **Visual design.** Plain and neutral: system font, light and dark mode, readable tables.
  No branding.

### Pipeline

- **Generated, deterministic, no LLM in the build path.** That is what makes the formatting
  consistent across RQs.
- **Built locally.** CI would have to check out 29 GB of runs and the pandas aggregation path.
- **Data source: the committed `runs.csv`, re-aggregated before every build.** Step one of a
  build runs `aggregate-by-query.py` for all RQs. 44 of 45 `runs.csv` were in an outdated
  column schema as of 2026-10-11 (four generations); the schema refresh landed separately in
  f595c1b01, together with the new columns below.
- **No timestamp noise.** The aggregator rewrites `runs.csv`/`summary.md` only when their
  content apart from the `Generated:` line changed. Otherwise every build would touch 46 RQs.
- **New `runs.csv` columns:** `started_at`, `harness`, `prompt_style`. Done in f595c1b01. The harness comes from
  the same workflow-marker derivation as `harness_of` in `batch-plan-from-rq.py`, moved into a
  shared module rather than copied.
- **`summary.json` next to `summary.md`**, written from the same pandas pivots: per cell and
  outcome `mean`, `sd`, `n`, plus coverage including declared-but-unrun cells and the null
  count. Rules and examples: [site data export](stories/done/2026-10-11_05_site-data-export.md#example-mapping).
  There is exactly one statistics implementation; the site export does no statistics of
  its own. A cross-check test between two implementations is therefore unnecessary — only a
  schema check of the JSON remains.
- **Site export:** `experiments/export-site-data.py` reads `summary.json`, the RQ frontmatter,
  `LINEAGE.yaml` and the metric registry, and writes JSON (one file per RQ plus
  `workflows.json`) to `site/src/data/`, gitignored. No `meta.json`: git state and export
  are kept in sync by hand for now.
- **Only `ok` runs enter a statistic** (decided 2026-10-12). Timeouts, infrastructure
  aborts, provider refusals and unrecognised `error-N` enter neither `mean`/`sd`/`n` nor `cost_usd`, in `summary.md`
  and `summary.json` alike; each cell counts them separately instead. Timeouts are no longer
  findings: `min_replicates` counts usable runs only and timeouts are refilled.
  `completed_within_budget` is dropped.
- **A `null` leaves `n` and is counted** as `null_count`, for numeric, boolean and pooled
  outcomes alike (decided 2026-10-12). Booleans previously counted `null` as `false`.
- **Statistics in Python, presentation in TypeScript.** Python computes every statistic
  (`mean`, `sd`, `n`, null counts, coverage) — one implementation shared with `summary.md`.
  Trophies, sort order and gap states are presentation decisions and live in the site's
  TypeScript, under its tests. This replaces the earlier "Python computes everything".
- **Strict on missing metadata.** The build fails when a declared outcome has no registry entry
  or a workflow in a table has no `description:`, instead of shipping placeholders.
- **No build during a batch.** The build aborts while a `batch`/`batch-retry` container is
  running, so half-finished runs never reach the site.
- **Frontend:** Astro with React islands (sorting, collapsing, tooltips; later charts and
  filters) in a sub-project `site/` with its own `package.json` and pnpm pinned via
  `packageManager`. Output `site/dist/` is gitignored.
- **Separate `build` and `deploy`.** The build prints the duration per step and a final
  `git diff --stat`. `deploy` refuses off `main`, while `research/` or `site/` has uncommitted
  changes, or while HEAD is not yet on `origin/main`; it then runs the build itself and
  publishes nothing if that build leaves a diff under `research/` — the published site always
  corresponds to a pushed commit. It appends one commit per deploy to `gh-pages` via
  `git worktree` and pushes it. Every page's stamp names the commit it was built from.
  It runs only when the user calls it ([Deploy](stories/done/2026-10-15_01_deploy.md)).
- **Hosting:** GitHub Pages from this public repo, at `marcoemrich.github.io/agentic_coding_lab/`
  (Astro `base: '/agentic_coding_lab'`, for local previews too). A custom domain can be added
  later via CNAME.

### Metric registry

- **`experiments/metrics-registry.yaml`**, one entry per metric: glossary display name,
  direction (`higher` / `lower` / `informative`), unit, and flags for "not comparable across
  the test-list boundary" and "not comparable across stacks". It drives column names, tooltips,
  trophies and warnings; later `generate-snapshot-skeleton.py` should read it instead of its
  hard-coded prose table (`:440–497`).
- **Both sides read the YAML file directly.** Python for the export's strictness check; the
  site imports it through a Vite YAML plugin, bundled at build time, so `pnpm test` runs
  without a prior export and tests check against the real registry. No `metrics.json` export.

### RQ page

- **Header:** question, controls (stated once, not repeated per row), time span of the RQ's
  runs (earliest to latest `started_at`), links to the RQ directory on GitHub and to the
  `run_id`s per cell (`experiments/runs/<id>/` is tracked and pushed). That link list stands in
  for drill-down until it exists.
- **One table per kata.** Rows are cells, labelled only by the factors that vary in the RQ.
  Columns are the declared `outcomes:` plus `n` and `cost_usd`; values as `mean ± sd`, boolean
  and rate outcomes as `%` with `k/n`. min/max are dropped. Each row shows its cell's time span
  (e.g. "2026-08-03 → 08-17").
- **Gaps, three states:** *not run* (declared cell with 0 runs, shown greyed), *not collected*
  (metric `null` in every run of the cell), *partial* (some `null`s; value shown with its own
  `n`, e.g. `0.82 ± 0.05 (n=3/5)`).
- **Trophies** computed automatically per kata table, following the run-rq convention
  (direction from the registry, spread threshold, all winners on ties, none for
  `informative`).
- **Comparability warnings:** columns flagged in the registry get ⚠️ with a tooltip. When an
  RQ actually spans the boundary, that column gets no trophy. Detection reuses
  `uses_test_list()` from `aggregate-by-query.py` and `metrics.json.stack`, falling back to
  `typescript-vitest` for runs that predate the field (they are all TypeScript).
- **Findings:** `findings.md` rendered as is, collapsed by default, under a fixed warning
  "AI-generated, not human-validated". Its tables are not normalised.

### Other pages

- **Index:** grouped by harness subtree (Claude Code, pi, OpenCode, Cursor, cross-harness),
  ordered by chapter label; each entry shows the question, coverage ("12/12 cells"), time span
  and a `closed` badge where set. Provisional — probably not the right grouping long-term.
- **Workflows:** one page with an anchor per workflow from its `description:`; every workflow
  name in a table links there. Plus one hand-written concept page for Predictive TDD and
  EXACT Coding.

### Workflow descriptions

- **Depth.** A short profile per workflow (one or two sentences plus traits: architecture
  subagents/main-context/hybrid, harness, TDD variant, parent). The underlying concepts
  (Predictive TDD, EXACT Coding) get one concept page for outsiders; profiles link to it
  instead of re-explaining.
- **Source.** An optional per-workflow `description:` field in `LINEAGE.yaml`: outsider prose
  covering what the workflow is, its arm and what sets it apart. Kept separate from the
  lab-facing `note:`. Structured traits per arm (an `arms:` block) were considered and dropped
  as too complex for a first step.
- **Scope.** First step covers only workflows named in the frontmatter of a main RQ
  (`research/questions-*/`): 49 of 90 as of 2026-10-11, all of them described. The rest —
  referenced only by workflow-dev or kata-dev RQs, or by none — is deferred along with those
  RQs.
