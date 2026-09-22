"""Conway's Game of Life on an unbounded grid."""

from collections import Counter
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True, order=True)
class Cell:
    """A location on the grid."""

    x: int
    y: int


SURVIVAL_COUNTS = frozenset({2, 3})
REPRODUCTION_COUNT = 3


def next_generation(living_cells: Iterable[Cell]) -> set[Cell]:
    """Return the living cells after one generation."""
    current = set(living_cells)
    neighbor_counts: Counter[Cell] = Counter()

    for cell in current:
        for x_offset in (-1, 0, 1):
            for y_offset in (-1, 0, 1):
                if (x_offset, y_offset) != (0, 0):
                    neighbor = Cell(cell.x + x_offset, cell.y + y_offset)
                    neighbor_counts[neighbor] += 1

    return {
        cell
        for cell, count in neighbor_counts.items()
        if count == REPRODUCTION_COUNT
        or (cell in current and count in SURVIVAL_COUNTS)
    }
