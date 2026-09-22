"""Conway's Game of Life on an unbounded, sparse grid."""

from collections import Counter
from dataclasses import dataclass
from typing import Iterable

SURVIVAL_NEIGHBORS = 2
BIRTH_NEIGHBORS = 3


@dataclass(frozen=True, slots=True, order=True)
class Cell:
    """A location on the grid."""

    x: int
    y: int


def next_generation(alive_cells: Iterable[Cell]) -> set[Cell]:
    """Return the living cells after one generation."""
    alive = set(alive_cells)
    neighbor_counts: Counter[Cell] = Counter()

    for cell in alive:
        for x_offset in (-1, 0, 1):
            for y_offset in (-1, 0, 1):
                if x_offset != 0 or y_offset != 0:
                    neighbor_counts[
                        Cell(cell.x + x_offset, cell.y + y_offset)
                    ] += 1

    return {
        cell
        for cell, count in neighbor_counts.items()
        if count == BIRTH_NEIGHBORS
        or (count == SURVIVAL_NEIGHBORS and cell in alive)
    }
