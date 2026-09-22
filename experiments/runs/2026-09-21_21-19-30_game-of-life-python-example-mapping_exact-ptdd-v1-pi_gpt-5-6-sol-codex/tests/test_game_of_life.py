"""Executable specification for Conway's Game of Life."""

import pytest


def test_empty_generation_remains_empty():
    """No living cells produces an empty next generation."""
    from game_of_life import next_generation

    assert next_generation(set()) == set()


def test_cell_is_a_coordinate_value():
    """Cell(2, -3) exposes integer coordinates and equals the same value."""
    from game_of_life import Cell

    cell = Cell(2, -3)

    assert cell.x == 2
    assert cell.y == -3
    assert cell == Cell(2, -3)
    assert len({cell, Cell(2, -3)}) == 1


def test_single_cell_dies():
    """[(0, 0)] becomes an empty generation."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_pair_dies_from_underpopulation():
    """[(0, 1), (1, 1)] becomes an empty generation."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == set()


def test_live_cell_with_two_neighbors_survives():
    """A live center cell with exactly two live neighbors remains alive."""
    from game_of_life import Cell, next_generation

    center = Cell(0, 0)
    living_cells = {Cell(-1, 0), center, Cell(1, 0)}

    assert center in next_generation(living_cells)


def test_live_cell_with_three_neighbors_survives():
    """The example's center cell (1, 1), with three neighbors, remains alive."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {center, Cell(0, 0), Cell(1, 0), Cell(2, 0)}

    assert center in next_generation(living_cells)


def test_live_cell_with_four_neighbors_dies():
    """A live center cell with more than three neighbors is absent next."""
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


def test_dead_cell_with_three_neighbors_is_born():
    """[(0, 0), (1, 0), (0, 1)] becomes the specified four-cell block."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}
    expected = living_cells | {Cell(1, 1)}

    assert next_generation(living_cells) == expected


def test_block_is_unchanged():
    """[(0,0), (1,0), (0,1), (1,1)] remains unchanged."""
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_vertical_blinker_becomes_horizontal():
    """[(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal


def test_horizontal_blinker_becomes_vertical():
    """The blinker second generation returns to [(0,0), (0,1), (0,2)]."""
    from game_of_life import Cell, next_generation

    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}
    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(horizontal) == vertical


def test_pattern_evolves_across_negative_coordinates():
    """A blinker translated into negative x/y evolves without a grid boundary."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(-2, -3), Cell(-2, -2), Cell(-2, -1)}
    horizontal = {Cell(-3, -2), Cell(-2, -2), Cell(-1, -2)}

    assert next_generation(vertical) == horizontal


def test_cli_outputs_empty_cells_for_supplied_pair_example():
    """The supplied one-step pair request emits exactly {\"aliveCells\": []}."""
    import json
    import subprocess
    import sys

    request = {"aliveCells": [[0, 0], [1, 0]], "steps": 1}
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert result.returncode == 0
    assert result.stdout == '{"aliveCells": []}\n'


def test_cli_applies_multiple_steps_and_sorts_cells():
    """Two blinker steps emit the original cells sorted by x, then y."""
    import json
    import subprocess
    import sys

    request = {"aliveCells": [[0, 2], [0, 0], [0, 1]], "steps": 2}
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert result.returncode == 0
    assert json.loads(result.stdout) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]],
    }
