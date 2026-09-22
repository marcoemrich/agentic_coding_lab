"""Domain model for the MHPCO claim office."""

from collections import Counter, defaultdict
from fractions import Fraction
import math


class InputError(ValueError):
    """Raised when a scenario cannot be processed."""


_ITEM_PRICES = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
    "rune": (250, 25),
    "moonstone": (250, 25),
}
_COMPONENTS = {"rune", "moonstone"}
_LOYALTY_YEARS = 2
_COMPONENT_BLOCK_SIZE = 3
_PREMIUM_ENCHANTMENT_THRESHOLD = 5
_CLAIM_ENCHANTMENT_THRESHOLD = 8
_DEDUCTIBLE = 100


def _is_integer(value):
    return isinstance(value, int) and not isinstance(value, bool)


def _validate_item(item):
    if not isinstance(item, dict):
        raise InputError("each item must be an object")
    item_type = item.get("type")
    if not isinstance(item_type, str) or item_type not in _ITEM_PRICES:
        raise InputError(f"unknown item type: {item_type!r}")
    if "enchantment" in item and not _is_integer(item["enchantment"]):
        raise InputError("item enchantment must be an integer")
    if "cursed" in item and not isinstance(item["cursed"], bool):
        raise InputError("item cursed flag must be a boolean")
    if "material" in item and not isinstance(item["material"], str):
        raise InputError("item material must be a string")


class ClaimOffice:
    """Processes quotes and claims for one customer."""

    def __init__(self, customer):
        if not isinstance(customer, dict) or not _is_integer(customer.get("yearsWithMHPCO")):
            raise InputError("customer.yearsWithMHPCO must be an integer")
        self._years = customer["yearsWithMHPCO"]
        self._policies = []

    def quote(self, items):
        if not isinstance(items, list):
            raise InputError("quote items must be an array")
        for item in items:
            _validate_item(item)

        type_counts = Counter(item["type"] for item in items)
        bases = [self._item_base(item["type"], type_counts) for item in items]
        policy_base = sum(bases, Fraction())
        premium = policy_base
        for item, base in zip(items, bases, strict=True):
            if item.get("cursed", False):
                premium += base * Fraction(1, 2)
            if item.get("enchantment", 0) >= _PREMIUM_ENCHANTMENT_THRESHOLD:
                premium += base * Fraction(3, 10)

        if self._years >= _LOYALTY_YEARS:
            premium -= policy_base * Fraction(1, 5)
        premium += policy_base * Fraction(1, 10)
        if self._policies:
            premium -= policy_base * Fraction(3, 20)
        premium += 5

        cap = 2 * sum(_ITEM_PRICES[item["type"]][0] for item in items)
        self._policies.append({"items": [dict(item) for item in items], "remaining": cap})
        return {"premium": math.ceil(premium)}

    @staticmethod
    def _item_base(item_type, counts):
        base = _ITEM_PRICES[item_type][1]
        if item_type in _COMPONENTS and counts[item_type] == _COMPONENT_BLOCK_SIZE:
            return Fraction(60, _COMPONENT_BLOCK_SIZE)
        return Fraction(base)

    def claim(self, policy_index, damages):
        if not _is_integer(policy_index) or not 0 <= policy_index < len(self._policies):
            raise InputError("claim references an unknown policy")
        if not isinstance(damages, list):
            raise InputError("incident damages must be an array")

        policy = self._policies[policy_index]
        available = defaultdict(list)
        for item in policy["items"]:
            available[item["type"]].append(item)

        used = Counter()
        desired = Fraction()
        for damage in damages:
            item, amount = self._validate_and_match_damage(damage, available, used)
            used[damage["itemType"]] += 1
            reimbursement = Fraction(amount)
            if item.get("enchantment", 0) >= _CLAIM_ENCHANTMENT_THRESHOLD:
                reimbursement *= Fraction(1, 2)
            desired += max(Fraction(), reimbursement - _DEDUCTIBLE)

        payout = math.floor(min(desired, policy["remaining"]))
        policy["remaining"] -= payout
        return {"payout": payout, "remainingCap": policy["remaining"]}

    @staticmethod
    def _validate_and_match_damage(damage, available, used):
        if not isinstance(damage, dict):
            raise InputError("each damage must be an object")
        item_type = damage.get("itemType")
        if not isinstance(item_type, str) or item_type not in _ITEM_PRICES:
            raise InputError(f"unknown damaged item type: {item_type!r}")
        amount = damage.get("amount")
        if not _is_integer(amount) or amount < 0:
            raise InputError("damage amount must be a non-negative integer")
        occurrence = used[item_type]
        if occurrence >= len(available[item_type]):
            raise InputError(f"damaged item is not covered: {item_type}")
        return available[item_type][occurrence], amount
