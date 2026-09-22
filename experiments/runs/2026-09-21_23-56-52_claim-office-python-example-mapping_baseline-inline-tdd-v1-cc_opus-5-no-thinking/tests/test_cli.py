"""The claim-office CLI: JSON on stdin, JSON on stdout, errors on stderr."""
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


def test_a_valid_scenario_is_answered_on_stdout():
    result = run_cli(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 3,
                            "cursed": True,
                        }
                    ],
                }
            ],
        }
    )
    assert result.returncode == 0
    assert json.loads(result.stdout) == {"results": [{"premium": 165}]}


def test_an_unknown_item_type_fails_without_writing_results():
    result = run_cli(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
        }
    )
    assert result.returncode != 0
    assert result.stdout == ""
    assert result.stderr.strip() != ""


def test_malformed_json_fails():
    result = subprocess.run(
        [sys.executable, str(CLI)],
        input="not json",
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode != 0
    assert result.stderr.strip() != ""
