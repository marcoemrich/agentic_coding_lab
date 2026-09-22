"""Test list for the MHPCO Claim Office kata.

Observable error contract adopted for rejection cases: the specification says
"the CLI exits with a non-zero status code and writes an error description to
stderr". The most defensible reading is that the domain raises an error and the
CLI adapter translates it into exit status and stderr. Domain-level tests assert
that a ``ClaimOfficeError`` is raised; the CLI-level tests assert the exit code,
the stderr description, and the absence of ``results`` on stdout.
"""

import pytest

from claim_office import quote


# --- Base premiums per item type (price list) ---


def test_empty_item_list_yields_only_the_processing_fee():
    """Quote with no items costs 5 G."""
    assert quote(items=[]) == 5


def test_plain_sword_uses_its_base_premium():
    """Sword base premium 100 G; with first-insurance surcharge and fee -> 115 G."""
    assert quote(items=[{"type": "sword"}]) == 115


def test_plain_amulet_uses_its_base_premium():
    """Amulet base premium 60 G; +10% first insurance (6) + 5 fee -> 71 G."""
    assert quote(items=[{"type": "amulet"}]) == 71


def test_plain_staff_uses_its_base_premium():
    """Staff base premium 80 G; +10% first insurance (8) + 5 fee -> 93 G."""
    assert quote(items=[{"type": "staff"}]) == 93


@pytest.mark.skip(reason="TODO: plain potion -> base premium 40 G, premium 49 G")
def test_plain_potion_uses_its_base_premium():
    """Potion base premium 40 G; +10% first insurance (4) + 5 fee -> 49 G."""


@pytest.mark.skip(reason="TODO: single rune -> base premium 25 G, premium 33 G")
def test_single_rune_uses_the_component_base_premium():
    """Rune base premium 25 G; +10% first insurance (2.5) + 5 fee -> 32.5 -> 33 G."""


@pytest.mark.skip(reason="TODO: single moonstone -> base premium 25 G, premium 33 G")
def test_single_moonstone_uses_the_component_base_premium():
    """Moonstone base premium 25 G, same component price list entry as the rune."""


# --- Building block of 3 alike components ---


@pytest.mark.skip(reason="TODO: 2 runes -> base premium 50 G")
def test_two_runes_cost_two_single_component_premiums():
    """2 runes -> 50 G base premium (no block)."""


@pytest.mark.skip(reason="TODO: 3 runes -> base premium 60 G (block applies)")
def test_three_runes_form_a_building_block():
    """3 runes -> 60 G base premium instead of 75 G."""


@pytest.mark.skip(reason="TODO: 4 runes -> base premium 100 G (no block)")
def test_four_runes_get_no_block_because_the_block_requires_exactly_three():
    """4 runes -> 100 G base premium."""


@pytest.mark.skip(reason="TODO: 7 runes -> base premium 175 G")
def test_seven_runes_get_no_block():
    """7 runes -> 175 G base premium."""


@pytest.mark.skip(reason="TODO: 2 runes + 1 moonstone -> base premium 75 G")
def test_mixed_component_types_do_not_form_a_block():
    """"Alike" means the same type: 2 runes + 1 moonstone -> 75 G base premium."""


@pytest.mark.skip(reason="TODO: 3 runes + 3 moonstones -> base premium 120 G")
def test_two_separate_blocks_of_different_component_types():
    """3 runes + 3 moonstones -> 60 + 60 = 120 G base premium."""


# --- Item-specific premium modifiers ---


@pytest.mark.skip(reason="TODO: cursed sword adds 50 G (50% of 100 G)")
def test_cursed_item_adds_a_fifty_percent_risk_surcharge():
    """Cursed sword: 100 + 50 curse + 10 first insurance + 5 fee = 165 G."""


@pytest.mark.skip(reason="TODO: enchantment 5 sword adds 30 G (30% of 100 G)")
def test_highly_enchanted_item_adds_a_thirty_percent_risk_surcharge_at_level_five():
    """Enchantment exactly 5 triggers the surcharge: 100 + 30 + 10 + 5 = 145 G."""


@pytest.mark.skip(reason="TODO: enchantment 4 sword adds no high-enchantment surcharge")
def test_enchantment_four_is_below_the_high_enchantment_threshold():
    """Enchantment 4, not cursed: 100 + 10 first insurance + 5 fee = 115 G."""


