import json
import sys

from game_of_life import Cell, next_generation


def _advance(alive_cells, steps):
    for _ in range(steps):
        alive_cells = next_generation(alive_cells)
    return alive_cells


def _sorted_coordinates(alive_cells):
    return sorted((cell.x, cell.y) for cell in alive_cells)


def main():
    request = json.load(sys.stdin)
    alive_cells = {Cell(x, y) for x, y in request["aliveCells"]}
    alive_cells = _advance(alive_cells, request["steps"])
    json.dump({"aliveCells": _sorted_coordinates(alive_cells)}, sys.stdout)


if __name__ == "__main__":
    main()
