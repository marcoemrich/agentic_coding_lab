import json
import subprocess
import sys
from pathlib import Path

import pytest


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def scenario(steps, years=0):
    return {"customer": {"yearsWithMHPCO": years}, "steps": steps}


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages, cause="accident"):
    return {"op": "claim", "policy": policy, "incident": {"cause": cause, "damages": damages}}


def item(item_type, **attributes):
    return {"type": item_type, **attributes}


def run_cli(document):
    return subprocess.run(
        [sys.executable, str(CLI)], input=json.dumps(document), text=True,
        capture_output=True, check=False,
    )


def successful(document):
    result = run_cli(document)
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


def test_empty_quote_costs_five_gold():
    assert successful(scenario([quote([])])) == {"results": [{"premium": 5}]}


@pytest.mark.parametrize("item_type,premium", [("sword", 115), ("amulet", 71), ("staff", 93), ("potion", 49), ("rune", 33), ("moonstone", 33)])
def test_price_list_base_premiums(item_type, premium):
    assert successful(scenario([quote([item(item_type)])]))["results"][0]["premium"] == premium


@pytest.mark.parametrize("item_type,cap", [("sword", 2000), ("amulet", 1200), ("staff", 1600), ("potion", 800), ("rune", 500), ("moonstone", 500)])
def test_price_list_insurance_values_determine_caps(item_type, cap):
    result = successful(scenario([quote([item(item_type)]), claim(0, [])]))
    assert result["results"][1] == {"payout": 0, "remainingCap": cap}


def test_two_runes_do_not_form_a_block():
    assert successful(scenario([quote([item("rune")] * 2)]))["results"][0]["premium"] == 60


def test_three_runes_form_a_discounted_block():
    assert successful(scenario([quote([item("rune")] * 3)]))["results"][0]["premium"] == 71


def test_four_runes_do_not_form_a_block():
    assert successful(scenario([quote([item("rune")] * 4)]))["results"][0]["premium"] == 115


def test_seven_runes_do_not_form_blocks():
    assert successful(scenario([quote([item("rune")] * 7)]))["results"][0]["premium"] == 198


def test_mixed_components_do_not_form_a_block():
    items = [item("rune"), item("rune"), item("moonstone")]
    assert successful(scenario([quote(items)]))["results"][0]["premium"] == 88


def test_each_component_type_forms_its_own_block():
    items = [item("rune")] * 3 + [item("moonstone")] * 3
    assert successful(scenario([quote(items)]))["results"][0]["premium"] == 137


def test_item_surcharge_is_scoped_to_affected_item():
    items = [item("sword", cursed=True), item("amulet", cursed=False)]
    assert successful(scenario([quote(items)]))["results"][0]["premium"] == 231


def test_loyalty_discount_starts_at_two_years():
    assert successful(scenario([quote([item("sword")])], years=2))["results"][0]["premium"] == 95


def test_enchantment_threshold_and_curse_stack():
    sword = item("sword", enchantment=5, cursed=True)
    assert successful(scenario([quote([sword])]))["results"][0]["premium"] == 195


def test_below_enchantment_threshold_only_curse_applies():
    sword = item("sword", enchantment=4, cursed=True)
    assert successful(scenario([quote([sword])]))["results"][0]["premium"] == 165


def test_newcomer_with_cursed_sword():
    sword = item("sword", material="steel", enchantment=3, cursed=True)
    assert successful(scenario([quote([sword])])) == {"results": [{"premium": 165}]}


def test_long_standing_customers_second_contract_costs_160():
    sword = item("sword", material="steel", enchantment=7, cursed=True)
    result = successful(scenario([quote([]), quote([sword])], years=3))
    assert result["results"][1] == {"premium": 160}


def test_standard_sword_reimbursement():
    sword = item("sword", material="steel", enchantment=3)
    result = successful(scenario([quote([sword]), claim(0, [{"itemType": "sword", "amount": 500}])]))
    assert result["results"][1] == {"payout": 400, "remainingCap": 1600}


def test_component_reimbursement_has_no_special_clause():
    result = successful(scenario([quote([item("rune")]), claim(0, [{"itemType": "rune", "amount": 200}])]))
    assert result["results"][1] == {"payout": 100, "remainingCap": 400}


def test_enchantment_eight_halves_reimbursement_even_for_dragon():
    sword = item("sword", material="dragon", enchantment=8)
    result = successful(scenario([quote([sword]), claim(0, [{"itemType": "sword", "amount": 1000}])]))
    assert result["results"][1]["payout"] == 400


