"""Conway's Game of Life domain operations."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Cell:
    """A location on the infinite grid."""

    x: int
    y: int


MINIMUM_SURVIVAL_NEIGHBORS = 2
MAXIMUM_SURVIVAL_NEIGHBORS = 3
REPRODUCTION_NEIGHBORS = 3


def _live_neighbor_count(cell: Cell, living_cells: set[Cell]) -> int:
    return sum(
        other != cell
        and abs(other.x - cell.x) <= 1
        and abs(other.y - cell.y) <= 1
        for other in living_cells
    )


def _survives(live_neighbor_count: int) -> bool:
    return (
        MINIMUM_SURVIVAL_NEIGHBORS
        <= live_neighbor_count
        <= MAXIMUM_SURVIVAL_NEIGHBORS
    )


def _is_born(live_neighbor_count: int) -> bool:
    return live_neighbor_count == REPRODUCTION_NEIGHBORS


def _evolution_candidates(living_cells: set[Cell]) -> set[Cell]:
    return {
        Cell(cell.x + x_offset, cell.y + y_offset)
        for cell in living_cells
        for x_offset in range(-1, 2)
        for y_offset in range(-1, 2)
    }


def next_generation(living_cells: set[Cell]) -> set[Cell]:
    """Return the living cells in the following generation."""
    next_living_cells = {
        cell
        for cell in living_cells
        if _survives(_live_neighbor_count(cell, living_cells))
    }
    next_living_cells.update(
        cell
        for cell in _evolution_candidates(living_cells) - living_cells
        if _is_born(_live_neighbor_count(cell, living_cells))
    )
    return next_living_cells
