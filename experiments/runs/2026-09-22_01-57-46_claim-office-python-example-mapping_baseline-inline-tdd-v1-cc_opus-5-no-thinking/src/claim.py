"""Reimbursement rules for a single damage entry."""

from fractions import Fraction

DEDUCTIBLE = 100
HIGH_ENCHANTMENT_THRESHOLD = 8
HIGH_ENCHANTMENT_REIMBURSEMENT = Fraction(50, 100)
FULL_REIMBURSEMENT = Fraction(1)


def reimbursement(item, amount):
    """What a single damage to ``item`` is worth, after the deductible."""
    covered = amount * _reimbursement_rate(item)
    return max(covered - DEDUCTIBLE, 0)


def _reimbursement_rate(item):
    """Highly enchanted items are only half covered.

    Dragon material grants full reimbursement, which is also the default for
    ordinary items, so it only matters that it does not beat the halving rule.
    """
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD:
        return HIGH_ENCHANTMENT_REIMBURSEMENT
    return FULL_REIMBURSEMENT
