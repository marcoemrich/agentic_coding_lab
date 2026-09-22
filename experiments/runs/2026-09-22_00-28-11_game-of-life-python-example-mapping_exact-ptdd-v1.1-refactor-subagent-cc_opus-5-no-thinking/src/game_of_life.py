from dataclasses import dataclass

SURVIVAL_NEIGHBOR_COUNTS = (2, 3)
REPRODUCTION_NEIGHBOR_COUNT = 3


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


def next_generation(living_cells):
    living = set(living_cells)
    return [
        cell
        for cell in _cells_that_could_change(living)
        if _is_alive_next_generation(cell, living)
    ]


def _is_alive_next_generation(cell, living):
    neighbor_count = _living_neighbor_count(cell, living)
    if cell in living:
        return neighbor_count in SURVIVAL_NEIGHBOR_COUNTS
    return neighbor_count == REPRODUCTION_NEIGHBOR_COUNT


def _cells_that_could_change(living):
    candidates = set(living)
    for cell in living:
        candidates.update(_neighbors_of(cell))
    return candidates


def _neighbors_of(cell):
    return [
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]


def _living_neighbor_count(cell, living):
    return sum(1 for neighbor in _neighbors_of(cell) if neighbor in living)
