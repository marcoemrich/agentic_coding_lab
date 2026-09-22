import pytest


def test_cli_applies_one_generation_for_sample_input():
    """The CLI reads one JSON object and writes only the expected JSON object."""
    import json
    import subprocess
    import sys

    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input='{"aliveCells": [[0, 0], [1, 0]], "steps": 1}',
        text=True,
        capture_output=True,
        check=False,
    )

    assert result.returncode == 0
    assert json.loads(result.stdout) == {"aliveCells": []}


def test_cli_applies_requested_steps_and_sorts_output():
    """The CLI repeats next_generation and emits deterministic coordinate order."""
    import json
    import subprocess
    import sys

    request = {
        "aliveCells": [
            [11, 1],
            [0, 2],
            [10, 0],
            [0, 0],
            [11, 0],
            [0, 1],
            [10, 1],
        ],
        "steps": 2,
    }
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "aliveCells": [
            [0, 0],
            [0, 1],
            [0, 2],
            [10, 0],
            [10, 1],
            [11, 0],
            [11, 1],
        ]
    }
