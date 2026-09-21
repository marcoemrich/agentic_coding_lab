from typing import NamedTuple

SURVIVAL_NEIGHBOUR_COUNTS = (2, 3)
BIRTH_NEIGHBOUR_COUNT = 3


class Cell(NamedTuple):
    x: int
    y: int


def next_generation(living_cells):
    living = set(living_cells)
    return [cell for cell in _candidates(living) if _lives_on(cell, living)]


def advance(living_cells, generations):
    for _ in range(generations):
        living_cells = next_generation(living_cells)
    return living_cells


def _lives_on(cell, living):
    neighbours = _living_neighbours(cell, living)
    if cell in living:
        return _survives(neighbours)
    return _is_born(neighbours)


def _survives(living_neighbours):
    return living_neighbours in SURVIVAL_NEIGHBOUR_COUNTS


def _is_born(living_neighbours):
    return living_neighbours == BIRTH_NEIGHBOUR_COUNT


def _candidates(living):
    return {candidate for cell in living for candidate in [cell, *_neighbours(cell)]}


def _living_neighbours(cell, living):
    return sum(1 for neighbour in _neighbours(cell) if neighbour in living)


def _neighbours(cell):
    return [
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]
