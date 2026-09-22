"""Premium calculation for MHPCO policies.

Intermediate amounts are kept as exact fractions; only the final premium is
rounded, and always in the MHPCO's favour (up).
"""

import math
from collections import Counter
from fractions import Fraction

from catalogue import (
    COMPONENT_BASE_PREMIUM,
    MAIN_ITEM_BASE_PREMIUMS,
    is_component,
    require_known_type,
)

PROCESSING_FEE = 5

BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = 60

CURSE_SURCHARGE_RATE = Fraction(50, 100)
HIGH_ENCHANTMENT_SURCHARGE_RATE = Fraction(30, 100)
HIGH_ENCHANTMENT_THRESHOLD = 5

LOYALTY_DISCOUNT_RATE = Fraction(20, 100)
LOYALTY_THRESHOLD_YEARS = 2
FIRST_INSURANCE_SURCHARGE_RATE = Fraction(10, 100)
FOLLOW_UP_CONTRACT_DISCOUNT_RATE = Fraction(15, 100)


def component_group_base_premium(count):
    if count == BLOCK_SIZE:
        return Fraction(BLOCK_BASE_PREMIUM)
    return Fraction(count * COMPONENT_BASE_PREMIUM)


def item_base_premiums(items):
    """Base premium of each item, in input order.

    A block of 3 alike components is cheaper than its parts; the discount is
    spread evenly over the components of that block.
    """
    for item in items:
        require_known_type(item["type"])
    component_counts = Counter(
        item["type"] for item in items if is_component(item["type"])
    )
    share = {
        item_type: component_group_base_premium(count) / count
        for item_type, count in component_counts.items()
    }
    return [
        share[item["type"]]
        if is_component(item["type"])
        else Fraction(MAIN_ITEM_BASE_PREMIUMS[item["type"]])
        for item in items
    ]


def policy_base_premium(items):
    return sum(item_base_premiums(items), Fraction(0))


def item_surcharges(item, item_base_premium):
    rate = Fraction(0)
    if item.get("cursed", False):
        rate += CURSE_SURCHARGE_RATE
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD:
        rate += HIGH_ENCHANTMENT_SURCHARGE_RATE
    return rate * item_base_premium


def policy_wide_rate(customer, contract_index):
    """Net rate of the modifiers that apply to the policy base premium."""
    rate = Fraction(0)
    if customer["yearsWithMHPCO"] >= LOYALTY_THRESHOLD_YEARS:
        rate -= LOYALTY_DISCOUNT_RATE
    if contract_index > 0:
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    return rate


def quote_premium(customer, items, contract_index):
    base_premiums = item_base_premiums(items)
    base_total = sum(base_premiums, Fraction(0))

    premium = base_total
    premium += sum(
        (
            item_surcharges(item, base) + FIRST_INSURANCE_SURCHARGE_RATE * base
            for item, base in zip(items, base_premiums, strict=True)
        ),
        Fraction(0),
    )
    premium += policy_wide_rate(customer, contract_index) * base_total
    premium += PROCESSING_FEE
    return math.ceil(premium)
