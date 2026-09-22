"""Sequential processing of a scenario's steps."""

from policy import ClaimError, Policy
from premium import quote_premium


def run_scenario(scenario):
    years = scenario["customer"]["yearsWithMHPCO"]
    policies = {}
    results = []
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            items = step["items"]
            policies[index] = Policy(items)
            premium = quote_premium(items, years, contract_index=len(policies) - 1)
            results.append({"premium": premium})
        else:
            results.append(_claim(step, policies))
    return results


def _claim(step, policies):
    policy = policies.get(step["policy"])
    if policy is None:
        raise ClaimError(f"no policy at step {step['policy']}")
    payout = policy.claim(step["incident"]["damages"])
    return {"payout": int(payout), "remainingCap": int(policy.remaining_cap)}
