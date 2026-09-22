"""MHPCO claim policy."""

import math
from fractions import Fraction


DEDUCTIBLE = 100
HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8


class UninsuredDamageError(ValueError):
    """A damage event cannot be assigned to an insured item."""


def has_reduced_enchantment_reimbursement(item):
    """Return whether enchantment reduces an item's claim reimbursement."""
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD


def reimbursement_rate(item):
    """Return the reimbursement rate selected by the item's claim clauses."""
    if has_reduced_enchantment_reimbursement(item):
        return Fraction(1, 2)
    return 1


def apply_damage_event_deductible(reimbursable_damage):
    """Apply the deductible for one damage event without producing a loss."""
    return max(reimbursable_damage - DEDUCTIBLE, 0)


def damage_reimbursement(item, damage_amount):
    """Apply reimbursement clauses, then the per-damage-event deductible."""
    reimbursable_damage = damage_amount * reimbursement_rate(item)
    return apply_damage_event_deductible(reimbursable_damage)


def consume_insured_item_for_damage(available_items, damaged_item_type):
    """Consume one insured item of the damaged type."""
    try:
        item = next(
            item for item in available_items if item["type"] == damaged_item_type
        )
    except StopIteration:
        raise UninsuredDamageError(
            f"damage to uninsured item type: {damaged_item_type}"
        ) from None
    available_items.remove(item)
    return item


def matched_damage_events(items, damages):
    """Assign each damage event to one separately insured item."""
    available_items = list(items)
    for damage in damages:
        yield consume_insured_item_for_damage(
            available_items, damage["itemType"]
        ), damage


def desired_claim_payout(items, damages):
    """Value an incident from its separately reimbursed damage events."""
    return sum(
        damage_reimbursement(item, damage["amount"])
        for item, damage in matched_damage_events(items, damages)
    )


def round_payout_in_mhpco_favor(payout):
    """Round a final payout down to whole G in the MHPCO's favor."""
    return math.floor(payout)


def settle_policy_cap(policy, desired_payout):
    """Limit a payout to, and consume it from, the policy's remaining cap."""
    capped_payout = min(desired_payout, policy["remaining_cap"])
    payout = round_payout_in_mhpco_favor(capped_payout)
    policy["remaining_cap"] -= payout
    return payout


def ensure_nonnegative_damage_amounts(damages):
    """Reject a damage report containing a negative amount."""
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def process_claim(policy, damages):
    """Validate, value, and settle a claim against its policy cap."""
    ensure_nonnegative_damage_amounts(damages)
    desired_payout = desired_claim_payout(policy["items"], damages)
    payout = settle_policy_cap(policy, desired_payout)
    return {"payout": payout, "remainingCap": policy["remaining_cap"]}
