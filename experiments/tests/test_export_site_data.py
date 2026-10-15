"""Site data export, export side: export-site-data.py turns summary.json, the RQ
frontmatter, LINEAGE.yaml and the metric registry into the site's JSON
(story site/docs/stories/open/2026-10-11_05_site-data-export.md, R7 and R8).

Reading adopted where the story leaves the shape open: one RQ file carries
id, question, min_replicates, outcomes, katas, cells and workflowStyles in the
shape the site's ResultTableInput reads; a cell's `values` hold the site's
ValueCell form, and an outcome with no usable value is null. A stop raises
ExportError, which the command line turns into exit code 1.
"""
import json

import pytest

from conftest import load_script


def export_site_data():
    # Loaded per test: the module does not exist before its first behavior.
    return load_script("export-site-data")


def summary_cell(workflow="wf-a", kata="game-of-life-prose", outcomes=None, runs=1):
    return {"kata": kata, "workflow": workflow, "model": "m",
            "counts": {"runs": runs, "timeouts": 0, "infra": 0, "provider_refusals": 0},
            "runs": [{"id": f"run-{i}", "started_at": "2026-10-01T10:00:00+00:00",
                      "exit_reason": "ok"} for i in range(runs)],
            "outcomes": outcomes or {}}


DEFAULT_DESIGN = "factors:\n  workflow: [wf-a]\n"


def make_rq(research, rq_id, cells, outcomes=("mccabe_max",), tree="questions-claude",
            design=DEFAULT_DESIGN):
    """`design` is the frontmatter's factors/controls/closed block, verbatim."""
    rq_dir = research / tree / f"1.1-{rq_id.lower()}"
    rq_dir.mkdir(parents=True)
    listed = "".join(f"  - {o}\n" for o in outcomes)
    rq_dir.joinpath("README.md").write_text(
        f"---\nid: {rq_id}\nquestion: Does it help?\nmin_replicates: 5\n{design}"
        f"outcomes:\n{listed}---\n\nBody.\n")
    rq_dir.joinpath("summary.json").write_text(json.dumps({"cells": cells}))
    return rq_dir


@pytest.fixture
def lab(tmp_path):
    """A tiny lab: research tree, LINEAGE.yaml, metric registry, output dir."""
    lineage = tmp_path / "LINEAGE.yaml"
    lineage.write_text(
        "categories:\n  baselines:\n    workflows:\n"
        "      wf-a: {description: \"Workflow A.\"}\n"
        "      wf-b: {description: \"Workflow B.\"}\n"
        "      wf-unused: {description: \"Never referenced.\"}\n"
        "      wf-bare: {arm: none}\n")
    registry = tmp_path / "metrics-registry.yaml"
    registry.write_text(
        "mccabe_max: {group: Code quality, direction: lower}\n"
        "tests_passing: {group: Correctness, direction: higher}\n"
        "predictions_correct_rate: {group: TDD discipline, direction: higher}\n"
        "mutation_score: {group: Code quality, direction: higher}\n"
        "cost_usd: {group: Cost, direction: lower}\n")
    return {"research": tmp_path / "research", "lineage": lineage,
            "registry": registry, "out": tmp_path / "data"}


def run_export(lab, rq_dirs):
    export_site_data().export(rq_dirs, lab["lineage"], lab["registry"], lab["out"])
    return lab["out"]


# R7 — one file per main RQ plus workflows.json, no meta.json
def test_writes_one_file_per_rq_with_its_question_and_cells(lab):
    rq = make_rq(lab["research"], "RQ-x", [summary_cell()])
    out = run_export(lab, [rq])
    data = json.loads((out / "rq" / "RQ-x.json").read_text())
    assert (data["id"], data["question"], data["min_replicates"], data["outcomes"],
            data["katas"]) == ("RQ-x", "Does it help?", 5, ["mccabe_max"],
                               ["game-of-life-prose"])
    assert [(c["kata"], c["workflow"], c["model"]) for c in data["cells"]] == [
        ("game-of-life-prose", "wf-a", "m")]


def values_of(lab, outcome, stats):
    rq = make_rq(lab["research"], "RQ-x", [summary_cell(outcomes={outcome: stats})],
                 outcomes=(outcome,))
    data = json.loads((run_export(lab, [rq]) / "rq" / "RQ-x.json").read_text())
    return data["cells"][0]["values"]


def test_maps_a_numeric_outcome_to_its_mean_sd_and_n(lab):
    stats = {"kind": "num", "n": 4, "null_count": 0, "mean": 5.0, "sd": 0.82}
    assert values_of(lab, "mccabe_max", stats)["mccabe_max"] == {
        "kind": "num", "n": 4, "value": 5.0, "sd": 0.82}


