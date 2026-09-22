import json
import sys

from game_of_life import Cell, advance_generations


def generation_response(request):
    living_cells = {Cell(x, y) for x, y in request["aliveCells"]}
    final_generation = advance_generations(living_cells, request["steps"])
    ordered_cells = sorted(final_generation, key=lambda cell: (cell.x, cell.y))
    return {"aliveCells": [[cell.x, cell.y] for cell in ordered_cells]}


def main():
    request = json.load(sys.stdin)
    response = generation_response(request)
    json.dump(response, sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
