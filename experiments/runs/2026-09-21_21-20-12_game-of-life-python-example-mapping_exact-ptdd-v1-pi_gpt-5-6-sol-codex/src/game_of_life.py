from dataclasses import dataclass


SURVIVAL_NEIGHBOR_COUNTS = frozenset({2, 3})
REPRODUCTION_NEIGHBOR_COUNT = 3


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


def _neighbors(cell: Cell) -> set[Cell]:
    return {
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    }


def _live_neighbor_count(cell: Cell, living_cells: set[Cell]) -> int:
    return len(_neighbors(cell) & living_cells)


def _survives(cell: Cell, living_cells: set[Cell]) -> bool:
    return _live_neighbor_count(cell, living_cells) in SURVIVAL_NEIGHBOR_COUNTS


def next_generation(living_cells: set[Cell]) -> set[Cell]:
    survivors = {cell for cell in living_cells if _survives(cell, living_cells)}
    candidates = {neighbor for cell in living_cells for neighbor in _neighbors(cell)}
    births = {
        cell
        for cell in candidates - living_cells
        if _live_neighbor_count(cell, living_cells) == REPRODUCTION_NEIGHBOR_COUNT
    }
    return survivors | births
