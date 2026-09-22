"""Conway's Game of Life on an unbounded, sparse grid."""

from collections import Counter
from dataclasses import dataclass
from typing import Iterable


_SURVIVAL_COUNTS = frozenset({2, 3})
_REPRODUCTION_COUNT = 3


@dataclass(frozen=True, order=True, slots=True)
class Cell:
    """A location on the grid."""

    x: int
    y: int


def _neighbors(cell: Cell) -> set[Cell]:
    return {
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    }


def next_generation(living_cells: Iterable[Cell]) -> set[Cell]:
    """Return the living cells in the generation after *living_cells*."""
    living = set(living_cells)
    neighbor_counts = Counter(
        neighbor for cell in living for neighbor in _neighbors(cell)
    )
    return {
        cell
        for cell, count in neighbor_counts.items()
        if count == _REPRODUCTION_COUNT
        or (cell in living and count in _SURVIVAL_COUNTS)
    }
