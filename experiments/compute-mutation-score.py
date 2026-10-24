#!/usr/bin/env python3
"""Compute the mutation score for every run matching a research question.

Reads the RQ frontmatter, checks whether ``mutation_score`` is requested as
an outcome, selects matching runs from ``experiments/runs/``, and mutation-
tests each eligible run against the implementer's own suite. The resulting
score (0.0-1.0) is written back into the run's ``metrics.json`` under
``final_metrics.mutation_score``.

Three engines, picked per run from ``metrics.json``'s ``stack`` field
(falling back to sniffing the build file for runs recorded before that
field existed):

* ``java-junit-maven``  → PIT (pitest-maven) against JUnit 5.
* ``python-pytest``     → mutmut against pytest.
* ``rust-cargo``        → cargo-mutants against ``cargo test``.
* ``typescript-vitest`` → Stryker against Vitest.

All four are reduced to the same score definition, so the numbers are
comparable within a stack. Across stacks they are not: the tools generate
different mutant populations, and PIT's default mutator set is the most
conservative of the three.

Idempotent: runs that already have a numeric ``mutation_score`` are skipped
unless ``--force`` is passed. Runs without ``tests_passing == true`` are
skipped (mutation score on a red suite is methodologically meaningless).

A TypeScript run that kills **no** mutant is never recorded as 0.000. That
outcome is the signature of a suite which reaches the implementation only by
spawning ``src/cli.ts``, where Stryker's in-process mutant switch never
reaches the child and every mutant survives untouched — indistinguishable
from a worthless suite, and measured in the wild (RQ-current-models-ptdd).
Such a run is re-measured with the active-mutant env bridge and
``coverageAnalysis: "off"`` (see STRYKER_ENV_BRIDGE); if it still kills
nothing, the score stays ``null`` and
``final_metrics.mutation_unmeasurable_reason`` says why. ``--no-subprocess-retry``
skips the second attempt.

Mutation testing is expensive (several minutes of Vitest re-runs per run),
so this script is deliberately separate from ``analyze-run.sh`` and only
invoked when an RQ explicitly opts in via ``outcomes: [..., mutation_score]``.

Usage:
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/ --dry-run
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/ --limit 1 --timeout-seconds 600
  experiments/compute-mutation-score.py research/workflow-dev/5.1-correctness-regression/ --force
"""
from __future__ import annotations

import argparse
import collections
import contextlib
import importlib.util
import json
import os
import re
import subprocess
import sys
from pathlib import Path

# Reuse parse_frontmatter, expand_cells, kata_for_cell, matches_cell, RUNS_DIR
# from aggregate-by-query.py (same dir). Filename has a hyphen → load via spec.
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)  # type: ignore[union-attr]

REPO_ROOT = Path(__file__).resolve().parent.parent
PNPM_STORE = agg.RUNS_DIR / ".pnpm-store"

STRYKER_CONFIG = {
    "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
    "packageManager": "pnpm",
    "testRunner": "vitest",
    # Explicit plugin list: under pnpm's isolated layout, Stryker's
    # auto-discovery from the core worker's nested location does not
    # reach the hoisted vitest-runner. Listing it explicitly forces
    # normal node resolution from the run dir.
    "plugins": ["@stryker-mutator/vitest-runner"],
    "reporters": ["json", "clear-text"],
    # src/cli.ts is exercised by the external acceptance suite
    # (verification_pct), not by the internal Vitest tests — mutating it
    # would systematically lower the score without telling us anything
    # about the strength of the implementer's tests.
    "mutate": ["src/**/*.ts", "!src/**/*.spec.ts", "!src/cli.ts"],
    "coverageAnalysis": "perTest",
    "timeoutMS": 10000,
    "concurrency": 2,
    "jsonReporter": {"fileName": "reports/mutation/mutation-report.json"},
}

# A suite that reaches the implementation only by spawning src/cli.ts is
# invisible to Stryker's default setup, and the way it fails is silent: the
# mutants are never exercised, Stryker files every one of them as `Survived`
# rather than `NoCoverage`, and the score comes out an authoritative-looking
# 0.000 that no field distinguishes from a suite which genuinely kills nothing.
# Measured on RQ-current-models-ptdd (2026-10-23): three runs at exactly
# 0.000 with survived == total, against 0.871-0.917 for sibling runs of the
# same cell whose specs import the domain directly.
#
# Two things are needed to measure such a run, and neither alone is enough.
#
# 1. The child must see the active mutant. Stryker's instrumented header seeds
#    `__stryker__.activeMutant` from the environment when the global is unset
#    — exactly a freshly spawned child's situation — but
#    @stryker-mutator/vitest-runner only ever assigns the global
#    (FileCommunicator.setMutantRun), so the variable is never populated.
#    STRYKER_ENV_BRIDGE installs an accessor that keeps the two in step.
# 2. coverageAnalysis must be "off". Both "perTest" and "all" decide which
#    mutants to run from a coverage map collected in the test process, and that
#    map is empty here, so every mutant is skipped as NoCoverage no matter what
#    the child can see. "off" runs the whole suite against every mutant.
#
# The cost is why this is a fallback and not the default: "off" re-runs the
# full suite per mutant, which on a subprocess-driven claim-office suite is
# tens of minutes per run against a couple of minutes for "perTest".
STRYKER_ENV_BRIDGE_FILE = "stryker-env-bridge.mjs"
STRYKER_ENV_BRIDGE = """\
// Written by experiments/compute-mutation-score.py; removed again afterwards.
// Mirrors Stryker's in-process active mutant into the environment so that a
// test driving the implementation through a spawned child process exercises
// the mutated code rather than the original. See the comment on
// STRYKER_ENV_BRIDGE in that script for why this is needed.
const NS = '__stryker__';
const VAR = '__STRYKER_ACTIVE_MUTANT__';

const ns = globalThis[NS] || (globalThis[NS] = {});

const mirror = (value) => {
  if (value === undefined || value === null) delete process.env[VAR];
  else process.env[VAR] = String(value);
};

// An accessor rather than a hook: the runner assigns activeMutant from its own
// setup file, whose order relative to this one is not ours to control.
let active = ns.activeMutant;
mirror(active);

Object.defineProperty(ns, 'activeMutant', {
  configurable: true,
  enumerable: true,
  get: () => active,
  set: (value) => { active = value; mirror(value); },
});
"""


