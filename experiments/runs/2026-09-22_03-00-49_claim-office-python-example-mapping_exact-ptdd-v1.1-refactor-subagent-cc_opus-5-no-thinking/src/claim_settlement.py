"""How the office settles claims against a policy."""

import math
from fractions import Fraction

from tariff import insurance_value_of

PAYOUT_CAP_MULTIPLE = 2
DEDUCTIBLE_PER_DAMAGE = 100
HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL = 8
HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = Fraction(1, 2)
DRAGON_MATERIAL = "dragon"
DRAGON_MATERIAL_REIMBURSEMENT_RATE = Fraction(1)
STANDARD_REIMBURSEMENT_RATE = Fraction(1)


def item_insurance_value(item):
    """An item is insured at its tariff value, taken from its declared type alone.

    Risk properties such as a curse or a high enchantment rate the premium, not
    the insured value, so they deliberately play no part here.
    """
    return insurance_value_of(item["type"])


def insurance_sum(items):
    """The insurance sum is the sum of the covered items' insurance values."""
    return sum(item_insurance_value(item) for item in items)


def payout_cap(items):
    """The total payout per policy is capped at twice the insurance sum."""
    return PAYOUT_CAP_MULTIPLE * insurance_sum(items)


def is_highly_enchanted_for_reimbursement(item):
    """Damage to items at enchantment level 8 or above is reimbursed at 50 %."""
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL


def is_of_dragon_material(item):
    """Damage to items made of dragon material is fully reimbursed."""
    return item.get("material") == DRAGON_MATERIAL


def reimbursement_rate(item):
    """The office's reimbursement clauses, in the order they take precedence.

    Two clauses can grant a rate to one item. The office states that the high
    enchantment clause wins over dragon material, so it is asked first and the
    clauses never accumulate. An item no clause speaks for is reimbursed in
    full, which is the office's standard treatment and not the dragon clause.
    """
    if is_highly_enchanted_for_reimbursement(item):
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    if is_of_dragon_material(item):
        return DRAGON_MATERIAL_REIMBURSEMENT_RATE
    return STANDARD_REIMBURSEMENT_RATE


def reimbursable_amount(item, amount):
    """The share of a damage amount the office reimburses before the deductible."""
    return reimbursement_rate(item) * amount


def is_admissible_damage_amount(amount):
    """The office entertains a damage only for an amount it could have suffered.

    A negative amount is not a smaller loss but no loss at all, so it states
    nothing the office could settle.
    """
    return amount >= 0


def damage_amount_of(damage):
    """What a damage entry reports as lost, once the office admits the figure.

    A damage the office does not admit is inadmissible and the whole claim is
    rejected, in the same way as a damage no covered item answers for.
    """
    amount = damage["amount"]
    if not is_admissible_damage_amount(amount):
        raise ValueError(f"negative damage amount: {amount}")
    return amount


def damage_payout(item, damage):
    """The office pays the reimbursable share of one damage, less the deductible.

    A deductible of 100 G applies per damage event, so an incident that damages
    two insured items bears it once for each of them.
    """
    return reimbursable_amount(item, damage_amount_of(damage)) - DEDUCTIBLE_PER_DAMAGE


def item_answering_for(unclaimed, item_type):
    """Which still-unclaimed covered item answers for a damage of this type.

    The office settles a damage against any covered item of the damaged type
    that no earlier damage in the same incident has already claimed; it draws
    them in the order the policy lists them. A damage no such item answers for
    is inadmissible and the whole claim is rejected. An unknown type needs no
    separate check: the tariff already refused it when the policy was quoted,
    so no policy can cover one.
    """
    item = next((item for item in unclaimed if item["type"] == item_type), None)
    if item is None:
        raise ValueError(f"item not covered by the policy: {item_type}")
    return item


def damaged_items(items, damages):
    """Each damage entry is settled against a distinct covered item of its type.

    The office works through the incident damage by damage, setting aside each
    item it has settled against so that a later damage cannot claim it twice.
    """
    unclaimed = list(items)
    matched = []
    for damage in damages:
        item = item_answering_for(unclaimed, damage["itemType"])
        unclaimed.remove(item)
        matched.append(item)
    return matched


def rounded_down_in_office_favour(payout):
    """Payouts are rounded down to whole G, in the MHPCO's favour."""
    return math.floor(payout)


def exact_payout(items, damages):
    """A claim is settled damage by damage; the payout is the sum of the parts."""
    return sum(
        (
            damage_payout(item, damage)
            for item, damage in zip(damaged_items(items, damages), damages, strict=True)
        ),
        Fraction(0),
    )


def settle_claim(items, damages):
    """What the claim is assessed at, before any limit the policy imposes."""
    return rounded_down_in_office_favour(exact_payout(items, damages))


def limited_to_remaining_cap(assessed_payout, remaining_cap):
    """The cap limits a claim rather than rejecting it: the office pays what is
    left of the cap and the claim is settled for that, so the remaining cap
    falls by exactly what was paid and never below zero.
    """
    payout = min(assessed_payout, remaining_cap)
    return payout, remaining_cap - payout


def settle_claim_against_cap(items, damages, remaining_cap):
    """A claim is assessed on its own merits, then limited by what the policy has left."""
    return limited_to_remaining_cap(settle_claim(items, damages), remaining_cap)
