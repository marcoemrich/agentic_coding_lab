import json
import subprocess
import sys
from pathlib import Path


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def run_cli(payload: dict[str, object]) -> dict[str, object]:
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(result.stdout)


def test_cli_advances_one_generation() -> None:
    assert run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1}) == {
        "aliveCells": []
    }


def test_cli_sorts_cells_by_x_then_y() -> None:
    result = run_cli(
        {"aliveCells": [[1, 2], [-1, 4], [1, -2], [0, 0]], "steps": 0}
    )

    assert result == {"aliveCells": [[-1, 4], [0, 0], [1, -2], [1, 2]]}


def test_cli_applies_multiple_steps() -> None:
    result = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert result == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}
