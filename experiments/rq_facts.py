"""Facts about a research question that decide whether it still needs work.

An RQ carries no status. What matters is read off the data each time:

  cells    how many declared cells reached min_replicates, out of how many
  findings how many `## F-… — …` headers findings.md holds
  newer    how many matching runs are newer than the last change to findings.md

`newer > 0` means the findings describe a smaller data set than the query now
returns — which happens silently whenever a sister RQ fills a cell with the
same workflow × model × kata (2026-09-27: eight RQs, n 5 → 10). It compares
run start times, so a run that is older than the findings but reached the pool
later (copied in or committed after the fact) is not counted.

A hand-kept status field drifted (44 of 68 RQs wrong on 2026-09-27) and was
dropped. The one thing a human still records is a decision the data cannot
show: `closed: "<reason>"` for an RQ that ends without full data.

Timeouts count toward min_replicates, as everywhere else in the lab.
Stdlib only.
"""
from __future__ import annotations

import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

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

_RUN_TS_RE = re.compile(r"^(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})")


def count_findings(findings_md: Path) -> int:
    if not findings_md.is_file():
        return 0
    return sum(1 for line in findings_md.read_text().splitlines()
               if FINDING_HEADER_RE.match(line))


def findings_timestamp(findings_md: Path) -> float | None:
    """When findings.md last changed: its last commit, or its mtime while it
    has uncommitted edits. None when there is no findings.md."""
    if not findings_md.is_file():
        return None
    cwd = findings_md.parent
    dirty = subprocess.run(
        ["git", "status", "--porcelain", "--", findings_md.name],
        cwd=cwd, capture_output=True, text=True).stdout.strip()
    if not dirty:
        ct = subprocess.run(
            ["git", "log", "-1", "--format=%ct", "--", findings_md.name],
            cwd=cwd, capture_output=True, text=True).stdout.strip()
        if ct:
            return float(ct)
    return findings_md.stat().st_mtime


def run_timestamp(run_id: str) -> float | None:
    """Start time encoded in a run directory name.

    Batch runs are named inside the container, whose clock is UTC. Reading the
    name as host-local time shifts every run by the host's offset (MDT: +6 h)
    and marks runs as newer than findings committed hours after them."""
    m = _RUN_TS_RE.match(run_id)
    if not m:
        return None
    return (datetime.strptime(m.group(1), "%Y-%m-%d_%H-%M-%S")
            .replace(tzinfo=timezone.utc).timestamp())
