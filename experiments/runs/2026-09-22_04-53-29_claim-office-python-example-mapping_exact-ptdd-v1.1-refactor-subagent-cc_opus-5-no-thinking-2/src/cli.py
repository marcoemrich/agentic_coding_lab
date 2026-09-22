"""Command-line adapter for the MHPCO Claim Office.

Reads a scenario as JSON from stdin and writes the corresponding results as
JSON to stdout. Translation between the JSON documents and the domain is this
module's only responsibility; the price list and the claim rules live in
:mod:`claim_office`.
"""

import json
import sys

from claim_office import Policy, quote_premium

QUOTE = "quote"

SETTLED = 0
REFUSED = 1


def writes_a_contract(step):
    """Say whether a step writes a contract with the scenario's customer.

    The price list discounts each contract after the customer's first, so the
    walk has to know which steps are contracts. A quote is what the MHPCO
    writes a contract for; an operation that only settles against a contract
    already written does not add to the count.
    """
    return step["op"] == QUOTE


class ContractsOnFile:
    """What the MHPCO has on file for one customer as a scenario proceeds.

    A scenario's steps are not independent: a quote is priced against how many
    contracts the customer already holds, and a claim is settled against a
    contract an earlier quote wrote. Both are the same record read two ways --
    how many contracts, and which one a step names -- and both are written only
    when a contract is written, so the record keeps them together rather than
    leaving a count and a lookup to be kept in step by the walk.

    A contract is filed under the step that wrote it, because that is how a
    claim names it: by the zero-based index of its quote step.
    """

    def __init__(self):
        self.policies = {}

    def __len__(self):
        """Return how many contracts the customer holds so far."""
        return len(self.policies)

    def file(self, step_index, policy):
        """Record the contract written by the quote step at ``step_index``."""
        self.policies[step_index] = policy

    def named_by(self, step):
        """Return the contract a claim step names."""
        return self.policies[step["policy"]]


def quote_result(step, customer, contracts):
    """Quote a policy for a step's items and return its result document."""
    return {"premium": quote_premium(step["items"], customer, len(contracts))}


def claim_result(step, contracts):
    """Settle a step's incident against the contract it names and return its result."""
    policy = contracts.named_by(step)
    payout = policy.settle_claim(step["incident"]["damages"])
    return {"payout": payout, "remainingCap": policy.remaining_cap}


def results_for(scenario):
    """Return the result of every step of ``scenario``, in the same order.

    A scenario is one customer and a sequence of steps the MHPCO processes in
    order, so the results answer the steps one for one and in the same order.
    What the earlier steps put on file is what the later ones are answered
    against, so the walk carries the customer's contracts forward as it goes.
    """
    customer = scenario["customer"]
    contracts = ContractsOnFile()
    results = []
    for index, step in enumerate(scenario["steps"]):
        if writes_a_contract(step):
            results.append(quote_result(step, customer, contracts))
            contracts.file(index, Policy(step["items"]))
        else:
            results.append(claim_result(step, contracts))
    return results


def main():
    """Read a scenario from stdin and write its results to stdout.

    A scenario the MHPCO refuses is reported as an error description on stderr
    and a non-zero exit status, with no results written to stdout.
    """
    scenario = json.load(sys.stdin)
    try:
        results = results_for(scenario)
    except ValueError as refusal:
        print(refusal, file=sys.stderr)
        return REFUSED
    json.dump({"results": results}, sys.stdout)
    return SETTLED


if __name__ == "__main__":
    sys.exit(main())
