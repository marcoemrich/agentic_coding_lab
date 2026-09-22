"""Specification tests for Conway's Game of Life."""

import json
import subprocess
import sys

import pytest


def test_empty_generation_remains_empty():
    """Expect next_generation(set()) == set()."""
    from game_of_life import next_generation

    assert next_generation(set()) == set()


def test_cell_carries_integer_coordinates():
    """Expect Cell(-2, 3).x == -2 and .y == 3."""
    from game_of_life import Cell

    cell = Cell(-2, 3)

    assert (cell.x, cell.y) == (-2, 3)


def test_single_cell_dies():
    """Expect {(0, 0)} to produce no living cells."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_two_adjacent_cells_die():
    """Expect {(0, 1), (1, 1)} to produce no living cells."""
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_live_cell_with_two_neighbors_survives():
    """Expect the live center (1, 1) with two neighbors to remain alive."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    next_living_cells = next_generation({Cell(0, 1), center, Cell(2, 1)})

    assert center in next_living_cells


def test_live_cell_with_three_neighbors_survives():
    """Expect the live center (1, 1) with three neighbors to remain alive."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    next_living_cells = next_generation(
        {center, Cell(0, 0), Cell(1, 0), Cell(2, 0)}
    )

    assert center in next_living_cells


def test_overpopulation_example():
    """Expect the overpopulated center of ###/.#./### to die."""
    from game_of_life import Cell, next_generation

    center = Cell(1, 1)
    living_cells = {
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        center,
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    }

    assert center not in next_generation(living_cells)


def test_reproduction_example():
    """Expect {(0,0), (1,0), (0,1)} to produce the four-cell block."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}
    expected = living_cells | {Cell(1, 1)}

    assert next_generation(living_cells) == expected


def test_vertical_blinker_becomes_horizontal():
    """Expect {(0,0),(0,1),(0,2)} to produce {(-1,1),(0,1),(1,1)}."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    expected = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == expected


def test_horizontal_blinker_becomes_vertical():
    """Expect {(-1,1),(0,1),(1,1)} to produce {(0,0),(0,1),(0,2)}."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}
    expected = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(living_cells) == expected


def test_block_remains_unchanged():
    """Expect {(0,0),(1,0),(0,1),(1,1)} to remain unchanged."""
    from game_of_life import Cell, next_generation

    living_cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == living_cells


def test_cli_documented_example():
    """Expect two adjacent cells after one step to emit {\"aliveCells\": []}."""
    request = {"aliveCells": [[0, 0], [1, 0]], "steps": 1}

    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {"aliveCells": []}


def test_cli_applies_multiple_steps():
    """Expect a vertical blinker after two steps to return to vertical."""
    request = {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}

    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "aliveCells": [[0, 0], [0, 1], [0, 2]]
    }


def test_cli_sorts_cells_by_x_then_y():
    """Expect zero-step unsorted input to be emitted in x-then-y order."""
    request = {"aliveCells": [[1, 2], [-1, 3], [1, -2]], "steps": 0}

    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "aliveCells": [[-1, 3], [1, -2], [1, 2]]
    }


def test_cli_emits_only_json():
    """Expect stdout to contain only the result JSON object followed by a newline."""
    request = {"aliveCells": [[0, 0]], "steps": 1}

    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert completed.returncode == 0
    assert completed.stdout == '{"aliveCells": []}\n'
