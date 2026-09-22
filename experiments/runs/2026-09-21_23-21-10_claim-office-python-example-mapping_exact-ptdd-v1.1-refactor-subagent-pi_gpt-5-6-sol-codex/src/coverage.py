"""MHPCO policy coverage limits."""


INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
    "rune": 250,
    "moonstone": 250,
}
POLICY_CAP_MULTIPLIER = 2


def insurance_value(item):
    """Return an item's unmodified value from the MHPCO price list."""
    return INSURANCE_VALUES[item["type"]]


def policy_insurance_sum(items):
    """Return the sum of the insured items' unmodified values."""
    return sum(insurance_value(item) for item in items)


def policy_cap_for_insurance_sum(insurance_sum):
    """Apply the policy payout cap to an insurance sum."""
    return POLICY_CAP_MULTIPLIER * insurance_sum


def initial_policy_cap(items):
    """Return the initial payout cap for the insured items."""
    return policy_cap_for_insurance_sum(policy_insurance_sum(items))


def issue_policy(items):
    """Establish insured items and their initial payout cap."""
    return {"items": items, "remaining_cap": initial_policy_cap(items)}
