"""Command-line entry point to the MHPCO's claim office.

Reads one scenario document from stdin and writes the office's results to
stdout. A scenario the office declines is reported on stderr and leaves stdout
empty, so a caller never mistakes a refusal for a settlement.

This module carries the document between the operating system's streams and the
office, and nothing else: every rule about what the office charges, pays, or
refuses is the domain's, and a refusal arrives here already decided.
"""

import json
import sys

from claim_office import run_scenario

SETTLED = 0

DECLINED = 1


def main():
    """Run the scenario on stdin, reporting results on stdout or a refusal on stderr.

    The office's verdict reaches a caller two ways at once, because a shell
    caller reads an exit status and a person reads stderr: a declined scenario
    is described on stderr and answered with a non-zero status, and the two
    always state the same verdict.
    """
    scenario = json.load(sys.stdin)
    try:
        results = run_scenario(scenario)
    except ValueError as refusal:
        print(f"the MHPCO declines this scenario: {refusal}", file=sys.stderr)
        return DECLINED
    json.dump(results, sys.stdout)
    return SETTLED


if __name__ == "__main__":
    sys.exit(main())
