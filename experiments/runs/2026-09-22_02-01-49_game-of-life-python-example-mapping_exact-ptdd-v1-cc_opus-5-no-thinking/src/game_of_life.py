from typing import NamedTuple

MIN_NEIGHBOURS_TO_SURVIVE = 2
MAX_NEIGHBOURS_TO_SURVIVE = 3
NEIGHBOURS_TO_BE_BORN = 3


class Cell(NamedTuple):
    x: int
    y: int


def neighbours_of(cell):
    return [
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]


def living_neighbour_count(cell, living_cells):
    return sum(1 for neighbour in neighbours_of(cell) if neighbour in living_cells)


def survives(living_neighbours):
    return MIN_NEIGHBOURS_TO_SURVIVE <= living_neighbours <= MAX_NEIGHBOURS_TO_SURVIVE


def is_born(living_neighbours):
    return living_neighbours == NEIGHBOURS_TO_BE_BORN


def dead_neighbours_of(living_cells):
    candidates = []
    for cell in living_cells:
        for neighbour in neighbours_of(cell):
            if neighbour not in living_cells and neighbour not in candidates:
                candidates.append(neighbour)
    return candidates


def next_generation(living_cells):
    survivors = [
        cell
        for cell in living_cells
        if survives(living_neighbour_count(cell, living_cells))
    ]
    newborns = [
        cell
        for cell in dead_neighbours_of(living_cells)
        if is_born(living_neighbour_count(cell, living_cells))
    ]
    return survivors + newborns


def advance_generations(living_cells, generations):
    for _ in range(generations):
        living_cells = next_generation(living_cells)
    return living_cells
