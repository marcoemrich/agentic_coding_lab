import math


PROCESSING_FEE = 5
COMPONENT_BLOCK_SIZE = 3
COMPONENT_TYPES = ("rune", "moonstone")
BASE_PREMIUMS = {"sword": 100, "amulet": 60, "staff": 80, "potion": 40}
MINIMUM_LOYALTY_YEARS = 2
LOYALTY_DISCOUNT_RATE = 0.20
HIGH_ENCHANTMENT_THRESHOLD = 5
HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.30
INITIAL_ASSESSMENT_SURCHARGE_RATE = 0.10
FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15
DAMAGE_EVENT_DEDUCTIBLE = 100
POLICY_CLAIM_CAP_MULTIPLIER = 2
HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8
HALF_REIMBURSEMENT_RATE = 0.50
INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
    "rune": 250,
    "moonstone": 250,
}


def main_item_base_premium(item_type):
    return BASE_PREMIUMS[item_type]


def component_base_premium(component_count):
    return 60 if component_count == COMPONENT_BLOCK_SIZE else component_count * 25


def components_base_premium(item_types):
    return sum(
        component_base_premium(item_types.count(component_type))
        for component_type in COMPONENT_TYPES
    )


def policy_base_premium(item_types):
    return components_base_premium(item_types) + sum(
        main_item_base_premium(item_type)
        for item_type in item_types
        if item_type not in COMPONENT_TYPES
    )


def cursed_item_surcharge(item):
    if not item.get("cursed", False):
        return 0
    return main_item_base_premium(item["type"]) * 0.50


def loyalty_discount(base_premium, customer_years):
    if customer_years < MINIMUM_LOYALTY_YEARS:
        return 0
    return base_premium * LOYALTY_DISCOUNT_RATE


def is_highly_enchanted(item):
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD


def high_enchantment_surcharge(item):
    if not is_highly_enchanted(item):
        return 0
    return main_item_base_premium(item["type"]) * HIGH_ENCHANTMENT_SURCHARGE_RATE


def initial_assessment_surcharge(base_premium):
    return base_premium * INITIAL_ASSESSMENT_SURCHARGE_RATE


def follow_up_contract_discount(base_premium, follow_up):
    if not follow_up:
        return 0
    return base_premium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE


def reject_unknown_quote_items(items):
    for item in items:
        if item["type"] not in INSURANCE_VALUES:
            raise ValueError(f"unknown quote item type: {item['type']}")


def quote_premium(items, customer_years=0, follow_up=False):
    reject_unknown_quote_items(items)
    item_types = [item["type"] for item in items]
    base_premium = policy_base_premium(item_types)
    curse_surcharge = sum(cursed_item_surcharge(item) for item in items)
    enchantment_surcharge = sum(
        high_enchantment_surcharge(item) for item in items
    )
    initial_assessment = initial_assessment_surcharge(base_premium)
    return math.ceil(
        base_premium
        + curse_surcharge
        + enchantment_surcharge
        + initial_assessment
        - loyalty_discount(base_premium, customer_years)
        - follow_up_contract_discount(base_premium, follow_up)
        + PROCESSING_FEE
    )


def half_reimbursement_applies(insured_item):
    return insured_item.get("enchantment", 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD


def reimbursement_rate(insured_item):
    if half_reimbursement_applies(insured_item):
        return HALF_REIMBURSEMENT_RATE
    return 1


def reimbursable_damage_amount(insured_item, damage_amount):
    return damage_amount * reimbursement_rate(insured_item)


def payout_after_deductible(reimbursable_amount):
    return max(0, reimbursable_amount - DAMAGE_EVENT_DEDUCTIBLE)


def damage_event_payout(insured_item, damage_amount):
    reimbursable_amount = reimbursable_damage_amount(insured_item, damage_amount)
    return payout_after_deductible(reimbursable_amount)


def insured_item_for_damage(insured_items, damage):
    return next(
        item for item in insured_items if item["type"] == damage["itemType"]
    )


def reject_damages_not_covered_by_policy(insured_items, damages):
    insured_types = [item["type"] for item in insured_items]
    for item_type in set(damage["itemType"] for damage in damages):
        damage_count = sum(damage["itemType"] == item_type for damage in damages)
        if damage_count > insured_types.count(item_type):
            raise ValueError("damage entries exceed insured items")


def reject_negative_damage_amounts(damages):
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def claim_payout_before_cap(insured_items, damages):
    reject_negative_damage_amounts(damages)
    reject_damages_not_covered_by_policy(insured_items, damages)
    payout = 0
    for damage in damages:
        insured_item = insured_item_for_damage(insured_items, damage)
        payout += damage_event_payout(insured_item, damage["amount"])
    return payout


def item_insurance_value(item):
    return INSURANCE_VALUES[item["type"]]


def policy_insurance_sum(items):
    return sum(item_insurance_value(item) for item in items)


def policy_claim_cap(items):
    return policy_insurance_sum(items) * POLICY_CLAIM_CAP_MULTIPLIER


def issue_policy(items):
    return {"items": items, "remaining_cap": policy_claim_cap(items)}


def round_down_final_payout(payout):
    return math.floor(payout)


def settle_claim_against_cap(policy, damages):
    desired_payout = claim_payout_before_cap(policy["items"], damages)
    payout = min(round_down_final_payout(desired_payout), policy["remaining_cap"])
    policy["remaining_cap"] -= payout
    return payout, policy["remaining_cap"]


def quote_result(premium):
    return {"premium": premium}


def claim_result(payout, remaining_cap):
    return {"payout": payout, "remainingCap": remaining_cap}


def process_scenario(scenario):
    results = []
    policies = {}
    quote_count = 0
    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            results.append(
                quote_result(
                    quote_premium(
                        step["items"],
                        scenario["customer"]["yearsWithMHPCO"],
                        follow_up=quote_count > 0,
                    )
                )
            )
            policies[step_index] = issue_policy(step["items"])
            quote_count += 1
        elif step["op"] == "claim":
            payout, remaining_cap = settle_claim_against_cap(
                policies[step["policy"]], step["incident"]["damages"]
            )
            results.append(claim_result(payout, remaining_cap))
    return {"results": results}
