"""Broken-run cleanup (story site/docs/stories/done/2026-10-12_06_broken-run-cleanup.md).

Readings adopted where the story leaves the shape open: a run is broken exactly
when rq_facts.is_replicate() says it is not a replicate; the report goes to
stderr; a commit body line reads "- <run id>  <exit_reason>", "unfinished" for
a stub; an RQ whose README cannot be parsed counts as a failed RQ; when the
deletions and re-aggregation leave nothing for git to commit, no commit is made.
Re-aggregation is injected, so the tests do not run the real aggregator over
the real run pool.
"""
import json
import subprocess

import pytest

from conftest import load_script

cleanup = load_script("clean-broken-runs")

ARCHIVED_WORKFLOW = "exact-hybrid-v4.1-refactor-vocab-cc"


def git(root, *args):
    return subprocess.run(["git", *args], cwd=root, check=True,
                          capture_output=True, text=True).stdout


def add_run(root, run_id, exit_reason="ok", workflow="wf-a", raw=None):
    """A run of kata game-of-life-prose; exit_reason None leaves a stub, raw
    replaces metrics.json verbatim, raw "" leaves no metrics.json at all."""
    run_dir = root / "experiments" / "runs" / run_id
    run_dir.mkdir(parents=True)
    if raw == "":
        (run_dir / "run.log").write_text("started\n")
        return
    metrics = {"kata": "game-of-life-prose", "workflow": workflow, "model": "m"}
    if exit_reason is not None:
        metrics["run_status"] = {"exit_reason": exit_reason}
    (run_dir / "metrics.json").write_text(raw if raw is not None else json.dumps(metrics))


def add_rq(root, slug, rq_id, workflow="wf-a"):
    rq_dir = root / "research" / "questions-x" / slug
    rq_dir.mkdir(parents=True)
    (rq_dir / "README.md").write_text(
        f"---\nid: {rq_id}\nquestion: Q?\nmin_replicates: 1\noutcomes: [mccabe_max]\n"
        f"controls:\n  kata_base: game-of-life\n  prompt: prose\n"
        f"  workflow: {workflow}\n  model: m\n---\n")
    return rq_dir


def commit_all(root):
    git(root, "add", "-A")
    git(root, "commit", "-q", "-m", "setup")


class Reaggregation:
    """Stands in for aggregate-by-query.py: records each RQ dir and writes a
    summary.md into it, failing for the dirs named in `fail`."""

    def __init__(self, fail=()):
        self.calls, self.fail = [], set(fail)

    def __call__(self, rq_dir):
        self.calls.append(rq_dir.name)
        if rq_dir.name in self.fail:
            return False
        (rq_dir / "summary.md").write_text(f"aggregated {len(self.calls)}\n")
        return True


@pytest.fixture
def lab(tmp_path, monkeypatch):
    """An empty lab repository with one commit and no container running."""
    root = tmp_path / "lab"
    (root / "experiments" / "runs" / "_archive").mkdir(parents=True)
    (root / "research").mkdir()
    git(root, "init", "-q")
    git(root, "config", "user.email", "lab@example.com")
    git(root, "config", "user.name", "Lab")
    (root / "notes.md").write_text("notes\n")
    commit_all(root)
    monkeypatch.setattr(cleanup.agg, "running_containers", list)
    return root


def clean(root, reaggregate=None):
    return cleanup.clean(root, reaggregate or Reaggregation())


def run_ids(root):
    return sorted(d.name for d in (root / "experiments" / "runs").iterdir())


def head_message(root):
    return git(root, "log", "-1", "--format=%B")


def commit_count(root):
    return int(git(root, "rev-list", "--count", "HEAD"))


# R1 — what counts as broken
@pytest.mark.parametrize("exit_reason", ["timeout", "rate-limited", "quota-exhausted",
                                         "provider-refusal", "error-1"])
def test_a_run_ending_other_than_ok_is_broken(exit_reason):
    assert cleanup.is_broken({"run_status": {"exit_reason": exit_reason}})


def test_a_run_ending_ok_is_not_broken():
    assert not cleanup.is_broken({"run_status": {"exit_reason": "ok"}})


def test_a_stub_without_exit_reason_is_broken():
    assert cleanup.is_broken({"kata": "game-of-life-prose"})


