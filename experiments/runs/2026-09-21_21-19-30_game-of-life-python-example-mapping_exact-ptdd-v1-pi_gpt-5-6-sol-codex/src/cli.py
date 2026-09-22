"""JSON command-line adapter for Conway's Game of Life."""

import json
import sys

from game_of_life import Cell, next_generation


def _living_cells_from(request: dict) -> set[Cell]:
    return {Cell(x, y) for x, y in request["aliveCells"]}


def _advance(living_cells: set[Cell], steps: int) -> set[Cell]:
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def main() -> None:
    """Read one generation request and write its JSON response."""
    request = json.load(sys.stdin)
    living_cells = _advance(_living_cells_from(request), request["steps"])
    sorted_cells = sorted(living_cells, key=lambda cell: (cell.x, cell.y))
    json.dump(
        {"aliveCells": [[cell.x, cell.y] for cell in sorted_cells]},
        sys.stdout,
    )
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
