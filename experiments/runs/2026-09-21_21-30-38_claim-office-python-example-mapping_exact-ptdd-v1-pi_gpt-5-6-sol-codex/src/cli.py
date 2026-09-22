import json
import sys

from claim_office import process_scenario


def main():
    try:
        result = process_scenario(json.load(sys.stdin))
    except (KeyError, ValueError) as error:
        print(f"claim-office error: {error}", file=sys.stderr)
        return 1
    json.dump(result, sys.stdout)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
