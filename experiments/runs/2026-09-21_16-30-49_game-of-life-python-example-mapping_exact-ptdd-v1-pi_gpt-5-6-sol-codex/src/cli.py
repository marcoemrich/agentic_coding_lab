"""JSON command-line adapter for Conway's Game of Life."""

import json
import sys

from game_of_life import Cell, next_generation


def _apply_steps(living_cells: set[Cell], steps: int) -> set[Cell]:
    for _step in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def main() -> None:
    """Read one generation request and write its resulting living cells."""
    request = json.load(sys.stdin)
    living_cells = {Cell(x, y) for x, y in request["aliveCells"]}
    result = _apply_steps(living_cells, request["steps"])
    coordinates = sorted((cell.x, cell.y) for cell in result)
    json.dump({"aliveCells": coordinates}, sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
