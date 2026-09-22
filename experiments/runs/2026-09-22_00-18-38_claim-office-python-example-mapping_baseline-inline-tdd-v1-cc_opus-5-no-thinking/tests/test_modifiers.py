from test_quote import premium


def sword(**attrs):
    return {"type": "sword", "material": "steel", "enchantment": 3,
            "cursed": False, **attrs}


def test_curse_adds_half_of_the_item_base_premium():
    # 100 base + 50 curse + 10 first insurance = 160 + 5 fee
    assert premium([sword(cursed=True)]) == 165


def test_high_enchantment_adds_thirty_percent_at_exactly_five():
    # 100 base + 30 enchantment + 10 first insurance = 140 + 5 fee
    assert premium([sword(enchantment=5)]) == 145


def test_enchantment_four_is_not_high_enough():
    assert premium([sword(enchantment=4)]) == premium([sword(enchantment=3)])


def test_curse_and_high_enchantment_stack():
    # 100 base + 50 curse + 30 enchantment + 10 first insurance = 190 + 5 fee
    assert premium([sword(cursed=True, enchantment=5)]) == 195


def test_loyalty_discount_applies_at_exactly_two_years():
    # 100 base - 20 loyalty + 10 first insurance = 90 + 5 fee
    assert premium([sword()], years=2) == 95


def test_one_year_is_not_yet_long_standing():
    assert premium([sword()], years=1) == premium([sword()], years=0)


def test_item_modifiers_apply_only_to_the_affected_item():
    # base 160; curse adds 50 (half of the sword only) = 210
    # first insurance adds 16 (10% of the policy base) = 226 + 5 fee
    items = [sword(cursed=True), {"type": "amulet"}]
    assert premium(items) == 231


def test_newcomer_with_a_cursed_sword():
    assert premium([sword(cursed=True)], years=0) == 165


def test_long_standing_customers_second_contract():
    first = {"op": "quote", "items": [sword()]}
    cursed = sword(cursed=True, enchantment=7)
    assert premium([cursed], years=3, prior_steps=[first]) == 160
