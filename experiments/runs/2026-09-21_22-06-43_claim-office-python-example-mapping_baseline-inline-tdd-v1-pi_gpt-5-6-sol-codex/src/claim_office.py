"""Domain logic for the Most Honorable Privileged Claims Office."""

from __future__ import annotations

from collections import Counter, defaultdict
from dataclasses import dataclass
from fractions import Fraction
import math
from typing import Any


MAIN_ITEMS = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
}
COMPONENTS = {"rune", "moonstone"}
KNOWN_ITEMS = set(MAIN_ITEMS) | COMPONENTS
COMPONENT_BLOCK_SIZE = 3
HIGH_PREMIUM_ENCHANTMENT = 5
HIGH_CLAIM_ENCHANTMENT = 8
LOYALTY_YEARS = 2
DEDUCTIBLE = 100


class InvalidScenario(ValueError):
    """Raised when an operation cannot be processed safely."""


def _is_integer(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def _item_type(item: dict[str, Any]) -> str:
    item_type = item.get("type")
    if item_type not in KNOWN_ITEMS:
        raise InvalidScenario(f"unknown item type: {item_type!r}")
    return item_type


def _validate_item(item: Any) -> None:
    if not isinstance(item, dict):
        raise InvalidScenario("each insured item must be an object")
    _item_type(item)
    if "material" in item and not isinstance(item["material"], str):
        raise InvalidScenario("item material must be a string")
    if "enchantment" in item and not _is_integer(item["enchantment"]):
        raise InvalidScenario("item enchantment must be an integer")
    if "cursed" in item and not isinstance(item["cursed"], bool):
        raise InvalidScenario("item cursed flag must be boolean")


def _base_premium(items: list[dict[str, Any]]) -> int:
    for item in items:
        _validate_item(item)
    types = [_item_type(item) for item in items]
    counts = Counter(types)
    main_total = sum(MAIN_ITEMS[item_type][1] for item_type in types if item_type in MAIN_ITEMS)
    component_total = sum(
        60 if counts[kind] == COMPONENT_BLOCK_SIZE else 25 * counts[kind]
        for kind in COMPONENTS
    )
    return main_total + component_total


def premium_for(
    items: list[dict[str, Any]], *, years_with_mhpco: int, contract_number: int
) -> int:
    """Calculate a quote, preserving fractional amounts until final rounding."""
    if not isinstance(items, list):
        raise InvalidScenario("quote items must be an array")
    if not _is_integer(years_with_mhpco):
        raise InvalidScenario("yearsWithMHPCO must be an integer")
    if not _is_integer(contract_number) or contract_number < 1:
        raise InvalidScenario("contract number must be a positive integer")
    base = _base_premium(items)
    premium = Fraction(base)

    for item in items:
        item_type = _item_type(item)
        if item_type not in MAIN_ITEMS:
            continue
        item_base = MAIN_ITEMS[item_type][1]
        if item.get("cursed", False):
            premium += Fraction(item_base, 2)
        enchantment = item.get("enchantment")
        if enchantment is not None and enchantment >= HIGH_PREMIUM_ENCHANTMENT:
            premium += Fraction(item_base * 3, 10)

    if years_with_mhpco >= LOYALTY_YEARS:
        premium -= Fraction(base, 5)
    premium += Fraction(base, 10)  # Every quoted item is a first insurance.
    if contract_number > 1:
        premium -= Fraction(base * 15, 100)
    premium += 5
    return math.ceil(premium)


def _insurance_sum(items: list[dict[str, Any]]) -> int:
    total = 0
    for item in items:
        item_type = _item_type(item)
        total += 250 if item_type in COMPONENTS else MAIN_ITEMS[item_type][0]
    return total


@dataclass
class _Policy:
    items: list[dict[str, Any]]
    remaining_cap: int


def _items_by_type(items: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in items:
        grouped[_item_type(item)].append(item)
    return grouped


def _desired_payout(policy: _Policy, damages: list[dict[str, Any]]) -> int:
    insured = _items_by_type(policy.items)
    used: Counter[str] = Counter()
    reimbursement = Fraction(0)

    # Validate the complete claim before calculating any part of it.
    for damage in damages:
        if not isinstance(damage, dict):
            raise InvalidScenario("each damage must be an object")
        item_type = damage.get("itemType")
        amount = damage.get("amount")
        if item_type not in KNOWN_ITEMS:
            raise InvalidScenario(f"unknown damaged item type: {item_type!r}")
        if not isinstance(amount, int) or isinstance(amount, bool) or amount < 0:
            raise InvalidScenario("damage amount must be a non-negative integer")
        if used[item_type] >= len(insured.get(item_type, [])):
            raise InvalidScenario(f"item is not covered by policy: {item_type!r}")
        used[item_type] += 1

    used.clear()
    for damage in damages:
        item_type = damage["itemType"]
        item = insured[item_type][used[item_type]]
        used[item_type] += 1
        amount = Fraction(damage["amount"])
        if (
            item_type in MAIN_ITEMS
            and item.get("enchantment", 0) >= HIGH_CLAIM_ENCHANTMENT
        ):
            amount /= 2
        reimbursement += max(amount - DEDUCTIBLE, 0)
    return math.floor(reimbursement)


class ClaimOffice:
    """Process the sequential operations in one customer scenario."""

    def process(self, scenario: dict[str, Any]) -> list[dict[str, int]]:
        if not isinstance(scenario, dict):
            raise InvalidScenario("scenario must be an object")
        customer = scenario.get("customer")
        steps = scenario.get("steps")
        if not isinstance(customer, dict) or "yearsWithMHPCO" not in customer:
            raise InvalidScenario("scenario requires a customer")
        years = customer["yearsWithMHPCO"]
        if not _is_integer(years):
            raise InvalidScenario("yearsWithMHPCO must be an integer")
        if not isinstance(steps, list):
            raise InvalidScenario("scenario steps must be an array")

        policies: dict[int, _Policy] = {}
        results: list[dict[str, int]] = []
        quote_count = 0
        for step_index, step in enumerate(steps):
            if not isinstance(step, dict):
                raise InvalidScenario("each step must be an object")
            operation = step.get("op")
            if operation == "quote":
                items = step.get("items")
                if not isinstance(items, list):
                    raise InvalidScenario("quote items must be an array")
                quote_count += 1
                premium = premium_for(
                    items, years_with_mhpco=years, contract_number=quote_count
                )
                policies[step_index] = _Policy(items.copy(), 2 * _insurance_sum(items))
                results.append({"premium": premium})
            elif operation == "claim":
                result = self._claim(step, policies)
                results.append(result)
            else:
                raise InvalidScenario(f"unknown operation: {operation!r}")
        return results

    @staticmethod
    def _claim(
        step: dict[str, Any], policies: dict[int, _Policy]
    ) -> dict[str, int]:
        policy_index = step.get("policy")
        if not _is_integer(policy_index) or policy_index not in policies:
            raise InvalidScenario("claim must reference an earlier quote step")
        incident = step.get("incident")
        if not isinstance(incident, dict):
            raise InvalidScenario("claim incident must be an object")
        if not isinstance(incident.get("cause"), str):
            raise InvalidScenario("claim incident requires a cause")
        if not isinstance(incident.get("damages"), list):
            raise InvalidScenario("claim incident requires a damages array")

        policy = policies[policy_index]
        payout = min(_desired_payout(policy, incident["damages"]), policy.remaining_cap)
        policy.remaining_cap -= payout
        return {"payout": payout, "remainingCap": policy.remaining_cap}
