"""Running a whole scenario: quote steps issue policies, claim steps use them."""
import pytest

from errors import ClaimOfficeError
from scenario import run_scenario


def test_quote_then_claim_against_that_policy():
    results = run_scenario(
        {
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
    )
    assert results == [
        {"premium": 60 - 12 + 6 + 5},
        {"payout": 100, "remainingCap": 1100},
    ]


def test_each_quote_after_the_first_is_a_follow_up_contract():
    scenario = {
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
                ],
            },
        ],
    }
    assert run_scenario(scenario)[1] == {"premium": 160}


def test_a_claim_against_an_unknown_policy_step_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "claim",
                "policy": 3,
                "incident": {"cause": "fire", "damages": []},
            }
        ],
    }
    with pytest.raises(ClaimOfficeError):
        run_scenario(scenario)


def test_an_unknown_operation_is_rejected():
    scenario = {"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "renew"}]}
    with pytest.raises(ClaimOfficeError):
        run_scenario(scenario)