def test_high_enchantment_rule_wins_over_dragon_material():
    sword = item("sword", material="dragon", enchantment=9)
    result = successful(scenario([quote([sword]), claim(0, [{"itemType": "sword", "amount": 1000}])]))
    assert result["results"][1]["payout"] == 400


def test_dragon_material_gets_full_reimbursement():
    sword = item("sword", material="dragon", enchantment=5)
    result = successful(scenario([quote([sword]), claim(0, [{"itemType": "sword", "amount": 800}])]))
    assert result["results"][1]["payout"] == 700


def test_high_enchantment_halves_non_dragon_reimbursement():
    sword = item("sword", material="steel", enchantment=9)
    result = successful(scenario([quote([sword]), claim(0, [{"itemType": "sword", "amount": 1000}])]))
    assert result["results"][1]["payout"] == 400


def test_deductible_applies_per_damaged_item():
    items = [item("sword", material="dragon"), item("amulet", material="dragon")]
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    result = successful(scenario([quote(items), claim(0, damages, "dragon attack")]))
    assert result["results"][1]["payout"] == 600


def test_duplicate_items_each_increase_policy_cap():
    result = successful(scenario([quote([item("sword"), item("sword")]), claim(0, [])]))
    assert result["results"][1]["remainingCap"] == 4000


def test_duplicate_items_accept_separate_damage_entries():
    damages = [{"itemType": "sword", "amount": 500}] * 2
    result = successful(scenario([quote([item("sword"), item("sword")]), claim(0, damages)]))
    assert result["results"][1]["payout"] == 800


def test_more_damage_entries_than_insured_items_rejects_whole_claim():
    result = run_cli(scenario([quote([item("sword")]), claim(0, [{"itemType": "sword", "amount": 500}] * 2)]))
    assert result.returncode != 0 and result.stderr and result.stdout == ""


def test_cap_uses_sum_of_main_item_insurance_values():
    result = successful(scenario([quote([item("sword"), item("amulet")]), claim(0, [])]))
    assert result["results"][1]["remainingCap"] == 3200


def test_premium_modifiers_do_not_raise_cap():
    result = successful(scenario([quote([item("sword", cursed=True)]), claim(0, [])]))
    assert result["results"] == [{"premium": 165}, {"payout": 0, "remainingCap": 2000}]


def test_component_block_does_not_lower_cap():
    items = [item("sword")] + [item("rune")] * 3
    result = successful(scenario([quote(items), claim(0, [])]))
    assert result["results"][1]["remainingCap"] == 3500


def test_successive_claims_exhaust_policy_cap():
    damage = [{"itemType": "sword", "amount": 1500}]
    result = successful(scenario([quote([item("sword")]), claim(0, damage), claim(0, damage)]))
    assert result["results"][1:] == [{"payout": 1400, "remainingCap": 600}, {"payout": 600, "remainingCap": 0}]


def test_fractional_premium_rounds_up_at_end():
    items = [item("amulet"), item("potion"), item("rune"), item("rune"), item("moonstone")]
    assert successful(scenario([quote(items)]))["results"][0]["premium"] == 198


def test_fractional_payout_rounds_down_at_end():
    sword = item("sword", enchantment=8)
    damages = [{"itemType": "sword", "amount": 901}]
    result = successful(scenario([quote([sword]), claim(0, damages)]))
    assert result["results"][1]["payout"] == 350


def test_unknown_quote_item_is_rejected():
    result = run_cli(scenario([quote([item("broomstick")])]))
    assert result.returncode != 0 and result.stderr and result.stdout == ""


def test_damage_to_uninsured_item_is_rejected():
    result = run_cli(scenario([quote([item("sword")]), claim(0, [{"itemType": "amulet", "amount": 200}])]))
    assert result.returncode != 0 and result.stderr and result.stdout == ""


def test_unknown_damage_item_is_rejected():
    result = run_cli(scenario([quote([item("sword")]), claim(0, [{"itemType": "broomstick", "amount": 200}])]))
    assert result.returncode != 0 and result.stderr and result.stdout == ""


def test_negative_damage_is_rejected():
    result = run_cli(scenario([quote([item("sword")]), claim(0, [{"itemType": "sword", "amount": -200}])]))
    assert result.returncode != 0 and result.stderr and result.stdout == ""


def test_schema_example_returns_quote_then_claim_results():
    amulet = item("amulet", material="silver", enchantment=2, cursed=False)
    document = scenario([quote([amulet]), claim(0, [{"itemType": "amulet", "amount": 200}], "fire")], years=5)
    assert successful(document) == {"results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]}
