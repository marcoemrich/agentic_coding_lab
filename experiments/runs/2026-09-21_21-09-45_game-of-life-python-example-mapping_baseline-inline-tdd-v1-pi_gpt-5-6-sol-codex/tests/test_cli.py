import json
import subprocess
import sys


def run_cli(request: dict[str, object]) -> dict[str, object]:
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(result.stdout)


def test_cli_applies_one_generation_and_sorts_cells() -> None:
    response = run_cli(
        {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1}
    )

    assert response == {"aliveCells": [[-1, 1], [0, 1], [1, 1]]}


def test_cli_applies_all_requested_steps() -> None:
    response = run_cli(
        {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}
    )

    assert response == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}
