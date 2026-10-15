"""Deploy command (story site/docs/stories/done/2026-10-15_01_deploy.md).

The tests run against a real git repository with a bare repository as origin;
the build is a command the tests replace with a shell one-liner.
"""
import shutil
import subprocess
from types import SimpleNamespace

import pytest

from conftest import load_script

deploy = load_script("deploy-site")

def git(repo, *args):
    return subprocess.run(["git", "-C", str(repo), *args], check=True, capture_output=True, text=True).stdout.strip()


def commit_all(repo, message):
    git(repo, "add", "-A")
    git(repo, "commit", "-qm", message)


@pytest.fixture
def lab(tmp_path, monkeypatch):
    """A lab repo on main, pushed to a bare origin, with research/ and site/
    committed, a built dist/ and a build command that succeeds silently.
    `built` is the marker file the build touches when it runs."""
    origin = tmp_path / "origin.git"
    subprocess.run(["git", "init", "-q", "--bare", str(origin)], check=True)
    repo = tmp_path / "lab"
    (repo / "research" / "questions-claude" / "5.1-workflow-stability").mkdir(parents=True)
    (repo / "research" / "questions-claude" / "5.1-workflow-stability" / "runs.csv").write_text("run_id\n")
    (repo / "site" / "src").mkdir(parents=True)
    (repo / "site" / "src" / "TopBar.tsx").write_text("export {};\n")
    (repo / ".gitignore").write_text("site/dist/\n")
    git(repo.parent, "init", "-q", "-b", "main", str(repo))
    git(repo, "config", "user.email", "t@example.com")
    git(repo, "config", "user.name", "t")
    commit_all(repo, "Add the RQ index as the site's start page")
    git(repo, "remote", "add", "origin", str(origin))
    git(repo, "push", "-q", "-u", "origin", "main")
    dist = repo / "site" / "dist"
    (dist / "rq" / "RQ-stability").mkdir(parents=True)
    (dist / "_astro").mkdir()
    (dist / "index.html").write_text("<h1>index</h1>")
    (dist / "rq" / "RQ-stability" / "index.html").write_text("<h1>RQ</h1>")
    (dist / "_astro" / "site.css").write_text("body{}")
    built = tmp_path / "built"
    monkeypatch.setattr(deploy, "REPO_ROOT", repo)
    monkeypatch.setattr(deploy, "DIST_DIR", dist)
    monkeypatch.setattr(deploy, "BUILD_COMMAND", ["sh", "-c", f"touch {built}"])
    return SimpleNamespace(repo=repo, origin=origin, built=built)


def remote_branches(lab):
    return git(lab.repo, "ls-remote", "--heads", str(lab.origin))


# Rule 2 — checks before anything happens
def test_stops_off_main_with_deploy_only_from_main(lab, capsys):
    """HEAD on a feature branch -> 'deploy only from main', exit 1, no build, no gh-pages."""
    git(lab.repo, "checkout", "-qb", "feature")
    assert deploy.main() == 1
    assert "deploy only from main" in capsys.readouterr().out
    assert not lab.built.exists()
    assert "gh-pages" not in remote_branches(lab)


def test_stops_when_site_is_dirty(lab, capsys):
    """site/src/TopBar.tsx modified -> exit 1, no build."""
    (lab.repo / "site" / "src" / "TopBar.tsx").write_text("export const changed = 1;\n")
    assert deploy.main() == 1
    assert "site/src/TopBar.tsx" in capsys.readouterr().out
    assert not lab.built.exists()


def test_stops_when_research_is_dirty(lab, capsys):
    """a runs.csv under research/ modified -> exit 1, no build."""
    (lab.repo / "research" / "questions-claude" / "5.1-workflow-stability" / "runs.csv").write_text("run_id\nr1\n")
    assert deploy.main() == 1
    assert "5.1-workflow-stability/runs.csv" in capsys.readouterr().out
    assert not lab.built.exists()


def test_stops_when_head_is_not_on_origin_main(lab, capsys):
    """one local commit not yet on origin/main -> exit 1, no build."""
    (lab.repo / "notes.md").write_text("local\n")
    commit_all(lab.repo, "Keep a local note")
    assert deploy.main() == 1
    assert "not on origin/main" in capsys.readouterr().out
    assert not lab.built.exists()


# Rule 3 — builds itself; a build diff stops it
def test_stops_when_the_build_fails(lab, monkeypatch):
    """reading: a failing build publishes nothing and passes its exit code on."""
    monkeypatch.setattr(deploy, "BUILD_COMMAND", ["sh", "-c", "exit 3"])
    assert deploy.main() == 3
    assert "gh-pages" not in remote_branches(lab)


def test_stops_when_the_build_leaves_a_diff_under_research(lab, monkeypatch, capsys):
    """the build rewrites a runs.csv -> nothing published, the diff stat shown, exit 1."""
    runs_csv = lab.repo / "research" / "questions-claude" / "5.1-workflow-stability" / "runs.csv"
    monkeypatch.setattr(deploy, "BUILD_COMMAND", ["sh", "-c", f"echo r1 >> {runs_csv}"])
    assert deploy.main() == 1
    out = capsys.readouterr().out
    assert "5.1-workflow-stability/runs.csv | 1 +" in out
    assert "gh-pages" not in remote_branches(lab)


# Rule 4 — history
def published_files(lab):
    return git(lab.origin, "ls-tree", "-r", "--name-only", "gh-pages").splitlines()


def test_first_deploy_creates_an_orphan_gh_pages_with_dist_and_nojekyll(lab):
    """no gh-pages yet -> origin has gh-pages with index.html, rq/, _astro/, .nojekyll and no main history."""
    assert deploy.main() == 0
    assert published_files(lab) == [".nojekyll", "_astro/site.css", "index.html", "rq/RQ-stability/index.html"]
    assert git(lab.origin, "rev-list", "--count", "gh-pages") == "1"


def test_names_the_main_commit_in_the_message(lab):
    """main 'Add the RQ index as the site's start page' -> 'Deploy <7-char sha>: Add the RQ index as the site's start page'."""
    sha = git(lab.repo, "rev-parse", "HEAD")
    assert deploy.main() == 0
    assert git(lab.origin, "log", "-1", "--format=%s", "gh-pages") == f"Deploy {sha[:7]}: Add the RQ index as the site's start page"


def deploy_a_new_commit(lab, subject):
    (lab.repo / "site" / "src" / "TopBar.tsx").write_text(f"// {subject}\n")
    commit_all(lab.repo, subject)
    git(lab.repo, "push", "-q", "origin", "main")
    return deploy.main()


def test_a_second_deploy_appends_a_commit(lab):
    """two deploys -> two commits on gh-pages, the second on top of the first."""
    assert deploy.main() == 0
    first = git(lab.origin, "rev-parse", "gh-pages")
    assert deploy_a_new_commit(lab, "Mark the sorted column") == 0
    assert git(lab.origin, "rev-list", "--count", "gh-pages") == "2"
    assert git(lab.origin, "rev-parse", "gh-pages~1") == first


def test_a_deploy_drops_files_no_longer_in_dist(lab):
    """reading: gh-pages mirrors dist/ -- a page gone from dist/ is gone from gh-pages."""
    assert deploy.main() == 0
    shutil.rmtree(lab.repo / "site" / "dist" / "rq")
    assert deploy_a_new_commit(lab, "Drop the RQ pages") == 0
    assert published_files(lab) == [".nojekyll", "_astro/site.css", "index.html"]
