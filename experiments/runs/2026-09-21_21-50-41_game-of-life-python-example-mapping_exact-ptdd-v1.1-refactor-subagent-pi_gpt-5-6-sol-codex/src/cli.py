import json
import sys

from game_of_life import Cell, next_generation


def _advance_generations(living_cells: set[Cell], steps: int) -> set[Cell]:
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def _next_generation_response(request: dict) -> dict:
    living_cells = {Cell(x, y) for x, y in request["aliveCells"]}
    evolved_cells = _advance_generations(living_cells, request["steps"])
    ordered_cells = sorted(evolved_cells, key=lambda cell: (cell.x, cell.y))
    return {"aliveCells": [[cell.x, cell.y] for cell in ordered_cells]}


def main() -> None:
    request = json.load(sys.stdin)
    json.dump(_next_generation_response(request), sys.stdout)


if __name__ == "__main__":
    main()
