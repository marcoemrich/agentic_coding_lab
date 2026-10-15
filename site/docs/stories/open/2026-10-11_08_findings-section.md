# Findings section

Status: open
Source: [results-site decisions](../../open-questions.md#rq-page).

## Story

Render the existing `findings.md` as is, collapsed by default, beneath a fixed “AI-generated, not human-validated” warning. Do not normalise its tables.

## Example Mapping

Mapped with the user on 2026-10-15.

### Story (yellow)

As a reader of an RQ page, I want to expand the lab's findings so far, clearly marked as AI-generated and not human-validated, so that I see the lab's reading without mistaking it for the measured tables.

### Rules (blue)

#### Rule 1: Position and form
Beneath all kata tables, an always visible banner “AI-generated, not human-validated.”, and below it a collapsed section titled “Findings”. An RQ without `findings.md` shows neither.

#### Rule 2: Content as is
`findings.md` is rendered as GitHub-flavoured Markdown (tables, emphasis, code, lists); its tables are not normalised. Wide tables scroll horizontally, as in the prototype (`.md table`).

#### Rule 3: Headings two levels down, capped at h6
So the findings' own h1 does not compete with the page's.

#### Rule 4: Links
A relative link is resolved against the RQ's directory. A link to another main RQ's `findings.md` goes to that RQ's page, anchored at its findings section; one to an RQ's `README.md` goes to its page, without the README anchor, since README sections are not on the page. Any other file, an RQ without a page, and RQs outside `research/questions-*/` (workflow-dev, kata-dev) link to GitHub. `http(s)` links stay as they are.

#### Rule 5: Anchors on findings
Headings get GitHub-style ids, so the anchors the findings already use keep working. Following an anchor to a finding opens the collapsed section.

#### Build reading
`export-site-data.py` carries the text of `findings.md` into the RQ's JSON, like the other fields; the site keeps reading only `site/src/data/`.

### Examples (green)

#### For rule 1
- RQ-stability → banner, then “Findings” collapsed, beneath the last kata table
- `questions-cross/1.12-ptdd-verification-split` (no `findings.md`) → no banner, no section

#### For rule 2
- RQ-stability's overview table → rendered as a table with its bold cells and its ` ```code``` ` spans, column order and values untouched

#### For rule 3
- `# RQ-stability Findings` → h3
- `## F-stability.1 — …` → h4
- `####` → h6; `#####` and `######` → h6

#### For rule 4
- in 4.13: `../4.12-old-vs-new-exact-line-opus55/findings.md` → `/agentic_coding_lab/rq/RQ-old-vs-new-exact-line-opus55/#findings`
- `../../questions-claude/4.12-old-vs-new-exact-line-opus55/findings.md` from another subtree → the same page
- `README.md` → the RQ's own page; `README.md#mutation-score-coverage` → the page without anchor
- `subsample-analysis.py` in 5.1 → `https://github.com/marcoemrich/agentic_coding_lab/blob/main/research/questions-claude/5.1-workflow-stability/subsample-analysis.py`
- a link into `research/workflow-dev/…` → GitHub
- `https://www.scbench.ai` → unchanged

#### For rule 5
- `#f-1103--the-second-structural-step-is-worth-more-on-sol-than-on-opus` → jumps to F-1.10.3, section open
- `../x/findings.md#f-…` → RQ x's page, at that finding

### Questions (red)

None — all open points were resolved.

### Before building, lab side

- Remove the status markers in `5.1-workflow-stability` and `1.2-prompt-style-known-kata` through `/reanalyze`, keeping their reasons (`**Status**: ✅ stable (n=30, σ=0)` → `**Evidence**: n=30, σ=0`; a bare `**Status**: ✅ stable` goes). The ✅/⚠️/❌ in the tables of 1.5 and 4.1 are data, with their own legend, and stay.
