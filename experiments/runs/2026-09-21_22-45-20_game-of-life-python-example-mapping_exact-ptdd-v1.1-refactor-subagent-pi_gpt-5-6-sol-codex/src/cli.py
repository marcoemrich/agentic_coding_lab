import json
import sys

from game_of_life import Cell, next_generation


def _response_for(living_cells: set[Cell]) -> dict[str, list[list[int]]]:
    sorted_cells = sorted(living_cells, key=lambda cell: (cell.x, cell.y))
    return {"aliveCells": [[cell.x, cell.y] for cell in sorted_cells]}


def _advance_generations(living_cells: set[Cell], steps: int) -> set[Cell]:
    for _step in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def main() -> None:
    request = json.load(sys.stdin)
    living_cells = {Cell(x, y) for x, y in request["aliveCells"]}
    living_cells = _advance_generations(living_cells, request["steps"])
    json.dump(_response_for(living_cells), sys.stdout)


if __name__ == "__main__":
    main()
