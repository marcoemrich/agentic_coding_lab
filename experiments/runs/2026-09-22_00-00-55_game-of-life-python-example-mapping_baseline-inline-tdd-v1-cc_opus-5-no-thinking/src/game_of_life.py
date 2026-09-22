from typing import NamedTuple

SURVIVAL_COUNTS = (2, 3)
BIRTH_COUNT = 3


class Cell(NamedTuple):
    x: int
    y: int

    def neighbours(self):
        return [
            Cell(self.x + dx, self.y + dy)
            for dx in (-1, 0, 1)
            for dy in (-1, 0, 1)
            if (dx, dy) != (0, 0)
        ]


def next_generation(alive_cells):
    alive = set(alive_cells)
    candidates = alive | {n for cell in alive for n in cell.neighbours()}
    return {cell for cell in candidates if _lives_on(cell, alive)}


def _lives_on(cell, alive):
    live_neighbours = sum(n in alive for n in cell.neighbours())
    if cell in alive:
        return live_neighbours in SURVIVAL_COUNTS
    return live_neighbours == BIRTH_COUNT
