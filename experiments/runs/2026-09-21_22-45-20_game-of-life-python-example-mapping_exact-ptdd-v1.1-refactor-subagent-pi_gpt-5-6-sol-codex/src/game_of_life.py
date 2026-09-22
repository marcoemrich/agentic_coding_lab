from dataclasses import dataclass


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


LIVE_NEIGHBOR_COUNTS_FOR_SURVIVAL = {2, 3}
LIVE_NEIGHBORS_REQUIRED_FOR_REPRODUCTION = 3


def _neighboring_cells(cell: Cell) -> set[Cell]:
    return {
        Cell(cell.x + x_offset, cell.y + y_offset)
        for x_offset in (-1, 0, 1)
        for y_offset in (-1, 0, 1)
        if (x_offset, y_offset) != (0, 0)
    }


def _count_live_neighbors(cell: Cell, living_cells: set[Cell]) -> int:
    return len(_neighboring_cells(cell) & living_cells)


def _has_survival_neighbor_count(live_neighbor_count: int) -> bool:
    return live_neighbor_count in LIVE_NEIGHBOR_COUNTS_FOR_SURVIVAL


def _survives(cell: Cell, living_cells: set[Cell]) -> bool:
    return _has_survival_neighbor_count(_count_live_neighbors(cell, living_cells))


def _living_cells_that_survive(living_cells: set[Cell]) -> set[Cell]:
    return {cell for cell in living_cells if _survives(cell, living_cells)}


def _is_reproduced(cell: Cell, living_cells: set[Cell]) -> bool:
    return (
        _count_live_neighbors(cell, living_cells)
        == LIVE_NEIGHBORS_REQUIRED_FOR_REPRODUCTION
    )


def _reproduction_candidates(living_cells: set[Cell]) -> set[Cell]:
    return {
        neighbor
        for cell in living_cells
        for neighbor in _neighboring_cells(cell)
    } - living_cells


def _dead_cells_reproduced(living_cells: set[Cell]) -> set[Cell]:
    return {
        cell
        for cell in _reproduction_candidates(living_cells)
        if _is_reproduced(cell, living_cells)
    }


def next_generation(living_cells: set[Cell]) -> set[Cell]:
    return _living_cells_that_survive(living_cells) | _dead_cells_reproduced(living_cells)
