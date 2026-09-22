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


def test_it_advances_a_blinker_by_one_step():
    assert run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1}) == {
        "aliveCells": [[-1, 1], [0, 1], [1, 1]]
    }


def test_it_applies_the_requested_number_of_steps():
    assert run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]]
    }


def test_zero_steps_returns_the_input_generation():
    assert run_cli({"aliveCells": [[1, 0], [0, 0]], "steps": 0}) == {
        "aliveCells": [[0, 0], [1, 0]]
    }


def test_steps_defaults_to_one_when_omitted():
    assert run_cli({"aliveCells": [[0, 0]]}) == {"aliveCells": []}


def test_an_empty_input_produces_an_empty_output():
    assert run_cli({"aliveCells": [], "steps": 3}) == {"aliveCells": []}


def test_cells_are_sorted_by_x_then_y():
    block = [[1, 1], [0, 1], [1, 0], [0, 0]]

    assert run_cli({"aliveCells": block, "steps": 1}) == {
        "aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]
    }


def test_it_writes_nothing_but_the_json_object_to_stdout():
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps({"aliveCells": [[0, 0], [1, 0], [0, 1]], "steps": 1}),
        capture_output=True,
        text=True,
        check=True,
    )

    assert json.loads(result.stdout) == {
        "aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]
    }
