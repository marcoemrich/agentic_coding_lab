import json
import subprocess
import sys
from pathlib import Path

import pytest

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(request):
    return complete_cli_run(request).stdout


def complete_cli_run(request):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(request),
        capture_output=True,
        text=True,
        check=True,
    )


def test_cli_emits_empty_alive_cells_for_dying_single_cell():
    output = run_cli({"aliveCells": [[0, 0]], "steps": 1})

    assert json.loads(output) == {"aliveCells": []}


def test_cli_applies_one_generation_and_sorts_by_x_then_y():
    block_in_scrambled_order = [[1, 1], [0, 1], [1, 0], [0, 0]]

    output = run_cli({"aliveCells": block_in_scrambled_order, "steps": 1})

    assert json.loads(output) == {"aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]}


def test_cli_applies_next_generation_the_requested_number_of_steps():
    vertical_blinker = [[0, 0], [0, 1], [0, 2]]

    output = run_cli({"aliveCells": vertical_blinker, "steps": 2})

    assert json.loads(output) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_cli_with_zero_steps_returns_input_sorted():
    lone_cell_and_a_neighbor = [[3, 7], [-2, 5]]

    output = run_cli({"aliveCells": lone_cell_and_a_neighbor, "steps": 0})

    assert json.loads(output) == {"aliveCells": [[-2, 5], [3, 7]]}


def test_cli_writes_only_one_json_object_to_stdout():
    completed = complete_cli_run({"aliveCells": [[0, 0], [1, 0], [0, 1]], "steps": 1})

    decoder = json.JSONDecoder()
    _, end_of_first_object = decoder.raw_decode(completed.stdout)

    assert completed.stdout[end_of_first_object:].strip() == ""
