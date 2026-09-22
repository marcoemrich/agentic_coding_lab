from policy import Policy

from test_claim import damage
from test_quote import customer, item


def incident(*damages):
    return {"cause": "dragon attack", "damages": list(damages)}


def test_successive_claims_eat_into_the_cap():
    policy = Policy(customer(), [item("sword")])

    first = policy.claim(incident(damage("sword", 1500)))
    assert (first.payout, first.remaining_cap) == (1400, 600)

    second = policy.claim(incident(damage("sword", 1500)))
    assert (second.payout, second.remaining_cap) == (600, 0)


def test_an_exhausted_cap_pays_nothing_more():
    policy = Policy(customer(), [item("sword")])
    policy.claim(incident(damage("sword", 1500)))
    policy.claim(incident(damage("sword", 1500)))

    third = policy.claim(incident(damage("sword", 500)))
    assert (third.payout, third.remaining_cap) == (0, 0)


def test_two_swords_each_carry_their_own_deductible():
    policy = Policy(customer(), [item("sword"), item("sword")])
    result = policy.claim(incident(damage("sword", 500), damage("sword", 300)))
    assert result.payout == 600


def test_payout_is_rounded_down_in_the_offices_favour():
    sword = item("sword", enchantment=9)
    policy = Policy(customer(), [sword])
    # half of 901 is 450.5 -> 350.5 after the deductible -> rounded down
    assert policy.claim(incident(damage("sword", 901))).payout == 350
