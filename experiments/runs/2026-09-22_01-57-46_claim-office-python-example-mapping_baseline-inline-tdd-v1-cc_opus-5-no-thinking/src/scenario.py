"""Running a whole scenario: a sequence of quote and claim steps."""

from policy import ClaimError, Policy
from quote import quote_premium


def run_scenario(scenario):
    """Process every step in order and return one result per step."""
    customer = dict(scenario["customer"])
    policies = {}
    results = []
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            results.append(_quote_step(step, customer, policies, index))
        else:
            results.append(_claim_step(step, policies))
    return results


def _quote_step(step, customer, policies, index):
    items = step["items"]
    premium = quote_premium(customer, items)
    policies[index] = Policy(customer, items)
    customer["previousContracts"] = customer.get("previousContracts", 0) + 1
    return {"premium": premium}


def _claim_step(step, policies):
    policy = policies.get(step["policy"])
    if policy is None:
        raise ClaimError(f"no policy from step {step['policy']}")
    result = policy.claim(step["incident"])
    return {"payout": result.payout, "remainingCap": result.remaining_cap}