# What a mutation run yields: the score plus the two counts it is made of.
# The counts are reported in their own right — the score alone cannot be
# compared between arms that produce different amounts of code, because its
# denominator is the mutant population and that scales with the code. A
# workflow can raise the score by writing less code to defend, and it can
# lower the count of survivors the same way. Only the pair separates "the
# tests got stronger" from "there is less to test".
# `reason` is diagnostic only: a short note on why a null is null, written
# through to metrics.json so that an empty cell in summary.md explains itself.
# Without it a null is indistinguishable from "this RQ did not ask for the
# metric", which is how a silent measurement failure survives review.
MutationResult = collections.namedtuple(
    "MutationResult", ["score", "total", "survived", "no_coverage", "reason"],
    defaults=[None])
EMPTY_RESULT = MutationResult(None, None, None, None, None)

# One prefix, shared by the writer and wants_subprocess_retry's reader, so the
# retry does not hinge on two copies of a sentence staying in step.
TIMEOUT_REASON_PREFIX = "timed out after"
TIMEOUT_REASON = (TIMEOUT_REASON_PREFIX
                  + " {seconds}s (coverageAnalysis={mode})")

SUBPROCESS_ONLY_REASON = (
    "not measurable: the suite reaches the implementation only through a "
    "spawned process, so no mutant is exercised in the test process")


def mutable_sources(run_dir: Path) -> list[Path]:
    """The TypeScript files STRYKER_CONFIG's mutate glob would actually match.

    Checked before installing anything, because an empty result is a second
    silent null: a run that nests the whole domain inside src/cli.ts has
    nothing left to mutate once the CLI adapter is excluded, and Stryker then
    spends a dry run to report a score of n/a. The same shape is already
    recorded for Java in CLAUDE.md; it occurs on TypeScript too.
    """
    src = run_dir / "src"
    if not src.is_dir():
        return []
    return sorted(p for p in src.rglob("*.ts")
                  if not p.name.endswith(".spec.ts")
                  and not p.name.endswith(".d.ts")
                  and p.relative_to(src).as_posix() != "cli.ts")


_SPEC_IMPORT_RE = re.compile(
    r"""(?:from|import|require\s*\()\s*['"](\.[^'"]+)['"]""")


def specs_import_mutable_source(run_dir: Path) -> bool:
    """Does any spec import a file the mutate glob covers?

    If none does, the suite reaches the implementation only by spawning the
    CLI, Stryker's in-process coverage map comes out empty, and "perTest"
    schedules no mutant at all — so the first attempt can only waste its
    budget before the subprocess-safe retry. Going straight to the retry skips
    that.

    The same discriminator — "does the spec import ./office.js" — identifies
    the affected runs in RQ-gpt6-sol-vs-gpt56-sol F-1.10.2,
    RQ-workflow-axis-gpt6-sol F-1.11.5 and RQ-workflow-axis-gpt61-sol
    F-1.12.5, and it predicted all six affected runs of
    RQ-current-models-ptdd exactly.

    A spec importing a *test helper* out of src/ counts as importing a mutable
    source, because the helper is in the mutate set: that run's in-process
    mutants are real, and only the ones behind the CLI go uncovered. That
    partial case is visible in `mutants_no_coverage` and is left to "perTest".
    """
    src = run_dir / "src"
    mutable = {p.resolve() for p in mutable_sources(run_dir)}
    if not mutable:
        return False
    for spec in sorted(src.rglob("*.spec.ts")):
        try:
            text = spec.read_text(errors="ignore")
        except OSError:
            continue
        for raw in _SPEC_IMPORT_RE.findall(text):
            target = (spec.parent / raw).resolve()
            stem = target.with_suffix("")
            for candidate in (target, stem.with_suffix(".ts"),
                              Path(f"{stem}.ts")):
                if candidate in mutable:
                    return True
    return False


def killed_nothing(result: MutationResult) -> bool:
    """Did the engine score mutants and detect none of them?

    The signature of the subprocess-only case, and not a credible outcome for
    a suite that passes: every mutant Survived, nothing killed. Distinct from
    `result.score is None`, which means the engine produced nothing to score.
    """
    return result.score == 0.0 and bool(result.total)


def wants_subprocess_retry(result: MutationResult) -> bool:
    """Is this first-attempt result worth re-measuring subprocess-safe?

    Two cases: nothing killed (see killed_nothing), and a timeout — the
    bridged attempt schedules far less work, so a first attempt that ran out
    of time is not evidence that the second will.
    """
    return killed_nothing(result) or bool(
        result.reason and result.reason.startswith(TIMEOUT_REASON_PREFIX))


def unmeasurable(reason: str) -> MutationResult:
    """A null result that says why, rather than an unqualified 0.000."""
    return MutationResult(None, None, None, None, reason)


def run_stack(run_dir: Path, metrics: dict | None = None) -> str:
    """The stack of a run, from metrics.json, with a build-file fallback.

    Mirrors `run_stack` in analyze-run.sh. Runs recorded before the field
    existed have no `stack`; every one of those is TypeScript unless it
    carries a build file that says otherwise.
    """
    if metrics is None:
        try:
            metrics = json.loads((run_dir / "metrics.json").read_text())
        except (OSError, json.JSONDecodeError):
            metrics = {}
    stack = metrics.get("stack")
    if stack:
        return stack
    if (run_dir / "pom.xml").is_file():
        return "java-junit-maven"
    if (run_dir / "pyproject.toml").is_file():
        return "python-pytest"
    if (run_dir / "Cargo.toml").is_file():
        return "rust-cargo"
    return "typescript-vitest"


def _result_from_counts(detected: int, survived: int,
                        no_coverage: int = 0) -> MutationResult:
    """Assemble a result from the two score terms plus the uncovered part.

    `survived` is the whole part of the denominator the suite did not catch;
    `no_coverage` is the subset of it that no test even reached. The two are
    reported separately because they say different things about a suite: a
    Survived mutant means a test ran the mutated line and still passed (a weak
    assertion), while an uncovered one means no test goes there at all
    (untested code). The score cannot tell them apart, and the distinction has
    separated arms whose scores were identical.
    """
    total = detected + survived
    if total == 0:
        return EMPTY_RESULT
    return MutationResult(detected / total, total, survived, no_coverage)


def mutation_score_from_report(report: dict) -> MutationResult:
    """Score and mutant counts from a Stryker mutation-testing-elements report.

    Formula (Stryker default):
        score = (Killed + Timeout) / (Killed + Survived + Timeout + NoCoverage)

    `survived` is the part of that denominator the suite did not catch:
    Survived plus NoCoverage. Compile/runtime errors and Ignored mutants are
    excluded. Returns EMPTY_RESULT when there are no scoreable mutants (which
    would mean Stryker produced nothing usable — itself worth surfacing).
    """
    counts: dict[str, int] = {}
    for file_info in (report.get("files") or {}).values():
        for mutant in file_info.get("mutants", []) or []:
            status = mutant.get("status", "")
            counts[status] = counts.get(status, 0) + 1
    detected = counts.get("Killed", 0) + counts.get("Timeout", 0)
    no_coverage = counts.get("NoCoverage", 0)
    survived = counts.get("Survived", 0) + no_coverage
    return _result_from_counts(detected, survived, no_coverage)


