"""Premium calculation for MHPCO policies."""

from collections import Counter
from fractions import Fraction

MAIN_ITEMS = {
    "sword": {"value": 1000, "premium": 100},
    "amulet": {"value": 600, "premium": 60},
    "staff": {"value": 800, "premium": 80},
    "potion": {"value": 400, "premium": 40},
}

COMPONENT_VALUE = 250
COMPONENT_PREMIUM = 25
BLOCK_SIZE = 3
BLOCK_PREMIUM = 60

PROCESSING_FEE = 5
FIRST_INSURANCE_SURCHARGE = Fraction(1, 10)
CURSE_SURCHARGE = Fraction(1, 2)
LOYALTY_DISCOUNT = Fraction(1, 5)
LOYALTY_YEARS = 2
FOLLOW_UP_DISCOUNT = Fraction(3, 20)
HIGH_ENCHANTMENT_SURCHARGE = Fraction(3, 10)
HIGH_ENCHANTMENT_LEVEL = 5


def is_component(item):
    return item["type"] not in MAIN_ITEMS


def base_premium(items):
    mains = sum(
        MAIN_ITEMS[item["type"]]["premium"] for item in items if not is_component(item)
    )
    counts = Counter(item["type"] for item in items if is_component(item))
    return mains + sum(component_block_premium(count) for count in counts.values())


def component_block_premium(count):
    """A block price applies only to a group of exactly BLOCK_SIZE alike components."""
    if count == BLOCK_SIZE:
        return BLOCK_PREMIUM
    return count * COMPONENT_PREMIUM


def item_base_premium(item):
    if is_component(item):
        return COMPONENT_PREMIUM
    return MAIN_ITEMS[item["type"]]["premium"]


def item_surcharges(items):
    """Cursed and high-enchantment surcharges apply per item, not policy-wide."""
    return sum(item_surcharge(item) for item in items)


def item_surcharge(item):
    rate = Fraction(0)
    if item.get("cursed"):
        rate += CURSE_SURCHARGE
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL:
        rate += HIGH_ENCHANTMENT_SURCHARGE
    return item_base_premium(item) * rate


def policy_rate(years, contract_index):
    """Loyalty, first-insurance and follow-up all scale the policy base premium."""
    rate = FIRST_INSURANCE_SURCHARGE
    if years >= LOYALTY_YEARS:
        rate -= LOYALTY_DISCOUNT
    if contract_index > 0:
        rate -= FOLLOW_UP_DISCOUNT
    return rate


def quote_premium(items, years, contract_index):
    base = base_premium(items)
    total = base + item_surcharges(items) + base * policy_rate(years, contract_index)
    return round_up(total) + PROCESSING_FEE


def round_up(amount):
    """Premiums round in the MHPCO's favour."""
    return -((-Fraction(amount)) // 1)
