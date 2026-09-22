import json
import sys

from game_of_life import Cell, next_generation


def advance_generations(living, steps):
    """Apply the domain's generation step as many times as the request asks."""
    generation = living
    for _ in range(steps):
        generation = next_generation(generation)
    return generation


def decode_cells(alive_cells):
    """Translate the wire format's [x, y] pairs into domain cells."""
    return [Cell(x, y) for x, y in alive_cells]


def in_output_order(cells):
    """The CLI contract orders emitted cells by x, then y."""
    return sorted(cells, key=lambda cell: (cell.x, cell.y))


def encode_cells(cells):
    """Translate domain cells back into the wire format's [x, y] pairs."""
    return [[cell.x, cell.y] for cell in in_output_order(cells)]


def main():
    request = json.load(sys.stdin)
    generation = advance_generations(
        decode_cells(request["aliveCells"]), request["steps"]
    )
    json.dump({"aliveCells": encode_cells(generation)}, sys.stdout)


if __name__ == "__main__":
    main()
