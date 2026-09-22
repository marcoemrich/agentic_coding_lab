from game_of_life import Cell, next_generation


def test_single_cell_dies():
    assert next_generation([Cell(0, 0)]) == set()


def test_pair_of_cells_dies_of_underpopulation():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == set()


def test_live_cell_with_two_neighbors_survives():
    alive = [Cell(0, 0), Cell(1, 0), Cell(2, 0)]
    assert Cell(1, 0) in next_generation(alive)


def test_live_cell_with_four_neighbors_dies_of_overpopulation():
    alive = [
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    ]
    assert Cell(1, 1) not in next_generation(alive)


def test_dead_cell_with_three_neighbors_is_born():
    alive = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]
    assert Cell(1, 1) in next_generation(alive)


def test_blinker_oscillates_across_negative_coordinates():
    vertical = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}
    assert next_generation(vertical) == horizontal
    assert next_generation(horizontal) == set(vertical)


def test_block_is_a_still_life():
    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}
    assert next_generation(block) == block


def test_empty_grid_stays_empty():
    assert next_generation([]) == set()
