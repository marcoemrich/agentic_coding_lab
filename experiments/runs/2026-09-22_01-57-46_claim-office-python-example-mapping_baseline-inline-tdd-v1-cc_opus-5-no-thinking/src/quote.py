"""Premium calculation for MHPCO policies."""

from collections import Counter
from fractions import Fraction

import pricelist
from rounding import round_in_favour_of_office

PROCESSING_FEE = 5
BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = 60

CURSE_SURCHARGE = Fraction(50, 100)
HIGH_ENCHANTMENT_SURCHARGE = Fraction(30, 100)
HIGH_ENCHANTMENT_THRESHOLD = 5

LOYALTY_DISCOUNT = Fraction(20, 100)
LOYALTY_THRESHOLD_YEARS = 2
FIRST_INSURANCE_SURCHARGE = Fraction(10, 100)
FOLLOW_UP_DISCOUNT = Fraction(15, 100)


def quote_premium(customer, items):
    """Return the total premium in G for insuring ``items``."""
    base = policy_base_premium(items)
    premium = base + _item_surcharges(items) + base * _policy_rate(customer)
    return round_in_favour_of_office(premium + PROCESSING_FEE)


def policy_base_premium(items):
    """Sum of all item base premiums, with the component block discount."""
    main_items = [i for i in items if not pricelist.is_component(i["type"])]
    base = sum(pricelist.base_premium(i["type"]) for i in main_items)
    return base + _components_base_premium(items)


def _policy_rate(customer):
    """Net rate of the policy-wide modifiers, charged on the policy base."""
    rate = FIRST_INSURANCE_SURCHARGE
    if customer.get("yearsWithMHPCO", 0) >= LOYALTY_THRESHOLD_YEARS:
        rate -= LOYALTY_DISCOUNT
    if customer.get("previousContracts", 0) >= 1:
        rate -= FOLLOW_UP_DISCOUNT
    return rate


def _item_surcharges(items):
    return sum(_surcharge_for(i) for i in items)


def _surcharge_for(item):
    """Item-specific surcharges, charged on the item's own base premium."""
    base = pricelist.base_premium(item["type"])
    rate = Fraction(0)
    if item.get("cursed", False):
        rate += CURSE_SURCHARGE
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD:
        rate += HIGH_ENCHANTMENT_SURCHARGE
    return base * rate


def _components_base_premium(items):
    counts = Counter(i["type"] for i in items if pricelist.is_component(i["type"]))
    return sum(_block_premium(t, n) for t, n in counts.items())


def _block_premium(item_type, count):
    if count == BLOCK_SIZE:
        return BLOCK_BASE_PREMIUM
    return count * pricelist.base_premium(item_type)
