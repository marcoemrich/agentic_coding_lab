import json
import subprocess
import sys
from pathlib import Path

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def cli_stdout(request):
    """Run the CLI as the specification describes and return its raw stdout."""
    completed = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(request),
        capture_output=True,
        text=True,
        check=True,
    )
    return completed.stdout


def run_cli(request):
    """Run the CLI and return its response object."""
    return json.loads(cli_stdout(request))


def test_cli_writes_next_generation_as_json():
    """A lone live cell dies, so the CLI reports no living cells."""
    assert run_cli({"aliveCells": [[0, 0]], "steps": 1}) == {"aliveCells": []}


def test_cli_applies_the_requested_number_of_steps():
    """Two steps return a blinker to its starting orientation."""
    blinker = [[0, 0], [0, 1], [0, 2]]
    response = run_cli({"aliveCells": blinker, "steps": 2})
    assert sorted(response["aliveCells"]) == sorted(blinker)


def test_cli_emits_cells_sorted_by_x_then_y():
    """A scrambled block comes back sorted by x, then y."""
    response = run_cli({"aliveCells": [[1, 1], [0, 1], [1, 0], [0, 0]], "steps": 1})
    assert response["aliveCells"] == [[0, 0], [0, 1], [1, 0], [1, 1]]


def test_cli_writes_only_the_json_object_on_stdout():
    """Stdout carries the response object and nothing else."""
    stdout = cli_stdout({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1})
    assert stdout.splitlines() == ['{"aliveCells": [[-1, 1], [0, 1], [1, 1]]}']
