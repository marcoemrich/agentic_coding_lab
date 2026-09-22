"""JSON command-line adapter for the MHPCO claim office."""

import json
import sys

from claim_office import InvalidScenario, process_scenario


def main() -> int:
    try:
        scenario = json.load(sys.stdin)
        result = process_scenario(scenario)
    except (InvalidScenario, json.JSONDecodeError, TypeError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    json.dump(result, sys.stdout, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
