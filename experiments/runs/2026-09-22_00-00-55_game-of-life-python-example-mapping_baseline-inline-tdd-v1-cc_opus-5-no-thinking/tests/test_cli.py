import json
import subprocess
import sys
from pathlib import Path

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(request):
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(request),
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)


def test_cli_advances_one_step_by_default():
    assert run_cli({"aliveCells": [[0, 0], [1, 0], [0, 1]]}) == {
        "aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]
    }


def test_cli_applies_multiple_steps():
    blinker = {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}
    assert run_cli(blinker) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_cli_reports_extinction_as_empty_list():
    assert run_cli({"aliveCells": [[0, 0]], "steps": 1}) == {"aliveCells": []}
