from typing import NamedTuple

SURVIVAL_NEIGHBOUR_COUNTS = (2, 3)
REPRODUCTION_NEIGHBOUR_COUNT = 3


class Cell(NamedTuple):
    x: int
    y: int


def next_generation(living_cells):
    living = set(living_cells)
    return [
        cell
        for cell in _cells_that_could_change(living)
        if _lives_next_generation(cell in living, _living_neighbours(cell, living))
    ]


def _lives_next_generation(is_alive, living_neighbours):
    if is_alive:
        return living_neighbours in SURVIVAL_NEIGHBOUR_COUNTS
    return living_neighbours == REPRODUCTION_NEIGHBOUR_COUNT


def _cells_that_could_change(living):
    candidates = set(living)
    for cell in living:
        candidates.update(_neighbours(cell))
    return candidates


def _living_neighbours(cell, living):
    return sum(1 for neighbour in _neighbours(cell) if neighbour in living)


def _neighbours(cell):
    return [
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]
