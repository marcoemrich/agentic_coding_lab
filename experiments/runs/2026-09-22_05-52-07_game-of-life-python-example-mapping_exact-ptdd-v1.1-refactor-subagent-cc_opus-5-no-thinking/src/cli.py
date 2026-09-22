import json
import sys

from game_of_life import advance


def main():
    request = json.load(sys.stdin)
    living = advance(parse_cells(request["aliveCells"]), request["steps"])
    json.dump({"aliveCells": format_cells_sorted_by_x_then_y(living)}, sys.stdout)


def parse_cells(cells):
    return [tuple(cell) for cell in cells]


def format_cells_sorted_by_x_then_y(cells):
    return [list(cell) for cell in sorted(cells)]


if __name__ == "__main__":
    main()
