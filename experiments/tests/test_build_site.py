"""Build command (story site/docs/stories/open/2026-10-12_04_build-command.md).

Readings adopted where the story leaves the shape open: the build loads the
aggregator in-process. The batch lock is asked once, up front, through the
aggregator's own running_batch_containers(); DockerUnreachable is "cannot reach
Docker". Each RQ is aggregated by calling the aggregator's main() with its
stderr captured: exit 0 is read from the "wrote"/"unchanged" lines, exit 1 with
an "ERROR: selector names" line is the archived-workflow skip, and anything
else, a raised exception included, is a failure whose first error line is the
first captured stderr line or the exception's first line. The export and the
Astro build are commands the tests replace with shell one-liners; the clock is
replaced by a list of readings.
"""
import json
import subprocess

import pytest

from conftest import load_script

build = load_script("build-site")
agg = build.agg


def readme(rq_id, workflow="wf-a", model="m"):
    controls = f"  kata_base: game-of-life\n  prompt: prose\n  workflow: {workflow}\n"
    if model:
        controls += f"  model: {model}\n"
    return (f"---\nid: {rq_id}\nquestion: Q?\nmin_replicates: 1\n"
            f"outcomes: [mccabe_max]\ncontrols:\n{controls}---\n")


def git(repo, *args):
    subprocess.run(["git", "-C", str(repo), *args], check=True, capture_output=True)


@pytest.fixture
def lab(tmp_path, monkeypatch):
    """A git repo with an empty research/ tree, an empty runs pool, no container
    running, and export and Astro build commands that succeed silently."""
    repo = tmp_path / "lab"
    (repo / "research").mkdir(parents=True)
    (repo / "site").mkdir()
    runs_dir = tmp_path / "runs"
    runs_dir.mkdir()
    git(repo, "init", "-q")
    git(repo, "config", "user.email", "t@example.com")
    git(repo, "config", "user.name", "t")
    monkeypatch.setattr(build, "REPO_ROOT", repo)
    monkeypatch.setattr(build, "RESEARCH_DIR", repo / "research")
    monkeypatch.setattr(build, "SITE_DIR", repo / "site")
    monkeypatch.setattr(build, "DIST_RQ_DIR", tmp_path / "dist" / "rq")
    monkeypatch.setattr(build, "EXPORT_COMMAND", ["true"])
    monkeypatch.setattr(build, "ASTRO_COMMAND", ["true"])
    monkeypatch.setattr(agg, "RUNS_DIR", runs_dir)
    monkeypatch.setattr(agg, "running_containers", list)
    return repo


def add_rq(repo, rel_dir, rq_id, **fields):
    rq_dir = repo / "research" / rel_dir
    rq_dir.mkdir(parents=True)
    (rq_dir / "README.md").write_text(readme(rq_id, **fields))
    return rq_dir


def add_run(run_id, started_at="2026-10-01T10:00:00+00:00"):
    run_dir = agg.RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)
    (run_dir / "metrics.json").write_text(json.dumps(
        {"kata": "game-of-life-prose", "workflow": "wf-a", "model": "m",
         "started_at": started_at, "run_status": {"exit_reason": "ok"},
         "final_metrics": {"mccabe_max": 4}}))


def aggregated_and_committed(repo, *rq_dirs):
    """The state after an earlier build: outputs written and committed."""
    for rq_dir in rq_dirs:
        assert agg.main(["aggregate-by-query.py", str(rq_dir)]) == 0
    git(repo, "add", "-A")
    git(repo, "commit", "-q", "-m", "earlier build")


def run_build():
    return build.main()


# --- R1: aggregate every RQ, one line each ---------------------------------

def test_an_rq_with_nothing_new_is_reported_unchanged(lab, capfd):
    rq_dir = add_rq(lab, "questions-x/stability", "RQ-stability")
    add_run("r1")
    aggregated_and_committed(lab, rq_dir)
    capfd.readouterr()

    run_build()

    assert "RQ-stability  unchanged" in capfd.readouterr().out.splitlines()


def test_a_backfilled_start_time_reports_the_two_rewritten_files(lab, capfd):
    rq_dir = add_rq(lab, "questions-pi/model-quality", "RQ-model-quality-pi")
    add_run("r1", started_at="")
    aggregated_and_committed(lab, rq_dir)
    add_run("r1", started_at="2026-10-01T10:00:00+00:00")
    capfd.readouterr()

    run_build()

    assert ("RQ-model-quality-pi  wrote runs.csv, summary.json"
            in capfd.readouterr().out.splitlines())


