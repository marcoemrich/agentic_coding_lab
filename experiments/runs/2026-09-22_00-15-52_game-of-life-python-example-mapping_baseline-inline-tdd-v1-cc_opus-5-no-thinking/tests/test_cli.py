import json
import subprocess
import sys
from pathlib import Path

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(request: dict) -> dict:
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(request),
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)


def test_single_cell_dies():
    assert run_cli({"aliveCells": [[0, 0]], "steps": 1}) == {"aliveCells": []}


def test_block_survives_and_is_sorted_by_x_then_y():
    request = {"aliveCells": [[1, 1], [0, 0], [1, 0], [0, 1]], "steps": 1}
    assert run_cli(request) == {"aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]}


def test_blinker_over_two_steps_returns_to_start():
    request = {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}
    assert run_cli(request) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_zero_steps_returns_the_input_unchanged():
    request = {"aliveCells": [[0, 0]], "steps": 0}
    assert run_cli(request) == {"aliveCells": [[0, 0]]}


def test_missing_steps_defaults_to_one_generation():
    assert run_cli({"aliveCells": [[0, 0]]}) == {"aliveCells": []}
