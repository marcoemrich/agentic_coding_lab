import json
import subprocess
import sys
from pathlib import Path

CLI = Path(__file__).resolve().parents[1] / "src" / "cli.py"


def run_cli(scenario):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


def test_cli_writes_results_to_stdout():
    result = run_cli({
        "customer": {"yearsWithMHPCO": 5},
        "steps": [{"op": "quote", "items": [{"type": "amulet"}]}],
    })
    assert result.returncode == 0
    assert json.loads(result.stdout) == {"results": [{"premium": 59}]}


def test_cli_rejects_an_unknown_item_type():
    result = run_cli({
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    })
    assert result.returncode != 0
    assert result.stdout == ""
    assert result.stderr.strip() != ""


def test_cli_rejects_a_negative_damage_amount():
    result = run_cli({
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "x", "damages": [
                    {"itemType": "sword", "amount": -200},
                ]},
            },
        ],
    })
    assert result.returncode != 0
    assert result.stdout == ""
