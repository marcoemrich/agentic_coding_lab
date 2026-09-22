import json
import subprocess
import sys
from pathlib import Path

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(request):
    completed = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(request),
        capture_output=True,
        text=True,
        check=True,
    )
    return completed.stdout


def test_cli_reports_an_empty_next_generation():
    stdout = run_cli({"aliveCells": [], "steps": 1})

    assert json.loads(stdout) == {"aliveCells": []}


def test_cli_applies_one_step_and_sorts_by_x_then_y():
    stdout = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1})

    assert json.loads(stdout) == {"aliveCells": [[-1, 1], [0, 1], [1, 1]]}


def test_cli_applies_the_requested_number_of_steps():
    stdout = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert json.loads(stdout) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_cli_writes_only_the_json_object_to_stdout():
    stdout = run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1})

    assert stdout == json.dumps({"aliveCells": []})
