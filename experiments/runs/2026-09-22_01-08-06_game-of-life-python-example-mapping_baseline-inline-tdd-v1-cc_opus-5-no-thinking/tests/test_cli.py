import json
import subprocess
import sys
from pathlib import Path

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(payload):
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(payload),
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)


def test_cli_advances_one_generation():
    assert run_cli({"aliveCells": [[0, 0], [1, 0], [0, 1]], "steps": 1}) == {
        "aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]
    }


def test_cli_applies_multiple_steps():
    assert run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]]
    }


def test_cli_defaults_to_a_single_step():
    assert run_cli({"aliveCells": [[0, 0]]}) == {"aliveCells": []}


def test_cli_with_zero_steps_returns_input_sorted():
    assert run_cli({"aliveCells": [[1, 0], [0, 0]], "steps": 0}) == {
        "aliveCells": [[0, 0], [1, 0]]
    }
