"""How the office rates the premium of a policy."""

import math
from fractions import Fraction

from tariff import (
    COMPONENT_BASE_PREMIUM,
    alike_component_counts,
    base_premium_of,
    is_component,
)

PROCESSING_FEE = 5

COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_BASE_PREMIUM = 60

CURSE_SURCHARGE_RATE = Fraction(1, 2)
HIGH_ENCHANTMENT_LEVEL = 5
HIGH_ENCHANTMENT_SURCHARGE_RATE = Fraction(3, 10)

LOYALTY_YEARS = 2
LOYALTY_DISCOUNT_RATE = Fraction(1, 5)
FIRST_INSURANCE_SURCHARGE_RATE = Fraction(1, 10)
FOLLOW_UP_CONTRACT_DISCOUNT_RATE = Fraction(3, 20)


def forms_a_building_block(alike_count):
    """A building block requires exactly 3 alike components; 4 do not form one."""
    return alike_count == COMPONENT_BLOCK_SIZE


def component_group_base_premium(count):
    if forms_a_building_block(count):
        return COMPONENT_BLOCK_BASE_PREMIUM
    return count * COMPONENT_BASE_PREMIUM


def policy_base_premium(items):
    item_types = [item["type"] for item in items]
    main_item_total = sum(
        base_premium_of(item_type) for item_type in item_types if not is_component(item_type)
    )
    component_total = sum(
        component_group_base_premium(count)
        for count in alike_component_counts(item_types).values()
    )
    return main_item_total + component_total


def is_cursed(item):
    """A curse is a declared property of the item itself."""
    return bool(item.get("cursed"))


def is_highly_enchanted(item):
    """Enchantment level 5 is already high; level 4 is not."""
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL


def item_surcharge_rate(item):
    """Item-specific risk policies accumulate: a curse adds 50 %, high enchantment 30 %."""
    rate = Fraction(0)
    if is_cursed(item):
        rate += CURSE_SURCHARGE_RATE
    if is_highly_enchanted(item):
        rate += HIGH_ENCHANTMENT_SURCHARGE_RATE
    return rate


def item_surcharge(item):
    """An item-specific surcharge is charged on that item's own base premium."""
    return item_surcharge_rate(item) * base_premium_of(item["type"])


def item_surcharges(items):
    return sum((item_surcharge(item) for item in items), Fraction(0))


def is_long_standing(customer):
    """A customer is long-standing from exactly 2 years of business onwards."""
    return customer.get("yearsWithMHPCO", 0) >= LOYALTY_YEARS


def is_follow_up_contract(previous_contracts):
    """Every contract after the customer's first is a follow-up contract.

    Contract sequence is scenario state, not a field of the customer record:
    the caller counts the quotes it has already granted this customer.
    """
    return previous_contracts >= 1


def policy_modifier_rate(customer, previous_contracts):
    """Policy-wide modifier policies accumulate.

    Every quote is a first insurance for its items regardless of customer
    history, so that surcharge always applies; loyalty depends on the customer
    record and the follow-up discount on the contract's place in the sequence.
    """
    rate = Fraction(0)
    rate += FIRST_INSURANCE_SURCHARGE_RATE
    if is_long_standing(customer):
        rate -= LOYALTY_DISCOUNT_RATE
    if is_follow_up_contract(previous_contracts):
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    return rate


def policy_modifiers(base, customer, previous_contracts):
    """Policy-wide modifiers are charged on the policy base premium."""
    return policy_modifier_rate(customer, previous_contracts) * base


def rounded_up_in_office_favour(premium):
    """Premiums are rounded up to whole G, in the MHPCO's favour."""
    return math.ceil(premium)


def exact_premium(items, customer, previous_contracts):
    """Item-specific surcharges are charged on their own item, policy-wide
    modifiers on the policy base premium, and the processing fee is added at
    the very end. Kept exact as a Fraction; only the quote is rounded.
    """
    base = policy_base_premium(items)
    return (
        base
        + item_surcharges(items)
        + policy_modifiers(base, customer, previous_contracts)
        + PROCESSING_FEE
    )


def quote_premium(items, customer=None, previous_contracts=0):
    customer = customer or {}
    return rounded_up_in_office_favour(exact_premium(items, customer, previous_contracts))
