"""A policy: the items it covers and the cap it has left."""

from collections import Counter

import claim as claim_rules
import pricelist
from rounding import round_in_favour_of_customer

CAP_FACTOR = 2


class ClaimError(Exception):
    """Raised when a claim cannot be processed against this policy."""


class ClaimResult:
    """The outcome of one claim against a policy."""

    def __init__(self, payout, remaining_cap):
        self.payout = payout
        self.remaining_cap = remaining_cap


class Policy:
    """Items insured for one customer, tracking the cap already used up."""

    def __init__(self, customer, items):
        self.customer = customer
        self.items = items
        self.insurance_sum = sum(pricelist.insurance_value(i["type"]) for i in items)
        self.remaining_cap = self.cap

    @property
    def cap(self):
        return CAP_FACTOR * self.insurance_sum

    def claim(self, incident):
        """Process one incident, reducing the remaining cap by the payout."""
        damages = incident["damages"]
        self._reject_negative_amounts(damages)
        self._reject_damages_not_covered(damages)
        desired = sum(
            claim_rules.reimbursement(self._item_for(d["itemType"]), d["amount"])
            for d in damages
        )
        payout = round_in_favour_of_customer(min(desired, self.remaining_cap))
        self.remaining_cap -= payout
        return ClaimResult(payout, self.remaining_cap)

    @staticmethod
    def _reject_negative_amounts(damages):
        for d in damages:
            if d["amount"] < 0:
                raise ClaimError(f"negative damage amount: {d['amount']}")

    def _item_for(self, item_type):
        return next(i for i in self.items if i["type"] == item_type)

    def _reject_damages_not_covered(self, damages):
        """Each damage entry needs an insured item of its own to claim against."""
        insured = Counter(i["type"] for i in self.items)
        claimed = Counter(d["itemType"] for d in damages)
        for item_type, count in claimed.items():
            if count > insured[item_type]:
                raise ClaimError(f"not insured often enough: {item_type}")
