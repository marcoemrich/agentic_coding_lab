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
    return result.stdout




def test_cli_maps_empty_input_to_empty_output():
    assert json.loads(run_cli({"aliveCells": [], "steps": 1})) == {"aliveCells": []}


def test_cli_applies_one_generation():
    output = run_cli({"aliveCells": [[0, 0], [1, 0], [0, 1]], "steps": 1})

    assert json.loads(output) == {"aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]}


def test_cli_applies_multiple_steps():
    output = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert json.loads(output) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_cli_sorts_output_cells_by_x_then_y():
    scrambled_block = {"aliveCells": [[1, 1], [0, 1], [1, 0], [0, 0]], "steps": 1}

    assert json.loads(run_cli(scrambled_block)) == {
        "aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]],
    }


def test_cli_writes_only_one_json_object_to_stdout():
    stdout = run_cli({"aliveCells": [[0, 0], [1, 0], [0, 1]], "steps": 1})

    response = json.loads(stdout)
    assert list(response) == ["aliveCells"]
