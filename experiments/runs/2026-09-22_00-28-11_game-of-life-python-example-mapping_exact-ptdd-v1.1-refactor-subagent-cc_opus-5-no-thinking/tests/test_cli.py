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
    return json.loads(completed.stdout)


def test_cli_maps_an_empty_grid_to_an_empty_grid():
    assert run_cli({"aliveCells": [], "steps": 1}) == {"aliveCells": []}


def test_cli_applies_one_generation():
    vertical_blinker = {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1}

    response = run_cli(vertical_blinker)

    assert sorted(response["aliveCells"]) == [[-1, 1], [0, 1], [1, 1]]


def test_cli_emits_cells_sorted_by_x_then_y():
    corner_triomino = {"aliveCells": [[0, 2], [1, 2], [0, 1]], "steps": 1}

    response = run_cli(corner_triomino)

    assert response["aliveCells"] == [[0, 1], [0, 2], [1, 1], [1, 2]]


def test_cli_maps_the_specification_example_to_an_empty_grid():
    dying_pair = {"aliveCells": [[0, 0], [1, 0]], "steps": 1}

    assert run_cli(dying_pair) == {"aliveCells": []}


def test_cli_applies_the_requested_number_of_steps():
    vertical_blinker = {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}

    response = run_cli(vertical_blinker)

    assert response["aliveCells"] == [[0, 0], [0, 1], [0, 2]]


def test_cli_writes_only_one_json_object_to_stdout():
    block = {"aliveCells": [[0, 0], [1, 0], [0, 1], [1, 1]], "steps": 1}

    completed = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(block),
        capture_output=True,
        text=True,
        check=True,
    )

    decoded, end_of_object = json.JSONDecoder().raw_decode(completed.stdout.strip())
    assert decoded == {"aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]}
    assert end_of_object == len(completed.stdout.strip())
