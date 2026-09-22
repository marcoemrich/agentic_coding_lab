import json
import sys

from game_of_life import Cell, next_generation


def main():
    json.dump(_response_for(json.load(sys.stdin)), sys.stdout)


def _response_for(request):
    living_cells = _read_living_cells(request)
    return _write_living_cells(_advance(living_cells, request["steps"]))


def _advance(living_cells, steps):
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def _read_living_cells(request):
    return [Cell(x, y) for x, y in request["aliveCells"]]


def _write_living_cells(living_cells):
    return {"aliveCells": [[cell.x, cell.y] for cell in _in_emission_order(living_cells)]}


def _in_emission_order(living_cells):
    return sorted(living_cells, key=lambda cell: (cell.x, cell.y))


if __name__ == "__main__":
    main()
