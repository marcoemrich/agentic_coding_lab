"""Policy management for the Most Honorable Privileged Claims Office."""

import math
from dataclasses import dataclass
from fractions import Fraction


@dataclass(frozen=True)
class Customer:
    """A customer of the MHPCO."""

    years_with_mhpco: int


@dataclass(frozen=True)
class Item:
    """An item a customer wishes to insure."""

    type: str
    material: str = ""
    enchantment: int = 0
    cursed: bool = False


PROCESSING_FEE = 5
FIRST_INSURANCE_SURCHARGE = Fraction(1, 10)
CURSE_SURCHARGE = Fraction(1, 2)
HIGH_ENCHANTMENT_SURCHARGE = Fraction(3, 10)
HIGH_ENCHANTMENT_LEVEL = 5
LOYALTY_DISCOUNT = Fraction(1, 5)
LOYALTY_YEARS = 2
FOLLOW_UP_CONTRACT_DISCOUNT = Fraction(3, 20)
MAIN_ITEM_INSURANCE_VALUES = {"sword": 1000, "amulet": 600, "staff": 800, "potion": 400}
MAIN_ITEM_BASE_PREMIUMS = {"sword": 100, "amulet": 60, "staff": 80, "potion": 40}
COMPONENT_INSURANCE_VALUE = 250
COMPONENT_BASE_PREMIUM = 25
COMPONENT_TYPES = ("rune", "moonstone")
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_BASE_PREMIUM = 60
BASE_PREMIUMS = {
    **MAIN_ITEM_BASE_PREMIUMS,
    **dict.fromkeys(COMPONENT_TYPES, COMPONENT_BASE_PREMIUM),
}
INSURANCE_VALUES = {
    **MAIN_ITEM_INSURANCE_VALUES,
    **dict.fromkeys(COMPONENT_TYPES, COMPONENT_INSURANCE_VALUE),
}
INSURABLE_TYPES = frozenset(BASE_PREMIUMS)
DEDUCTIBLE = 100
FRAGILE_ENCHANTMENT_LEVEL = 8
FRAGILE_ENCHANTMENT_REIMBURSEMENT = Fraction(1, 2)
FULL_REIMBURSEMENT = Fraction(1)
CAP_MULTIPLE = 2


def quote(customer, items, previous_contracts=0):
    """Compute the premium for the items a customer wishes to insure."""
    policy_base_premium = _policy_base_premium(items)
    premium = policy_base_premium * (1 + _policy_modifier_rate(customer, previous_contracts))
    premium += sum(_item_risk_surcharge(item) for item in items)
    return _rounded_premium_in_mhpco_favour(premium + PROCESSING_FEE)


def _policy_modifier_rate(customer, previous_contracts):
    """Net the policy-wide modifiers the MHPCO applies to a customer's premium."""
    rate = FIRST_INSURANCE_SURCHARGE
    if customer.years_with_mhpco >= LOYALTY_YEARS:
        rate -= LOYALTY_DISCOUNT
    if previous_contracts > 0:
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT
    return rate


def _item_risk_surcharge(item):
    """Surcharge the risks an individual item carries, on its own base premium."""
    surcharge_rate = Fraction(0)
    if item.cursed:
        surcharge_rate += CURSE_SURCHARGE
    if item.enchantment >= HIGH_ENCHANTMENT_LEVEL:
        surcharge_rate += HIGH_ENCHANTMENT_SURCHARGE
    return BASE_PREMIUMS[item.type] * surcharge_rate


def _policy_base_premium(items):
    """Sum the base premiums of all items, pricing component blocks as blocks."""
    main_items = [item for item in items if item.type not in COMPONENT_TYPES]
    base_premium = sum(BASE_PREMIUMS[item.type] for item in main_items)
    for component_type in COMPONENT_TYPES:
        count = sum(1 for item in items if item.type == component_type)
        base_premium += _component_group_base_premium(count)
    return base_premium


