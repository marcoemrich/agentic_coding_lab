"""Site data export, aggregator side: per-cell statistics behind summary.json
and summary.md (story site/docs/stories/open/2026-10-11_05_site-data-export.md).

Rows are runs.csv rows as dicts. Reading adopted where the story leaves the
shape open: a cell summary carries `counts`, `runs` and `outcomes`; a numeric
outcome is {kind, n, null_count, mean, sd, min, max}, a boolean one
{kind, n, null_count, k}, a pooled rate {kind, n, null_count, k, t}.
`timeout-killed` counts as a timeout.
"""
import re

import pytest

from conftest import load_script

agg = load_script("aggregate-by-query")


def run(exit_reason="ok", run_id="r", started_at="2026-10-01T10:00:00+00:00", **outcomes):
    return {"run_id": run_id, "started_at": started_at, "exit_reason": exit_reason, **outcomes}


# R5 — declared cells without runs are present
def test_a_cell_without_runs_counts_zero_runs_and_lists_none():
    summary = agg.cell_summary([], outcomes=[])
    assert summary["counts"] == {"runs": 0, "timeouts": 0, "infra": 0, "provider_refusals": 0}
    assert summary["runs"] == []


# R2 — each cell counts its runs and why runs were excluded
def test_counts_runs_timeouts_infra_and_refusals_per_cell():
    rows = [run() for _ in range(4)] + [run("timeout"), run("transient-api-error")]
    assert agg.cell_summary(rows, outcomes=[])["counts"] == {
        "runs": 6, "timeouts": 1, "infra": 1, "provider_refusals": 0}


def test_counts_a_provider_refusal_and_a_killed_timeout_apart_from_infra():
    rows = [run("provider-refusal"), run("timeout-killed")]
    assert agg.cell_summary(rows, outcomes=[])["counts"] == {
        "runs": 2, "timeouts": 1, "infra": 0, "provider_refusals": 1}


def test_counts_setup_errors_and_unrecognised_errors_as_infra():
    rows = [run("setup-error"), run("error-1"), run()]
    assert agg.cell_summary(rows, outcomes=[])["counts"] == {
        "runs": 3, "timeouts": 0, "infra": 2, "provider_refusals": 0}


# R6 — each cell lists its runs, excluded ones included
def test_lists_every_run_with_its_start_and_exit_reason():
    rows = [run(run_id="a", started_at="2026-08-03T10:00:00+00:00"),
            run("timeout", run_id="b", started_at="2026-08-17T09:00:00+00:00")]
    assert agg.cell_summary(rows, outcomes=[])["runs"] == [
        {"id": "a", "started_at": "2026-08-03T10:00:00+00:00", "exit_reason": "ok"},
        {"id": "b", "started_at": "2026-08-17T09:00:00+00:00", "exit_reason": "timeout"},
    ]


# R1 — only ok runs enter a statistic
def test_averages_a_numeric_outcome_over_ok_runs_only():
    rows = [run(mccabe_max=v) for v in (4, 5, 6, 5)] + [run("timeout", mccabe_max=12)]
    stats = agg.cell_summary(rows, outcomes=["mccabe_max"])["outcomes"]["mccabe_max"]
    assert (stats["kind"], stats["n"], stats["mean"]) == ("num", 4, 5.0)


def test_reports_the_sample_sd_of_a_numeric_outcome():
    rows = [run(mccabe_max=v) for v in (4, 5, 6, 5)]
    stats = agg.cell_summary(rows, outcomes=["mccabe_max"])["outcomes"]["mccabe_max"]
    assert stats["sd"] == pytest.approx(0.8165, abs=1e-4)


def test_leaves_out_the_sd_of_a_single_value():
    stats = agg.cell_summary([run(mccabe_max=7)], outcomes=["mccabe_max"])["outcomes"]["mccabe_max"]
    assert stats["mean"] == 7
    assert "sd" not in stats


def test_a_cell_whose_runs_all_timed_out_has_no_mean():
    rows = [run("timeout", mccabe_max=12) for _ in range(3)]
    stats = agg.cell_summary(rows, outcomes=["mccabe_max"])["outcomes"]["mccabe_max"]
    assert stats["n"] == 0
    assert "mean" not in stats


def test_summarises_cost_over_ok_runs_even_when_not_declared():
    rows = [run(cost_usd=1.0), run(cost_usd=3.0), run("timeout", cost_usd=9.0)]
    stats = agg.cell_summary(rows, outcomes=[])["outcomes"]["cost_usd"]
    assert (stats["n"], stats["mean"]) == (2, 2.0)


# R3 — a null leaves n and is counted
def test_a_boolean_null_leaves_n_and_is_counted():
    rows = [run(tests_passing=v) for v in (True, True, None, False)]
    stats = agg.cell_summary(rows, outcomes=["tests_passing"])["outcomes"]["tests_passing"]
    assert stats == {"kind": "bool", "n": 3, "k": 2, "null_count": 1}


