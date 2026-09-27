"""Derive the state of a research question from its data.

An RQ carries no hand-maintained status. Its state follows from what is on
disk: how many runs each declared cell has, and whether findings.md holds any
finding. A hand-kept field drifted — on 2026-09-27, 44 of 68 RQs showed a
status their data contradicted, and no script read the field.

The one exception is a decision the data cannot show: an RQ that ends on
purpose without full data (abandoned, deprecated, or a replicate gap that is
accepted). It carries `closed: <reason>` in its frontmatter, and that overrides
everything else.

States, in the order they are checked:

  closed      frontmatter has `closed:`
  planned     no run matches any cell
  filling     at least one cell below min_replicates
  unanalysed  every cell full, but findings.md has no finding header
  answered    every cell full and at least one finding

Timeouts count toward min_replicates, as everywhere else in the lab: a run
that hit the budget is a data point, not a gap.

Consumers: aggregate-by-query.py (state line in summary.md), rq-status.py
(overview across all RQs), generate-snapshot-skeleton.py (finding headers).
Stdlib only.
"""
from __future__ import annotations

import re
from pathlib import Path

STATES = ("closed", "planned", "filling", "unanalysed", "answered")

# Finding ids are F-<namespace>.<minor>, where the namespace itself may carry
# dots. The namespace mirrors the RQ id — a slug since the id→slug migration
# (F-regression.6), the legacy numeric form (F-19.6, F-3b.1), or the chapter
# number of the RQ directory (F-4.4.1 in 4.4-external-tdd-workflows,
# F-1.12.5 in 1.12-end-refactor-effect-v62). Everything up to the LAST dot is
# the namespace, so any number of dotted segments matches.
# Do not tighten this to a single dot: chapter-numbered ids were silently
# dropped that way, which reads downstream as "no findings documented" for an
# RQ that in fact has a full findings.md.
FINDING_HEADER_RE = re.compile(
    r"^##\s+(F-[A-Za-z0-9][A-Za-z0-9.-]*\.\d+)\s+—\s+(.+?)\s*$"
)


def count_findings(findings_md: Path) -> int:
    if not findings_md.is_file():
        return 0
    return sum(1 for line in findings_md.read_text().splitlines()
               if FINDING_HEADER_RE.match(line))


def derive_state(fm: dict, rq_dir: Path, cell_counts: list[int]) -> tuple[str, str]:
    """Return (state, one-line reason) for an RQ.

    `cell_counts` holds the number of matched runs per declared cell.
    """
    closed = fm.get("closed")
    if closed:
        return "closed", str(closed).strip()

    min_rep = fm.get("min_replicates", 1)
    full = sum(1 for n in cell_counts if n >= min_rep)
    total = len(cell_counts)
    if sum(cell_counts) == 0:
        return "planned", f"no runs in {total} cell(s)"
    if full < total:
        return "filling", f"{full}/{total} cells at min_replicates={min_rep}"

    n_findings = count_findings(rq_dir / "findings.md")
    if n_findings == 0:
        return "unanalysed", f"all {total} cells full, no findings"
    return "answered", f"all {total} cells full, {n_findings} finding(s)"
