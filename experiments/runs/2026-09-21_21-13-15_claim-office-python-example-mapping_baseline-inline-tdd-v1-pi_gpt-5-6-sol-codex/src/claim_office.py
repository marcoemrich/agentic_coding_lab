"""Business rules for the MHPCO claim office."""

from collections import Counter, defaultdict
from fractions import Fraction
from typing import Any


PRICE_LIST = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
    "rune": (250, 25),
    "moonstone": (250, 25),
}
COMPONENT_TYPES = {"rune", "moonstone"}
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_PREMIUM = 60
DEDUCTIBLE = 100
CAP_MULTIPLIER = 2
LOYALTY_YEARS = 2
HIGH_ENCHANTMENT_PREMIUM = 5
HIGH_ENCHANTMENT_CLAIM = 8


class ClaimOfficeError(ValueError):
    """Raised when a scenario cannot be processed."""


def _is_integer(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def _require_object(value: Any, description: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ClaimOfficeError(f"{description} must be an object")
    return value


def _validate_item(raw_item: Any) -> dict[str, Any]:
    item = _require_object(raw_item, "item")
    item_type = item.get("type")
    if item_type not in PRICE_LIST:
        raise ClaimOfficeError(f"unknown item type: {item_type!r}")
    if "enchantment" in item and not _is_integer(item["enchantment"]):
        raise ClaimOfficeError("item enchantment must be an integer")
    if "cursed" in item and not isinstance(item["cursed"], bool):
        raise ClaimOfficeError("item cursed flag must be a boolean")
    if "material" in item and not isinstance(item["material"], str):
        raise ClaimOfficeError("item material must be a string")
    return dict(item)


def _item_bases(items: list[dict[str, Any]]) -> list[Fraction]:
    counts = Counter(entry["type"] for entry in items)
    bases = []
    for entry in items:
        item_type = entry["type"]
        if item_type in COMPONENT_TYPES and counts[item_type] == COMPONENT_BLOCK_SIZE:
            bases.append(Fraction(COMPONENT_BLOCK_PREMIUM, COMPONENT_BLOCK_SIZE))
        else:
            bases.append(Fraction(PRICE_LIST[item_type][1]))
    return bases


def _round_up(amount: Fraction) -> int:
    return -(-amount.numerator // amount.denominator)


def _premium(items: list[dict[str, Any]], years: int, followup: bool) -> int:
    bases = _item_bases(items)
    policy_base = sum(bases, Fraction())
    amount = policy_base
    for entry, base in zip(items, bases, strict=True):
        if entry.get("cursed", False):
            amount += base * Fraction(1, 2)
        if entry.get("enchantment", 0) >= HIGH_ENCHANTMENT_PREMIUM:
            amount += base * Fraction(3, 10)
    if years >= LOYALTY_YEARS:
        amount -= policy_base * Fraction(1, 5)
    amount += policy_base * Fraction(1, 10)
    if followup:
        amount -= policy_base * Fraction(3, 20)
    return _round_up(amount + 5)


def _insurance_sum(items: list[dict[str, Any]]) -> int:
    return sum(PRICE_LIST[entry["type"]][0] for entry in items)


def _parse_quote(step: dict[str, Any]) -> list[dict[str, Any]]:
    raw_items = step.get("items")
    if not isinstance(raw_items, list):
        raise ClaimOfficeError("quote items must be an array")
    return [_validate_item(entry) for entry in raw_items]


def _desired_payout(item: dict[str, Any], amount: int) -> Fraction:
    reimbursement = Fraction(amount)
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_CLAIM:
        reimbursement /= 2
    return max(reimbursement - DEDUCTIBLE, Fraction())


def _validate_damages(raw_damages: Any) -> list[dict[str, Any]]:
    if not isinstance(raw_damages, list):
        raise ClaimOfficeError("incident damages must be an array")
    damages = []
    for raw_damage in raw_damages:
        damage = _require_object(raw_damage, "damage")
        item_type = damage.get("itemType")
        if item_type not in PRICE_LIST:
            raise ClaimOfficeError(f"unknown damaged item type: {item_type!r}")
        amount = damage.get("amount")
        if not _is_integer(amount) or amount < 0:
            raise ClaimOfficeError("damage amount must be a non-negative integer")
        damages.append(damage)
    return damages


def _claim(policy: dict[str, Any], step: dict[str, Any]) -> dict[str, int]:
    incident = _require_object(step.get("incident"), "claim incident")
    if not isinstance(incident.get("cause"), str):
        raise ClaimOfficeError("incident cause must be a string")
    damages = _validate_damages(incident.get("damages"))

    insured_by_type: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for entry in policy["items"]:
        insured_by_type[entry["type"]].append(entry)
    used: Counter[str] = Counter()
    desired = Fraction()
    for damage in damages:
        item_type = damage["itemType"]
        occurrence = used[item_type]
        if occurrence >= len(insured_by_type[item_type]):
            raise ClaimOfficeError(f"damage to uninsured item: {item_type}")
        desired += _desired_payout(
            insured_by_type[item_type][occurrence], damage["amount"]
        )
        used[item_type] += 1

    payout = min(desired.numerator // desired.denominator, policy["remaining_cap"])
    policy["remaining_cap"] -= payout
    return {"payout": payout, "remainingCap": policy["remaining_cap"]}


def process_scenario(raw_scenario: Any) -> dict[str, list[dict[str, int]]]:
    """Process quote and claim steps sequentially and return their results."""
    scenario = _require_object(raw_scenario, "scenario")
    customer = _require_object(scenario.get("customer"), "customer")
    years = customer.get("yearsWithMHPCO")
    if not _is_integer(years):
        raise ClaimOfficeError("yearsWithMHPCO must be an integer")
    steps = scenario.get("steps")
    if not isinstance(steps, list):
        raise ClaimOfficeError("steps must be an array")

    results: list[dict[str, int]] = []
    policies: dict[int, dict[str, Any]] = {}
    quote_count = 0
    for index, raw_step in enumerate(steps):
        step = _require_object(raw_step, "step")
        operation = step.get("op")
        if operation == "quote":
            items = _parse_quote(step)
            results.append({"premium": _premium(items, years, quote_count > 0)})
            policies[index] = {
                "items": items,
                "remaining_cap": CAP_MULTIPLIER * _insurance_sum(items),
            }
            quote_count += 1
        elif operation == "claim":
            policy_index = step.get("policy")
            if not _is_integer(policy_index) or policy_index not in policies:
                raise ClaimOfficeError("claim must reference an earlier quote step")
            results.append(_claim(policies[policy_index], step))
        else:
            raise ClaimOfficeError(f"unknown operation: {operation!r}")
    return {"results": results}
