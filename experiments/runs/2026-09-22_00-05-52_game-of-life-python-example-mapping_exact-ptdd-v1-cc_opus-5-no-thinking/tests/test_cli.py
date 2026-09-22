import json
import pathlib
import subprocess
import sys

CLI = pathlib.Path(__file__).parent.parent / "src" / "cli.py"


def run_cli(request):
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(request),
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def test_cli_maps_an_empty_grid_to_an_empty_grid():
    output = run_cli({"aliveCells": [], "steps": 1})

    assert json.loads(output) == {"aliveCells": []}


def test_cli_applies_one_generation_and_sorts_cells_by_x_then_y():
    output = run_cli({"aliveCells": [[0, 0], [1, 0], [0, 1]], "steps": 1})

    assert json.loads(output) == {
        "aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]],
    }


def test_cli_applies_the_requested_number_of_steps():
    output = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert json.loads(output) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]],
    }


def test_cli_with_zero_steps_returns_the_input_sorted():
    output = run_cli({"aliveCells": [[1, 1], [0, 0]], "steps": 0})

    assert json.loads(output) == {"aliveCells": [[0, 0], [1, 1]]}


def test_cli_writes_only_one_json_object_to_stdout():
    output = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1})

    decoded, consumed = json.JSONDecoder().raw_decode(output)

    assert decoded == {"aliveCells": [[-1, 1], [0, 1], [1, 1]]}
    assert output[consumed:].strip() == ""
