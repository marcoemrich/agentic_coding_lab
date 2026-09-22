import json
import sys

from game_of_life import next_generation


def main():
    request = json.load(sys.stdin)
    alive_cells = _generations_after(
        _cells_from_pairs(request["aliveCells"]), request["steps"]
    )
    json.dump({"aliveCells": _pairs_from_cells(alive_cells)}, sys.stdout)


def _generations_after(alive_cells, steps):
    for _ in range(steps):
        alive_cells = next_generation(alive_cells)
    return alive_cells


def _cells_from_pairs(pairs):
    return [(x, y) for x, y in pairs]


def _pairs_from_cells(cells):
    return [[x, y] for x, y in _sorted_by_x_then_y(cells)]


def _sorted_by_x_then_y(cells):
    return sorted(cells, key=lambda cell: (cell[0], cell[1]))


if __name__ == "__main__":
    main()
