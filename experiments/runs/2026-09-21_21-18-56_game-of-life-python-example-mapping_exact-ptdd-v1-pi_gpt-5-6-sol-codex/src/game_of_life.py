from dataclasses import dataclass


MINIMUM_SURVIVING_NEIGHBORS = 2
MAXIMUM_SURVIVING_NEIGHBORS = 3
REPRODUCTION_NEIGHBORS = 3


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


def _neighbor_count(cell: Cell, living_cells: set[Cell]) -> int:
    return sum(
        1
        for other in living_cells
        if other != cell
        and abs(other.x - cell.x) <= 1
        and abs(other.y - cell.y) <= 1
    )


def _survives(cell: Cell, living_cells: set[Cell]) -> bool:
    neighbor_count = _neighbor_count(cell, living_cells)
    return MINIMUM_SURVIVING_NEIGHBORS <= neighbor_count <= MAXIMUM_SURVIVING_NEIGHBORS


def _is_born(cell: Cell, living_cells: set[Cell]) -> bool:
    return _neighbor_count(cell, living_cells) == REPRODUCTION_NEIGHBORS


def _neighboring_cells(living_cells: set[Cell]) -> set[Cell]:
    return {
        Cell(cell.x + x_offset, cell.y + y_offset)
        for cell in living_cells
        for x_offset in (-1, 0, 1)
        for y_offset in (-1, 0, 1)
        if x_offset != 0 or y_offset != 0
    }


def next_generation(living_cells: set[Cell]) -> set[Cell]:
    survivors = {cell for cell in living_cells if _survives(cell, living_cells)}
    births = {
        cell
        for cell in _neighboring_cells(living_cells) - living_cells
        if _is_born(cell, living_cells)
    }
    return survivors | births
