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


def test_cli_writes_next_generation_as_json():
    assert run_cli({"aliveCells": [[0, 0]], "steps": 1}) == {"aliveCells": []}


def test_cli_applies_the_requested_number_of_steps():
    """A blinker run for 2 steps returns to its original vertical position.

    Ordering is the separate concern of test_cli_emits_cells_sorted_by_x_then_y.
    """
    request = {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}

    assert sorted(run_cli(request)["aliveCells"]) == [[0, 0], [0, 1], [0, 2]]


def test_cli_emits_cells_sorted_by_x_then_y():
    """A block at the origin and one far away are emitted in x-then-y order."""
    two_blocks = [[0, 0], [1, 0], [0, 1], [1, 1], [10, 5], [11, 5], [10, 6], [11, 6]]
    request = {"aliveCells": two_blocks, "steps": 1}

    assert run_cli(request)["aliveCells"] == [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [10, 5],
        [10, 6],
        [11, 5],
        [11, 6],
    ]