# R6 — nothing to do
def test_no_broken_run_changes_nothing_and_exits_zero(lab, capsys):
    add_run(lab, "a")
    commit_all(lab)
    reaggregate = Reaggregation()

    assert clean(lab, reaggregate) == 0

    assert run_ids(lab) == ["_archive", "a"]
    assert reaggregate.calls == []
    assert commit_count(lab) == 2
    assert "no broken runs" in capsys.readouterr().err


# R1 / R2 — what is deleted
def test_deletes_every_broken_run_and_keeps_the_ok_ones(lab):
    add_run(lab, "ok-1")
    add_run(lab, "timeout-1", "timeout")
    add_run(lab, "rate-1", "rate-limited")
    add_run(lab, "quota-1", "quota-exhausted")
    add_run(lab, "stub-1", None)
    commit_all(lab)

    assert clean(lab) == 0
    assert run_ids(lab) == ["_archive", "ok-1"]


def test_keeps_and_reports_a_run_without_readable_metrics(lab, capsys):
    add_run(lab, "no-metrics", raw="")
    add_run(lab, "bad-json", raw="{not json")
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)

    clean(lab)

    assert run_ids(lab) == ["_archive", "bad-json", "no-metrics"]
    err = capsys.readouterr().err
    assert "no-metrics" in err
    assert "bad-json" in err


def test_leaves_archive_alone_and_out_of_the_report(lab, capsys):
    archived = lab / "experiments" / "runs" / "_archive" / "old-timeout"
    archived.mkdir()
    (archived / "metrics.json").write_text(json.dumps({"run_status": {"exit_reason": "timeout"}}))
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)

    clean(lab)

    assert archived.is_dir()
    assert "_archive" not in capsys.readouterr().err


def test_leaves_a_dot_directory_alone_and_out_of_the_report(lab, capsys):
    store = lab / "experiments" / "runs" / ".pnpm-store"
    (store / "v3").mkdir(parents=True)
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)

    clean(lab)

    assert store.is_dir()
    assert ".pnpm-store" not in capsys.readouterr().err


def test_deletes_an_untracked_leftover_and_keeps_it_out_of_the_commit(lab, capsys):
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)
    add_run(lab, "leftover-1", raw="")

    assert clean(lab) == 0

    assert run_ids(lab) == ["_archive"]
    assert "leftover-1" not in head_message(lab)
    assert "leftover-1" in capsys.readouterr().err


def test_deletes_leftovers_even_when_no_run_is_broken(lab, capsys):
    add_run(lab, "ok-1")
    commit_all(lab)
    add_run(lab, "leftover-1", raw="")

    assert clean(lab) == 0

    assert run_ids(lab) == ["_archive", "ok-1"]
    assert commit_count(lab) == 2
    assert "no broken runs" in capsys.readouterr().err


def test_deletes_a_broken_run_that_is_not_committed_yet(lab):
    add_run(lab, "timeout-1", "timeout")

    clean(lab)

    assert run_ids(lab) == ["_archive"]


# R3 — absolute batch lock
def test_refuses_while_a_batch_container_is_running(lab, monkeypatch, capsys):
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)
    monkeypatch.setattr(cleanup.agg, "running_containers",
                        lambda: [("docker-batch-run-1f2e", "batch")])

    assert clean(lab) != 0
    assert run_ids(lab) == ["_archive", "timeout-1"]
    assert "docker-batch-run-1f2e" in capsys.readouterr().err


def test_refuses_when_docker_cannot_be_reached(lab, monkeypatch):
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)

    def unreachable():
        raise cleanup.agg.DockerUnreachable("Cannot connect to the Docker daemon")
    monkeypatch.setattr(cleanup.agg, "running_containers", unreachable)

    assert clean(lab) != 0
    assert run_ids(lab) == ["_archive", "timeout-1"]


def test_runs_beside_the_interactive_experiment_container(lab, monkeypatch):
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)
    monkeypatch.setattr(cleanup.agg, "running_containers",
                        lambda: [("docker-experiment-run-5a6b", "experiment")])

    assert clean(lab) == 0
    assert run_ids(lab) == ["_archive"]


