"""A policy created by a quote, and the claims made against it."""

from collections import Counter
from fractions import Fraction

from claims import damage_payout, round_down
from premium import COMPONENT_VALUE, MAIN_ITEMS, is_component

CAP_MULTIPLIER = 2


class ClaimError(Exception):
    """A scenario the MHPCO refuses to process."""


def item_value(item):
    if is_component(item):
        return COMPONENT_VALUE
    return MAIN_ITEMS[item["type"]]["value"]


def validate_types(items):
    known = set(MAIN_ITEMS) | {"rune", "moonstone"}
    for item in items:
        if item["type"] not in known:
            raise ClaimError(f"unknown item type: {item['type']}")


class Policy:
    def __init__(self, items):
        validate_types(items)
        self.items = list(items)
        self.insurance_sum = sum(item_value(item) for item in self.items)
        self.remaining_cap = self.insurance_sum * CAP_MULTIPLIER

    def claim(self, damages):
        covered = self._match(damages)
        total = sum(
            damage_payout(item, damage["amount"])
            for item, damage in zip(covered, damages, strict=True)
        )
        payout = round_down(min(Fraction(total), self.remaining_cap))
        self.remaining_cap -= payout
        return payout

    def _match(self, damages):
        """Assign each damage entry to a distinct insured item of that type."""
        available = Counter(item["type"] for item in self.items)
        matched = []
        for damage in damages:
            if damage["amount"] < 0:
                raise ClaimError("damage amount must not be negative")
            type_ = damage["itemType"]
            if available[type_] <= 0:
                raise ClaimError(f"item not covered by this policy: {type_}")
            available[type_] -= 1
            matched.append(self._item_of_type(type_, matched))
        return matched

    def _item_of_type(self, type_, already_matched):
        used = sum(1 for item in already_matched if item["type"] == type_)
        of_type = [item for item in self.items if item["type"] == type_]
        return of_type[used]
