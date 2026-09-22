from game_of_life import generation_after, next_generation


def test_empty_grid_stays_empty():
    assert next_generation([]) == []


def test_single_cell_dies_of_underpopulation():
    assert next_generation([(0, 0)]) == []


def test_two_neighboring_cells_die_of_underpopulation():
    assert next_generation([(0, 1), (1, 1)]) == []


def test_live_cell_with_three_neighbors_survives():
    three_neighbors_of_the_live_centre = [(0, 0), (1, 0), (2, 0), (1, 1)]

    assert (1, 1) in next_generation(three_neighbors_of_the_live_centre)


def test_live_cell_with_two_neighbors_survives():
    two_neighbors_of_the_live_centre = [(0, 0), (0, 1), (0, 2)]

    assert (0, 1) in next_generation(two_neighbors_of_the_live_centre)


def test_live_cell_with_more_than_three_neighbors_dies_of_overpopulation():
    centre_with_four_neighbors = [
        (0, 0), (1, 0), (2, 0),
        (1, 1),
        (0, 2), (1, 2), (2, 2),
    ]

    assert (1, 1) not in next_generation(centre_with_four_neighbors)


def test_dead_cell_with_exactly_three_neighbors_is_born():
    three_neighbors_of_the_dead_centre = [(0, 0), (1, 0), (0, 1)]

    assert (1, 1) in next_generation(three_neighbors_of_the_dead_centre)


def test_dead_cell_with_two_neighbors_stays_dead():
    two_neighbors_of_the_dead_cell = [(0, 1), (1, 1)]

    assert (1, 0) not in next_generation(two_neighbors_of_the_dead_cell)


def test_blinker_rotates_into_negative_coordinates():
    vertical_blinker = [(0, 0), (0, 1), (0, 2)]

    assert sorted(next_generation(vertical_blinker)) == [(-1, 1), (0, 1), (1, 1)]


def test_blinker_returns_to_its_start_after_two_generations():
    blinker = [(0, 0), (0, 1), (0, 2)]

    assert sorted(generation_after(blinker, 2)) == blinker


def test_block_is_a_still_life():
    block = sorted([(0, 0), (1, 0), (0, 1), (1, 1)])

    assert sorted(next_generation(block)) == block
    assert sorted(generation_after(block, 2)) == block


def test_rules_apply_far_into_negative_coordinates():
    blinker_far_from_the_origin = [(-100, -50), (-100, -49), (-100, -48)]

    assert sorted(next_generation(blinker_far_from_the_origin)) == [
        (-101, -49),
        (-100, -49),
        (-99, -49),
    ]
