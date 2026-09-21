from game_of_life import Cell, next_generation


def test_empty_grid_stays_empty():
    assert next_generation([]) == []


def test_cell_exposes_its_x_and_y_coordinates():
    cell = Cell(3, -7)

    assert cell.x == 3
    assert cell.y == -7


def test_rule1_lone_cell_with_no_neighbors_dies():
    assert next_generation([Cell(0, 0)]) == []


def test_rule1_cells_with_one_neighbor_die():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == []


def test_rule2_live_cell_with_two_neighbors_survives():
    vertical_blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    assert Cell(0, 1) in next_generation(vertical_blinker)


def test_rule2_live_cell_with_three_neighbors_survives():
    top_row_and_center = [Cell(0, 2), Cell(1, 2), Cell(2, 2), Cell(1, 1)]

    assert Cell(1, 1) in next_generation(top_row_and_center)


def test_rule3_live_cell_with_four_neighbors_dies():
    center_with_four_corners = [
        Cell(1, 1),
        Cell(0, 0),
        Cell(2, 0),
        Cell(0, 2),
        Cell(2, 2),
    ]

    assert Cell(1, 1) not in next_generation(center_with_four_corners)


def test_rule3_live_cell_with_eight_neighbors_dies():
    full_three_by_three = [Cell(x, y) for x in (0, 1, 2) for y in (0, 1, 2)]

    assert Cell(1, 1) not in next_generation(full_three_by_three)


def test_rule4_dead_cell_with_three_neighbors_becomes_alive():
    three_neighbours_of_the_dead_center = [Cell(0, 2), Cell(1, 2), Cell(0, 1)]

    assert Cell(1, 1) in next_generation(three_neighbours_of_the_dead_center)


def test_rule4_dead_cell_with_two_neighbors_stays_dead():
    two_neighbours_of_the_dead_center = [Cell(0, 2), Cell(1, 2)]

    assert Cell(1, 1) not in next_generation(two_neighbours_of_the_dead_center)


def test_rule4_dead_cell_with_four_neighbors_stays_dead():
    four_neighbours_of_the_dead_center = [Cell(0, 0), Cell(2, 0), Cell(0, 2), Cell(2, 2)]

    assert Cell(1, 1) not in next_generation(four_neighbours_of_the_dead_center)


def test_blinker_oscillates_to_horizontal():
    vertical_blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    assert sorted(next_generation(vertical_blinker)) == [Cell(-1, 1), Cell(0, 1), Cell(1, 1)]


def test_blinker_oscillates_back_to_vertical():
    horizontal_blinker = [Cell(-1, 1), Cell(0, 1), Cell(1, 1)]

    assert sorted(next_generation(horizontal_blinker)) == [Cell(0, 0), Cell(0, 1), Cell(0, 2)]


def test_block_is_a_still_life():
    block = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]

    assert sorted(next_generation(block)) == sorted(block)


def test_grid_is_infinite_towards_negative_coordinates():
    far_negative_blinker = [Cell(-5, -5), Cell(-5, -4), Cell(-5, -3)]

    assert sorted(next_generation(far_negative_blinker)) == [
        Cell(-6, -4),
        Cell(-5, -4),
        Cell(-4, -4),
    ]


def test_result_is_independent_of_input_order():
    blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]
    reversed_blinker = [Cell(0, 2), Cell(0, 1), Cell(0, 0)]

    assert sorted(next_generation(reversed_blinker)) == sorted(next_generation(blinker))


def test_duplicate_input_cells_count_once():
    blinker_with_a_repeated_cell = [Cell(0, 0), Cell(0, 1), Cell(0, 1), Cell(0, 2)]

    assert sorted(next_generation(blinker_with_a_repeated_cell)) == [
        Cell(-1, 1),
        Cell(0, 1),
        Cell(1, 1),
    ]
