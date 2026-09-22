import pytest
from policy import ClaimError, Policy
from pricelist import UnknownItemType
from quote import quote_premium

from test_cap import incident
from test_claim import damage
from test_quote import customer, item


def test_quoting_an_unknown_item_type_is_rejected():
    with pytest.raises(UnknownItemType):
        quote_premium(customer(), [item("broomstick")])


def test_claiming_for_an_item_outside_the_policy_is_rejected():
    policy = Policy(customer(), [item("sword")])
    with pytest.raises(ClaimError):
        policy.claim(incident(damage("amulet", 200)))


def test_claiming_for_an_unknown_item_type_is_rejected():
    policy = Policy(customer(), [item("sword")])
    with pytest.raises(ClaimError):
        policy.claim(incident(damage("broomstick", 200)))


def test_claiming_more_damages_than_insured_items_is_rejected():
    policy = Policy(customer(), [item("sword")])
    with pytest.raises(ClaimError):
        policy.claim(incident(damage("sword", 200), damage("sword", 300)))


def test_a_negative_damage_amount_is_rejected():
    policy = Policy(customer(), [item("sword")])
    with pytest.raises(ClaimError):
        policy.claim(incident(damage("sword", -200)))


def test_a_rejected_claim_leaves_the_cap_untouched():
    policy = Policy(customer(), [item("sword")])
    with pytest.raises(ClaimError):
        policy.claim(incident(damage("sword", -200)))
    assert policy.remaining_cap == 2000
