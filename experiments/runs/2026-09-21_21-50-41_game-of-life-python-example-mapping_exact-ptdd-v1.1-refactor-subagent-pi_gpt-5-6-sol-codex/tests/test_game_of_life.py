import json
import subprocess

import pytest

from game_of_life import Cell, next_generation


def test_empty_grid_has_empty_next_generation():
    """An empty generation produces exactly an empty set of living cells."""
    assert next_generation(set()) == set()


def test_single_live_cell_dies():
    """[(0, 0)] produces [] by underpopulation."""
    assert next_generation({Cell(0, 0)}) == set()


def test_two_adjacent_live_cells_die():
    """[(0, 1), (1, 1)] produces [] by the Rule 1 example."""
    living_cells = {Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == set()


def test_live_cell_with_two_neighbors_survives():
    """The center living cell remains alive when it has exactly 2 neighbors."""
    living_cells = {Cell(0, 1), Cell(1, 1), Cell(2, 1)}

    assert Cell(1, 1) in next_generation(living_cells)


def test_live_cell_with_three_neighbors_survives():
    """The center (1, 1) remains alive with exactly 3 neighbors (Rule 2 example)."""
    living_cells = {Cell(1, 1), Cell(0, 2), Cell(1, 2), Cell(2, 2)}

    assert Cell(1, 1) in next_generation(living_cells)


def test_live_cell_with_four_neighbors_dies():
    """The center (1, 1) dies with exactly 4 neighbors by overpopulation."""
    living_cells = {
        Cell(1, 1),
        Cell(1, 0),
        Cell(0, 1),
        Cell(2, 1),
        Cell(1, 2),
    }

    assert Cell(1, 1) not in next_generation(living_cells)


def test_dead_cell_with_three_neighbors_becomes_alive():
    """[(0, 1), (1, 1), (0, 0)] produces the four-cell block including (1, 0)."""
    living_cells = {Cell(0, 1), Cell(1, 1), Cell(0, 0)}
    expected = living_cells | {Cell(1, 0)}

    assert next_generation(living_cells) == expected


def test_blinker_oscillates_to_horizontal():
    """[(0, 0), (0, 1), (0, 2)] produces [(-1, 1), (0, 1), (1, 1)]."""
    living_cells = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    expected = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(living_cells) == expected


def test_blinker_returns_to_vertical_after_second_generation():
    """Two generations restore [(0, 0), (0, 1), (0, 2)]."""
    initial = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(next_generation(initial)) == initial


def test_block_is_a_still_life():
    """[(0, 0), (1, 0), (0, 1), (1, 1)] remains unchanged."""
    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_cli_applies_one_generation():
    """The specified two-cell JSON input emits {\"aliveCells\": []}."""
    request = {"aliveCells": [[0, 0], [1, 0]], "steps": 1}
    process = subprocess.run(
        ["python3", "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert process.returncode == 0
    assert json.loads(process.stdout) == {"aliveCells": []}


def test_cli_applies_multiple_steps_and_sorts_output():
    """A translated blinker and block run for 2 steps emit cells sorted by x then y."""
    request = {
        "aliveCells": [
            [11, 11],
            [2, 4],
            [10, 10],
            [2, 2],
            [11, 10],
            [2, 3],
            [10, 11],
        ],
        "steps": 2,
    }
    expected = [
        [2, 2],
        [2, 3],
        [2, 4],
        [10, 10],
        [10, 11],
        [11, 10],
        [11, 11],
    ]
    process = subprocess.run(
        ["python3", "src/cli.py"],
        input=json.dumps(request),
        text=True,
        capture_output=True,
        check=False,
    )

    assert process.returncode == 0
    assert json.loads(process.stdout) == {"aliveCells": expected}
