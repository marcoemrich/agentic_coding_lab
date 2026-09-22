import math
from collections import Counter
from fractions import Fraction


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
COMPONENT_TYPES = {"rune", "moonstone"}
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_BASE_PREMIUM = 60
CURSE_SURCHARGE_RATE = Fraction(1, 2)
HIGH_ENCHANTMENT_THRESHOLD = 5
HIGH_ENCHANTMENT_SURCHARGE_RATE = Fraction(3, 10)
LOYALTY_YEARS_THRESHOLD = 2
LOYALTY_DISCOUNT_RATE = Fraction(1, 5)
INITIAL_ASSESSMENT_RATE = Fraction(1, 10)
FOLLOWUP_CONTRACT_DISCOUNT_RATE = Fraction(3, 20)
PROCESSING_FEE = 5
DAMAGE_EVENT_DEDUCTIBLE = 100
CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8
POLICY_CAP_MULTIPLIER = 2


def base_premium_for(item_type):
    return BASE_PREMIUMS[item_type]


def qualifies_for_component_block(count):
    return count == COMPONENT_BLOCK_SIZE


def component_group_base_premium(item_type, count):
    if qualifies_for_component_block(count):
        return COMPONENT_BLOCK_BASE_PREMIUM
    return base_premium_for(item_type) * count


def policy_base_premium(items):
    type_counts = Counter(item["type"] for item in items)
    premium = 0
    for item_type, count in type_counts.items():
        if item_type in COMPONENT_TYPES:
            premium += component_group_base_premium(item_type, count)
        else:
            premium += base_premium_for(item_type) * count
    return premium


def cursed_item_surcharge(item):
    if not item.get("cursed", False):
        return 0
    return base_premium_for(item["type"]) * CURSE_SURCHARGE_RATE


def is_highly_enchanted(item):
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD


def high_enchantment_surcharge(item):
    if not is_highly_enchanted(item):
        return 0
    return base_premium_for(item["type"]) * HIGH_ENCHANTMENT_SURCHARGE_RATE


def item_risk_surcharge(item):
    return cursed_item_surcharge(item) + high_enchantment_surcharge(item)


def initial_assessment_surcharge(base_premium):
    return base_premium * INITIAL_ASSESSMENT_RATE


def loyalty_discount(base_premium, years_with_mhpco):
    if years_with_mhpco < LOYALTY_YEARS_THRESHOLD:
        return 0
    return base_premium * LOYALTY_DISCOUNT_RATE


def followup_contract_discount(base_premium, is_followup):
    if not is_followup:
        return 0
    return base_premium * FOLLOWUP_CONTRACT_DISCOUNT_RATE


def insurance_sum(items):
    return sum(INSURANCE_VALUES[item["type"]] for item in items)


def initial_policy_cap(items):
    return POLICY_CAP_MULTIPLIER * insurance_sum(items)


def has_claim_reducing_enchantment(item):
    return item.get("enchantment", 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD


def claim_reimbursement_rate(item):
    if has_claim_reducing_enchantment(item):
        return Fraction(1, 2)
    if item.get("material") == "dragon":
        return Fraction(1)
    return Fraction(1)


def apply_damage_event_deductible(reimbursable_amount):
    return max(reimbursable_amount - DAMAGE_EVENT_DEDUCTIBLE, 0)


def validate_damage_amount(amount):
    if amount < 0:
        raise ValueError("damage amount must not be negative")


def damage_reimbursement(item, amount):
    validate_damage_amount(amount)
    reimbursable = amount * claim_reimbursement_rate(item)
    return apply_damage_event_deductible(reimbursable)


def round_payout_in_mhpco_favor(amount):
    return math.floor(amount)


def apply_remaining_policy_cap(desired_payout, remaining_cap):
    payout = round_payout_in_mhpco_favor(min(desired_payout, remaining_cap))
    return payout, remaining_cap - payout


def match_damage_to_insured_item(unmatched_insured_items, item_type):
    item = next(
        (item for item in unmatched_insured_items if item["type"] == item_type),
        None,
    )
    if item is None:
        raise ValueError(f"damage to uncovered {item_type}")
    unmatched_insured_items.remove(item)
    return item


def incident_reimbursement(items, damages):
    unmatched_insured_items = list(items)
    reimbursement = 0
    for damage in damages:
        item = match_damage_to_insured_item(
            unmatched_insured_items, damage["itemType"]
        )
        reimbursement += damage_reimbursement(item, damage["amount"])
    return reimbursement


def claim_payout(items, damages, remaining_cap):
    desired_payout = incident_reimbursement(items, damages)
    return apply_remaining_policy_cap(desired_payout, remaining_cap)


def round_premium_in_mhpco_favor(amount):
    return math.ceil(amount)


def quote_premium(items, years_with_mhpco=0, is_followup=False):
    base_premium = policy_base_premium(items)
    total = (
        base_premium
        + initial_assessment_surcharge(base_premium)
        + sum(item_risk_surcharge(item) for item in items)
        - loyalty_discount(base_premium, years_with_mhpco)
        - followup_contract_discount(base_premium, is_followup)
    )
    return round_premium_in_mhpco_favor(total + PROCESSING_FEE)