def test_rqs_are_aggregated_in_directory_path_order_and_named_by_id(lab, capfd):
    add_rq(lab, "questions-x/b-second", "RQ-a")
    add_rq(lab, "questions-x/a-first", "RQ-z")

    run_build()

    lines = capfd.readouterr().out.splitlines()
    assert lines.index("RQ-z  wrote runs.csv, summary.json, summary.md") < lines.index(
        "RQ-a  wrote runs.csv, summary.json, summary.md")


def test_rqs_outside_the_main_subtrees_are_aggregated_too(lab, capfd):
    add_rq(lab, "workflow-dev/lean", "RQ-lean")
    add_rq(lab, "kata-dev/probe", "RQ-probe")

    run_build()

    out = capfd.readouterr().out.splitlines()
    assert "RQ-lean  wrote runs.csv, summary.json, summary.md" in out
    assert "RQ-probe  wrote runs.csv, summary.json, summary.md" in out


# --- R2: archived workflow, skip with a note -------------------------------

def archive(monkeypatch, *workflows):
    monkeypatch.setattr(agg, "is_archived", lambda name: name in workflows)


def test_an_rq_naming_an_archived_workflow_is_skipped_with_a_note(lab, capfd, monkeypatch):
    add_rq(lab, "questions-x/a-old", "RQ-old", workflow="wf-old")
    add_rq(lab, "questions-x/b-new", "RQ-new")
    archive(monkeypatch, "wf-old")

    run_build()

    out = capfd.readouterr().out.splitlines()
    assert "RQ-old  skipped — names an archived workflow" in out
    assert "RQ-new  wrote runs.csv, summary.json, summary.md" in out


def test_a_skip_alone_leaves_the_exit_code_at_zero(lab, monkeypatch):
    add_rq(lab, "questions-x/old", "RQ-old", workflow="wf-old")
    add_rq(lab, "questions-x/new", "RQ-new")
    archive(monkeypatch, "wf-old")

    assert run_build() == 0


# --- R3: an aggregation failure stops the build before the export ----------

def test_a_crashing_rq_is_reported_failed_with_its_first_error_line(lab, capfd):
    add_rq(lab, "questions-x/broken", "RQ-broken", model=None)

    run_build()

    out = capfd.readouterr().out.splitlines()
    assert [line for line in out if line.startswith("RQ-broken")] == [
        "RQ-broken  FAILED — cell missing 'model': "
        "{'kata_base': 'game-of-life', 'prompt': 'prose', 'workflow': 'wf-a'}"]


def test_an_rq_the_aggregator_refuses_is_failed_with_its_first_error_line(lab, capfd,
                                                                          monkeypatch):
    """Reading: a non-zero exit other than the archive skip is a failure too,
    e.g. a batch that started after the build's own lock check."""
    add_rq(lab, "questions-x/late", "RQ-late")
    monkeypatch.setattr(agg, "batch_lock_refusal", lambda: "a batch is running (lab-batch-1)")

    run_build()

    assert ("RQ-late  FAILED — ERROR: a batch is running (lab-batch-1)"
            in capfd.readouterr().out.splitlines())


def test_the_rqs_after_a_failure_are_still_aggregated(lab, capfd):
    add_rq(lab, "questions-x/a-broken", "RQ-broken", model=None)
    add_rq(lab, "questions-x/b-fine", "RQ-fine")

    run_build()

    assert ("RQ-fine  wrote runs.csv, summary.json, summary.md"
            in capfd.readouterr().out.splitlines())


# A README the build cannot read an id from (left open in the build-command story).

def add_bare_rq(repo, rel_dir):
    rq_dir = repo / "research" / rel_dir
    rq_dir.mkdir(parents=True)
    (rq_dir / "README.md").write_text("# An RQ without frontmatter\n")
    return rq_dir


def test_a_readme_without_frontmatter_is_failed_under_its_directory(lab, capfd):
    """'questions-x/a-bare  FAILED — <path>/README.md: no YAML frontmatter (must start with ---)'."""
    rq_dir = add_bare_rq(lab, "questions-x/a-bare")

    run_build()

    assert (f"questions-x/a-bare  FAILED — {rq_dir}/README.md: no YAML frontmatter (must start with ---)"
            in capfd.readouterr().out.splitlines())


def test_the_rqs_after_a_readme_without_frontmatter_are_still_aggregated(lab, capfd):
    """the build goes on to RQ-fine and the step exits with 1."""
    add_bare_rq(lab, "questions-x/a-bare")
    add_rq(lab, "questions-x/b-fine", "RQ-fine")

    assert build.aggregate_all(lab / "research") == 1
    assert ("RQ-fine  wrote runs.csv, summary.json, summary.md"
            in capfd.readouterr().out.splitlines())