# --- Java / PIT ---------------------------------------------------------
# PIT mutates the compiled classes and drives the run's own JUnit 5 suite.
# Versions are pinned for the same reason the Stryker version is: a mutation
# score is only comparable across runs when the mutant population is.
PITEST_VERSION = "1.19.1"
PITEST_JUNIT5_VERSION = "1.2.2"
POM_NS = "http://maven.apache.org/POM/4.0.0"
# Generated next to the run's own pom.xml, never replacing it — the recorded
# artifact must stay exactly as the agent left it.
PITEST_POM = "pom-pitest.xml"
# PIT must run on a JDK its bundled ASM can read. The runs are compiled to
# release 17 in the container (Dockerfile: openjdk-17-jdk-headless), but PIT
# also reads core classes from the *running* JVM while computing stack-map
# frames — on a JDK 25 host that fails with "Unsupported class file major
# version 69" for some runs and not others. Pinning the JVM to the same JDK
# the container used removes that dependency on the host default.
JDK_CANDIDATES = [
    Path("/usr/lib/jvm/java-17-openjdk-amd64"),
    Path("/usr/lib/jvm/java-21-openjdk-amd64"),
]


def pitest_java_home(log) -> str | None:
    for candidate in JDK_CANDIDATES:
        if (candidate / "bin" / "java").is_file():
            return str(candidate)
    log("  no pinned JDK found; falling back to the ambient JAVA_HOME "
        "(a JDK newer than PIT's ASM will fail on some runs)")
    return None



def _java_classes(root: Path) -> list[str]:
    """Fully-qualified names of the top-level classes under `root`."""
    import re
    out = []
    if not root.is_dir():
        return out
    for f in sorted(root.rglob("*.java")):
        text = f.read_text(encoding="utf-8", errors="replace")
        m = re.search(r"^\s*package\s+([\w.]+)\s*;", text, re.M)
        out.append((m.group(1) + "." if m else "") + f.stem)
    return out


def write_pitest_pom(run_dir: Path) -> tuple[Path, int]:
    """Copy the run's pom.xml and add the pitest plugin to the copy.

    Target classes and tests are enumerated rather than globbed: PIT refuses
    a bare `*` filter (it would mutate itself), and these katas put their
    classes in the default package, where no package prefix is available to
    narrow the glob with.

    Every production class is mutated, the CLI entry class included — unlike
    STRYKER_CONFIG, which excludes `src/cli.ts`. Java runs cannot use that
    rule: some put the whole domain into nested classes of the CLI class, and
    PIT's excludedClasses takes the nested classes with it, leaving nothing to
    mutate. Excluding by file would also make the score depend on how the
    agent split its classes — and class organisation is one of the things
    these RQs measure, so it must not leak into the measurement of test
    strength. Returns (pom path, number of target classes).
    """
    import xml.etree.ElementTree as ET
    ET.register_namespace("", POM_NS)
    tree = ET.parse(run_dir / "pom.xml")
    root = tree.getroot()
    build = root.find(f"{{{POM_NS}}}build")
    if build is None:
        build = ET.SubElement(root, f"{{{POM_NS}}}build")
    plugins = build.find(f"{{{POM_NS}}}plugins")
    if plugins is None:
        plugins = ET.SubElement(build, f"{{{POM_NS}}}plugins")

    # Trailing `*` on both sides so inner classes (Outer$Inner) are covered:
    # @Nested test classes, and production classes that some runs declare as
    # nested types of a single outer class rather than as separate files.
    targets = [f"{c}*" for c in _java_classes(run_dir / "src/main/java")]
    tests = [f"{c}*" for c in _java_classes(run_dir / "src/test/java")]
    as_params = lambda names: "".join(f"<param>{n}</param>" for n in names)

    plugins.append(ET.fromstring(f"""<plugin xmlns="{POM_NS}">
  <groupId>org.pitest</groupId>
  <artifactId>pitest-maven</artifactId>
  <version>{PITEST_VERSION}</version>
  <dependencies>
    <dependency>
      <groupId>org.pitest</groupId>
      <artifactId>pitest-junit5-plugin</artifactId>
      <version>{PITEST_JUNIT5_VERSION}</version>
    </dependency>
  </dependencies>
  <configuration>
    <targetClasses>{as_params(targets)}</targetClasses>
    <targetTests>{as_params(tests)}</targetTests>
    <outputFormats><param>XML</param></outputFormats>
    <timestampedReports>false</timestampedReports>
    <threads>2</threads>
    <timeoutConstant>10000</timeoutConstant>
    <failWhenNoMutations>false</failWhenNoMutations>
  </configuration>
</plugin>"""))
    pom_path = run_dir / PITEST_POM
    tree.write(pom_path, encoding="utf-8", xml_declaration=True)
    return pom_path, len(targets)


def mutation_score_from_pit_report(report_path: Path) -> MutationResult:
    """Score and mutant counts from PIT's mutations.xml, same shape as Stryker.

        score = (KILLED + TIMED_OUT + MEMORY_ERROR)
                / (KILLED + SURVIVED + TIMED_OUT + MEMORY_ERROR + NO_COVERAGE)

    NON_VIABLE and RUN_ERROR mutants are excluded — they are the PIT
    equivalent of Stryker's CompileError status and say nothing about the
    suite. Returns EMPTY_RESULT when no mutant is scoreable.
    """
    import xml.etree.ElementTree as ET
    try:
        root = ET.parse(report_path).getroot()
    except ET.ParseError:
        return EMPTY_RESULT
    counts: dict[str, int] = {}
    for mutation in root.findall("mutation"):
        status = mutation.get("status", "")
        counts[status] = counts.get(status, 0) + 1
    detected = (counts.get("KILLED", 0) + counts.get("TIMED_OUT", 0)
                + counts.get("MEMORY_ERROR", 0))
    no_coverage = counts.get("NO_COVERAGE", 0)
    survived = counts.get("SURVIVED", 0) + no_coverage
    return _result_from_counts(detected, survived, no_coverage)


