import pytest


def test_empty_generation_remains_empty():
    """An empty set of living cells produces an empty next generation."""
    from game_of_life import next_generation

    assert next_generation(set()) == set()


def test_cell_value_carries_integer_coordinates():
    """Cell(2, -3) exposes x=2 and y=-3 and has value equality."""
    from game_of_life import Cell

    cell = Cell(2, -3)

    assert (cell.x, cell.y) == (2, -3)
    assert cell == Cell(2, -3)


def test_single_cell_dies_from_underpopulation():
    """[(0, 0)] becomes [] because the cell has no live neighbors."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_adjacent_pair_dies_from_underpopulation():
    """[(0, 1), (1, 1)] becomes [] because each cell has one neighbor."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_live_cell_survives_with_exactly_two_neighbors():
    """A live cell with exactly two live neighbors remains alive."""
    from game_of_life import Cell, next_generation

    center = Cell(0, 0)
    living_cells = {center, Cell(-1, -1), Cell(1, 1)}

    assert center in next_generation(living_cells)


def test_live_cell_survives_with_exactly_three_neighbors():
    """The living center cell (1, 1) survives when it has three neighbors."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {center, Cell(0, 0), Cell(1, 0), Cell(2, 0)}

    assert center in next_generation(living_cells)


def test_live_cell_dies_with_more_than_three_neighbors():
    """The living center cell (1, 1) dies when it has four neighbors."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {
        center,
        Cell(1, 0),
        Cell(0, 1),
        Cell(2, 1),
        Cell(1, 2),
    }

    assert center not in next_generation(living_cells)


def test_dead_cell_becomes_alive_with_exactly_three_neighbors():
    """The L shape [(0, 0), (1, 0), (0, 1)] becomes a four-cell block."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}
    expected = living_cells | {Cell(1, 1)}

    assert next_generation(living_cells) == expected


def test_blinker_rotates_from_vertical_to_horizontal():
    """[(0, 0), (0, 1), (0, 2)] becomes [(-1, 1), (0, 1), (1, 1)]."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal


def test_blinker_returns_to_vertical_after_two_generations():
    """Advancing the blinker twice restores [(0, 0), (0, 1), (0, 2)]."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(next_generation(vertical)) == vertical


def test_block_remains_unchanged():
    """[(0, 0), (1, 0), (0, 1), (1, 1)] remains unchanged."""
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_generation_extends_through_negative_coordinates():
    """A vertical blinker at x=-2 births cells at x=-3 and x=-1."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(-2, 0), Cell(-2, 1), Cell(-2, 2)}
    horizontal = {Cell(-3, 1), Cell(-2, 1), Cell(-1, 1)}

    assert next_generation(vertical) == horizontal
