"""Premium and claim calculations for the MHPCO Claim Office."""

import math
from collections import Counter
from dataclasses import dataclass

PROCESSING_FEE = 5
FIRST_INSURANCE_SURCHARGE_RATE = 0.1
CURSE_SURCHARGE_RATE = 0.5
LOYALTY_DISCOUNT_RATE = 0.2
LOYALTY_YEARS = 2
FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15
HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3
HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5

COMPONENT_TYPES = ("rune", "moonstone")
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_BASE_PREMIUM = 60

CUSTOMER_WITHOUT_HISTORY = {"yearsWithMHPCO": 0}


@dataclass(frozen=True)
class PriceListEntry:
    """One row of the MHPCO price list: what an item is worth and what it costs.

    The price list quotes the two figures together per item type ("Sword:
    1000 G insurance value, 100 G base premium"), and a tariff revision moves
    them as one row, so they are held as one row here rather than as two
    parallel tables that have to be kept key-aligned by hand.
    """

    base_premium: int
    insurance_value: int


PRICE_LIST = {
    "sword": PriceListEntry(base_premium=100, insurance_value=1000),
    "amulet": PriceListEntry(base_premium=60, insurance_value=600),
    "staff": PriceListEntry(base_premium=80, insurance_value=800),
    "potion": PriceListEntry(base_premium=40, insurance_value=400),
    "rune": PriceListEntry(base_premium=25, insurance_value=250),
    "moonstone": PriceListEntry(base_premium=25, insurance_value=250),
}


def reject_item_types_not_in_the_price_list(items):
    """Reject a policy covering any item the MHPCO does not underwrite."""
    for item in items:
        item_type = item["type"]
        if item_type not in PRICE_LIST:
            raise ValueError(f"unknown item type: {item_type}")


def base_premium_of(item_type):
    """Return what the price list charges to insure one item of ``item_type``."""
    return PRICE_LIST[item_type].base_premium


def insurance_value_of(item_type):
    """Return what the price list insures one item of ``item_type`` for."""
    return PRICE_LIST[item_type].insurance_value


def group_of_alike_items(item):
    """Return the MHPCO's grouping key for "alike" items: the item's type.

    The price list offers the block rate for "3 alike components". Alike means
    the same item type, not merely the same family: 2 runes and 1 moonstone are
    not alike and form no block.
    """
    return item["type"]


def forms_a_block(item_type, count):
    """Say whether ``count`` alike items qualify for the MHPCO building block."""
    return item_type in COMPONENT_TYPES and count == COMPONENT_BLOCK_SIZE


def alike_items_base_premium(item_type, count):
    """Price ``count`` alike items, honouring the block of 3 alike components."""
    if forms_a_block(item_type, count):
        return COMPONENT_BLOCK_BASE_PREMIUM
    return count * base_premium_of(item_type)


def share_of_alike_items_base_premium(item_type, count):
    """Return one alike item's share of what its whole alike group is priced at.

    The price list quotes a block of 3 alike components as one lump sum and says
    nothing about how that lump splits between the components. The MHPCO shares
    it evenly, so an item-level surcharge is levied on the surcharged item's
    share rather than on the whole block.
    """
    return alike_items_base_premium(item_type, count) / count


def item_base_premiums(items):
    """Return each item's share of the policy base premium, in item order."""
    groups = [group_of_alike_items(item) for item in items]
    sizes = Counter(groups)
    return [share_of_alike_items_base_premium(group, sizes[group]) for group in groups]


def curse_surcharge(item, base_premium):
    """Return the risk surcharge the MHPCO levies on a cursed item."""
    if item.get("cursed"):
        return base_premium * CURSE_SURCHARGE_RATE
    return 0


def high_enchantment_surcharge(item, base_premium):
    """Return the risk surcharge the MHPCO levies on a highly enchanted item."""
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL:
        return base_premium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    return 0


def item_specific_modifiers(items, base_premiums):
    """Total the modifiers the MHPCO levies on individual items.

    The price list distinguishes item-specific modifiers (curse, high
    enchantment), which are levied on the base premium of the affected item
    alone, from policy-wide modifiers, which are levied on the policy base
    premium. This is the item-specific group.
    """
    return sum(
        curse_surcharge(item, item_base) + high_enchantment_surcharge(item, item_base)
        for item, item_base in zip(items, base_premiums, strict=True)
    )


