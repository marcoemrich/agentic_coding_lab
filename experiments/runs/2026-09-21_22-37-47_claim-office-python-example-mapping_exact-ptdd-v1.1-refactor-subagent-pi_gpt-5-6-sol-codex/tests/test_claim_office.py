import json
import subprocess
import sys

import pytest


CLI = [sys.executable, "src/cli.py"]


def run_scenario(customer, steps):
    return subprocess.run(
        CLI,
        input=json.dumps({"customer": customer, "steps": steps}),
        text=True,
        capture_output=True,
        check=False,
    )


def successful_results(customer, steps):
    completed = run_scenario(customer, steps)
    assert completed.returncode == 0, completed.stderr
    assert completed.stderr == ""
    return json.loads(completed.stdout)["results"]


def assert_scenario_rejected_without_results(customer, steps):
    completed = run_scenario(customer, steps)
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages):
    return {
        "op": "claim",
        "policy": policy,
        "incident": {"cause": "test incident", "damages": damages},
    }


def test_empty_quote_has_five_gold_premium():
    assert successful_results({"yearsWithMHPCO": 0}, [quote([])]) == [{"premium": 5}]


def test_main_item_price_list_produces_115_71_93_and_49_gold_quotes():
    premiums = [
        successful_results({"yearsWithMHPCO": 0}, [quote([{"type": item}])])[0]
        for item in ("sword", "amulet", "staff", "potion")
    ]
    assert premiums == [
        {"premium": 115}, {"premium": 71}, {"premium": 93}, {"premium": 49}
    ]


def test_main_item_values_produce_caps_of_2000_1200_1600_and_800_gold():
    items = ("sword", "amulet", "staff", "potion")
    steps = [quote([{"type": item}]) for item in items]
    steps += [claim(index, []) for index in range(4)]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[4:] == [
        {"payout": 0, "remainingCap": 2000},
        {"payout": 0, "remainingCap": 1200},
        {"payout": 0, "remainingCap": 1600},
        {"payout": 0, "remainingCap": 800},
    ]


def test_each_component_type_has_33_gold_quote_and_500_gold_cap():
    scenarios = [
        successful_results(
            {"yearsWithMHPCO": 0},
            [quote([{"type": component_type}]), claim(0, [])],
        )
        for component_type in ("rune", "moonstone")
    ]
    assert scenarios == [
        [{"premium": 33}, {"payout": 0, "remainingCap": 500}],
        [{"premium": 33}, {"payout": 0, "remainingCap": 500}],
    ]


def test_two_runes_do_not_form_a_block_and_cost_60_gold():
    assert successful_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 2)]) == [{"premium": 60}]


def test_three_runes_form_one_block_and_cost_71_gold():
    assert successful_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 3)]) == [{"premium": 71}]


def test_four_runes_do_not_use_a_block_and_cost_115_gold():
    assert successful_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 4)]) == [{"premium": 115}]


def test_seven_runes_do_not_use_blocks_and_round_premium_up_to_198_gold():
    assert successful_results({"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * 7)]) == [{"premium": 198}]


def test_mixed_three_components_do_not_form_a_block_and_cost_88_gold():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert successful_results({"yearsWithMHPCO": 0}, [quote(items)]) == [{"premium": 88}]


def test_two_component_types_form_two_separate_blocks_and_cost_137_gold():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert successful_results({"yearsWithMHPCO": 0}, [quote(items)]) == [{"premium": 137}]


def test_item_modifier_scope_does_not_surcharge_plain_amulet():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet", "cursed": False}]
    assert successful_results({"yearsWithMHPCO": 0}, [quote(items)]) == [{"premium": 231}]


def test_loyalty_discount_applies_at_exactly_two_years():
    assert successful_results({"yearsWithMHPCO": 2}, [quote([{"type": "sword"}])]) == [{"premium": 95}]


def test_enchantment_threshold_is_inclusive_and_stacks_with_curse():
    item = {"type": "sword", "enchantment": 5, "cursed": True}
    assert successful_results({"yearsWithMHPCO": 0}, [quote([item])]) == [{"premium": 195}]


def test_enchantment_below_five_does_not_add_high_enchantment_surcharge():
    item = {"type": "sword", "enchantment": 4, "cursed": True}
    assert successful_results({"yearsWithMHPCO": 0}, [quote([item])]) == [{"premium": 165}]


def test_claim_enchantment_threshold_is_inclusive_even_for_dragon_material():
    item = {"type": "sword", "material": "dragon", "enchantment": 8}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 400, "remainingCap": 1600}


def test_deductible_applies_per_damage_entry():
    steps = [
        quote([{"type": "sword"}, {"type": "amulet"}]),
        claim(0, [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]),
    ]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 600, "remainingCap": 2600}


