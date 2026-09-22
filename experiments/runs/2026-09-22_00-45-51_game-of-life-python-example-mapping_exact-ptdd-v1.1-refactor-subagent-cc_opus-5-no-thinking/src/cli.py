"""Command-line adapter: one JSON request on stdin, one JSON response on stdout."""

import json
import sys

from game_of_life import generation_after


def main():
    """Read the request from stdin and write the resulting generation to stdout."""
    request = json.load(sys.stdin)
    living_cells = generation_after(to_living_cells(request), request["steps"])
    print(json.dumps(to_response(living_cells)))


def to_living_cells(request):
    """Translate a request object into the living cells the domain works with."""
    return [(x, y) for x, y in request["aliveCells"]]


def to_response(living_cells):
    """Translate living cells into the response object the contract describes."""
    return {"aliveCells": [[x, y] for x, y in in_emission_order(living_cells)]}


def in_emission_order(cells):
    """Order cells the way the contract emits them: by ``x``, then ``y``."""
    return sorted(cells)


if __name__ == "__main__":
    main()
