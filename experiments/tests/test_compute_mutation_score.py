"""Tests for the mutation-score script's null handling and env bridge.

The behaviour under test is the one that failed silently in the field: a
TypeScript suite which drives the implementation only through a spawned
process produced an authoritative 0.000 instead of a null, and no recorded
field distinguished it from a suite that genuinely kills nothing.
"""
from __future__ import annotations

import json

from conftest import load_script

cms = load_script("compute-mutation-score")


def _report(**statuses):
    """A Stryker mutation-testing-elements report with the given status counts."""
    mutants = [{"status": status}
               for status, n in statuses.items() for _ in range(n)]
    return {"files": {"src/premium.ts": {"mutants": mutants}}}


# --- killed_nothing -----------------------------------------------------

def test_killed_nothing_is_true_when_every_mutant_survived():
    result = cms.mutation_score_from_report(_report(Survived=111))
    assert result.score == 0.0
    assert cms.killed_nothing(result)


def test_killed_nothing_is_false_when_some_mutant_died():
    result = cms.mutation_score_from_report(_report(Killed=1, Survived=110))
    assert cms.killed_nothing(result) is False


def test_killed_nothing_is_false_without_scoreable_mutants():
    """No mutants is a different failure, already reported as null."""
    result = cms.mutation_score_from_report(_report())
    assert result.score is None
    assert cms.killed_nothing(result) is False


# --- unmeasurable -------------------------------------------------------

def test_unmeasurable_is_null_and_carries_its_reason():
    result = cms.unmeasurable(cms.SUBPROCESS_ONLY_REASON)
    assert result.score is None
    assert result.total is None
    assert "spawned process" in result.reason


def test_results_from_the_engines_carry_no_reason():
    result = cms.mutation_score_from_report(_report(Killed=9, Survived=1))
    assert result.reason is None
    assert result.score == 0.9


def test_update_metrics_json_writes_the_reason(tmp_path):
    path = tmp_path / "metrics.json"
    path.write_text(json.dumps({"final_metrics": {"tests_passing": True}}))
    cms.update_metrics_json(path, cms.unmeasurable("because"))
    final = json.loads(path.read_text())["final_metrics"]
    assert final["mutation_score"] is None
    assert final["mutation_unmeasurable_reason"] == "because"
    assert final["tests_passing"] is True, "must not disturb other metrics"


def test_update_metrics_json_clears_a_stale_reason(tmp_path):
    """A rescored run must not keep the note explaining its previous null."""
    path = tmp_path / "metrics.json"
    path.write_text(json.dumps({"final_metrics": {
        "mutation_score": None, "mutation_unmeasurable_reason": "stale"}}))
    cms.update_metrics_json(
        path, cms.mutation_score_from_report(_report(Killed=9, Survived=1)))
    final = json.loads(path.read_text())["final_metrics"]
    assert final["mutation_score"] == 0.9
    assert final["mutation_unmeasurable_reason"] is None


# --- stryker_env_bridge -------------------------------------------------

STACK_CONFIG = """\
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    globals: true,
  },
});
"""


def test_env_bridge_registers_itself_and_restores_the_config(tmp_path):
    config = tmp_path / "vitest.config.ts"
    config.write_text(STACK_CONFIG)
    bridge = tmp_path / cms.STRYKER_ENV_BRIDGE_FILE

    with cms.stryker_env_bridge(tmp_path, lambda _msg: None) as installed:
        assert installed
        assert bridge.is_file()
        patched = config.read_text()
        assert f"setupFiles: ['./{cms.STRYKER_ENV_BRIDGE_FILE}']" in patched
        assert "include: ['src/**/*.spec.ts']" in patched

    assert config.read_text() == STACK_CONFIG, "config must be restored verbatim"
    assert not bridge.exists(), "the bridge must not stay in the artifact"


def test_env_bridge_restores_the_config_after_a_failure(tmp_path):
    config = tmp_path / "vitest.config.ts"
    config.write_text(STACK_CONFIG)
    try:
        with cms.stryker_env_bridge(tmp_path, lambda _msg: None):
            raise RuntimeError("stryker blew up")
    except RuntimeError:
        pass
    assert config.read_text() == STACK_CONFIG
    assert not (tmp_path / cms.STRYKER_ENV_BRIDGE_FILE).exists()


