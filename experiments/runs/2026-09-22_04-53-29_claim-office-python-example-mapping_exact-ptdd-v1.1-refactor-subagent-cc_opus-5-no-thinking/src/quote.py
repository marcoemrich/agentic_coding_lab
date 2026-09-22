"""Premium calculation for MHPCO policies."""

from collections import Counter
from fractions import Fraction
from typing import NamedTuple

from rejection import ScenarioRejected
from rounding import money_received_rounded_in_mhpco_favour

PROCESSING_FEE = 5

CURSE_SURCHARGE_RATE = Fraction(1, 2)
ENCHANTMENT_SURCHARGE_RATE = Fraction(3, 10)
SURCHARGEABLE_ENCHANTMENT_LEVEL = 5

LOYALTY_DISCOUNT_RATE = Fraction(1, 5)
LOYALTY_YEARS = 2
FIRST_CONTRACT_NUMBER = 1
FIRST_INSURANCE_SURCHARGE_RATE = Fraction(1, 10)
FOLLOW_UP_DISCOUNT_RATE = Fraction(3, 20)

class PriceListEntry(NamedTuple):
    """What the MHPCO price list says about one item type.

    The office prices an item type in one act: naming a type means naming
    both the value it is insured for and the premium it is charged. The two
    numbers are one row of the price list, never two separate decisions.
    """

    insurance_value: int
    base_premium: int


# Runes, moonstones and other components share one component price-list row.
COMPONENT_PRICE = PriceListEntry(insurance_value=250, base_premium=25)

PRICE_LIST = {
    "sword": PriceListEntry(insurance_value=1000, base_premium=100),
    "amulet": PriceListEntry(insurance_value=600, base_premium=60),
    "staff": PriceListEntry(insurance_value=800, base_premium=80),
    "potion": PriceListEntry(insurance_value=400, base_premium=40),
    "rune": COMPONENT_PRICE,
    "moonstone": COMPONENT_PRICE,
}

BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = 60


def item_insurance_value(item):
    """Return the value in G for which the MHPCO insures a single item."""
    return price_list_entry(item["type"]).insurance_value


def insurance_sum(items):
    """Return the insurance sum in G of a policy covering `items`.

    Premium discounts such as the component block reduce what the policy
    costs, never the value for which its items are insured.
    """
    return sum(item_insurance_value(item) for item in items)


def alike_group_key(item):
    """Return the key by which items count as alike: their exact item type."""
    return item["type"]


def price_list_entry(item_type):
    """Return the price-list row the MHPCO applies to `item_type`.

    The MHPCO insures only the item types named on its price list, so a type
    with no row is a risk this office does not accept at all.
    """
    if item_type not in PRICE_LIST:
        raise ScenarioRejected(
            f"the MHPCO does not insure items of type {item_type!r}"
        )
    return PRICE_LIST[item_type]


def item_type_base_premium(item_type):
    """Return the price-list base premium in G for one item of `item_type`."""
    return price_list_entry(item_type).base_premium


def item_base_premium(item):
    """Return the price-list base premium in G for a single insured item."""
    return item_type_base_premium(item["type"])


def alike_items_base_premium(item_type, count):
    """Return the base premium in G for `count` alike items of `item_type`.

    Exactly three alike components are offered as a building block.
    """
    if count == BLOCK_SIZE:
        return BLOCK_BASE_PREMIUM
    return count * item_type_base_premium(item_type)


def policy_base_premium(items):
    """Return the base premium in G for the insured items, before modifiers."""
    alike_counts = Counter(alike_group_key(item) for item in items)
    return sum(
        alike_items_base_premium(item_type, count)
        for item_type, count in alike_counts.items()
    )


def is_cursed(item):
    """Return whether the item carries a curse."""
    return bool(item.get("cursed"))


def is_surchargeably_enchanted(item):
    """Return whether the item's enchantment is high enough to surcharge the premium.

    This is the underwriting office's own threshold; the claims office sets a
    separate, higher one for reducing cover.
    """
    return item.get("enchantment", 0) >= SURCHARGEABLE_ENCHANTMENT_LEVEL


def item_risk_rates(item):
    """Yield the surcharge rate of every risk the item presents."""
    if is_cursed(item):
        yield CURSE_SURCHARGE_RATE
    if is_surchargeably_enchanted(item):
        yield ENCHANTMENT_SURCHARGE_RATE


def combined_rate(rates):
    """Return the single rate that several modifier rates amount to together.

    The MHPCO accumulates modifiers additively; no single one wins.
    """
    return sum(rates, Fraction(0))


def item_surcharge_rate(item):
    """Return the combined risk surcharge rate an item carries."""
    return combined_rate(item_risk_rates(item))


def item_surcharge_amount(item):
    """Return the risk surcharge in G an item adds to the policy premium."""
    return item_surcharge_rate(item) * item_base_premium(item)


def policy_item_surcharges(items):
    """Return the risk surcharges in G the insured items add in total."""
    return sum((item_surcharge_amount(item) for item in items), Fraction(0))


def is_long_standing(customer):
    """Return whether the customer has been with MHPCO long enough for loyalty."""
    return customer.get("yearsWithMHPCO", 0) >= LOYALTY_YEARS


def is_follow_up_contract(contract_number):
    """Return whether this contract follows an earlier one by the customer."""
    return contract_number > FIRST_CONTRACT_NUMBER


class CustomerStanding(NamedTuple):
    """How the customer stands with MHPCO at the moment of this quote.

    Loyalty and the follow-up discount are both keyed on the customer's
    history, so the years of business and the ordinal of this contract
    travel together as one concept.
    """

    customer: dict
    contract_number: int


def policy_modifier_rates(standing):
    """Yield the signed rate of every policy-wide modifier that applies.

    Every quote is a first insurance of the items it covers, so that
    surcharge applies regardless of the customer's standing.
    """
    yield FIRST_INSURANCE_SURCHARGE_RATE
    if is_long_standing(standing.customer):
        yield -LOYALTY_DISCOUNT_RATE
    if is_follow_up_contract(standing.contract_number):
        yield -FOLLOW_UP_DISCOUNT_RATE


def policy_modifier_rate(standing):
    """Return the combined policy-wide modifier rate for the customer."""
    return combined_rate(policy_modifier_rates(standing))


def policy_modifier_amount(base_premium, standing):
    """Return the policy-wide modifier in G, charged on the policy base premium.

    Unlike a risk surcharge, which is charged on the affected item alone, a
    customer-standing modifier applies to the policy as a whole.
    """
    return policy_modifier_rate(standing) * base_premium


def quote_premium(items, customer=None, contract_number=FIRST_CONTRACT_NUMBER):
    """Return the total premium in G for the given list of insured items."""
    standing = CustomerStanding(customer or {}, contract_number)
    base_premium = policy_base_premium(items)
    premium = (
        base_premium
        + policy_item_surcharges(items)
        + policy_modifier_amount(base_premium, standing)
        + PROCESSING_FEE
    )
    return money_received_rounded_in_mhpco_favour(premium)


class CustomerContracts:
    """The sequence of contracts one customer takes out with the MHPCO.

    The office numbers a customer's contracts in the order they are agreed,
    so that it can tell a first insurance from a follow-up. Only agreeing a
    contract advances the sequence; asking anything else of the office does
    not.
    """

    def __init__(self):
        self._next_contract_number = FIRST_CONTRACT_NUMBER

    def agree_next(self):
        """Return the contract number of the customer's next contract."""
        contract_number = self._next_contract_number
        self._next_contract_number += 1
        return contract_number
