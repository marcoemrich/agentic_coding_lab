"""Premium and payout rules of the Most Honorable Privileged Claims Office."""

import math
from collections import Counter
from dataclasses import dataclass, field

PROCESSING_FEE = 5
FIRST_INSURANCE_SURCHARGE = 0.1
CURSE_SURCHARGE = 0.5
HIGH_ENCHANTMENT_LEVEL = 5
HIGH_ENCHANTMENT_SURCHARGE = 0.3
LOYALTY_YEARS = 2
LOYALTY_DISCOUNT = 0.2
FOLLOW_UP_CONTRACT_DISCOUNT = 0.15

PAYOUT_CAP_FACTOR = 2
DEDUCTIBLE = 100
HALVED_REIMBURSEMENT_LEVEL = 8
HALVED_REIMBURSEMENT_RATE = 0.5

COMPONENT_TYPES = frozenset({"rune", "moonstone"})
COMPONENT_INSURANCE_VALUE = 250
COMPONENT_BASE_PREMIUM = 25
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_BASE_PREMIUM = 60

COMPONENT_PRICE = (COMPONENT_INSURANCE_VALUE, COMPONENT_BASE_PREMIUM)

#: The MHPCO price list: insurance value and base premium per insurable type.
PRICE_LIST = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
    "rune": COMPONENT_PRICE,
    "moonstone": COMPONENT_PRICE,
}


def price_of(item_type):
    """The MHPCO insures only the item types named in its price list."""
    if item_type not in PRICE_LIST:
        raise ValueError(f"the MHPCO does not insure items of type {item_type!r}")
    return PRICE_LIST[item_type]


def base_premium_of(item_type):
    _, base_premium = price_of(item_type)
    return base_premium


def is_component(item_type):
    return item_type in COMPONENT_TYPES


def base_premium_for_alike_items(item_type, count):
    """A building block of exactly 3 alike components carries the block premium."""
    if is_component(item_type) and count == COMPONENT_BLOCK_SIZE:
        return COMPONENT_BLOCK_BASE_PREMIUM
    return count * base_premium_of(item_type)


def policy_base_premium(items):
    counted_by_type = Counter(item["type"] for item in items)
    return sum(
        base_premium_for_alike_items(item_type, count)
        for item_type, count in counted_by_type.items()
    )


def is_cursed(item):
    return bool(item.get("cursed"))


def is_highly_enchanted(item):
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL


def item_risk_surcharge(item):
    """Item risks are surcharged on the item's own base premium."""
    surcharge_rate = 0
    if is_cursed(item):
        surcharge_rate += CURSE_SURCHARGE
    if is_highly_enchanted(item):
        surcharge_rate += HIGH_ENCHANTMENT_SURCHARGE
    return base_premium_of(item["type"]) * surcharge_rate


def policy_risk_surcharge(items):
    return sum(item_risk_surcharge(item) for item in items)


def is_long_standing(customer):
    """Long-standing customers have been with the MHPCO for 2 years or more."""
    return customer.get("yearsWithMHPCO", 0) >= LOYALTY_YEARS


def is_follow_up_contract(previous_contracts):
    """Every contract after the customer's first is a follow-up contract."""
    return previous_contracts > 0


def policy_modifier_rate(customer, previous_contracts):
    """Policy-wide modifiers apply to the policy base premium."""
    rate = FIRST_INSURANCE_SURCHARGE
    if is_long_standing(customer):
        rate -= LOYALTY_DISCOUNT
    if is_follow_up_contract(previous_contracts):
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT
    return rate


def rounded_premium(premium):
    """Premiums round up: the MHPCO rounds in its own favor."""
    return math.ceil(premium)


def rounded_payout(payout):
    """Payouts round down: the MHPCO rounds in its own favor."""
    return math.floor(payout)


def quote(items, customer=None, previous_contracts=0):
    customer = customer or {}
    base_premium = policy_base_premium(items)
    premium = (
        base_premium
        + policy_risk_surcharge(items)
        + base_premium * policy_modifier_rate(customer, previous_contracts)
        + PROCESSING_FEE
    )
    return rounded_premium(premium)


def insurance_value_of(item_type):
    insurance_value, _ = price_of(item_type)
    return insurance_value


@dataclass
class Policy:
    """What the MHPCO insures, and how much of its cap is left to pay out."""

    items: list
    insurance_sum: int = field(init=False)
    remaining_cap: int = field(init=False)

    def __post_init__(self):
        self.insurance_sum = sum(insurance_value_of(item["type"]) for item in self.items)
        self.remaining_cap = self.insurance_sum * PAYOUT_CAP_FACTOR


def insure(items):
    return Policy(items=list(items))


def is_severely_enchanted(item):
    """Damage to severely enchanted items is reimbursed at half."""
    return item.get("enchantment", 0) >= HALVED_REIMBURSEMENT_LEVEL


def reimbursement_for(item, amount):
    """Severe enchantment halves the reimbursement; every other damage, including
    dragon material, is reimbursed in full."""
    if is_severely_enchanted(item):
        return amount * HALVED_REIMBURSEMENT_RATE
    return amount


def payout_for_damage(item, damage):
    """Each damage event carries its own deductible, which cannot make the
    MHPCO's payout negative."""
    return max(reimbursement_for(item, damage["amount"]) - DEDUCTIBLE, 0)


@dataclass
class Settlement:
    """What the MHPCO pays for an incident, and what its cap still allows."""

    payout: int
    remaining_cap: int


def require_reportable(amount):
    """A damage reports what was lost, so it can never be a negative amount."""
    if amount < 0:
        raise ValueError(f"a damage amount cannot be negative: {amount}")
    return amount


def damages_against_insured_items(policy, damages):
    """Pair each damage with its own insured item, so the MHPCO refuses an
    incident reporting more damages of a type than the policy covers."""
    unclaimed = list(policy.items)
    paired = []
    for damage in damages:
        require_reportable(damage["amount"])
        item_type = damage["itemType"]
        item = next((item for item in unclaimed if item["type"] == item_type), None)
        if item is None:
            raise ValueError(f"the policy does not cover an item of type {item_type!r}")
        unclaimed.remove(item)
        paired.append((item, damage))
    return paired


def amount_owed_for(policy, damages):
    """What the incident's damages earn before the policy's cap is applied."""
    return sum(
        payout_for_damage(item, damage)
        for item, damage in damages_against_insured_items(policy, damages)
    )


def claim(policy, damages):
    owed = rounded_payout(amount_owed_for(policy, damages))
    payout = min(owed, policy.remaining_cap)
    policy.remaining_cap -= payout
    return Settlement(payout=payout, remaining_cap=policy.remaining_cap)


def quote_result(step, customer, policies):
    """A quote prices the step's items and opens the policy that covers them."""
    return {"premium": quote(step["items"], customer, previous_contracts=len(policies))}


def claim_result(step, policies):
    """A claim settles an incident against the policy an earlier step created."""
    settlement = claim(policies[step["policy"]], step["incident"]["damages"])
    return {"payout": settlement.payout, "remainingCap": settlement.remaining_cap}


def run_scenario(scenario):
    """Process a customer's steps in order, each claim settling against the
    policy created by an earlier quote step."""
    customer = scenario["customer"]
    policies = {}
    results = []
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            results.append(quote_result(step, customer, policies))
            policies[index] = insure(step["items"])
        else:
            results.append(claim_result(step, policies))
    return {"results": results}
