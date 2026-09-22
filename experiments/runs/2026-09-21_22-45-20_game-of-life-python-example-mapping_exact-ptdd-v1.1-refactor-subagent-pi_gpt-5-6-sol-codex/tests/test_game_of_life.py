import json
import subprocess
import sys

import pytest


def test_cell_carries_integer_coordinates_as_a_value():
    from game_of_life import Cell

    assert Cell(2, -3) == Cell(2, -3)
    assert (Cell(2, -3).x, Cell(2, -3).y) == (2, -3)


def test_empty_generation_remains_empty():
    from game_of_life import next_generation

    assert next_generation(set()) == set()


def test_single_cell_dies_from_underpopulation():
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_two_adjacent_cells_die_from_underpopulation():
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_live_cell_with_two_neighbors_survives():
    from game_of_life import Cell, next_generation

    next_cells = next_generation({Cell(0, 0), Cell(1, 0), Cell(2, 0)})
    assert Cell(1, 0) in next_cells


def test_live_cell_with_three_neighbors_survives():
    from game_of_life import Cell, next_generation

    current = {Cell(1, 1), Cell(0, 0), Cell(1, 0), Cell(2, 0)}
    assert Cell(1, 1) in next_generation(current)


def test_live_cell_with_four_neighbors_dies_from_overpopulation():
    from game_of_life import Cell, next_generation

    current = {
        Cell(1, 1),
        Cell(0, 1),
        Cell(2, 1),
        Cell(1, 0),
        Cell(1, 2),
    }
    assert Cell(1, 1) not in next_generation(current)


def test_dead_cell_with_three_neighbors_is_reproduced():
    from game_of_life import Cell, next_generation

    current = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}
    assert Cell(1, 1) in next_generation(current)


def test_block_is_a_still_life():
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}
    assert next_generation(block) == block


def test_vertical_blinker_becomes_horizontal():
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}
    assert next_generation(vertical) == horizontal


def test_blinker_returns_after_two_generations():
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    assert next_generation(next_generation(vertical)) == vertical


def test_generation_extends_without_a_positive_coordinate_boundary():
    from game_of_life import Cell, next_generation

    current = {Cell(-2, -2), Cell(-1, -2), Cell(-2, -1)}
    assert Cell(-1, -1) in next_generation(current)


def test_cli_applies_one_generation_for_the_contract_example():
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps({"aliveCells": [[0, 0], [1, 0]], "steps": 1}),
        text=True,
        capture_output=True,
        check=True,
    )
    assert json.loads(result.stdout) == {"aliveCells": []}


def test_cli_applies_steps_and_sorts_output_by_x_then_y():
    result = subprocess.run(
        [sys.executable, "src/cli.py"],
        input=json.dumps({"aliveCells": [[0, 2], [0, 0], [0, 1]], "steps": 2}),
        text=True,
        capture_output=True,
        check=True,
    )
    assert json.loads(result.stdout) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}
