"""Premium and claim rules for the MHPCO claim office."""

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
COMPONENT_TYPES = {"rune", "moonstone"}
ALL_TYPES = set(MAIN_ITEMS) | COMPONENT_TYPES
COMPONENT_VALUE = 250
COMPONENT_PREMIUM = 25
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_PREMIUM = 60
PROCESSING_FEE = 5
DEDUCTIBLE = 100
LOYALTY_YEARS = 2
PREMIUM_ENCHANTMENT_THRESHOLD = 5
CLAIM_ENCHANTMENT_THRESHOLD = 8


class InvalidScenario(ValueError):
    """Raised when input cannot be processed under the policy rules."""


@dataclass
class Policy:
    items: list[dict[str, Any]]
    remaining_cap: int


class ClaimOffice:
    """Stateful service for one customer's sequential operations."""

    def __init__(self, years_with_mhpco: int):
        if not _is_integer(years_with_mhpco):
            raise InvalidScenario("yearsWithMHPCO must be an integer")
        self.years_with_mhpco = years_with_mhpco
        self.policies: list[Policy] = []

    def quote(self, items: list[dict[str, Any]]) -> dict[str, int]:
        if not isinstance(items, list):
            raise InvalidScenario("items must be an array")
        validated = [_validate_item(value) for value in items]
        bases = _item_base_premiums(validated)
        policy_base = sum(bases)
        premium = sum(
            _item_adjusted_premium(item, base)
            for item, base in zip(validated, bases, strict=True)
        )
        premium += Fraction(policy_base, 10)  # every quoted item is first insured
        if self.years_with_mhpco >= LOYALTY_YEARS:
            premium -= Fraction(policy_base, 5)
        if self.policies:
            premium -= Fraction(policy_base * 15, 100)
        premium += PROCESSING_FEE

        insurance_sum = sum(_insurance_value(item["type"]) for item in validated)
        self.policies.append(Policy(validated, insurance_sum * 2))
        return {"premium": math.ceil(premium)}

    def claim(self, policy_number: int, damages: list[dict[str, Any]]) -> dict[str, int]:
        if not _is_integer(policy_number) or not 0 <= policy_number < len(self.policies):
            raise InvalidScenario("policy does not refer to an earlier quote")
        if not isinstance(damages, list):
            raise InvalidScenario("incident damages must be an array")
        policy = self.policies[policy_number]
        matched_items = _match_damages(policy.items, damages)

        desired = Fraction()
        for insured_item, damage in zip(matched_items, damages, strict=True):
            amount = damage["amount"]
            reimbursed = (
                Fraction(amount, 2)
                if insured_item.get("enchantment", 0) >= CLAIM_ENCHANTMENT_THRESHOLD
                else Fraction(amount)
            )
            desired += max(reimbursed - DEDUCTIBLE, 0)

        payout = min(math.floor(desired), policy.remaining_cap)
        policy.remaining_cap -= payout
        return {"payout": payout, "remainingCap": policy.remaining_cap}


def process_scenario(scenario: Any) -> dict[str, list[dict[str, int]]]:
    """Validate and process the CLI document atomically."""
    if not isinstance(scenario, dict):
        raise InvalidScenario("input must be an object")
    customer = scenario.get("customer")
    steps = scenario.get("steps")
    if not isinstance(customer, dict) or "yearsWithMHPCO" not in customer:
        raise InvalidScenario("customer.yearsWithMHPCO is required")
    if not isinstance(steps, list):
        raise InvalidScenario("steps must be an array")

    office = ClaimOffice(customer["yearsWithMHPCO"])
    policy_by_step: dict[int, int] = {}
    results: list[dict[str, int]] = []
    for step_index, step in enumerate(steps):
        if not isinstance(step, dict):
            raise InvalidScenario("each step must be an object")
        if step.get("op") == "quote" and "items" in step:
            policy_by_step[step_index] = len(office.policies)
            results.append(office.quote(step["items"]))
        elif step.get("op") == "claim":
            results.append(_process_claim_step(office, step, policy_by_step, step_index))
        else:
            raise InvalidScenario("step has an invalid operation or missing fields")
    return {"results": results}


def _process_claim_step(
    office: ClaimOffice,
    step: dict[str, Any],
    policy_by_step: dict[int, int],
    step_index: int,
) -> dict[str, int]:
    policy_step = step.get("policy")
    incident = step.get("incident")
    if (
        not _is_integer(policy_step)
        or policy_step >= step_index
        or policy_step not in policy_by_step
        or not isinstance(incident, dict)
        or not isinstance(incident.get("cause"), str)
        or "damages" not in incident
    ):
        raise InvalidScenario("claim must refer to an earlier quote and contain an incident")
    return office.claim(policy_by_step[policy_step], incident["damages"])


def _item_base_premiums(items: list[dict[str, Any]]) -> list[int]:
    component_counts = Counter(item["type"] for item in items if item["type"] in COMPONENT_TYPES)
    return [
        (COMPONENT_BLOCK_PREMIUM // COMPONENT_BLOCK_SIZE
         if item["type"] in COMPONENT_TYPES and component_counts[item["type"]] == COMPONENT_BLOCK_SIZE
         else _ordinary_base(item["type"]))
        for item in items
    ]


def _ordinary_base(item_type: str) -> int:
    return COMPONENT_PREMIUM if item_type in COMPONENT_TYPES else MAIN_ITEMS[item_type][1]


def _insurance_value(item_type: str) -> int:
    return COMPONENT_VALUE if item_type in COMPONENT_TYPES else MAIN_ITEMS[item_type][0]


def _item_adjusted_premium(item: dict[str, Any], base: int) -> Fraction:
    amount = Fraction(base)
    if item.get("cursed", False):
        amount += Fraction(base, 2)
    if item.get("enchantment", 0) >= PREMIUM_ENCHANTMENT_THRESHOLD:
        amount += Fraction(base * 3, 10)
    return amount


def _match_damages(items: list[dict[str, Any]], damages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    available: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in items:
        available[item["type"]].append(item)
    used: Counter[str] = Counter()
    matches = []
    for damage in damages:
        if not isinstance(damage, dict):
            raise InvalidScenario("each damage must be an object")
        item_type = damage.get("itemType")
        amount = damage.get("amount")
        if item_type not in ALL_TYPES or not _is_integer(amount) or amount < 0:
            raise InvalidScenario("damage has an invalid itemType or amount")
        occurrence = used[item_type]
        if occurrence >= len(available[item_type]):
            raise InvalidScenario("damaged item is not covered by the policy")
        matches.append(available[item_type][occurrence])
        used[item_type] += 1
    return matches


def _validate_item(item: Any) -> dict[str, Any]:
    if not isinstance(item, dict) or item.get("type") not in ALL_TYPES:
        raise InvalidScenario("quote contains an unknown item type")
    if "enchantment" in item and not _is_integer(item["enchantment"]):
        raise InvalidScenario("enchantment must be an integer")
    if "cursed" in item and not isinstance(item["cursed"], bool):
        raise InvalidScenario("cursed must be a boolean")
    if "material" in item and not isinstance(item["material"], str):
        raise InvalidScenario("material must be a string")
    return dict(item)


def _is_integer(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)