def run_pitest(run_dir: Path, timeout_seconds: int, log) -> MutationResult:
    """Run PIT in run_dir and return mutation_score (0.0-1.0) or None."""
    pom_path, n_targets = write_pitest_pom(run_dir)
    if n_targets == 0:
        log("  no production classes found; score stays null")
        return EMPTY_RESULT

    report_path = run_dir / "target" / "pit-reports" / "mutations.xml"
    if report_path.is_file():
        report_path.unlink()
    log_path = run_dir / "pit.log"
    cmd = ["mvn", "-B", "-f", pom_path.name, "test-compile",
           f"org.pitest:pitest-maven:{PITEST_VERSION}:mutationCoverage"]
    env = os.environ.copy()
    java_home = pitest_java_home(log)
    if java_home:
        env["JAVA_HOME"] = java_home
        env["PATH"] = f"{java_home}/bin{os.pathsep}{env.get('PATH', '')}"
    try:
        with log_path.open("w") as f:
            f.write(f"$ JAVA_HOME={java_home or env.get('JAVA_HOME', '')} "
                    f"{' '.join(cmd)}\n")
            f.flush()
            proc = subprocess.run(
                cmd, cwd=run_dir, stdout=f, stderr=subprocess.STDOUT,
                timeout=timeout_seconds, env=env,
            )
    except subprocess.TimeoutExpired:
        log(f"  TIMEOUT after {timeout_seconds}s — score stays null")
        return EMPTY_RESULT

    if proc.returncode != 0:
        log(f"  mvn exited {proc.returncode}; see pit.log")
    if not report_path.is_file():
        log("  no mutations.xml produced; score stays null")
        return EMPTY_RESULT
    return mutation_score_from_pit_report(report_path)


# --- Python / mutmut ----------------------------------------------------
# Pinned for the same reason the other two engines are: a mutation score is
# only comparable across runs when the mutant population is.
MUTMUT_VERSION = "3.8.0"

# mutmut reads its configuration from [tool.mutmut] in pyproject.toml. The
# stack skeleton ships this exact section, but an agent may rewrite
# pyproject.toml during a run, so whatever is there is replaced by this for
# the duration of the measurement and the original file restored afterwards.
# One instrument for every run, or the scores are not comparable.
# src/cli.py is excluded for the same reason STRYKER_CONFIG excludes
# src/cli.ts: it is exercised by the external acceptance suite, not by the
# run's own pytest tests. Measured on a sample run, 26 of 28 survivors came
# from the CLI adapter alone. The Java stack deliberately mutates its CLI
# class because Java runs often nest the whole domain inside it; Python
# modules have no such coupling.
MUTMUT_CONFIG_BASE = """
[tool.mutmut]
source_paths = ["src/"]
pytest_add_cli_args_test_selection = ["tests/"]
"""

# Excluding the adapter is conditional on there being anything else to mutate.
# Two claim-office runs put their whole domain into src/cli.py, and the
# unconditional exclusion left mutmut with "0 files mutated" and no score at
# all — the same coupling the Java stack cites as its reason for mutating its
# CLI class. Exclude the adapter when the run separated its domain from it;
# mutate it when it is the only production code there is.
MUTMUT_EXCLUDE_CLI = 'do_not_mutate = ["src/cli.py"]\n'


def mutmut_config_for(run_dir: Path) -> str:
    production = sorted(
        path for path in (run_dir / "src").glob("*.py")
        if path.name != "__init__.py"
    )
    others = [path for path in production if path.name != "cli.py"]
    if others:
        return MUTMUT_CONFIG_BASE + MUTMUT_EXCLUDE_CLI
    return MUTMUT_CONFIG_BASE

MUTMUT_STATS = Path("mutants") / "mutmut-cicd-stats.json"


def with_canonical_mutmut_config(pyproject: str, config: str) -> str:
    """Replace any [tool.mutmut] section with the canonical one.

    The analysis must use one instrument across all runs, so a section the
    agent wrote during the run is dropped rather than honoured — the same
    reason analyze-run.sh swaps in the canonical PMD ruleset for Java. The
    caller restores the original file afterwards.
    """
    lines = pyproject.splitlines(keepends=True)
    kept, skipping = [], False
    for line in lines:
        stripped = line.strip()
        if stripped == "[tool.mutmut]":
            skipping = True
            continue
        if skipping:
            # Any other section header ends the one being dropped.
            if stripped.startswith("[") and stripped.endswith("]"):
                skipping = False
            else:
                continue
        kept.append(line)
    body = "".join(kept).rstrip("\n")
    return f"{body}\n{config}"


def mutation_score_from_mutmut_stats(stats_path: Path) -> MutationResult:
    """Score and mutant counts from mutmut's CI/CD stats, same shape as PIT.

        score = (killed + timeout) / (killed + survived + timeout + no_tests)

    `no_tests` joins `survived` in the denominator for the same reason
    Stryker's NoCoverage and PIT's NO_COVERAGE do: a mutant no test reaches
    is one the suite failed to catch. `suspicious`, `skipped`, `segfault`
    and an interrupted check are excluded — they are mutmut's equivalent of
    PIT's NON_VIABLE/RUN_ERROR and say nothing about the suite.
    """
    try:
        stats = json.loads(stats_path.read_text())
    except (OSError, json.JSONDecodeError):
        return EMPTY_RESULT
    detected = stats.get("killed", 0) + stats.get("timeout", 0)
    no_coverage = stats.get("no_tests", 0)
    survived = stats.get("survived", 0) + no_coverage
    return _result_from_counts(detected, survived, no_coverage)


def ensure_mutmut_installed(run_dir: Path, log) -> bool:
    """Install mutmut into the run's venv without touching its pyproject."""
    if (run_dir / ".venv/bin/mutmut").is_file():
        return True
    cmd = ["uv", "pip", "install", f"mutmut=={MUTMUT_VERSION}"]
    try:
        proc = subprocess.run(
            cmd, cwd=run_dir, capture_output=True, text=True, timeout=600,
            env={**os.environ, "VIRTUAL_ENV": str(run_dir / ".venv")},
        )
    except (subprocess.TimeoutExpired, FileNotFoundError) as exc:
        log(f"  mutmut install failed: {exc}")
        return False
    if proc.returncode != 0:
        log(f"  mutmut install exited {proc.returncode}: "
            f"{proc.stderr.strip()[:300]}")
        return False
    return True


