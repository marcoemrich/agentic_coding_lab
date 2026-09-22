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


def successful_scenario(customer, steps):
    completed = run_scenario(customer, steps)
    assert completed.returncode == 0, completed.stderr
    assert completed.stderr == ""
    return json.loads(completed.stdout)


def quote(items, years=0):
    result = successful_scenario(
        {"yearsWithMHPCO": years}, [{"op": "quote", "items": items}]
    )
    return result["results"][0]["premium"]


def quote_and_empty_claim(items, years=0):
    return successful_scenario(
        {"yearsWithMHPCO": years},
        [
            {"op": "quote", "items": items},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "inspection", "damages": []},
            },
        ],
    )["results"]


def test_empty_quote_costs_five_g():
    assert quote([]) == 5


@pytest.mark.parametrize(
    ("item_type", "premium", "remaining_cap"),
    [("sword", 115, 2000), ("amulet", 71, 1200), ("staff", 93, 1600), ("potion", 49, 800)],
)
def test_main_item_price_list(item_type, premium, remaining_cap):
    results = quote_and_empty_claim([{"type": item_type}])
    assert results == [{"premium": premium}, {"payout": 0, "remainingCap": remaining_cap}]


def test_two_runes_use_individual_component_premiums():
    assert quote([{"type": "rune"}] * 2) == 60


def test_three_runes_use_block_premium():
    assert quote([{"type": "rune"}] * 3) == 71


def test_four_runes_do_not_use_block_premium():
    assert quote([{"type": "rune"}] * 4) == 115


def test_seven_runes_do_not_partition_into_blocks():
    assert quote([{"type": "rune"}] * 7) == 198


