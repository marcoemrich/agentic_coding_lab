"""JSON command-line adapter for Conway's Game of Life."""

import json
import sys
from typing import Any

from game_of_life import Cell, next_generation


def process(request: dict[str, Any]) -> dict[str, list[list[int]]]:
    """Apply the requested generations and build the JSON response."""
    alive = {Cell(x, y) for x, y in request["aliveCells"]}
    for _ in range(request.get("steps", 1)):
        alive = next_generation(alive)

    return {"aliveCells": [[cell.x, cell.y] for cell in sorted(alive)]}


def main() -> None:
    """Read one request from stdin and write one response to stdout."""
    request = json.load(sys.stdin)
    json.dump(process(request), sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
