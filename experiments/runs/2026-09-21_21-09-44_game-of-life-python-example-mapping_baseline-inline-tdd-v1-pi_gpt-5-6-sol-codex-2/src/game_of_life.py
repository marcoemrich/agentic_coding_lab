"""Conway's Game of Life on an infinite, sparse grid."""

from collections.abc import Iterable
from dataclasses import dataclass

SURVIVAL_COUNTS = frozenset({2, 3})
REPRODUCTION_COUNT = 3


@dataclass(frozen=True, order=True, slots=True)
class Cell:
    """A coordinate on the grid."""

    x: int
    y: int


def _live_neighbor_count(cell: Cell, living_cells: set[Cell]) -> int:
    return sum(
        Cell(cell.x + dx, cell.y + dy) in living_cells
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    )


def _will_live(cell: Cell, living_cells: set[Cell]) -> bool:
    neighbor_count = _live_neighbor_count(cell, living_cells)
    return neighbor_count == REPRODUCTION_COUNT or (
        cell in living_cells and neighbor_count in SURVIVAL_COUNTS
    )


def next_generation(living_cells: Iterable[Cell]) -> set[Cell]:
    """Return the living cells in the generation after *living_cells*."""
    living = set(living_cells)
    candidates = living | {
        Cell(cell.x + dx, cell.y + dy)
        for cell in living
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    }
    return {cell for cell in candidates if _will_live(cell, living)}