def run_mutmut(run_dir: Path, timeout_seconds: int, log) -> MutationResult:
    """Run mutmut in run_dir and return mutation_score (0.0-1.0) or None."""
    stats_path = run_dir / MUTMUT_STATS
    if stats_path.is_file():
        stats_path.unlink()
    log_path = run_dir / "mutmut.log"
    venv_bin = run_dir / ".venv/bin"
    mutmut = venv_bin / "mutmut"

    # Put the run's venv first on PATH. mutmut instruments every mutated
    # module with a trampoline that imports `mutmut` at module load, so a test
    # that shells out to a bare `python3` — a natural way to test a CLI that
    # reads stdin — would otherwise run under the system interpreter, fail the
    # import, and take mutmut's clean-test baseline down with it. Scoring then
    # returns null for a run whose suite is perfectly healthy.
    env = os.environ.copy()
    env["PATH"] = f"{venv_bin}{os.pathsep}{env.get('PATH', '')}"

    try:
        with log_path.open("w") as f:
            for cmd in ([str(mutmut), "run"], [str(mutmut), "export-cicd-stats"]):
                f.write(f"$ {' '.join(cmd)}\n")
                f.flush()
                proc = subprocess.run(
                    cmd, cwd=run_dir, stdout=f, stderr=subprocess.STDOUT,
                    timeout=timeout_seconds, env=env,
                )
                # `mutmut run` exits non-zero when mutants survive, which is a
                # result, not a failure. Only a missing stats file is fatal.
                if proc.returncode != 0:
                    log(f"  {cmd[-1]} exited {proc.returncode}; see mutmut.log")
    except subprocess.TimeoutExpired:
        log(f"  TIMEOUT after {timeout_seconds}s — score stays null")
        return EMPTY_RESULT

    if not stats_path.is_file():
        log("  no mutmut-cicd-stats.json produced; score stays null")
        return EMPTY_RESULT
    return mutation_score_from_mutmut_stats(stats_path)


# cargo-mutants is installed in the image (Dockerfile, rust-tools stage); this
# pin is only checked, so a drifted image is reported rather than mixed in.
CARGO_MUTANTS_VERSION = "27.1.0"
CARGO_MUTANTS_OUT = Path(".analysis-mutants")


def cargo_mutants_args(run_dir: Path) -> list[str]:
    """The canonical invocation, independent of any config the agent wrote.

    `--no-config` ignores a `.cargo/mutants.toml` from the run, for the reason
    with_canonical_mutmut_config drops an agent-written [tool.mutmut]. The CLI
    in src/main.rs is excluded when the run separated its domain from it, as
    on TypeScript and Python: only the external acceptance suite exercises the
    adapter. When main.rs is the only production code it is mutated, the same
    escape hatch mutmut_config_for has.
    """
    args = ["cargo", "mutants", "--no-config", "--no-shuffle",
            "--output", str(CARGO_MUTANTS_OUT)]
    others = [p for p in (run_dir / "src").rglob("*.rs") if p.name != "main.rs"]
    has_domain = False
    for p in others:
        try:
            if p.read_text(errors="replace").strip():
                has_domain = True
                break
        except OSError:
            continue
    if has_domain:
        args += ["--exclude", "src/main.rs"]
    return args


def mutation_score_from_cargo_mutants(outcomes_path: Path) -> MutationResult:
    """Score and counts from cargo-mutants' outcomes.json.

        score = (caught + timeout) / (caught + timeout + missed)

    `unviable` mutants (the mutated code does not compile) are excluded, like
    PIT's NON_VIABLE. cargo-mutants has no coverage notion — a missed mutant
    may or may not have been reached — so `no_coverage` is null, not 0.
    """
    try:
        data = json.loads(outcomes_path.read_text())
    except (OSError, json.JSONDecodeError):
        return EMPTY_RESULT
    detected = (data.get("caught") or 0) + (data.get("timeout") or 0)
    survived = data.get("missed") or 0
    return _result_from_counts(detected, survived, None)


def run_cargo_mutants(run_dir: Path, timeout_seconds: int, log) -> MutationResult:
    """Run cargo-mutants in run_dir and return the result."""
    import shutil
    out_dir = run_dir / CARGO_MUTANTS_OUT
    shutil.rmtree(out_dir, ignore_errors=True)
    log_path = run_dir / "cargo-mutants.log"
    # The stack runs Cargo offline against the registry baked into the image.
    # This script runs on the host, whose registry may lack the pinned crates,
    # so the network is allowed here; Cargo.lock (with --locked on the fetch)
    # keeps the versions identical to the run's.
    env = {**os.environ, "CARGO_NET_OFFLINE": "false"}
    try:
        subprocess.run(["cargo", "fetch", "--locked"], cwd=run_dir, env=env,
                       capture_output=True, timeout=600)
        ver = subprocess.run(["cargo", "mutants", "--version"], cwd=run_dir,
                             capture_output=True, text=True, timeout=60, env=env)
        if CARGO_MUTANTS_VERSION not in ver.stdout:
            log(f"  WARNING: cargo-mutants is {ver.stdout.strip()!r}, "
                f"pinned {CARGO_MUTANTS_VERSION}")
        with log_path.open("w") as f:
            cmd = cargo_mutants_args(run_dir)
            f.write(f"$ {' '.join(cmd)}\n")
            f.flush()
            proc = subprocess.run(cmd, cwd=run_dir, stdout=f, env=env,
                                  stderr=subprocess.STDOUT, timeout=timeout_seconds)
    except subprocess.TimeoutExpired:
        log(f"  TIMEOUT after {timeout_seconds}s — score stays null")
        return EMPTY_RESULT
    except FileNotFoundError as exc:
        log(f"  cargo-mutants unavailable: {exc}")
        return EMPTY_RESULT
    # Exit 2 means mutants were missed: a result, not a failure. Only a
    # missing outcomes file is fatal.
    if proc.returncode not in (0, 2, 3):
        log(f"  cargo mutants exited {proc.returncode}; see cargo-mutants.log")
    outcomes = out_dir / "mutants.out" / "outcomes.json"
    if not outcomes.is_file():
        log("  no outcomes.json produced; score stays null")
        return EMPTY_RESULT
    return mutation_score_from_cargo_mutants(outcomes)


STRYKER_VERSION = "8.6.0"
STRYKER_PKGS = [
    f"@stryker-mutator/core@{STRYKER_VERSION}",
    f"@stryker-mutator/vitest-runner@{STRYKER_VERSION}",
]


HOIST_LINE = "public-hoist-pattern[]=*stryker*"


def ensure_npmrc_hoist(run_dir: Path, log) -> bool:
    """Stryker's plugin loader can't see vitest-runner under pnpm's
    isolated layout. We need ``public-hoist-pattern[]=*stryker*`` in
    .npmrc *before* the first install — pnpm refuses to add packages to
    a node_modules tree that was created with a different hoist config.
    Returns True if .npmrc was already correct, False if we had to wipe
    node_modules (caller should reinstall)."""
    npmrc = run_dir / ".npmrc"
    text = npmrc.read_text() if npmrc.is_file() else ""
    if HOIST_LINE in text:
        return True
    npmrc.write_text(text + HOIST_LINE + "\n")
    nm = run_dir / "node_modules"
    if nm.is_dir():
        log("  hoist pattern changed → wiping node_modules for clean install")
        import shutil as _sh
        _sh.rmtree(nm)
    return False


