import json
import sys

from claim_office import process_scenario


def main():
    scenario = json.load(sys.stdin)
    try:
        result = process_scenario(scenario)
    except (KeyError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    json.dump(result, sys.stdout)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