def test_an_rq_without_an_id_is_aggregated_under_its_directory(lab, capfd):
    """frontmatter without id: -> 'questions-x/no-id  wrote runs.csv, summary.json, summary.md'."""
    rq_dir = add_rq(lab, "questions-x/no-id", "RQ-unused")
    readme_path = rq_dir / "README.md"
    readme_path.write_text(readme_path.read_text().replace("id: RQ-unused\n", ""))

    run_build()

    assert ("questions-x/no-id  wrote runs.csv, summary.json, summary.md"
            in capfd.readouterr().out.splitlines())


def test_an_empty_frontmatter_is_named_by_its_directory(lab, capfd):
    """'---\\n---\\n' parses to None -> the line still names 'questions-x/empty'."""
    rq_dir = lab / "research" / "questions-x" / "empty"
    rq_dir.mkdir(parents=True)
    (rq_dir / "README.md").write_text("---\n---\n")

    run_build()

    assert any(line.startswith("questions-x/empty  FAILED — ")
               for line in capfd.readouterr().out.splitlines())


def export_marker(lab, monkeypatch):
    """Replace the export with a command that leaves a file behind."""
    marker = lab.parent / "exported"
    monkeypatch.setattr(build, "EXPORT_COMMAND", ["touch", str(marker)])
    return marker


def test_an_aggregation_failure_stops_before_the_export(lab, monkeypatch):
    add_rq(lab, "questions-x/broken", "RQ-broken", model=None)
    exported = export_marker(lab, monkeypatch)

    assert run_build() == 1
    assert not exported.exists()


# --- R4: batch lock ---------------------------------------------------------

def test_a_running_batch_stops_the_build_before_the_first_rq(lab, capfd, monkeypatch):
    add_rq(lab, "questions-x/stability", "RQ-stability")
    monkeypatch.setattr(agg, "running_containers", lambda: [("docker-batch-1", "batch")])

    assert run_build() == 1
    out = capfd.readouterr().out.splitlines()
    assert "build-site: a batch is running — nothing aggregated" in out
    assert not [line for line in out if line.startswith("RQ-")]


def docker_down():
    raise agg.DockerUnreachable("Cannot connect to the Docker daemon")


def test_unreachable_docker_stops_the_build_before_the_first_rq(lab, capfd, monkeypatch):
    add_rq(lab, "questions-x/stability", "RQ-stability")
    monkeypatch.setattr(agg, "running_containers", docker_down)

    assert run_build() == 1
    out = capfd.readouterr().out.splitlines()
    assert "build-site: cannot reach Docker — nothing aggregated" in out
    assert not [line for line in out if line.startswith("RQ-")]


# --- R5: export and Astro build ---------------------------------------------

def tool(script):
    return ["sh", "-c", script]


@pytest.mark.usefixtures("lab")
def test_the_export_and_the_astro_build_run_in_order_with_their_output(capfd, monkeypatch):
    monkeypatch.setattr(build, "EXPORT_COMMAND", tool("echo exported; echo export-note >&2"))
    monkeypatch.setattr(build, "ASTRO_COMMAND", tool("echo astro line 1; echo astro line 2"))

    assert run_build() == 0
    captured = capfd.readouterr()
    out = captured.out.splitlines()
    assert out.index("exported") < out.index("astro line 1") < out.index("astro line 2")
    assert "export-note" in captured.err


def test_a_failing_export_is_shown_and_skips_the_astro_build(lab, capfd, monkeypatch):
    astro_ran = lab.parent / "astro-ran"
    monkeypatch.setattr(build, "EXPORT_COMMAND",
                        tool("echo 'export-site-data: RQ-x: no factors' >&2; exit 1"))
    monkeypatch.setattr(build, "ASTRO_COMMAND", ["touch", str(astro_ran)])

    assert run_build() == 1
    assert "export-site-data: RQ-x: no factors" in capfd.readouterr().err
    assert not astro_ran.exists()


@pytest.mark.usefixtures("lab")
def test_a_failing_astro_build_stops_with_its_own_exit_code(capfd, monkeypatch):
    monkeypatch.setattr(build, "ASTRO_COMMAND", tool("exit 3"))

    assert run_build() == 3
    assert capfd.readouterr().out.splitlines()[-1] == "build stopped after astro build (exit 3)"


# --- R6: duration after every step ------------------------------------------

