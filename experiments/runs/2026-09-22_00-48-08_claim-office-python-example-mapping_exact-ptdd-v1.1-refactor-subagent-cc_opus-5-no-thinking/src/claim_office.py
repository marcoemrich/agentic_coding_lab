"""The MHPCO's policy management rules."""

from fractions import Fraction

PROCESSING_FEE = 5
FIRST_INSURANCE_SURCHARGE_RATE = Fraction(10, 100)

BASE_PREMIUMS = {"sword": 100, "amulet": 60, "staff": 80}


def quote(items):
    """Compute the premium for the items a customer wishes to insure.

    The processing fee is added to the policy base premium at the very end.
    """
    policy_base = policy_base_premium(items)
    return policy_base + policy_modifiers(policy_base) + PROCESSING_FEE


def policy_base_premium(items):
    """Sum the base premiums of the items covered by the policy."""
    return sum(BASE_PREMIUMS[item["type"]] for item in items)


def policy_modifiers(policy_base):
    """Total the policy-wide surcharges and discounts on the policy base premium."""
    return policy_base * FIRST_INSURANCE_SURCHARGE_RATE
