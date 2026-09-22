"""JSON command-line adapter for the Game of Life."""

import json
import sys

from game_of_life import Cell, next_generation


def main() -> None:
    payload = json.load(sys.stdin)
    living = {Cell(x, y) for x, y in payload["aliveCells"]}

    for _ in range(payload["steps"]):
        living = next_generation(living)

    json.dump(
        {"aliveCells": [[cell.x, cell.y] for cell in sorted(living)]},
        sys.stdout,
    )


if __name__ == "__main__":
    main()
