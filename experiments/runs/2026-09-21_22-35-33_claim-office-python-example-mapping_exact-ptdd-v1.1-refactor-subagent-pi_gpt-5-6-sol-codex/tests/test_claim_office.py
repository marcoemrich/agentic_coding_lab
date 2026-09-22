import json
import subprocess
import sys
from pathlib import Path

import pytest


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def run_scenario(customer_years, steps):
    completed = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps({"customer": {"yearsWithMHPCO": customer_years}, "steps": steps}),
        text=True,
        capture_output=True,
        check=False,
    )
    assert completed.returncode == 0, completed.stderr
    assert completed.stderr == ""
    return json.loads(completed.stdout)


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages, cause="accident"):
    return {"op": "claim", "policy": policy, "incident": {"cause": cause, "damages": damages}}


def test_empty_quote_costs_only_the_5_g_processing_fee():
    assert run_scenario(0, [quote([])]) == {"results": [{"premium": 5}]}


@pytest.mark.parametrize(
    ("item_type", "premium"),
    [("sword", 115), ("amulet", 71), ("staff", 93), ("potion", 49)],
)
def test_each_main_item_has_its_independent_price_list_entry(item_type, premium):
    assert run_scenario(0, [quote([{"type": item_type}])]) == {"results": [{"premium": premium}]}


@pytest.mark.parametrize(("count", "premium"), [(2, 60), (3, 71), (4, 115), (7, 198)])
def test_component_block_applies_only_to_exactly_three_alike_components(count, premium):
    assert run_scenario(0, [quote([{"type": "rune"}] * count)]) == {"results": [{"premium": premium}]}


def test_component_block_requires_the_exact_same_type():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert run_scenario(0, [quote(items)]) == {"results": [{"premium": 88}]}


def test_separate_component_types_each_form_their_own_block():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert run_scenario(0, [quote(items)]) == {"results": [{"premium": 137}]}


def test_item_surcharge_does_not_apply_to_plain_items_in_same_policy():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet", "cursed": False}]
    assert run_scenario(0, [quote(items)]) == {"results": [{"premium": 231}]}


def test_loyalty_discount_starts_at_exactly_two_years():
    assert run_scenario(2, [quote([{"type": "sword"}])]) == {"results": [{"premium": 95}]}


def test_high_enchantment_starts_at_five_and_stacks_with_curse():
    item = {"type": "sword", "enchantment": 5, "cursed": True}
    assert run_scenario(0, [quote([item])]) == {"results": [{"premium": 195}]}


def test_enchantment_four_does_not_receive_high_enchantment_surcharge():
    item = {"type": "sword", "enchantment": 4, "cursed": True}
    assert run_scenario(0, [quote([item])]) == {"results": [{"premium": 165}]}


def test_newcomer_with_cursed_sword_pays_165_g():
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert run_scenario(0, [quote([item])]) == {"results": [{"premium": 165}]}


def test_second_contract_keeps_item_initial_surcharge_and_adds_follow_up_discount():
    steps = [
        quote([{"type": "amulet"}]),
        quote([{"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}]),
    ]
    assert run_scenario(3, steps) == {"results": [{"premium": 59}, {"premium": 160}]}


def test_standard_sword_reimbursement_deducts_100_g():
    steps = [quote([{"type": "sword", "material": "steel", "enchantment": 3}]), claim(0, [{"itemType": "sword", "amount": 500}])]
    assert run_scenario(0, steps)["results"][1] == {"payout": 400, "remainingCap": 1600}


def test_component_claim_has_no_material_or_enchantment_clause():
    steps = [quote([{"type": "rune"}]), claim(0, [{"itemType": "rune", "amount": 200}])]
    assert run_scenario(0, steps)["results"][1] == {"payout": 100, "remainingCap": 400}


def test_enchantment_eight_half_reimbursement_wins_over_dragon_material():
    item = {"type": "sword", "material": "dragon", "enchantment": 8}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert run_scenario(0, steps)["results"][1]["payout"] == 400


def test_dragon_and_enchantment_nine_still_use_half_reimbursement():
    item = {"type": "sword", "material": "dragon", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert run_scenario(0, steps)["results"][1]["payout"] == 400


def test_dragon_material_without_high_claim_enchantment_is_fully_reimbursed():
    item = {"type": "sword", "material": "dragon", "enchantment": 5}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 800}])]
    assert run_scenario(0, steps)["results"][1]["payout"] == 700


