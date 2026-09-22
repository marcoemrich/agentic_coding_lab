"""Conway's Game of Life on an unbounded, sparse grid."""

from collections import Counter
from dataclasses import dataclass
from typing import Iterable

BIRTH_NEIGHBOR_COUNT = 3
SURVIVAL_NEIGHBOR_COUNTS = (2, 3)


@dataclass(frozen=True, order=True)
class Cell:
    """A position on the grid."""

    x: int
    y: int


def next_generation(living_cells: Iterable[Cell]) -> set[Cell]:
    """Return the cells alive after one generation."""
    living = set(living_cells)
    neighbor_counts: Counter[Cell] = Counter()
    for cell in living:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if (dx, dy) != (0, 0):
                    neighbor_counts[Cell(cell.x + dx, cell.y + dy)] += 1

    return {
        cell
        for cell, count in neighbor_counts.items()
        if count == BIRTH_NEIGHBOR_COUNT
        or (count in SURVIVAL_NEIGHBOR_COUNTS and cell in living)
    }
