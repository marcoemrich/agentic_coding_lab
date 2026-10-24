---
name: publish-site
description: |
  Build the results site and publish it to GitHub Pages. Checks every
  precondition deploy-site.py enforces before spending a build on them,
  presents the research/ diff the build produces for a commit, and deploys
  only on explicit confirmation.
  Trigger when the user says "publish", "deploy", "site deployen",
  "gh-pages", "auf die Seite bringen", or asks how to get results online.
disable-model-invocation: false
allowed-tools: Bash Read Edit
---

# /publish-site — build and publish the results site

The lab has **two** publishing paths and they are not alternatives:

| Path | Produces | Entry point |
|---|---|---|
| this skill | the live site on the `gh-pages` branch, one page per RQ | `pnpm deploy:site` |
| `/build-overview` | a frozen Markdown snapshot under `research/reports/` | `generate-snapshot-skeleton.py` |

Do not reach for one when the user asked for the other. "Snapshot", "report",
"Bericht", "Stand" → `/build-overview`. "Site", "online", "deploy", "Pages" →
here.

## What publishes, and what does not

`export-site-data.py` globs `research/questions-*/*/README.md`. So the site
carries the per-harness and cross-harness RQs **only** — `research/workflow-dev/`
and `research/kata-dev/` are deliberately not published yet. If the user expects
a workflow-development RQ on the site, say that it is out of scope rather than
hunting for a bug.

Each RQ page shows its `findings.md` as written, behind a warning banner. There
is no separate review step, so a findings file that contradicts its own data
goes online as it stands. Worth a sentence to the user when you know of one.

## Deploy is outward-facing

`deploy-site.py` pushes to a public branch. **Never run it without the user
saying so in this conversation.** Building is free and reversible; deploying is
not. When the user asks "how do I publish", answer with the commands and stop —
do not deploy to demonstrate.

## Phase 1 — preconditions

`deploy-site.py` refuses on any of these, and it refuses *after* running its own
build, so checking first saves the build. Report them as a block:

```bash
cd /path/to/agentic_coding_lab
git rev-parse --abbrev-ref HEAD                      # must be main
git merge-base --is-ancestor HEAD origin/main && echo pushed || echo NOT-pushed
git status --porcelain -- research site | wc -l      # must be 0
command -v uv || echo "uv MISSING"
test -d site/node_modules || echo "site deps MISSING"
```

Two of these are the traps:

- **`site/node_modules` is not in the repo.** Without it the Astro build dies
  with `astro: not found` and `build-site.py` exits 1 after already
  re-aggregating every RQ. Fix: `cd site && pnpm install --frozen-lockfile`.
  Do not worry about the host's pnpm version — corepack honours the
  `packageManager` pin in `site/package.json` and uses that one.
- **`uv` is the documented interpreter and may be absent.** Both pnpm scripts
  are `uv run --project ../experiments python ...`. Install it the way the
  Dockerfile does, at the same pin, rather than reaching for pip (the system
  Python is PEP 668 managed and has no `ensurepip`):
  ```bash
  curl -LsSf https://astral.sh/uv/0.12.17/install.sh | sh
  cd experiments && uv sync
  ```

## Phase 2 — build

```bash
cd site && pnpm build:site
```

It re-aggregates every RQ, runs the site data export, then `astro build`. Stops
at the first failing step. Refuses while a batch runs, through the aggregator's
batch lock — so check `docker ps` if it exits on that.

It closes with `git diff --stat` over `research/`. **`no changes` is the only
output that lets a deploy proceed**, because `deploy-site.py` publishes nothing
when its own build leaves a diff there.

## Phase 3 — the research/ diff, if there is one

A diff means committed aggregations were stale. Sort it before offering a
commit, because the two kinds read completely differently:

- **Substantive** — a cell's `n`, `mean` or `sd` moves meaningfully, or a metric
  appears where it was null. Usually a metric was computed (`compute-cost.py`,
  `compute-mutation-score.py`) and never aggregated, or a run was re-measured
  and other RQs share that run's cell.
- **Last-digit float churn in `summary.json`** — `"sd": 3.271085446759225` →
  `3.2710854467592254`. Harmless, and one-time: two consecutive aggregations are
  byte-identical afterwards.

Separate them before reporting:

```bash
git diff -U0 -- research | grep -E '^[+-]' | grep -vE '^[+-][+-]' \
  | grep -vE '"(sd|mean)":\s*[0-9.e-]{12,}' | head -40
```

Report the substantive ones by RQ and metric, then ask whether to commit. Never
`git checkout` the diff away — the committed values are the stale ones.

**If the churn is not one-time, the pins have drifted.** `experiments/pyproject.toml`
pins pandas/numpy to the host's system versions for exactly one reason: so
`uv run` and a plain `python3` compute the same numbers. When the host's Python
moves and the pins do not, every `uv`-driven build rewrites the last digits of
every mean and a deploy can never go green. Check
`python3 -c "import pandas, numpy; print(pandas.__version__, numpy.__version__)"`
against the pins before concluding anything about the data.

## Phase 4 — deploy

Only after the user has said to deploy, and only with phase 1 green and phase 2
reporting `no changes`:

```bash
cd site && pnpm deploy:site
```

It runs the full build again, then commits `site/dist/` plus `.nojekyll` onto
`gh-pages` in a temporary worktree as `Deploy <short sha>: <subject>` and pushes.
An orphan branch on the first deploy. The published site therefore always
matches one pushed commit on `main`.

Afterwards, report the `gh-pages` commit and the deployed `main` sha:

```bash
git log --oneline -1 origin/gh-pages
```

## Out of scope

- Writing or editing `findings.md` — that is `/run-rq` and `/reanalyze`.
- The frozen Markdown snapshot — that is `/build-overview`.
- Starting batches or analysing runs.
