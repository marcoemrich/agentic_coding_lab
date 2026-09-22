"""Conway's Game of Life on an infinite grid, tracking only living cells."""

from typing import NamedTuple

SURVIVAL_COUNTS = (2, 3)
BIRTH_COUNT = 3


class Cell(NamedTuple):
    x: int
    y: int


def _neighbors(cell):
    return [
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]


def _neighbor_counts(living):
    """Map every cell adjacent to a living cell to its living-neighbor count."""
    counts = {}
    for cell in living:
        for neighbor in _neighbors(cell):
            counts[neighbor] = counts.get(neighbor, 0) + 1
    return counts


def _is_alive_next(cell, count, living):
    if cell in living:
        return count in SURVIVAL_COUNTS
    return count == BIRTH_COUNT


def next_generation(alive_cells):
    """Return the living cells of the generation following ``alive_cells``."""
    living = {Cell(*cell) for cell in alive_cells}
    return [
        cell
        for cell, count in _neighbor_counts(living).items()
        if _is_alive_next(cell, count, living)
    ]
