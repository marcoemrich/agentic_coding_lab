#!/usr/bin/env python3
"""JSON command-line adapter for the claim office."""

from __future__ import annotations

import json
import sys

from claim_office import ClaimOffice, InvalidScenario


def main() -> int:
    try:
        scenario = json.load(sys.stdin)
        results = ClaimOffice().process(scenario)
    except (InvalidScenario, json.JSONDecodeError, KeyError, TypeError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    json.dump({"results": results}, sys.stdout, separators=(",", ":"))
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
