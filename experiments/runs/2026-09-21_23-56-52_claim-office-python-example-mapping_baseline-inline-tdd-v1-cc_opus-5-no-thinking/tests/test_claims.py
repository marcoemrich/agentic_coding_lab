"""Claim processing: reimbursement clauses, deductible and the policy cap."""
import pytest

from errors import ClaimOfficeError
from policy import Policy


def policy_of(*items):
    return Policy([dict(item) for item in items])


SWORD = {"type": "sword", "material": "steel", "enchantment": 3}


def damage(item_type, amount):
    return {"itemType": item_type, "amount": amount}


def test_insurance_sum_and_cap_are_derived_from_the_item_values():
    policy = policy_of({"type": "sword"}, {"type": "amulet"})
    assert policy.insurance_sum == 1600
    assert policy.remaining_cap == 3200


def test_the_block_discount_does_not_change_the_insurance_sum():
    policy = policy_of({"type": "sword"}, *[{"type": "rune"}] * 3)
    assert policy.insurance_sum == 1750


def test_standard_reimbursement_is_the_damage_minus_the_deductible():
    assert policy_of(SWORD).settle([damage("sword", 500)]) == 400


def test_a_component_has_no_special_clause():
    assert policy_of({"type": "rune"}).settle([damage("rune", 200)]) == 100


def test_high_enchantment_halves_the_damage_before_the_deductible():
    item = {"type": "sword", "material": "steel", "enchantment": 9}
    assert policy_of(item).settle([damage("sword", 1000)]) == 400


def test_dragon_material_is_fully_reimbursed():
    item = {"type": "sword", "material": "dragon", "enchantment": 5}
    assert policy_of(item).settle([damage("sword", 800)]) == 700


def test_the_high_enchantment_clause_wins_over_dragon_material():
    item = {"type": "sword", "material": "dragon", "enchantment": 9}
    assert policy_of(item).settle([damage("sword", 1000)]) == 400


def test_enchantment_eight_already_triggers_the_halving_clause():
    item = {"type": "sword", "material": "dragon", "enchantment": 8}
    assert policy_of(item).settle([damage("sword", 1000)]) == 400


def test_the_deductible_applies_once_per_damaged_item():
    policy = policy_of(SWORD, {"type": "amulet"})
    payout = policy.settle([damage("sword", 500), damage("amulet", 300)])
    assert payout == 600


def test_damage_below_the_deductible_pays_nothing():
    assert policy_of(SWORD).settle([damage("sword", 80)]) == 0


def test_two_swords_double_the_insurance_sum_and_the_cap():
    policy = policy_of(SWORD, SWORD)
    assert policy.insurance_sum == 2000
    assert policy.remaining_cap == 4000


def test_each_damage_entry_carries_its_own_deductible():
    policy = policy_of(SWORD, SWORD)
    payout = policy.settle([damage("sword", 500), damage("sword", 500)])
    assert payout == 800


def test_more_damages_of_a_type_than_insured_items_is_rejected():
    policy = policy_of(SWORD)
    with pytest.raises(ClaimOfficeError):
        policy.settle([damage("sword", 500), damage("sword", 500)])


def test_a_damage_to_an_uninsured_item_is_rejected():
    with pytest.raises(ClaimOfficeError):
        policy_of(SWORD).settle([damage("amulet", 300)])


def test_a_damage_to_an_unknown_item_type_is_rejected():
    with pytest.raises(ClaimOfficeError):
        policy_of(SWORD).settle([damage("broomstick", 300)])


def test_a_negative_damage_amount_is_rejected():
    with pytest.raises(ClaimOfficeError):
        policy_of(SWORD).settle([damage("sword", -200)])


def test_the_cap_is_consumed_across_successive_claims():
    policy = policy_of({"type": "sword"})
    assert policy.settle([damage("sword", 1500)]) == 1400
    assert policy.remaining_cap == 600
    assert policy.settle([damage("sword", 1500)]) == 600
    assert policy.remaining_cap == 0


def test_the_payout_is_rounded_down_in_the_offices_favour():
    item = {"type": "sword", "material": "steel", "enchantment": 9}
    # 901 / 2 = 450.5 -> 450, minus the 100 G deductible
    assert policy_of(item).settle([damage("sword", 901)]) == 350


def test_premium_modifiers_do_not_raise_the_cap():
    policy = policy_of({"type": "sword", "cursed": True})
    assert policy.remaining_cap == 2000
