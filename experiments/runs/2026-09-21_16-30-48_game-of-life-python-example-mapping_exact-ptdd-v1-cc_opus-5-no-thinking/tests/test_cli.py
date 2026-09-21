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


def test_cli_emits_empty_alive_cells_for_empty_input():
    assert json.loads(run_cli({"aliveCells": [], "steps": 1})) == {"aliveCells": []}


def test_cli_applies_a_single_generation():
    response = run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1})

    assert json.loads(response) == {"aliveCells": []}


def test_cli_applies_next_generation_steps_times():
    response = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert json.loads(response) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_cli_with_zero_steps_returns_the_input_unchanged():
    """Reading adopted: applying next_generation zero times echoes the input cells."""
    response = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 0})

    assert json.loads(response) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_cli_emits_cells_sorted_by_x_then_y():
    block_far_from_the_origin = [[4, 9], [3, 9], [4, 8], [3, 8]]

    response = run_cli({"aliveCells": block_far_from_the_origin, "steps": 0})

    assert json.loads(response) == {"aliveCells": [[3, 8], [3, 9], [4, 8], [4, 9]]}


def test_cli_writes_only_one_json_object_to_stdout():
    completed = subprocess.run(
        ["python3", "src/cli.py"],
        cwd=CLI.parent.parent,
        input=json.dumps({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1}),
        capture_output=True,
        text=True,
        check=True,
    )

    decoder = json.JSONDecoder()
    response, consumed = decoder.raw_decode(completed.stdout)

    assert response == {"aliveCells": [[-1, 1], [0, 1], [1, 1]]}
    assert completed.stdout[consumed:].strip() == ""
