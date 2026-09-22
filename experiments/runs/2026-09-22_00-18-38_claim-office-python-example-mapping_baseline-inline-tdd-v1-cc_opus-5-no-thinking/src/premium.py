"""Premium calculation for an MHPCO policy quote."""

from collections import Counter
from fractions import Fraction

from pricelist import base_premium, block_premium, is_component

PROCESSING_FEE = 5
CURSE_SURCHARGE = Fraction(1, 2)
HIGH_ENCHANTMENT_SURCHARGE = Fraction(3, 10)
HIGH_ENCHANTMENT_THRESHOLD = 5
LOYALTY_DISCOUNT = Fraction(1, 5)
LOYALTY_THRESHOLD_YEARS = 2
FIRST_INSURANCE_SURCHARGE = Fraction(1, 10)
FOLLOW_UP_DISCOUNT = Fraction(3, 20)


def _round_in_office_favour(amount):
    """Premiums are rounded up — the MHPCO never rounds against itself."""
    return -((-amount.numerator) // amount.denominator)


def policy_base_premium(items):
    """Sum of item base premiums, with alike components grouped into blocks."""
    total = sum(
        (base_premium(item["type"]) for item in items
         if not is_component(item["type"])),
        Fraction(0),
    )
    counts = Counter(item["type"] for item in items if is_component(item["type"]))
    for item_type, count in counts.items():
        total += block_premium(item_type, count)
    return total


def _item_surcharges(items):
    """Curse and high-enchantment surcharges, each on its own item's base."""
    total = Fraction(0)
    for item in items:
        item_base = base_premium(item["type"])
        if item.get("cursed"):
            total += item_base * CURSE_SURCHARGE
        if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD:
            total += item_base * HIGH_ENCHANTMENT_SURCHARGE
    return total


def _policy_adjustments(policy_base, years_with_mhpco, previous_contracts):
    """Loyalty, first-insurance and follow-up modifiers on the policy base."""
    total = policy_base * FIRST_INSURANCE_SURCHARGE
    if years_with_mhpco >= LOYALTY_THRESHOLD_YEARS:
        total -= policy_base * LOYALTY_DISCOUNT
    if previous_contracts > 0:
        total -= policy_base * FOLLOW_UP_DISCOUNT
    return total


def calculate_premium(items, years_with_mhpco, previous_contracts):
    policy_base = policy_base_premium(items)
    total = (
        policy_base
        + _item_surcharges(items)
        + _policy_adjustments(policy_base, years_with_mhpco, previous_contracts)
        + PROCESSING_FEE
    )
    return _round_in_office_favour(total)
