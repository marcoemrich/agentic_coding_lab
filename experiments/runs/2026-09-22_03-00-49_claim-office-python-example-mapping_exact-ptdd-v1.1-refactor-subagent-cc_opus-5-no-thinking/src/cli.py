"""Command-line counter: reads a scenario from stdin, writes its results to stdout."""

import json
import sys
from dataclasses import dataclass

from claim_office import payout_cap, quote_premium, settle_claim_against_cap


@dataclass
class IssuedPolicy:
    """A policy the office has granted: what it covers and what is left of its cap.

    The cap is per policy and falls as claims are settled, so a policy carries
    its remaining cap from one claim to the next.
    """

    items: list
    remaining_cap: int

    @classmethod
    def granted_for(cls, items):
        return cls(items, payout_cap(items))

    def settle(self, damages):
        payout, self.remaining_cap = settle_claim_against_cap(
            self.items, damages, self.remaining_cap
        )
        return payout


def run_scenario(scenario):
    """Steps are processed in order; a claim settles against the policy a quote created."""
    customer = scenario["customer"]
    policies = {}
    results = []
    for index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            items = step["items"]
            premium = quote_premium(items, customer, previous_contracts=len(policies))
            policies[index] = IssuedPolicy.granted_for(items)
            results.append({"premium": premium})
        else:
            policy = policies[step["policy"]]
            payout = policy.settle(step["incident"]["damages"])
            results.append({"payout": payout, "remainingCap": policy.remaining_cap})
    return results


REJECTED_EXIT_STATUS = 1


def main():
    """The office either transacts or refuses; either answer is reported to the caller.

    A refusal is the office's own decision, already stated in its own words by
    the rule that made it. Here it is only translated into the idiom of the
    surrounding world: a description on stderr and a non-zero exit status, with
    no results on stdout, because there is nothing the office agreed to settle.
    """
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except ValueError as rejection:
        print(rejection, file=sys.stderr)
        return REJECTED_EXIT_STATUS
    json.dump({"results": results}, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
