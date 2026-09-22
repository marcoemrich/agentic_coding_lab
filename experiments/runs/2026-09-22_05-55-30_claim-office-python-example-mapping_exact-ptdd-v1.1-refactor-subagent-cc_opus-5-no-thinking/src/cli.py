"""Command-line adapter: JSON scenarios in, JSON results out."""

import json
import sys

from claim_office import ClaimOffice


def claim_result(policy, damages):
    """Return the result record the schema prescribes for a claim step.

    The claim is settled first; the cap reported is the cover that remains
    after this claim has drawn on it.
    """
    payout = policy.claim(damages)
    return {"payout": payout, "remainingCap": policy.remaining_cap}


def run_scenario(scenario):
    """Return the result of each step in `scenario`, in order.

    A quote step's policy is filed under that step's own zero-based position,
    which is the address a later claim step names in its `policy` field.
    """
    office = ClaimOffice(years_with_mhpco=scenario["customer"]["yearsWithMHPCO"])
    policies = {}
    results = []

    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            policy = office.insure(step["items"])
            policies[step_index] = policy
            results.append({"premium": policy.premium})
        else:
            policy = policies[step["policy"]]
            results.append(claim_result(policy, step["incident"]["damages"]))

    return results


def main():
    """Read a scenario from stdin and write its results to stdout."""
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except ValueError as rejection:
        print(f"The MHPCO rejects this scenario: {rejection}", file=sys.stderr)
        return 1

    json.dump({"results": results}, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
