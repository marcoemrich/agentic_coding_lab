"""The MHPCO's policy management: quoting premiums and settling claims."""

import math
from collections import Counter
from fractions import Fraction
from typing import NamedTuple

PROCESSING_FEE = 5
FIRST_INSURANCE_SURCHARGE = Fraction(10, 100)
LOYALTY_DISCOUNT = Fraction(20, 100)
LOYALTY_YEARS = 2
FOLLOW_UP_CONTRACT_DISCOUNT = Fraction(15, 100)


class PriceListEntry(NamedTuple):
    """One row of the MHPCO price list: what an item is worth and what it costs to insure."""

    insurance_value: int
    base_premium: int


# The MHPCO price list proper, read off the ledger row by row.
MAIN_ITEM_PRICE_LIST = {
    "sword": PriceListEntry(insurance_value=1000, base_premium=100),
    "amulet": PriceListEntry(insurance_value=600, base_premium=60),
    "staff": PriceListEntry(insurance_value=800, base_premium=80),
    "potion": PriceListEntry(insurance_value=400, base_premium=40),
}

# Components are not listed individually; the office prices every component alike.
COMPONENT_TYPES = {"rune", "moonstone"}
COMPONENT_PRICE = PriceListEntry(insurance_value=250, base_premium=25)
BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = 60

PAYOUT_CAP_MULTIPLE = 2
DEDUCTIBLE = 100
HALF_REIMBURSEMENT_ENCHANTMENT = 8
HALF_REIMBURSEMENT_SHARE = Fraction(50, 100)

CURSE_SURCHARGE = Fraction(50, 100)
HIGH_ENCHANTMENT_SURCHARGE = Fraction(30, 100)
HIGH_ENCHANTMENT_LEVEL = 5


def alike_components_base_premium(count):
    """Return the base premium in G for `count` alike components.

    A building block of exactly 3 alike components is offered at a special
    price; otherwise each component is charged individually.
    """
    if count == BLOCK_SIZE:
        return BLOCK_BASE_PREMIUM
    return count * COMPONENT_PRICE.base_premium


def is_component(item):
    """Return whether `item` is a component rather than a main item."""
    return item["type"] in COMPONENT_TYPES


def alike_kind(component):
    """Return the kind that decides which components count as alike.

    The MHPCO reads "alike" as the very same type: a rune is alike only to
    another rune, never to a moonstone.
    """
    return component["type"]


def alike_component_counts(items):
    """Return how many components of each alike kind are insured."""
    return Counter(alike_kind(item) for item in items if is_component(item))


def price_list_entry(item):
    """Return the price-list row the MHPCO looks `item` up in.

    Components share one row; every other insurable kind is listed by name.
    """
    if is_component(item):
        return COMPONENT_PRICE
    item_type = item["type"]
    if item_type not in MAIN_ITEM_PRICE_LIST:
        raise ValueError(f"The MHPCO does not insure items of type {item_type!r}")
    return MAIN_ITEM_PRICE_LIST[item_type]


def policy_base_premium(items):
    """Return the summed price-list base premium of `items`, in G.

    Main items are priced individually off the price list; components are
    priced per alike group, so that a block can be recognised.
    """
    main_items = [item for item in items if not is_component(item)]

    return sum(price_list_entry(item).base_premium for item in main_items) + sum(
        alike_components_base_premium(count)
        for count in alike_component_counts(items).values()
    )


def item_hazard_surcharge_rate(item):
    """Return the combined surcharge rate the MHPCO charges for `item`'s hazards.

    Every hazard the MHPCO recognises adds its own rate; an item that carries
    several of them is surcharged for each.
    """
    rate = Fraction(0)
    if item.get("cursed", False):
        rate += CURSE_SURCHARGE
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL:
        rate += HIGH_ENCHANTMENT_SURCHARGE
    return rate


def item_risk_surcharge(item):
    """Return the risk surcharge in G that an `item`'s own hazards add.

    The MHPCO has so far only ever declared main items hazardous, so a hazard
    rate is measured against the main-item price list; an item with no hazard
    is never assessed against that list at all.
    """
    surcharge_rate = item_hazard_surcharge_rate(item)
    if surcharge_rate == 0:
        return 0
    return price_list_entry(item).base_premium * surcharge_rate


def policy_risk_surcharge(items):
    """Return the summed item-specific risk surcharges of `items`, in G."""
    return sum(item_risk_surcharge(item) for item in items)


def policy_premium(items, modifier_rate):
    """Return the exact premium in G for `items` under a net policy-wide `modifier_rate`.

    Item-specific risk surcharges are assessed per item, the policy-wide modifiers
    against the policy base premium, and the processing fee escapes both.
    """
    base_premium = policy_base_premium(items)
    return (
        base_premium
        + policy_risk_surcharge(items)
        + base_premium * modifier_rate
        + PROCESSING_FEE
    )


def item_insurance_value(item):
    """Return the insurance value in G the MHPCO puts on a single item."""
    return price_list_entry(item).insurance_value


