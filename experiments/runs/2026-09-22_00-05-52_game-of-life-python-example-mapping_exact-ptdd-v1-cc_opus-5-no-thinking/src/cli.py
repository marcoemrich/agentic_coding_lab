import json
import sys

from game_of_life import Cell, next_generation


def read_cells(payload):
    return [Cell(x, y) for x, y in payload["aliveCells"]]


def write_cells(cells):
    ordered = sorted(cells, key=lambda cell: (cell.x, cell.y))
    return {"aliveCells": [[cell.x, cell.y] for cell in ordered]}


def advance(living_cells, steps):
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def main():
    request = json.load(sys.stdin)
    living_cells = advance(read_cells(request), request["steps"])
    json.dump(write_cells(living_cells), sys.stdout)


if __name__ == "__main__":
    main()
