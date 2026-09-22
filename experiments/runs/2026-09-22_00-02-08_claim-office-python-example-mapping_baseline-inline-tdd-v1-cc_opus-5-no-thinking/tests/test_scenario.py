import pytest

from errors import ScenarioError
from scenario import run_scenario


def test_schema_example_scenario():
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
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}],
                },
            },
        ],
    }
    # premium: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    # payout: 200 - 100 deductible = 100; cap 1200 -> 1100 left
    assert run_scenario(scenario) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_each_quote_after_the_first_is_a_follow_up_contract():
    scenario = {
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "enchantment": 3, "cursed": True}]},
            {"op": "quote", "items": [{"type": "sword", "enchantment": 7, "cursed": True}]},
        ],
    }
    results = run_scenario(scenario)["results"]
    assert results[1] == {"premium": 160}


def test_successive_claims_share_one_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "enchantment": 3}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "dragon", "damages": [{"itemType": "sword", "amount": 1500}]},
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "dragon", "damages": [{"itemType": "sword", "amount": 1500}]},
            },
        ],
    }
    results = run_scenario(scenario)["results"]
    assert results[1] == {"payout": 1400, "remainingCap": 600}
    assert results[2] == {"payout": 600, "remainingCap": 0}


def test_claim_referring_to_a_step_that_is_not_a_quote_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": 200}]},
            }
        ],
    }
    with pytest.raises(ScenarioError):
        run_scenario(scenario)


def test_unknown_operation_is_rejected():
    scenario = {"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "renew"}]}
    with pytest.raises(ScenarioError):
        run_scenario(scenario)
