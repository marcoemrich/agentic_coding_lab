import json
import subprocess
import sys


def run_cli(payload: dict[str, object]) -> dict[str, object]:
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(result.stdout)


def test_cli_applies_one_generation_and_sorts_cells() -> None:
    result = run_cli({"aliveCells": [[0, 2], [0, 0], [0, 1]], "steps": 1})

    assert result == {"aliveCells": [[-1, 1], [0, 1], [1, 1]]}


def test_cli_applies_multiple_generations() -> None:
    result = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert result == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def test_cli_with_zero_steps_only_normalizes_order() -> None:
    result = run_cli({"aliveCells": [[2, -1], [-2, 4]], "steps": 0})

    assert result == {"aliveCells": [[-2, 4], [2, -1]]}
