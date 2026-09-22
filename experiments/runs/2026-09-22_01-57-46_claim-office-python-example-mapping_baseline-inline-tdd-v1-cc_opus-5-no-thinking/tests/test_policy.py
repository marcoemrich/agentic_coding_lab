from policy import Policy

from test_quote import customer, item, runes


def policy_for(*items, years=0):
    return Policy(customer(years=years), list(items))


def test_insurance_sum_of_a_single_sword():
    assert policy_for(item("sword")).insurance_sum == 1000


def test_insurance_sum_adds_up_over_items():
    assert policy_for(item("sword"), item("amulet")).insurance_sum == 1600


def test_two_swords_are_insured_twice():
    assert policy_for(item("sword"), item("sword")).insurance_sum == 2000


def test_block_discount_does_not_lower_the_insurance_sum():
    assert Policy(customer(), [item("sword"), *runes(3)]).insurance_sum == 1750


def test_cap_is_twice_the_insurance_sum():
    assert policy_for(item("sword"), item("amulet")).cap == 3200


def test_premium_modifiers_do_not_raise_the_cap():
    assert policy_for(item("sword", cursed=True)).cap == 2000
