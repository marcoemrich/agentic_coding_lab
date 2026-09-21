"""Executable specification for Conway's Game of Life."""

import pytest


def test_cell_carries_signed_integer_coordinates():
    """Cell(-2, 3) exposes x=-2 and y=3."""
    from game_of_life import Cell

    cell = Cell(-2, 3)

    assert (cell.x, cell.y) == (-2, 3)


def test_empty_generation_remains_empty():
    """next_generation(set()) equals the empty set."""
    from game_of_life import next_generation

    assert next_generation(set()) == set()


def test_single_cell_dies_from_underpopulation():
    """The specified single-cell example produces an empty generation."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_two_adjacent_cells_die_from_underpopulation():
    """The Rule 1 example, whose cells each have one neighbor, becomes empty."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == set()


def test_live_cell_with_two_neighbors_survives():
    """A live Cell(1, 1) with exactly two live neighbors remains alive."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 1), Cell(1, 1), Cell(2, 1)}

    assert Cell(1, 1) in next_generation(living_cells)


def test_live_cell_with_three_neighbors_survives():
    """A live Cell(1, 1) with exactly three live neighbors remains alive."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(1, 1), Cell(0, 1), Cell(2, 1), Cell(1, 0)}

    assert Cell(1, 1) in next_generation(living_cells)


def test_live_cell_with_four_neighbors_dies_from_overpopulation():
    """The Rule 3 boundary: live Cell(1, 1) with four neighbors is absent."""
    from game_of_life import Cell, next_generation

    living_cells = {
        Cell(1, 1),
        Cell(0, 1),
        Cell(2, 1),
        Cell(1, 0),
        Cell(1, 2),
    }

    assert Cell(1, 1) not in next_generation(living_cells)


def test_dead_cell_with_three_neighbors_is_reproduced():
    """The Rule 4 example creates Cell(1, 1) from its three neighbors."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}

    assert Cell(1, 1) in next_generation(living_cells)


def test_block_is_a_still_life():
    """The specified block coordinates are unchanged after one generation."""
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_blinker_rotates_after_one_generation():
    """[(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal


def test_blinker_returns_after_two_generations():
    """Applying next_generation twice restores the specified vertical blinker."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(next_generation(vertical)) == vertical


def test_generation_is_unbounded_in_negative_directions():
    """A block translated into negative x/y coordinates remains unchanged."""
    from game_of_life import Cell, next_generation

    negative_block = {
        Cell(-2, -2),
        Cell(-1, -2),
        Cell(-2, -1),
        Cell(-1, -1),
    }

    assert next_generation(negative_block) == negative_block


def test_cli_applies_one_generation_for_the_specified_json_example():
    """The exact two-cell CLI request writes {\"aliveCells\": []} only."""
    import subprocess
    import sys

    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input='{"aliveCells": [[0, 0], [1, 0]], "steps": 1}\n',
        capture_output=True,
        check=False,
        text=True,
    )

    result.check_returncode()
    assert result.stdout == '{"aliveCells": []}\n'


def test_cli_applies_multiple_steps_and_sorts_output():
    """Two blinker steps emit all living cells sorted by x, then y."""
    import subprocess
    import sys

    request = (
        '{"aliveCells": [[11, 1], [0, 2], [10, 0], [0, 0], '
        '[11, 0], [0, 1], [10, 1]], "steps": 2}\n'
    )
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=request,
        capture_output=True,
        check=False,
        text=True,
    )

    result.check_returncode()
    assert result.stdout == (
        '{"aliveCells": [[0, 0], [0, 1], [0, 2], [10, 0], '
        '[10, 1], [11, 0], [11, 1]]}\n'
    )
