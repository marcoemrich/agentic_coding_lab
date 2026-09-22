import json
import subprocess
import sys
from fractions import Fraction
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


def successful_results(customer, steps):
    completed = run_scenario(customer, steps)
    assert completed.returncode == 0, completed.stderr
    assert completed.stderr == ""
    return json.loads(completed.stdout)["results"]


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages):
    return {
        "op": "claim",
        "policy": policy,
        "incident": {"cause": "test incident", "damages": damages},
    }


def test_empty_quote_costs_5_g():
    assert successful_results({"yearsWithMHPCO": 0}, [quote([])]) == [{"premium": 5}]


@pytest.mark.parametrize(
    ("item_type", "premium"),
    [("sword", 115), ("amulet", 71), ("staff", 93), ("potion", 49), ("rune", 33), ("moonstone", 33)],
)
def test_item_base_premium_catalogue(item_type, premium):
    assert successful_results(
        {"yearsWithMHPCO": 0}, [quote([{"type": item_type}])]
    ) == [{"premium": premium}]


@pytest.mark.parametrize(("count", "base"), [(2, 50), (3, 60), (4, 100), (7, 175)])
def test_alike_component_block_applies_only_to_exactly_three(count, base):
    expected = __import__("math").ceil(base * Fraction(11, 10) + 5)
    assert successful_results(
        {"yearsWithMHPCO": 0}, [quote([{"type": "rune"}] * count)]
    ) == [{"premium": expected}]


def test_component_block_requires_the_same_type():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert successful_results({"yearsWithMHPCO": 0}, [quote(items)]) == [{"premium": 88}]


def test_each_component_type_forms_its_own_block():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert successful_results({"yearsWithMHPCO": 0}, [quote(items)]) == [{"premium": 137}]


def test_curse_surcharge_is_item_scoped():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet", "cursed": False}]
    assert successful_results({"yearsWithMHPCO": 0}, [quote(items)]) == [{"premium": 231}]


def test_loyalty_discount_starts_at_two_years():
    assert successful_results(
        {"yearsWithMHPCO": 2}, [quote([{"type": "sword"}])]
    ) == [{"premium": 95}]


def test_enchantment_threshold_five_stacks_with_curse():
    item = {"type": "sword", "enchantment": 5, "cursed": True}
    assert successful_results({"yearsWithMHPCO": 0}, [quote([item])]) == [{"premium": 195}]


def test_enchantment_four_does_not_trigger_high_enchantment_surcharge():
    item = {"type": "sword", "enchantment": 4, "cursed": True}
    assert successful_results({"yearsWithMHPCO": 0}, [quote([item])]) == [{"premium": 165}]


def test_newcomer_with_cursed_sword_integration():
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert successful_results({"yearsWithMHPCO": 0}, [quote([item])]) == [{"premium": 165}]


def test_second_contract_keeps_item_initial_assessment_and_adds_followup_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    results = successful_results({"yearsWithMHPCO": 3}, [quote([]), quote([sword])])
    assert results == [{"premium": 5}, {"premium": 160}]


def test_premium_rounds_up_only_at_the_end():
    assert successful_results(
        {"yearsWithMHPCO": 0}, [quote([{"type": "rune"}])]
    ) == [{"premium": 33}]


def test_standard_sword_claim_reimburses_damage_less_deductible():
    results = successful_results(
        {"yearsWithMHPCO": 0},
        [quote([{"type": "sword", "material": "steel", "enchantment": 3}]), claim(0, [{"itemType": "sword", "amount": 500}])],
    )
    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_component_claim_uses_standard_reimbursement():
    results = successful_results(
        {"yearsWithMHPCO": 0},
        [quote([{"type": "rune"}]), claim(0, [{"itemType": "rune", "amount": 200}])],
    )
    assert results[1] == {"payout": 100, "remainingCap": 400}


def test_enchantment_eight_halves_damage_even_for_dragon_material():
    item = {"type": "sword", "material": "dragon", "enchantment": 8}
    results = successful_results({"yearsWithMHPCO": 0}, [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])])
    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_high_enchantment_wins_when_dragon_clause_also_applies():
    item = {"type": "sword", "material": "dragon", "enchantment": 9}
    results = successful_results({"yearsWithMHPCO": 0}, [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])])
    assert results[1]["payout"] == 400


def test_dragon_material_without_high_enchantment_is_fully_reimbursed():
    item = {"type": "sword", "material": "dragon", "enchantment": 5}
    results = successful_results({"yearsWithMHPCO": 0}, [quote([item]), claim(0, [{"itemType": "sword", "amount": 800}])])
    assert results[1]["payout"] == 700


