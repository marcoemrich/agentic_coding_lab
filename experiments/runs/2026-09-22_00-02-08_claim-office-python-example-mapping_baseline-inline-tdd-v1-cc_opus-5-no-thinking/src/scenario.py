"""Runs a scenario: a sequence of quote and claim steps for one customer."""

from claim import process_claim
from errors import ScenarioError
from policy import payout_cap
from premium import quote_premium


class Policy:
    def __init__(self, items):
        self.items = items
        self.remaining_cap = payout_cap(items)


def run_scenario(scenario):
    customer = scenario["customer"]
    policies = {}
    results = []
    for index, step in enumerate(scenario["steps"]):
        op = step["op"]
        if op == "quote":
            items = step["items"]
            premium = quote_premium(customer, items, contract_index=len(policies))
            policies[index] = Policy(items)
            results.append({"premium": premium})
        elif op == "claim":
            results.append(process_claim_step(policies, step))
        else:
            raise ScenarioError(f"unknown operation: {op!r}")
    return {"results": results}


def process_claim_step(policies, step):
    policy = policies.get(step["policy"])
    if policy is None:
        raise ScenarioError(f"step {step['policy']} did not create a policy")
    payout, remaining = process_claim(
        policy.items, step["incident"]["damages"], policy.remaining_cap
    )
    policy.remaining_cap = remaining
    return {"payout": payout, "remainingCap": remaining}
