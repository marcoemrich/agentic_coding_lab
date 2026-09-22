"""Domain logic for the MHPCO claim office."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from fractions import Fraction
import math
from typing import Any


ITEM_PRICES = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
    "rune": (250, 25),
    "moonstone": (250, 25),
}
COMPONENT_TYPES = {"rune", "moonstone"}
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_ITEM_PREMIUM = 20
LOYALTY_YEARS = 2
HIGH_PREMIUM_ENCHANTMENT = 5
HIGH_CLAIM_ENCHANTMENT = 8
DEDUCTIBLE = 100


class ScenarioError(ValueError):
    """Raised when a scenario cannot be processed."""


@dataclass
class Policy:
    items: list[dict[str, Any]]
    remaining_cap: int


class ClaimOffice:
    def __init__(self, years_with_mhpco: int):
        self.years = years_with_mhpco
        self.policies: dict[int, Policy] = {}
        self.quote_count = 0

    def quote(self, items: list[dict[str, Any]], step_index: int | None = None) -> dict[str, int]:
        counts = Counter(item.get("type") for item in items)
        item_bases: list[int] = []
        insurance_sum = 0
        for item in items:
            item_type = item.get("type")
            if item_type not in ITEM_PRICES:
                raise ScenarioError(f"unknown item type: {item_type}")
            value, base = ITEM_PRICES[item_type]
            if item_type in COMPONENT_TYPES and counts[item_type] == COMPONENT_BLOCK_SIZE:
                base = COMPONENT_BLOCK_ITEM_PREMIUM
            item_bases.append(base)
            insurance_sum += value

        policy_base = sum(item_bases)
        premium = Fraction(policy_base)
        premium += Fraction(policy_base, 10)  # initial assessment
        if self.years >= LOYALTY_YEARS:
            premium -= Fraction(policy_base, 5)
        if self.quote_count:
            premium -= Fraction(policy_base * 15, 100)
        for item, base in zip(items, item_bases, strict=True):
            if item.get("cursed", False):
                premium += Fraction(base, 2)
            if item.get("enchantment", 0) >= HIGH_PREMIUM_ENCHANTMENT:
                premium += Fraction(base * 3, 10)

        premium += 5
        policy_key = self.quote_count if step_index is None else step_index
        self.policies[policy_key] = Policy([dict(item) for item in items], insurance_sum * 2)
        self.quote_count += 1
        return {"premium": math.ceil(premium)}

    def claim(self, policy_index: int, damages: list[dict[str, Any]]) -> dict[str, int]:
        try:
            policy = self.policies[policy_index]
        except KeyError as exc:
            raise ScenarioError(f"invalid policy reference: {policy_index}") from exc

        available: dict[str, list[dict[str, Any]]] = {}
        for item in policy.items:
            available.setdefault(item["type"], []).append(item)

        desired = Fraction(0)
        used = Counter()
        for damage in damages:
            item_type = damage.get("itemType")
            amount = damage.get("amount")
            if item_type not in ITEM_PRICES or item_type not in available:
                raise ScenarioError(f"item is not covered by policy: {item_type}")
            if not isinstance(amount, int) or isinstance(amount, bool) or amount < 0:
                raise ScenarioError("damage amount must be a non-negative integer")
            position = used[item_type]
            if position >= len(available[item_type]):
                raise ScenarioError(f"too many damages for item type: {item_type}")
            item = available[item_type][position]
            used[item_type] += 1

            reimbursement = Fraction(amount)
            if item.get("enchantment", 0) >= HIGH_CLAIM_ENCHANTMENT:
                reimbursement /= 2
            desired += max(reimbursement - DEDUCTIBLE, 0)

        payout = min(math.floor(desired), policy.remaining_cap)
        policy.remaining_cap -= payout
        return {"payout": payout, "remainingCap": policy.remaining_cap}


def _require_object(value: Any, name: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ScenarioError(f"{name} must be an object")
    return value


def _require_list(value: Any, name: str) -> list[Any]:
    if not isinstance(value, list):
        raise ScenarioError(f"{name} must be an array")
    return value


def _validate_item(value: Any) -> dict[str, Any]:
    item = _require_object(value, "item")
    if not isinstance(item.get("type"), str):
        raise ScenarioError("item.type must be a string")
    if "material" in item and not isinstance(item["material"], str):
        raise ScenarioError("item.material must be a string")
    enchantment = item.get("enchantment", 0)
    if not isinstance(enchantment, int) or isinstance(enchantment, bool):
        raise ScenarioError("item.enchantment must be an integer")
    if "cursed" in item and not isinstance(item["cursed"], bool):
        raise ScenarioError("item.cursed must be a boolean")
    return item


def _validate_damage(value: Any) -> dict[str, Any]:
    damage = _require_object(value, "damage")
    if not isinstance(damage.get("itemType"), str):
        raise ScenarioError("damage.itemType must be a string")
    amount = damage.get("amount")
    if not isinstance(amount, int) or isinstance(amount, bool):
        raise ScenarioError("damage.amount must be an integer")
    return damage


def process_scenario(value: Any) -> dict[str, list[dict[str, int]]]:
    """Validate and execute one CLI scenario."""
    scenario = _require_object(value, "scenario")
    customer = _require_object(scenario.get("customer"), "customer")
    years = customer.get("yearsWithMHPCO")
    if not isinstance(years, int) or isinstance(years, bool):
        raise ScenarioError("customer.yearsWithMHPCO must be an integer")
    steps = _require_list(scenario.get("steps"), "steps")

    office = ClaimOffice(years)
    results: list[dict[str, int]] = []
    for step_index, raw_step in enumerate(steps):
        step = _require_object(raw_step, "step")
        operation = step.get("op")
        if operation == "quote":
            items = [_validate_item(item) for item in _require_list(step.get("items"), "items")]
            results.append(office.quote(items, step_index))
        elif operation == "claim":
            policy_index = step.get("policy")
            if not isinstance(policy_index, int) or isinstance(policy_index, bool):
                raise ScenarioError("claim.policy must be an integer")
            incident = _require_object(step.get("incident"), "incident")
            if not isinstance(incident.get("cause"), str):
                raise ScenarioError("incident.cause must be a string")
            damages = [
                _validate_damage(damage)
                for damage in _require_list(incident.get("damages"), "incident.damages")
            ]
            results.append(office.claim(policy_index, damages))
        else:
            raise ScenarioError(f"unknown operation: {operation}")
    return {"results": results}
