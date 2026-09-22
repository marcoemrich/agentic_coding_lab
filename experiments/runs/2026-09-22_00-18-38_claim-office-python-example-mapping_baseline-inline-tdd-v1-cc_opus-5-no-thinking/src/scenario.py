"""Sequential processing of an MHPCO scenario: quote and claim steps."""

from claim import process_claim
from policy import Policy
from premium import calculate_premium


class InvalidScenario(Exception):
    """Raised when a scenario step cannot be processed."""


def _quote(step, state):
    items = step["items"]
    premium = calculate_premium(items, state["years"], state["contracts"])
    state["contracts"] += 1
    state["policies"][state["index"]] = Policy(items)
    return {"premium": premium}


def _claim(step, state):
    policy = state["policies"].get(step["policy"])
    if policy is None:
        raise InvalidScenario(f"no policy created by step {step['policy']}")
    return process_claim(policy, step["incident"]["damages"])


def run_scenario(scenario):
    state = {
        "years": scenario["customer"]["yearsWithMHPCO"],
        "contracts": 0,
        "policies": {},
        "index": 0,
    }
    results = []
    for index, step in enumerate(scenario["steps"]):
        state["index"] = index
        handler = _quote if step["op"] == "quote" else _claim
        results.append(handler(step, state))
    return {"results": results}
