from collections import Counter, defaultdict
from fractions import Fraction
from math import ceil, floor


ITEM_PRICES = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
    "rune": (250, 25),
    "moonstone": (250, 25),
}
PROCESSING_FEE = 5
INITIAL_ASSESSMENT_RATE = Fraction(1, 10)
CURSE_RATE = Fraction(1, 2)
HIGH_ENCHANTMENT_RATE = Fraction(3, 10)
HIGH_ENCHANTMENT_THRESHOLD = 5
LOYALTY_RATE = Fraction(1, 5)
LOYALTY_YEARS = 2
FOLLOW_UP_RATE = Fraction(3, 20)
CAP_MULTIPLIER = 2
DEDUCTIBLE = 100
REDUCED_REIMBURSEMENT_THRESHOLD = 8
REDUCED_REIMBURSEMENT_RATE = Fraction(1, 2)
COMPONENT_BLOCK_SIZE = 3
COMPONENT_BLOCK_PREMIUM = 60
COMPONENT_TYPES = {"rune", "moonstone"}


def _validate_items(items):
    if any(item["type"] not in ITEM_PRICES for item in items):
        raise ValueError("unknown item type")


def _insurance_sum(items):
    return sum(ITEM_PRICES[item["type"]][0] for item in items)


def _is_component_block(item_type, count):
    return item_type in COMPONENT_TYPES and count == COMPONENT_BLOCK_SIZE


def _base_premium(items):
    item_counts = Counter(item["type"] for item in items)
    return sum(
        COMPONENT_BLOCK_PREMIUM
        if _is_component_block(item_type, count)
        else ITEM_PRICES[item_type][1] * count
        for item_type, count in item_counts.items()
    )


def _curse_surcharge(item, item_premium):
    return item_premium * CURSE_RATE if item.get("cursed", False) else 0


def _enchantment_surcharge(item, item_premium):
    if item.get("enchantment", 0) >= HIGH_ENCHANTMENT_THRESHOLD:
        return item_premium * HIGH_ENCHANTMENT_RATE
    return 0


def _item_surcharges(items):
    return sum(
        _curse_surcharge(item, ITEM_PRICES[item["type"]][1])
        + _enchantment_surcharge(item, ITEM_PRICES[item["type"]][1])
        for item in items
    )


def _loyalty_discount(base_premium, years_with_mhpco):
    return base_premium * LOYALTY_RATE if years_with_mhpco >= LOYALTY_YEARS else 0


def _follow_up_discount(base_premium, previous_contracts):
    return base_premium * FOLLOW_UP_RATE if previous_contracts else 0


def _policy_modifiers(base_premium, years_with_mhpco, previous_contracts):
    return (
        base_premium * INITIAL_ASSESSMENT_RATE
        - _loyalty_discount(base_premium, years_with_mhpco)
        - _follow_up_discount(base_premium, previous_contracts)
    )


def _create_policy(items, years_with_mhpco, previous_contracts):
    _validate_items(items)
    insurance_sum = _insurance_sum(items)
    base_premium = _base_premium(items)
    premium = ceil(
        base_premium
        + _item_surcharges(items)
        + _policy_modifiers(base_premium, years_with_mhpco, previous_contracts)
        + PROCESSING_FEE
    )
    policy = {
        "items": items,
        "remaining_cap": insurance_sum * CAP_MULTIPLIER,
    }
    return {"premium": premium}, policy


def _reimbursement_rate(item):
    if item.get("enchantment", 0) >= REDUCED_REIMBURSEMENT_THRESHOLD:
        return REDUCED_REIMBURSEMENT_RATE
    return 1


def _reimbursement(item, damage_amount):
    return max(damage_amount * _reimbursement_rate(item) - DEDUCTIBLE, 0)


def _consume_cap(policy, desired_payout):
    payout = min(desired_payout, policy["remaining_cap"])
    policy["remaining_cap"] -= payout
    return {"payout": payout, "remainingCap": policy["remaining_cap"]}


def _validate_damages(damages):
    if any(damage["amount"] < 0 for damage in damages):
        raise ValueError("damage amount cannot be negative")


def _claim(policy, damages):
    _validate_damages(damages)
    available_items = defaultdict(list)
    for item in policy["items"]:
        available_items[item["type"]].append(item)
    reimbursements = []
    for damage in damages:
        matching_items = available_items[damage["itemType"]]
        if not matching_items:
            raise ValueError("damage item is not covered by the policy")
        reimbursements.append(_reimbursement(matching_items.pop(), damage["amount"]))
    desired_payout = floor(sum(reimbursements))
    return _consume_cap(policy, desired_payout)


def process_scenario(scenario):
    results = []
    policies = {}
    previous_contracts = 0
    years_with_mhpco = scenario["customer"]["yearsWithMHPCO"]
    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            result, policies[step_index] = _create_policy(
                step["items"], years_with_mhpco, previous_contracts
            )
            previous_contracts += 1
        else:
            policy = policies[step["policy"]]
            result = _claim(policy, step["incident"]["damages"])
        results.append(result)
    return {"results": results}
