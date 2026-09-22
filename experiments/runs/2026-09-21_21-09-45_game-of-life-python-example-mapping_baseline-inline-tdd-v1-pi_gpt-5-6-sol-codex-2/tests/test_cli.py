import json
import subprocess
import sys


def run_cli(payload: dict[str, object]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=False,
    )


def test_cli_outputs_one_generation_as_sorted_json() -> None:
    result = run_cli({"aliveCells": [[0, 2], [0, 0], [0, 1]], "steps": 1})

    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "aliveCells": [[-1, 1], [0, 1], [1, 1]],
    }
    assert result.stderr == ""


def test_cli_applies_multiple_steps() -> None:
    result = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]],
    }


def test_cli_zero_steps_preserves_and_sorts_input() -> None:
    result = run_cli({"aliveCells": [[2, -1], [-3, 4]], "steps": 0})

    assert result.returncode == 0
    assert json.loads(result.stdout) == {"aliveCells": [[-3, 4], [2, -1]]}
