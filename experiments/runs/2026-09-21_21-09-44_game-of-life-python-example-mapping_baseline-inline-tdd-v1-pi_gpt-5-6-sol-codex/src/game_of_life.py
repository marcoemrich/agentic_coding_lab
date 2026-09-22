"""Conway's Game of Life on an unbounded, sparse grid."""

from collections.abc import Iterable
from dataclasses import dataclass


@dataclass(frozen=True)
class Cell:
    """A position on the Game of Life grid."""

    x: int
    y: int


def next_generation(living_cells: Iterable[Cell]) -> set[Cell]:
    """Return the living cells in the generation after *living_cells*."""
    living = set(living_cells)
    survivors = set()
    for cell in living:
        neighbor_count = sum(
            Cell(cell.x + dx, cell.y + dy) in living
            for dx in (-1, 0, 1)
            for dy in (-1, 0, 1)
            if (dx, dy) != (0, 0)
        )
        if neighbor_count in (2, 3):
            survivors.add(cell)
    return survivors
