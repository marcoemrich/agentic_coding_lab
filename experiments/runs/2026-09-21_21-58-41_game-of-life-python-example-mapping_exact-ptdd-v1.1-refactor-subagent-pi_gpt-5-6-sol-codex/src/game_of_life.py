"""Conway's Game of Life domain operations."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Cell:
    """Coordinates of a cell on the infinite grid."""

    x: int
    y: int


_MIN_LIVE_NEIGHBORS_FOR_SURVIVAL = 2
_MAX_LIVE_NEIGHBORS_FOR_SURVIVAL = 3
_LIVE_NEIGHBORS_FOR_REPRODUCTION = 3


def _count_live_neighbors(cell, living_cells):
    return len(_neighboring_cells(cell) & living_cells)


def _is_survival_neighbor_count(live_neighbors):
    return (
        _MIN_LIVE_NEIGHBORS_FOR_SURVIVAL
        <= live_neighbors
        <= _MAX_LIVE_NEIGHBORS_FOR_SURVIVAL
    )


def _live_cell_survives(cell, living_cells):
    return _is_survival_neighbor_count(_count_live_neighbors(cell, living_cells))


def _dead_cell_is_born(cell, living_cells):
    return (
        _count_live_neighbors(cell, living_cells)
        == _LIVE_NEIGHBORS_FOR_REPRODUCTION
    )


def _neighboring_cells(cell):
    return {
        Cell(cell.x + x_offset, cell.y + y_offset)
        for x_offset in (-1, 0, 1)
        for y_offset in (-1, 0, 1)
        if (x_offset, y_offset) != (0, 0)
    }


def _will_be_alive(cell, living_cells):
    return (
        cell in living_cells and _live_cell_survives(cell, living_cells)
    ) or (
        cell not in living_cells and _dead_cell_is_born(cell, living_cells)
    )


def _next_generation_candidates(living_cells):
    return living_cells | {
        neighbor
        for cell in living_cells
        for neighbor in _neighboring_cells(cell)
    }


def next_generation(living_cells):
    """Return the generation following ``living_cells``."""
    return {
        cell
        for cell in _next_generation_candidates(living_cells)
        if _will_be_alive(cell, living_cells)
    }


def generations_after(living_cells, steps):
    """Return the living cells after advancing ``steps`` generations."""
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells
