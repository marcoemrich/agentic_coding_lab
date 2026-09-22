SURVIVING_NEIGHBOR_COUNTS = (2, 3)
NEIGHBORS_REQUIRED_FOR_BIRTH = 3


def generation_after(living_cells, generations):
    current = living_cells
    for _ in range(generations):
        current = next_generation(current)
    return current


def next_generation(living_cells):
    survivors = [cell for cell in living_cells if survives(cell, living_cells)]
    newborns = [cell for cell in dead_neighbors_of(living_cells) if is_born(cell, living_cells)]
    return survivors + newborns


def survives(cell, living_cells):
    return count_living_neighbors(cell, living_cells) in SURVIVING_NEIGHBOR_COUNTS


def is_born(cell, living_cells):
    return count_living_neighbors(cell, living_cells) == NEIGHBORS_REQUIRED_FOR_BIRTH


def dead_neighbors_of(living_cells):
    return {
        neighbor
        for cell in living_cells
        for neighbor in neighbors_of(cell)
        if neighbor not in living_cells
    }


def count_living_neighbors(cell, living_cells):
    return len([neighbor for neighbor in neighbors_of(cell) if neighbor in living_cells])


def neighbors_of(cell):
    x, y = cell
    return [
        (x + dx, y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]
