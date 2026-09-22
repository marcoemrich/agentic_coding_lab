"""Conway's Game of Life on an infinite, sparsely represented grid.

A cell is an ``(x, y)`` pair of integers. A generation is the collection of
its living cells; every cell not listed is dead.
"""

SURVIVAL_NEIGHBOR_COUNTS = (2, 3)
BIRTH_NEIGHBOR_COUNT = 3


def next_generation(living_cells):
    """Return the living cells of the generation that follows ``living_cells``."""
    living_positions = distinct_positions(living_cells)
    return [
        cell
        for cell in candidate_cells(living_positions)
        if is_alive_next_generation(
            cell in living_positions, count_living_neighbors(cell, living_positions)
        )
    ]


def generation_after(living_cells, steps):
    """Return the living cells ``steps`` generations after ``living_cells``."""
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells


def distinct_positions(cells):
    """List each coordinate once, because a coordinate names a single cell."""
    distinct = []
    for cell in cells:
        if cell not in distinct:
            distinct.append(cell)
    return distinct


def candidate_cells(living_cells):
    """List the cells whose state can change: the living cells and their neighbors."""
    return distinct_positions(
        position
        for cell in living_cells
        for position in [cell, *surrounding_positions(cell)]
    )


def surrounding_positions(cell):
    """List the eight positions surrounding ``cell``."""
    x, y = cell
    return [
        (x + dx, y + dy)
        for dx in (-1, 0, 1)
        for dy in (-1, 0, 1)
        if (dx, dy) != (0, 0)
    ]


def is_alive_next_generation(is_living, neighbor_count):
    """Decide whether a cell lives in the next generation."""
    if is_living:
        return survives(neighbor_count)
    return is_born(neighbor_count)


def survives(neighbor_count):
    """Decide whether a living cell stays alive with ``neighbor_count`` neighbors."""
    return neighbor_count in SURVIVAL_NEIGHBOR_COUNTS


def is_born(neighbor_count):
    """Decide whether a dead cell becomes alive with ``neighbor_count`` neighbors."""
    return neighbor_count == BIRTH_NEIGHBOR_COUNT


def count_living_neighbors(cell, living_cells):
    """Count how many of ``living_cells`` occupy a position surrounding ``cell``."""
    return sum(
        1 for position in surrounding_positions(cell) if position in living_cells
    )
