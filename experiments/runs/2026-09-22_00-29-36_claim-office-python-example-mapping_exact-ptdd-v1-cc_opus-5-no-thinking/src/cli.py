"""Command-line adapter: a JSON scenario on stdin, a JSON result document on stdout."""

import json
import sys

from claim_office import run_scenario

REJECTED = 1


def main():
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except ValueError as rejection:
        print(f"the MHPCO rejects this scenario: {rejection}", file=sys.stderr)
        return REJECTED
    json.dump(results, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
