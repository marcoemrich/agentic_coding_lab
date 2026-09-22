"""Command-line entry point: a scenario on stdin, its results on stdout."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scenario import run_scenario


def main():
    try:
        results = run_scenario(json.load(sys.stdin))
    except Exception as error:  # any refusal is a rejected scenario
        print(f"claim rejected: {error}", file=sys.stderr)
        return 1
    json.dump({"results": results}, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
