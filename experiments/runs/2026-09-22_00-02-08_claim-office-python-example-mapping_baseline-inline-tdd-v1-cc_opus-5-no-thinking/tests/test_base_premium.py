from fractions import Fraction

import pytest

from premium import policy_base_premium


@pytest.mark.parametrize(
    ("item_type", "expected"),
    [("sword", 100), ("amulet", 60), ("staff", 80), ("potion", 40)],
)
def test_main_item_base_premium(item_type, expected):
    assert policy_base_premium([{"type": item_type}]) == Fraction(expected)


def test_base_premium_of_several_items_is_the_sum():
    assert policy_base_premium([{"type": "sword"}, {"type": "amulet"}]) == Fraction(160)


def runes(count):
    return [{"type": "rune"} for _ in range(count)]


def test_single_component_base_premium():
    assert policy_base_premium(runes(1)) == Fraction(25)


def test_two_runes_do_not_form_a_block():
    assert policy_base_premium(runes(2)) == Fraction(50)


def test_three_alike_components_form_a_block():
    assert policy_base_premium(runes(3)) == Fraction(60)


def test_four_runes_do_not_form_a_block_because_a_block_needs_exactly_three():
    assert policy_base_premium(runes(4)) == Fraction(100)


def test_seven_runes_do_not_form_a_block():
    assert policy_base_premium(runes(7)) == Fraction(175)


def test_components_of_different_types_do_not_form_a_block():
    items = [*runes(2), {"type": "moonstone"}]
    assert policy_base_premium(items) == Fraction(75)


def test_two_separate_blocks_of_different_component_types():
    items = runes(3) + [{"type": "moonstone"} for _ in range(3)]
    assert policy_base_premium(items) == Fraction(120)
