import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from game_of_life import Cell, next_generation


def main():
    request = json.load(sys.stdin)
    cells = {Cell(x, y) for x, y in request["aliveCells"]}
    for _ in range(request.get("steps", 1)):
        cells = next_generation(cells)
    json.dump({"aliveCells": [list(cell) for cell in sorted(cells)]}, sys.stdout)


if __name__ == "__main__":
    main()
