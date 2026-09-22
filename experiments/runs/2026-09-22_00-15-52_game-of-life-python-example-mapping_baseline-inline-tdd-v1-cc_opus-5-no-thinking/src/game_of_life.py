from typing import Iterable, Iterator, NamedTuple

SURVIVAL_NEIGHBOUR_COUNTS = (2, 3)
BIRTH_NEIGHBOUR_COUNT = 3


class Cell(NamedTuple):
    x: int
    y: int

    def neighbours(self) -> Iterator["Cell"]:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if (dx, dy) != (0, 0):
                    yield Cell(self.x + dx, self.y + dy)


def next_generation(living_cells: Iterable[Cell]) -> set[Cell]:
    living = {Cell(*cell) for cell in living_cells}
    return {cell for cell in _candidates(living) if _is_alive_next(cell, living)}


def _candidates(living: set[Cell]) -> set[Cell]:
    return living | {neighbour for cell in living for neighbour in cell.neighbours()}


def _is_alive_next(cell: Cell, living: set[Cell]) -> bool:
    count = _living_neighbour_count(cell, living)
    if cell in living:
        return count in SURVIVAL_NEIGHBOUR_COUNTS
    return count == BIRTH_NEIGHBOUR_COUNT


def _living_neighbour_count(cell: Cell, living: set[Cell]) -> int:
    return sum(1 for neighbour in cell.neighbours() if neighbour in living)