def clock_readings(monkeypatch, *seconds):
    """The clock reads these values in turn, then stays at the last one."""
    values = iter(seconds)
    last = [0.0]

    def clock():
        last[0] = next(values, last[0])
        return last[0]

    monkeypatch.setattr(build, "clock", clock)


# Build start, then start and end of aggregate, export and astro build, then build end.
TIMELINE = (0.0, 0.0, 16.1, 16.1, 16.5, 16.5, 19.7, 21.4)


@pytest.mark.usefixtures("lab")
def test_each_step_prints_its_duration_as_it_finishes(capfd, monkeypatch):
    monkeypatch.setattr(build, "EXPORT_COMMAND", tool("echo exported"))
    monkeypatch.setattr(build, "ASTRO_COMMAND", tool("echo astro done"))
    clock_readings(monkeypatch, *TIMELINE)

    run_build()

    out = capfd.readouterr().out.splitlines()
    assert out.index("aggregate 16.1 s") < out.index("exported") < out.index("export 0.4 s")
    assert out.index("export 0.4 s") < out.index("astro done") < out.index("astro build 3.2 s")


@pytest.mark.usefixtures("lab")
def test_a_failing_step_prints_its_duration_too(capfd, monkeypatch):
    monkeypatch.setattr(build, "EXPORT_COMMAND", tool("exit 1"))
    clock_readings(monkeypatch, *TIMELINE)

    run_build()

    out = capfd.readouterr().out.splitlines()
    assert out.index("export 0.4 s") < out.index("build stopped after export (exit 1)")


# --- R7: closing ------------------------------------------------------------

def test_without_changes_under_research_the_diff_prints_no_changes(lab, capfd):
    rq_dir = add_rq(lab, "questions-x/stability", "RQ-stability")
    aggregated_and_committed(lab, rq_dir)
    capfd.readouterr()

    run_build()

    assert "no changes" in capfd.readouterr().out.splitlines()


def test_changes_under_research_print_the_diff_stat(lab, capfd):
    rq_dir = add_rq(lab, "questions-x/stability", "RQ-stability")
    aggregated_and_committed(lab, rq_dir)
    add_run("r1")
    capfd.readouterr()

    run_build()

    out = capfd.readouterr().out
    assert "research/questions-x/stability/runs.csv" in out
    assert "3 files changed" in out
    assert "no changes" not in out.splitlines()


def test_changes_outside_research_are_left_out_of_the_diff(lab, capfd):
    rq_dir = add_rq(lab, "questions-x/stability", "RQ-stability")
    (lab / "notes.md").write_text("draft\n")
    aggregated_and_committed(lab, rq_dir)
    (lab / "notes.md").write_text("an unrelated uncommitted edit\n")
    capfd.readouterr()

    run_build()

    out = capfd.readouterr().out
    assert "no changes" in out.splitlines()
    assert "notes.md" not in out


@pytest.mark.usefixtures("lab")
def test_a_successful_build_ends_with_page_count_and_total_time(capfd, monkeypatch):
    pages = " ".join(f"{build.DIST_RQ_DIR}/RQ-{n}" for n in range(46))
    monkeypatch.setattr(build, "ASTRO_COMMAND", tool(
        f"for d in {pages}; do mkdir -p $d && touch $d/index.html; done"))
    clock_readings(monkeypatch, *TIMELINE)

    assert run_build() == 0
    assert capfd.readouterr().out.splitlines()[-1] == "built 46 pages in 21.4 s"


def test_a_build_stopped_in_aggregate_closes_with_diff_stat_and_stop_line(lab, capfd):
    rq_dir = add_rq(lab, "questions-x/a-stability", "RQ-stability")
    aggregated_and_committed(lab, rq_dir)
    add_run("r1")
    add_rq(lab, "questions-x/b-broken", "RQ-broken", model=None)
    capfd.readouterr()

    assert run_build() == 1
    out = capfd.readouterr().out.splitlines()
    assert "3 files changed" in out[-2]
    assert out[-1] == "build stopped after aggregate (exit 1)"


@pytest.mark.usefixtures("lab")
def test_the_batch_lock_is_followed_by_the_closing(capfd, monkeypatch):
    monkeypatch.setattr(agg, "running_containers", lambda: [("docker-batch-1", "batch")])
    clock_readings(monkeypatch, 0.0)

    run_build()

    assert capfd.readouterr().out.splitlines() == [
        "build-site: a batch is running — nothing aggregated",
        "aggregate 0.0 s",
        "no changes",
        "build stopped after aggregate (exit 1)"]
