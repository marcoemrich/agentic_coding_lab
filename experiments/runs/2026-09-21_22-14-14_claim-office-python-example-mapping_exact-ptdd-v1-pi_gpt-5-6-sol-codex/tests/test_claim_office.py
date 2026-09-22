import json
import subprocess
import sys
from pathlib import Path

import pytest


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def run_scenario(customer, steps):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps({"customer": customer, "steps": steps}),
        text=True,
        capture_output=True,
        check=False,
    )


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages):
    return {
        "op": "claim",
        "policy": policy,
        "incident": {"cause": "reported incident", "damages": damages},
    }


def assert_results(customer, steps, expected):
    completed = run_scenario(customer, steps)
    assert completed.returncode == 0, completed.stderr
    assert json.loads(completed.stdout) == {"results": expected}
    assert completed.stderr == ""


def assert_rejected(customer, steps):
    completed = run_scenario(customer, steps)
    assert completed.returncode != 0
    assert completed.stderr.strip()
    assert completed.stdout == ""


def test_empty_item_list_costs_only_processing_fee():
    assert_results({"yearsWithMHPCO": 0}, [quote([])], [{"premium": 5}])


def test_sword_base_premium():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "sword"}])], [{"premium": 115}])


def test_amulet_base_premium():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "amulet"}])], [{"premium": 71}])


def test_staff_base_premium():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "staff"}])], [{"premium": 93}])


def test_potion_base_premium():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "potion"}])], [{"premium": 49}])


def test_single_component_premium_rounds_up():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}])], [{"premium": 33}])


def test_two_runes_do_not_form_a_block():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 2)], [{"premium": 60}])


def test_three_runes_form_a_block():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 3)], [{"premium": 71}])


def test_four_runes_do_not_form_a_block():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 4)], [{"premium": 115}])


def test_seven_runes_do_not_partially_form_blocks():
    assert_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 7)], [{"premium": 198}])


def test_two_runes_and_one_moonstone_do_not_form_a_block():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert_results({"yearsWithMHPCO": 0}, [quote(items)], [{"premium": 88}])


def test_rune_and_moonstone_triples_form_two_blocks():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert_results({"yearsWithMHPCO": 0}, [quote(items)], [{"premium": 137}])


def test_newcomer_cursed_sword_costs_165():
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert_results({"yearsWithMHPCO": 0}, [quote([item])], [{"premium": 165}])


def test_enchantment_five_threshold_applies():
    item = {"type": "sword", "enchantment": 5}
    assert_results({"yearsWithMHPCO": 0}, [quote([item])], [{"premium": 145}])


def test_enchantment_four_does_not_apply_high_surcharge():
    item = {"type": "sword", "enchantment": 4}
    assert_results({"yearsWithMHPCO": 0}, [quote([item])], [{"premium": 115}])


def test_curse_and_high_enchantment_surcharges_stack():
    item = {"type": "sword", "enchantment": 5, "cursed": True}
    assert_results({"yearsWithMHPCO": 0}, [quote([item])], [{"premium": 195}])


def test_cursed_surcharge_has_item_scope():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    assert_results({"yearsWithMHPCO": 0}, [quote(items)], [{"premium": 231}])


def test_high_enchantment_surcharge_has_item_scope():
    items = [{"type": "sword", "enchantment": 5}, {"type": "amulet"}]
    assert_results({"yearsWithMHPCO": 0}, [quote(items)], [{"premium": 211}])


def test_two_year_loyalty_threshold_applies():
    assert_results({"yearsWithMHPCO": 2}, [quote([{"type": "sword"}])], [{"premium": 95}])


def test_follow_up_contract_discount_applies_to_second_quote():
    steps = [quote([]), quote([{"type": "sword"}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 5}, {"premium": 100}])


def test_long_standing_customers_second_contract_costs_160():
    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    steps = [quote([]), quote([sword])]
    assert_results({"yearsWithMHPCO": 3}, steps, [{"premium": 5}, {"premium": 160}])


def test_standard_sword_reimbursement():
    steps = [quote([{"type": "sword", "material": "steel", "enchantment": 3}]), claim(0, [{"itemType": "sword", "amount": 500}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 115}, {"payout": 400, "remainingCap": 1600}])


def test_component_standard_reimbursement():
    steps = [quote([{"type": "rune"}]), claim(0, [{"itemType": "rune", "amount": 200}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 33}, {"payout": 100, "remainingCap": 400}])


def test_enchantment_eight_clause_wins_over_dragon_material():
    sword = {"type": "sword", "material": "dragon", "enchantment": 8}
    steps = [quote([sword]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 145}, {"payout": 400, "remainingCap": 1600}])


