import math
from collections import Counter
from fractions import Fraction


BASE_PREMIUMS = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
    "rune": 25,
    "moonstone": 25,
}
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_PREMIUM = 60
COMPONENT_TYPES = {"rune", "moonstone"}
LOYALTY_YEARS = 2
LOYALTY_RATE = Fraction(1, 5)
HIGH_ENCHANTMENT_LEVEL = 5
HIGH_ENCHANTMENT_RATE = Fraction(3, 10)
INITIAL_ASSESSMENT_RATE = Fraction(1, 10)
FOLLOW_UP_DISCOUNT_RATE = Fraction(3, 20)
PROCESSING_FEE = 5
DAMAGE_DEDUCTIBLE = 100
CLAIM_ENCHANTMENT_LEVEL = 8
INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
    "rune": 250,
    "moonstone": 250,
}


def component_block_adjustment(item_counts):
    adjustment = 0
    for component_type in COMPONENT_TYPES:
        if item_counts[component_type] == COMPONENT_BLOCK_SIZE:
            individual_total = BASE_PREMIUMS[component_type] * COMPONENT_BLOCK_SIZE
            adjustment += COMPONENT_BLOCK_PREMIUM - individual_total
    return adjustment


def policy_base_premium(items):
    item_counts = Counter(item["type"] for item in items)
    base_premium = sum(BASE_PREMIUMS[item["type"]] for item in items)
    return base_premium + component_block_adjustment(item_counts)


def curse_surcharge(items):
    return sum(
        BASE_PREMIUMS[item["type"]] * Fraction(1, 2)
        for item in items
        if item.get("cursed", False)
    )


def high_enchantment_surcharge(items):
    return sum(
        BASE_PREMIUMS[item["type"]] * HIGH_ENCHANTMENT_RATE
        for item in items
        if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL
    )


def item_risk_surcharge(items):
    return curse_surcharge(items) + high_enchantment_surcharge(items)


def loyalty_discount(base_premium, years_with_mhpco):
    return base_premium * LOYALTY_RATE if years_with_mhpco >= LOYALTY_YEARS else 0


def follow_up_discount(base_premium, is_follow_up):
    return base_premium * FOLLOW_UP_DISCOUNT_RATE if is_follow_up else 0


def calculate_premium(items, years_with_mhpco=0, is_follow_up=False):
    base_premium = policy_base_premium(items)
    premium = base_premium * (1 + INITIAL_ASSESSMENT_RATE)
    premium += item_risk_surcharge(items)
    premium -= loyalty_discount(base_premium, years_with_mhpco)
    premium -= follow_up_discount(base_premium, is_follow_up)
    return math.ceil(premium + PROCESSING_FEE)


def damage_reimbursement(item, amount):
    reimbursement_rate = (
        Fraction(1, 2)
        if item.get("enchantment", 0) >= CLAIM_ENCHANTMENT_LEVEL
        else 1
    )
    return max(0, amount * reimbursement_rate - DAMAGE_DEDUCTIBLE)


def validate_damage_coverage(policy, damages):
    insured_counts = Counter(item["type"] for item in policy["items"])
    damage_counts = Counter(damage["itemType"] for damage in damages)
    if any(count > insured_counts[item_type] for item_type, count in damage_counts.items()):
        raise ValueError("damage item is not covered by the policy")


def validate_damage_amounts(damages):
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def process_claim(policy, damages):
    validate_damage_coverage(policy, damages)
    validate_damage_amounts(damages)
    desired_payout = 0
    for damage in damages:
        insured_item = next(
            item for item in policy["items"] if item["type"] == damage["itemType"]
        )
        desired_payout += damage_reimbursement(insured_item, damage["amount"])
    payout = math.floor(min(desired_payout, policy["remaining_cap"]))
    policy["remaining_cap"] -= payout
    return {"payout": payout, "remainingCap": policy["remaining_cap"]}


def process_scenario(scenario):
    results = []
    policies = {}
    years_with_mhpco = scenario["customer"]["yearsWithMHPCO"]
    quote_count = 0
    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            items = step["items"]
            remaining_cap = 2 * sum(INSURANCE_VALUES[item["type"]] for item in items)
            policies[step_index] = {"items": items, "remaining_cap": remaining_cap}
            premium = calculate_premium(items, years_with_mhpco, quote_count > 0)
            results.append({"premium": premium})
            quote_count += 1
        else:
            policy = policies[step["policy"]]
            results.append(process_claim(policy, step["incident"]["damages"]))
    return {"results": results}
