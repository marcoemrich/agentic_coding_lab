"""Claim processing for MHPCO policies."""

from fractions import Fraction

DEDUCTIBLE = 100
HIGH_ENCHANTMENT_CLAIM_LEVEL = 8
HIGH_ENCHANTMENT_SHARE = Fraction(1, 2)
DRAGON_MATERIAL = "dragon"


def round_down(amount):
    """Payouts round in the MHPCO's favour."""
    return Fraction(amount) // 1


def damage_payout(item, amount):
    """Reimbursement for a single damaged item, after its own deductible.

    The high-enchantment clause takes precedence over dragon material when
    both apply; the deductible is taken last.
    """
    reimbursed = Fraction(amount)
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL:
        reimbursed *= HIGH_ENCHANTMENT_SHARE
    return max(Fraction(0), reimbursed - DEDUCTIBLE)
