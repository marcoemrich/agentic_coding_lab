"""Command-line entry point of the MHPCO claim office."""

import json
import sys

from claim_office import ClaimOfficeError, run_scenario


def main():
    """Read a scenario from stdin and write its results to stdout."""
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except ClaimOfficeError as refusal:
        print(f"the MHPCO refuses this scenario: {refusal}", file=sys.stderr)
        return 1
    json.dump({"results": results}, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
