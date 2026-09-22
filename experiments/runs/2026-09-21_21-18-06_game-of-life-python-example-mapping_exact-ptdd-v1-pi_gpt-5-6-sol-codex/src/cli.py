import json
import sys

from game_of_life import Cell, next_generation


def _apply_generations(living_cells: set[Cell], steps: int) -> set[Cell]:
    for _step in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def main() -> None:
    payload = json.load(sys.stdin)
    living_cells = {Cell(x, y) for x, y in payload["aliveCells"]}
    living_cells = _apply_generations(living_cells, payload["steps"])
    sorted_cells = sorted(living_cells, key=lambda cell: (cell.x, cell.y))
    json.dump(
        {"aliveCells": [[cell.x, cell.y] for cell in sorted_cells]},
        sys.stdout,
    )


if __name__ == "__main__":
    main()
