#!/usr/bin/env python3
"""Publish the results site to GitHub Pages.

Refuses, before building, off main, with uncommitted changes under research/ or
site/, or while HEAD is not yet on origin/main. Then runs the complete build
(build-site.py); a failing build, or one that leaves a diff under research/,
publishes nothing. Otherwise commits site/dist/ plus .nojekyll onto gh-pages as
"Deploy <short sha>: <subject>" (an orphan branch on the first deploy) in a
temporary worktree and pushes it. The published site thus matches one commit.

Usage:
  uv run --project experiments python experiments/deploy-site.py
"""
from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = REPO_ROOT / "site" / "dist"
PAGES_BRANCH = "gh-pages"
SHORT_SHA_LENGTH = 7
BUILD_COMMAND = [sys.executable, str(Path(__file__).resolve().parent / "build-site.py")]


def git(*args: str, cwd: Path | None = None) -> str:
    return subprocess.run(["git", "-C", str(cwd or REPO_ROOT), *args],
                          capture_output=True, text=True, check=True).stdout.strip()


def deploy_message() -> str:
    """'Deploy <short sha>: <subject>' of the main commit the site was built from."""
    sha, subject = git("log", "-1", "--format=%H%n%s").split("\n", 1)
    return f"Deploy {sha[:SHORT_SHA_LENGTH]}: {subject}"


def check_out_pages_branch(worktree: Path) -> None:
    """gh-pages as origin has it, or a new orphan branch on the first deploy."""
    if git("ls-remote", "--heads", "origin", PAGES_BRANCH):
        git("fetch", "-q", "origin", PAGES_BRANCH, cwd=worktree)
        git("checkout", "-q", "-B", PAGES_BRANCH, "FETCH_HEAD", cwd=worktree)
    else:
        git("checkout", "-q", "--orphan", PAGES_BRANCH, cwd=worktree)


def publish(message: str) -> None:
    """Commit dist/ plus .nojekyll onto gh-pages in a temporary worktree and push it."""
    with tempfile.TemporaryDirectory() as tmp:
        worktree = Path(tmp) / PAGES_BRANCH
        git("worktree", "add", "--detach", str(worktree))
        try:
            check_out_pages_branch(worktree)
            git("rm", "-rfq", "--ignore-unmatch", ".", cwd=worktree)
            shutil.copytree(DIST_DIR, worktree, dirs_exist_ok=True)
            (worktree / ".nojekyll").touch()
            git("add", "-A", cwd=worktree)
            git("commit", "-q", "--allow-empty", "-m", message, cwd=worktree)
            git("push", "-q", "origin", PAGES_BRANCH, cwd=worktree)
        finally:
            git("worktree", "remove", "--force", str(worktree))


def is_on_origin_main() -> bool:
    """HEAD is origin/main or one of its ancestors, as far as the last fetch knows."""
    return subprocess.run(["git", "-C", str(REPO_ROOT), "merge-base", "--is-ancestor", "HEAD", "origin/main"],
                          check=False).returncode == 0


def refusal() -> str | None:
    """Why this state may not be published, or None."""
    if git("rev-parse", "--abbrev-ref", "HEAD") != "main":
        return "deploy only from main"
    dirty = git("status", "--porcelain", "--", "research/", "site/")
    if dirty:
        return f"uncommitted changes under research/ or site/:\n{dirty}"
    if not is_on_origin_main():
        return "HEAD is not on origin/main — push first"
    return None


def build_changes() -> str | None:
    """What the build changed under research/, as a diff stat, or None. New files
    have no diff stat and are listed by status."""
    status = git("status", "--porcelain", "--", "research/")
    if not status:
        return None
    return git("diff", "--stat", "--", "research/") or status


def main() -> int:
    reason = refusal()
    if reason:
        print(f"deploy-site: {reason} — nothing built or published")
        return 1
    code = subprocess.run(BUILD_COMMAND, cwd=REPO_ROOT, check=False).returncode
    if code:
        print(f"deploy-site: build failed (exit {code}) — nothing published")
        return code
    changes = build_changes()
    if changes:
        print(changes)
        print("deploy-site: the build changed research/ — commit and push it, then deploy again")
        return 1
    publish(deploy_message())
    return 0


if __name__ == "__main__":
    sys.exit(main())