def ensure_node_modules(run_dir: Path, log) -> bool:
    """Make sure node_modules/ exists. Mirrors reanalyze-all-runs.sh."""
    if (run_dir / "node_modules").is_dir():
        return True
    log(f"  pnpm install (no node_modules) ...")
    result = subprocess.run(
        ["pnpm", "install",
         "--store-dir", str(PNPM_STORE),
         "--prefer-offline", "--silent"],
        cwd=run_dir, capture_output=True, text=True,
    )
    if result.returncode != 0:
        log(f"  pnpm install FAILED:\n{result.stderr[-500:]}")
        return False
    return True


def ensure_stryker_installed(run_dir: Path, log) -> bool:
    """Add Stryker to the run's devDeps if missing. Cheap cache-hit when
    the pnpm store is warmed via package.cache.json. Assumes
    ensure_npmrc_hoist has already prepared .npmrc.
    """
    # Check the package, not the launcher. pnpm writes node_modules/.bin/stryker
    # as a POSIX shell shim rather than a symlink, so it outlives the package
    # it dispatches to: after a partial removal of node_modules the shim is
    # still there, the install is skipped, and Stryker dies with
    # MODULE_NOT_FOUND into stryker.log — which reaches the RQ as an
    # unexplained null rather than as a missing dependency.
    if (run_dir / "node_modules" / "@stryker-mutator" / "core").is_dir():
        return True

    log(f"  installing stryker {STRYKER_VERSION} into run dir ...")
    result = subprocess.run(
        ["pnpm", "add", "-D",
         "--store-dir", str(PNPM_STORE),
         "--prefer-offline", "--silent",
         *STRYKER_PKGS],
        cwd=run_dir, capture_output=True, text=True,
    )
    if result.returncode != 0:
        log(f"  stryker install FAILED:\n{result.stderr[-500:]}")
        return False
    return True


@contextlib.contextmanager
def stryker_env_bridge(run_dir: Path, log):
    """Install the active-mutant env bridge for the duration of the block.

    Writes STRYKER_ENV_BRIDGE into the run and registers it as the first
    Vitest setup file, then restores vitest.config.ts verbatim. The config is
    the stack's own file rather than the agent's artifact, so the one-line
    insert is predictable — but a run whose config already declares
    `setupFiles` is left alone rather than rewritten, and the caller is told,
    because merging into an existing array textually is the kind of edit that
    silently drops an entry.

    Yields True when the bridge is active, False when it could not be
    installed. A spawned child sees the mutant only in the True case.
    """
    config_path = run_dir / "vitest.config.ts"
    bridge_path = run_dir / STRYKER_ENV_BRIDGE_FILE
    original_config = config_path.read_text() if config_path.is_file() else None

    installed = False
    if original_config is None:
        log("  no vitest.config.ts — env bridge not installed")
    elif "setupFiles" in original_config:
        log("  vitest.config.ts already declares setupFiles — "
            "env bridge not installed")
    elif "  test: {\n" not in original_config:
        log("  unexpected vitest.config.ts shape — env bridge not installed")
    else:
        bridge_path.write_text(STRYKER_ENV_BRIDGE)
        config_path.write_text(original_config.replace(
            "  test: {\n",
            f"  test: {{\n    setupFiles: ['./{STRYKER_ENV_BRIDGE_FILE}'],\n",
            1))
        installed = True
    try:
        yield installed
    finally:
        # Measuring must not alter the recorded artifact.
        if installed:
            config_path.write_text(original_config)
            bridge_path.unlink(missing_ok=True)


def run_stryker(run_dir: Path, timeout_seconds: int, log,
                coverage_analysis: str = "perTest") -> MutationResult:
    """Run Stryker in run_dir and return its MutationResult.

    `coverage_analysis` selects Stryker's mutant scheduling. The default
    "perTest" is the fast path and is correct for a suite that imports the
    implementation. "off" is the subprocess-safe fallback — see the comment on
    STRYKER_ENV_BRIDGE — and costs a full suite run per mutant.
    """
    cfg_path = run_dir / "stryker.config.json"
    cfg_path.write_text(json.dumps(
        {**STRYKER_CONFIG, "coverageAnalysis": coverage_analysis}, indent=2))

    log_path = run_dir / "stryker.log"
    report_path = run_dir / "reports" / "mutation" / "mutation-report.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)

    # Use the run-local Stryker binary (installed by ensure_stryker_installed).
    # A global Stryker cannot resolve the run's `typescript` and crashes with
    # ERR_MODULE_NOT_FOUND in the TS-config preprocessor.
    stryker_bin = run_dir / "node_modules" / ".bin" / "stryker"
    if not stryker_bin.exists():
        log("  stryker binary missing in node_modules/.bin; aborting")
        return EMPTY_RESULT
    cmd = [str(stryker_bin), "run", "--logLevel", "info"]

    # Prepend node_modules/.bin to PATH so test code that spawns
    # subprocesses (e.g. `spawnSync("tsx", ...)` for CLI integration tests)
    # can resolve devDep binaries. Without this, Stryker's vitest worker
    # inherits a PATH that omits the run's local bin dir, and CLI tests
    # fail in the initial dry run with status=null.
    env = os.environ.copy()
    env["PATH"] = f"{run_dir / 'node_modules' / '.bin'}{os.pathsep}{env.get('PATH', '')}"
    # Host pnpm can be newer than the container-pinned version. pnpm 11 emits a
    # deprecation warning for package.json's `pnpm.onlyBuiltDependencies`; CLI
    # tests that correctly assert empty stderr then fail Stryker's dry run. The
    # setting has already served its purpose during install, so hide it only
    # while mutation tests run and restore the original package verbatim.
    package_path = run_dir / "package.json"
    original_package = package_path.read_text()
    package = json.loads(original_package)
    had_pnpm_settings = "pnpm" in package
    if had_pnpm_settings:
        package.pop("pnpm")
        package_path.write_text(json.dumps(package, indent=2) + "\n")
    try:
        try:
            with log_path.open("w") as f:
                f.write(f"$ {' '.join(cmd)}\n")
                f.flush()
                proc = subprocess.run(
                    cmd, cwd=run_dir, stdout=f, stderr=subprocess.STDOUT,
                    timeout=timeout_seconds, env=env,
                )
        except subprocess.TimeoutExpired:
            log(f"  TIMEOUT after {timeout_seconds}s — score stays null")
            return unmeasurable(TIMEOUT_REASON.format(
                seconds=timeout_seconds, mode=coverage_analysis))
    finally:
        if had_pnpm_settings:
            package_path.write_text(original_package)

    if proc.returncode != 0:
        log(f"  stryker exited {proc.returncode}; see stryker.log")
        # fall through — sometimes Stryker exits non-zero on low score but
        # still wrote a report; try to parse anyway.

    if not report_path.is_file():
        log("  no mutation-report.json produced; score stays null")
        return unmeasurable("stryker produced no mutation-report.json; "
                            "see stryker.log")

    try:
        report = json.loads(report_path.read_text())
    except json.JSONDecodeError as e:
        log(f"  malformed mutation-report.json ({e}); score stays null")
        return unmeasurable(f"malformed mutation-report.json ({e})")

    result = mutation_score_from_report(report)
    if result.score is None:
        return unmeasurable("stryker scored no mutant; see stryker.log")
    return result


