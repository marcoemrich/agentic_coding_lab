"""Conway's Game of Life domain model."""

from dataclasses import dataclass

SURVIVAL_NEIGHBOR_COUNTS = frozenset({2, 3})
REPRODUCTION_NEIGHBOR_COUNT = 3


@dataclass(frozen=True)
class Cell:
    """A location on the infinite grid."""

    x: int
    y: int


def _neighbors(cell: Cell) -> set[Cell]:
    return {
        Cell(cell.x + x_offset, cell.y + y_offset)
        for x_offset in (-1, 0, 1)
        for y_offset in (-1, 0, 1)
        if (x_offset, y_offset) != (0, 0)
    }


def _live_neighbor_count(cell: Cell, living_cells: set[Cell]) -> int:
    return sum(neighbor in living_cells for neighbor in _neighbors(cell))


def _survives(cell: Cell, living_cells: set[Cell]) -> bool:
    return _live_neighbor_count(cell, living_cells) in SURVIVAL_NEIGHBOR_COUNTS


def _lives_next(cell: Cell, living_cells: set[Cell]) -> bool:
    if cell in living_cells:
        return _survives(cell, living_cells)
    return (
        _live_neighbor_count(cell, living_cells) == REPRODUCTION_NEIGHBOR_COUNT
    )


def next_generation(living_cells: set[Cell]) -> set[Cell]:
    """Return the living cells in the following generation."""
    candidates = {
        candidate for cell in living_cells for candidate in _neighbors(cell)
    }
    return {cell for cell in candidates if _lives_next(cell, living_cells)}
