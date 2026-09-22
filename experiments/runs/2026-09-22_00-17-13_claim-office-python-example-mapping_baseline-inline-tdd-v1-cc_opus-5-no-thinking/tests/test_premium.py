import pytest

from premium import quote_premium


def item(type_, **kwargs):
    return {"type": type_, **kwargs}


@pytest.mark.parametrize(
    ("type_", "expected"),
    [("sword", 115), ("amulet", 71), ("staff", 93), ("potion", 49)],
)
def test_base_premium_plus_first_insurance_and_fee(type_, expected):
    assert quote_premium([item(type_)], years=0, contract_index=0) == expected


def test_empty_item_list_is_only_the_processing_fee():
    assert quote_premium([], years=0, contract_index=0) == 5


def sword(**kwargs):
    return {"type": "sword", "material": "steel", "enchantment": 3, **kwargs}


def test_loyalty_discount_applies_at_exactly_two_years():
    # 100 base - 20 loyalty + 10 first insurance + 5 fee
    assert quote_premium([sword()], years=2, contract_index=0) == 95


def test_one_year_is_not_yet_long_standing():
    assert quote_premium([sword()], years=1, contract_index=0) == 115


def test_follow_up_contract_gets_fifteen_percent_discount():
    # 100 base + 10 first insurance - 15 follow-up + 5 fee
    assert quote_premium([sword()], years=0, contract_index=1) == 100


def test_newcomer_with_a_cursed_sword():
    assert quote_premium([sword(cursed=True)], years=0, contract_index=0) == 165


def test_long_standing_customers_second_contract():
    item_ = sword(enchantment=7, cursed=True)
    assert quote_premium([item_], years=3, contract_index=1) == 160


def test_cursed_surcharge_is_scoped_to_the_cursed_item_in_a_multi_item_policy():
    # 160 policy base + 50 curse + 16 first insurance + 5 fee
    policy = [sword(cursed=True), {"type": "amulet"}]
    assert quote_premium(policy, years=0, contract_index=0) == 231
