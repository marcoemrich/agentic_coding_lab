import json
import subprocess
import sys
from pathlib import Path

from game_of_life import next_generation

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(request):
    completed = subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(request),
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(completed.stdout)


def test_empty_grid_stays_empty():
    assert next_generation([]) == []


def test_single_cell_dies_of_underpopulation():
    assert next_generation([(0, 0)]) == []


def test_two_neighboring_cells_both_die_of_underpopulation():
    assert next_generation([(0, 1), (1, 1)]) == []


def test_live_cell_with_two_neighbors_survives():
    vertical_blinker = [(0, 0), (0, 1), (0, 2)]

    assert (0, 1) in next_generation(vertical_blinker)


def test_live_cell_with_three_neighbors_survives():
    top_row_with_live_centre = [(0, 2), (1, 2), (2, 2), (1, 1)]

    assert (1, 1) in next_generation(top_row_with_live_centre)


def test_live_cell_with_four_neighbors_dies_of_overpopulation():
    centre_with_four_neighbours = [(0, 2), (1, 2), (2, 2), (1, 1), (1, 0)]

    assert (1, 1) not in next_generation(centre_with_four_neighbours)


def test_live_cell_with_eight_neighbors_dies_of_overpopulation():
    full_block = [(x, y) for x in range(3) for y in range(3)]

    assert (1, 1) not in next_generation(full_block)


def test_dead_cell_with_three_neighbors_becomes_alive():
    horizontal_row = [(0, 2), (1, 2), (2, 2)]

    assert (1, 1) in next_generation(horizontal_row)


def test_dead_cell_with_two_neighbors_stays_dead():
    horizontal_pair = [(0, 1), (1, 1)]

    assert (1, 0) not in next_generation(horizontal_pair)


def test_dead_cell_with_four_neighbors_stays_dead():
    four_corners = [(0, 0), (2, 0), (0, 2), (2, 2)]

    assert (1, 1) not in next_generation(four_corners)


def test_reproduction_example_from_specification():
    corner_triple = [(0, 1), (1, 1), (0, 0)]

    assert sorted(next_generation(corner_triple)) == [(0, 0), (0, 1), (1, 0), (1, 1)]


def test_overpopulation_example_from_specification():
    """Rule 3 grid: the centre with 4 live neighbours dies.

    The specification's Gen 1 picture for this example is a 3x3 crop that its own
    four rules cannot produce -- the two middle-row cells it shows alive have 5
    live neighbours each, and it omits the two cells born outside the crop. The
    rules are normative here, so this test pins the rule-derived generation.
    """
    ring_with_centre = [(0, 2), (1, 2), (2, 2), (1, 1), (0, 0), (1, 0), (2, 0)]

    assert sorted(next_generation(ring_with_centre)) == [
        (0, 0),
        (0, 2),
        (1, -1),
        (1, 0),
        (1, 2),
        (1, 3),
        (2, 0),
        (2, 2),
    ]


def test_block_still_life_is_unchanged():
    block = [(0, 0), (1, 0), (0, 1), (1, 1)]

    assert sorted(next_generation(block)) == sorted(block)


def test_blinker_oscillates_to_horizontal():
    vertical_blinker = [(0, 0), (0, 1), (0, 2)]

    assert sorted(next_generation(vertical_blinker)) == [(-1, 1), (0, 1), (1, 1)]


def test_blinker_returns_to_vertical_after_two_generations():
    vertical_blinker = [(0, 0), (0, 1), (0, 2)]

    two_generations_later = next_generation(next_generation(vertical_blinker))

    assert sorted(two_generations_later) == sorted(vertical_blinker)


def test_pattern_at_negative_coordinates_behaves_identically():
    far_negative_blinker = [(-1000, -1002), (-1000, -1001), (-1000, -1000)]

    assert sorted(next_generation(far_negative_blinker)) == [
        (-1001, -1001),
        (-1000, -1001),
        (-999, -1001),
    ]


def test_cli_applies_one_generation_and_writes_json():
    response = run_cli({"aliveCells": [[0, 0], [1, 0]], "steps": 1})

    assert response == {"aliveCells": []}


def test_cli_applies_the_requested_number_of_steps():
    """Two generations return the blinker to its starting cells.

    Output ordering is a separate behavior, pinned by the sorting test below.
    """
    response = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 2})

    assert sorted(response["aliveCells"]) == [[0, 0], [0, 1], [0, 2]]


def test_cli_emits_cells_sorted_by_x_then_y():
    response = run_cli({"aliveCells": [[0, 0], [0, 1], [0, 2]], "steps": 1})

    assert response == {"aliveCells": [[-1, 1], [0, 1], [1, 1]]}
