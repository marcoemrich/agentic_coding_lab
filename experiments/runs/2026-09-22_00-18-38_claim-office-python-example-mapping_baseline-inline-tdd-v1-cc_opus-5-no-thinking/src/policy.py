"""A policy created by a quote step: insured items and the remaining cap."""

from collections import defaultdict
from pricelist import insurance_value

CAP_MULTIPLIER = 2


class UninsuredDamage(Exception):
    """Raised when a damage does not match an item covered by the policy."""


class Policy:
    def __init__(self, items):
        self.items = list(items)
        self.insurance_sum = sum(
            insurance_value(item["type"]) for item in self.items
        )
        self.remaining_cap = self.insurance_sum * CAP_MULTIPLIER

    def match_damages(self, damages):
        """Pair each damage with a distinct insured item of the same type.

        Every damage entry consumes one covered item, so two damages to a
        type the policy covers only once are rejected outright.
        """
        available = defaultdict(list)
        for item in self.items:
            available[item["type"]].append(item)
        matched = []
        for damage in damages:
            candidates = available[damage["itemType"]]
            if not candidates:
                raise UninsuredDamage(
                    f"no insured item left for damage to: {damage['itemType']}"
                )
            matched.append((candidates.pop(), damage))
        return matched
