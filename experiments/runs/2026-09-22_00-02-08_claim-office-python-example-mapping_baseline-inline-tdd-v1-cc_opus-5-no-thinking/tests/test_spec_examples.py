"""End-to-end checks of the worked examples from the specification."""

from claim import process_claim
from policy import payout_cap
from premium import quote_premium
from scenario import run_scenario

NEW_CUSTOMER = {"yearsWithMHPCO": 0}


def test_cursed_sword_cap_is_based_on_the_unmodified_insurance_value():
    items = [{"type": "sword", "cursed": True, "enchantment": 3}]
    assert quote_premium(NEW_CUSTOMER, items, contract_index=0) == 165
    assert payout_cap(items) == 2000


def test_two_swords_have_a_cap_of_four_thousand():
    items = [{"type": "sword"}, {"type": "sword"}]
    assert payout_cap(items) == 4000


def test_dragon_attack_damages_both_insured_swords_each_with_its_own_deductible():
    items = [{"type": "sword"}, {"type": "sword"}]
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 300},
    ]
    payout, _ = process_claim(items, damages, payout_cap(items))
    assert payout == 600


def test_dragon_material_sword_with_enchantment_eight():
    item = {"type": "sword", "material": "dragon", "enchantment": 8}
    payout, _ = process_claim([item], [{"itemType": "sword", "amount": 1000}], 2000)
    assert payout == 400


def test_premium_rounds_up_and_payout_rounds_down_on_a_half():
    scenario = {
        "customer": NEW_CUSTOMER,
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 9}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "dragon", "damages": [{"itemType": "sword", "amount": 901}]},
            },
        ],
    }
    results = run_scenario(scenario)["results"]
    # 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145
    assert results[0] == {"premium": 145}
    assert results[1] == {"payout": 350, "remainingCap": 1650}
