import json
import sys

from game_of_life import Cell, advance


def main():
    request = json.load(sys.stdin)
    cells = [Cell(x, y) for x, y in request["aliveCells"]]
    surviving = advance(cells, request["steps"])
    json.dump({"aliveCells": [[cell.x, cell.y] for cell in sorted(surviving)]}, sys.stdout)


if __name__ == "__main__":
    main()