def test_maps_a_boolean_outcome_to_k_of_n(lab):
    stats = {"kind": "bool", "n": 3, "k": 2, "null_count": 1}
    assert values_of(lab, "tests_passing", stats)["tests_passing"] == {
        "kind": "bool", "n": 3, "k": 2, "value": pytest.approx(2 / 3)}


def test_maps_a_pooled_rate_to_k_of_t(lab):
    stats = {"kind": "rate", "n": 2, "k": 8, "t": 10, "null_count": 2}
    assert values_of(lab, "predictions_correct_rate", stats)["predictions_correct_rate"] == {
        "kind": "rate", "k": 8, "t": 10, "value": 0.8}


def test_maps_an_outcome_without_usable_values_to_null(lab):
    stats = {"kind": "num", "n": 0, "null_count": 5}
    assert values_of(lab, "mutation_score", stats)["mutation_score"] is None


def test_maps_a_single_numeric_value_without_sd(lab):
    stats = {"kind": "num", "n": 1, "null_count": 0, "mean": 7}
    assert values_of(lab, "mccabe_max", stats)["mccabe_max"] == {
        "kind": "num", "n": 1, "value": 7}


def test_keeps_each_cells_runs_and_counters(lab):
    cell = summary_cell(runs=2)
    rq = make_rq(lab["research"], "RQ-x", [cell])
    exported = json.loads((run_export(lab, [rq]) / "rq" / "RQ-x.json").read_text())["cells"][0]
    assert (exported["runs"], exported["counts"]) == (cell["runs"], cell["counts"])


def test_marks_each_workflow_as_test_list_or_ad_hoc(lab, monkeypatch):
    rq = make_rq(lab["research"], "RQ-x", [summary_cell("wf-a"), summary_cell("wf-b")])
    module = export_site_data()
    monkeypatch.setattr(module.agg, "uses_test_list", {"wf-a": True, "wf-b": False}.get)
    module.export([rq], lab["lineage"], lab["registry"], lab["out"])
    data = json.loads((lab["out"] / "rq" / "RQ-x.json").read_text())
    assert data["workflowStyles"] == {"wf-a": "test list", "wf-b": "ad hoc"}


def test_writes_a_file_for_an_rq_without_runs(lab):
    rq = make_rq(lab["research"], "RQ-empty", [summary_cell(runs=0)])
    data = json.loads((run_export(lab, [rq]) / "rq" / "RQ-empty.json").read_text())
    assert data["cells"][0]["counts"]["runs"] == 0


def test_writes_the_description_of_every_referenced_workflow(lab):
    first = make_rq(lab["research"], "RQ-a", [summary_cell("wf-a")])
    second = make_rq(lab["research"], "RQ-b", [summary_cell("wf-b"), summary_cell("wf-a")])
    workflows = json.loads((run_export(lab, [first, second]) / "workflows.json").read_text())
    assert workflows == {"wf-a": {"description": "Workflow A."},
                         "wf-b": {"description": "Workflow B."}}


def test_writes_no_meta_json(lab):
    out = run_export(lab, [make_rq(lab["research"], "RQ-x", [summary_cell()])])
    assert sorted(p.name for p in out.iterdir()) == ["rq", "workflows.json"]


def test_finds_only_main_rqs_under_the_questions_subtrees(lab):
    claude = make_rq(lab["research"], "RQ-c", [], tree="questions-claude")
    pi = make_rq(lab["research"], "RQ-p", [], tree="questions-pi")
    make_rq(lab["research"], "RQ-w", [], tree="workflow-dev")
    assert export_site_data().main_rq_dirs(lab["research"]) == [claude, pi]


# Header fields (site/docs/stories/open/2026-10-14_01_export-header-fields.md).
# Reading adopted for R3: a main RQ always lives at research/<subtree>/<dir>, so
# its path is the last three parts of its directory.
def exported(lab, design):
    rq = make_rq(lab["research"], "RQ-x", [summary_cell()], design=design)
    return json.loads((run_export(lab, [rq]) / "rq" / "RQ-x.json").read_text())


def test_carries_the_rq_directory_relative_to_the_repo_root(lab):
    assert exported(lab, DEFAULT_DESIGN)["path"] == "research/questions-claude/1.1-rq-x"


def test_passes_a_plain_factor_through(lab):
    design = "factors:\n  workflow: [wf-a, wf-b]\n"
    assert exported(lab, design)["factors"] == {"workflow": ["wf-a", "wf-b"]}


def test_passes_paired_factors_and_any_lists_through_without_comments(lab):
    design = ("factors:\n"
              "  workflow_x_prompt:\n"
              "    - {workflow: wf-a, prompt: example-mapping}  # baseline\n"
              "  model:\n"
              "    - opus-5-no-thinking\n"
              "    - {any: [opus-4-7-no-thinking, opus-4-7-portkey-no-thinking]}\n")
    assert exported(lab, design)["factors"] == {
        "workflow_x_prompt": [{"workflow": "wf-a", "prompt": "example-mapping"}],
        "model": ["opus-5-no-thinking",
                  {"any": ["opus-4-7-no-thinking", "opus-4-7-portkey-no-thinking"]}]}