def test_high_enchantment_halves_non_dragon_damage():
    item = {"type": "sword", "material": "steel", "enchantment": 9}
    results = successful_results({"yearsWithMHPCO": 0}, [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])])
    assert results[1]["payout"] == 400


def test_deductible_applies_per_damaged_item():
    items = [{"type": "sword"}, {"type": "amulet"}]
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    results = successful_results({"yearsWithMHPCO": 0}, [quote(items), claim(0, damages)])
    assert results[1] == {"payout": 600, "remainingCap": 2600}


def test_multiple_items_of_same_type_are_separate_insured_items():
    items = [{"type": "sword"}, {"type": "sword"}]
    damages = [{"itemType": "sword", "amount": 2500}, {"itemType": "sword", "amount": 2500}]
    results = successful_results({"yearsWithMHPCO": 0}, [quote(items), claim(0, damages)])
    assert results[1] == {"payout": 4000, "remainingCap": 0}


def test_claim_rejects_more_damage_entries_than_covered_items():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [quote([{"type": "sword"}]), claim(0, [{"itemType": "sword", "amount": 200}, {"itemType": "sword", "amount": 200}])],
    )
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


@pytest.mark.parametrize(
    ("item_type", "cap"),
    [("sword", 2000), ("amulet", 1200), ("staff", 1600), ("potion", 800), ("rune", 500), ("moonstone", 500)],
)
def test_insurance_value_catalogue_sets_policy_cap(item_type, cap):
    results = successful_results(
        {"yearsWithMHPCO": 0},
        [quote([{"type": item_type}]), claim(0, [{"itemType": item_type, "amount": 10000}])],
    )
    assert results[1] == {"payout": cap, "remainingCap": 0}


def test_policy_cap_sums_different_item_insurance_values():
    items = [{"type": "sword"}, {"type": "amulet"}]
    damages = [{"itemType": "sword", "amount": 5000}, {"itemType": "amulet", "amount": 5000}]
    results = successful_results({"yearsWithMHPCO": 0}, [quote(items), claim(0, damages)])
    assert results[1] == {"payout": 3200, "remainingCap": 0}


def test_premium_modifiers_do_not_change_cap():
    item = {"type": "sword", "cursed": True}
    results = successful_results({"yearsWithMHPCO": 0}, [quote([item]), claim(0, [{"itemType": "sword", "amount": 5000}])])
    assert results[0] == {"premium": 165}
    assert results[1] == {"payout": 2000, "remainingCap": 0}


def test_component_block_discount_does_not_change_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    damages = [{"itemType": "sword", "amount": 5000}] + [{"itemType": "rune", "amount": 5000}] * 3
    results = successful_results({"yearsWithMHPCO": 0}, [quote(items), claim(0, damages)])
    assert results[1] == {"payout": 3500, "remainingCap": 0}


def test_successive_claims_exhaust_shared_policy_cap():
    steps = [
        quote([{"type": "sword"}]),
        claim(0, [{"itemType": "sword", "amount": 1500}]),
        claim(0, [{"itemType": "sword", "amount": 1500}]),
    ]
    results = successful_results({"yearsWithMHPCO": 0}, steps)
    assert results[1:] == [{"payout": 1400, "remainingCap": 600}, {"payout": 600, "remainingCap": 0}]


def test_payout_rounds_down_only_at_the_end():
    item = {"type": "sword", "enchantment": 8}
    results = successful_results({"yearsWithMHPCO": 0}, [quote([item]), claim(0, [{"itemType": "sword", "amount": 901}])])
    assert results[1]["payout"] == 350


def test_quote_rejects_unknown_item_type():
    completed = run_scenario({"yearsWithMHPCO": 0}, [quote([{"type": "broomstick"}])])
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


def test_claim_rejects_item_not_in_policy():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [quote([{"type": "sword"}]), claim(0, [{"itemType": "amulet", "amount": 200}])],
    )
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


def test_claim_rejects_unknown_item_type():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [quote([{"type": "sword"}]), claim(0, [{"itemType": "broomstick", "amount": 200}])],
    )
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


def test_claim_rejects_negative_damage():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [quote([{"type": "sword"}]), claim(0, [{"itemType": "sword", "amount": -200}])],
    )
    assert completed.returncode != 0 and completed.stderr and completed.stdout == ""


def test_cli_schema_and_sequential_policy_reference():
    steps = [
        quote([{"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}]),
        claim(0, [{"itemType": "amulet", "amount": 200}]),
    ]
    assert successful_results({"yearsWithMHPCO": 5}, steps) == [
        {"premium": 59},
        {"payout": 100, "remainingCap": 1100},
    ]
