from dataclasses import dataclass


SURVIVAL_NEIGHBOR_COUNTS = {2, 3}
REPRODUCTION_NEIGHBOR_COUNT = 3
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


def next_generation(living_cells: set[Cell]) -> set[Cell]:
    candidates = living_cells | {
        Cell(cell.x + x_offset, cell.y + y_offset)
        for cell in living_cells
        for x_offset, y_offset in NEIGHBOR_OFFSETS
    }
    return {cell for cell in candidates if _will_be_alive(cell, living_cells)}


def _will_be_alive(cell: Cell, living_cells: set[Cell]) -> bool:
    live_neighbors = _live_neighbor_count(cell, living_cells)
    return _is_born(cell, living_cells, live_neighbors) or _survives(
        cell, living_cells, live_neighbors
    )


def _is_born(cell: Cell, living_cells: set[Cell], live_neighbors: int) -> bool:
    return (
        cell not in living_cells
        and live_neighbors == REPRODUCTION_NEIGHBOR_COUNT
    )


def _survives(cell: Cell, living_cells: set[Cell], live_neighbors: int) -> bool:
    return cell in living_cells and live_neighbors in SURVIVAL_NEIGHBOR_COUNTS


def _live_neighbor_count(cell: Cell, living_cells: set[Cell]) -> int:
    return sum(
        Cell(cell.x + x_offset, cell.y + y_offset) in living_cells
        for x_offset, y_offset in NEIGHBOR_OFFSETS
    )