def test_env_bridge_declines_a_config_that_already_has_setup_files(tmp_path):
    """Merging into an existing array textually would silently drop entries."""
    original = STACK_CONFIG.replace(
        "  test: {\n", "  test: {\n    setupFiles: ['./theirs.ts'],\n", 1)
    config = tmp_path / "vitest.config.ts"
    config.write_text(original)
    with cms.stryker_env_bridge(tmp_path, lambda _msg: None) as installed:
        assert installed is False
    assert config.read_text() == original


def test_env_bridge_declines_when_there_is_no_vitest_config(tmp_path):
    with cms.stryker_env_bridge(tmp_path, lambda _msg: None) as installed:
        assert installed is False


def test_env_bridge_source_mirrors_the_variable_stryker_reads():
    """The instrumented header seeds the global from exactly this name."""
    assert "__STRYKER_ACTIVE_MUTANT__" in cms.STRYKER_ENV_BRIDGE
    assert "defineProperty" in cms.STRYKER_ENV_BRIDGE


# --- mutable_sources ----------------------------------------------------

def test_mutable_sources_finds_the_domain_modules(tmp_path):
    src = tmp_path / "src"
    src.mkdir()
    for name in ["premium.ts", "claim.ts", "cli.ts", "office.spec.ts",
                 "node.d.ts"]:
        (src / name).write_text("")
    names = [p.name for p in cms.mutable_sources(tmp_path)]
    assert names == ["claim.ts", "premium.ts"]


def test_mutable_sources_is_empty_when_the_domain_is_nested_in_the_cli(tmp_path):
    """The case that silently scored n/a: everything inside src/cli.ts."""
    src = tmp_path / "src"
    src.mkdir()
    (src / "cli.ts").write_text("")
    (src / "claim-office.spec.ts").write_text("")
    assert cms.mutable_sources(tmp_path) == []


def test_mutable_sources_is_empty_without_a_src_dir(tmp_path):
    assert cms.mutable_sources(tmp_path) == []


def test_mutable_sources_looks_into_subdirectories(tmp_path):
    """A nested cli.ts is a different file and stays mutable."""
    nested = tmp_path / "src" / "domain"
    nested.mkdir(parents=True)
    (nested / "cli.ts").write_text("")
    (tmp_path / "src" / "cli.ts").write_text("")
    assert [p.name for p in cms.mutable_sources(tmp_path)] == ["cli.ts"]
    assert cms.mutable_sources(tmp_path)[0].parent.name == "domain"


# --- wants_subprocess_retry ---------------------------------------------

def test_a_timeout_is_worth_retrying_subprocess_safe():
    result = cms.unmeasurable(
        cms.TIMEOUT_REASON.format(seconds=1800, mode="perTest"))
    assert cms.wants_subprocess_retry(result)


def test_killing_nothing_is_worth_retrying_subprocess_safe():
    result = cms.mutation_score_from_report(_report(Survived=111))
    assert cms.wants_subprocess_retry(result)


def test_a_real_score_is_not_retried():
    result = cms.mutation_score_from_report(_report(Killed=9, Survived=1))
    assert cms.wants_subprocess_retry(result) is False


def test_an_empty_mutate_set_is_not_retried():
    """Retrying cannot conjure a mutant; the reason already explains it."""
    assert cms.wants_subprocess_retry(cms.unmeasurable("nothing to mutate")) \
        is False


# --- ensure_stryker_installed -------------------------------------------

def test_a_shim_without_its_package_does_not_count_as_installed(tmp_path,
                                                                monkeypatch):
    """pnpm's .bin/stryker is a shell shim and outlives its package."""
    shim = tmp_path / "node_modules" / ".bin" / "stryker"
    shim.parent.mkdir(parents=True)
    shim.write_text("#!/bin/sh\n")

    calls = []
    monkeypatch.setattr(cms.subprocess, "run",
                        lambda *args, **_kwargs: calls.append(args) or _ok())
    cms.ensure_stryker_installed(tmp_path, lambda _msg: None)
    assert calls, "must reinstall when @stryker-mutator/core is absent"


def test_a_present_package_counts_as_installed(tmp_path, monkeypatch):
    (tmp_path / "node_modules" / "@stryker-mutator" / "core").mkdir(
        parents=True)
    def _refuse(*_args, **_kwargs):
        raise AssertionError("must not reinstall")

    monkeypatch.setattr(cms.subprocess, "run", _refuse)
    assert cms.ensure_stryker_installed(tmp_path, lambda _msg: None) is True


