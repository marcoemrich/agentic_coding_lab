"""Premium calculation for MHPCO policies."""
import math
from fractions import Fraction

import catalogue
from errors import ClaimOfficeError

PROCESSING_FEE = Fraction(5)
FIRST_INSURANCE_SURCHARGE = Fraction(1, 10)
CURSE_SURCHARGE = Fraction(1, 2)
HIGH_ENCHANTMENT_SURCHARGE = Fraction(3, 10)
HIGH_ENCHANTMENT_LEVEL = 5
LOYALTY_DISCOUNT = Fraction(1, 5)
LOYALTY_YEARS = 2
FOLLOW_UP_DISCOUNT = Fraction(3, 20)


def _component_counts(items):
    counts = {}
    for item in items:
        item_type = item["type"]
        if catalogue.is_component(item_type):
            counts[item_type] = counts.get(item_type, 0) + 1
    return counts


def policy_base_premium(items):
    """Sum of the item base premiums, with the alike-component block applied.

    A block is offered only for exactly three components of the same type.
    """
    total = sum(
        (
            catalogue.base_premium(item["type"])
            for item in items
            if not catalogue.is_component(item["type"])
        ),
        Fraction(0),
    )
    for item_type, count in _component_counts(items).items():
        if count == catalogue.BLOCK_SIZE:
            total += catalogue.BLOCK_BASE_PREMIUM
        else:
            total += count * catalogue.base_premium(item_type)
    return total


def _item_surcharges(item):
    """Risk surcharges charged on a single item's own base premium."""
    base = catalogue.base_premium(item["type"])
    surcharge = Fraction(0)
    if item.get("cursed", False):
        surcharge += base * CURSE_SURCHARGE
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL:
        surcharge += base * HIGH_ENCHANTMENT_SURCHARGE
    return surcharge


def _policy_modifiers(policy_base, years_with_mhpco, contract_index):
    """Discounts and surcharges charged on the policy base premium."""
    total = policy_base * FIRST_INSURANCE_SURCHARGE
    if years_with_mhpco >= LOYALTY_YEARS:
        total -= policy_base * LOYALTY_DISCOUNT
    if contract_index > 0:
        total -= policy_base * FOLLOW_UP_DISCOUNT
    return total


def insurance_sum(items):
    return sum(
        (catalogue.insurance_value(item["type"]) for item in items), Fraction(0)
    )


def quote_premium(items, years_with_mhpco=0, contract_index=0):
    for item in items:
        if not catalogue.is_known(item["type"]):
            raise ClaimOfficeError(f"unknown item type: {item['type']!r}")
    policy_base = policy_base_premium(items)
    total = policy_base
    total += sum((_item_surcharges(item) for item in items), Fraction(0))
    total += _policy_modifiers(policy_base, years_with_mhpco, contract_index)
    return math.ceil(total + PROCESSING_FEE)
