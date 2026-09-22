import math
from dataclasses import dataclass
from fractions import Fraction


PROCESSING_FEE = 5
DAMAGE_DEDUCTIBLE = 100
POLICY_CAP_MULTIPLIER = 2
CLAIM_ENCHANTMENT_THRESHOLD = 8
HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = Fraction(1, 2)
INITIAL_ASSESSMENT_RATE = Fraction(1, 10)
CURSE_SURCHARGE_RATE = Fraction(1, 2)
HIGH_ENCHANTMENT_SURCHARGE_RATE = Fraction(3, 10)
PREMIUM_ENCHANTMENT_THRESHOLD = 5
LOYALTY_YEARS_THRESHOLD = 2
LOYALTY_DISCOUNT_RATE = Fraction(1, 5)
FOLLOW_UP_DISCOUNT_RATE = Fraction(15, 100)
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_PREMIUM = 60
COMPONENT_TYPES = ("rune", "moonstone")
INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
    "rune": 250,
    "moonstone": 250,
}
BASE_PREMIUMS = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
    "rune": 25,
    "moonstone": 25,
}


def component_base_premium(component_type, count):
    if count == COMPONENT_BLOCK_SIZE:
        return COMPONENT_BLOCK_PREMIUM
    return BASE_PREMIUMS[component_type] * count


def policy_base_premium(items):
    main_item_premium = sum(
        BASE_PREMIUMS[item["type"]]
        for item in items
        if item["type"] not in COMPONENT_TYPES
    )
    component_premium = sum(
        component_base_premium(
            component_type,
            sum(item["type"] == component_type for item in items),
        )
        for component_type in COMPONENT_TYPES
    )
    return main_item_premium + component_premium


def curse_surcharge(item):
    if not item.get("cursed", False):
        return 0
    return BASE_PREMIUMS[item["type"]] * CURSE_SURCHARGE_RATE


def enchantment_surcharge(item):
    if item.get("enchantment", 0) < PREMIUM_ENCHANTMENT_THRESHOLD:
        return 0
    return BASE_PREMIUMS[item["type"]] * HIGH_ENCHANTMENT_SURCHARGE_RATE


def loyalty_discount(base_premium, years_with_mhpco):
    if years_with_mhpco < LOYALTY_YEARS_THRESHOLD:
        return 0
    return base_premium * LOYALTY_DISCOUNT_RATE


def quote_premium(items, years_with_mhpco, is_follow_up=False):
    base_premium = policy_base_premium(items)
    assessment = base_premium * INITIAL_ASSESSMENT_RATE
    loyalty = loyalty_discount(base_premium, years_with_mhpco)
    follow_up_discount = base_premium * FOLLOW_UP_DISCOUNT_RATE if is_follow_up else 0
    risk_surcharge = sum(
        curse_surcharge(item) + enchantment_surcharge(item) for item in items
    )
    return math.ceil(
        base_premium
        + assessment
        + risk_surcharge
        - loyalty
        - follow_up_discount
        + PROCESSING_FEE
    )


@dataclass
class Policy:
    items: list
    remaining_cap: int | None = None


def create_policy(items):
    return Policy(items)


def reimbursement_rate(insured_item):
    if insured_item.get("enchantment", 0) >= CLAIM_ENCHANTMENT_THRESHOLD:
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    return 1


def damage_event_payout(insured_item, reported_damage):
    reimbursable_damage = reported_damage["amount"] * reimbursement_rate(insured_item)
    return max(reimbursable_damage - DAMAGE_DEDUCTIBLE, 0)


def take_insured_item(available_items, item_type):
    for index, item in enumerate(available_items):
        if item["type"] == item_type:
            return available_items.pop(index)
    raise ValueError("damage item is not covered by the policy")


def validate_damage_amounts(damages):
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def settle_claim(policy, incident):
    validate_damage_amounts(incident["damages"])
    if policy.remaining_cap is None:
        insurance_sum = sum(INSURANCE_VALUES[item["type"]] for item in policy.items)
        policy.remaining_cap = insurance_sum * POLICY_CAP_MULTIPLIER
    desired_payout = 0
    available_items = policy.items.copy()
    for reported_damage in incident["damages"]:
        insured_item = take_insured_item(
            available_items, reported_damage["itemType"]
        )
        desired_payout += damage_event_payout(insured_item, reported_damage)
    payout = math.floor(min(desired_payout, policy.remaining_cap))
    policy.remaining_cap -= payout
    return {"payout": payout, "remainingCap": policy.remaining_cap}


def process_scenario(scenario):
    years_with_mhpco = scenario["customer"]["yearsWithMHPCO"]
    results = []
    policies = {}
    quote_count = 0
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            results.append(
                {
                    "premium": quote_premium(
                        step["items"], years_with_mhpco, is_follow_up=quote_count > 0
                    )
                }
            )
            policies[index] = create_policy(step["items"])
            quote_count += 1
        else:
            results.append(settle_claim(policies[step["policy"]], step["incident"]))
    return {"results": results}
