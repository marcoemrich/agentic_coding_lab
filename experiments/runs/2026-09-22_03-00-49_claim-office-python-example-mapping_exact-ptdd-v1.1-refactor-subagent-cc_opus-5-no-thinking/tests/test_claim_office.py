"""Test list for the MHPCO Claim Office kata.

Every behavior from the specification, ordered simple -> complex.
Each test is activated one at a time by removing its skip marker.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )

from claim_office import (
    insurance_sum,
    payout_cap,
    quote_premium,
    settle_claim,
    settle_claim_against_cap,
)

# --- Premium: empty and single base items ---------------------------------


def test_empty_item_list_costs_only_the_processing_fee():
    assert quote_premium([]) == 5


def test_plain_sword_base_premium_is_100_plus_fee():
    assert quote_premium([{"type": "sword"}]) == 115


def test_plain_amulet_base_premium_is_60_plus_fee():
    assert quote_premium([{"type": "amulet"}]) == 71


def test_plain_staff_base_premium_is_80_plus_fee():
    assert quote_premium([{"type": "staff"}]) == 93


def test_plain_potion_base_premium_is_40_plus_fee():
    assert quote_premium([{"type": "potion"}]) == 49


def test_single_rune_base_premium_is_25_plus_fee():
    assert quote_premium([{"type": "rune"}]) == 33


def test_single_moonstone_base_premium_is_25_plus_fee():
    assert quote_premium([{"type": "moonstone"}]) == 33


def test_quote_with_unknown_item_type_is_rejected():
    """Reading adopted: the domain rejects with ValueError; the CLI turns it into exit != 0."""
    with pytest.raises(ValueError):
        quote_premium([{"type": "broomstick"}])


# --- Premium: component building blocks -----------------------------------


def test_two_runes_cost_50_base_premium():
    assert quote_premium([{"type": "rune"}, {"type": "rune"}]) == 60


def test_three_runes_form_a_block_costing_60_base_premium():
    assert quote_premium([{"type": "rune"}] * 3) == 71


def test_four_runes_cost_100_base_premium_without_block():
    assert quote_premium([{"type": "rune"}] * 4) == 115


def test_seven_runes_cost_175_base_premium():
    assert quote_premium([{"type": "rune"}] * 7) == 198


def test_mixed_component_types_do_not_form_a_block():
    """Reading adopted: "alike" means the same component type, not the same family."""
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert quote_premium(items) == 88


def test_two_separate_component_blocks_cost_120_base_premium():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert quote_premium(items) == 137


# --- Premium: item-specific modifiers -------------------------------------


def test_cursed_item_adds_50_percent_risk_surcharge():
    assert quote_premium([{"type": "sword", "cursed": True}]) == 165


def test_enchantment_exactly_5_adds_30_percent_surcharge():
    assert quote_premium([{"type": "sword", "enchantment": 5}]) == 145


def test_enchantment_4_adds_no_high_enchantment_surcharge():
    assert quote_premium([{"type": "sword", "enchantment": 4}]) == 115


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    items = [{"type": "sword", "enchantment": 5, "cursed": True}]
    assert quote_premium(items) == 195


def test_item_surcharge_applies_only_to_the_affected_item():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    assert quote_premium(items) == 231


# --- Premium: policy-wide modifiers ---------------------------------------


def test_loyalty_discount_applies_at_exactly_two_years():
    """100 G base - 20 G loyalty + 5 G fee = 85 G."""
    assert quote_premium([{"type": "sword"}], {"yearsWithMHPCO": 2}) == 95


def test_no_loyalty_discount_below_two_years():
    assert quote_premium([{"type": "sword"}], {"yearsWithMHPCO": 1}) == 115


def test_first_insurance_surcharge_applies_to_every_quote():
    """Every quote is a first insurance for its items: 100 G base + 10 G + 5 G fee = 115 G."""
    assert quote_premium([{"type": "sword"}], {"yearsWithMHPCO": 0}) == 115


def test_follow_up_contract_discount_applies_from_the_second_quote():
    """100 G base + 10 G first insurance - 15 G follow-up + 5 G fee = 100 G."""
    customer = {"yearsWithMHPCO": 0}
    assert quote_premium([{"type": "sword"}], customer, previous_contracts=1) == 100


# --- Premium: rounding and integration ------------------------------------


def test_premium_is_rounded_up():
    """7 runes: 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G -> 198 G."""
    assert quote_premium([{"type": "rune"}] * 7) == 198


def test_newcomer_with_a_cursed_sword_pays_165():
    items = [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}]
    assert quote_premium(items, {"yearsWithMHPCO": 0}, previous_contracts=0) == 165


def test_long_standing_customers_second_contract_pays_160():
    """The first-insurance surcharge still applies on a follow-up contract."""
    items = [{"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}]
    assert quote_premium(items, {"yearsWithMHPCO": 3}, previous_contracts=1) == 160


# --- Claims: insurance sum and cap ----------------------------------------


def test_insurance_sum_is_the_sum_of_item_values_and_cap_is_twice_it():
    items = [{"type": "sword"}, {"type": "amulet"}]
    assert insurance_sum(items) == 1600
    assert payout_cap(items) == 3200


def test_premium_modifiers_do_not_raise_the_cap():
    items = [{"type": "sword", "cursed": True}]
    assert quote_premium(items, {"yearsWithMHPCO": 0}) == 165
    assert payout_cap(items) == 2000


def test_component_block_discount_does_not_reduce_the_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    assert insurance_sum(items) == 1750


def test_two_swords_double_the_insurance_sum():
    items = [{"type": "sword"}, {"type": "sword"}]
    assert insurance_sum(items) == 2000
    assert payout_cap(items) == 4000


# --- Claims: payout rules -------------------------------------------------


def test_standard_damage_is_fully_reimbursed_minus_the_deductible():
    items = [{"type": "sword", "material": "steel", "enchantment": 3}]
    damages = [{"itemType": "sword", "amount": 500}]
    assert settle_claim(items, damages) == 400


def test_component_damage_has_no_special_clause():
    items = [{"type": "rune"}]
    damages = [{"itemType": "rune", "amount": 200}]
    assert settle_claim(items, damages) == 100


def test_high_enchantment_damage_is_reimbursed_at_50_percent_then_deductible():
    items = [{"type": "sword", "material": "steel", "enchantment": 9}]
    damages = [{"itemType": "sword", "amount": 1000}]
    assert settle_claim(items, damages) == 400


def test_dragon_material_damage_is_fully_reimbursed_then_deductible():
    items = [{"type": "sword", "material": "dragon", "enchantment": 5}]
    damages = [{"itemType": "sword", "amount": 800}]
    assert settle_claim(items, damages) == 700


def test_high_enchantment_wins_over_dragon_material():
    """Both clauses apply; the 50 % rule wins, then the deductible."""
    items = [{"type": "sword", "material": "dragon", "enchantment": 9}]
    damages = [{"itemType": "sword", "amount": 1000}]
    assert settle_claim(items, damages) == 400


def test_enchantment_exactly_8_triggers_the_50_percent_clause():
    items = [{"type": "sword", "material": "dragon", "enchantment": 8}]
    damages = [{"itemType": "sword", "amount": 1000}]
    assert settle_claim(items, damages) == 400


def test_deductible_applies_once_per_damaged_item():
    items = [{"type": "sword"}, {"type": "amulet"}]
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "amulet", "amount": 300},
    ]
    assert settle_claim(items, damages) == 600


def test_payout_is_rounded_down():
    """901 G at 50 % = 450.5 G, less the 100 G deductible = 350.5 G -> 350 G."""
    items = [{"type": "sword", "material": "steel", "enchantment": 9}]
    damages = [{"itemType": "sword", "amount": 901}]
    assert settle_claim(items, damages) == 350


# --- Claims: cap exhaustion across claims ---------------------------------


def test_first_claim_reduces_the_remaining_cap():
    items = [{"type": "sword"}]
    damages = [{"itemType": "sword", "amount": 1500}]
    payout, remaining_cap = settle_claim_against_cap(items, damages, payout_cap(items))
    assert payout == 1400
    assert remaining_cap == 600


def test_second_claim_is_limited_to_the_remaining_cap():
    items = [{"type": "sword"}]
    damages = [{"itemType": "sword", "amount": 1500}]
    _, remaining_cap = settle_claim_against_cap(items, damages, payout_cap(items))
    payout, remaining_cap = settle_claim_against_cap(items, damages, remaining_cap)
    assert payout == 600
    assert remaining_cap == 0


# --- Claims: rejections ---------------------------------------------------


def test_claim_for_an_uninsured_item_is_rejected():
    """Reading adopted: the domain rejects with ValueError; the CLI turns it into exit != 0."""
    items = [{"type": "sword"}]
    damages = [{"itemType": "amulet", "amount": 200}]
    with pytest.raises(ValueError):
        settle_claim(items, damages)


def test_claim_with_an_unknown_item_type_is_rejected():
    items = [{"type": "sword"}]
    damages = [{"itemType": "broomstick", "amount": 200}]
    with pytest.raises(ValueError):
        settle_claim(items, damages)


def test_more_damage_entries_than_insured_items_is_rejected():
    items = [{"type": "sword"}]
    damages = [
        {"itemType": "sword", "amount": 300},
        {"itemType": "sword", "amount": 200},
    ]
    with pytest.raises(ValueError):
        settle_claim(items, damages)


def test_negative_damage_amount_is_rejected():
    items = [{"type": "sword"}]
    damages = [{"itemType": "sword", "amount": -200}]
    with pytest.raises(ValueError):
        settle_claim(items, damages)


def test_two_damages_of_the_same_type_are_separate_damage_events():
    items = [{"type": "sword"}, {"type": "sword"}]
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 300},
    ]
    assert settle_claim(items, damages) == 600


# --- CLI adapter ----------------------------------------------------------


def test_cli_writes_results_for_a_quote_and_claim_scenario():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]},
            },
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


@pytest.mark.parametrize(
    "scenario",
    [
        pytest.param(
            {
                "customer": {"yearsWithMHPCO": 0},
                "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
            },
            id="unknown item type in a quote",
        ),
        pytest.param(
            {
                "customer": {"yearsWithMHPCO": 0},
                "steps": [
                    {"op": "quote", "items": [{"type": "sword"}]},
                    {
                        "op": "claim",
                        "policy": 0,
                        "incident": {
                            "cause": "fire",
                            "damages": [{"itemType": "amulet", "amount": 200}],
                        },
                    },
                ],
            },
            id="damage to an item not in the policy",
        ),
        pytest.param(
            {
                "customer": {"yearsWithMHPCO": 0},
                "steps": [
                    {"op": "quote", "items": [{"type": "sword"}]},
                    {
                        "op": "claim",
                        "policy": 0,
                        "incident": {
                            "cause": "fire",
                            "damages": [{"itemType": "sword", "amount": -200}],
                        },
                    },
                ],
            },
            id="negative damage amount",
        ),
    ],
)
def test_cli_exits_non_zero_and_writes_stderr_on_a_rejected_scenario(scenario):
    """A rejected scenario writes an error description to stderr and no results to stdout."""
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stderr != ""
    assert "results" not in result.stdout
