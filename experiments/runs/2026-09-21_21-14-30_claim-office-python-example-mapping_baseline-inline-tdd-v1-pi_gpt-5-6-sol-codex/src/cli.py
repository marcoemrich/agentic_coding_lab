#!/usr/bin/env python3
"""JSON command-line adapter for the MHPCO claim office."""

import json
import sys

from claim_office import ClaimOffice, InputError


def process_scenario(scenario):
    if not isinstance(scenario, dict):
        raise InputError("scenario must be an object")
    if "customer" not in scenario:
        raise InputError("scenario requires a customer")
    steps = scenario.get("steps")
    if not isinstance(steps, list):
        raise InputError("scenario steps must be an array")

    office = ClaimOffice(scenario["customer"])
    policies_by_step = {}
    results = []
    quote_count = 0

    for step_index, step in enumerate(steps):
        if not isinstance(step, dict):
            raise InputError("each step must be an object")
        operation = step.get("op")
        if operation == "quote":
            if "items" not in step:
                raise InputError("quote step requires items")
            results.append(office.quote(step["items"]))
            policies_by_step[step_index] = quote_count
            quote_count += 1
        elif operation == "claim":
            results.append(_process_claim(office, step, policies_by_step))
        else:
            raise InputError(f"unknown operation: {operation!r}")

    return {"results": results}


def _process_claim(office, step, policies_by_step):
    if "policy" not in step or "incident" not in step:
        raise InputError("claim step requires policy and incident")
    policy_step = step["policy"]
    if not isinstance(policy_step, int) or isinstance(policy_step, bool):
        raise InputError("claim policy must be an integer")
    if policy_step not in policies_by_step:
        raise InputError("claim policy must reference an earlier quote step")
    incident = step["incident"]
    if not isinstance(incident, dict):
        raise InputError("claim incident must be an object")
    if not isinstance(incident.get("cause"), str):
        raise InputError("claim incident requires a cause")
    if "damages" not in incident:
        raise InputError("claim incident requires damages")
    return office.claim(policies_by_step[policy_step], incident["damages"])


def main():
    try:
        scenario = json.load(sys.stdin)
        result = process_scenario(scenario)
    except (InputError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    json.dump(result, sys.stdout, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
