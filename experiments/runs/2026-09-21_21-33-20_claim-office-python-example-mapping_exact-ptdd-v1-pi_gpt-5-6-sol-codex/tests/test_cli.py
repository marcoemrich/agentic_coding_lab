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
        capture_output=True,
        text=True,
        check=False,
    )


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages, cause="accident"):
    return {
        "op": "claim",
        "policy": policy,
        "incident": {"cause": cause, "damages": damages},
    }


def item(item_type, **attributes):
    return {"type": item_type, **attributes}


def damage(item_type, amount):
    return {"itemType": item_type, "amount": amount}


def assert_success(process, expected):
    assert process.returncode == 0
    assert process.stderr == ""
    assert json.loads(process.stdout) == {"results": expected}


def assert_rejected(process):
    assert process.returncode != 0
    assert process.stderr.strip()
    assert process.stdout.strip() == ""


def test_empty_quote_costs_5_g():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([])])
    assert_success(process, [{"premium": 5}])


def test_sword_price_list_entry():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("sword")])])
    assert_success(process, [{"premium": 115}])


def test_amulet_price_list_entry():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("amulet")])])
    assert_success(process, [{"premium": 71}])


def test_staff_price_list_entry():
    steps = [quote([item("staff")]), claim(0, [damage("staff", 2000)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 93}, {"payout": 1600, "remainingCap": 0}])


def test_potion_price_list_entry():
    steps = [quote([item("potion")]), claim(0, [damage("potion", 1000)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 49}, {"payout": 800, "remainingCap": 0}])


def test_rune_price_list_entry():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("rune")])])
    assert_success(process, [{"premium": 33}])


def test_moonstone_price_list_entry():
    steps = [quote([item("moonstone")]), claim(0, [damage("moonstone", 600)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 33}, {"payout": 500, "remainingCap": 0}])


def test_two_runes_have_no_block_discount():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("rune"), item("rune")])])
    assert_success(process, [{"premium": 60}])


def test_three_runes_form_a_block():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("rune")] * 3)])
    assert_success(process, [{"premium": 71}])


def test_four_runes_do_not_form_a_block():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("rune")] * 4)])
    assert_success(process, [{"premium": 115}])


def test_seven_runes_do_not_form_blocks():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("rune")] * 7)])
    assert_success(process, [{"premium": 198}])


def test_components_must_have_exactly_the_same_type_to_form_a_block():
    items = [item("rune"), item("rune"), item("moonstone")]
    process = run_scenario({"yearsWithMHPCO": 0}, [quote(items)])
    assert_success(process, [{"premium": 88}])


def test_each_component_type_can_form_its_own_block():
    items = [item("rune")] * 3 + [item("moonstone")] * 3
    process = run_scenario({"yearsWithMHPCO": 0}, [quote(items)])
    assert_success(process, [{"premium": 137}])


def test_curse_modifier_is_scoped_to_affected_item():
    items = [item("sword", cursed=True), item("amulet", cursed=False)]
    process = run_scenario({"yearsWithMHPCO": 0}, [quote(items)])
    assert_success(process, [{"premium": 231}])


def test_enchantment_threshold_and_curse_surcharges_both_apply():
    sword = item("sword", enchantment=5, cursed=True)
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([sword])])
    assert_success(process, [{"premium": 195}])


def test_enchantment_below_five_has_only_curse_surcharge():
    sword = item("sword", enchantment=4, cursed=True)
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([sword])])
    assert_success(process, [{"premium": 165}])


def test_loyalty_threshold_is_two_years():
    process = run_scenario({"yearsWithMHPCO": 2}, [quote([item("sword")])])
    assert_success(process, [{"premium": 95}])


def test_second_contract_gets_follow_up_discount():
    steps = [quote([item("sword")]), quote([item("sword")])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 115}, {"premium": 100}])


def test_fractional_premium_rounds_up_in_mhpco_favor():
    items = [item("sword", cursed=True, enchantment=5), item("rune")]
    process = run_scenario({"yearsWithMHPCO": 2}, [quote(items)])
    assert_success(process, [{"premium": 198}])


def test_newcomer_with_cursed_sword_integration():
    sword = item("sword", material="steel", enchantment=3, cursed=True)
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([sword])])
    assert_success(process, [{"premium": 165}])


def test_longstanding_customers_second_contract_integration():
    sword = item("sword", material="steel", enchantment=7, cursed=True)
    steps = [quote([]), quote([sword])]
    process = run_scenario({"yearsWithMHPCO": 3}, steps)
    assert_success(process, [{"premium": 5}, {"premium": 160}])


def test_regular_item_is_fully_reimbursed_before_deductible():
    sword = item("sword", material="steel", enchantment=3)
    steps = [quote([sword]), claim(0, [damage("sword", 500)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 115}, {"payout": 400, "remainingCap": 1600}])


