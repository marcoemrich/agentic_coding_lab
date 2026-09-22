from game_of_life import Cell, next_generation

VERTICAL_BLINKER = [(0, 0), (0, 1), (0, 2)]

# Spec "Rule 3 - Overpopulation", Gen 0: a ring of six cells around a live center (1,1),
# which therefore has four live neighbors.
OVERPOPULATION_EXAMPLE = [(0, 0), (1, 0), (2, 0), (1, 1), (0, 2), (1, 2), (2, 2)]

# Spec "Rule 4 - Reproduction", Gen 0: three cells around the dead center (1,1),
# which therefore has exactly three live neighbors.
REPRODUCTION_EXAMPLE = [(0, 0), (1, 0), (0, 1)]


def test_empty_grid_stays_empty():
    assert next_generation([]) == set()


def test_single_cell_dies_of_underpopulation():
    assert next_generation([(0, 0)]) == set()


def test_two_neighboring_cells_both_die_of_underpopulation():
    assert next_generation([(0, 1), (1, 1)]) == set()


def test_live_cell_with_two_neighbors_survives():
    assert (1, 0) in next_generation([(0, 0), (1, 0), (2, 0)])


def test_live_cell_with_three_neighbors_survives():
    assert (1, 0) in next_generation([(0, 0), (1, 0), (2, 0), (1, 1)])


def test_live_cell_with_four_neighbors_dies_of_overpopulation():
    assert (1, 1) not in next_generation(OVERPOPULATION_EXAMPLE)


def test_dead_cell_with_three_neighbors_is_born():
    assert (1, 1) in next_generation(REPRODUCTION_EXAMPLE)


def test_dead_cell_with_two_neighbors_stays_dead():
    assert (1, 1) not in next_generation([(0, 0), (1, 0)])


def test_dead_cell_with_four_neighbors_stays_dead():
    assert (1, 1) not in next_generation([(0, 0), (1, 0), (2, 0), (0, 1)])


def test_rule_three_full_grid_example():
    """The spec diagram crops to 3x3; on the infinite grid (1,-1) and (1,3) are also born."""
    assert next_generation(OVERPOPULATION_EXAMPLE) == {
        (0, 0),
        (1, 0),
        (2, 0),
        (1, -1),
        (0, 2),
        (1, 2),
        (2, 2),
        (1, 3),
    }


def test_rule_four_full_grid_example():
    assert next_generation(REPRODUCTION_EXAMPLE) == {(0, 0), (1, 0), (0, 1), (1, 1)}


def test_rule_two_full_grid_example():
    """Rule 2 example coordinates from the spec.

    The spec's prose for this example says the center (1,1) has 3 live neighbors and
    survives, but the coordinates it draws make (1,1) a DEAD cell with 4 live
    neighbors, so no rule can revive it. The four normative rules govern: (1,0)
    survives with 2 neighbors, and (1,-1), (0,1), (2,1) are dead cells born with
    exactly 3. Rule 2's actual claim -- a live cell with 3 neighbors survives -- is
    asserted normatively in test_live_cell_with_three_neighbors_survives.
    """
    assert next_generation([(0, 0), (1, 0), (2, 0), (1, 2)]) == {
        (1, -1),
        (1, 0),
        (0, 1),
        (2, 1),
    }


def test_block_is_a_still_life():
    block = [(0, 0), (1, 0), (0, 1), (1, 1)]
    assert next_generation(block) == set(block)


def test_blinker_oscillates_to_horizontal():
    assert next_generation(VERTICAL_BLINKER) == {(-1, 1), (0, 1), (1, 1)}


def test_blinker_oscillates_back_to_vertical():
    generation_one = next_generation(VERTICAL_BLINKER)
    assert next_generation(generation_one) == set(VERTICAL_BLINKER)


def test_grid_is_infinite_in_negative_and_large_coordinates():
    far_away = [(x + 1000, y - 1000) for x, y in VERTICAL_BLINKER]
    assert next_generation(far_away) == {(999, -999), (1000, -999), (1001, -999)}


def test_next_generation_leaves_the_input_unchanged():
    original = [(0, 0), (1, 0), (0, 1)]
    next_generation(original)
    assert original == [(0, 0), (1, 0), (0, 1)]


def test_cell_exposes_x_and_y_coordinates():
    cell = Cell(2, -3)
    assert (cell.x, cell.y) == (2, -3)
    assert next_generation([Cell(0, 0), Cell(1, 0), Cell(0, 1)]) == {
        Cell(0, 0),
        Cell(1, 0),
        Cell(0, 1),
        Cell(1, 1),
    }


def test_next_generation_returns_cells_including_newly_born_ones():
    """Set equality alone cannot see this: tuple literals compare equal to Cell."""
    generation = next_generation(REPRODUCTION_EXAMPLE)
    assert {(c.x, c.y) for c in generation} == {(0, 0), (1, 0), (0, 1), (1, 1)}