class _ok:
    returncode = 0
    stderr = ""


def test_the_timeout_reason_and_its_reader_share_one_prefix():
    """Guards the retry against the two sentences drifting apart."""
    reason = cms.TIMEOUT_REASON.format(seconds=1, mode="perTest")
    assert reason.startswith(cms.TIMEOUT_REASON_PREFIX)
    assert cms.wants_subprocess_retry(cms.unmeasurable(reason))


# --- specs_import_mutable_source ----------------------------------------

def _run_with(tmp_path, files: dict):
    src = tmp_path / "src"
    src.mkdir(parents=True, exist_ok=True)
    for name, text in files.items():
        (src / name).write_text(text)
    return tmp_path


def test_a_subprocess_only_spec_imports_no_mutable_source(tmp_path):
    """The shape that scores a fabricated 0.000 under perTest."""
    run = _run_with(tmp_path, {
        "office.spec.ts": "import { expect, it } from 'vitest';\n"
                          "import { spawnSync } from 'node:child_process';\n",
        "premium.ts": "export const x = 1;\n",
        "cli.ts": "",
    })
    assert cms.specs_import_mutable_source(run) is False


def test_an_in_process_spec_is_recognised_through_the_js_extension(tmp_path):
    """TS source imported as ./office.js — the emitted-module convention."""
    run = _run_with(tmp_path, {
        "office.spec.ts": "import { runScenario } from './office.js';\n",
        "office.ts": "export const runScenario = () => 0;\n",
        "cli.ts": "",
    })
    assert cms.specs_import_mutable_source(run) is True


def test_an_extensionless_import_is_recognised(tmp_path):
    run = _run_with(tmp_path, {
        "a.spec.ts": "import { x } from './claim-office';\n",
        "claim-office.ts": "export const x = 1;\n",
    })
    assert cms.specs_import_mutable_source(run) is True


def test_importing_only_the_cli_adapter_does_not_count(tmp_path):
    """src/cli.ts is excluded from mutation, so reaching it proves nothing."""
    run = _run_with(tmp_path, {
        "a.spec.ts": "import { main } from './cli.js';\n",
        "cli.ts": "export const main = () => 0;\n",
        "premium.ts": "export const p = 1;\n",
    })
    assert cms.specs_import_mutable_source(run) is False


def test_a_test_helper_in_src_counts_as_a_mutable_source(tmp_path):
    """The partial case: in-process mutants are real, CLI-only ones are not."""
    run = _run_with(tmp_path, {
        "a.spec.ts": "import { h } from './test-helpers.ts';\n",
        "test-helpers.ts": "export const h = 1;\n",
        "cli.ts": "",
    })
    assert cms.specs_import_mutable_source(run) is True


def test_no_mutable_source_at_all_is_not_an_in_process_suite(tmp_path):
    run = _run_with(tmp_path, {"a.spec.ts": "import './cli.js';\n",
                               "cli.ts": ""})
    assert cms.specs_import_mutable_source(run) is False


# --- eligible -----------------------------------------------------------

def _metrics(**final):
    return {"final_metrics": {"tests_passing": True, **final}}


def test_a_fabricated_zero_is_treated_as_unmeasured():
    """So the fix reaches runs already carrying the bad value, sans --force."""
    run_it, _ = cms.eligible(
        _metrics(mutation_score=0.0, mutants_total=111, mutants_survived=111),
        force=False)
    assert run_it is True


def test_a_real_score_is_still_skipped_without_force():
    run_it, reason = cms.eligible(
        _metrics(mutation_score=0.9, mutants_total=10, mutants_survived=1),
        force=False)
    assert run_it is False
    assert "already set" in reason


def test_a_genuine_zero_with_survivors_below_total_is_left_alone():
    """Not the artifact signature: something was killed, so it is a score."""
    run_it, reason = cms.eligible(
        _metrics(mutation_score=0.0, mutants_total=10, mutants_survived=9),
        force=False)
    assert run_it is False
    assert "already set" in reason


def test_a_red_suite_is_never_eligible():
    run_it, reason = cms.eligible(
        {"final_metrics": {"tests_passing": False}}, force=False)
    assert run_it is False
    assert "tests_passing" in reason
