NEIGHBOR_OFFSETS = [
    (-1, -1), (0, -1), (1, -1),
    (-1, 0), (1, 0),
    (-1, 1), (0, 1), (1, 1),
]

SURVIVAL_NEIGHBOR_COUNTS = (2, 3)
REPRODUCTION_NEIGHBOR_COUNT = 3


def advance(living_cells, generations):
    """Evolve a population forward by a number of generations."""
    living = set(living_cells)
    for _ in range(generations):
        living = next_generation(living)
    return living


def next_generation(living_cells):
    living = set(living_cells)
    return {
        cell
        for cell in candidate_cells(living)
        if is_living_next_generation(cell, living)
    }


def is_living_next_generation(cell, living):
    neighbor_count = living_neighbor_count(cell, living)
    if cell in living:
        return survives(neighbor_count)
    return reproduces(neighbor_count)


def survives(neighbor_count):
    return neighbor_count in SURVIVAL_NEIGHBOR_COUNTS


def reproduces(neighbor_count):
    return neighbor_count == REPRODUCTION_NEIGHBOR_COUNT


def candidate_cells(living):
    """Only living cells and their neighbors can be living next generation."""
    candidates = set(living)
    for cell in living:
        candidates.update(neighbors(cell))
    return candidates


def neighbors(cell):
    x, y = cell
    return [(x + dx, y + dy) for dx, dy in NEIGHBOR_OFFSETS]


def living_neighbor_count(cell, living):
    return sum(1 for neighbor in neighbors(cell) if neighbor in living)
