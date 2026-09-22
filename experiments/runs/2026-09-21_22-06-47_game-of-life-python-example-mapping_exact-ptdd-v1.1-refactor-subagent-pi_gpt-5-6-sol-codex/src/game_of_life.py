from dataclasses import dataclass


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


_NEIGHBOR_OFFSETS = tuple(
    (delta_x, delta_y)
    for delta_x in (-1, 0, 1)
    for delta_y in (-1, 0, 1)
    if (delta_x, delta_y) != (0, 0)
)
_SURVIVAL_COUNTS = (2, 3)
_REPRODUCTION_COUNT = 3


def next_generation(alive_cells):
    survivors = {cell for cell in alive_cells if _survives(cell, alive_cells)}
    births = {
        cell
        for cell in _birth_candidates(alive_cells)
        if _is_born(cell, alive_cells)
    }
    return survivors | births


def _birth_candidates(alive_cells):
    return {
        neighbor
        for cell in alive_cells
        for neighbor in _neighboring_cells(cell)
    } - alive_cells


def _neighboring_cells(cell):
    return {
        Cell(cell.x + delta_x, cell.y + delta_y)
        for delta_x, delta_y in _NEIGHBOR_OFFSETS
    }


def _survives(cell, alive_cells):
    return _live_neighbor_count(cell, alive_cells) in _SURVIVAL_COUNTS


def _is_born(cell, alive_cells):
    return _live_neighbor_count(cell, alive_cells) == _REPRODUCTION_COUNT


def _live_neighbor_count(cell, alive_cells):
    return sum(neighbor in alive_cells for neighbor in _neighboring_cells(cell))
