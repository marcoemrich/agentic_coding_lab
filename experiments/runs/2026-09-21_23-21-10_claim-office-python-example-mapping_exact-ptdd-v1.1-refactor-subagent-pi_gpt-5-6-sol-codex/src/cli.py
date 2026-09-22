"""Command-line adapter for the MHPCO claim office."""

import json
import sys

from claim import process_claim
from coverage import issue_policy
from premium import quote_premium


def scenario_results(scenario):
    """Process scenario steps sequentially."""
    years = scenario["customer"]["yearsWithMHPCO"]
    results = []
    policies = {}
    previous_contracts = 0
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            items = step["items"]
            results.append(
                {"premium": quote_premium(items, years, previous_contracts)}
            )
            policies[index] = issue_policy(items)
            previous_contracts += 1
        else:
            policy = policies[step["policy"]]
            results.append(process_claim(policy, step["incident"]["damages"]))
    return results


def main():
    scenario = json.load(sys.stdin)
    json.dump({"results": scenario_results(scenario)}, sys.stdout)


if __name__ == "__main__":
    main()