def test_component_claim_has_no_enchantment_or_material_clause():
    steps = [quote([item("rune")]), claim(0, [damage("rune", 200)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 33}, {"payout": 100, "remainingCap": 400}])


def test_claim_enchantment_threshold_is_eight():
    sword = item("sword", material="dragon", enchantment=8)
    steps = [quote([sword]), claim(0, [damage("sword", 1000)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 145}, {"payout": 400, "remainingCap": 1600}])


def test_deductible_applies_per_damage_entry():
    items = [item("sword"), item("amulet")]
    damages = [damage("sword", 500), damage("amulet", 300)]
    steps = [quote(items), claim(0, damages, cause="dragon attack")]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 181}, {"payout": 600, "remainingCap": 2600}])


def test_high_enchantment_clause_wins_over_dragon_material():
    sword = item("sword", material="dragon", enchantment=9)
    steps = [quote([sword]), claim(0, [damage("sword", 1000)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 145}, {"payout": 400, "remainingCap": 1600}])


def test_dragon_material_is_fully_reimbursed_below_claim_enchantment_threshold():
    sword = item("sword", material="dragon", enchantment=5)
    steps = [quote([sword]), claim(0, [damage("sword", 800)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 145}, {"payout": 700, "remainingCap": 1300}])


def test_high_enchantment_halves_non_dragon_reimbursement():
    sword = item("sword", material="steel", enchantment=9)
    steps = [quote([sword]), claim(0, [damage("sword", 1000)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 145}, {"payout": 400, "remainingCap": 1600}])


def test_duplicate_item_types_each_add_insurance_value_and_claim_capacity():
    items = [item("sword"), item("sword")]
    damages = [damage("sword", 2500), damage("sword", 2500)]
    steps = [quote(items), claim(0, damages)]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 225}, {"payout": 4000, "remainingCap": 0}])


def test_claim_rejects_more_same_type_damages_than_policy_covers():
    damages = [damage("sword", 500), damage("sword", 500)]
    steps = [quote([item("sword")]), claim(0, damages)]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_rejected(process)


def test_mixed_item_insurance_values_set_policy_cap():
    items = [item("sword"), item("amulet")]
    damages = [damage("sword", 2000), damage("amulet", 2000)]
    steps = [quote(items), claim(0, damages)]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 181}, {"payout": 3200, "remainingCap": 0}])


def test_premium_modifiers_do_not_change_insurance_cap():
    steps = [quote([item("sword", cursed=True)]), claim(0, [damage("sword", 2500)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 165}, {"payout": 2000, "remainingCap": 0}])


def test_component_block_discount_does_not_reduce_insurance_sum():
    items = [item("sword")] + [item("rune")] * 3
    damages = [damage("sword", 1000)] + [damage("rune", 1000)] * 3
    steps = [quote(items), claim(0, damages)]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 181}, {"payout": 3500, "remainingCap": 0}])


def test_successive_claims_exhaust_shared_policy_cap():
    steps = [
        quote([item("sword")]),
        claim(0, [damage("sword", 1500)]),
        claim(0, [damage("sword", 1500)]),
    ]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(
        process,
        [
            {"premium": 115},
            {"payout": 1400, "remainingCap": 600},
            {"payout": 600, "remainingCap": 0},
        ],
    )


def test_fractional_payout_rounds_down_in_mhpco_favor():
    sword = item("sword", material="steel", enchantment=8)
    steps = [quote([sword]), claim(0, [damage("sword", 901)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_success(process, [{"premium": 145}, {"payout": 350, "remainingCap": 1650}])


def test_quote_rejects_unknown_item_type():
    process = run_scenario({"yearsWithMHPCO": 0}, [quote([item("broomstick")])])
    assert_rejected(process)


def test_claim_rejects_item_not_on_policy():
    steps = [quote([item("sword")]), claim(0, [damage("amulet", 200)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_rejected(process)


def test_claim_rejects_unknown_item_type():
    steps = [quote([item("sword")]), claim(0, [damage("broomstick", 200)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_rejected(process)


def test_claim_rejects_negative_damage_amount():
    steps = [quote([item("sword")]), claim(0, [damage("sword", -200)])]
    process = run_scenario({"yearsWithMHPCO": 0}, steps)
    assert_rejected(process)


def test_cli_schema_and_sequential_policy_reference():
    amulet = item("amulet", material="silver", enchantment=2, cursed=False)
    steps = [quote([amulet]), claim(0, [damage("amulet", 200)], cause="fire")]
    process = run_scenario({"yearsWithMHPCO": 5}, steps)
    assert_success(process, [{"premium": 59}, {"payout": 100, "remainingCap": 1100}])
