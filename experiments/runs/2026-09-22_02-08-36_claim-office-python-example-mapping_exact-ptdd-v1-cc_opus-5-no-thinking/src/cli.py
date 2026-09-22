"""Command-line adapter for the MHPCO claim office."""

import json
import sys

from claim_office import ClaimOfficeError, run_scenario

REFUSED = 1


def main():
    """Read a scenario from stdin and write its results to stdout."""
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except ClaimOfficeError as refusal:
        print(f"the MHPCO refuses this request: {refusal}", file=sys.stderr)
        return REFUSED
    json.dump(results, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
