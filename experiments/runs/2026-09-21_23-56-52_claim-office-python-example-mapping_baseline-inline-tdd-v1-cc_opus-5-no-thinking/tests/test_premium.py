import pytest

from office import quote_premium
from errors import ClaimOfficeError


def premium(items, years=0, contract_index=0):
    return quote_premium(items, years_with_mhpco=years, contract_index=contract_index)


def test_empty_item_list_costs_only_the_processing_fee():
    assert premium([]) == 5


@pytest.mark.parametrize(
    ("item_type", "expected"),
    [("sword", 115), ("amulet", 71), ("staff", 93), ("potion", 49)],
)
def test_main_item_base_premium_plus_first_insurance_and_fee(item_type, expected):
    # base + 10% first insurance + 5 G fee, rounded up
    assert premium([{"type": item_type}]) == expected


def test_unknown_item_type_is_rejected():
    with pytest.raises(ClaimOfficeError):
        premium([{"type": "broomstick"}])


def test_curse_surcharge_applies_to_the_cursed_items_base_premium_only():
    # 100 + 60 base, + 50 curse, + 10% first insurance of 160, + 5 fee
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    assert premium(items) == 210 + 16 + 5


def test_high_enchantment_surcharge_applies_from_level_five():
    assert premium([{"type": "sword", "enchantment": 5}]) == 130 + 10 + 5


def test_enchantment_four_carries_no_surcharge():
    assert premium([{"type": "sword", "enchantment": 4}]) == 100 + 10 + 5


def test_curse_and_high_enchantment_stack():
    item = {"type": "sword", "enchantment": 5, "cursed": True}
    assert premium([item]) == 180 + 10 + 5


def test_loyalty_discount_applies_from_two_years():
    assert premium([{"type": "sword"}], years=2) == 100 - 20 + 10 + 5


def test_one_year_earns_no_loyalty_discount():
    assert premium([{"type": "sword"}], years=1) == 100 + 10 + 5


def test_follow_up_contracts_receive_a_discount():
    assert premium([{"type": "sword"}], contract_index=1) == 100 + 10 - 15 + 5


def test_newcomer_with_a_cursed_sword():
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert premium([item], years=0, contract_index=0) == 165


def test_long_standing_customers_second_contract():
    item = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    assert premium([item], years=3, contract_index=1) == 160


def test_premium_is_rounded_up_in_the_offices_favour():
    # 3 runes block = 60 base; 60 * 1.1 = 66; add a potion: (60+40)*1.1 = 110
    # pick a case with a genuine fraction: one rune -> 25 * 1.1 = 27.5 -> 28
    assert premium([{"type": "rune"}]) == 28 + 5


def test_cursed_sword_premium_with_modifiers_is_one_hundred_sixty_five():
    # the cap example's premium: 100 base + 50 curse + 10 first insurance + 5 fee
    assert premium([{"type": "sword", "cursed": True}]) == 165
