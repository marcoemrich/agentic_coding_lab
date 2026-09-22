"""Conway's Game of Life on an infinite grid, tracking only living cells."""

from collections import Counter
from collections.abc import Iterable
from typing import NamedTuple


class Cell(NamedTuple):
    """A position on the infinite grid."""

    x: int
    y: int


def neighbours(cell: Cell) -> list[Cell]:
    """The eight cells adjacent to ``cell``, horizontally, vertically or diagonally."""
    return [
        Cell(cell.x + dx, cell.y + dy)
        for dy in (-1, 0, 1)
        for dx in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]


SURVIVES = (2, 3)
IS_BORN = 3


def next_generation(living: Iterable[Cell]) -> set[Cell]:
    """The generation that follows ``living``, applying the four rules at once.

    Only cells with at least one living neighbour can be alive afterwards, so
    counting neighbours of the living cells covers the whole infinite grid.
    """
    living = set(living)
    neighbour_counts = Counter(
        neighbour for cell in living for neighbour in neighbours(cell)
    )
    return {
        cell
        for cell, count in neighbour_counts.items()
        if count == IS_BORN or (count in SURVIVES and cell in living)
    }