def test_a_numeric_null_leaves_n_and_is_counted():
    rows = [run(mutation_score=v) for v in (0.8, None, 0.9)]
    stats = agg.cell_summary(rows, outcomes=["mutation_score"])["outcomes"]["mutation_score"]
    assert (stats["n"], stats["null_count"]) == (2, 1)
    assert stats["mean"] == pytest.approx(0.85)


def test_a_pooled_rate_counts_a_null_or_zero_total_as_null():
    rows = [run(predictions_correct=k, predictions_total=t)
            for k, t in ((3, 4), (1, None), (2, 0), (5, 6))]
    stats = agg.cell_summary(rows, outcomes=["predictions_correct_rate"])["outcomes"][
        "predictions_correct_rate"]
    assert stats == {"kind": "rate", "n": 2, "k": 8, "t": 10, "null_count": 2}


# R4 — an outcome null in every run is still present
def test_an_outcome_null_in_every_run_has_n_zero_and_no_mean():
    rows = [run(mutation_score=None) for _ in range(5)]
    stats = agg.cell_summary(rows, outcomes=["mutation_score"])["outcomes"]["mutation_score"]
    assert stats == {"kind": "num", "n": 0, "null_count": 5}


# R5 / R6 in summary.json
def test_summary_json_lists_every_declared_cell_including_unrun_ones():
    fm = {"id": "RQ-x", "question": "Q?", "min_replicates": 5, "outcomes": ["mccabe_max"]}
    ran = {"kata_base": "game-of-life", "prompt": "prose", "workflow": "wf-a", "model": "m"}
    unrun = {"kata_base": "game-of-life", "prompt": "prose", "workflow": "wf-b", "model": "m"}
    rows_by_cell = {agg.cell_key(ran): [run(mccabe_max=4)]}
    document = agg.summary_document(fm, [ran, unrun], rows_by_cell)
    assert [(c["kata"], c["workflow"], c["model"], c["counts"]["runs"])
            for c in document["cells"]] == [
        ("game-of-life-prose", "wf-a", "m", 1), ("game-of-life-prose", "wf-b", "m", 0)]


# R1 / R3 in summary.md — one statistics implementation
CELL = {"kata_base": "game-of-life", "prompt": "prose", "workflow": "wf-a", "model": "m"}


def write_md(tmp_path, fm, rows):
    document = agg.summary_document(fm, [CELL], {agg.cell_key(CELL): rows})
    md = tmp_path / "summary.md"
    agg.write_summary(md, fm, [CELL], document)
    return md.read_text()


def test_summary_md_reports_a_cell_of_timeouts_below_min_replicates(tmp_path):
    fm = {"id": "RQ-x", "question": "Q?", "min_replicates": 3, "outcomes": ["mccabe_max"]}
    md = write_md(tmp_path, fm, [run("timeout", mccabe_max=12) for _ in range(3)])
    assert "below min_replicates (0/3)" in md


def test_summary_md_shows_a_boolean_rate_without_its_nulls(tmp_path):
    fm = {"id": "RQ-x", "question": "Q?", "min_replicates": 3, "outcomes": ["tests_passing"]}
    md = write_md(tmp_path, fm, [run(tests_passing=v) for v in (True, True, None, False)])
    # columns: n | k | null | rate_%
    assert "| 3 | 2 | 1 | 67 |" in re.sub(r" +", " ", md)


def test_summary_md_shows_a_numeric_mean_and_sd(tmp_path):
    fm = {"id": "RQ-x", "question": "Q?", "min_replicates": 3, "outcomes": ["mccabe_max"]}
    md = write_md(tmp_path, fm, [run(mccabe_max=v) for v in (4, 5, 6, 5)])
    # columns: n | null | mean | sd
    assert "| 4 | 0 | 5 | 0.82 |" in re.sub(r" +", " ", md)


def test_summary_md_shows_a_pooled_rate_as_k_of_t(tmp_path):
    fm = {"id": "RQ-x", "question": "Q?", "min_replicates": 2,
          "outcomes": ["predictions_correct_rate"]}
    md = write_md(tmp_path, fm, [run(predictions_correct=k, predictions_total=t)
                                 for k, t in ((3, 4), (5, 6))])
    # columns: n | k | t | null | rate_%
    assert "| 2 | 8 | 10 | 0 | 80 |" in re.sub(r" +", " ", md)


def test_summarises_a_superseded_outcome_under_its_declared_name():
    fm = {"id": "RQ-x", "question": "Q?", "min_replicates": 1, "outcomes": ["cycle_count"]}
    document = agg.summary_document(fm, [CELL], {agg.cell_key(CELL): [run(legacy_cycle_count=3)]})
    assert document["cells"][0]["outcomes"]["cycle_count"]["mean"] == 3
