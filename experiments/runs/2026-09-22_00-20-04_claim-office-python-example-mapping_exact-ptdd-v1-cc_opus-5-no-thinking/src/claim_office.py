"""Premium and payout rules of the Most Honorable Privileged Claims Office."""

import math
from fractions import Fraction

PROCESSING_FEE = 5
PAYOUT_CAP_MULTIPLE = 2
DEDUCTIBLE_PER_DAMAGE = 100
REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8
REDUCED_REIMBURSEMENT_RATE = Fraction(50, 100)

MAIN_ITEM_BASE_PREMIUMS = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
}

MAIN_ITEM_INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
}

COMPONENT_TYPES = frozenset({"rune", "moonstone"})
COMPONENT_BASE_PREMIUM = 25
COMPONENT_INSURANCE_VALUE = 250
BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = 60

CURSE_SURCHARGE_RATE = Fraction(50, 100)
HIGH_ENCHANTMENT_SURCHARGE_RATE = Fraction(30, 100)
HIGH_ENCHANTMENT_LEVEL = 5

LOYALTY_DISCOUNT_RATE = Fraction(20, 100)
LOYALTY_YEARS = 2
FIRST_INSURANCE_SURCHARGE_RATE = Fraction(10, 100)
FOLLOW_UP_CONTRACT_DISCOUNT_RATE = Fraction(15, 100)


def is_component(item_type):
    return item_type in COMPONENT_TYPES


def is_insurable(item_type):
    """The MHPCO covers the main items in its price list and known components."""
    return item_type in MAIN_ITEM_BASE_PREMIUMS or is_component(item_type)


def require_insurable(item_type):
    if not is_insurable(item_type):
        raise ValueError(f"the MHPCO does not insure items of type {item_type!r}")
    return item_type


def base_premium_of_main_item(item_type):
    return MAIN_ITEM_BASE_PREMIUMS[item_type]


def base_premium_of_alike_components(count):
    """A building block of exactly 3 alike components is offered at 60 G."""
    if count == BLOCK_SIZE:
        return BLOCK_BASE_PREMIUM
    return count * COMPONENT_BASE_PREMIUM


def count_by_type(item_types):
    counts = {}
    for item_type in item_types:
        counts[item_type] = counts.get(item_type, 0) + 1
    return counts


def policy_base_premium_of(items):
    """The sum of all item base premiums, with alike components priced in blocks."""
    item_types = [require_insurable(item["type"]) for item in items]
    main_items = [t for t in item_types if not is_component(t)]
    components = [t for t in item_types if is_component(t)]
    premium = sum(base_premium_of_main_item(t) for t in main_items)
    for count in count_by_type(components).values():
        premium += base_premium_of_alike_components(count)
    return premium


def is_cursed(item):
    return item.get("cursed", False)


def is_highly_enchanted(item):
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL


def risk_surcharge_rate_of(item):
    """Curse and high enchantment each add their rate to the item's own premium."""
    rate = Fraction(0)
    if is_cursed(item):
        rate += CURSE_SURCHARGE_RATE
    if is_highly_enchanted(item):
        rate += HIGH_ENCHANTMENT_SURCHARGE_RATE
    return rate


def risk_surcharge_of(item):
    """Only main items carry an individually defined base premium to surcharge.

    Components are priced per alike group by the block rule, so they have no
    individual base premium a risk surcharge could apply to.
    """
    item_type = item["type"]
    if is_component(item_type):
        return Fraction(0)
    return risk_surcharge_rate_of(item) * base_premium_of_main_item(item_type)


def risk_surcharges_of(items):
    """Item-specific surcharges apply to the base premium of the affected item."""
    return sum((risk_surcharge_of(item) for item in items), Fraction(0))


def is_long_standing(customer):
    """Long-standing customers have at least 2 years of business with MHPCO."""
    return customer.get("yearsWithMHPCO", 0) >= LOYALTY_YEARS


def is_follow_up_contract(preceding_contracts):
    """Each contract after the customer's first is a follow-up contract."""
    return preceding_contracts > 0


def policy_modifier_rate_of(customer, preceding_contracts):
    """Policy-wide modifiers apply to the policy base premium.

    Every item in a quote is treated as a first insurance regardless of
    customer history, so the initial assessment surcharge always applies.
    """
    rate = FIRST_INSURANCE_SURCHARGE_RATE
    if is_long_standing(customer):
        rate -= LOYALTY_DISCOUNT_RATE
    if is_follow_up_contract(preceding_contracts):
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    return rate


