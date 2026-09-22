"""The MHPCO's policy management: quoting premiums and processing claims."""

import math
from collections import Counter
from fractions import Fraction

# The MHPCO price list: what it charges, and what it insures an item for.
BASE_PREMIUMS = {"sword": 100, "amulet": 60, "staff": 80, "potion": 40}
INSURANCE_VALUES = {"sword": 1000, "amulet": 600, "staff": 800, "potion": 400}
COMPONENT_TYPES = ("rune", "moonstone")
COMPONENT_BASE_PREMIUM = 25
COMPONENT_INSURANCE_VALUE = 250
BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = 60

# Premium modifiers: the first two apply to an item, the rest to a policy.
CURSE_SURCHARGE = Fraction(50, 100)
HIGH_ENCHANTMENT_SURCHARGE = Fraction(30, 100)
HIGH_ENCHANTMENT_LEVEL = 5
LOYALTY_DISCOUNT = Fraction(20, 100)
LOYALTY_YEARS = 2
FIRST_INSURANCE_SURCHARGE = Fraction(10, 100)
FOLLOW_UP_CONTRACT_DISCOUNT = Fraction(15, 100)
PROCESSING_FEE = 5

# Claim settlement.
DEDUCTIBLE = 100
CAP_MULTIPLE = 2
HIGH_ENCHANTMENT_REIMBURSEMENT = Fraction(50, 100)
HIGH_ENCHANTMENT_DAMAGE_LEVEL = 8


class ClaimOfficeError(Exception):
    """The MHPCO refuses a scenario it cannot process under its rules."""


def run_scenario(scenario):
    """Process a scenario's steps for one customer and return their results."""
    customer = scenario["customer"]
    results = []
    policies = {}
    contracts_held = 0
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            results.append(quote(step, customer, contracts_held))
            policies[index] = open_policy(step["items"])
            contracts_held += 1
        else:
            results.append(settle_claim(step["incident"], policies[step["policy"]]))
    return results


def open_policy(items):
    """Record what a policy insures and how much the MHPCO may ever pay out."""
    insurance_sum = sum(item_insurance_value(item) for item in items)
    return {
        "items": items,
        "remaining_cap": CAP_MULTIPLE * insurance_sum,
    }


def item_insurance_value(item):
    """Look up the value the MHPCO insures an item for."""
    if item["type"] in COMPONENT_TYPES:
        return COMPONENT_INSURANCE_VALUE
    return INSURANCE_VALUES[item["type"]]


def reject_uninsurable_items(items):
    """Refuse a quote for anything outside the MHPCO's product range."""
    for item in items:
        if item["type"] not in BASE_PREMIUMS and item["type"] not in COMPONENT_TYPES:
            raise ClaimOfficeError(f"the MHPCO does not insure a {item['type']}")


def settle_claim(incident, policy):
    """Pay a damage report against a policy, within its remaining cap."""
    reject_inadmissible_damages(incident["damages"], policy["items"])
    reimbursable = sum(
        reimbursement(damage, insured_item(damage, policy))
        for damage in incident["damages"]
    )
    payout = round_payout_in_mhpco_favour(
        min(reimbursable, policy["remaining_cap"])
    )
    policy["remaining_cap"] -= payout
    return {"payout": payout, "remainingCap": policy["remaining_cap"]}


def reject_inadmissible_damages(damages, insured_items):
    """Refuse a damage report the MHPCO will not entertain at all."""
    for damage in damages:
        if damage["amount"] < 0:
            raise ClaimOfficeError(
                f"a damage of {damage['amount']} G is not a loss"
            )
    insured = Counter(item["type"] for item in insured_items)
    reported = Counter(damage["itemType"] for damage in damages)
    for item_type, count in reported.items():
        if count > insured[item_type]:
            raise ClaimOfficeError(
                f"the policy insures {insured[item_type]} {item_type}(s), "
                f"but the claim reports {count} damaged"
            )


def insured_item(damage, policy):
    """Find the insured item a damage report refers to."""
    return next(
        item for item in policy["items"] if item["type"] == damage["itemType"]
    )


def reimbursement(damage, item):
    """Reimburse one damaged item, after the MHPCO's deductible.

    A damage smaller than the deductible earns nothing; the MHPCO never
    charges a customer for making a claim.
    """
    return max(0, reimbursable_damage(damage["amount"], item) - DEDUCTIBLE)


def reimbursable_damage(amount, item):
    """Apply the MHPCO's special clauses to the reported damage amount.

    Dragon material is reimbursed in full, which is also what a damage
    covered by no clause earns, so the clause needs no branch of its own;
    where it meets a high enchantment, the 50 % clause takes precedence.
    """
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_DAMAGE_LEVEL:
        return amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    return amount


def quote(step, customer, contracts_held):
    """Compute the premium for the items a customer wishes to insure."""
    reject_uninsurable_items(step["items"])
    base_premium = policy_base_premium(step["items"])
    premium = (
        base_premium
        + item_risk_surcharges(step["items"])
        + base_premium * policy_modifier_rate(customer, contracts_held)
    )
    return {"premium": round_premium_in_mhpco_favour(premium + PROCESSING_FEE)}


def policy_base_premium(items):
    """Total the base premiums of a policy's items, pricing component blocks."""
    main_items = [item for item in items if item["type"] not in COMPONENT_TYPES]
    components = Counter(
        item["type"] for item in items if item["type"] in COMPONENT_TYPES
    )
    return sum(item_base_premium(item) for item in main_items) + sum(
        components_base_premium(count) for count in components.values()
    )


def policy_modifier_rate(customer, contracts_held):
    """State the combined rate of the modifiers that apply to a whole policy."""
    rate = FIRST_INSURANCE_SURCHARGE
    if customer["yearsWithMHPCO"] >= LOYALTY_YEARS:
        rate -= LOYALTY_DISCOUNT
    if contracts_held > 0:
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT
    return rate


def item_risk_surcharges(items):
    """Total the risk surcharges the MHPCO levies on individual items."""
    return sum(item_risk_surcharge(item) for item in items)


def item_risk_surcharge(item):
    """Surcharge one item's own base premium for the risks it carries.

    Components carry neither enchantment nor curse, so only main items
    attract a risk surcharge.
    """
    if item["type"] in COMPONENT_TYPES:
        return 0
    return item_base_premium(item) * risk_surcharge_rate(item)


def risk_surcharge_rate(item):
    """State the combined rate of the risk surcharges an item attracts."""
    rate = Fraction(0)
    if item.get("cursed"):
        rate += CURSE_SURCHARGE
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL:
        rate += HIGH_ENCHANTMENT_SURCHARGE
    return rate


def components_base_premium(count):
    """Price alike components, honouring the block offer for exactly three."""
    if count == BLOCK_SIZE:
        return BLOCK_BASE_PREMIUM
    return count * COMPONENT_BASE_PREMIUM


def item_base_premium(item):
    """Look up a main item's base premium in the MHPCO price list."""
    return BASE_PREMIUMS[item["type"]]


def round_premium_in_mhpco_favour(premium):
    """Round a premium up, since a premium is owed to the MHPCO."""
    return math.ceil(premium)


def round_payout_in_mhpco_favour(payout):
    """Round a payout down, since a payout is owed by the MHPCO."""
    return math.floor(payout)
