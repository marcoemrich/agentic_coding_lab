"""The MHPCO's policy management domain."""

import math
from collections import Counter
from dataclasses import dataclass

PROCESSING_FEE = 5

MAIN_ITEM_BASE_PREMIUMS = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
}

MAIN_ITEM_INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
}

COMPONENT_TYPES = frozenset({"rune", "moonstone"})
COMPONENT_BASE_PREMIUM = 25
COMPONENT_INSURANCE_VALUE = 250

INSURABLE_TYPES = frozenset(MAIN_ITEM_BASE_PREMIUMS) | COMPONENT_TYPES

BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = 60

CAP_MULTIPLE_OF_INSURANCE_SUM = 2
DEDUCTIBLE_PER_DAMAGE = 100

HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8
HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5
FULL_REIMBURSEMENT_RATE = 1

CURSE_SURCHARGE_RATE = 0.5
HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3
HIGH_ENCHANTMENT_THRESHOLD = 5

LOYALTY_DISCOUNT_RATE = 0.2
LOYALTY_YEARS_THRESHOLD = 2
FIRST_INSURANCE_SURCHARGE_RATE = 0.1
FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15
CONTRACTS_BEFORE_A_FOLLOW_UP = 1


def _premium_rounded_in_mhpco_favor(premium):
    """Round a premium up: every fraction of a G falls to the MHPCO."""
    return math.ceil(premium)


def _payout_rounded_in_mhpco_favor(payout):
    """Round a payout down: every fraction of a G stays with the MHPCO."""
    return math.floor(payout)


class ClaimOfficeError(Exception):
    """The MHPCO refuses to process the request."""


@dataclass(frozen=True)
class Quote:
    """The premium the MHPCO charges, and the policy the payment creates."""

    premium: int
    insurance_sum: int
    cap: int
    items: tuple


def _component_base_premium(component_counts):
    """Price alike components, offering the block premium for a block of 3."""
    total = 0
    for count in component_counts.values():
        if count == BLOCK_SIZE:
            total += BLOCK_BASE_PREMIUM
        else:
            total += count * COMPONENT_BASE_PREMIUM
    return total


def _item_risk_surcharge(item, item_base_premium):
    """Charge the risk surcharges the item's own condition carries."""
    surcharge = 0
    if item.get("cursed"):
        surcharge += item_base_premium * CURSE_SURCHARGE_RATE
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD:
        surcharge += item_base_premium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    return surcharge


def _policy_modifier(customer, previous_contracts):
    """Adjust the policy base premium for the customer's standing with the MHPCO."""
    modifier = FIRST_INSURANCE_SURCHARGE_RATE
    years = (customer or {}).get("yearsWithMHPCO", 0)
    if years >= LOYALTY_YEARS_THRESHOLD:
        modifier -= LOYALTY_DISCOUNT_RATE
    if previous_contracts >= CONTRACTS_BEFORE_A_FOLLOW_UP:
        modifier -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    return modifier


def _refuse_uninsurable_items(items):
    """Refuse the whole request when it lists an item the MHPCO does not insure."""
    for item in items:
        if item["type"] not in INSURABLE_TYPES:
            raise ClaimOfficeError(
                f"the MHPCO does not insure items of type {item['type']!r}"
            )


def quote(items, customer=None, previous_contracts=0):
    """Compute the premium for the items a customer wishes to insure."""
    _refuse_uninsurable_items(items)
    main_items = [item for item in items if item["type"] not in COMPONENT_TYPES]
    component_counts = Counter(
        item["type"] for item in items if item["type"] in COMPONENT_TYPES
    )
    base_premium = sum(
        MAIN_ITEM_BASE_PREMIUMS[item["type"]] for item in main_items
    ) + _component_base_premium(component_counts)
    risk_surcharge = sum(
        _item_risk_surcharge(item, MAIN_ITEM_BASE_PREMIUMS[item["type"]])
        for item in main_items
    )
    policy_adjustment = base_premium * _policy_modifier(customer, previous_contracts)
    premium = base_premium + risk_surcharge + policy_adjustment + PROCESSING_FEE
    insurance_sum = sum(
        MAIN_ITEM_INSURANCE_VALUES[item["type"]] for item in main_items
    ) + COMPONENT_INSURANCE_VALUE * sum(component_counts.values())
    return Quote(
        premium=_premium_rounded_in_mhpco_favor(premium),
        insurance_sum=insurance_sum,
        cap=insurance_sum * CAP_MULTIPLE_OF_INSURANCE_SUM,
        items=tuple(items),
    )


