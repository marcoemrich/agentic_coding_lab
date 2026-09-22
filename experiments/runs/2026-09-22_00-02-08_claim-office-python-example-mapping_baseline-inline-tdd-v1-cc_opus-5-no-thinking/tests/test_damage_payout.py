from fractions import Fraction

from claim import damage_payout

PLAIN_SWORD = {"type": "sword", "material": "steel", "enchantment": 3}
RUNE = {"type": "rune"}


def test_standard_reimbursement_minus_the_deductible():
    assert damage_payout(PLAIN_SWORD, 500) == Fraction(400)


def test_component_without_enchantment_or_material_is_reimbursed_in_full():
    assert damage_payout(RUNE, 200) == Fraction(100)


def test_high_enchantment_halves_the_damage_before_the_deductible():
    sword = {"type": "sword", "material": "steel", "enchantment": 9}
    assert damage_payout(sword, 1000) == Fraction(400)


def test_high_enchantment_threshold_is_eight():
    sword = {"type": "sword", "material": "steel", "enchantment": 7}
    assert damage_payout(sword, 1000) == Fraction(900)


def test_dragon_material_is_fully_reimbursed():
    sword = {"type": "sword", "material": "dragon", "enchantment": 5}
    assert damage_payout(sword, 800) == Fraction(700)


def test_high_enchantment_wins_over_dragon_material():
    sword = {"type": "sword", "material": "dragon", "enchantment": 9}
    assert damage_payout(sword, 1000) == Fraction(400)


def test_high_enchantment_applies_at_exactly_eight_with_dragon_material():
    sword = {"type": "sword", "material": "dragon", "enchantment": 8}
    assert damage_payout(sword, 1000) == Fraction(400)


def test_payout_never_falls_below_zero():
    assert damage_payout(PLAIN_SWORD, 50) == Fraction(0)