def test_standard_item_claim_uses_full_damage_less_deductible():
    item = {"type": "sword", "material": "steel", "enchantment": 3}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 500}])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 400, "remainingCap": 1600}


def test_component_claim_uses_full_damage_less_deductible():
    steps = [quote([{"type": "rune"}]), claim(0, [{"itemType": "rune", "amount": 200}])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 100, "remainingCap": 400}


def test_high_enchantment_rule_wins_over_dragon_material():
    item = {"type": "sword", "material": "dragon", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 400, "remainingCap": 1600}


def test_dragon_material_without_extreme_enchantment_is_fully_reimbursed():
    item = {"type": "sword", "material": "dragon", "enchantment": 5}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 800}])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 700, "remainingCap": 1300}


def test_high_enchantment_non_dragon_item_is_half_reimbursed():
    item = {"type": "sword", "material": "steel", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 400, "remainingCap": 1600}


def test_duplicate_item_types_each_contribute_to_policy_cap():
    steps = [quote([{"type": "sword"}, {"type": "sword"}]), claim(0, [])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 0, "remainingCap": 4000}


def test_two_sword_damages_are_separate_when_two_swords_are_insured():
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "sword", "amount": 500}]
    steps = [quote([{"type": "sword"}, {"type": "sword"}]), claim(0, damages)]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 800, "remainingCap": 3200}


def test_more_damage_entries_than_insured_items_rejects_the_whole_claim():
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "sword", "amount": 500}]
    completed = run_scenario({"yearsWithMHPCO": 0}, [quote([{"type": "sword"}]), claim(0, damages)])
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


def test_mixed_policy_cap_is_twice_sum_of_item_values():
    steps = [quote([{"type": "sword"}, {"type": "amulet"}]), claim(0, [])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 0, "remainingCap": 3200}


def test_premium_modifiers_do_not_increase_cap():
    steps = [quote([{"type": "sword", "cursed": True}]), claim(0, [])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 0, "remainingCap": 2000}


def test_component_block_discount_does_not_reduce_cap():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    steps = [quote(items), claim(0, [])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 0, "remainingCap": 3500}


def test_successive_claims_exhaust_and_limit_policy_cap():
    damage = [{"itemType": "sword", "amount": 1500}]
    steps = [quote([{"type": "sword"}]), claim(0, damage), claim(0, damage)]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1:] == [
        {"payout": 1400, "remainingCap": 600},
        {"payout": 600, "remainingCap": 0},
    ]


def test_fractional_payout_is_rounded_down_only_at_the_end():
    item = {"type": "sword", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 901}])]
    assert successful_results({"yearsWithMHPCO": 0}, steps)[1] == {"payout": 350, "remainingCap": 1650}


def test_unknown_quote_item_is_rejected_atomically():
    assert_scenario_rejected_without_results(
        {"yearsWithMHPCO": 0}, [quote([{"type": "broomstick"}])]
    )


def test_damage_to_item_not_on_policy_is_rejected():
    steps = [quote([{"type": "sword"}]), claim(0, [{"itemType": "amulet", "amount": 200}])]
    assert_scenario_rejected_without_results({"yearsWithMHPCO": 0}, steps)


def test_damage_with_unknown_item_type_is_rejected():
    steps = [quote([{"type": "sword"}]), claim(0, [{"itemType": "broomstick", "amount": 200}])]
    assert_scenario_rejected_without_results({"yearsWithMHPCO": 0}, steps)


def test_negative_damage_amount_rejects_the_whole_scenario_without_results():
    steps = [quote([{"type": "sword"}]), claim(0, [{"itemType": "sword", "amount": -200}])]
    assert_scenario_rejected_without_results({"yearsWithMHPCO": 0}, steps)


def test_newcomer_with_cursed_sword_pays_165_gold():
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert successful_results({"yearsWithMHPCO": 0}, [quote([item])]) == [{"premium": 165}]


def test_long_standing_customers_second_contract_costs_160_gold():
    item = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    results = successful_results({"yearsWithMHPCO": 3}, [quote([]), quote([item])])
    assert results[1] == {"premium": 160}
