"""MHPCO quote premium policy."""

import math
from collections import Counter
from fractions import Fraction


BASE_PREMIUMS = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
    "rune": 25,
    "moonstone": 25,
}
COMPONENT_TYPES = {"rune", "moonstone"}
PROCESSING_FEE = 5
INITIAL_ASSESSMENT_RATE = Fraction(1, 10)
CURSE_SURCHARGE_RATE = Fraction(1, 2)
HIGH_ENCHANTMENT_SURCHARGE_RATE = Fraction(3, 10)
HIGH_ENCHANTMENT_THRESHOLD = 5
LOYALTY_THRESHOLD_YEARS = 2
LOYALTY_DISCOUNT_RATE = Fraction(1, 5)
FOLLOW_UP_DISCOUNT_RATE = Fraction(3, 20)
BUILDING_BLOCK_SIZE = 3
BUILDING_BLOCK_PREMIUM = 60


def listed_base_premium(item_type):
    """Return an item's base premium from the MHPCO price list."""
    return BASE_PREMIUMS[item_type]


def is_component_building_block(item_type, count):
    """Return whether an exact-type group qualifies as a building block."""
    return item_type in COMPONENT_TYPES and count == BUILDING_BLOCK_SIZE


def item_type_base_premium(item_type, count):
    """Price one exact-type group, including the component block offer."""
    if is_component_building_block(item_type, count):
        return BUILDING_BLOCK_PREMIUM
    return listed_base_premium(item_type) * count


def policy_base_premium(items):
    """Calculate the policy base premium from its insured items."""
    counts = Counter(item["type"] for item in items)
    return sum(item_type_base_premium(item_type, count) for item_type, count in counts.items())


def is_cursed(item):
    """Return whether an item qualifies for cursed-item risk pricing."""
    return item.get("cursed", False)


def curse_surcharge_for(item):
    """Calculate curse risk against one affected item's base premium."""
    if not is_cursed(item):
        return 0
    return listed_base_premium(item["type"]) * CURSE_SURCHARGE_RATE


def curse_surcharge(items):
    """Total the item-scoped curse surcharges for a quote."""
    return sum(curse_surcharge_for(item) for item in items)


def is_highly_enchanted(item):
    """Return whether an item qualifies as highly enchanted."""
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD


def high_enchantment_surcharge_for(item):
    """Calculate enchantment risk against one highly enchanted item."""
    if not is_highly_enchanted(item):
        return 0
    return listed_base_premium(item["type"]) * HIGH_ENCHANTMENT_SURCHARGE_RATE


def high_enchantment_surcharge(items):
    """Total the item-scoped high-enchantment surcharges for a quote."""
    return sum(high_enchantment_surcharge_for(item) for item in items)


def is_long_standing_customer(years_with_mhpco):
    """Return whether customer tenure qualifies for loyalty pricing."""
    return years_with_mhpco >= LOYALTY_THRESHOLD_YEARS


def loyalty_discount(base_premium, years_with_mhpco):
    """Discount the policy base for long-standing customers."""
    if is_long_standing_customer(years_with_mhpco):
        return base_premium * LOYALTY_DISCOUNT_RATE
    return 0


def is_follow_up_contract(previous_contracts):
    """Return whether the customer has already made a contract."""
    return previous_contracts > 0


def follow_up_contract_discount(base_premium, previous_contracts):
    """Discount contracts after the customer's first."""
    if is_follow_up_contract(previous_contracts):
        return base_premium * FOLLOW_UP_DISCOUNT_RATE
    return 0


def initial_assessment_surcharge(base_premium):
    """Calculate the surcharge for an item's first insurance."""
    return base_premium * INITIAL_ASSESSMENT_RATE


def round_premium_in_mhpco_favor(premium):
    """Round a final premium up to whole G in the MHPCO's favor."""
    return math.ceil(premium)


def add_processing_fee(premium):
    """Add the processing fee at the end of a premium calculation."""
    return premium + PROCESSING_FEE


def final_premium(premium_before_fee):
    """Finalize a premium in the MHPCO's favor."""
    return round_premium_in_mhpco_favor(add_processing_fee(premium_before_fee))


def quote_premium(items, years_with_mhpco=0, previous_contracts=0):
    """Calculate the payable premium for the items in a quote."""
    base_premium = policy_base_premium(items)
    premium = (
        base_premium
        + curse_surcharge(items)
        + high_enchantment_surcharge(items)
        + initial_assessment_surcharge(base_premium)
        - loyalty_discount(base_premium, years_with_mhpco)
        - follow_up_contract_discount(base_premium, previous_contracts)
    )
    return final_premium(premium)