def test_high_claim_enchantment_halves_non_dragon_reimbursement():
    item = {"type": "sword", "material": "steel", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert run_scenario(0, steps)["results"][1]["payout"] == 400


def test_deductible_applies_once_to_each_damaged_item():
    items = [{"type": "sword"}, {"type": "amulet"}]
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    steps = [quote(items), claim(0, damages, "dragon attack")]
    assert run_scenario(0, steps)["results"][1] == {"payout": 600, "remainingCap": 2600}


def test_duplicate_insured_items_each_contribute_to_the_cap():
    steps = [quote([{"type": "sword"}, {"type": "sword"}]), claim(0, [])]
    assert run_scenario(0, steps)["results"][1] == {"payout": 0, "remainingCap": 4000}


def test_duplicate_insured_items_allow_separate_damage_entries():
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "sword", "amount": 500}]
    steps = [quote([{"type": "sword"}, {"type": "sword"}]), claim(0, damages)]
    assert run_scenario(0, steps)["results"][1] == {"payout": 800, "remainingCap": 3200}


def test_more_damage_entries_than_insured_items_rejects_the_claim():
    scenario = {"customer": {"yearsWithMHPCO": 0}, "steps": [quote([{"type": "sword"}]), claim(0, [{"itemType": "sword", "amount": 200}] * 2)]}
    completed = subprocess.run([sys.executable, str(CLI)], input=json.dumps(scenario), text=True, capture_output=True, check=False)
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


def test_policy_cap_is_twice_sum_of_main_item_insurance_values():
    steps = [quote([{"type": "sword"}, {"type": "amulet"}]), claim(0, [])]
    assert run_scenario(0, steps)["results"][1]["remainingCap"] == 3200


def test_premium_modifiers_do_not_change_insurance_cap():
    steps = [quote([{"type": "sword", "cursed": True}]), claim(0, [])]
    result = run_scenario(0, steps)["results"]
    assert result == [{"premium": 165}, {"payout": 0, "remainingCap": 2000}]


def test_component_block_discount_does_not_reduce_insurance_cap():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    steps = [quote(items), claim(0, [])]
    assert run_scenario(0, steps)["results"][1]["remainingCap"] == 3500


def test_successive_claims_share_and_exhaust_policy_cap():
    damage = [{"itemType": "sword", "amount": 1500}]
    steps = [quote([{"type": "sword"}]), claim(0, damage), claim(0, damage)]
    assert run_scenario(0, steps)["results"][1:] == [
        {"payout": 1400, "remainingCap": 600},
        {"payout": 600, "remainingCap": 0},
    ]


def test_fractional_payout_is_rounded_down_only_after_deductible():
    item = {"type": "sword", "enchantment": 8}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 901}])]
    assert run_scenario(0, steps)["results"][1]["payout"] == 350


def run_invalid(steps):
    scenario = {"customer": {"yearsWithMHPCO": 0}, "steps": steps}
    return subprocess.run([sys.executable, str(CLI)], input=json.dumps(scenario), text=True, capture_output=True, check=False)


def test_unknown_quote_item_is_rejected_by_cli():
    completed = run_invalid([quote([{"type": "broomstick"}])])
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


@pytest.mark.parametrize("item_type", ["amulet", "broomstick"])
def test_damage_item_not_in_policy_is_rejected_by_cli(item_type):
    completed = run_invalid([quote([{"type": "sword"}]), claim(0, [{"itemType": item_type, "amount": 200}])])
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


def test_negative_damage_amount_is_rejected_by_cli():
    completed = run_invalid([quote([{"type": "sword"}]), claim(0, [{"itemType": "sword", "amount": -200}])])
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


def test_cli_schema_example_returns_ordered_quote_and_claim_results():
    item = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    steps = [quote([item]), claim(0, [{"itemType": "amulet", "amount": 200}], "fire")]
    assert run_scenario(5, steps) == {"results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]}