def run_subprocess_safe(run_dir: Path, timeout_seconds: int,
                        log) -> MutationResult:
    """Measure a run whose suite drives the implementation through a child.

    The env bridge plus coverageAnalysis="off" — see STRYKER_ENV_BRIDGE for
    why both are needed. A result that still kills nothing is reported as
    unmeasurable rather than as 0.000: at that point the two readings cannot
    be told apart, and a null that says so is the honest one.
    """
    with stryker_env_bridge(run_dir, log) as bridged:
        if not bridged:
            return unmeasurable(
                "the suite reaches the implementation only through a spawned "
                "process and the env bridge could not be installed")
        result = run_stryker(run_dir, timeout_seconds, log,
                             coverage_analysis="off")
    return unmeasurable(SUBPROCESS_ONLY_REASON) if killed_nothing(result) \
        else result


def update_metrics_json(metrics_path: Path, result: MutationResult) -> None:
    metrics = json.loads(metrics_path.read_text())
    final = metrics.setdefault("final_metrics", {})
    final["mutation_score"] = result.score
    final["mutants_total"] = result.total
    final["mutants_survived"] = result.survived
    final["mutants_no_coverage"] = result.no_coverage
    final["mutation_unmeasurable_reason"] = result.reason
    metrics_path.write_text(json.dumps(metrics, indent=2) + "\n")


def eligible(metrics: dict, force: bool) -> tuple[bool, str]:
    """Return (run_it, reason). reason is for logging when skipping.

    Eligibility is gated on ``tests_passing == true`` alone — a green
    internal suite is the only precondition mutation testing needs.
    ``exit_reason`` (timeout / error-N / rate-limited) is irrelevant:
    if analyze-run.sh marked tests as passing, the suite runs and Stryker
    can score it.
    """
    fm = metrics.get("final_metrics") or {}
    if fm.get("tests_passing") is not True:
        return False, "tests_passing != true"
    existing = fm.get("mutation_score")
    # A recorded 0.000 with every mutant survived is the subprocess-only
    # artifact, which this script no longer writes — see STRYKER_ENV_BRIDGE.
    # Treating it as unmeasured rather than as a score makes the fix reach the
    # runs that already carry the bad value, without a one-off clearing pass
    # per RQ and without --force, which would re-measure the whole pool.
    if existing == 0.0 and fm.get("mutants_total") \
            and fm.get("mutants_survived") == fm.get("mutants_total"):
        return True, ""
    if isinstance(existing, (int, float)) and not force:
        return False, f"mutation_score already set ({existing:.3f})"
    return True, ""


def report_result_for(run_dir: Path) -> MutationResult:
    """Parse the engine report a previous run left in place, without re-running.

    Returns EMPTY_RESULT when the report is absent or unreadable. Engine
    reports live under gitignored paths, so they survive only until the working
    tree is cleaned — which is what makes a backfill from them time-limited
    rather than always available.
    """
    stack = run_stack(run_dir)
    if stack == "java-junit-maven":
        path = run_dir / "target" / "pit-reports" / "mutations.xml"
        return mutation_score_from_pit_report(path) if path.is_file() \
            else EMPTY_RESULT
    if stack == "python-pytest":
        path = run_dir / MUTMUT_STATS
        return mutation_score_from_mutmut_stats(path) if path.is_file() \
            else EMPTY_RESULT
    if stack == "rust-cargo":
        path = run_dir / CARGO_MUTANTS_OUT / "mutants.out" / "outcomes.json"
        return mutation_score_from_cargo_mutants(path) if path.is_file() \
            else EMPTY_RESULT
    path = run_dir / "reports" / "mutation" / "mutation-report.json"
    if not path.is_file():
        return EMPTY_RESULT
    try:
        return mutation_score_from_report(json.loads(path.read_text()))
    except (OSError, json.JSONDecodeError):
        return EMPTY_RESULT


def backfill_from_reports(rq_id: str, matched: list) -> int:
    """Rewrite the mutation fields of every matched run from its own report.

    A run whose report is gone is left untouched rather than zeroed: the score
    it already carries is real, and overwriting it with null would destroy data
    that cannot be recovered without re-running the engine.
    """
    n_written = n_unchanged = n_no_report = 0
    for m_file, *_rest in matched:
        run_dir = m_file.parent
        result = report_result_for(run_dir)
        if result.score is None:
            n_no_report += 1
            print(f"  no usable report, left as is: {run_dir.name}",
                  file=sys.stderr)
            continue
        before = (json.loads(m_file.read_text()).get("final_metrics")
                  or {}).get("mutants_no_coverage")
        update_metrics_json(m_file, result)
        if before == result.no_coverage:
            n_unchanged += 1
        else:
            n_written += 1
    print(f"{rq_id}: backfilled={n_written}, already current={n_unchanged}, "
          f"no report={n_no_report}", file=sys.stderr)
    return 0


