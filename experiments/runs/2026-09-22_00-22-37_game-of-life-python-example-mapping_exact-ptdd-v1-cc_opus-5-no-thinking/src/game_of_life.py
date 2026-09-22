NEIGHBOURS_KEEPING_A_CELL_ALIVE = (2, 3)
NEIGHBOURS_BRINGING_A_CELL_TO_LIFE = 3


def next_generation(alive_cells):
    survivors = [cell for cell in alive_cells if _survives(cell, alive_cells)]
    newborns = [
        cell for cell in _dead_neighbours_of(alive_cells) if _is_born(cell, alive_cells)
    ]
    return survivors + newborns


def _survives(cell, alive_cells):
    return _living_neighbour_count(cell, alive_cells) in NEIGHBOURS_KEEPING_A_CELL_ALIVE


def _is_born(cell, alive_cells):
    return _living_neighbour_count(cell, alive_cells) == NEIGHBOURS_BRINGING_A_CELL_TO_LIFE


def _dead_neighbours_of(alive_cells):
    dead_neighbours = set()
    for x, y in alive_cells:
        for neighbour_x in (x - 1, x, x + 1):
            for neighbour_y in (y - 1, y, y + 1):
                neighbour = (neighbour_x, neighbour_y)
                if neighbour not in alive_cells:
                    dead_neighbours.add(neighbour)
    return dead_neighbours


def _living_neighbour_count(cell, alive_cells):
    return sum(1 for other in alive_cells if _is_neighbour(cell, other))


def _is_neighbour(cell, other):
    x, y = cell
    other_x, other_y = other
    if (other_x, other_y) == (x, y):
        return False
    return abs(other_x - x) <= 1 and abs(other_y - y) <= 1
