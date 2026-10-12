from conftest import load_script
from rq_facts import is_replicate


def test_a_run_that_ended_ok_is_a_replicate():
    assert is_replicate({"run_status": {"exit_reason": "ok"}})


def test_a_timeout_is_not_a_replicate():
    assert not is_replicate({"run_status": {"exit_reason": "timeout"}})


def test_a_run_still_executing_is_not_a_replicate():
    assert not is_replicate({})


def test_a_hyphenated_script_loads_as_a_module():
    aggregate = load_script("aggregate-by-query")
    assert callable(aggregate.parse_frontmatter)
