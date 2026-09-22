"""Claim processing: what the MHPCO pays out for a damage report."""

import math
from collections import Counter
from fractions import Fraction

from catalogue import require_known_type
from errors import ScenarioError

DEDUCTIBLE = 100
HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8
HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = Fraction(50, 100)


def reimbursement_rate(item):
    """Rate at which a damage is reimbursed before the deductible.

    The 50 % high-enchantment clause wins when it competes with the
    dragon-material clause; otherwise damage is reimbursed in full.
    """
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD:
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    return Fraction(1)


def damage_payout(item, amount):
    reimbursed = reimbursement_rate(item) * Fraction(amount)
    return max(Fraction(0), reimbursed - DEDUCTIBLE)


def match_damaged_items(items, damages):
    """The insured item behind each damage entry, in the order of `damages`.

    Each damage entry consumes one insured item of its type, so two damages to
    the same type need two insured items of that type.
    """
    available = Counter(item["type"] for item in items)
    matched = []
    for damage in damages:
        item_type = damage["itemType"]
        require_known_type(item_type)
        if damage["amount"] < 0:
            raise ScenarioError(f"negative damage amount for {item_type!r}")
        if available[item_type] < 1:
            raise ScenarioError(f"{item_type!r} is not covered by this policy")
        available[item_type] -= 1
        matched.append(next(i for i in items if i["type"] == item_type))
    return matched


def process_claim(items, damages, remaining_cap):
    """Payout for one incident and the cap left on the policy afterwards.

    The payout is rounded down, in the MHPCO's favour, and never exceeds the
    cap the policy has left.
    """
    damaged_items = match_damaged_items(items, damages)
    desired = sum(
        (
            damage_payout(item, damage["amount"])
            for item, damage in zip(damaged_items, damages, strict=True)
        ),
        Fraction(0),
    )
    payout = min(math.floor(desired), remaining_cap)
    return payout, remaining_cap - payout
