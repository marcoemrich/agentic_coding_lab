import json
import sys

from game_of_life import Cell, next_generation


def _advance(living_cells: set[Cell], steps: int) -> set[Cell]:
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def main() -> None:
    request = json.load(sys.stdin)
    living_cells = {Cell(x, y) for x, y in request["aliveCells"]}
    result = _advance(living_cells, request["steps"])
    coordinates = sorted((cell.x, cell.y) for cell in result)
    json.dump({"aliveCells": coordinates}, sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
