from game_of_life import Cell, next_generation


def test_single_cell_dies():
    assert next_generation([Cell(0, 0)]) == set()


def test_block_survives_unchanged():
    block = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]
    assert next_generation(block) == set(block)


def test_underpopulated_pair_dies():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == set()


def test_overpopulated_cell_dies():
    neighbours = [Cell(0, 0), Cell(1, 0), Cell(2, 0), Cell(1, 2)]
    assert Cell(1, 1) not in next_generation([Cell(1, 1), *neighbours])


def test_dead_cell_with_three_neighbours_is_born():
    assert next_generation([Cell(0, 0), Cell(1, 0), Cell(0, 1)]) == {
        Cell(0, 0),
        Cell(1, 0),
        Cell(0, 1),
        Cell(1, 1),
    }


def test_blinker_oscillates_into_negative_coordinates():
    vertical = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}
    assert next_generation(vertical) == horizontal
    assert next_generation(horizontal) == set(vertical)


def test_empty_grid_stays_empty():
    assert next_generation([]) == set()
