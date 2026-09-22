import pytest


def test_cell_carries_integer_coordinates():
    """A cell is a coordinate value with integer x and y fields."""
    from game_of_life import Cell

    cell = Cell(0, 0)

    assert cell.x == 0
    assert cell.y == 0
    assert isinstance(cell.x, int)
    assert isinstance(cell.y, int)


def test_single_cell_dies_from_underpopulation():
    """A live cell with zero neighbors dies."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_adjacent_pair_dies_from_underpopulation():
    """The Rule 1 example's cells each have one neighbor and both die."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == set()


def test_live_cell_survives_with_two_neighbors():
    """The lower boundary of Rule 2 is inclusive."""
    from game_of_life import Cell, next_generation

    center = Cell(0, 0)
    living_cells = {Cell(-1, 0), center, Cell(1, 0)}

    assert center in next_generation(living_cells)


def test_live_cell_survives_with_three_neighbors():
    """The Rule 2 center-cell example survives at the upper boundary."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {Cell(0, 0), Cell(1, 0), Cell(2, 0), center}

    assert center in next_generation(living_cells)


def test_live_cell_dies_with_four_neighbors():
    """The lower boundary of Rule 3 is overpopulation."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {
        center,
        Cell(0, 1),
        Cell(2, 1),
        Cell(1, 0),
        Cell(1, 2),
    }

    assert center not in next_generation(living_cells)


def test_overpopulation_example_loses_its_center():
    """The full Rule 3 input loses its center while all four rules still apply."""
    from game_of_life import Cell, next_generation

    outer_cells = {
        Cell(0, 0),
        Cell(1, 0),
        Cell(2, 0),
        Cell(0, 2),
        Cell(1, 2),
        Cell(2, 2),
    }

    births = {Cell(1, -1), Cell(1, 3)}

    assert next_generation(outer_cells | {Cell(1, 1)}) == outer_cells | births


def test_dead_cell_is_born_with_three_neighbors():
    """The Rule 4 example reproduces at (1, 1)."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}
    expected = living_cells | {Cell(1, 1)}

    assert next_generation(living_cells) == expected


def test_block_is_a_still_life():
    """The four block coordinates survive without additional births."""
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_vertical_blinker_becomes_horizontal():
    """The first blinker generation matches the pattern example."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal


def test_blinker_returns_after_two_generations():
    """Applying generation twice demonstrates the oscillator."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(next_generation(vertical)) == vertical


def test_generation_supports_unbounded_negative_and_positive_coordinates():
    """No finite grid boundary constrains cell coordinates."""
    from game_of_life import Cell, next_generation

    living_cells = {
        Cell(origin_x + x, origin_y + y)
        for origin_x, origin_y in ((-1000, -1000), (1000000, 1000000))
        for x, y in ((0, 0), (1, 0), (0, 1), (1, 1))
    }

    assert next_generation(living_cells) == living_cells
