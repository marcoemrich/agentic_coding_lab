"""Command-line adapter: scenario JSON on stdin, results JSON on stdout."""

import json
import sys

from claim_office import run_scenario


def main():
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except (ValueError, KeyError, TypeError) as rejection:
        print(f"the MHPCO rejects this scenario: {rejection}", file=sys.stderr)
        return 1
    json.dump(results, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
