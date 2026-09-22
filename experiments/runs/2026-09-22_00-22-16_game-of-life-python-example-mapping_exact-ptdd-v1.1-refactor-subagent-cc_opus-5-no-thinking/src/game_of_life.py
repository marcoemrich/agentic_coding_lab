from typing import NamedTuple

SURVIVAL_NEIGHBOR_COUNTS = (2, 3)
BIRTH_NEIGHBOR_COUNT = 3


class Cell(NamedTuple):
    """A position on the infinite grid, carrying integer x and y coordinates."""

    x: int
    y: int


def next_generation(living_cells):
    living = {Cell(x, y) for x, y in living_cells}
    return {
        cell
        for cell in cells_that_could_change(living)
        if lives_on(cell in living, count_living_neighbors(cell, living))
    }


def cells_that_could_change(living):
    """On an infinite sparse board only living cells and their neighbors can change."""
    could_change = set(living)
    for cell in living:
        could_change.update(neighbors(cell))
    return could_change


def lives_on(is_living, living_neighbor_count):
    if is_living:
        return survives(living_neighbor_count)
    return is_born(living_neighbor_count)


def survives(living_neighbor_count):
    return living_neighbor_count in SURVIVAL_NEIGHBOR_COUNTS


def is_born(living_neighbor_count):
    return living_neighbor_count == BIRTH_NEIGHBOR_COUNT


def count_living_neighbors(cell, living):
    return len([neighbor for neighbor in neighbors(cell) if neighbor in living])


def neighbors(cell):
    x, y = cell
    return [
        Cell(x + dx, y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]
