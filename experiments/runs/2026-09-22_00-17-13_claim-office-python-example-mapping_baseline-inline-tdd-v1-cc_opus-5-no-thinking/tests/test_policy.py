import pytest

from policy import Policy, ClaimError


def sword(**kwargs):
    return {"type": "sword", "material": "steel", "enchantment": 3, **kwargs}


def test_insurance_sum_is_the_sum_of_item_values():
    policy = Policy([sword(), {"type": "amulet"}])
    assert policy.insurance_sum == 1600
    assert policy.remaining_cap == 3200


def test_two_swords_double_the_insurance_sum():
    assert Policy([sword(), sword()]).remaining_cap == 4000


def test_block_discount_does_not_change_the_insurance_sum():
    policy = Policy([sword()] + [{"type": "rune"} for _ in range(3)])
    assert policy.insurance_sum == 1750


def test_premium_modifiers_do_not_raise_the_cap():
    assert Policy([sword(cursed=True)]).remaining_cap == 2000


def test_deductible_applies_once_per_damaged_item():
    policy = Policy([sword(), {"type": "amulet"}])
    payout = policy.claim([
        {"itemType": "sword", "amount": 500},
        {"itemType": "amulet", "amount": 300},
    ])
    assert payout == 600


def test_successive_claims_exhaust_the_cap():
    policy = Policy([sword()])
    assert policy.claim([{"itemType": "sword", "amount": 1500}]) == 1400
    assert policy.remaining_cap == 600
    assert policy.claim([{"itemType": "sword", "amount": 1500}]) == 600
    assert policy.remaining_cap == 0


def test_each_damage_entry_of_the_same_type_is_a_separate_damage():
    policy = Policy([sword(), sword()])
    payout = policy.claim([
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 500},
    ])
    assert payout == 800


def test_more_damages_of_a_type_than_insured_is_rejected():
    policy = Policy([sword()])
    with pytest.raises(ClaimError):
        policy.claim([
            {"itemType": "sword", "amount": 500},
            {"itemType": "sword", "amount": 500},
        ])


def test_damage_to_an_item_not_in_the_policy_is_rejected():
    policy = Policy([sword()])
    with pytest.raises(ClaimError):
        policy.claim([{"itemType": "amulet", "amount": 200}])


def test_unknown_item_type_in_a_damage_is_rejected():
    policy = Policy([sword()])
    with pytest.raises(ClaimError):
        policy.claim([{"itemType": "broomstick", "amount": 200}])


def test_negative_damage_amount_is_rejected():
    policy = Policy([sword()])
    with pytest.raises(ClaimError):
        policy.claim([{"itemType": "sword", "amount": -200}])


def test_unknown_item_type_in_a_policy_is_rejected():
    with pytest.raises(ClaimError):
        Policy([{"type": "broomstick"}])
