import json
import sys

from game_of_life import Cell, advance_generations


def parse_cells(alive_cells):
    return [Cell(x, y) for x, y in alive_cells]


def format_cells(living_cells):
    return [[cell.x, cell.y] for cell in sorted(living_cells)]


def main():
    request = json.load(sys.stdin)
    living_cells = advance_generations(parse_cells(request["aliveCells"]), request["steps"])
    json.dump({"aliveCells": format_cells(living_cells)}, sys.stdout)


if __name__ == "__main__":
    main()