def test_two_runes_and_moonstone_are_not_a_block():
    assert quote([{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]) == 88


def test_rune_and_moonstone_blocks_are_separate():
    assert quote([{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3) == 137


def test_item_surcharge_does_not_apply_to_plain_policy_items():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet", "cursed": False}]
    assert quote(items) == 231


def test_loyalty_discount_starts_at_two_years():
    assert quote([{"type": "sword"}], years=2) == 95


def test_enchantment_five_and_curse_both_apply():
    assert quote([{"type": "sword", "enchantment": 5, "cursed": True}]) == 195


def test_enchantment_four_only_gets_curse_surcharge():
    assert quote([{"type": "sword", "enchantment": 4, "cursed": True}]) == 165


def test_premium_rounds_up_only_at_the_end():
    items = [{"type": "rune"}, {"type": "sword", "enchantment": 5, "cursed": True}]
    assert quote(items, years=2) == 198


def test_newcomer_with_cursed_sword():
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert quote([item]) == 165


def test_longstanding_customers_second_contract():
    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    results = successful_scenario(
        {"yearsWithMHPCO": 3},
        [{"op": "quote", "items": []}, {"op": "quote", "items": [sword]}],
    )["results"]
    assert results == [{"premium": 5}, {"premium": 160}]


def claim_for(item, damage):
    return successful_scenario(
        {"yearsWithMHPCO": 0},
        [
            {"op": "quote", "items": [item]},
            {"op": "claim", "policy": 0, "incident": {"cause": "accident", "damages": [damage]}},
        ],
    )["results"][1]


def test_enchantment_eight_clause_wins_over_dragon_material():
    result = claim_for(
        {"type": "sword", "material": "dragon", "enchantment": 8},
        {"itemType": "sword", "amount": 1000},
    )
    assert result == {"payout": 400, "remainingCap": 1600}


def test_deductible_is_per_damage_entry():
    results = successful_scenario(
        {"yearsWithMHPCO": 0},
        [
            {"op": "quote", "items": [{"type": "sword"}, {"type": "amulet"}]},
            {"op": "claim", "policy": 0, "incident": {"cause": "dragon", "damages": [
                {"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}
            ]}},
        ],
    )["results"][1]
    assert results == {"payout": 600, "remainingCap": 2600}


def test_standard_sword_reimbursement():
    assert claim_for(
        {"type": "sword", "material": "steel", "enchantment": 3},
        {"itemType": "sword", "amount": 500},
    )["payout"] == 400


def test_component_standard_reimbursement():
    assert claim_for({"type": "rune"}, {"itemType": "rune", "amount": 200})["payout"] == 100


def test_high_enchantment_wins_when_both_claim_clauses_apply():
    assert claim_for(
        {"type": "sword", "material": "dragon", "enchantment": 9},
        {"itemType": "sword", "amount": 1000},
    )["payout"] == 400


def test_dragon_material_without_high_enchantment_pays_full():
    assert claim_for(
        {"type": "sword", "material": "dragon", "enchantment": 5},
        {"itemType": "sword", "amount": 800},
    )["payout"] == 700


def test_high_enchantment_non_dragon_item_pays_half():
    assert claim_for(
        {"type": "sword", "material": "steel", "enchantment": 9},
        {"itemType": "sword", "amount": 1000},
    )["payout"] == 400


def test_duplicate_item_instances_are_insured_and_damaged_separately():
    results = successful_scenario(
        {"yearsWithMHPCO": 0},
        [
            {"op": "quote", "items": [{"type": "sword"}, {"type": "sword"}]},
            {"op": "claim", "policy": 0, "incident": {"cause": "dragon", "damages": [
                {"itemType": "sword", "amount": 500}, {"itemType": "sword", "amount": 500}
            ]}},
        ],
    )["results"][1]
    assert results == {"payout": 800, "remainingCap": 3200}


def test_excess_damage_entries_reject_claim():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0,
          "incident": {"cause": "dragon", "damages": [
              {"itemType": "sword", "amount": 200}, {"itemType": "sword", "amount": 200}]}}],
    )
    assert completed.returncode != 0
    assert completed.stderr.strip()
    assert completed.stdout == ""


def test_multi_item_cap_uses_sum_of_insurance_values():
    assert quote_and_empty_claim([{"type": "sword"}, {"type": "amulet"}])[1]["remainingCap"] == 3200


def test_premium_modifiers_do_not_change_cap():
    assert quote_and_empty_claim([{"type": "sword", "cursed": True}])[1]["remainingCap"] == 2000


def test_component_block_does_not_change_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    assert quote_and_empty_claim(items)[1]["remainingCap"] == 3500


def test_successive_claims_exhaust_policy_cap():
    damage = {"op": "claim", "policy": 0, "incident": {"cause": "battle", "damages": [
        {"itemType": "sword", "amount": 1500}
    ]}}
    results = successful_scenario(
        {"yearsWithMHPCO": 0},
        [{"op": "quote", "items": [{"type": "sword"}]}, damage, damage],
    )["results"]
    assert results[1:] == [
        {"payout": 1400, "remainingCap": 600}, {"payout": 600, "remainingCap": 0}
    ]


def test_payout_rounds_down_only_at_the_end():
    assert claim_for(
        {"type": "sword", "material": "steel", "enchantment": 8},
        {"itemType": "sword", "amount": 901},
    )["payout"] == 350


def test_unknown_quote_item_is_rejected():
    completed = run_scenario(
        {"yearsWithMHPCO": 0}, [{"op": "quote", "items": [{"type": "broomstick"}]}]
    )
    assert completed.returncode != 0
    assert completed.stderr.strip()
    assert completed.stdout == ""


def test_uninsured_item_damage_is_rejected():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0,
          "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}],
    )
    assert completed.returncode != 0
    assert completed.stderr.strip()


def test_unknown_damage_item_is_rejected():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0,
          "incident": {"cause": "fire", "damages": [{"itemType": "broomstick", "amount": 200}]}}],
    )
    assert completed.returncode != 0
    assert completed.stderr.strip()


def test_negative_damage_is_rejected():
    completed = run_scenario(
        {"yearsWithMHPCO": 0},
        [{"op": "quote", "items": [{"type": "sword"}]}, {"op": "claim", "policy": 0,
          "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]}}],
    )
    assert completed.returncode != 0
    assert completed.stderr.strip()


def test_schema_example_processes_steps_in_order():
    results = successful_scenario(
        {"yearsWithMHPCO": 5},
        [{"op": "quote", "items": [
            {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
        ]}, {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [
            {"itemType": "amulet", "amount": 200}
        ]}}],
    )["results"]
    assert results == [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