def test_high_enchantment_rule_wins_when_both_claim_clauses_apply():
    sword = {"type": "sword", "material": "dragon", "enchantment": 9}
    steps = [quote([sword]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 145}, {"payout": 400, "remainingCap": 1600}])


def test_dragon_material_is_fully_reimbursed_below_claim_enchantment_threshold():
    sword = {"type": "sword", "material": "dragon", "enchantment": 5}
    steps = [quote([sword]), claim(0, [{"itemType": "sword", "amount": 800}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 145}, {"payout": 700, "remainingCap": 1300}])


def test_high_enchantment_claim_clause_applies_without_dragon_material():
    sword = {"type": "sword", "material": "steel", "enchantment": 9}
    steps = [quote([sword]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 145}, {"payout": 400, "remainingCap": 1600}])


def test_deductible_applies_per_damage_entry():
    items = [{"type": "sword", "material": "dragon"}, {"type": "amulet", "material": "dragon"}]
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    steps = [quote(items), claim(0, damages)]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 181}, {"payout": 600, "remainingCap": 2600}])


def test_duplicate_items_each_add_to_insurance_sum():
    steps = [quote([{"type": "sword"}] * 2), claim(0, [])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 225}, {"payout": 0, "remainingCap": 4000}])


def test_duplicate_items_support_separate_damage_entries():
    steps = [quote([{"type": "sword"}] * 2), claim(0, [{"itemType": "sword", "amount": 500}] * 2)]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 225}, {"payout": 800, "remainingCap": 3200}])


def test_more_damages_than_insured_items_is_rejected():
    steps = [quote([{"type": "sword"}]), claim(0, [{"itemType": "sword", "amount": 500}] * 2)]
    assert_rejected({"yearsWithMHPCO": 0}, steps)


def test_mixed_item_insurance_values_set_cap():
    steps = [quote([{"type": "sword"}, {"type": "amulet"}]), claim(0, [])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 181}, {"payout": 0, "remainingCap": 3200}])


def test_premium_modifiers_do_not_affect_cap():
    steps = [quote([{"type": "sword", "cursed": True}]), claim(0, [])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 165}, {"payout": 0, "remainingCap": 2000}])


def test_component_block_does_not_reduce_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    steps = [quote(items), claim(0, [])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 181}, {"payout": 0, "remainingCap": 3500}])


def test_staff_insurance_value_sets_cap():
    steps = [quote([{"type": "staff"}]), claim(0, [])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 93}, {"payout": 0, "remainingCap": 1600}])


def test_potion_insurance_value_sets_cap():
    steps = [quote([{"type": "potion"}]), claim(0, [])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 49}, {"payout": 0, "remainingCap": 800}])


def test_moonstone_insurance_value_sets_cap():
    steps = [quote([{"type": "moonstone"}]), claim(0, [])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 33}, {"payout": 0, "remainingCap": 500}])


def test_successive_claims_share_and_exhaust_policy_cap():
    damage = [{"itemType": "sword", "amount": 1500}]
    steps = [quote([{"type": "sword"}]), claim(0, damage), claim(0, damage)]
    expected = [{"premium": 115}, {"payout": 1400, "remainingCap": 600}, {"payout": 600, "remainingCap": 0}]
    assert_results({"yearsWithMHPCO": 0}, steps, expected)


def test_fractional_payout_rounds_down_in_offices_favor():
    sword = {"type": "sword", "material": "steel", "enchantment": 8}
    steps = [quote([sword]), claim(0, [{"itemType": "sword", "amount": 901}])]
    assert_results({"yearsWithMHPCO": 0}, steps, [{"premium": 145}, {"payout": 350, "remainingCap": 1650}])


def test_unknown_quote_item_is_rejected():
    assert_rejected({"yearsWithMHPCO": 0}, [quote([{"type": "broomstick"}])])


def test_uninsured_item_damage_is_rejected():
    steps = [quote([{"type": "sword"}]), claim(0, [{"itemType": "amulet", "amount": 200}])]
    assert_rejected({"yearsWithMHPCO": 0}, steps)


def test_unknown_damage_item_is_rejected():
    steps = [quote([{"type": "sword"}]), claim(0, [{"itemType": "broomstick", "amount": 200}])]
    assert_rejected({"yearsWithMHPCO": 0}, steps)


def test_negative_damage_amount_is_rejected():
    steps = [quote([{"type": "sword"}]), claim(0, [{"itemType": "sword", "amount": -200}])]
    assert_rejected({"yearsWithMHPCO": 0}, steps)
