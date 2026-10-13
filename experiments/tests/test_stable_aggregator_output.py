"""Stable aggregator output (story site/docs/stories/open/2026-10-12_09_stable-aggregator-output.md).

Readings adopted where the story leaves the shape open: the Docker query is
`running_containers()`, a list of (container name, compose service) pairs, and
the unfinished-run note goes to stderr like batch-plan-from-rq.py's. "Nothing
written" and "rewritten" are observed through the files' mtimes, reset to 0
before the call under test because the kernel's coarse timestamp clock can give
two quick writes the same mtime.
"""
import json
import os
import re

import pytest

from conftest import load_script

agg = load_script("aggregate-by-query")

OUTPUTS = ("runs.csv", "summary.json", "summary.md")
README = """---
id: RQ-x
question: Q?
min_replicates: 1
outcomes: [mccabe_max]
controls:
  kata_base: game-of-life
  prompt: prose
  workflow: wf-a
  model: m
---
"""


def run(exit_reason="ok", run_id="r", started_at="2026-10-01T10:00:00+00:00", **outcomes):
    return {"run_id": run_id, "started_at": started_at, "exit_reason": exit_reason, **outcomes}


def add_run(runs_dir, run_id, exit_reason="ok"):
    """A run of the README's one cell; exit_reason None leaves a stub."""
    metrics = {"kata": "game-of-life-prose", "workflow": "wf-a", "model": "m",
               "final_metrics": {"mccabe_max": 4}}
    if exit_reason is not None:
        metrics["run_status"] = {"exit_reason": exit_reason}
    (runs_dir / run_id).mkdir(parents=True)
    (runs_dir / run_id / "metrics.json").write_text(json.dumps(metrics))


@pytest.fixture
def lab(tmp_path, monkeypatch):
    """An RQ directory with one cell, an empty runs pool, and no container running."""
    rq_dir, runs_dir = tmp_path / "rq", tmp_path / "runs"
    rq_dir.mkdir()
    runs_dir.mkdir()
    (rq_dir / "README.md").write_text(README)
    monkeypatch.setattr(agg, "RUNS_DIR", runs_dir)
    monkeypatch.setattr(agg, "running_containers", list)
    return rq_dir, runs_dir


def aggregate(rq_dir):
    return agg.main(["aggregate-by-query.py", str(rq_dir)])


def age_outputs(rq_dir):
    for name in OUTPUTS:
        os.utime(rq_dir / name, ns=(0, 0))


def mtimes(rq_dir):
    return [(rq_dir / name).stat().st_mtime_ns for name in OUTPUTS]


def fake_docker(tmp_path, monkeypatch, script):
    """Put a `docker` executable running `script` alone on the PATH."""
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    docker = bin_dir / "docker"
    docker.write_text("#!/bin/sh\n" + script + "\n")
    docker.chmod(0o755)
    monkeypatch.setenv("PATH", str(bin_dir))


# R2 — stable order
def test_a_cells_run_list_is_sorted_by_run_id():
    rows = [run(run_id="b"), run(run_id="a")]
    assert [r["id"] for r in agg.cell_summary(rows, outcomes=[])["runs"]] == ["a", "b"]


def test_runs_csv_rows_are_sorted_by_run_id(tmp_path):
    csv_path = tmp_path / "runs.csv"
    agg.write_runs_csv(csv_path, [run(run_id="b"), run(run_id="a")])
    assert list(agg._pd().read_csv(csv_path)["run_id"]) == ["a", "b"]


# R1 — rewrite only on a real change
def test_summary_md_differing_only_in_its_generated_time_stays_untouched(tmp_path):
    fm = {"id": "RQ-x", "question": "Q?", "min_replicates": 1, "outcomes": ["mccabe_max"]}
    cell = {"kata_base": "game-of-life", "prompt": "prose", "workflow": "wf-a", "model": "m"}
    document = agg.summary_document(fm, [cell], {agg.cell_key(cell): [run(mccabe_max=4)]})
    md = tmp_path / "summary.md"
    agg.write_summary(md, fm, [cell], document)
    old = "Generated: 2020-01-01T00:00:00Z"
    md.write_text(re.sub(r"Generated: \S+", old, md.read_text()))

    agg.write_summary(md, fm, [cell], document)

    assert old in md.read_text()


# R3 / R4 — the Docker query
def test_running_containers_reads_names_and_compose_services_from_docker(tmp_path, monkeypatch):
    fake_docker(tmp_path, monkeypatch,
                r"printf 'lab-batch-run-1\tbatch\ndocker-experiment-run-2\texperiment\n'")
    assert agg.running_containers() == [("lab-batch-run-1", "batch"),
                                        ("docker-experiment-run-2", "experiment")]


