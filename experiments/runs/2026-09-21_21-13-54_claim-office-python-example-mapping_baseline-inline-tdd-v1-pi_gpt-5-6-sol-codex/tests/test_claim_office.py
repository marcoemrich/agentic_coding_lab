import json
from pathlib import Path
import subprocess
import sys

import pytest

from claim_office import ClaimOffice, ScenarioError, process_scenario


def quote(items, years=0, previous_quotes=0):
    office = ClaimOffice(years)
    for _ in range(previous_quotes):
        office.quote([])
    return office.quote(items)["premium"]


def test_item_price_list_and_empty_policy():
    assert quote([]) == 5
    assert quote([{"type": "sword"}]) == 115
    assert quote([{"type": "amulet"}]) == 71
    assert quote([{"type": "staff"}]) == 93
    assert quote([{"type": "potion"}]) == 49
    assert quote([{"type": "rune"}]) == 33


def test_modifiers_are_additive_and_have_correct_scope_and_thresholds():
    assert quote([{"type": "sword", "cursed": True}]) == 165
    assert quote([{"type": "sword", "enchantment": 5}]) == 145
    assert quote([{"type": "sword", "enchantment": 4, "cursed": True}]) == 165
    assert quote([{"type": "sword", "cursed": True}, {"type": "amulet"}]) == 231
    assert quote([{"type": "sword"}], years=2) == 95
    assert quote([{"type": "sword"}], years=3, previous_quotes=1) == 80
    assert quote(
        [{"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}],
        years=3,
        previous_quotes=1,
    ) == 160


def test_component_blocks_are_only_three_components_of_same_type():
    assert quote([{"type": "rune"}] * 2) == 60
    assert quote([{"type": "rune"}] * 3) == 71
    assert quote([{"type": "rune"}] * 4) == 115
    assert quote([{"type": "rune"}] * 7) == 198
    assert quote([{"type": "rune"}] * 2 + [{"type": "moonstone"}]) == 88
    assert quote([{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3) == 137


def test_claim_standard_high_enchantment_and_dragon_rules():
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "material": "steel", "enchantment": 3}], 0)
    assert office.claim(0, [{"itemType": "sword", "amount": 500}]) == {
        "payout": 400,
        "remainingCap": 1600,
    }

    enchanted = ClaimOffice(0)
    enchanted.quote([{"type": "sword", "material": "dragon", "enchantment": 8}], 0)
    assert enchanted.claim(0, [{"itemType": "sword", "amount": 1000}])["payout"] == 400

    dragon = ClaimOffice(0)
    dragon.quote([{"type": "sword", "material": "dragon", "enchantment": 5}], 0)
    assert dragon.claim(0, [{"itemType": "sword", "amount": 800}])["payout"] == 700


def test_claim_deductible_is_per_damage_and_components_are_standard():
    office = ClaimOffice(0)
    office.quote([{"type": "sword"}, {"type": "amulet"}, {"type": "rune"}], 0)
    result = office.claim(
        0,
        [
            {"itemType": "sword", "amount": 500},
            {"itemType": "amulet", "amount": 300},
            {"itemType": "rune", "amount": 200},
        ],
    )
    assert result["payout"] == 700


def test_claim_cap_is_shared_by_successive_claims_and_uses_insurance_value():
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "cursed": True}], 0)
    first = office.claim(0, [{"itemType": "sword", "amount": 1500}])
    second = office.claim(0, [{"itemType": "sword", "amount": 1500}])
    assert first == {"payout": 1400, "remainingCap": 600}
    assert second == {"payout": 600, "remainingCap": 0}

    block = ClaimOffice(0)
    block.quote([{"type": "sword"}] + [{"type": "rune"}] * 3, 0)
    assert block.policies[0].remaining_cap == 3500


def test_claim_rounds_only_the_final_payout_down():
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "enchantment": 8}], 0)
    assert office.claim(0, [{"itemType": "sword", "amount": 901}])["payout"] == 350

    two = ClaimOffice(0)
    two.quote([{"type": "sword", "enchantment": 8}] * 2, 0)
    assert two.claim(
        0,
        [{"itemType": "sword", "amount": 201}, {"itemType": "sword", "amount": 201}],
    )["payout"] == 1


def test_claim_rejects_uncovered_excess_and_negative_damages():
    office = ClaimOffice(0)
    office.quote([{"type": "sword"}], 0)
    with pytest.raises(ScenarioError):
        office.claim(0, [{"itemType": "amulet", "amount": 100}])
    with pytest.raises(ScenarioError):
        office.claim(0, [{"itemType": "sword", "amount": -1}])
    with pytest.raises(ScenarioError):
        office.claim(
            0,
            [{"itemType": "sword", "amount": 100}, {"itemType": "sword", "amount": 100}],
        )
    with pytest.raises(ScenarioError):
        office.claim(99, [])


def test_scenario_processes_steps_and_references_quote_step_indices():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [{"type": "amulet", "enchantment": 2}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}],
                },
            },
            {"op": "quote", "items": []},
        ],
    }
    assert process_scenario(scenario) == {
        "results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100},
            {"premium": 5},
        ]
    }


def run_cli(payload):
    return subprocess.run(
        [sys.executable, str(Path("src/cli.py"))],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=False,
    )


def test_cli_emits_json_only_and_reports_domain_errors_on_stderr():
    valid = run_cli({"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": []}]})
    assert valid.returncode == 0
    assert json.loads(valid.stdout) == {"results": [{"premium": 5}]}
    assert valid.stderr == ""

    invalid = run_cli(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
        }
    )
    assert invalid.returncode != 0
    assert invalid.stdout == ""
    assert "unknown item type" in invalid.stderr
