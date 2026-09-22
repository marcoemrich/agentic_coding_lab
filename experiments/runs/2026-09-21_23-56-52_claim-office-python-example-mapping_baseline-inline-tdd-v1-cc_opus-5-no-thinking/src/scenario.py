"""Sequential execution of a scenario's steps."""
import office
from errors import ClaimOfficeError
from policy import Policy


def _quote(step, customer, quotes_so_far):
    items = step["items"]
    premium = office.quote_premium(
        items,
        years_with_mhpco=customer["yearsWithMHPCO"],
        contract_index=quotes_so_far,
    )
    return {"premium": premium}, Policy(items)


def _claim(step, policies):
    index = step["policy"]
    policy = policies.get(index)
    if policy is None:
        raise ClaimOfficeError(f"step {index} did not create a policy")
    payout = policy.settle(step["incident"]["damages"])
    return {"payout": payout, "remainingCap": int(policy.remaining_cap)}


def run_scenario(scenario):
    """Process every step in order and return one result per step."""
    customer = scenario["customer"]
    policies = {}
    results = []
    quotes_so_far = 0
    for index, step in enumerate(scenario["steps"]):
        op = step.get("op")
        if op == "quote":
            result, policies[index] = _quote(step, customer, quotes_so_far)
            quotes_so_far += 1
        elif op == "claim":
            result = _claim(step, policies)
        else:
            raise ClaimOfficeError(f"unknown operation: {op!r}")
        results.append(result)
    return results