def insurance_sum(items):
    """Return the summed insurance value of `items`, in G.

    Block discounts affect the premium only, never the insurance sum.
    """
    return sum(item_insurance_value(item) for item in items)


def reimbursed_share(item):
    """Return the share of a damage amount the MHPCO reimburses for `item`.

    The office recognises two reimbursement clauses. A highly enchanted item
    (enchantment level >= 8) is reimbursed at half; an item made of dragon
    material is reimbursed in full. Full reimbursement is what every ordinary
    item already receives, so the dragon-material clause grants nothing beyond
    the default share and needs no rule of its own here. Where both clauses
    meet, the half-reimbursement clause is the one that decides.
    """
    if item.get("enchantment", 0) >= HALF_REIMBURSEMENT_ENCHANTMENT:
        return HALF_REIMBURSEMENT_SHARE
    return Fraction(1)


def owed_to_claimant(reimbursement):
    """Return the part of `reimbursement` the MHPCO actually owes, in G.

    Stingy as the office is, it never bills a claimant for making a claim: a
    damage that falls short of the deductible settles at nothing rather than
    turning into a demand against the claimant. The specification is silent on
    this case; this is the reading the MHPCO has adopted.
    """
    return max(reimbursement, 0)


def damage_settlement(damage, item):
    """Return what a single `damage` to `item` settles at in G.

    The MHPCO reimburses the share its clauses allow and keeps the deductible
    back from every damage event it settles.
    """
    return owed_to_claimant(damage["amount"] * reimbursed_share(item) - DEDUCTIBLE)


def reject_ill_formed_damage_report(damages):
    """Raise if any entry in `damages` is not a damage the MHPCO will take a report on.

    A damage is a loss suffered, so the office refuses to read a negative
    amount as one: such a report is malformed rather than a claim worth nothing.
    """
    for damage in damages:
        amount = damage["amount"]
        if amount < 0:
            raise ValueError(f"A damage cannot report a negative amount: {amount}")


class Policy:
    """One issued contract: what it cost and how much cover it still carries."""

    def __init__(self, premium, insured_items):
        self.premium = premium
        self.insured_items = insured_items
        self.remaining_cap = insurance_sum(insured_items) * PAYOUT_CAP_MULTIPLE

    def damaged_items(self, damages):
        """Return the insured item each damage in `damages` was reported against.

        Every damage event claims a distinct insured item, so a report naming
        more items of a kind than the policy covers strikes nothing.
        """
        unclaimed = list(self.insured_items)
        struck = []
        for damage in damages:
            item_type = damage["itemType"]
            match = next(
                (item for item in unclaimed if item["type"] == item_type), None
            )
            if match is None:
                raise ValueError(
                    f"The policy does not cover a damaged item of type {item_type!r}"
                )
            unclaimed.remove(match)
            struck.append(match)
        return struck

    def incident_settlement(self, damages):
        """Return what `damages` settle at in G before the cap, rounded in the MHPCO's favour.

        Every reported damage is settled against the insured item it was
        reported on, and the incident settles at their sum.
        """
        struck = self.damaged_items(damages)
        return math.floor(
            sum(
                damage_settlement(damage, item)
                for damage, item in zip(damages, struck, strict=True)
            )
        )

    def draw_on_remaining_cap(self, settlement):
        """Return the part of `settlement` the remaining cover pays, and consume it.

        The MHPCO never pays out more than the cover a policy still carries, so a
        settlement beyond it is reduced to whatever cover is left.
        """
        payout = min(settlement, self.remaining_cap)
        self.remaining_cap -= payout
        return payout

    def claim(self, damages):
        """Return the payout in G for `damages`, limited by the cover that remains.

        A report the office will not take is rejected before any cover is drawn
        on, so a rejected claim leaves the policy's remaining cover untouched.
        """
        reject_ill_formed_damage_report(damages)
        return self.draw_on_remaining_cap(self.incident_settlement(damages))


class ClaimOffice:
    """Issues quotes and settles claims for one customer."""

    def __init__(self, years_with_mhpco):
        self.years_with_mhpco = years_with_mhpco
        self.contracts_issued = 0

    def policy_modifier_rate(self):
        """Return the net policy-wide modifier rate applied to the base premium."""
        rate = FIRST_INSURANCE_SURCHARGE
        if self.years_with_mhpco >= LOYALTY_YEARS:
            rate -= LOYALTY_DISCOUNT
        if self.contracts_issued > 0:
            rate -= FOLLOW_UP_CONTRACT_DISCOUNT
        return rate

    def record_contract_issued(self):
        """Note that one more contract now stands, which makes the next one a follow-up."""
        self.contracts_issued += 1

    def insure(self, items):
        """Issue a policy over `items` and return it."""
        # The contract being issued is priced on the customer's history so far; only
        # then does it join that history and make the next contract a follow-up.
        modifier_rate = self.policy_modifier_rate()
        self.record_contract_issued()
        premium = math.ceil(policy_premium(items, modifier_rate))
        return Policy(premium, items)

    def quote(self, items):
        """Return the premium in G for insuring `items`, rounded up in the MHPCO's favour."""
        return self.insure(items).premium
