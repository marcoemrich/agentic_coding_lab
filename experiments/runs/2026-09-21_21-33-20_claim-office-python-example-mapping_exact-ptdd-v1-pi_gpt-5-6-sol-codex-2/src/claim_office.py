"""MHPCO premium and claim domain behavior."""

import math
from collections import Counter
from fractions import Fraction

PROCESSING_FEE = 5
FIRST_INSURANCE_RATE = Fraction(1, 10)
CURSE_RATE = Fraction(1, 2)
HIGH_ENCHANTMENT_RATE = Fraction(3, 10)
HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5
LOYALTY_RATE = Fraction(1, 5)
LOYALTY_YEARS_THRESHOLD = 2
FOLLOW_UP_CONTRACT_RATE = Fraction(3, 20)
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_PREMIUM = 60
COMPONENT_TYPES = {"rune", "moonstone"}
DEDUCTIBLE = 100
HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8
INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
    "rune": 250,
    "moonstone": 250,
}
ITEM_BASE_PREMIUMS = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
    "rune": 25,
    "moonstone": 25,
}


def _item_risk_surcharge(item: dict) -> Fraction:
    """Calculate risk additions that apply only to one affected item."""
    base_premium = ITEM_BASE_PREMIUMS[item["type"]]
    rate = CURSE_RATE if item.get("cursed", False) else Fraction(0)
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD:
        rate += HIGH_ENCHANTMENT_RATE
    return base_premium * rate


def _damage_payout(item: dict, amount: int) -> Fraction:
    """Apply item reimbursement clauses, then the per-damage deductible."""
    reimbursement = Fraction(amount)
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD:
        reimbursement *= Fraction(1, 2)
    return max(reimbursement - DEDUCTIBLE, Fraction(0))


def _validate_damage_amount(amount: int) -> None:
    """Reject amounts that cannot describe damage."""
    if amount < 0:
        raise ValueError("negative damage amount")


def _take_insured_item(available_items: list[dict], item_type: str) -> dict:
    """Consume one insured occurrence matching a damage entry."""
    if item_type not in INSURANCE_VALUES:
        raise ValueError(f"unknown item type: {item_type}")
    item = next(
        (item for item in available_items if item["type"] == item_type),
        None,
    )
    if item is None:
        raise ValueError(f"item type not insured: {item_type}")
    available_items.remove(item)
    return item


def _policy_base_premium(items: list[dict]) -> int:
    """Price item units, including exact alike-component block offers."""
    type_counts = Counter(item["type"] for item in items)
    total = 0
    for item_type, count in type_counts.items():
        if item_type in COMPONENT_TYPES and count == COMPONENT_BLOCK_SIZE:
            total += COMPONENT_BLOCK_PREMIUM
        else:
            total += ITEM_BASE_PREMIUMS[item_type] * count
    return total


class ClaimOffice:
    """Process one customer's sequential insurance contracts and claims."""

    def __init__(self, years_with_mhpco: int):
        self.years_with_mhpco = years_with_mhpco
        self.contract_count = 0
        self.policies: list[dict] = []

    def _policy_rate(self) -> Fraction:
        """Return customer-wide adjustments to the policy base premium."""
        rate = FIRST_INSURANCE_RATE
        if self.years_with_mhpco >= LOYALTY_YEARS_THRESHOLD:
            rate -= LOYALTY_RATE
        if self.contract_count > 0:
            rate -= FOLLOW_UP_CONTRACT_RATE
        return rate

    def quote(self, items: list[dict]) -> dict[str, int]:
        """Create a policy quote for the supplied items."""
        base_premium = _policy_base_premium(items)
        risk_surcharge = sum(_item_risk_surcharge(item) for item in items)
        premium = (
            base_premium * (1 + self._policy_rate())
            + risk_surcharge
            + PROCESSING_FEE
        )
        self.contract_count += 1
        insurance_sum = sum(INSURANCE_VALUES[item["type"]] for item in items)
        self.policies.append({"items": items, "remaining_cap": 2 * insurance_sum})
        return {"premium": math.ceil(premium)}

    def claim(self, policy_index: int, damages: list[dict]) -> dict[str, int]:
        """Process one damage incident against a quoted policy."""
        policy = self.policies[policy_index]
        available_items = list(policy["items"])
        desired_payout = Fraction(0)
        for damage in damages:
            _validate_damage_amount(damage["amount"])
            item = _take_insured_item(available_items, damage["itemType"])
            desired_payout += _damage_payout(item, damage["amount"])
        payout = math.floor(min(desired_payout, policy["remaining_cap"]))
        policy["remaining_cap"] -= payout
        return {"payout": payout, "remainingCap": policy["remaining_cap"]}
