"""JSON command-line adapter for Conway's Game of Life."""

import json
import sys

from game_of_life import Cell, generations_after


def _living_cells_from_request(request):
    return {Cell(x, y) for x, y in request["aliveCells"]}


def _cells_sorted_by_x_then_y(living_cells):
    return sorted(living_cells, key=lambda cell: (cell.x, cell.y))


def _response_for_living_cells(living_cells):
    return {
        "aliveCells": [
            [cell.x, cell.y]
            for cell in _cells_sorted_by_x_then_y(living_cells)
        ]
    }


def _response_for_request(request):
    living_cells = generations_after(
        _living_cells_from_request(request), request["steps"]
    )
    return _response_for_living_cells(living_cells)


def main():
    """Read one generation request and write its JSON result."""
    request = json.load(sys.stdin)
    json.dump(_response_for_request(request), sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
