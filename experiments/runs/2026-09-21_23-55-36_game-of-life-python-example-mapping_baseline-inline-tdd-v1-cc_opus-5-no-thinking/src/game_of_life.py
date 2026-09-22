from collections import Counter
from typing import Iterable, NamedTuple

SURVIVAL_COUNTS = (2, 3)
BIRTH_COUNT = 3


class Cell(NamedTuple):
    x: int
    y: int

    def neighbors(self) -> Iterable["Cell"]:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx or dy:
                    yield Cell(self.x + dx, self.y + dy)


def next_generation(alive_cells: Iterable[Cell]) -> set[Cell]:
    alive = {Cell(*cell) for cell in alive_cells}
    neighbor_counts = Counter(
        neighbor for cell in alive for neighbor in cell.neighbors()
    )
    return {
        cell
        for cell, count in neighbor_counts.items()
        if count in SURVIVAL_COUNTS
        if cell in alive or count == BIRTH_COUNT
    }