def main(argv: list[str]) -> int:
    # Mutation testing runs the suite once per mutant — hundreds of
    # invocations. The stack's TDD event reporter must stay out of all of them,
    # or tdd-events.jsonl stops describing the agent's exercise and starts
    # describing ours. Set once here: every engine below inherits the
    # environment through os.environ.copy().
    os.environ["TDD_REPORTER_OFF"] = "1"

    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("rq_path", type=Path,
                        help="path to RQ dir (or its README.md)")
    parser.add_argument("--limit", type=int, default=None,
                        help="process at most N eligible runs (smoke test)")
    parser.add_argument("--timeout-seconds", type=int, default=1800,
                        help="mutation-testing wallclock per run (default 1800)")
    parser.add_argument("--dry-run", action="store_true",
                        help="list eligible runs without running mutation tests")
    parser.add_argument("--force", action="store_true",
                        help="recompute even if mutation_score is already set")
    parser.add_argument("--no-subprocess-retry", action="store_true",
                        help="do not re-measure a run that killed no mutant "
                             "with the subprocess-safe fallback (TypeScript "
                             "only); such runs then stay null rather than "
                             "costing a full suite run per mutant")
    parser.add_argument("--from-reports", action="store_true",
                        help="re-derive the counts from each run's existing "
                             "engine report instead of running the engine; "
                             "use to backfill fields added after a run scored")
    args = parser.parse_args(argv)

    md_in = args.rq_path / "README.md" if args.rq_path.is_dir() else args.rq_path
    if not md_in.is_file():
        print(f"Not found: {md_in}", file=sys.stderr)
        return 1

    fm = agg.parse_frontmatter(md_in)
    rq_id = fm.get("id", "?")
    outcomes = fm.get("outcomes") or []
    if "mutation_score" not in outcomes:
        print(f"{rq_id}: outcomes do not include 'mutation_score'; "
              f"nothing to do.", file=sys.stderr)
        return 0

    cells = agg.expand_cells(fm)
    matched, _by_cell = agg.collect_runs(cells)

    if args.from_reports:
        return backfill_from_reports(rq_id, matched)

    n_total = len(matched)
    n_already = 0
    n_skipped_red = 0
    n_skipped_other = 0
    eligible_paths: list[Path] = []

    for m_file, _cell_model, _cell_workflow, _cell_harness in matched:
        try:
            metrics = json.loads(m_file.read_text())
        except json.JSONDecodeError:
            n_skipped_other += 1
            continue
        run_it, reason = eligible(metrics, args.force)
        if not run_it:
            if reason.startswith("mutation_score already"):
                n_already += 1
            elif reason.startswith("tests_passing"):
                n_skipped_red += 1
            else:
                n_skipped_other += 1
            continue
        eligible_paths.append(m_file)

    if args.limit is not None:
        eligible_paths = eligible_paths[: args.limit]

    print(f"{rq_id}: {n_total} matching runs — "
          f"{n_already} already scored, {n_skipped_red} red, "
          f"{n_skipped_other} other-skip, {len(eligible_paths)} to run",
          file=sys.stderr)

    if args.dry_run:
        for p in eligible_paths:
            print(p.parent.name)
        return 0

    n_executed = 0
    n_failed = 0
    for m_file in eligible_paths:
        run_dir = m_file.parent
        run_id = run_dir.name
        print(f"--- {run_id}", file=sys.stderr)

        def log(msg: str, _rid=run_id) -> None:
            print(f"  [{_rid}] {msg}", file=sys.stderr)

        stack = run_stack(run_dir)

        if stack == "java-junit-maven":
            result = run_pitest(run_dir, args.timeout_seconds, log)
            update_metrics_json(m_file, result)
            if result.score is None:
                n_failed += 1
                log("score=null (see pit.log)")
            else:
                n_executed += 1
                log(f"score={result.score:.3f} "
                    f"({result.survived}/{result.total} survived)")
            continue

        if stack == "rust-cargo":
            result = run_cargo_mutants(run_dir, args.timeout_seconds, log)
            update_metrics_json(m_file, result)
            if result.score is None:
                n_failed += 1
                log("score=null (see cargo-mutants.log)")
            else:
                n_executed += 1
                log(f"score={result.score:.3f} "
                    f"({result.survived}/{result.total} survived)")
            continue

        if stack == "python-pytest":
            if not ensure_mutmut_installed(run_dir, log):
                n_failed += 1
                update_metrics_json(m_file, EMPTY_RESULT)
                continue
            pyproject_path = run_dir / "pyproject.toml"
            original_pyproject = pyproject_path.read_text()
            try:
                pyproject_path.write_text(with_canonical_mutmut_config(
                    original_pyproject, mutmut_config_for(run_dir)))
                result = run_mutmut(run_dir, args.timeout_seconds, log)
            finally:
                # Measuring must not alter the recorded artifact.
                pyproject_path.write_text(original_pyproject)
            update_metrics_json(m_file, result)
            if result.score is None:
                n_failed += 1
                log("score=null (see mutmut.log)")
            else:
                n_executed += 1
                log(f"score={result.score:.3f} "
                    f"({result.survived}/{result.total} survived)")
            continue

        ensure_npmrc_hoist(run_dir, log)

        if not ensure_node_modules(run_dir, log):
            n_failed += 1
            update_metrics_json(m_file, EMPTY_RESULT)
            continue

        if not mutable_sources(run_dir):
            n_failed += 1
            reason = ("not measurable: nothing matches the mutate glob — the "
                      "implementation sits in src/cli.ts, which is excluded "
                      "as the CLI adapter")
            update_metrics_json(m_file, unmeasurable(reason))
            log(f"score=null ({reason})")
            continue

        package_path = run_dir / "package.json"
        original_package = package_path.read_text()
        try:
            if not ensure_stryker_installed(run_dir, log):
                n_failed += 1
                update_metrics_json(m_file, EMPTY_RESULT)
                continue

            # A suite that imports no mutable source cannot be scheduled by
            # "perTest" at all — its coverage map is empty — so measure it
            # subprocess-safe straight away rather than spending the budget on
            # an attempt that can only come back empty.
            if args.no_subprocess_retry:
                result = run_stryker(run_dir, args.timeout_seconds, log)
            elif not specs_import_mutable_source(run_dir):
                log("  no spec imports a mutable source — measuring "
                    "subprocess-safe (env bridge, coverageAnalysis=off)")
                result = run_subprocess_safe(run_dir, args.timeout_seconds,
                                             log)
            else:
                result = run_stryker(run_dir, args.timeout_seconds, log)
                if wants_subprocess_retry(result):
                    # Either nothing was killed — the signature of a suite
                    # whose mutants are never really exercised,
                    # indistinguishable from a worthless suite — or the
                    # attempt ran out of time. Settle it by measuring instead
                    # of recording a 0.000 or an unexplained null. The bridged
                    # attempt is also the cheaper one: a killed mutant fails
                    # the suite early where an untouched one runs all of it
                    # (measured 2m51s against 13m52s on the same 60 mutants).
                    log(f"  {result.reason or f'killed 0 of {result.total}'}"
                        f" — retrying subprocess-safe "
                        f"(env bridge, coverageAnalysis=off)")
                    result = run_subprocess_safe(run_dir,
                                                 args.timeout_seconds, log)
        finally:
            # Installing the analysis tool must not alter the recorded artifact.
            package_path.write_text(original_package)
        update_metrics_json(m_file, result)
        if result.score is None:
            n_failed += 1
            log(f"score=null ({result.reason or 'see stryker.log'})")
        else:
            n_executed += 1
            log(f"score={result.score:.3f} "
                f"({result.survived}/{result.total} survived)")

    print(f"{rq_id}: executed={n_executed}, failed={n_failed}, "
          f"already={n_already}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
