from dataclasses import dataclass

CROWD_THAT_SUSTAINS_LIFE = (2, 3)
CROWD_THAT_CREATES_LIFE = 3


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


def is_neighbour(cell, other):
    return other != cell and abs(other.x - cell.x) <= 1 and abs(other.y - cell.y) <= 1


def living_neighbours(cell, living_cells):
    return sum(1 for other in living_cells if is_neighbour(cell, other))


def neighbourhood(cell):
    return [
        Cell(cell.x + dx, cell.y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]


def survives(cell, living_cells):
    return living_neighbours(cell, living_cells) in CROWD_THAT_SUSTAINS_LIFE


def is_reborn(cell, living_cells):
    return living_neighbours(cell, living_cells) == CROWD_THAT_CREATES_LIFE


def dead_cells_touching_life(living_cells):
    return {
        candidate
        for cell in living_cells
        for candidate in neighbourhood(cell)
        if candidate not in living_cells
    }


def next_generation(living_cells):
    survivors = [cell for cell in living_cells if survives(cell, living_cells)]
    births = [
        candidate
        for candidate in dead_cells_touching_life(living_cells)
        if is_reborn(candidate, living_cells)
    ]
    return survivors + births
