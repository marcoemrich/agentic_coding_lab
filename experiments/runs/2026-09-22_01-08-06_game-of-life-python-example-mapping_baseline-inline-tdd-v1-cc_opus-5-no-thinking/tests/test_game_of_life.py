from game_of_life import Cell, next_generation


def test_single_cell_dies():
    assert next_generation([Cell(0, 0)]) == []


def test_pair_of_cells_dies_of_underpopulation():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == []


def test_cell_with_two_neighbors_survives():
    # vertical triple: the middle cell has exactly 2 neighbors
    result = next_generation([Cell(0, 0), Cell(0, 1), Cell(0, 2)])
    assert Cell(0, 1) in result


def test_cell_with_four_neighbors_dies_of_overpopulation():
    cells = [
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    ]
    assert Cell(1, 1) not in next_generation(cells)


def test_dead_cell_with_three_neighbors_becomes_alive():
    cells = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]
    assert Cell(1, 1) in next_generation(cells)


def test_blinker_oscillates():
    vertical = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]
    horizontal = [Cell(-1, 1), Cell(0, 1), Cell(1, 1)]
    assert sorted(next_generation(vertical)) == sorted(horizontal)
    assert sorted(next_generation(horizontal)) == sorted(vertical)


def test_block_is_a_still_life():
    block = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]
    assert sorted(next_generation(block)) == sorted(block)


def test_empty_grid_stays_empty():
    assert next_generation([]) == []


def test_works_far_from_the_origin_with_negative_coordinates():
    block = [
        Cell(-1000, -1000), Cell(-999, -1000),
        Cell(-1000, -999), Cell(-999, -999),
    ]
    assert sorted(next_generation(block)) == sorted(block)


def test_accepts_plain_coordinate_pairs():
    assert sorted(next_generation([(0, 0), (1, 0), (0, 1)])) == sorted(
        [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]
    )
