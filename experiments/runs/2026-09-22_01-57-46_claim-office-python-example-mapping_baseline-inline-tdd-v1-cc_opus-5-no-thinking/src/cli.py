"""Command line entry point: scenario JSON on stdin, results JSON on stdout."""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scenario import run_scenario


def main():
    try:
        scenario = json.load(sys.stdin)
        results = run_scenario(scenario)
    except Exception as error:
        print(f"claim rejected: {error}", file=sys.stderr)
        return 1
    json.dump({"results": results}, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
