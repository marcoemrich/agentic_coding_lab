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


def test_cli_maps_empty_input_to_empty_output():
    assert json.loads(run_cli({"aliveCells": [], "steps": 1})) == {"aliveCells": []}


def test_cli_applies_a_single_step():
    dying_pair = run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1})
    assert json.loads(dying_pair) == {"aliveCells": []}

    block = run_cli({"aliveCells": [[0, 0], [1, 0], [0, 1], [1, 1]], "steps": 1})
    assert json.loads(block) == {"aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]}


def test_cli_applies_multiple_steps():
    blinker = [[0, 0], [0, 1], [0, 2]]
    assert json.loads(run_cli({"aliveCells": blinker, "steps": 2})) == {"aliveCells": blinker}


def test_cli_emits_cells_sorted_by_x_then_y():
    """A block placed so its cells span both axes, given in deliberately unsorted order."""
    unsorted_block = [[1, 1], [0, 1], [1, 0], [0, 0]]
    assert json.loads(run_cli({"aliveCells": unsorted_block, "steps": 1})) == {
        "aliveCells": [[0, 0], [0, 1], [1, 0], [1, 1]]
    }


def test_cli_writes_only_one_json_object_to_stdout():
    stdout = run_cli({"aliveCells": [[0, 0], [1, 0], [0, 1]], "steps": 1})
    decoder = json.JSONDecoder()
    _, end = decoder.raw_decode(stdout.lstrip())
    assert stdout.lstrip()[end:].strip() == ""
