"""Command-line entry point: reads a scenario from stdin, writes results to stdout."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from errors import ClaimOfficeError
from scenario import run_scenario


def main():
    try:
        scenario = json.load(sys.stdin)
        results = run_scenario(scenario)
    except (ClaimOfficeError, ValueError, KeyError, TypeError) as error:
        print(f"claim-office: {error}", file=sys.stderr)
        return 1
    json.dump({"results": results}, sys.stdout)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
