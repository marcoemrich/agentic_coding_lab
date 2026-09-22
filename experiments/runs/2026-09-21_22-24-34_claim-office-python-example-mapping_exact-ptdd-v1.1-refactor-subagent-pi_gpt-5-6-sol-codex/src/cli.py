import json
import math
import sys
from fractions import Fraction
from typing import NamedTuple


class ItemTerms(NamedTuple):
    base_premium: int
    insurance_value: int


PROCESSING_FEE = 5
INITIAL_ASSESSMENT_RATE = Fraction(1, 10)
CURSE_SURCHARGE_RATE = Fraction(1, 2)
ENCHANTMENT_SURCHARGE_RATE = Fraction(3, 10)
HIGH_ENCHANTMENT_LEVEL = 5
LOYALTY_DISCOUNT_RATE = Fraction(1, 5)
FOLLOW_UP_DISCOUNT_RATE = Fraction(3, 20)
LOYALTY_YEARS = 2
CAP_MULTIPLIER = 2
CLAIM_ENCHANTMENT_LEVEL = 8
HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = Fraction(1, 2)
DEDUCTIBLE = 100
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_PREMIUM = 60
COMPONENT_TYPES = ("rune", "moonstone")
ITEMS = {
    "sword": ItemTerms(base_premium=100, insurance_value=1000),
    "amulet": ItemTerms(base_premium=60, insurance_value=600),
    "staff": ItemTerms(base_premium=80, insurance_value=800),
    "potion": ItemTerms(base_premium=40, insurance_value=400),
    "rune": ItemTerms(base_premium=25, insurance_value=250),
    "moonstone": ItemTerms(base_premium=25, insurance_value=250),
}


def item_terms(item_type):
    return ITEMS[item_type]


def individual_items_base_premium(items):
    return sum(item_terms(item["type"]).base_premium for item in items)


def component_type_base_premium(items, component_type):
    component_count = sum(item["type"] == component_type for item in items)
    if component_count == COMPONENT_BLOCK_SIZE:
        return COMPONENT_BLOCK_PREMIUM
    return component_count * item_terms(component_type).base_premium


def base_premium(items):
    main_items = [item for item in items if item["type"] not in COMPONENT_TYPES]
    return individual_items_base_premium(main_items) + sum(
        component_type_base_premium(items, component_type)
        for component_type in COMPONENT_TYPES
    )


def curse_surcharge(items):
    return sum(
        item_terms(item["type"]).base_premium * CURSE_SURCHARGE_RATE
        for item in items
        if item.get("cursed", False)
    )


def is_highly_enchanted(item):
    return item.get("enchantment", 0) >= HIGH_ENCHANTMENT_LEVEL


def high_enchantment_surcharge(item):
    if not is_highly_enchanted(item):
        return 0
    return item_terms(item["type"]).base_premium * ENCHANTMENT_SURCHARGE_RATE


def enchantment_surcharge(items):
    return sum(high_enchantment_surcharge(item) for item in items)


def loyalty_discount(policy_base_premium, years_with_mhpco):
    if years_with_mhpco < LOYALTY_YEARS:
        return 0
    return policy_base_premium * LOYALTY_DISCOUNT_RATE


def initial_assessment_surcharge(policy_base_premium):
    return policy_base_premium * INITIAL_ASSESSMENT_RATE


def follow_up_contract_discount(policy_base_premium, is_follow_up):
    if not is_follow_up:
        return 0
    return policy_base_premium * FOLLOW_UP_DISCOUNT_RATE


def round_premium_in_mhpco_favor(premium):
    return math.ceil(premium)


def quote_premium(items, years_with_mhpco=0, is_follow_up=False):
    policy_base_premium = base_premium(items)
    return round_premium_in_mhpco_favor(
        policy_base_premium
        + initial_assessment_surcharge(policy_base_premium)
        + curse_surcharge(items)
        + enchantment_surcharge(items)
        - loyalty_discount(policy_base_premium, years_with_mhpco)
        - follow_up_contract_discount(policy_base_premium, is_follow_up)
        + PROCESSING_FEE
    )


def insurance_sum(items):
    return sum(item_terms(item["type"]).insurance_value for item in items)


def initial_policy_cap(items):
    return CAP_MULTIPLIER * insurance_sum(items)


def create_policy(items):
    return {"items": items, "remaining_cap": initial_policy_cap(items)}


def high_enchantment_reimbursement_applies(item):
    return item.get("enchantment", 0) >= CLAIM_ENCHANTMENT_LEVEL


def claim_reimbursement_rate(item):
    if high_enchantment_reimbursement_applies(item):
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    return Fraction(1)


def reimbursable_damage_amount(item, damage_amount):
    return Fraction(damage_amount) * claim_reimbursement_rate(item)


def damage_entry_payout(item, damage_amount):
    return max(0, reimbursable_damage_amount(item, damage_amount) - DEDUCTIBLE)


def take_insured_item_for_damage(available_items, item_type):
    for item in available_items:
        if item["type"] == item_type:
            available_items.remove(item)
            return item
    raise ValueError(f"damage exceeds insured quantity for item type: {item_type}")


def validate_damage_amounts(damages):
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def match_damages_to_insured_items(policy, damages):
    validate_damage_amounts(damages)
    available_items = list(policy["items"])
    return [
        (take_insured_item_for_damage(available_items, damage["itemType"]), damage)
        for damage in damages
    ]


def uncapped_claim_payout(policy, damages):
    return sum(
        (
            damage_entry_payout(item, damage["amount"])
            for item, damage in match_damages_to_insured_items(policy, damages)
        ),
        start=Fraction(0),
    )


def round_payout_in_mhpco_favor(payout):
    return math.floor(payout)


def claim_payout(policy, damages):
    capped_payout = min(uncapped_claim_payout(policy, damages), policy["remaining_cap"])
    return round_payout_in_mhpco_favor(capped_payout)


def settle_claim(policy, damages):
    payout = claim_payout(policy, damages)
    policy["remaining_cap"] -= payout
    return payout, policy["remaining_cap"]


def process_scenario(scenario):
    results = []
    policies = {}
    years_with_mhpco = scenario["customer"]["yearsWithMHPCO"]
    quote_count = 0
    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            items = step["items"]
            policies[step_index] = create_policy(items)
            results.append(
                {"premium": quote_premium(items, years_with_mhpco, quote_count > 0)}
            )
            quote_count += 1
        elif step["op"] == "claim":
            policy = policies[step["policy"]]
            payout, remaining_cap = settle_claim(policy, step["incident"]["damages"])
            results.append({"payout": payout, "remainingCap": remaining_cap})
    return {"results": results}


def main():
    scenario = json.load(sys.stdin)
    json.dump(process_scenario(scenario), sys.stdout)


if __name__ == "__main__":
    main()
