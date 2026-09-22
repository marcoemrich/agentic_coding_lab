"""Test list for the MHPCO claim office kata.

Every behavior from the specification, ordered simple -> complex.
Each test is activated one at a time by removing its skip marker.

Adopted readings where the specification leaves a contract open:
- Rejection cases: the domain raises ValueError; src/cli.py catches it,
  writes an error description to stderr and exits with status 1.
- "Alike" components means the same item type exactly.
- The block premium requires exactly 3 alike components.
- The first-insurance surcharge is 10% of the policy base premium and
  applies to every quote, regardless of customer history.
- The follow-up discount is 15% of the policy base premium and applies
  to every quote after the customer's first quote in the scenario.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim import claim_against_cap, claim_payout, policy_cap
from quote import insurance_sum, quote_premium


# --- Quote: processing fee and empty policy -------------------------------


def test_empty_item_list_costs_only_the_processing_fee():
    assert quote_premium([]) == 5


# --- Quote: base premiums per main item type ------------------------------


def test_sword_has_base_premium_of_100_g():
    assert quote_premium([{"type": "sword"}]) == 115


def test_amulet_has_base_premium_of_60_g():
    assert quote_premium([{"type": "amulet"}]) == 71


def test_staff_has_base_premium_of_80_g():
    assert quote_premium([{"type": "staff"}]) == 93


def test_potion_has_base_premium_of_40_g():
    assert quote_premium([{"type": "potion"}]) == 49


def test_rune_has_base_premium_of_25_g():
    assert quote_premium([{"type": "rune"}]) == 33


def test_moonstone_has_base_premium_of_25_g():
    assert quote_premium([{"type": "moonstone"}]) == 33


def test_policy_base_premium_is_the_sum_of_the_item_base_premiums():
    assert quote_premium([{"type": "sword"}, {"type": "amulet"}]) == 181


# --- Quote: component building block --------------------------------------


def test_two_runes_cost_50_g_base_premium():
    assert quote_premium([{"type": "rune"}, {"type": "rune"}]) == 60


def test_three_alike_runes_form_a_block_of_60_g():
    assert quote_premium([{"type": "rune"}] * 3) == 71


def test_four_runes_cost_100_g_because_the_block_requires_exactly_three():
    assert quote_premium([{"type": "rune"}] * 4) == 115


def test_seven_runes_cost_175_g_base_premium():
    assert quote_premium([{"type": "rune"}] * 7) == 198


def test_two_runes_and_one_moonstone_do_not_form_a_block():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert quote_premium(items) == 88


def test_three_runes_and_three_moonstones_form_two_separate_blocks():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert quote_premium(items) == 137


# --- Quote: item-specific modifiers ---------------------------------------


def test_cursed_item_adds_a_50_percent_risk_surcharge():
    assert quote_premium([{"type": "sword", "cursed": True}]) == 165


def test_enchantment_of_exactly_5_adds_the_high_enchantment_surcharge():
    assert quote_premium([{"type": "sword", "enchantment": 5}]) == 145


def test_enchantment_of_4_adds_no_high_enchantment_surcharge():
    assert quote_premium([{"type": "sword", "enchantment": 4}]) == 115


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    item = {"type": "sword", "enchantment": 5, "cursed": True}
    assert quote_premium([item]) == 195


def test_item_surcharges_apply_to_the_affected_item_not_the_policy_total():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    assert quote_premium(items) == 231


# --- Quote: policy-wide modifiers -----------------------------------------


def test_exactly_two_years_with_mhpco_grants_the_loyalty_discount():
    customer = {"yearsWithMHPCO": 2}
    assert quote_premium([{"type": "sword"}], customer) == 95


def test_one_year_with_mhpco_grants_no_loyalty_discount():
    customer = {"yearsWithMHPCO": 1}
    assert quote_premium([{"type": "sword"}], customer) == 115


def test_first_insurance_adds_a_10_percent_initial_assessment_surcharge():
    assert quote_premium([{"type": "sword"}]) == 115


def test_second_contract_gets_a_15_percent_follow_up_discount():
    customer = {"yearsWithMHPCO": 0}
    assert quote_premium([{"type": "sword"}], customer, 2) == 100


def test_first_insurance_surcharge_applies_on_every_quote():
    customer = {"yearsWithMHPCO": 3}
    first = quote_premium([{"type": "sword"}], customer, 1)
    follow_up = quote_premium([{"type": "sword"}], customer, 2)
    assert first == 95
    assert follow_up == 80


# --- Quote: rounding ------------------------------------------------------


def test_premium_is_rounded_up_in_the_mhpco_favour():
    """Seven runes come to 197.5 G exactly: 175 base + 17.5 surcharge + 5 fee.

    The half G is not lost along the way and not rounded away early; it is
    the final premium that goes up to whole G, in MHPCO's favour.
    """
    assert quote_premium([{"type": "rune"}] * 7) == 198


# --- Quote: integration examples ------------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165_g():
    customer = {"yearsWithMHPCO": 0}
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert quote_premium([sword], customer, 1) == 165


def test_long_standing_customer_second_contract_pays_160_g():
    customer = {"yearsWithMHPCO": 3}
    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    assert quote_premium([sword], customer, 2) == 160


# --- Quote: rejection -----------------------------------------------------


def test_quote_with_an_unknown_item_type_is_rejected():
    with pytest.raises(ValueError, match="broomstick"):
        quote_premium([{"type": "broomstick"}])


# --- Claim: payout basics -------------------------------------------------


def test_standard_damage_is_reimbursed_in_full_minus_the_deductible():
    sword = {"type": "sword", "material": "steel", "enchantment": 3}
    damages = [{"itemType": "sword", "amount": 500}]
    assert claim_payout([sword], damages) == 400


def test_component_damage_has_no_enchantment_or_material_clause():
    rune = {"type": "rune"}
    damages = [{"itemType": "rune", "amount": 200}]
    assert claim_payout([rune], damages) == 100


def test_damage_below_the_deductible_pays_out_nothing():
    sword = {"type": "sword", "material": "steel", "enchantment": 3}
    damages = [{"itemType": "sword", "amount": 50}]
    assert claim_payout([sword], damages) == 0


# --- Claim: special clauses -----------------------------------------------


def test_high_enchantment_damage_is_reimbursed_at_50_percent():
    sword = {"type": "sword", "material": "steel", "enchantment": 9}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 400


def test_enchantment_below_8_does_not_trigger_the_half_reimbursement():
    sword = {"type": "sword", "material": "steel", "enchantment": 7}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 900


def test_dragon_material_damage_is_fully_reimbursed():
    sword = {"type": "sword", "material": "dragon", "enchantment": 5}
    damages = [{"itemType": "sword", "amount": 800}]
    assert claim_payout([sword], damages) == 700


def test_enchantment_of_exactly_8_triggers_the_half_reimbursement_over_dragon():
    sword = {"type": "sword", "material": "dragon", "enchantment": 8}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 400


def test_high_enchantment_beats_dragon_material():
    sword = {"type": "sword", "material": "dragon", "enchantment": 9}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 400


# --- Claim: deductible per damage event -----------------------------------


def test_the_deductible_applies_once_per_damaged_item():
    items = [{"type": "sword"}, {"type": "amulet"}]
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "amulet", "amount": 300},
    ]
    assert claim_payout(items, damages) == 600


# --- Claim: cap -----------------------------------------------------------


def test_insurance_sum_is_the_sum_of_the_item_insurance_values():
    assert insurance_sum([{"type": "sword"}, {"type": "amulet"}]) == 1600


def test_premium_modifiers_do_not_raise_the_cap():
    cursed_sword = {"type": "sword", "cursed": True}
    assert quote_premium([cursed_sword]) == 165
    assert insurance_sum([cursed_sword]) == 1000


def test_the_component_block_does_not_reduce_the_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    assert insurance_sum(items) == 1750


def test_successive_claims_exhaust_the_cap():
    items = [{"type": "sword"}]
    damages = [{"itemType": "sword", "amount": 1500}]
    cap = policy_cap(items)

    payout, remaining = claim_against_cap(items, damages, cap)
    assert (payout, remaining) == (1400, 600)

    payout, remaining = claim_against_cap(items, damages, remaining)
    assert (payout, remaining) == (600, 0)


# --- Claim: rounding ------------------------------------------------------


def test_payout_is_rounded_down_in_the_mhpco_favour():
    sword = {"type": "sword", "material": "steel", "enchantment": 9}
    damages = [{"itemType": "sword", "amount": 901}]
    assert claim_payout([sword], damages) == 350


# --- Claim: multiple items of the same type -------------------------------


def test_two_swords_double_the_insurance_sum():
    items = [{"type": "sword"}, {"type": "sword"}]
    assert insurance_sum(items) == 2000
    assert policy_cap(items) == 4000


def test_two_damage_entries_of_the_same_type_each_get_a_deductible():
    items = [{"type": "sword"}, {"type": "sword"}]
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 400},
    ]
    assert claim_payout(items, damages) == 700


def test_more_damage_entries_than_insured_items_is_rejected():
    items = [{"type": "sword"}]
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 400},
    ]
    with pytest.raises(ValueError, match="sword"):
        claim_payout(items, damages)


# --- Claim: rejection -----------------------------------------------------


def test_damage_to_an_item_outside_the_policy_is_rejected():
    items = [{"type": "sword"}]
    damages = [{"itemType": "amulet", "amount": 300}]
    with pytest.raises(ValueError, match="amulet"):
        claim_payout(items, damages)


def test_damage_with_an_unknown_item_type_is_rejected():
    items = [{"type": "sword"}]
    damages = [{"itemType": "broomstick", "amount": 300}]
    with pytest.raises(ValueError, match="broomstick"):
        claim_payout(items, damages)


def test_negative_damage_amount_is_rejected():
    items = [{"type": "sword"}]
    damages = [{"itemType": "sword", "amount": -200}]
    with pytest.raises(ValueError, match="-200"):
        claim_payout(items, damages)


# --- CLI ------------------------------------------------------------------


CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    """Run the claim-office CLI on a scenario and return its completed process."""
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


def test_cli_returns_one_result_per_step_in_order():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "cursed": True}]},
            {"op": "quote", "items": [{"type": "amulet"}]},
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    assert json.loads(result.stdout) == {"results": [{"premium": 165}, {"premium": 62}]}


def test_cli_rejects_an_unknown_item_type_without_writing_results():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stdout == ""
    assert "broomstick" in result.stderr


def test_cli_rejects_an_invalid_claim_without_writing_results():
    scenario = {
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
    }
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stdout == ""
    assert "amulet" in result.stderr


def test_claim_step_refers_to_the_policy_by_step_index():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {
                        "type": "amulet",
                        "material": "silver",
                        "enchantment": 2,
                        "cursed": False,
                    }
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}],
                },
            },
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}],
    }
