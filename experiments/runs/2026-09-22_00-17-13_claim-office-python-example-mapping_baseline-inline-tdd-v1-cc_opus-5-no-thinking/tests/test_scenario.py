import pytest

from policy import ClaimError
from scenario import run_scenario


def sword(**kwargs):
    return {"type": "sword", "material": "steel", "enchantment": 3, **kwargs}


def test_quote_then_claim():
    results = run_scenario({
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
    })
    # 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    assert results == [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]


def test_each_quote_after_the_first_is_a_follow_up_contract():
    results = run_scenario({
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [sword()]},
            {"op": "quote", "items": [sword(enchantment=7, cursed=True)]},
        ],
    })
    assert results[1] == {"premium": 160}


def test_unknown_item_type_in_a_quote_is_rejected():
    with pytest.raises(ClaimError):
        run_scenario({
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
        })


def test_claim_refers_to_its_policy_by_step_index():
    results = run_scenario({
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "amulet"}]},
            {"op": "quote", "items": [sword()]},
            {
                "op": "claim",
                "policy": 1,
                "incident": {
                    "cause": "dragon",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
        ],
    })
    assert results[2] == {"payout": 400, "remainingCap": 1600}


def test_dragon_attack_damaging_two_insured_items():
    results = run_scenario({
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [sword(), {"type": "amulet"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "dragon", "damages": [
                    {"itemType": "sword", "amount": 500},
                    {"itemType": "amulet", "amount": 300},
                ]},
            },
        ],
    })
    assert results[1] == {"payout": 600, "remainingCap": 2600}


def test_two_successive_claims_exhaust_the_cap():
    claim_step = {
        "op": "claim",
        "policy": 0,
        "incident": {"cause": "dragon", "damages": [
            {"itemType": "sword", "amount": 1500},
        ]},
    }
    results = run_scenario({
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [sword()]}, claim_step, claim_step],
    })
    assert results[1] == {"payout": 1400, "remainingCap": 600}
    assert results[2] == {"payout": 600, "remainingCap": 0}


def test_empty_item_list_is_only_the_processing_fee():
    results = run_scenario({
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": []}],
    })
    assert results[0] == {"premium": 5}
