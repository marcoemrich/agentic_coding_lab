from collections import Counter
from dataclasses import dataclass


@dataclass(frozen=True)
class Cell:
    x: int
    y: int


_SURVIVING_NEIGHBOR_COUNTS = {2, 3}
_REPRODUCTION_NEIGHBOR_COUNT = 3
_NEIGHBOR_OFFSETS = tuple(
    (x_offset, y_offset)
    for x_offset in (-1, 0, 1)
    for y_offset in (-1, 0, 1)
    if (x_offset, y_offset) != (0, 0)
)


def _neighbor_counts(living_cells):
    counts = Counter()
    for cell in living_cells:
        counts.update(
            Cell(cell.x + x_offset, cell.y + y_offset)
            for x_offset, y_offset in _NEIGHBOR_OFFSETS
        )
    return counts


def _will_be_alive(is_currently_alive, live_neighbor_count):
    if is_currently_alive:
        return live_neighbor_count in _SURVIVING_NEIGHBOR_COUNTS
    return live_neighbor_count == _REPRODUCTION_NEIGHBOR_COUNT


def next_generation(living_cells):
    return {
        cell
        for cell, live_neighbor_count in _neighbor_counts(living_cells).items()
        if _will_be_alive(cell in living_cells, live_neighbor_count)
    }


def advance_generations(living_cells, steps):
    for _ in range(steps):
        living_cells = next_generation(living_cells)
    return living_cells
