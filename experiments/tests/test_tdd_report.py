"""red_batch counts tests that arrive failing, not tests that regress.

A red event can carry tests that were green a moment ago: the agent writes a
new test and, in the same step, breaks code that older tests cover. Those older
tests are a regression, not part of the batch. Seen 2026-10-19 on a Rust run
whose red_batch_max read 9 for one new test plus eight regressed ones.
"""
from conftest import load_script

tdd = load_script("tdd-report")


def ev(spec, impl, failed=(), passed=()):
    failed, passed = list(failed), list(passed)
    return {
        "suite_failed": bool(failed),
        "tests": {"failed": len(failed), "passed": len(passed),
                  "total": len(failed) + len(passed)},
        "collection_errors": 0,
        "failed_tests": failed,
        "passed_tests": passed,
        "tree": {"src/a.spec.ts": {"sha256": spec}, "src/a.ts": {"sha256": impl}},
    }


def red_batches(events):
    m = tdd.metrics(tdd.build(events))
    return m["red_batch_max"], m["red_batch_size"]


def test_regressed_tests_do_not_count_toward_the_red_batch():
    events = [
        ev("s1", "i1", failed=["t1"]),                         # Red
        ev("s1", "i2", passed=["t1"]),                         # Green
        ev("s2", "i2", failed=["t2"], passed=["t1"]),          # Red, one new test
        ev("s2", "i3", passed=["t1", "t2"]),                   # Green
        ev("s3", "i3", failed=["t3", "t1", "t2"]),             # Red: t3 new, t1/t2 regressed
        ev("s3", "i4", passed=["t1", "t2", "t3"]),             # Green
    ]
    assert red_batches(events) == (1, 1.0)


def test_several_new_failing_tests_still_count_as_a_batch():
    events = [
        ev("s1", "i1", failed=["t1"]),
        ev("s1", "i2", passed=["t1"]),
        ev("s2", "i2", failed=["t2", "t3", "t4"], passed=["t1"]),  # three new at once
        ev("s2", "i3", passed=["t1", "t2", "t3", "t4"]),
    ]
    assert red_batches(events)[0] == 3