@dataclass(frozen=True)
class Settlement:
    """What the MHPCO pays out for an incident, and the cap left on the policy."""

    payout: int
    remaining_cap: int


def _reimbursement_rate(item):
    """Choose the reimbursement clause a damaged item earns.

    The MHPCO halves the damage on highly enchanted items. Its dragon-material
    clause reimburses in full, which is also what every other insured item
    receives, so the clause needs no branch of its own; where both clauses
    apply, the specification gives the half-damage clause precedence.
    """
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD:
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    return FULL_REIMBURSEMENT_RATE


def _reimbursement(item, damage_amount):
    """Reimburse one damaged item under the clause its condition earns."""
    return damage_amount * _reimbursement_rate(item)


def _insured_item_for(policy, damage):
    """Find the insured item a damage entry reports against."""
    for insured in policy.items:
        if insured["type"] == damage["itemType"]:
            return insured
    return None


def _refuse_negative_damage_amounts(incident):
    """Refuse the whole claim when a damage reports a negative amount."""
    for damage in incident["damages"]:
        if damage["amount"] < 0:
            raise ClaimOfficeError(
                f"a damage amount cannot be negative, but the claim reports "
                f"{damage['amount']}"
            )


def _refuse_damages_beyond_the_policy(policy, incident):
    """Refuse the whole claim when it reports more items than the policy covers."""
    insured_counts = Counter(item["type"] for item in policy.items)
    claimed_counts = Counter(damage["itemType"] for damage in incident["damages"])
    for item_type, claimed in claimed_counts.items():
        insured = insured_counts[item_type]
        if insured == 0:
            raise ClaimOfficeError(
                f"the policy does not cover any item of type {item_type!r}"
            )
        if claimed > insured:
            raise ClaimOfficeError(
                f"the policy covers {insured} item(s) of type {item_type!r}, "
                f"but the claim reports {claimed}"
            )


def _desired_reimbursement(policy, incident):
    """Total what the incident's damages earn, before the policy cap limits it."""
    desired = 0
    for damage in incident["damages"]:
        item = _insured_item_for(policy, damage)
        desired += _reimbursement(item, damage["amount"]) - DEDUCTIBLE_PER_DAMAGE
    return desired


def claim(policy, incident, remaining_cap=None):
    """Settle a damage report against an existing policy."""
    _refuse_negative_damage_amounts(incident)
    _refuse_damages_beyond_the_policy(policy, incident)
    cap_left = policy.cap if remaining_cap is None else remaining_cap
    desired = _desired_reimbursement(policy, incident)
    payout = min(_payout_rounded_in_mhpco_favor(desired), cap_left)
    return Settlement(payout=payout, remaining_cap=cap_left - payout)


@dataclass
class _PolicyRecord:
    """A policy an earlier quote step created, and the cap it has left."""

    policy: Quote
    remaining_cap: int


def _run_quote_step(step, customer, ledger, index):
    """Quote the step's items and record the policy it creates."""
    policy = quote(
        items=step["items"], customer=customer, previous_contracts=len(ledger)
    )
    ledger[index] = _PolicyRecord(policy=policy, remaining_cap=policy.cap)
    return {"premium": policy.premium}


def _run_claim_step(step, ledger):
    """Settle the step's incident against the policy it references."""
    record = ledger[step["policy"]]
    settlement = claim(
        record.policy, step["incident"], remaining_cap=record.remaining_cap
    )
    record.remaining_cap = settlement.remaining_cap
    return {"payout": settlement.payout, "remainingCap": settlement.remaining_cap}


def run_scenario(scenario):
    """Process a scenario's steps in order, one result per step."""
    customer = scenario["customer"]
    ledger = {}
    results = []
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            results.append(_run_quote_step(step, customer, ledger, index))
        else:
            results.append(_run_claim_step(step, ledger))
    return {"results": results}
