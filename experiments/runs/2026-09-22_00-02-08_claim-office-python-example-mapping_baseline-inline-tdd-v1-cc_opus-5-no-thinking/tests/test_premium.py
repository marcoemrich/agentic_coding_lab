from premium import quote_premium

CUSTOMER_NEW = {"yearsWithMHPCO": 0}


def test_empty_item_list_yields_only_processing_fee():
    assert quote_premium(CUSTOMER_NEW, [], contract_index=0) == 5


def test_newcomer_with_a_cursed_sword():
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert quote_premium(CUSTOMER_NEW, [item], contract_index=0) == 165


def test_long_standing_customers_second_contract():
    customer = {"yearsWithMHPCO": 3}
    item = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    assert quote_premium(customer, [item], contract_index=1) == 160


def test_loyalty_discount_applies_at_exactly_two_years():
    customer = {"yearsWithMHPCO": 2}
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    # 100 base - 20 loyalty + 10 first insurance + 5 fee
    assert quote_premium(customer, [item], contract_index=0) == 95


def test_no_loyalty_discount_below_two_years():
    customer = {"yearsWithMHPCO": 1}
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    # 100 base + 10 first insurance + 5 fee
    assert quote_premium(customer, [item], contract_index=0) == 115


def test_cursed_surcharge_applies_only_to_the_cursed_item_on_a_multi_item_policy():
    items = [
        {"type": "sword", "cursed": True},
        {"type": "amulet", "cursed": False},
    ]
    # base 160 + 50 curse + 16 first insurance + 5 fee
    assert quote_premium(CUSTOMER_NEW, items, contract_index=0) == 231


def test_premium_is_rounded_up_in_mhpcos_favour():
    # base 25 (one rune) + 2.5 first insurance = 27.5 -> +5 fee = 32.5 -> 33
    assert quote_premium(CUSTOMER_NEW, [{"type": "rune"}], contract_index=0) == 33
