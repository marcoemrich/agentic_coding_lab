import json
from pathlib import Path
import subprocess
import sys


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def run_cli(document):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(document),
        text=True,
        capture_output=True,
        check=False,
    )


def test_cli_processes_sequential_scenario_as_json():
    completed = run_cli({
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [
                {"type": "amulet", "material": "silver", "enchantment": 2,
                 "cursed": False},
            ]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire",
                "damages": [{"itemType": "amulet", "amount": 200}],
            }},
        ],
    })
    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100},
        ]
    }
    assert completed.stderr == ""


def test_cli_failure_has_only_stderr_and_no_partial_results():
    completed = run_cli({
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire",
                "damages": [{"itemType": "amulet", "amount": 200}],
            }},
        ],
    })
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert completed.stderr


def test_cli_rejects_invalid_json():
    completed = subprocess.run(
        [sys.executable, str(CLI)], input="not json", text=True,
        capture_output=True, check=False,
    )
    assert completed.returncode != 0
    assert completed.stdout == ""
