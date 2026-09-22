from game_of_life import Cell, next_generation


def test_empty_grid_stays_empty():
    assert next_generation([]) == set()


def test_single_cell_dies_of_underpopulation():
    assert next_generation([Cell(0, 0)]) == set()


def test_block_is_a_still_life():
    block = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]
    assert next_generation(block) == set(block)


def test_cell_with_more_than_three_neighbours_dies_of_overpopulation():
    # ###
    # .#.   centre (1,1) has 4 living neighbours
    # ###
    grid = [
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    ]
    assert Cell(1, 1) not in next_generation(grid)


def test_dead_cell_with_exactly_three_neighbours_is_born():
    # ##.
    # #..   dead centre (1,1) has 3 living neighbours
    # ...
    grid = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]
    assert next_generation(grid) == {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}


def test_pair_of_cells_dies_of_underpopulation():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == set()


def test_cell_with_two_neighbours_survives():
    # ###   the middle cell (1,0) has 2 living neighbours
    grid = [Cell(0, 0), Cell(1, 0), Cell(2, 0)]
    assert Cell(1, 0) in next_generation(grid)


def test_cell_with_three_neighbours_survives():
    # ##
    # ##.#  the cell (1,1) has 3 living neighbours
    grid = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1), Cell(3, 1)]
    assert Cell(1, 1) in next_generation(grid)


def test_blinker_oscillates_between_two_phases():
    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}
    assert next_generation(vertical) == horizontal
    assert next_generation(horizontal) == vertical


def test_grid_is_infinite_in_negative_directions():
    block = [Cell(-101, -101), Cell(-100, -101), Cell(-101, -100), Cell(-100, -100)]
    assert next_generation(block) == set(block)
