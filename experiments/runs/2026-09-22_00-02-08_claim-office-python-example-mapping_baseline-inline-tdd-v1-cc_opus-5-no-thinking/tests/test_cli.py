import json
import subprocess
import sys
from pathlib import Path

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


def test_cli_writes_results_as_json_to_stdout():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]},
            },
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_cli_reports_an_unknown_item_type_on_stderr_and_exits_non_zero():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stdout == ""
    assert result.stderr.strip() != ""


def test_cli_rejects_a_damage_to_an_uninsured_item():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]},
            },
        ],
    }
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stdout == ""
    assert result.stderr.strip() != ""


def test_cli_rejects_a_negative_damage_amount():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]},
            },
        ],
    }
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stdout == ""
    assert result.stderr.strip() != ""


def test_cli_rejects_malformed_json():
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input="not json",
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode != 0
    assert result.stdout == ""
