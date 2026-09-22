from collections import Counter
import json
import math
import sys


PROCESSING_FEE = 5
LOYALTY_QUALIFYING_YEARS = 2
HIGH_ENCHANTMENT_THRESHOLD = 5
REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8
DAMAGE_EVENT_DEDUCTIBLE = 100
POLICY_CLAIM_CAP_MULTIPLIER = 2
COMPONENT_TYPES = ("rune", "moonstone")
ALIKE_COMPONENT_BLOCK_SIZE = 3
ALIKE_COMPONENT_BLOCK_BASE_PREMIUM = 60
BASE_PREMIUM_BY_ITEM_TYPE = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
    "rune": 25,
    "moonstone": 25,
}
INSURANCE_VALUE_BY_ITEM_TYPE = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
    "rune": 250,
    "moonstone": 250,
}


def forms_alike_component_block(items, component_type):
    component_count = sum(item["type"] == component_type for item in items)
    return component_count == ALIKE_COMPONENT_BLOCK_SIZE


def alike_component_block_discount_for_type(items, component_type):
    if not forms_alike_component_block(items, component_type):
        return 0
    component_base_premium = BASE_PREMIUM_BY_ITEM_TYPE[component_type]
    return (
        ALIKE_COMPONENT_BLOCK_SIZE * component_base_premium
        - ALIKE_COMPONENT_BLOCK_BASE_PREMIUM
    )


def alike_component_block_discount(items):
    return sum(
        alike_component_block_discount_for_type(items, component_type)
        for component_type in COMPONENT_TYPES
    )


def validate_items_are_insurable(items):
    if any(item["type"] not in BASE_PREMIUM_BY_ITEM_TYPE for item in items):
        raise ValueError("quote item is not insurable")


def policy_base_premium(items):
    listed_premium = sum(BASE_PREMIUM_BY_ITEM_TYPE[item["type"]] for item in items)
    return listed_premium - alike_component_block_discount(items)


def initial_assessment_surcharge(base_premium):
    return base_premium / 10


def round_premium_in_mhpco_favor(amount):
    return math.ceil(amount)


def round_payout_in_mhpco_favor(amount):
    return math.floor(amount)


def cursed_surcharge_for_item(item):
    if not item.get("cursed", False):
        return 0
    return BASE_PREMIUM_BY_ITEM_TYPE[item["type"]] / 2


def cursed_item_surcharge(items):
    return sum(cursed_surcharge_for_item(item) for item in items)


def qualifies_for_loyalty_discount(years_with_mhpco):
    return years_with_mhpco >= LOYALTY_QUALIFYING_YEARS


def is_highly_enchanted(item):
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD


def high_enchantment_surcharge_for_item(item):
    if not is_highly_enchanted(item):
        return 0
    return BASE_PREMIUM_BY_ITEM_TYPE[item["type"]] * 3 / 10


def high_enchantment_surcharge(items):
    return sum(high_enchantment_surcharge_for_item(item) for item in items)


def loyalty_discount(base_premium, years_with_mhpco):
    return base_premium / 5 if qualifies_for_loyalty_discount(years_with_mhpco) else 0


def follow_up_contract_discount(base_premium, has_previous_contract):
    return base_premium * 15 / 100 if has_previous_contract else 0


def quote_premium(items, years_with_mhpco, has_previous_contract=False):
    base_premium = policy_base_premium(items)
    premium = (
        base_premium
        + cursed_item_surcharge(items)
        + high_enchantment_surcharge(items)
        + initial_assessment_surcharge(base_premium)
        - loyalty_discount(base_premium, years_with_mhpco)
        - follow_up_contract_discount(base_premium, has_previous_contract)
        + PROCESSING_FEE
    )
    return round_premium_in_mhpco_favor(premium)


def policy_insurance_sum(items):
    return sum(INSURANCE_VALUE_BY_ITEM_TYPE[item["type"]] for item in items)


def policy_claim_cap(items):
    return POLICY_CLAIM_CAP_MULTIPLIER * policy_insurance_sum(items)


def create_policy(items):
    return {"items": items, "remaining_cap": policy_claim_cap(items)}


def uses_reduced_reimbursement_clause(item):
    return item.get("enchantment", 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD


def is_dragon_material(item):
    return item.get("material") == "dragon"


def reimbursement_before_deductible(item, damage_amount):
    if uses_reduced_reimbursement_clause(item):
        return damage_amount / 2
    if is_dragon_material(item):
        return damage_amount
    return damage_amount


def apply_damage_event_deductible(reimbursement):
    return max(0, reimbursement - DAMAGE_EVENT_DEDUCTIBLE)


def damage_event_payout(item, damage_amount):
    reimbursement = reimbursement_before_deductible(item, damage_amount)
    return apply_damage_event_deductible(reimbursement)


def pay_claim_from_remaining_cap(policy, desired_payout):
    payout = min(desired_payout, policy["remaining_cap"])
    policy["remaining_cap"] -= payout
    return payout


def uncapped_claim_payout(items, damages):
    payouts = []
    for damage in damages:
        item = next(item for item in items if item["type"] == damage["itemType"])
        payouts.append(damage_event_payout(item, damage["amount"]))
    return round_payout_in_mhpco_favor(sum(payouts))


def validate_damage_events_are_covered_by_insured_items(items, damages):
    insured_counts = Counter(item["type"] for item in items)
    damage_counts = Counter(damage["itemType"] for damage in damages)
    if any(count > insured_counts[item_type] for item_type, count in damage_counts.items()):
        raise ValueError("damage item is not covered by policy")


def validate_damage_amounts(damages):
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def validate_claim_damage_events(items, damages):
    validate_damage_events_are_covered_by_insured_items(items, damages)
    validate_damage_amounts(damages)


def claim_payout(policy, damages):
    validate_claim_damage_events(policy["items"], damages)
    desired_payout = uncapped_claim_payout(policy["items"], damages)
    payout = pay_claim_from_remaining_cap(policy, desired_payout)
    return {"payout": payout, "remainingCap": policy["remaining_cap"]}


def process_scenario(scenario):
    results = []
    policies = {}
    quote_count = 0
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            items = step["items"]
            validate_items_are_insurable(items)
            policies[index] = create_policy(items)
            years = scenario["customer"]["yearsWithMHPCO"]
            results.append({"premium": quote_premium(items, years, quote_count > 0)})
            quote_count += 1
        else:
            policy = policies[step["policy"]]
            results.append(claim_payout(policy, step["incident"]["damages"]))
    return {"results": results}


def main():
    scenario = json.load(sys.stdin)
    json.dump(process_scenario(scenario), sys.stdout)


if __name__ == "__main__":
    main()
