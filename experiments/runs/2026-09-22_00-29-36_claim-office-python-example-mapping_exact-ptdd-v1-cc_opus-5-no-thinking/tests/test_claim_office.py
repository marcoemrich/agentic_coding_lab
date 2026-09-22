"""Test list for the MHPCO Claim Office kata.

Every behavior from prompt.md, ordered simple -> complex. Each test is
inactive until its predictive TDD cycle activates it.

Adopted readings where the specification leaves a contract open:
- "alike" components means the same item type; a block requires exactly 3 of
  that type (4 runes -> no block, 7 runes -> no block).
- Rejections are observable at the CLI as a non-zero exit status plus a stderr
  description. In the domain the same rejections are raised as ValueError.
"""

import pytest

from claim_office import claim, insure, quote, run_scenario


# --- Quote: base premiums per item type -------------------------------------


def test_empty_item_list_costs_only_the_processing_fee():
    assert quote(items=[]) == 5


def test_sword_has_base_premium_of_100_g():
    assert quote(items=[{"type": "sword"}]) == 115


def test_amulet_has_base_premium_of_60_g():
    assert quote(items=[{"type": "amulet"}]) == 71


def test_staff_has_base_premium_of_80_g():
    assert quote(items=[{"type": "staff"}]) == 93


def test_potion_has_base_premium_of_40_g():
    assert quote(items=[{"type": "potion"}]) == 49


def test_rune_has_base_premium_of_25_g():
    assert quote(items=[{"type": "rune"}]) == 33


def test_moonstone_has_base_premium_of_25_g():
    assert quote(items=[{"type": "moonstone"}]) == 33


def test_quote_rejects_an_unknown_item_type():
    with pytest.raises(ValueError, match="broomstick"):
        quote(items=[{"type": "broomstick"}])


# --- Quote: component blocks ------------------------------------------------


def test_two_runes_cost_50_g_base_premium():
    assert quote(items=[{"type": "rune"}, {"type": "rune"}]) == 60


def test_three_runes_form_a_block_costing_60_g_base_premium():
    assert quote(items=[{"type": "rune"}] * 3) == 71


def test_four_runes_cost_100_g_base_premium_because_a_block_needs_exactly_three():
    assert quote(items=[{"type": "rune"}] * 4) == 115


def test_seven_runes_cost_175_g_base_premium():
    assert quote(items=[{"type": "rune"}] * 7) == 198


def test_two_runes_and_one_moonstone_form_no_block():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert quote(items=items) == 88


def test_three_runes_and_three_moonstones_form_two_separate_blocks():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert quote(items=items) == 137


def test_three_swords_form_no_block_because_the_offer_covers_components_only():
    """The block offer is stated for components, not for main items."""
    assert quote(items=[{"type": "sword"}] * 3) == 335


# --- Quote: item-specific modifiers -----------------------------------------


def test_cursed_item_adds_a_50_percent_risk_surcharge():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert quote(items=[cursed_sword]) == 165


def test_enchantment_of_exactly_5_adds_a_30_percent_risk_surcharge():
    sword = {"type": "sword", "material": "steel", "enchantment": 5, "cursed": False}
    assert quote(items=[sword]) == 145


def test_enchantment_of_4_adds_no_high_enchantment_surcharge():
    sword = {"type": "sword", "material": "steel", "enchantment": 4, "cursed": False}
    assert quote(items=[sword]) == 115


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    sword = {"type": "sword", "material": "steel", "enchantment": 5, "cursed": True}
    assert quote(items=[sword]) == 195


def test_item_specific_surcharge_applies_only_to_the_affected_items_base_premium():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    plain_amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    assert quote(items=[cursed_sword, plain_amulet]) == 231


# --- Quote: policy-wide modifiers -------------------------------------------


def test_exactly_two_years_with_mhpco_grants_the_loyalty_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote(items=[sword], customer={"yearsWithMHPCO": 2}) == 95


def test_one_year_with_mhpco_grants_no_loyalty_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote(items=[sword], customer={"yearsWithMHPCO": 1}) == 115


def test_first_insurance_surcharge_applies_to_every_quote():
    """Each item in a quote is a first insurance, whatever the customer history."""
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote(items=[sword], customer={"yearsWithMHPCO": 3}) == 95


def test_second_contract_gets_a_15_percent_follow_up_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote(items=[sword], previous_contracts=1) == 100


def test_first_contract_gets_no_follow_up_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote(items=[sword], previous_contracts=0) == 115


def test_processing_fee_is_added_to_every_premium():
    """The fee is added at the very end, so no modifier discounts it."""
    assert quote(items=[], customer={"yearsWithMHPCO": 5}, previous_contracts=1) == 5


def test_premium_is_rounded_up_to_whole_g():
    """Intermediate amounts stay fractional; only the final premium rounds, upward."""
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}]
    assert quote(items=items) == 99


# --- Quote: integration examples --------------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165_g():
    """100 G base + 50 G curse + 10 G first insurance + 5 G fee."""
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    premium = quote(items=[cursed_sword], customer={"yearsWithMHPCO": 0}, previous_contracts=0)
    assert premium == 165


def test_long_standing_customers_second_contract_pays_160_g():
    """100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first - 15 follow-up + 5 fee."""
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    premium = quote(items=[cursed_sword], customer={"yearsWithMHPCO": 3}, previous_contracts=1)
    assert premium == 160


# --- Policy: insurance sum and cap ------------------------------------------


