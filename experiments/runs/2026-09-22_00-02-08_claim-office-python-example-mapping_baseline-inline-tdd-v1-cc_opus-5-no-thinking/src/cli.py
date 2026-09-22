"""CLI entry point: reads a scenario as JSON on stdin, writes results on stdout."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from errors import ScenarioError
from scenario import run_scenario


def main():
    try:
        scenario = json.load(sys.stdin)
        output = run_scenario(scenario)
    except (ScenarioError, ValueError, KeyError, TypeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    json.dump(output, sys.stdout)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
