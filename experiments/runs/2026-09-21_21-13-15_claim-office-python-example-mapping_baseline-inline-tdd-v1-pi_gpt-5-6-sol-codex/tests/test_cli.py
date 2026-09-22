import json
import subprocess
import sys
from pathlib import Path


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def run_cli(document):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(document),
        text=True,
        capture_output=True,
        check=False,
    )


def test_cli_reads_scenario_and_prints_only_json_result():
    completed = run_cli(
        {
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
            ],
        }
    )
    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100},
        ]
    }
    assert completed.stderr == ""


def test_cli_reports_domain_errors_on_stderr_without_output():
    completed = run_cli(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
        }
    )
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert "unknown item type" in completed.stderr


def test_cli_reports_invalid_json_without_traceback():
    completed = subprocess.run(
        [sys.executable, str(CLI)],
        input="not json",
        text=True,
        capture_output=True,
        check=False,
    )
    assert completed.returncode != 0
    assert completed.stdout == ""
    assert completed.stderr.startswith("error:")
    assert "Traceback" not in completed.stderr