def test_running_containers_raises_when_the_docker_daemon_does_not_answer(tmp_path, monkeypatch):
    fake_docker(tmp_path, monkeypatch, "echo 'Cannot connect to the Docker daemon' >&2; exit 1")
    with pytest.raises(agg.DockerUnreachable, match="Cannot connect to the Docker daemon"):
        agg.running_containers()


def test_running_containers_raises_when_docker_is_not_installed(tmp_path, monkeypatch):
    monkeypatch.setenv("PATH", str(tmp_path))
    with pytest.raises(agg.DockerUnreachable, match="docker"):
        agg.running_containers()


# R5 — unfinished runs are skipped
def test_matching_skips_a_run_without_exit_reason_and_counts_it(tmp_path):
    for i in range(4):
        add_run(tmp_path, f"ok-{i}")
    add_run(tmp_path, "stub", exit_reason=None)
    cells = agg.expand_cells({"controls": {"kata_base": "game-of-life", "prompt": "prose",
                                           "workflow": "wf-a", "model": "m"}})

    matched, by_cell, unfinished = agg.match_runs(cells, tmp_path)

    expected = ["ok-0", "ok-1", "ok-2", "ok-3"]
    assert [m_file.parent.name for m_file, *_ in matched] == expected
    assert [m_file.parent.name for m_file in by_cell[agg.cell_key(cells[0])]] == expected
    assert unfinished == 1


# R3 — absolute batch lock
def test_refuses_while_a_batch_container_is_running(lab, monkeypatch, capsys):
    rq_dir, runs_dir = lab
    add_run(runs_dir, "a")
    monkeypatch.setattr(agg, "running_containers",
                        lambda: [("docker-batch-run-1f2e", "batch")])

    assert aggregate(rq_dir) != 0
    assert "docker-batch-run-1f2e" in capsys.readouterr().err
    assert not any((rq_dir / name).exists() for name in OUTPUTS)


def test_refuses_while_a_batch_retry_container_is_running(lab, monkeypatch, capsys):
    rq_dir, _runs_dir = lab
    monkeypatch.setattr(agg, "running_containers",
                        lambda: [("docker-batch-retry-run-9c0d", "batch-retry")])

    assert aggregate(rq_dir) != 0
    assert "docker-batch-retry-run-9c0d" in capsys.readouterr().err
    assert not any((rq_dir / name).exists() for name in OUTPUTS)


def test_runs_normally_beside_the_interactive_experiment_container(lab, monkeypatch):
    rq_dir, runs_dir = lab
    add_run(runs_dir, "a")
    monkeypatch.setattr(agg, "running_containers",
                        lambda: [("docker-experiment-run-5a6b", "experiment")])

    assert aggregate(rq_dir) == 0
    assert all((rq_dir / name).exists() for name in OUTPUTS)


# R4 — no Docker, no aggregation
def test_refuses_when_docker_cannot_be_reached(lab, monkeypatch, capsys):
    rq_dir, runs_dir = lab
    add_run(runs_dir, "a")

    def unreachable():
        raise agg.DockerUnreachable("Cannot connect to the Docker daemon")
    monkeypatch.setattr(agg, "running_containers", unreachable)

    assert aggregate(rq_dir) != 0
    assert "Cannot connect to the Docker daemon" in capsys.readouterr().err
    assert not any((rq_dir / name).exists() for name in OUTPUTS)


# R5 through main
def test_reports_the_skipped_unfinished_run_and_leaves_it_out_of_every_file(lab, capsys):
    rq_dir, runs_dir = lab
    for i in range(4):
        add_run(runs_dir, f"ok-{i}")
    add_run(runs_dir, "stub", exit_reason=None)

    assert aggregate(rq_dir) == 0

    assert "stub" not in list(agg._pd().read_csv(rq_dir / "runs.csv")["run_id"])
    cell = json.loads((rq_dir / "summary.json").read_text())["cells"][0]
    assert cell["counts"]["runs"] == 4
    assert "stub" not in [r["id"] for r in cell["runs"]]
    assert "1 unfinished run skipped" in capsys.readouterr().err


# R1 through main
def test_a_second_aggregation_without_new_runs_writes_nothing(lab):
    rq_dir, runs_dir = lab
    add_run(runs_dir, "a")
    aggregate(rq_dir)
    age_outputs(rq_dir)

    assert aggregate(rq_dir) == 0
    assert mtimes(rq_dir) == [0, 0, 0]


def test_one_new_run_rewrites_all_three_files(lab):
    rq_dir, runs_dir = lab
    add_run(runs_dir, "a")
    aggregate(rq_dir)
    md = rq_dir / "summary.md"
    old = "Generated: 2020-01-01T00:00:00Z"
    md.write_text(re.sub(r"Generated: \S+", old, md.read_text()))
    age_outputs(rq_dir)
    add_run(runs_dir, "b")

    assert aggregate(rq_dir) == 0
    assert 0 not in mtimes(rq_dir)
    assert old not in md.read_text()
