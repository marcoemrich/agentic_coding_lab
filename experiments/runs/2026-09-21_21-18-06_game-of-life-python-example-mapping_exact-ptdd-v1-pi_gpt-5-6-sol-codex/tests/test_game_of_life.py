import json
import subprocess
import sys
from pathlib import Path

import pytest


def test_cell_is_a_coordinate_value():
    from game_of_life import Cell

    assert Cell(2, -3) == Cell(2, -3)
    assert (Cell(2, -3).x, Cell(2, -3).y) == (2, -3)


def test_empty_generation_remains_empty():
    from game_of_life import next_generation

    assert next_generation(set()) == set()


def test_single_cell_dies():
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_two_cells_die_from_underpopulation():
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_live_cell_with_two_neighbors_survives():
    from game_of_life import Cell, next_generation

    current = {Cell(0, 0), Cell(1, 0), Cell(2, 0)}

    assert Cell(1, 0) in next_generation(current)


def test_live_cell_with_three_neighbors_survives():
    from game_of_life import Cell, next_generation

    current = {Cell(0, 0), Cell(0, 1), Cell(1, 0), Cell(1, 1)}

    assert Cell(1, 1) in next_generation(current)


def test_live_cell_dies_from_overpopulation():
    from game_of_life import Cell, next_generation

    current = {
        Cell(1, 1),
        Cell(0, 1),
        Cell(2, 1),
        Cell(1, 0),
        Cell(1, 2),
    }

    assert Cell(1, 1) not in next_generation(current)


def test_dead_cell_with_three_neighbors_becomes_alive():
    from game_of_life import Cell, next_generation

    current = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}

    assert Cell(1, 1) in next_generation(current)


def test_dead_cell_without_exactly_three_neighbors_stays_dead():
    from game_of_life import Cell, next_generation

    current = {Cell(-1, 0), Cell(1, 0), Cell(0, -1), Cell(0, 1)}

    following = next_generation(current)
    assert Cell(2, 0) not in following  # two neighbors
    assert Cell(0, 0) not in following  # four neighbors


def test_blinker_rotates_after_one_generation():
    from game_of_life import Cell, next_generation

    current = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(current) == {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}


def test_blinker_returns_after_two_generations():
    from game_of_life import Cell, next_generation

    initial = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(next_generation(initial)) == initial


def test_block_is_a_still_life():
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_grid_extends_in_negative_directions():
    from game_of_life import Cell, next_generation

    current = {Cell(-2, -2), Cell(-2, -1), Cell(-2, 0)}

    assert next_generation(current) == {
        Cell(-3, -1),
        Cell(-2, -1),
        Cell(-1, -1),
    }


def test_cli_applies_the_requested_generation():
    result = run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1})

    assert result == {"aliveCells": []}


def test_cli_sorts_cells_by_x_then_y():
    result = run_cli(
        {"aliveCells": [[1, 2], [-1, 3], [1, -2], [-1, -1]], "steps": 0}
    )

    assert result == {"aliveCells": [[-1, -1], [-1, 3], [1, -2], [1, 2]]}


def test_cli_applies_multiple_generations():
    result = run_cli(
        {"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2}
    )

    assert result == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def run_cli(payload):
    project_root = Path(__file__).parents[1]
    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        cwd=project_root,
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(completed.stdout)
