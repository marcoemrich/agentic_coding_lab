"""Command-line adapter for the MHPCO claim office."""

import json
import sys

from claim import claim_against_cap, policy_cap
from quote import CustomerContracts, quote_premium
from rejection import ScenarioRejected

QUOTE = "quote"
CLAIM = "claim"


class CustomerAccount:
    """One customer's standing dealings with the MHPCO over a scenario.

    Who the customer is, how many contracts they have agreed, and which
    policies they hold are not three separate records the office consults:
    they are the one account every step of the scenario is transacted
    against, and every step that changes any of them changes the account.
    """

    def __init__(self, customer):
        self._customer = customer
        self._contracts = CustomerContracts()
        self._policy_items = {}
        self._remaining_caps = {}

    def take_out_policy(self, policy, items):
        """Quote and take out a policy on `items`, filed under `policy`."""
        premium = quote_premium(items, self._customer, self._contracts.agree_next())
        self._policy_items[policy] = items
        self._remaining_caps[policy] = policy_cap(items)
        return premium

    def settle_claim(self, policy, damages):
        """Settle a claim against a held policy, returning payout and cap left."""
        if policy not in self._policy_items:
            raise ScenarioRejected(f"the customer holds no policy numbered {policy}")
        payout, remaining_cap = claim_against_cap(
            self._policy_items[policy], damages, self._remaining_caps[policy]
        )
        self._remaining_caps[policy] = remaining_cap
        return payout, remaining_cap


def stated(section, entry):
    """Return an entry a scenario must state, refusing the scenario if it omits it.

    A scenario that leaves out something the MHPCO needs in order to act is
    not a mishap in the office's machinery: it is a submission the office
    declines, and it says which entry is missing.
    """
    if entry not in section:
        raise ScenarioRejected(f"the scenario states no {entry}")
    return section[entry]


def quote_result(step, step_index, account):
    """Return the result of a quote step as the scenario reports it.

    A quote step takes out a policy, and the scenario names that policy by
    the index of the step that took it out.
    """
    return {"premium": account.take_out_policy(step_index, stated(step, "items"))}


def claim_result(step, account):
    """Return the result of a claim step as the scenario reports it."""
    payout, remaining_cap = account.settle_claim(
        stated(step, "policy"), stated(stated(step, "incident"), "damages")
    )
    return {"payout": payout, "remainingCap": remaining_cap}


def step_result(step, step_index, account):
    """Return the result of one scenario step, whichever operation it asks for."""
    if stated(step, "op") == QUOTE:
        return quote_result(step, step_index, account)
    if step["op"] == CLAIM:
        return claim_result(step, account)
    raise ScenarioRejected(f"the MHPCO offers no operation named {step['op']!r}")


def scenario_results(scenario):
    """Return one result per step of a scenario, in the order of the steps."""
    account = CustomerAccount(scenario.get("customer", {}))
    return [
        step_result(step, step_index, account)
        for step_index, step in enumerate(stated(scenario, "steps"))
    ]


REJECTED = 1


def main():
    """Read a scenario from stdin and write its results to stdout.

    The MHPCO writes no results at all for a scenario it rejects; it states
    why on stderr and reports the rejection through its exit status.
    """
    scenario = json.load(sys.stdin)
    try:
        results = scenario_results(scenario)
    except ScenarioRejected as rejection:
        print(rejection, file=sys.stderr)
        sys.exit(REJECTED)
    json.dump({"results": results}, sys.stdout)


if __name__ == "__main__":
    main()
