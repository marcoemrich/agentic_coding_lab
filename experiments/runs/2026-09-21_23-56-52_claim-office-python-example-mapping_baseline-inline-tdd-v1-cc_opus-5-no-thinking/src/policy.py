"""A policy issued by a quote, and the claims settled against it."""
import math
from fractions import Fraction

import catalogue
import office
from errors import ClaimOfficeError

DEDUCTIBLE = Fraction(100)
CAP_FACTOR = 2
HALF_REIMBURSEMENT_LEVEL = 8
HALF_REIMBURSEMENT = Fraction(1, 2)
DRAGON_MATERIAL = "dragon"


def _reimbursement(item, amount):
    """The share of a damage the MHPCO reimburses, before the deductible."""
    if item.get("enchantment", 0) >= HALF_REIMBURSEMENT_LEVEL:
        return amount * HALF_REIMBURSEMENT
    return amount


class Policy:
    """Covers a fixed list of items and tracks the cap it has left."""

    def __init__(self, items):
        self._items = list(items)
        self.insurance_sum = office.insurance_sum(self._items)
        self.remaining_cap = self.insurance_sum * CAP_FACTOR

    def _matching_items(self, item_type):
        return [item for item in self._items if item["type"] == item_type]

    def _covered_item(self, damage, used):
        item_type = damage["itemType"]
        if not catalogue.is_known(item_type):
            raise ClaimOfficeError(f"unknown item type: {item_type!r}")
        covered = self._matching_items(item_type)
        index = used.get(item_type, 0)
        if index >= len(covered):
            raise ClaimOfficeError(f"{item_type!r} is not covered by this policy")
        used[item_type] = index + 1
        return covered[index]

    def settle(self, damages):
        """Pay out for one incident, consuming the policy's remaining cap."""
        used = {}
        desired = Fraction(0)
        for damage in damages:
            amount = damage["amount"]
            if amount < 0:
                raise ClaimOfficeError(f"negative damage amount: {amount}")
            item = self._covered_item(damage, used)
            reimbursed = _reimbursement(item, Fraction(amount)) - DEDUCTIBLE
            desired += max(reimbursed, Fraction(0))
        payout = math.floor(min(desired, self.remaining_cap))
        self.remaining_cap -= payout
        return payout
