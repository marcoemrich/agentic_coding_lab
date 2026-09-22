import math


PROCESSING_FEE = 5
DEDUCTIBLE = 100
CAP_MULTIPLIER = 2
CLAIM_ENCHANTMENT_THRESHOLD = 8
HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.50
BASE_PREMIUM = {"sword": 100, "amulet": 60, "staff": 80, "potion": 40, "rune": 25, "moonstone": 25}
INSURANCE_VALUE = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
    "rune": 250,
    "moonstone": 250,
}
INITIAL_ASSESSMENT_RATE = 0.10
CURSE_SURCHARGE_RATE = 0.50
ENCHANTMENT_SURCHARGE_RATE = 0.30
PREMIUM_ENCHANTMENT_THRESHOLD = 5
LOYALTY_YEARS_THRESHOLD = 2
LOYALTY_DISCOUNT_RATE = 0.20
FOLLOW_UP_DISCOUNT_RATE = 0.15
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_SAVING = 15
COMPONENT_TYPES = ("rune", "moonstone")


def policy_base_premium(items):
    base = sum(BASE_PREMIUM[item["type"]] for item in items)
    for component_type in COMPONENT_TYPES:
        if sum(item["type"] == component_type for item in items) == COMPONENT_BLOCK_SIZE:
            base -= COMPONENT_BLOCK_SAVING
    return base


def item_risk_surcharge(item):
    rate = CURSE_SURCHARGE_RATE if item.get("cursed", False) else 0
    if item.get("enchantment", 0) >= PREMIUM_ENCHANTMENT_THRESHOLD:
        rate += ENCHANTMENT_SURCHARGE_RATE
    return BASE_PREMIUM[item["type"]] * rate


def policy_wide_adjustment(base, years_with_mhpco, is_follow_up):
    adjustment = base * INITIAL_ASSESSMENT_RATE
    if years_with_mhpco >= LOYALTY_YEARS_THRESHOLD:
        adjustment -= base * LOYALTY_DISCOUNT_RATE
    if is_follow_up:
        adjustment -= base * FOLLOW_UP_DISCOUNT_RATE
    return adjustment


def quote_premium(items, years_with_mhpco=0, is_follow_up=False):
    base = policy_base_premium(items)
    risk_surcharge = sum(item_risk_surcharge(item) for item in items)
    adjustment = policy_wide_adjustment(base, years_with_mhpco, is_follow_up)
    return math.ceil(base + risk_surcharge + adjustment + PROCESSING_FEE)


def create_policy(items):
    insurance_sum = sum(INSURANCE_VALUE[item["type"]] for item in items)
    return {"items": items, "remaining_cap": insurance_sum * CAP_MULTIPLIER}


def damage_reimbursement(item, damage):
    amount = damage["amount"]
    if item.get("enchantment", 0) >= CLAIM_ENCHANTMENT_THRESHOLD:
        amount *= HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    return max(amount - DEDUCTIBLE, 0)


def match_damage_items(policy, damages):
    available_items = list(policy["items"])
    matches = []
    for damage in damages:
        item = next(
            (
                item
                for item in available_items
                if item["type"] == damage["itemType"]
            ),
            None,
        )
        if item is None:
            raise ValueError("damage item is not covered by the policy")
        available_items.remove(item)
        matches.append((item, damage))
    return matches


def validate_damage_amounts(damages):
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def claim_policy(policy, damages):
    validate_damage_amounts(damages)
    matches = match_damage_items(policy, damages)
    desired = sum(damage_reimbursement(item, damage) for item, damage in matches)
    payout = math.floor(min(desired, policy["remaining_cap"]))
    policy["remaining_cap"] -= payout
    return {"payout": payout, "remainingCap": policy["remaining_cap"]}
