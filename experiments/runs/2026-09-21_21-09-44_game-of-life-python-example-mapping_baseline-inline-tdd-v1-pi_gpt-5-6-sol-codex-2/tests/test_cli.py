import json
import subprocess
import sys


def run_cli(payload: dict[str, object]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(payload),
        capture_output=True,
        check=False,
        text=True,
    )


def test_cli_applies_one_generation() -> None:
    result = run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1})

    assert result.returncode == 0
    assert json.loads(result.stdout) == {"aliveCells": []}
    assert result.stderr == ""


def test_cli_applies_multiple_generations() -> None:
    result = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]],
    }


def test_cli_sorts_cells_by_x_then_y() -> None:
    result = run_cli({"aliveCells": [[1, 2], [-1, 4], [1, -2]], "steps": 0})

    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "aliveCells": [[-1, 4], [1, -2], [1, 2]],
    }