def first_insurance_surcharge(base_premium):
    """Return the initial assessment surcharge the MHPCO levies on a new policy.

    Every item in a quote is treated as a first insurance regardless of customer
    history, so the surcharge is levied on the whole policy base premium.
    """
    return base_premium * FIRST_INSURANCE_SURCHARGE_RATE


@dataclass(frozen=True)
class CustomerStanding:
    """What the MHPCO knows about a customer when it quotes them.

    The price list grants two discounts off the customer's record rather than
    off the items quoted: loyalty for years of business, and a follow-up rate
    for each contract after the first. Both read this record and nothing else,
    so they travel together as one concept.
    """

    years_with_mhpco: int = 0
    previous_contracts: int = 0

    @classmethod
    def of(cls, customer, previous_contracts):
        """Read a customer's standing from a scenario's customer record."""
        return cls(customer.get("yearsWithMHPCO", 0), previous_contracts)


def loyalty_discount(standing, base_premium):
    """Return the discount the MHPCO grants a long-standing customer."""
    if standing.years_with_mhpco >= LOYALTY_YEARS:
        return base_premium * LOYALTY_DISCOUNT_RATE
    return 0


def follow_up_contract_discount(standing, base_premium):
    """Return the discount the MHPCO grants on each contract after the first."""
    if standing.previous_contracts >= 1:
        return base_premium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    return 0


def policy_wide_modifiers(standing, base_premium):
    """Return the net policy-wide modifier: surcharges less discounts.

    The counterpart of :func:`item_specific_modifiers`: the price list levies
    these on the policy base premium, the sum of all item base premiums, rather
    than on any one item. Surcharges raise the premium and discounts lower it,
    so each is stated as a positive amount and the two groups are netted here.
    """
    surcharges = first_insurance_surcharge(base_premium)
    discounts = loyalty_discount(standing, base_premium) + follow_up_contract_discount(
        standing, base_premium
    )
    return surcharges - discounts


def premium_rounded_in_mhpcos_favor(premium):
    """Round a fractional premium to whole G in the MHPCO's favor.

    Rounding in the MHPCO's favor means a different direction on each side of
    the ledger: a premium is money owed to the MHPCO, so a fraction is rounded
    up. Only the final premium is rounded; intermediate amounts stay fractional.
    """
    return math.ceil(premium)


def quote_premium(items, customer=CUSTOMER_WITHOUT_HISTORY, previous_contracts=0):
    """Return the premium in G for a policy covering ``items``.

    A quote is always quoted to a customer; ``customer`` defaults to one the
    MHPCO has no history with, which earns no loyalty discount.
    """
    reject_item_types_not_in_the_price_list(items)
    standing = CustomerStanding.of(customer, previous_contracts)
    base_premiums = item_base_premiums(items)
    policy_base_premium = sum(base_premiums)
    return premium_rounded_in_mhpcos_favor(
        policy_base_premium
        + item_specific_modifiers(items, base_premiums)
        + policy_wide_modifiers(standing, policy_base_premium)
        + PROCESSING_FEE
    )


# --- Claim settlement ------------------------------------------------------
#
# The price list above governs what a policy costs and what it insures. The
# rules below govern what the MHPCO pays out against that policy, and they
# change independently of the tariff: a revised curse surcharge does not touch
# the cap, and a revised cap multiple does not touch any premium.

PAYOUT_CAP_MULTIPLE = 2
DEDUCTIBLE_PER_DAMAGE = 100
HIGH_ENCHANTMENT_CLAIM_LEVEL = 8
HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5
DRAGON_MATERIAL = "dragon"
DRAGON_MATERIAL_REIMBURSEMENT_RATE = 1
FULL_REIMBURSEMENT_RATE = 1


def insurance_sum(items):
    """Return the insurance sum in G for a policy covering ``items``.

    The price list insures each item at its own insurance value; premium
    modifiers and the component block discount do not change it.
    """
    reject_item_types_not_in_the_price_list(items)
    return sum(insurance_value_of(item["type"]) for item in items)


