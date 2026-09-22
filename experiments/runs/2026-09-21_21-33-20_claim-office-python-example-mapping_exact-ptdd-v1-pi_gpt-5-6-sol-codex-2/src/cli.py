"""JSON stdin/stdout adapter for the MHPCO claim office."""

import json
import sys

from claim_office import ClaimOffice


def process_scenario(scenario: dict) -> dict:
    """Process scenario steps sequentially and return their public results."""
    office = ClaimOffice(scenario["customer"]["yearsWithMHPCO"])
    results = []
    policy_by_step: dict[int, int] = {}
    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            policy_by_step[step_index] = len(office.policies)
            results.append(office.quote(step["items"]))
        elif step["op"] == "claim":
            policy_index = policy_by_step[step["policy"]]
            results.append(office.claim(policy_index, step["incident"]["damages"]))
        else:
            raise ValueError(f"unknown operation: {step['op']}")
    return {"results": results}


def main() -> int:
    """Read one scenario, emit one result document, and map rejection to stderr."""
    try:
        scenario = json.load(sys.stdin)
        output = process_scenario(scenario)
    except KeyError as error:
        print(f"Unknown item type or reference: {error.args[0]}", file=sys.stderr)
        return 1
    except (ValueError, IndexError, StopIteration) as error:
        print(f"Invalid scenario: {error}", file=sys.stderr)
        return 1
    json.dump(output, sys.stdout, separators=(",", ":"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
