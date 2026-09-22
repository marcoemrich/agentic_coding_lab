import json
from pathlib import Path
import subprocess
import sys


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def run_cli(payload):
    return subprocess.run(
        [sys.executable, str(CLI)], input=json.dumps(payload), text=True,
        capture_output=True, check=False,
    )


def test_scenario_uses_quote_step_index_and_retains_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [{"type": "amulet"}]},
            {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}},
            {"op": "quote", "items": [{"type": "sword", "cursed": True, "enchantment": 7}]},
            {"op": "claim", "policy": 2, "incident": {"cause": "curse", "damages": [{"itemType": "sword", "amount": 1500}]}},
        ],
    }
    completed = run_cli(scenario)
    assert completed.returncode == 0
    assert completed.stderr == ""
    assert json.loads(completed.stdout) == {"results": [
        {"premium": 59}, {"payout": 100, "remainingCap": 1100},
        {"premium": 160}, {"payout": 1400, "remainingCap": 600},
    ]}


def test_invalid_input_reports_only_to_stderr():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    completed = run_cli(scenario)
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert completed.stderr


def test_malformed_json_is_an_error():
    completed = subprocess.run(
        [sys.executable, str(CLI)], input="not-json", text=True,
        capture_output=True, check=False,
    )
    assert completed.returncode != 0
    assert completed.stdout == ""
