from premium import item_surcharges


def sword(**kwargs):
    return {"type": "sword", "material": "steel", "enchantment": 3, **kwargs}


def test_cursed_item_adds_fifty_percent_of_its_own_base_premium():
    assert item_surcharges([sword(cursed=True)]) == 50


def test_plain_item_has_no_surcharge():
    assert item_surcharges([sword(cursed=False)]) == 0


def test_high_enchantment_adds_thirty_percent_at_exactly_five():
    assert item_surcharges([sword(enchantment=5)]) == 30


def test_enchantment_four_is_not_high():
    assert item_surcharges([sword(enchantment=4)]) == 0


def test_cursed_and_high_enchantment_both_apply():
    assert item_surcharges([sword(enchantment=5, cursed=True)]) == 80


def test_surcharge_is_scoped_to_the_cursed_item_only():
    policy = [sword(cursed=True), {"type": "amulet"}]
    assert item_surcharges(policy) == 50
