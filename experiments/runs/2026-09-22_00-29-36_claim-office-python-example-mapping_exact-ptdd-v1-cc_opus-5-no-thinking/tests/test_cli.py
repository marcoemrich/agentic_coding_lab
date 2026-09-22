"""Test list for the `claim-office` CLI adapter (src/cli.py).

The CLI reads a JSON scenario from stdin and writes a JSON results document to
stdout. Rejections exit with a non-zero status and describe the error on
stderr, writing no results to stdout.
"""

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


def test_cli_writes_a_result_document_for_the_schema_example():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {
                        "type": "amulet",
                        "material": "silver",
                        "enchantment": 2,
                        "cursed": False,
                    }
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}],
                },
            },
        ],
    }
    completed = run_cli(scenario)
    assert completed.returncode == 0
    # amulet: 60 base - 12 loyalty + 6 first + 5 fee = 59
    assert json.loads(completed.stdout) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_cli_quote_result_reports_the_premium():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "sword"}]}],
    }
    completed = run_cli(scenario)
    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {"results": [{"premium": 115}]}


def test_cli_claim_result_reports_payout_and_remaining_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
        ],
    }
    completed = run_cli(scenario)
    assert completed.returncode == 0
    assert json.loads(completed.stdout)["results"][1] == {
        "payout": 400,
        "remainingCap": 1600,
    }


def test_cli_exits_non_zero_for_an_unknown_item_type():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    completed = run_cli(scenario)
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert "broomstick" in completed.stderr
    assert "Traceback" not in completed.stderr


def test_cli_exits_non_zero_for_a_damage_outside_the_policy():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 300}],
                },
            },
        ],
    }
    completed = run_cli(scenario)
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert "amulet" in completed.stderr


def test_cli_exits_non_zero_when_more_damages_than_insured_items():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [
                        {"itemType": "sword", "amount": 500},
                        {"itemType": "sword", "amount": 500},
                    ],
                },
            },
        ],
    }
    completed = run_cli(scenario)
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert "sword" in completed.stderr


def test_cli_exits_non_zero_for_a_negative_damage_amount():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": -200}],
                },
            },
        ],
    }
    completed = run_cli(scenario)
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert "-200" in completed.stderr
