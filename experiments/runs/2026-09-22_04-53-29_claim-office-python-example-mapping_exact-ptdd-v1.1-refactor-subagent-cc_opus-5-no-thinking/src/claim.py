"""Payout calculation for damage claims against MHPCO policies."""

from fractions import Fraction

from quote import insurance_sum
from rejection import ScenarioRejected
from rounding import money_paid_out_rounded_in_mhpco_favour

EXCESS = 100
NO_DAMAGE = 0

# The MHPCO caps what a policy may ever pay out at a multiple of the value it
# insured the items for. How large that multiple is, is the office's own
# decision, independent of how a single damage event is settled.
CAP_MULTIPLIER = 2

COVER_REDUCING_ENCHANTMENT_LEVEL = 8
COVER_REDUCING_ENCHANTMENT_REIMBURSEMENT_RATE = Fraction(1, 2)

FULLY_REIMBURSED_MATERIAL = "dragon"
FULL_REIMBURSEMENT_RATE = Fraction(1)

# What the MHPCO reimburses when no special clause bears on the damage. It
# coincides with full reimbursement today, but it is a separate decision of
# the office and the clause book does not derive one from the other.
STANDARD_REIMBURSEMENT_RATE = Fraction(1)


def has_cover_reducing_enchantment(item):
    """Return whether an item is enchanted highly enough to reduce its cover.

    This is the claims office's own threshold; the underwriting office sets a
    separate, lower one for surcharging the premium.
    """
    return item.get("enchantment", 0) >= COVER_REDUCING_ENCHANTMENT_LEVEL


def is_made_of_fully_reimbursed_material(item):
    """Return whether an item is made of a material covered in full."""
    return item.get("material") == FULLY_REIMBURSED_MATERIAL


def reimbursement_rate(item):
    """Return the share of a damage the MHPCO reimburses for `item`.

    The clause book is consulted in order of precedence. Where both special
    clauses apply the cover-reducing enchantment wins: the MHPCO honours the
    clause least generous to the policy holder. An item no clause bears on is
    reimbursed at the standard rate.
    """
    if has_cover_reducing_enchantment(item):
        return COVER_REDUCING_ENCHANTMENT_REIMBURSEMENT_RATE
    if is_made_of_fully_reimbursed_material(item):
        return FULL_REIMBURSEMENT_RATE
    return STANDARD_REIMBURSEMENT_RATE


def reimbursed_amount(amount, item):
    """Return the share in G of a damage the MHPCO reimburses, before the excess.

    Special clauses may reduce this share for the damaged item; with no
    clause in play the MHPCO reimburses the damage in full.
    """
    return reimbursement_rate(item) * amount


def after_excess(reimbursement):
    """Return what is left of a reimbursement once the excess is borne.

    The MHPCO makes the policy holder bear a fixed excess per damage event,
    however the reimbursed share was arrived at. The excess reduces a payout
    at most to nothing; it never turns into a demand on the policy holder.
    """
    return max(reimbursement - EXCESS, 0)


def take_covered_item(unclaimed, item_type):
    """Return an insured item of `item_type`, removing it from `unclaimed`.

    An insured item answers one damage entry and is then spoken for, so the
    MHPCO rejects a claim that names a type more often than the policy covers
    it -- as it rejects one naming a type the policy never covered at all.
    """
    for position, item in enumerate(unclaimed):
        if item["type"] == item_type:
            return unclaimed.pop(position)
    raise ScenarioRejected(f"the policy does not cover a damaged {item_type}")


def damaged_items(items, damages):
    """Yield each damage entry together with the insured item it reports on."""
    unclaimed = list(items)
    for damage in damages:
        yield damage, take_covered_item(unclaimed, damage["itemType"])


def reported_damage_amount(damage):
    """Return the damage amount in G a damage entry reports.

    A damage event destroys value; an amount below nothing is not a damage
    the MHPCO can settle, so the claims office rejects the whole claim.
    """
    amount = damage["amount"]
    if amount < NO_DAMAGE:
        raise ScenarioRejected(f"a damage cannot amount to {amount} G")
    return amount


def damage_payout(damage, item):
    """Return the payout in G for one damage event.

    The MHPCO settles a damage event in two steps: it decides what share of
    the damage it reimburses, and only then deducts the per-event excess.
    """
    return after_excess(reimbursed_amount(reported_damage_amount(damage), item))


def claim_payout(items, damages):
    """Return the payout in G for the damages reported against the items."""
    settlement = sum(
        damage_payout(damage, item) for damage, item in damaged_items(items, damages)
    )
    return money_paid_out_rounded_in_mhpco_favour(settlement)


def policy_cap(items):
    """Return the total payout in G a policy covering `items` may ever reach.

    The cap follows the insurance sum, not the premium: discounts and
    surcharges change what a policy costs, never what it may pay out.
    """
    return CAP_MULTIPLIER * insurance_sum(items)


def claim_against_cap(items, damages, remaining_cap):
    """Return the payout in G for a claim and the cap left on the policy.

    The MHPCO pays out at most what is left of the policy's cap, so a claim
    that would exceed it is reduced to the remainder.
    """
    payout = min(claim_payout(items, damages), remaining_cap)
    return payout, remaining_cap - payout
