"""Inactive test list for the MHPCO Claim Office kata.

Every behavior from prompt.md is represented here as an inactive pytest test.
Exactly one behavior is activated per Predictive TDD cycle by removing its
``@pytest.mark.skip`` marker.

Observable contract for rejection cases: the specification says the CLI "exits
with a non-zero status code and writes an error description to stderr". The
reading adopted here is that the domain layer raises a ``ValueError`` (Python's
representative type for an invalid argument value) and the CLI adapter
translates that into exit status 1 plus a stderr description with an empty
stdout.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim_office import Policy, claim_payout, insurance_sum, payout_cap, quote_premium


# --- Premium: processing fee and single main items -------------------------


def test_quote_for_empty_item_list_is_only_the_processing_fee():
    assert quote_premium([]) == 5


def test_quote_for_a_plain_sword_uses_the_sword_base_premium():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote_premium([sword]) == 115


def test_quote_for_a_plain_amulet_uses_the_amulet_base_premium():
    amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    assert quote_premium([amulet]) == 71


def test_quote_for_a_plain_staff_uses_the_staff_base_premium():
    staff = {"type": "staff", "material": "oak", "enchantment": 1, "cursed": False}
    assert quote_premium([staff]) == 93


def test_quote_for_a_plain_potion_uses_the_potion_base_premium():
    potion = {"type": "potion", "material": "glass", "enchantment": 0, "cursed": False}
    assert quote_premium([potion]) == 49


def test_quote_for_a_single_rune_uses_the_component_base_premium():
    assert quote_premium([{"type": "rune"}]) == 33


def test_quote_for_a_single_moonstone_uses_the_component_base_premium():
    assert quote_premium([{"type": "moonstone"}]) == 33


def test_quote_with_an_unknown_item_type_is_rejected():
    with pytest.raises(ValueError):
        quote_premium([{"type": "broomstick"}])


# --- Premium: component building blocks ------------------------------------


def test_two_runes_have_a_base_premium_of_fifty():
    two_runes = [{"type": "rune"}, {"type": "rune"}]
    assert quote_premium(two_runes) == 60  # 50 base + 5 first insurance + 5 fee


def test_three_runes_form_a_block_with_base_premium_sixty():
    three_runes = [{"type": "rune"}, {"type": "rune"}, {"type": "rune"}]
    assert quote_premium(three_runes) == 71  # 60 block base + 6 first insurance + 5 fee


def test_four_runes_do_not_form_a_block():
    four_runes = [{"type": "rune"}] * 4
    assert quote_premium(four_runes) == 115  # 100 base + 10 first insurance + 5 fee


def test_seven_runes_do_not_form_a_block():
    seven_runes = [{"type": "rune"}] * 7
    assert quote_premium(seven_runes) == 198  # 175 base + 17.5 first insurance + 5 fee = 197.5


def test_mixed_component_types_do_not_form_a_block():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert quote_premium(items) == 88  # 75 base + 7.5 first insurance + 5 fee = 87.5


def test_two_separate_component_blocks_each_get_the_block_premium():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert quote_premium(items) == 137  # 120 base + 12 first insurance + 5 fee


# --- Premium: item modifiers ------------------------------------------------


def test_a_cursed_item_adds_a_fifty_percent_risk_surcharge():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    # 100 base + 50 curse + 10 first insurance + 5 fee
    assert quote_premium([cursed_sword]) == 165


def test_enchantment_of_exactly_five_adds_the_high_enchantment_surcharge():
    sword = {"type": "sword", "material": "steel", "enchantment": 5, "cursed": False}
    # 100 base + 30 high enchantment + 10 first insurance + 5 fee
    assert quote_premium([sword]) == 145


def test_enchantment_of_four_adds_no_high_enchantment_surcharge():
    sword = {"type": "sword", "material": "steel", "enchantment": 4, "cursed": False}
    assert quote_premium([sword]) == 115  # 100 base + 10 first insurance + 5 fee


def test_curse_and_high_enchantment_surcharges_both_apply():
    sword = {"type": "sword", "material": "steel", "enchantment": 5, "cursed": True}
    # 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
    assert quote_premium([sword]) == 195


def test_item_modifiers_apply_to_the_affected_item_not_the_policy_total():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    plain_amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    # 160 base + 50 curse (of the sword's 100 only) = 210, + 16 first insurance + 5 fee
    assert quote_premium([cursed_sword, plain_amulet]) == 231


# --- Premium: policy-wide modifiers ----------------------------------------


def test_exactly_two_years_with_mhpco_grants_the_loyalty_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    # 100 base - 20 loyalty + 10 first insurance + 5 fee
    assert quote_premium([sword], {"yearsWithMHPCO": 2}) == 95


def test_one_year_with_mhpco_grants_no_loyalty_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote_premium([sword], {"yearsWithMHPCO": 1}) == 115


def test_first_insurance_surcharge_applies_to_every_quoted_item():
    swords = [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}] * 2
    # every item is treated as a first insurance, even for a long-standing customer:
    # 200 base - 40 loyalty + 20 first insurance + 5 fee
    assert quote_premium(swords, {"yearsWithMHPCO": 5}) == 185


def test_second_contract_receives_the_follow_up_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    # 100 base + 10 first insurance - 15 follow-up contract + 5 fee
    assert quote_premium([sword], {"yearsWithMHPCO": 0}, previous_contracts=1) == 100


def test_every_contract_after_the_first_receives_the_follow_up_discount():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    assert quote_premium([sword], {"yearsWithMHPCO": 0}, previous_contracts=2) == 100


# --- Premium: rounding ------------------------------------------------------


def test_a_fractional_premium_is_rounded_up():
    seven_runes = [{"type": "rune"}] * 7
    # 175 base + 17.5 first insurance + 5 fee = 197.5, rounded in the MHPCO's favor
    assert quote_premium(seven_runes) == 198


# --- Premium: integration examples -----------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    # 100 base + 50 curse + 10 first insurance = 160, + 5 fee
    assert quote_premium([cursed_sword], {"yearsWithMHPCO": 0}, previous_contracts=0) == 165


def test_long_standing_customers_second_contract_pays_160():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    # 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance
    # - 15 follow-up contract = 155, + 5 fee
    assert quote_premium([cursed_sword], {"yearsWithMHPCO": 3}, previous_contracts=1) == 160


# --- Claims: insurance sum and cap -----------------------------------------


def test_insurance_sum_is_the_sum_of_the_items_insurance_values():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    assert insurance_sum([sword, amulet]) == 1600  # 1000 + 600


def test_two_swords_double_the_insurance_sum():
    swords = [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}] * 2
    assert insurance_sum(swords) == 2000


def test_a_staff_is_insured_at_its_price_list_value():
    staff = {"type": "staff", "material": "oak", "enchantment": 1, "cursed": False}
    assert insurance_sum([staff]) == 800


def test_a_potion_is_insured_at_its_price_list_value():
    potion = {"type": "potion", "material": "glass", "enchantment": 0, "cursed": False}
    assert insurance_sum([potion]) == 400


def test_a_moonstone_is_insured_like_any_other_component():
    assert insurance_sum([{"type": "moonstone"}]) == 250


def test_component_block_discount_does_not_lower_the_insurance_sum():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    items = [sword] + [{"type": "rune"}] * 3
    assert insurance_sum(items) == 1750  # 1000 + 3 x 250, despite the block premium


def test_premium_modifiers_do_not_raise_the_cap():
    cursed_sword = {"type": "sword", "material": "steel", "enchantment": 9, "cursed": True}
    assert payout_cap([cursed_sword]) == 2000  # twice the unmodified 1000 G insurance value


# --- Claims: reimbursement clauses -----------------------------------------


def test_standard_damage_is_fully_reimbursed_minus_the_deductible():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    damages = [{"itemType": "sword", "amount": 500}]
    assert claim_payout([sword], damages) == 400  # 500 - 100 deductible


def test_damage_to_a_component_has_no_special_clause():
    rune = {"type": "rune"}
    damages = [{"itemType": "rune", "amount": 200}]
    assert claim_payout([rune], damages) == 100  # 200 - 100 deductible


def test_high_enchantment_damage_is_reimbursed_at_fifty_percent():
    sword = {"type": "sword", "material": "steel", "enchantment": 9, "cursed": False}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 400  # 50 % of 1000, then 100 deductible


def test_enchantment_of_exactly_eight_triggers_the_fifty_percent_clause():
    sword = {"type": "sword", "material": "steel", "enchantment": 8, "cursed": False}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 400


def test_enchantment_of_seven_does_not_trigger_the_fifty_percent_clause():
    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": False}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 900  # full reimbursement - 100 deductible


def test_dragon_material_damage_is_fully_reimbursed():
    sword = {"type": "sword", "material": "dragon", "enchantment": 5, "cursed": False}
    damages = [{"itemType": "sword", "amount": 800}]
    assert claim_payout([sword], damages) == 700  # full reimbursement - 100 deductible


def test_high_enchantment_wins_over_dragon_material():
    sword = {"type": "sword", "material": "dragon", "enchantment": 9, "cursed": False}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 400  # both clauses apply, the 50 % rule wins


def test_dragon_material_sword_at_enchantment_eight_pays_400():
    sword = {"type": "sword", "material": "dragon", "enchantment": 8, "cursed": False}
    damages = [{"itemType": "sword", "amount": 1000}]
    assert claim_payout([sword], damages) == 400  # 50 % clause applies, then deductible


# --- Claims: deductible per damage event -----------------------------------


def test_the_deductible_applies_once_per_damaged_item():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    assert claim_payout([sword, amulet], damages) == 600  # (500-100) + (300-100)


def test_repeated_item_type_entries_are_separate_damages():
    swords = [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}] * 2
    damages = [{"itemType": "sword", "amount": 500}] * 2
    assert claim_payout(swords, damages) == 800  # (500-100) twice, one deductible each


def test_a_damage_below_the_deductible_pays_nothing():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    damages = [{"itemType": "sword", "amount": 50}]
    assert claim_payout([sword], damages) == 0  # the deductible never becomes a debt


# --- Claims: cap exhaustion and rounding -----------------------------------


def test_first_claim_reduces_the_remaining_cap():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = Policy([sword])
    damages = [{"itemType": "sword", "amount": 1500}]
    assert policy.settle_claim(damages) == 1400  # 1500 - 100 deductible
    assert policy.remaining_cap == 600  # 2000 cap - 1400 paid


def test_a_claim_is_limited_by_the_remaining_cap():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = Policy([sword])
    damages = [{"itemType": "sword", "amount": 1500}]
    policy.settle_claim(damages)  # first claim pays 1400, leaving 600
    assert policy.settle_claim(damages) == 600  # the desired 1400 is cut to the cap
    assert policy.remaining_cap == 0


def test_a_fractional_payout_is_rounded_down():
    sword = {"type": "sword", "material": "steel", "enchantment": 8, "cursed": False}
    policy = Policy([sword])
    damages = [{"itemType": "sword", "amount": 901}]
    # 50 % of 901 = 450.5, less the 100 G deductible = 350.5, rounded in the
    # MHPCO's favor (downwards)
    assert policy.settle_claim(damages) == 350


# --- Claims: rejections -----------------------------------------------------


def test_a_claim_for_an_item_outside_the_policy_is_rejected():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    damages = [{"itemType": "amulet", "amount": 200}]
    with pytest.raises(ValueError):
        Policy([sword]).settle_claim(damages)


def test_a_claim_for_an_unknown_item_type_is_rejected():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    damages = [{"itemType": "broomstick", "amount": 200}]
    with pytest.raises(ValueError):
        Policy([sword]).settle_claim(damages)


def test_more_damage_entries_than_insured_items_of_that_type_are_rejected():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    damages = [{"itemType": "sword", "amount": 200}] * 2
    with pytest.raises(ValueError):
        Policy([sword]).settle_claim(damages)


def test_a_negative_damage_amount_is_rejected():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    damages = [{"itemType": "sword", "amount": -200}]
    with pytest.raises(ValueError):
        Policy([sword]).settle_claim(damages)


# --- CLI adapter ------------------------------------------------------------


CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    """Run the claim-office CLI on ``scenario`` and return its completed process."""
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


def test_cli_writes_a_results_array_for_the_schema_example():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
                ],
            }
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    # 60 base - 12 loyalty + 6 first insurance + 5 fee
    assert json.loads(result.stdout) == {"results": [{"premium": 59}]}


def test_cli_results_mirror_the_steps_in_length_and_order():
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [sword]},
            {"op": "quote", "items": [amulet]},
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    # step 0: 100 + 10 + 5; step 1 is a follow-up contract: 60 - 9 + 6 + 5
    assert json.loads(result.stdout) == {"results": [{"premium": 115}, {"premium": 62}]}


def test_cli_claim_step_refers_to_its_policy_by_step_index():
    amulet = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [amulet]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]},
            },
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    # payout 200 - 100 deductible; cap 2 x 600 = 1200, less the 100 paid
    assert json.loads(result.stdout) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_cli_exits_non_zero_and_writes_stderr_for_an_invalid_scenario():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stdout == ""
    assert "broomstick" in result.stderr
    assert "Traceback" not in result.stderr
