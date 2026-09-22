from fractions import Fraction

from premium import item_surcharges


def test_plain_item_has_no_surcharge():
    assert item_surcharges({"type": "sword"}, Fraction(100)) == Fraction(0)


def test_cursed_item_adds_fifty_percent_of_its_base_premium():
    assert item_surcharges({"type": "sword", "cursed": True}, Fraction(100)) == Fraction(50)


def test_enchantment_five_adds_thirty_percent():
    assert item_surcharges({"type": "sword", "enchantment": 5}, Fraction(100)) == Fraction(30)


def test_enchantment_four_adds_nothing():
    assert item_surcharges({"type": "sword", "enchantment": 4}, Fraction(100)) == Fraction(0)


def test_cursed_and_highly_enchanted_stack():
    item = {"type": "sword", "enchantment": 5, "cursed": True}
    assert item_surcharges(item, Fraction(100)) == Fraction(80)


def test_surcharge_is_relative_to_the_items_own_base_premium():
    assert item_surcharges({"type": "amulet", "cursed": True}, Fraction(60)) == Fraction(30)
