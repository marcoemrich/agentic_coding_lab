import json
import subprocess
import sys


def run_cli(document):
    return subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(document),
        text=True,
        capture_output=True,
        check=False,
    )


def test_cli_processes_steps_and_policy_uses_step_index():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [{"type": "amulet"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}],
                },
            },
            {"op": "quote", "items": [{"type": "potion"}]},
            {
                "op": "claim",
                "policy": 2,
                "incident": {
                    "cause": "spill",
                    "damages": [{"itemType": "potion", "amount": 300}],
                },
            },
        ],
    }
    completed = run_cli(scenario)
    assert completed.returncode == 0
    assert completed.stderr == ""
    assert json.loads(completed.stdout) == {
        "results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100},
            {"premium": 35},
            {"payout": 200, "remainingCap": 600},
        ]
    }


def test_cli_errors_go_only_to_stderr():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    completed = run_cli(scenario)
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert completed.stderr


def test_cli_rejects_policy_that_is_not_an_earlier_quote():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{
            "op": "claim",
            "policy": 0,
            "incident": {"cause": "fire", "damages": []},
        }],
    }
    completed = run_cli(scenario)
    assert completed.returncode != 0
    assert completed.stdout == ""
