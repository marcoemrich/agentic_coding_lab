import json
import sys

from game_of_life import generation_after


def main():
    request = json.load(sys.stdin)
    living_cells = cells_from_json(request["aliveCells"])
    advanced = generation_after(living_cells, request["steps"])
    json.dump({"aliveCells": cells_to_json(advanced)}, sys.stdout)


def cells_from_json(alive_cells):
    return [(x, y) for x, y in alive_cells]


def cells_to_json(cells):
    return sorted(cells)


if __name__ == "__main__":
    main()