@pytest.mark.skip(reason="TODO: cursed sword with enchantment 5 gets both surcharges")
def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    """100 + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195 G."""


@pytest.mark.skip(
    reason="TODO: item modifiers apply per item, not to the policy total -> 210 G before policy modifiers"
)
def test_item_modifiers_apply_only_to_the_affected_items_base_premium():
    """Cursed sword + plain amulet: base 160 G, curse adds 50 G (50% of 100 G)."""


# --- Policy-wide premium modifiers ---


@pytest.mark.skip(reason="TODO: 2 years with MHPCO -> 20% loyalty discount applies")
def test_loyalty_discount_applies_at_exactly_two_years():
    """Sword, 2 years: 100 - 20 loyalty + 10 first insurance + 5 fee = 95 G."""


@pytest.mark.skip(reason="TODO: 1 year with MHPCO -> no loyalty discount")
def test_loyalty_discount_does_not_apply_below_two_years():
    """Sword, 1 year: 100 + 10 first insurance + 5 fee = 115 G."""


@pytest.mark.skip(reason="TODO: second quote in the scenario gets a 15% follow-up discount")
def test_follow_up_contract_discount_applies_to_every_contract_after_the_first():
    """Second quote of a plain sword: 100 + 10 first insurance - 15 follow-up + 5 = 100 G."""


@pytest.mark.skip(reason="TODO: first insurance surcharge applies to every quote")
def test_first_insurance_surcharge_applies_to_each_quote_regardless_of_history():
    """A 3-year customer's second quote still carries the 10% first-insurance surcharge."""


@pytest.mark.skip(reason="TODO: policy-wide modifiers use the policy base premium")
def test_policy_wide_modifiers_apply_to_the_summed_policy_base_premium():
    """Sword + amulet (base 160 G) for a 2-year customer: loyalty is 32 G, not 20 G."""


# --- Rounding ---


@pytest.mark.skip(reason="TODO: premium 197.5 G -> 198 G (rounded up, MHPCO's favor)")
def test_premium_is_rounded_up_to_whole_gold():
    """A fractional premium is rounded up."""


@pytest.mark.skip(reason="TODO: only the final premium is rounded, not intermediates")
def test_intermediate_premium_amounts_stay_fractional():
    """Fractional intermediate amounts are not rounded before the final premium."""


# --- Integration examples ---


@pytest.mark.skip(reason="TODO: newcomer with a cursed sword -> premium 165 G")
def test_newcomer_with_a_cursed_sword_pays_165():
    """0 years, cursed steel sword enchantment 3 -> 165 G."""


@pytest.mark.skip(reason="TODO: long-standing customer's second contract -> premium 160 G")
def test_long_standing_customers_second_contract_pays_160():
    """3 years, second quote, cursed steel sword enchantment 7 -> 160 G."""


# --- Insurance sum and cap ---


@pytest.mark.skip(reason="TODO: sword + amulet -> insurance sum 1600 G, cap 3200 G")
def test_insurance_sum_is_the_sum_of_item_insurance_values():
    """Sword 1000 + amulet 600 = 1600 G; cap 3200 G."""


@pytest.mark.skip(reason="TODO: two swords -> insurance sum 2000 G, cap 4000 G")
def test_two_items_of_the_same_type_both_count_towards_the_insurance_sum():
    """Two swords: insurance sum 2000 G, cap 4000 G."""


@pytest.mark.skip(reason="TODO: sword + 3 runes -> insurance sum 1750 G (block affects premium only)")
def test_component_block_discount_does_not_reduce_the_insurance_sum():
    """Sword 1000 + 3x250 = 1750 G insurance sum."""


@pytest.mark.skip(reason="TODO: cursed sword -> cap 2000 G from the unmodified insurance value")
def test_premium_modifiers_do_not_raise_the_cap():
    """Cursed sword (premium 165 G): insurance sum 1000 G, cap 2000 G."""


# --- Claim processing: deductible and standard reimbursement ---


@pytest.mark.skip(reason="TODO: steel sword enchantment 3, damage 500 -> payout 400 G")
def test_standard_damage_is_fully_reimbursed_minus_the_deductible():
    """No special clause: 500 - 100 = 400 G."""


@pytest.mark.skip(reason="TODO: rune damage 200 -> payout 100 G")
def test_component_damage_has_no_special_clause():
    """Runes have no enchantment level or material: 200 - 100 = 100 G."""