def payout_cap(items):
    """Return the total payout the MHPCO caps a policy at, in G.

    The cap is twice the insurance sum. Premium modifiers such as a curse
    surcharge raise the premium but never the insured value, so they do not
    raise the cap.
    """
    return PAYOUT_CAP_MULTIPLE * insurance_sum(items)


def is_highly_enchanted(damaged_item):
    """Say whether the MHPCO's high-enchantment clause covers ``damaged_item``."""
    return damaged_item.get("enchantment", 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL


def is_made_of_dragon_material(damaged_item):
    """Say whether the MHPCO's dragon-material clause covers ``damaged_item``."""
    return damaged_item.get("material") == DRAGON_MATERIAL


def reimbursement_rate(damaged_item):
    """Return the rate the MHPCO's reimbursement clauses set for a damaged item.

    The two clauses are tried in the order the MHPCO applies them. Both can
    cover the same item -- a dragon-material sword enchanted to 9 -- and then
    the high-enchantment clause wins, so it is asked first. The dragon-material
    clause reimburses in full, which is also what an item under no clause at all
    receives; it is stated here anyway because it is a clause the MHPCO can
    revise on its own, and a revision needs somewhere to land.
    """
    if is_highly_enchanted(damaged_item):
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    if is_made_of_dragon_material(damaged_item):
        return DRAGON_MATERIAL_REIMBURSEMENT_RATE
    return FULL_REIMBURSEMENT_RATE


def reimbursable_amount(damaged_item, damage):
    """Return the share of a damage the MHPCO reimburses before the deductible."""
    return damage["amount"] * reimbursement_rate(damaged_item)


def reimbursement_less_deductible(reimbursement):
    """Retain the MHPCO's deductible from a reimbursement, in G.

    The deductible applies per damage event, and it is retained from the
    reimbursement rather than charged beyond it: a reimbursement smaller than
    the deductible is reduced to nothing, not to a debt owed to the MHPCO. The
    specification does not say so in as many words; it follows from what a
    deductible is -- a reduction of a payout, not a charge in its own right.
    """
    return max(0, reimbursement - DEDUCTIBLE_PER_DAMAGE)


def damage_payout(damaged_item, damage):
    """Return the payout for one damage event, in G.

    One damage event settles in two steps the MHPCO can revise separately: the
    reimbursement clauses decide what share of the damage is covered, and the
    deductible is then retained from that share.
    """
    return reimbursement_less_deductible(reimbursable_amount(damaged_item, damage))


def covers_the_damaged_type(items, damage):
    """Say whether the policy covers any item of the type a damage entry names."""
    return any(item["type"] == damage["itemType"] for item in items)


def reject_damages_of_types_the_policy_does_not_cover(items, damages):
    """Reject the claim if it names a type the policy does not cover at all.

    The entry may name an item the customer never insured or a type the MHPCO
    does not underwrite at all; from the policy's side these are one refusal --
    nothing of that type is covered here.
    """
    for damage in damages:
        if not covers_the_damaged_type(items, damage):
            raise ValueError(
                f"damaged item is not covered by the policy: {damage['itemType']}"
            )


def reject_more_damages_of_a_type_than_the_policy_insures(items, damages):
    """Reject the claim if a type is damaged more often than it is insured.

    A damage entry is a claim against one insured item, so a policy covering one
    sword answers for one damaged sword and no more. Arithmetically this rule
    would also catch a type the policy does not cover at all -- one damaged
    against none insured -- but that is a different refusal with a different
    explanation, and :func:`reject_damages_of_types_the_policy_does_not_cover`
    is the rule that gives it.
    """
    insured = Counter(item["type"] for item in items)
    for item_type, damaged in Counter(damage["itemType"] for damage in damages).items():
        if damaged > insured[item_type]:
            raise ValueError(
                f"more {item_type} damages than the policy covers: "
                f"{damaged} damaged, {insured[item_type]} insured"
            )


def reject_damages_of_a_negative_amount(damages):
    """Reject the whole claim when a damage entry reports a negative amount.

    A damage is what the incident cost the customer, so it cannot be less than
    nothing; the MHPCO refuses the claim rather than reading it as a credit.
    Nothing about the policy bears on this: an amount below nothing is no more
    claimable against a well-stocked policy than against a bare one.
    """
    for damage in damages:
        if damage["amount"] < 0:
            raise ValueError(f"damage amount cannot be negative: {damage['amount']}")


INCIDENT_ADMISSIBILITY_RULES = (reject_damages_of_a_negative_amount,)

COVER_ADMISSIBILITY_RULES = (
    reject_damages_of_types_the_policy_does_not_cover,
    reject_more_damages_of_a_type_than_the_policy_insures,
)


def reject_damages_the_policy_does_not_admit(items, damages):
    """Reject the whole claim unless every MHPCO admissibility rule admits it.

    Admissibility is the MHPCO's decision about the incident as a whole -- the
    specification rejects "the whole claim", not the offending entry -- so it is
    settled before any entry is priced rather than discovered while summing. It
    is also the axis of the claim rules that moves on its own: a further
    admissibility rule joins one of the collections below and leaves the
    reimbursement clauses and the deductible untouched.

    The grounds of refusal fall into two kinds that the MHPCO revises
    separately. An incident rule reads the reported damages alone and refuses
    what is not a damage report at all; a cover rule weighs the reported damages
    against what this policy actually covers. The split is visible in what each
    rule is handed: a rule that is not about the cover is not given it.
    """
    for incident_rule in INCIDENT_ADMISSIBILITY_RULES:
        incident_rule(damages)
    for cover_rule in COVER_ADMISSIBILITY_RULES:
        cover_rule(items, damages)


def any_covered_item_of_the_damaged_type(items, damage):
    """Return a covered item of the type an admissible damage entry names.

    The reimbursement clauses read the damaged item's own enchantment and
    material, so a damage entry has to be resolved to a covered item before it
    can be settled. Resolution is by type alone: the entry names a type, not a
    particular item, and the MHPCO covers every item of that type identically as
    far as the clauses so far are concerned. The item returned is therefore any
    one of that type and is not struck off the cover -- two sword damages
    against two insured swords each resolve to a sword, and so would two sword
    damages against one.
    """
    return next(item for item in items if item["type"] == damage["itemType"])


def claim_payout(items, damages):
    """Return the payout in G the MHPCO makes for an incident against a policy.

    The claim is first admitted or rejected as a whole; only then is it priced.
    Each admitted damage entry names an item type, and the reimbursement clauses
    read the damaged item itself, so every entry is matched to the covered item
    in ``items`` it is claimed against. Each entry is then settled on its own, so
    the deductible is retained once per damaged item rather than once per
    incident, and the incident payout is the sum of those settlements.
    """
    reject_damages_the_policy_does_not_admit(items, damages)
    return sum(
        damage_payout(any_covered_item_of_the_damaged_type(items, damage), damage)
        for damage in damages
    )


class PayoutCap:
    """The finite pot of payout a policy is capped at, and what it has left.

    The MHPCO caps the total payout per policy rather than per claim, so the cap
    is a balance that successive claims draw down, not a limit re-tested from
    scratch each time. Drawing is where that knowledge lives: a draw pays out at
    most the balance, and pays out exactly what it removes from the balance.
    """

    def __init__(self, amount):
        self.remaining = amount

    def draw(self, desired):
        """Draw ``desired`` G from the cap, or whatever is left, and return it."""
        drawn = min(desired, self.remaining)
        self.remaining -= drawn
        return drawn


def payout_rounded_in_mhpcos_favor(payout):
    """Round a fractional payout to whole G in the MHPCO's favor.

    The counterpart of :func:`premium_rounded_in_mhpcos_favor`: a payout is
    money the MHPCO owes, so a fraction is rounded down. Only the final payout
    is rounded; intermediate amounts stay fractional.
    """
    return math.floor(payout)


class Policy:
    """A policy the MHPCO has written, settling claims against its cap."""

    def __init__(self, items):
        self.items = items
        self.cap = PayoutCap(payout_cap(items))

    @property
    def remaining_cap(self):
        """Return the payout the MHPCO still owes this policy at most, in G."""
        return self.cap.remaining

    def settle_claim(self, damages):
        """Settle one incident against this policy and return the payout in G.

        The incident decides what the MHPCO would pay; the cap decides how much
        of that the policy has left to give.
        """
        return self.cap.draw(
            payout_rounded_in_mhpcos_favor(claim_payout(self.items, damages))
        )
