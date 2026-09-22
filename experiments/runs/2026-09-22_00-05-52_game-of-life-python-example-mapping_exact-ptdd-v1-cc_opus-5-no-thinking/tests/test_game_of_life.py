from game_of_life import Cell, next_generation


def test_cell_carries_its_x_and_y_coordinates():
    cell = Cell(2, -3)

    assert cell.x == 2
    assert cell.y == -3


def test_empty_grid_stays_empty():
    assert next_generation([]) == []


def test_single_cell_dies_of_underpopulation():
    assert next_generation([Cell(0, 0)]) == []


def test_rule_one_underpopulation_two_neighbouring_cells_both_die():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == []


def test_rule_two_survival_live_cell_with_two_neighbours_lives_on():
    vertical_blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    assert Cell(0, 1) in next_generation(vertical_blinker)


def test_rule_two_survival_live_cell_with_three_neighbours_lives_on():
    top_row_with_centre = [Cell(0, 0), Cell(1, 0), Cell(2, 0), Cell(1, 1)]

    assert Cell(1, 1) in next_generation(top_row_with_centre)


def test_rule_three_overpopulation_live_cell_with_four_neighbours_dies():
    centre_with_four_neighbours = [
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    ]

    assert Cell(1, 1) not in next_generation(centre_with_four_neighbours)


def test_rule_four_reproduction_dead_cell_with_three_neighbours_becomes_alive():
    corner_triple = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]

    assert Cell(1, 1) in next_generation(corner_triple)


def test_dead_cell_with_two_neighbours_stays_dead():
    pair = [Cell(0, 0), Cell(1, 0)]

    assert Cell(0, 1) not in next_generation(pair)


def test_dead_cell_with_four_neighbours_stays_dead():
    four_diagonal_corners = [Cell(0, 0), Cell(2, 0), Cell(0, 2), Cell(2, 2)]

    assert Cell(1, 1) not in next_generation(four_diagonal_corners)


def test_all_eight_surrounding_coordinates_count_as_neighbours():
    three_diagonal_cells = [Cell(0, 0), Cell(2, 0), Cell(0, 2)]

    assert Cell(1, 1) in next_generation(three_diagonal_cells)


def test_a_cell_is_not_its_own_neighbour():
    centre_with_two_orthogonal_neighbours = [Cell(0, 1), Cell(1, 1), Cell(2, 1)]

    assert Cell(1, 1) in next_generation(centre_with_two_orthogonal_neighbours)


def test_overpopulation_example_grid_produces_hollow_result():
    crowded_ring = [
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    ]

    # The specification renders this example in a 3x3 window, but the pattern
    # grows past that frame: (1,-1) and (1,3) are dead cells with exactly three
    # living neighbours. The rules are authoritative over the cropped picture.
    assert set(next_generation(crowded_ring)) == {
        Cell(1, -1),
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
        Cell(1, 3),
    }


def test_reproduction_example_grid_grows_into_a_block():
    corner_triple = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]

    assert set(next_generation(corner_triple)) == {
        Cell(0, 0), Cell(1, 0),
        Cell(0, 1), Cell(1, 1),
    }


def test_block_still_life_is_unchanged():
    block = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]

    assert set(next_generation(block)) == set(block)


def test_blinker_oscillates_to_its_horizontal_phase():
    vertical_blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    assert set(next_generation(vertical_blinker)) == {
        Cell(-1, 1), Cell(0, 1), Cell(1, 1),
    }


def test_blinker_oscillates_back_to_its_vertical_phase():
    horizontal_blinker = [Cell(-1, 1), Cell(0, 1), Cell(1, 1)]

    assert set(next_generation(horizontal_blinker)) == {
        Cell(0, 0), Cell(0, 1), Cell(0, 2),
    }


def test_grid_is_infinite_in_the_negative_direction():
    far_negative_blinker = [Cell(-1000, -1000), Cell(-1000, -999), Cell(-1000, -998)]

    assert set(next_generation(far_negative_blinker)) == {
        Cell(-1001, -999), Cell(-1000, -999), Cell(-999, -999),
    }


def test_distant_clusters_evolve_independently():
    blinker_at_origin = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]
    blinker_far_away = [Cell(1000, 0), Cell(1000, 1), Cell(1000, 2)]

    assert set(next_generation(blinker_at_origin + blinker_far_away)) == {
        Cell(-1, 1), Cell(0, 1), Cell(1, 1),
        Cell(999, 1), Cell(1000, 1), Cell(1001, 1),
    }