# R4 — re-aggregate the affected RQs
def test_reaggregates_only_the_rqs_that_selected_a_deleted_run(lab):
    add_rq(lab, "1.1-affected", "RQ-a")
    add_rq(lab, "1.2-untouched", "RQ-b", workflow="wf-b")
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)
    reaggregate = Reaggregation()

    clean(lab, reaggregate)

    assert reaggregate.calls == ["1.1-affected"]


def test_a_broken_run_no_rq_selects_is_deleted_without_reaggregation(lab):
    add_rq(lab, "1.2-untouched", "RQ-b", workflow="wf-b")
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)
    reaggregate = Reaggregation()

    assert clean(lab, reaggregate) == 0
    assert run_ids(lab) == ["_archive"]
    assert reaggregate.calls == []


def test_skips_an_affected_rq_naming_an_archived_workflow(lab, capsys):
    add_rq(lab, "1.10-archived", "RQ-archived", workflow=ARCHIVED_WORKFLOW)
    add_run(lab, "timeout-1", "timeout", workflow=ARCHIVED_WORKFLOW)
    commit_all(lab)
    reaggregate = Reaggregation()

    assert clean(lab, reaggregate) == 0
    assert reaggregate.calls == []
    assert "RQ-archived" in capsys.readouterr().err


# R5 — one commit of its own paths
def test_commits_deletions_and_reaggregated_rq_files_in_one_commit(lab):
    rq_dir = add_rq(lab, "1.1-affected", "RQ-a")
    add_run(lab, "timeout-1", "timeout")
    add_run(lab, "stub-1", None)
    commit_all(lab)

    clean(lab)

    assert commit_count(lab) == 3
    assert git(lab, "status", "--porcelain") == ""
    assert (rq_dir / "summary.md").read_text() == git(
        lab, "show", "HEAD:research/questions-x/1.1-affected/summary.md")


def test_the_commit_message_names_count_runs_and_rqs(lab):
    add_rq(lab, "1.1-affected", "RQ-a")
    add_run(lab, "timeout-1", "timeout")
    add_run(lab, "quota-1", "quota-exhausted")
    add_run(lab, "stub-1", None)
    commit_all(lab)

    clean(lab)

    message = head_message(lab)
    assert message.splitlines()[0] == "Delete 3 broken runs"
    assert "- quota-1  quota-exhausted" in message
    assert "- stub-1  unfinished" in message
    assert "- timeout-1  timeout" in message
    assert "RQ-a" in message


def test_other_changes_in_the_working_tree_stay_uncommitted(lab):
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)
    (lab / "notes.md").write_text("edited\n")
    (lab / "staged.md").write_text("staged\n")
    git(lab, "add", "staged.md")

    clean(lab)

    assert "notes.md" not in git(lab, "show", "--name-only", "--format=", "HEAD")
    assert "staged.md" not in git(lab, "show", "--name-only", "--format=", "HEAD")
    assert git(lab, "status", "--porcelain").splitlines() == [" M notes.md", "A  staged.md"]


def test_makes_no_commit_when_only_uncommitted_runs_were_deleted(lab):
    add_run(lab, "timeout-1", "timeout")

    assert clean(lab) == 0
    assert commit_count(lab) == 1


# R6 — a failed re-aggregation
def test_a_failed_reaggregation_still_commits_the_rest_and_exits_non_zero(lab, capsys):
    add_rq(lab, "1.1-fails", "RQ-fails")
    ok_dir = add_rq(lab, "1.2-works", "RQ-works")
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)

    assert clean(lab, Reaggregation(fail={"1.1-fails"})) != 0

    assert run_ids(lab) == ["_archive"]
    assert commit_count(lab) == 3
    assert (ok_dir / "summary.md").is_file()
    assert git(lab, "status", "--porcelain") == ""
    assert "RQ-fails" in capsys.readouterr().err


def test_an_unparseable_rq_counts_as_failed(lab, capsys):
    rq_dir = lab / "research" / "questions-x" / "1.3-broken-readme"
    rq_dir.mkdir(parents=True)
    (rq_dir / "README.md").write_text("id: RQ-broken\nno frontmatter\n")
    add_run(lab, "timeout-1", "timeout")
    commit_all(lab)

    assert clean(lab) != 0
    assert run_ids(lab) == ["_archive"]
    assert "1.3-broken-readme" in capsys.readouterr().err
