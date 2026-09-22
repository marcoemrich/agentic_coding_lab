import json
import sys

from game_of_life import Cell, next_generation


def _sorted_coordinates(living_cells: set[Cell]) -> list[list[int]]:
    ordered_cells = sorted(living_cells, key=lambda cell: (cell.x, cell.y))
    return [[cell.x, cell.y] for cell in ordered_cells]


def _advance(living_cells: set[Cell], steps: int) -> set[Cell]:
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def main() -> None:
    request = json.load(sys.stdin)
    living_cells = {Cell(x, y) for x, y in request["aliveCells"]}
    result = _advance(living_cells, request["steps"])
    json.dump({"aliveCells": _sorted_coordinates(result)}, sys.stdout)


if __name__ == "__main__":
    main()
