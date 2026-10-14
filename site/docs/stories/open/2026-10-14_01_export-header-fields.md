# Export the header fields

Status: open
Source: sliced out of the [RQ page header](2026-10-11_06_rq-page-header.md) mapping on 2026-10-14.
Blocks: [RQ page header](2026-10-11_06_rq-page-header.md).

## Story

As the RQ page header, I need each exported RQ file to carry the RQ's factors, controls, `closed` reason and repository directory, so that the page can render them without reading the frontmatter itself. Extends `experiments/export-site-data.py`; implemented with the `exact-coding` skill.

## Example Mapping

Mapped with the domain expert on 2026-10-14.

### R1 — Factors and controls pass through

`factors` and `controls` go into the RQ file as parsed from the frontmatter, `any:` objects included. All formatting is the site's job, including recognising workflows by the key `workflow`. YAML comments do not appear.

- RQ-stability → `"factors": {"workflow_x_prompt": [{"workflow": "baseline-oneshot-v1-cc", "prompt": "prose"}, …]}`, `"controls": {"model": "opus-4-7-no-thinking", "kata_base": "game-of-life"}`.
- RQ-architecture-axis-opus5 → `"model": ["opus-5-no-thinking", {"any": ["opus-4-7-no-thinking", "opus-4-7-portkey-no-thinking"]}]` inside `factors`.

### R2 — Unset means absent

`closed` and `controls` are left out of the RQ file when the frontmatter does not set them.

- RQ-stability → `"closed": "gap accepted — one game-of-life cell holds 9 of 10 runs"`.
- RQ-architecture-axis-opus5 → no `closed` key, and no `controls` key (its `controls:` is empty).

### R3 — Path

`path` is the RQ directory relative to the repo root; the site adds the GitHub base.

- RQ-stability → `"path": "research/questions-claude/5.1-workflow-stability"`.

### R4 — No factors stops the export

An RQ without `factors` stops the export with exit 1 before anything is written, like the existing registry and description checks.

- An RQ without `factors` → `export-site-data: RQ-x: no factors` on stderr, exit 1, no files written.

### Decided along the way

- Workflows named only as `any:` alternatives need no description in `workflows.json` yet; their links have no target until those descriptions exist.
- The export does not mark which values are workflows; the key name `workflow` says so, and formatting belongs to TypeScript.
- Relative `path` rather than a full URL: the GitHub base is needed for the run links anyway and lives once on the site side.
