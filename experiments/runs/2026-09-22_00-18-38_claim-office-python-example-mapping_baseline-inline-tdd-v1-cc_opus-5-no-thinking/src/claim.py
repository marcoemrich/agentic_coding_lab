"""Claim processing against an existing MHPCO policy."""

from fractions import Fraction

DEDUCTIBLE = 100
HALF_REIMBURSEMENT_THRESHOLD = 8
HALF_REIMBURSEMENT_RATE = Fraction(1, 2)

class InvalidDamage(Exception):
    """Raised when a damage report is not a well-formed claim."""


def _round_in_office_favour(amount):
    """Payouts are rounded down — the MHPCO never rounds against itself."""
    return amount.numerator // amount.denominator


def _reimbursement(item, amount):
    """Reimbursable share of one damage, before the deductible.

    Highly enchanted items are reimbursed at half. Everything else --
    including dragon material, which the price list singles out for full
    reimbursement -- is reimbursed in full, so the 50 % clause wins
    whenever both would apply.
    """
    if item.get("enchantment", 0) >= HALF_REIMBURSEMENT_THRESHOLD:
        return amount * HALF_REIMBURSEMENT_RATE
    return amount


def process_claim(policy, damages):
    """Payout for one incident; consumes the policy's remaining cap."""
    for damage in damages:
        if damage["amount"] < 0:
            raise InvalidDamage(f"negative damage amount: {damage['amount']}")
    desired = Fraction(0)
    for item, damage in policy.match_damages(damages):
        reimbursed = _reimbursement(item, Fraction(damage["amount"]))
        desired += max(Fraction(0), reimbursed - DEDUCTIBLE)
    payout = _round_in_office_favour(min(desired, policy.remaining_cap))
    policy.remaining_cap -= payout
    return {"payout": payout, "remainingCap": policy.remaining_cap}