def _component_group_base_premium(count):
    """Price alike components, granting the block rate for exactly a block."""
    if count == COMPONENT_BLOCK_SIZE:
        return COMPONENT_BLOCK_BASE_PREMIUM
    return count * COMPONENT_BASE_PREMIUM


def _rounded_premium_in_mhpco_favour(premium):
    """Round a premium up, since a higher premium favours the MHPCO."""
    return math.ceil(premium)


def _rounded_payout_in_mhpco_favour(payout):
    """Round a payout down, since a lower payout favours the MHPCO."""
    return math.floor(payout)


def run_scenario(scenario):
    """Process a customer's scenario steps in order, returning one result each."""
    customer = Customer(years_with_mhpco=scenario["customer"]["yearsWithMHPCO"])
    results = []
    policies = {}
    contracts = 0
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            items = [_item_from(described) for described in step["items"]]
            results.append({"premium": quote(customer, items, contracts)})
            policies[index] = Policy(items)
            contracts += 1
        else:
            policy = policies[step["policy"]]
            results.append(claim(policy, step["incident"]))
    return results


class Policy:
    """An issued policy: the items it covers and the cap left to pay out."""

    def __init__(self, items):
        self.items = items
        self.remaining_cap = CAP_MULTIPLE * _insurance_sum(items)

    def pay_out(self, reimbursement):
        """Pay what the cap still allows and record the exhaustion."""
        payout = min(reimbursement, self.remaining_cap)
        self.remaining_cap -= payout
        return payout

    def damaged_items(self, damages):
        """Match every damage to a distinct covered item, or reject the claim."""
        unclaimed = list(self.items)
        matched = []
        for damage in damages:
            item = _take_item_of_type(unclaimed, damage["itemType"])
            matched.append((item, _damage_amount(damage)))
        return matched


def _damage_amount(damage):
    """Read a reported damage amount, which the MHPCO requires to be positive."""
    amount = damage["amount"]
    if amount < 0:
        raise ValueError(f"a damage cannot be for a negative amount: {amount}")
    return amount


def _take_item_of_type(unclaimed, item_type):
    """Claim one covered item of the damaged type, or reject the damage."""
    for index, item in enumerate(unclaimed):
        if item.type == item_type:
            return unclaimed.pop(index)
    raise ValueError(f"no insured {item_type} is left to claim for")


def _insurance_sum(items):
    """Sum the insurance values of the covered items, ignoring premium discounts."""
    return sum(INSURANCE_VALUES[item.type] for item in items)


def claim(policy, incident):
    """Process a damage report against a policy, paying out within its cap."""
    reimbursement = sum(
        _reimbursement(item, amount)
        for item, amount in policy.damaged_items(incident["damages"])
    )
    payout = policy.pay_out(_rounded_payout_in_mhpco_favour(reimbursement))
    return {"payout": payout, "remainingCap": policy.remaining_cap}


def _reimbursement(item, amount):
    """Reimburse one damaged item under its clause, less the MHPCO's deductible."""
    return amount * _reimbursement_rate(item) - DEDUCTIBLE


def _reimbursement_rate(item):
    """Choose the clause governing a damaged item.

    Highly enchanted items are reimbursed at half. Every other item --
    dragon material included -- is reimbursed in full.
    """
    if item.enchantment >= FRAGILE_ENCHANTMENT_LEVEL:
        return FRAGILE_ENCHANTMENT_REIMBURSEMENT
    return FULL_REIMBURSEMENT


def _item_from(described):
    """Translate a described item from the scenario document into an Item."""
    if described["type"] not in INSURABLE_TYPES:
        raise ValueError(f"the MHPCO does not insure items of type {described['type']!r}")
    return Item(
        type=described["type"],
        material=described.get("material", ""),
        enchantment=described.get("enchantment", 0),
        cursed=described.get("cursed", False),
    )
