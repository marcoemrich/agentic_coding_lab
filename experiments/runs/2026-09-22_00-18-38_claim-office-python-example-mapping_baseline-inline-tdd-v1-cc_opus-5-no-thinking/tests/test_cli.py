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


def quote(items):
    return {"op": "quote", "items": items}


def scenario_with(steps, years=0):
    return {"customer": {"yearsWithMHPCO": years}, "steps": steps}


def test_the_cli_writes_the_results_of_every_step():
    claim = {"op": "claim", "policy": 0,
             "incident": {"cause": "fire",
                          "damages": [{"itemType": "amulet", "amount": 200}]}}
    amulet = {"type": "amulet", "material": "silver",
              "enchantment": 2, "cursed": False}
    result = run_cli(scenario_with([quote([amulet]), claim], years=5))
    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_an_unknown_item_type_is_rejected():
    result = run_cli(scenario_with([quote([{"type": "broomstick"}])]))
    assert result.returncode != 0
    assert result.stdout == ""
    assert result.stderr.strip()


def test_damage_to_an_uninsured_item_is_rejected():
    claim = {"op": "claim", "policy": 0,
             "incident": {"cause": "fire",
                          "damages": [{"itemType": "amulet", "amount": 200}]}}
    result = run_cli(scenario_with([quote([{"type": "sword"}]), claim]))
    assert result.returncode != 0
    assert result.stderr.strip()


def test_more_damages_than_insured_items_are_rejected():
    damages = [{"itemType": "sword", "amount": 200}] * 2
    claim = {"op": "claim", "policy": 0,
             "incident": {"cause": "fire", "damages": damages}}
    result = run_cli(scenario_with([quote([{"type": "sword"}]), claim]))
    assert result.returncode != 0
    assert result.stderr.strip()


def test_a_negative_damage_amount_is_rejected():
    claim = {"op": "claim", "policy": 0,
             "incident": {"cause": "fire",
                          "damages": [{"itemType": "sword", "amount": -200}]}}
    result = run_cli(scenario_with([quote([{"type": "sword"}]), claim]))
    assert result.returncode != 0
    assert result.stderr.strip()
