"""Command-line entry point: a scenario on stdin, its results on stdout."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scenario import run_scenario


def main():
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except Exception as error:
        # Any rule violation is reported to the operator on stderr.
        print(f"claim-office: {error}", file=sys.stderr)
        return 1
    json.dump(results, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