def test_passes_the_controls_through(lab):
    design = (DEFAULT_DESIGN
              + "controls:\n  model: opus-4-7-no-thinking\n  kata_base: game-of-life\n")
    assert exported(lab, design)["controls"] == {
        "model": "opus-4-7-no-thinking", "kata_base": "game-of-life"}


def test_carries_the_closed_reason(lab):
    reason = "gap accepted — one game-of-life cell holds 9 of 10 runs"
    assert exported(lab, DEFAULT_DESIGN + f'closed: "{reason}"\n')["closed"] == reason


def test_leaves_closed_out_when_not_set(lab):
    assert "closed" not in exported(lab, DEFAULT_DESIGN)


def test_leaves_empty_controls_out(lab):
    assert "controls" not in exported(lab, DEFAULT_DESIGN + "controls:\n")


def test_leaves_undeclared_controls_out(lab):
    assert "controls" not in exported(lab, DEFAULT_DESIGN)


def test_stops_on_an_rq_without_factors(lab):
    rq = make_rq(lab["research"], "RQ-x", [summary_cell()], design="")
    module = export_site_data()
    with pytest.raises(module.ExportError, match="^RQ-x: no factors$"):
        module.export([rq], lab["lineage"], lab["registry"], lab["out"])


def test_the_command_line_reports_missing_factors_and_writes_nothing(lab, monkeypatch, capsys):
    make_rq(lab["research"], "RQ-a", [summary_cell()])
    make_rq(lab["research"], "RQ-x", [summary_cell()], design="")
    module = export_site_data()
    monkeypatch.setattr(module, "RESEARCH_DIR", lab["research"])
    monkeypatch.setattr(module, "LINEAGE", lab["lineage"])
    monkeypatch.setattr(module, "REGISTRY", lab["registry"])
    monkeypatch.setattr(module, "OUT_DIR", lab["out"])
    assert module.main() == 1
    assert capsys.readouterr().err == "export-site-data: RQ-x: no factors\n"
    assert not lab["out"].exists()


# R8 — stop at the first missing metadata and write nothing
def test_stops_on_an_outcome_missing_from_the_registry(lab):
    rq = make_rq(lab["research"], "RQ-x", [summary_cell()], outcomes=("foo_score",))
    module = export_site_data()
    with pytest.raises(module.ExportError, match=r"RQ-x.*foo_score"):
        module.export([rq], lab["lineage"], lab["registry"], lab["out"])


def test_stops_on_a_workflow_without_a_description(lab):
    rq = make_rq(lab["research"], "RQ-x", [summary_cell("wf-bare")])
    module = export_site_data()
    with pytest.raises(module.ExportError, match="wf-bare"):
        module.export([rq], lab["lineage"], lab["registry"], lab["out"])


def test_writes_nothing_when_it_stops(lab):
    good = make_rq(lab["research"], "RQ-a", [summary_cell()])
    bad = make_rq(lab["research"], "RQ-b", [summary_cell()], outcomes=("foo_score",))
    module = export_site_data()
    with pytest.raises(module.ExportError):
        module.export([good, bad], lab["lineage"], lab["registry"], lab["out"])
    assert not lab["out"].exists()


def test_the_command_line_exits_1_on_a_stop(lab, monkeypatch, capsys):
    make_rq(lab["research"], "RQ-x", [summary_cell()], outcomes=("foo_score",))
    module = export_site_data()
    monkeypatch.setattr(module, "RESEARCH_DIR", lab["research"])
    monkeypatch.setattr(module, "LINEAGE", lab["lineage"])
    monkeypatch.setattr(module, "REGISTRY", lab["registry"])
    monkeypatch.setattr(module, "OUT_DIR", lab["out"])
    assert module.main() == 1
    assert "RQ-x: outcome foo_score" in capsys.readouterr().err


# Findings section (site/docs/stories/open/2026-10-11_08_findings-section.md),
# build reading: the export carries findings.md into the RQ's JSON.
def test_carries_the_findings_text(lab):
    """findings.md '# RQ-x Findings\\n...' -> "findings" holds the file's text verbatim."""
    rq = make_rq(lab["research"], "RQ-x", [summary_cell()])
    text = "# RQ-x Findings\n\n## F-x.1 — It helps\n\n| a | b |\n|---|---|\n| 1 | **2** |\n"
    (rq / "findings.md").write_text(text)
    assert json.loads((run_export(lab, [rq]) / "rq" / "RQ-x.json").read_text())["findings"] == text


def test_leaves_findings_out_without_a_findings_file(lab):
    """no findings.md -> no "findings" key."""
    assert "findings" not in exported(lab, DEFAULT_DESIGN)
