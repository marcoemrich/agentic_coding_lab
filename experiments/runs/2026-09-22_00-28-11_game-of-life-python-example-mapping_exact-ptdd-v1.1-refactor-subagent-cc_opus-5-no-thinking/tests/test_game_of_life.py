from game_of_life import Cell, next_generation

# Several of the specification's per-rule illustrations contradict themselves:
# the prose neighbour count disagrees with the diagram drawn beside it. The
# "Rules" section is taken as authoritative throughout, so the expectations in
# the example tests below are what the four rules yield. Each test records only
# the discrepancy specific to its own diagram.


def block_at(x, y):
    return [Cell(x, y), Cell(x + 1, y), Cell(x, y + 1), Cell(x + 1, y + 1)]


def vertical_blinker_at(x, y):
    return [Cell(x, y), Cell(x, y + 1), Cell(x, y + 2)]


def test_empty_grid_stays_empty():
    assert next_generation([]) == []


def test_single_cell_dies_of_underpopulation():
    assert next_generation([Cell(0, 0)]) == []


def test_two_neighboring_cells_both_die_of_underpopulation():
    horizontal_pair = [Cell(0, 1), Cell(1, 1)]

    assert next_generation(horizontal_pair) == []


def test_live_cell_with_two_neighbors_survives():
    vertical_blinker = vertical_blinker_at(0, 0)

    assert Cell(0, 1) in next_generation(vertical_blinker)


def test_live_cell_with_three_neighbors_survives():
    block = block_at(0, 0)

    assert Cell(0, 0) in next_generation(block)


def test_live_cell_with_four_neighbors_dies_of_overpopulation():
    crowded_centre = [Cell(0, 0), Cell(1, 0), Cell(2, 0), Cell(1, 1), Cell(1, 2)]

    assert Cell(1, 1) not in next_generation(crowded_centre)


def test_live_cell_with_eight_neighbors_dies_of_overpopulation():
    full_block_of_nine = [Cell(x, y) for x in range(3) for y in range(3)]

    assert Cell(1, 1) not in next_generation(full_block_of_nine)


def test_dead_cell_with_three_neighbors_becomes_alive():
    corner_triomino = [Cell(0, 2), Cell(1, 2), Cell(0, 1)]

    assert Cell(1, 1) in next_generation(corner_triomino)


def test_dead_cell_with_two_neighbors_stays_dead():
    separated_pair = [Cell(0, 0), Cell(2, 0)]

    assert Cell(1, 0) not in next_generation(separated_pair)


def test_dead_cell_with_four_neighbors_stays_dead():
    four_corners = [Cell(0, 0), Cell(2, 0), Cell(0, 2), Cell(2, 2)]

    assert Cell(1, 1) not in next_generation(four_corners)


def test_grid_extends_into_negative_coordinates():
    blinker_in_the_negative_quadrant = vertical_blinker_at(-5, -5)

    assert set(next_generation(blinker_in_the_negative_quadrant)) == {
        Cell(-6, -4),
        Cell(-5, -4),
        Cell(-4, -4),
    }


def test_block_is_a_still_life():
    block = block_at(0, 0)

    assert set(next_generation(block)) == set(block)


def test_blinker_rotates_from_vertical_to_horizontal():
    vertical_blinker = vertical_blinker_at(0, 0)

    assert set(next_generation(vertical_blinker)) == {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}


def test_blinker_returns_to_start_after_two_generations():
    vertical_blinker = vertical_blinker_at(0, 0)

    horizontal_blinker = next_generation(vertical_blinker)

    assert set(next_generation(horizontal_blinker)) == set(vertical_blinker)


def test_overpopulation_example_from_specification():
    # Rule 3 states the centre has 4 live neighbours where its own diagram
    # gives 6, and draws a Gen 1 the four rules do not produce.
    top_row = [Cell(0, 2), Cell(1, 2), Cell(2, 2)]
    centre = [Cell(1, 1)]
    bottom_row = [Cell(0, 0), Cell(1, 0), Cell(2, 0)]
    crowded_grid = top_row + centre + bottom_row

    assert set(next_generation(crowded_grid)) == set(
        top_row + bottom_row + [Cell(1, 3), Cell(1, -1)]
    )


def test_survival_example_from_specification():
    # Rule 2 says (1,1) has 3 live neighbours, but its own diagram places a
    # live cell at (1,0) as well, giving 4. So (1,2) survives on 2 neighbours
    # while (1,1) stays dead.
    top_row = [Cell(0, 2), Cell(1, 2), Cell(2, 2)]
    lone_cell_below = [Cell(1, 0)]

    assert set(next_generation(top_row + lone_cell_below)) == {
        Cell(1, 2),
        Cell(0, 1),
        Cell(2, 1),
        Cell(1, 3),
    }


def test_reproduction_example_from_specification():
    corner_triomino = [Cell(0, 2), Cell(1, 2), Cell(0, 1)]

    assert set(next_generation(corner_triomino)) == {
        Cell(0, 2),
        Cell(1, 2),
        Cell(0, 1),
        Cell(1, 1),
    }


def test_cell_carries_integer_x_and_y_coordinates():
    cell = Cell(3, -7)

    assert (cell.x, cell.y) == (3, -7)
    assert cell == Cell(3, -7)


def test_next_generation_leaves_the_input_unchanged():
    vertical_blinker = vertical_blinker_at(0, 0)

    next_generation(vertical_blinker)

    assert vertical_blinker == vertical_blinker_at(0, 0)
