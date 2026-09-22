import json
import subprocess
import sys
from pathlib import Path

import pytest


def test_empty_generation_remains_empty():
    from game_of_life import next_generation

    assert next_generation(set()) == set()


def test_single_cell_dies():
    from game_of_life import Cell, next_generation

    assert next_generation({Cell(0, 0)}) == set()


def test_underpopulation_kills_two_adjacent_cells():
    from game_of_life import Cell, next_generation

    alive = {Cell(0, 1), Cell(1, 1)}

    assert next_generation(alive) == set()


def test_live_cell_with_two_neighbors_survives():
    from game_of_life import Cell, next_generation

    alive = {Cell(0, 0), Cell(1, 0), Cell(2, 0)}

    assert Cell(1, 0) in next_generation(alive)


def test_live_cell_with_three_neighbors_survives():
    from game_of_life import Cell, next_generation

    target = Cell(0, 0)
    alive = {target, Cell(-1, 0), Cell(1, 0), Cell(0, 1)}

    assert target in next_generation(alive)


def test_overpopulation_kills_cell_with_four_neighbors():
    from game_of_life import Cell, next_generation

    center = Cell(0, 0)
    alive = {center, Cell(-1, 0), Cell(1, 0), Cell(0, -1), Cell(0, 1)}

    assert center not in next_generation(alive)


def test_reproduction_creates_cell_with_three_neighbors():
    from game_of_life import Cell, next_generation

    alive = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}
    expected = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(alive) == expected


def test_overpopulation_example_follows_neighbor_rules():
    from game_of_life import Cell, next_generation

    alive = {
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    }
    expected = {
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
        Cell(1, -1), Cell(1, 3),
    }

    assert next_generation(alive) == expected


def test_blinker_rotates_to_horizontal():
    from game_of_life import Cell, next_generation

    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal


def test_blinker_returns_after_two_generations():
    from game_of_life import Cell, next_generation

    original = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(next_generation(original)) == original


def test_block_is_still_life():
    from game_of_life import Cell, next_generation

    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_generation_extends_into_negative_coordinates():
    from game_of_life import Cell, next_generation

    alive = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert Cell(-1, 1) in next_generation(alive)


def test_cli_contract_example():
    result = run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1})

    assert result == {"aliveCells": []}


def test_cli_applies_steps_and_sorts_output():
    payload = {"aliveCells": [[0, 2], [0, 0], [0, 1]], "steps": 2}

    assert run_cli(payload) == {"aliveCells": [[0, 0], [0, 1], [0, 2]]}


def run_cli(payload):
    root = Path(__file__).parents[1]
    completed = subprocess.run(
        [sys.executable, "src/cli.py"],
        cwd=root,
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=False,
    )
    assert completed.stderr == ""
    assert completed.returncode == 0
    return json.loads(completed.stdout)
