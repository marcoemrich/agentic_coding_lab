# RQ page header

Status: open
Source: [results-site decisions](../../open-questions.md#rq-page).
Depends on: [export the header fields](2026-10-14_01_export-header-fields.md) (factors, controls, `closed`, RQ directory), sliced out during the mapping.

## Story

As a reader outside the lab, I want each RQ page to open with the question, what was varied, what was held fixed, when the runs happened, where the source lives and whether the RQ was closed early, so that I understand what the table below measures before I read it. The story sets up Astro with one page per main RQ at `rq/<id>/` and adds the per-table run lists that stand in for drill-down.

## Example Mapping

Mapped with the domain expert on 2026-10-14. Examples use the exported data of that day; since the broken-run cleanup the pool holds only `ok` runs.

### R1 — Title

The page's h1 and its browser `<title>` read `Research Question: <id>`. The question text follows below the h1. No separate id line, no chapter label.

- RQ-stability → h1 and `<title>` "Research Question: RQ-stability"; `5.1` appears nowhere on the page.

### R2 — Closed banner

When `closed:` is set, a banner `Closed. <reason>` sits between the question and the meta list. Without `closed:` there is no banner.

- RQ-stability → "Closed. gap accepted — one game-of-life cell holds 9 of 10 runs".
- RQ-architecture-axis-opus5 (no `closed:`) → no banner.

### R3 — Varies

The factors in frontmatter order, each its own entry under the label `Varies`. A plain factor is one line `key: a, b, c`. A paired factor gets its name as heading (`workflow × prompt`) and one line per pair with the values joined by ` · `. An `any:` renders as `a / b`. YAML comments are not shown.

- RQ-stability →
  ```
  Varies      workflow × prompt
                baseline-oneshot-v1-cc · prose
                baseline-iterative-v1-cc · prose
                baseline-inline-tdd-v1-cc · example-mapping
                exact-subagents-v1-cc · example-mapping
                exact-single-context-v1-cc · example-mapping
                exact-hybrid-v1-cc · example-mapping
  ```
- RQ-exact-coding-typescript, the pair with an `any:` → `gpt-5-6-sol-codex · exact-ptdd-v1-pi / exact-sol-v1.6-test-list-dimensions-pi`.
- RQ-architecture-axis-opus5 (three factors, comments on the pairs) →
  ```
  Varies      workflow × prompt
                baseline-inline-tdd-v1-cc · example-mapping
                exact-single-context-v2-testlist-fix-cc · example-mapping
                exact-hybrid-v2-testlist-fix-cc · example-mapping
                exact-hybrid-v6-lab-split-cc · example-mapping
              kata_base: claim-office, game-of-life
              model: opus-5-no-thinking, opus-4-7-no-thinking / opus-4-7-portkey-no-thinking
  ```

### R4 — Held fixed

The controls as raw `key: value` lines under the label `Held fixed`, an `any:` as `a / b`. Without controls the row is dropped.

- RQ-stability → `model: opus-4-7-no-thinking`, `kata_base: game-of-life`.
- `model: {any: [opus-4-7-no-thinking, opus-4-7-no-thinking-portkey]}` → `model: opus-4-7-no-thinking / opus-4-7-no-thinking-portkey`.
- RQ-architecture-axis-opus5 (empty `controls:`) → no `Held fixed` row.

### R5 — Workflow links

Every workflow name in the header links to `workflows/#<workflow name>`, in factors and controls alike, every `any:` alternative included.

- `exact-ptdd-v1-pi / exact-sol-v1.6-test-list-dimensions-pi` → two links, `workflows/#exact-ptdd-v1-pi` and `workflows/#exact-sol-v1.6-test-list-dimensions-pi`.

### R6 — Runs line

Under the label `Runs`: the number of `ok` runs, their span from the earliest to the latest `started_at` as UTC dates, and how many cells reach `min_replicates` counting `ok` runs only. A span within one day shows a single date.

- RQ-stability → `59 runs, 2026-05-14 → 2026-05-15; 5 of 6 cells at 10 replicates`.
- RQ-architecture-axis-opus5 → span `2026-05-08 → 2026-09-10`.
- All `ok` runs on 2026-08-10 → `2026-08-10`.
- One `ok` run → `1 run, …`.
- No runs at all → `no runs yet; 0 of 6 cells at 10 replicates`.
- Runs, but none `ok` → `no ok runs yet; 0 of 6 cells at 10 replicates`.

### R7 — Source

Under the label `Source`, a link "View on GitHub" to the RQ directory on `main`.

- RQ-stability → `https://github.com/marcoemrich/agentic_coding_lab/tree/main/research/questions-claude/5.1-workflow-stability`.

### R8 — Run lists

Under each kata table, one flat list of all of that table's runs, collapsed by default behind "Runs behind this table". Every run is listed, `ok` or not — the list is also for debugging. Each run id links to `https://github.com/marcoemrich/agentic_coding_lab/tree/main/experiments/runs/<id>`. A non-`ok` run shows its exit reason. Order is `started_at`, ties by run id. No grouping per row, no prompt style per run (the kata variant already fixes it per table, and the run id carries it).

- A timed-out run → `<run_id> (timeout)`.
- The three claim-office runs of RQ-architecture-axis-opus5 started at `2026-08-10T15:25:37` → ordered `…_opus-5-no-thinking`, `…-2`, `…-3`.
- RQ-stability → two lists, under `game-of-life-prose` and under `game-of-life-example-mapping`.

### Decided along the way

- 06 sets up Astro; one page per main RQ at `rq/<id>/`, e.g. `rq/RQ-stability/`.
- Workflow links are emitted now; their targets arrive with the [workflow page](2026-10-11_09_workflow-page.md).
- The coverage in the Runs line overlaps with the [RQ index](2026-10-11_07_rq-index.md); accepted.
- Labels follow the prototype: `Varies`, `Held fixed`, `Runs`, `Source`.
- The export lacks factors, controls, `closed` and the RQ directory; adding them is a story of its own that 06 depends on ([export the header fields](2026-10-14_01_export-header-fields.md)).
