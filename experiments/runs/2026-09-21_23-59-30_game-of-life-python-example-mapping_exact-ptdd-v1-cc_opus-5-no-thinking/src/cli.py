import json
import sys

from game_of_life import Cell, next_generation


def main():
    request = json.load(sys.stdin)
    living_cells = _decode_cells(request["aliveCells"])
    for _ in range(request["steps"]):
        living_cells = next_generation(living_cells)
    json.dump({"aliveCells": _encode_cells(living_cells)}, sys.stdout)


def _decode_cells(coordinate_pairs):
    return [Cell(x, y) for x, y in coordinate_pairs]


def _encode_cells(cells):
    """Emit the cells as [x, y] pairs, sorted by x and then by y."""
    return [[cell.x, cell.y] for cell in sorted(cells, key=lambda cell: (cell.x, cell.y))]


if __name__ == "__main__":
    main()
