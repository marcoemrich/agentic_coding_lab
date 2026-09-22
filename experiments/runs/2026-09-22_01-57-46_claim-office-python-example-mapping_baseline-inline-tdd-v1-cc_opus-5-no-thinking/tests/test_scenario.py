import pytest
from policy import ClaimError
from scenario import run_scenario


def test_a_quote_step_yields_a_premium():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "sword", "cursed": True}]}],
    }
    assert run_scenario(scenario) == [{"premium": 165}]


def test_a_claim_step_refers_to_an_earlier_quote_by_index():
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
        ],
    }
    results = run_scenario(scenario)
    assert results[1] == {"payout": 100, "remainingCap": 1100}


def test_the_second_quote_of_a_scenario_is_a_follow_up_contract():
    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    scenario = {
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [{"type": "potion"}]},
            {"op": "quote", "items": [sword]},
        ],
    }
    assert run_scenario(scenario)[1] == {"premium": 160}


def test_a_claim_against_a_missing_policy_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "claim", "policy": 3, "incident": {"cause": "x", "damages": []}}],
    }
    with pytest.raises(ClaimError):
        run_scenario(scenario)
