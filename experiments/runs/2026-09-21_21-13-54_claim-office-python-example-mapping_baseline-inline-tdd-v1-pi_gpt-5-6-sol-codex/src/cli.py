"""JSON command-line adapter for the MHPCO claim office."""

from __future__ import annotations

import json
import sys

from claim_office import ScenarioError, process_scenario


def main() -> int:
    try:
        scenario = json.load(sys.stdin)
        result = process_scenario(scenario)
    except (ScenarioError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    json.dump(result, sys.stdout, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
