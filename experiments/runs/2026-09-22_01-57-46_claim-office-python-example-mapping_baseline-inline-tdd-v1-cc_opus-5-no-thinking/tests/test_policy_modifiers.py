from quote import quote_premium

from test_quote import customer, item


def test_first_insurance_adds_ten_percent_of_the_policy_base():
    assert quote_premium(customer(years=0), [item("sword")]) - 5 == 110


def test_two_years_of_business_earn_the_loyalty_discount():
    assert quote_premium(customer(years=2), [item("sword")]) - 5 == 90


def test_one_year_of_business_is_not_yet_loyal():
    assert quote_premium(customer(years=1), [item("sword")]) - 5 == 110


def test_every_contract_after_the_first_gets_a_follow_up_discount():
    loyal_returning = customer(years=2, previous_contracts=1)
    assert quote_premium(loyal_returning, [item("sword")]) - 5 == 75


def test_policy_modifiers_apply_to_the_summed_base_premium():
    items = [item("sword"), item("amulet")]
    assert quote_premium(customer(years=0), items) - 5 == 176


def test_newcomer_with_a_cursed_sword():
    sword = item("sword", material="steel", enchantment=3, cursed=True)
    assert quote_premium(customer(years=0), [sword]) == 165


def test_long_standing_customers_second_contract():
    sword = item("sword", material="steel", enchantment=7, cursed=True)
    returning = customer(years=3, previous_contracts=1)
    assert quote_premium(returning, [sword]) == 160


def test_premium_is_rounded_up_in_the_offices_favour():
    # 3 potions, first insurance: 120 base + 12 = 132; loyalty-free.
    # A half-G case: amulet 60 + 30 (curse) = 90 base, -20% loyalty = -18,
    # +10% first insurance = +9 -> 81 exactly; use a rune block instead.
    items = [item("rune"), item("rune"), item("rune"), item("moonstone")]
    # base 60 + 25 = 85; first insurance +8.5 -> 93.5 -> 94 + 5 fee
    assert quote_premium(customer(years=0), items) == 99
