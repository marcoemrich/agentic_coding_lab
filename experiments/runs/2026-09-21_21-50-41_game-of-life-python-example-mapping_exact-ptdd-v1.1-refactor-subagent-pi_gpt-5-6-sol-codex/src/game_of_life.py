from dataclasses import dataclass


MINIMUM_SURVIVAL_NEIGHBORS = 2
MAXIMUM_SURVIVAL_NEIGHBORS = 3
REPRODUCTION_NEIGHBORS = 3
NEIGHBOR_OFFSETS = tuple(
    (x_offset, y_offset)
    for x_offset in (-1, 0, 1)
    for y_offset in (-1, 0, 1)
    if (x_offset, y_offset) != (0, 0)
)


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


def _neighbors(cell: Cell) -> set[Cell]:
    return {
        Cell(cell.x + x_offset, cell.y + y_offset)
        for x_offset, y_offset in NEIGHBOR_OFFSETS
    }


def _live_neighbor_count(cell: Cell, living_cells: set[Cell]) -> int:
    return len(_neighbors(cell) & living_cells)


def _live_cell_survives(neighbor_count: int) -> bool:
    return MINIMUM_SURVIVAL_NEIGHBORS <= neighbor_count <= MAXIMUM_SURVIVAL_NEIGHBORS


def _dead_cell_reproduces(neighbor_count: int) -> bool:
    return neighbor_count == REPRODUCTION_NEIGHBORS


def _cell_will_live(cell: Cell, living_cells: set[Cell]) -> bool:
    neighbor_count = _live_neighbor_count(cell, living_cells)
    if cell in living_cells:
        return _live_cell_survives(neighbor_count)
    return _dead_cell_reproduces(neighbor_count)


def _cells_with_live_neighbors(living_cells: set[Cell]) -> set[Cell]:
    return {
        candidate
        for living_cell in living_cells
        for candidate in _neighbors(living_cell)
    }


def next_generation(living_cells: set[Cell]) -> set[Cell]:
    return {
        candidate
        for candidate in _cells_with_live_neighbors(living_cells)
        if _cell_will_live(candidate, living_cells)
    }