def test_insurance_sum_is_the_sum_of_the_items_insurance_values():
    policy = insure(items=[{"type": "sword"}, {"type": "amulet"}])
    assert policy.insurance_sum == 1600
    assert policy.remaining_cap == 3200


def test_two_swords_give_an_insurance_sum_of_2000_g():
    policy = insure(items=[{"type": "sword"}, {"type": "sword"}])
    assert policy.insurance_sum == 2000
    assert policy.remaining_cap == 4000


def test_premium_modifiers_do_not_raise_the_cap():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert quote(items=[cursed_sword]) == 165
    assert insure(items=[cursed_sword]).remaining_cap == 2000


def test_block_discount_does_not_lower_the_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    assert insure(items=items).insurance_sum == 1750


# --- Claim: reimbursement clauses -------------------------------------------


def test_standard_damage_is_fully_reimbursed_minus_the_deductible():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[sword])
    damages = [{"itemType": "sword", "amount": 500}]
    assert claim(policy, damages).payout == 400


def test_component_damage_has_no_special_clause():
    policy = insure(items=[{"type": "rune"}])
    assert claim(policy, [{"itemType": "rune", "amount": 200}]).payout == 100


def test_high_enchantment_damage_is_reimbursed_at_50_percent():
    sword = {"type": "sword", "material": "steel", "enchantment": 9, "cursed": False}
    policy = insure(items=[sword])
    assert claim(policy, [{"itemType": "sword", "amount": 1000}]).payout == 400


def test_dragon_material_damage_is_fully_reimbursed():
    sword = {"type": "sword", "material": "dragon", "enchantment": 5, "cursed": False}
    policy = insure(items=[sword])
    assert claim(policy, [{"itemType": "sword", "amount": 800}]).payout == 700


def test_enchantment_of_exactly_8_triggers_the_50_percent_clause_over_dragon_material():
    sword = {"type": "sword", "material": "dragon", "enchantment": 8, "cursed": False}
    policy = insure(items=[sword])
    assert claim(policy, [{"itemType": "sword", "amount": 1000}]).payout == 400


def test_high_enchantment_beats_dragon_material_when_both_clauses_apply():
    sword = {"type": "sword", "material": "dragon", "enchantment": 9, "cursed": False}
    policy = insure(items=[sword])
    assert claim(policy, [{"itemType": "sword", "amount": 1000}]).payout == 400


def test_payout_is_rounded_down_to_whole_g():
    """901 G halved is 450.5 G; less the deductible, 350.5 G rounds down to 350 G."""
    sword = {"type": "sword", "material": "steel", "enchantment": 9, "cursed": False}
    policy = insure(items=[sword])
    assert claim(policy, [{"itemType": "sword", "amount": 901}]).payout == 350


def test_damage_below_the_deductible_pays_out_nothing():
    """Adopted reading: the deductible cannot turn a payout negative."""
    policy = insure(items=[{"type": "rune"}])
    assert claim(policy, [{"itemType": "rune", "amount": 50}]).payout == 0


# --- Claim: multiple damages and the cap ------------------------------------


def test_deductible_applies_once_per_damaged_item():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    policy = insure(items=[sword, amulet])
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "amulet", "amount": 300},
    ]
    assert claim(policy, damages).payout == 600


def test_two_damages_of_the_same_type_are_separate_damage_events():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[dict(sword), dict(sword)])
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 500},
    ]
    assert claim(policy, damages).payout == 800


def test_first_claim_reduces_the_remaining_cap():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[sword])
    settlement = claim(policy, [{"itemType": "sword", "amount": 1500}])
    assert settlement.payout == 1400
    assert settlement.remaining_cap == 600


def test_payout_is_limited_to_the_remaining_cap():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[sword])
    claim(policy, [{"itemType": "sword", "amount": 1500}])
    settlement = claim(policy, [{"itemType": "sword", "amount": 1500}])
    assert settlement.payout == 600
    assert settlement.remaining_cap == 0


# --- Claim: rejections ------------------------------------------------------


def test_claim_rejects_a_damage_to_an_item_outside_the_policy():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[sword])
    with pytest.raises(ValueError, match="amulet"):
        claim(policy, [{"itemType": "amulet", "amount": 300}])


def test_claim_rejects_a_damage_to_an_unknown_item_type():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[sword])
    with pytest.raises(ValueError, match="broomstick"):
        claim(policy, [{"itemType": "broomstick", "amount": 300}])


def test_claim_rejects_more_damages_of_a_type_than_the_policy_covers():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[sword])
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 500},
    ]
    with pytest.raises(ValueError, match="sword"):
        claim(policy, damages)


def test_claim_rejects_a_negative_damage_amount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = insure(items=[sword])
    with pytest.raises(ValueError, match="-200"):
        claim(policy, [{"itemType": "sword", "amount": -200}])


# --- Scenario: sequential steps ---------------------------------------------


def test_scenario_returns_one_result_per_step_in_order():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "quote", "items": [{"type": "amulet"}]},
        ],
    }
    # the second quote is a follow-up contract: 60 + 6 first - 9 follow-up + 5
    assert run_scenario(scenario) == {"results": [{"premium": 115}, {"premium": 62}]}


def test_claim_step_refers_to_its_policy_by_step_index():
    """The claim settles against step 0's sword policy, not step 1's amulet."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "quote", "items": [{"type": "amulet"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
        ],
    }
    results = run_scenario(scenario)["results"]
    assert results[2] == {"payout": 400, "remainingCap": 1600}
