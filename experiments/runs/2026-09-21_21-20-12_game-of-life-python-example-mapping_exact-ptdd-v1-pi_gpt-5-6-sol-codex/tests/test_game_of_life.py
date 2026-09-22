import pytest


def test_cell_carries_integer_coordinates():
    """Cell(2, -3) exposes x == 2 and y == -3."""
    from game_of_life import Cell

    cell = Cell(2, -3)

    assert (cell.x, cell.y) == (2, -3)


def test_single_cell_dies():
    """The next generation of {(0, 0)} is empty."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_pair_dies_from_underpopulation():
    """The next generation of {(0, 1), (1, 1)} is empty."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == set()


def test_live_cell_with_two_neighbors_survives():
    """The middle cell of a three-cell line survives with two neighbors."""
    from game_of_life import Cell, next_generation

    middle = Cell(1, 0)
    living_cells = {Cell(0, 0), middle, Cell(2, 0)}

    assert middle in next_generation(living_cells)


def test_live_cell_with_three_neighbors_survives():
    """Cell (1, 1) remains alive when its three neighbors are alive."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {Cell(0, 0), Cell(1, 0), Cell(2, 0), center}

    assert center in next_generation(living_cells)


def test_live_cell_with_four_neighbors_dies():
    """Cell (1, 1) is absent next generation when four neighbors are alive."""
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


def test_center_dies_in_overpopulation_example():
    """The center of the pictured seven-cell input dies from overpopulation."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {
        Cell(0, 0),
        Cell(1, 0),
        Cell(2, 0),
        center,
        Cell(0, 2),
        Cell(1, 2),
        Cell(2, 2),
    }

    assert center not in next_generation(living_cells)


def test_dead_cell_with_three_neighbors_is_born():
    """The L at (0, 0), (1, 0), (0, 1) becomes a four-cell block."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}
    expected = living_cells | {Cell(1, 1)}

    assert next_generation(living_cells) == expected


def test_blinker_oscillates():
    """A vertical blinker becomes horizontal, then vertical again."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    generation_one = next_generation(vertical)

    assert generation_one == horizontal
    assert next_generation(generation_one) == vertical


def test_block_is_still_life():
    """The block {(0, 0), (1, 0), (0, 1), (1, 1)} is unchanged."""
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_grid_extends_into_negative_coordinates():
    """A vertical line at x=-2 births cells at x=-3 and x=-1."""
    from game_of_life import Cell, next_generation

    vertical = {Cell(-2, -1), Cell(-2, 0), Cell(-2, 1)}
    horizontal = {Cell(-3, 0), Cell(-2, 0), Cell(-1, 0)}

    assert next_generation(vertical) == horizontal


def test_cli_example_returns_empty_generation():
    """The supplied adjacent-pair JSON example emits exactly {\"aliveCells\": []}."""
    import subprocess
    import sys

    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input='{"aliveCells": [[0, 0], [1, 0]], "steps": 1}',
        capture_output=True,
        check=False,
        text=True,
    )

    assert completed.returncode == 0
    assert completed.stdout == '{"aliveCells": []}\n'


def test_cli_applies_steps_and_sorts_cells():
    """Unsorted separated blinkers evolved twice are sorted by x, then y."""
    import json
    import subprocess
    import sys

    request = {
        "aliveCells": [[10, 2], [0, 1], [10, 0], [0, 2], [10, 1], [0, 0]],
        "steps": 2,
    }
    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        capture_output=True,
        check=False,
        text=True,
    )

    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2], [10, 0], [10, 1], [10, 2]]
    }