class Policy:
    """An MHPCO policy: what it insures and how much payout it still allows."""

    def __init__(self, items, insurance_sum):
        self.items = items
        self.insurance_sum = insurance_sum
        self.remaining_cap = PAYOUT_CAP_MULTIPLE * insurance_sum

    def allow_payout_of(self, desired):
        """Pay out at most what the cap still allows, consuming that much of it."""
        payout = min(desired, self.remaining_cap)
        self.remaining_cap -= payout
        return payout


def insurance_value_of(item_type):
    if is_component(item_type):
        return COMPONENT_INSURANCE_VALUE
    return MAIN_ITEM_INSURANCE_VALUES[item_type]


def policy_for(items):
    insurance_sum = sum(insurance_value_of(item["type"]) for item in items)
    return Policy(items=list(items), insurance_sum=insurance_sum)


def has_reduced_reimbursement(item):
    """Damage to items with enchantment level >= 8 is reimbursed at 50 %."""
    return item.get("enchantment", 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL


def require_reportable_damage(damage):
    """A damage event reports an amount of loss, so it cannot be negative."""
    if damage["amount"] < 0:
        raise ValueError(f"a damage amount cannot be negative: {damage['amount']}")
    return damage


def damaged_items_of(policy, damages):
    """Match every damage to a distinct insured item, or reject the whole claim.

    Each damage entry is a separate damage event, so two entries of one type
    need two insured items of that type.
    """
    unclaimed = list(policy.items)
    matched = []
    for damage in damages:
        item_type = damage["itemType"]
        item = next((i for i in unclaimed if i["type"] == item_type), None)
        if item is None:
            raise ValueError(
                f"the policy does not insure a further item of type {item_type!r}"
            )
        unclaimed.remove(item)
        matched.append(item)
    return matched


def reimbursable_amount_of(item, damage_amount):
    """Damage is reimbursed in full, or at 50 % under the enchantment clause.

    Dragon material is fully reimbursed, which is also the standard treatment,
    so the clause needs no separate branch; the enchantment clause wins where
    both apply.
    """
    if has_reduced_reimbursement(item):
        return REDUCED_REIMBURSEMENT_RATE * damage_amount
    return damage_amount


def reimbursement_for(item, damage):
    """Reimburse the damage under its clause, then apply the deductible."""
    return reimbursable_amount_of(item, damage["amount"]) - DEDUCTIBLE_PER_DAMAGE


def settle_claim(policy, incident):
    damages = [require_reportable_damage(damage) for damage in incident["damages"]]
    items = damaged_items_of(policy, damages)
    desired = rounded_in_mhpco_favor_down(
        sum(
            reimbursement_for(item, damage)
            for item, damage in zip(items, damages, strict=True)
        )
    )
    return policy.allow_payout_of(desired)


def rounded_in_mhpco_favor_up(amount):
    """A premium is rounded up to whole G; intermediate amounts stay exact."""
    return math.ceil(amount)


def rounded_in_mhpco_favor_down(amount):
    """A payout is rounded down to whole G; intermediate amounts stay exact."""
    return math.floor(amount)


def quote_premium(items, customer=None, preceding_contracts=0):
    customer = customer or {}
    policy_base_premium = policy_base_premium_of(items)
    modifier_rate = policy_modifier_rate_of(customer, preceding_contracts)
    premium = policy_base_premium + risk_surcharges_of(items)
    premium += modifier_rate * policy_base_premium
    return rounded_in_mhpco_favor_up(premium + PROCESSING_FEE)


def quote_step_result(step, customer, concluded_contracts):
    """Quote the step's items and record the resulting policy."""
    premium = quote_premium(
        items=step["items"],
        customer=customer,
        preceding_contracts=concluded_contracts,
    )
    return {"premium": premium}, policy_for(items=step["items"])


def claim_step_result(step, policies):
    """Settle the step's incident against the policy the quote step created."""
    policy = policies[step["policy"]]
    payout = settle_claim(policy, step["incident"])
    return {"payout": payout, "remainingCap": policy.remaining_cap}


def run_scenario(scenario):
    """Process the customer's steps in order, one result per step."""
    customer = scenario["customer"]
    policies = {}
    results = []
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            result, policies[index] = quote_step_result(step, customer, len(policies))
        else:
            result = claim_step_result(step, policies)
        results.append(result)
    return {"results": results}
