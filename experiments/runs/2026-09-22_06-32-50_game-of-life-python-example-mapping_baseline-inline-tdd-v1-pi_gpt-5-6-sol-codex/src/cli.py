"""JSON command-line adapter for the Game of Life."""

import json
import sys

from game_of_life import Cell, next_generation


def main() -> None:
    """Read a state from stdin and write the requested generation to stdout."""
    request = json.load(sys.stdin)
    living = {Cell(x, y) for x, y in request["aliveCells"]}

    for _ in range(request["steps"]):
        living = next_generation(living)

    response = {"aliveCells": [[cell.x, cell.y] for cell in sorted(living)]}
    json.dump(response, sys.stdout)


if __name__ == "__main__":
    main()
