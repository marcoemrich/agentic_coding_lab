import pytest


def test_cli_applies_requested_generation():
    """The supplied adjacent-pair JSON produces {\"aliveCells\": []}."""
    import json
    import subprocess
    import sys

    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps({"aliveCells": [[0, 0], [1, 0]], "steps": 1}),
        capture_output=True,
        check=False,
        text=True,
    )

    assert completed.returncode == 0
    assert completed.stderr == ""
    assert json.loads(completed.stdout) == {"aliveCells": []}


def test_cli_applies_multiple_steps_and_sorts_by_x_then_y():
    """Two steps restore a blinker and emit cells sorted by x, then y."""
    import json
    import subprocess
    import sys

    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(
            {"aliveCells": [[0, 2], [0, 0], [0, 1]], "steps": 2}
        ),
        capture_output=True,
        check=False,
        text=True,
    )

    assert completed.returncode == 0
    assert completed.stderr == ""
    assert json.loads(completed.stdout) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]]
    }
