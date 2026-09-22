from game_of_life import Cell, next_generation


def test_empty_generation_stays_empty():
    assert next_generation([]) == []


def test_single_cell_dies_of_underpopulation():
    assert next_generation([Cell(0, 0)]) == []


def test_rule_1_live_cells_with_one_neighbor_die_of_underpopulation():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == []


def test_rule_2_live_cell_with_two_neighbors_survives():
    row = [Cell(0, 0), Cell(1, 0), Cell(2, 0)]

    assert sorted(next_generation(row)) == [Cell(1, -1), Cell(1, 0), Cell(1, 1)]


def test_rule_2_live_cell_with_three_neighbors_survives():
    """Spec survival example: ### over .#. -- (1,0) has 3 live neighbours.

    The spec's sketch highlights the fate of that one cell rather than drawing
    the complete next generation, so the assertion is on that cell.
    """
    row_over_single_cell = [Cell(0, 0), Cell(1, 0), Cell(2, 0), Cell(1, 1)]

    assert Cell(1, 0) in next_generation(row_over_single_cell)


def test_rule_3_live_cell_with_more_than_three_neighbors_dies():
    """Spec overpopulation example: ### / .#. / ### -- (1,1) has 4 live neighbours."""
    two_rows_around_a_centre = [
        Cell(0, 0),
        Cell(1, 0),
        Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2),
        Cell(1, 2),
        Cell(2, 2),
    ]

    assert Cell(1, 1) not in next_generation(two_rows_around_a_centre)


def test_rule_4_dead_cell_with_exactly_three_neighbors_becomes_alive():
    """Spec reproduction example: ##. / #.. -> ##. / ##. (a block)."""
    corner = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]

    assert sorted(next_generation(corner)) == [
        Cell(0, 0),
        Cell(0, 1),
        Cell(1, 0),
        Cell(1, 1),
    ]


def test_dead_cell_with_two_neighbors_stays_dead():
    """Rule 4 boundary: reproduction needs exactly 3 neighbours, not 2 or more."""
    pair = [Cell(0, 0), Cell(1, 0)]

    assert next_generation(pair) == []


def test_blinker_oscillates_to_horizontal():
    vertical_blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    assert sorted(next_generation(vertical_blinker)) == [
        Cell(-1, 1),
        Cell(0, 1),
        Cell(1, 1),
    ]


def test_blinker_oscillates_back_to_vertical():
    horizontal_blinker = [Cell(-1, 1), Cell(0, 1), Cell(1, 1)]

    assert sorted(next_generation(horizontal_blinker)) == [
        Cell(0, 0),
        Cell(0, 1),
        Cell(0, 2),
    ]


def test_block_is_a_still_life():
    block = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]

    assert sorted(next_generation(block)) == sorted(block)


def test_grid_is_infinite_in_negative_directions():
    """A pattern far into the negative quadrant behaves exactly as at the origin."""
    far_x, far_y = -1000, -1000
    vertical_blinker = [
        Cell(far_x, far_y),
        Cell(far_x, far_y + 1),
        Cell(far_x, far_y + 2),
    ]

    assert sorted(next_generation(vertical_blinker)) == [
        Cell(far_x - 1, far_y + 1),
        Cell(far_x, far_y + 1),
        Cell(far_x + 1, far_y + 1),
    ]