@pytest.mark.skip(reason="TODO: sword 500 + amulet 300 -> payout 600 G (deductible per item)")
def test_the_deductible_applies_once_per_damaged_item():
    """(500 - 100) + (300 - 100) = 600 G."""


@pytest.mark.skip(reason="TODO: two sword damages in one incident each carry a deductible")
def test_each_damage_entry_of_the_same_item_type_carries_its_own_deductible():
    """Two swords insured, two sword damage entries -> two separate deductibles."""


# --- Claim processing: special clauses ---


@pytest.mark.skip(reason="TODO: steel sword enchantment 9, damage 1000 -> payout 400 G")
def test_high_enchantment_damage_is_reimbursed_at_fifty_percent():
    """1000 * 50% = 500, then deductible -> 400 G."""


@pytest.mark.skip(reason="TODO: steel sword enchantment 8, damage 1000 -> payout 400 G")
def test_high_enchantment_clause_applies_at_exactly_level_eight():
    """Threshold is >= 8."""


@pytest.mark.skip(reason="TODO: dragon sword enchantment 5, damage 800 -> payout 700 G")
def test_dragon_material_damage_is_fully_reimbursed():
    """Only the dragon clause applies: 800 - 100 = 700 G."""


@pytest.mark.skip(reason="TODO: dragon sword enchantment 9, damage 1000 -> payout 400 G")
def test_high_enchantment_clause_wins_over_dragon_material():
    """Both clauses apply, the 50% rule wins: 500 - 100 = 400 G."""


@pytest.mark.skip(reason="TODO: dragon sword enchantment 8, damage 1000 -> payout 400 G")
def test_high_enchantment_clause_wins_at_exactly_level_eight_on_dragon_material():
    """Threshold example from the spec: 400 G."""


# --- Claim processing: cap ---


@pytest.mark.skip(reason="TODO: first claim 1500 -> payout 1400 G, remainingCap 600 G")
def test_a_claim_reduces_the_remaining_cap():
    """Sword, cap 2000: 1500 - 100 = 1400 payout, 600 G cap remaining."""


@pytest.mark.skip(reason="TODO: second claim 1500 -> payout 600 G, remainingCap 0 G")
def test_a_payout_is_limited_to_the_remaining_cap():
    """Desired 1400 G is reduced to the remaining 600 G; cap remaining 0 G."""


@pytest.mark.skip(reason="TODO: payout 350.5 G -> 350 G (rounded down, MHPCO's favor)")
def test_payout_is_rounded_down_to_whole_gold():
    """A fractional payout is rounded down."""


# --- Rejections ---


@pytest.mark.skip(reason="TODO: unknown item type in a quote raises ClaimOfficeError")
def test_quote_with_an_unknown_item_type_is_rejected():
    """{"type": "broomstick"} is not in the price list."""


@pytest.mark.skip(reason="TODO: damage to an item not in the policy raises ClaimOfficeError")
def test_claim_for_an_item_not_covered_by_the_policy_is_rejected():
    """Amulet damaged while only a sword is insured."""


@pytest.mark.skip(reason="TODO: damage with an unknown item type raises ClaimOfficeError")
def test_claim_for_an_unknown_item_type_is_rejected():
    """An unknown itemType is never part of the policy."""


@pytest.mark.skip(reason="TODO: more damage entries of a type than insured raises ClaimOfficeError")
def test_claim_with_more_damages_of_a_type_than_insured_is_rejected():
    """Two sword damages but only one sword insured -> the whole claim is rejected."""


@pytest.mark.skip(reason="TODO: negative damage amount raises ClaimOfficeError")
def test_claim_with_a_negative_damage_amount_is_rejected():
    """amount: -200 is rejected."""


# --- CLI adapter ---


@pytest.mark.skip(reason="TODO: CLI reads the scenario from stdin and writes results to stdout")
def test_cli_writes_one_result_per_step_in_order():
    """Schema example: quote then claim -> {"results": [{premium}, {payout, remainingCap}]}."""


@pytest.mark.skip(reason="TODO: CLI exits 0 and writes only the results JSON on success")
def test_cli_exits_zero_and_emits_no_extra_stdout():
    """Stdout is exactly one JSON document."""


@pytest.mark.skip(reason="TODO: CLI exits non-zero with stderr and no results on a rejected scenario")
def test_cli_rejects_an_invalid_scenario_with_a_non_zero_exit_and_stderr():
    """Unknown item type: non-zero exit, error description on stderr, no results on stdout."""
