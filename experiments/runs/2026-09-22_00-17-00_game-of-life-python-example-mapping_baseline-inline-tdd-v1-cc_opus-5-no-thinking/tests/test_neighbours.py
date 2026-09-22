from game_of_life import Cell, neighbours


NEIGHBOURS_PER_CELL = 8


def test_a_cell_has_eight_neighbours():
    assert len(neighbours(Cell(0, 0))) == NEIGHBOURS_PER_CELL


def test_neighbours_surround_the_cell_without_including_it():
    assert set(neighbours(Cell(0, 0))) == {
        Cell(-1, -1), Cell(0, -1), Cell(1, -1),
        Cell(-1, 0), Cell(1, 0),
        Cell(-1, 1), Cell(0, 1), Cell(1, 1),
    }


def test_neighbours_are_relative_to_the_cell_position():
    assert set(neighbours(Cell(5, -4))) == {
        Cell(4, -5), Cell(5, -5), Cell(6, -5),
        Cell(4, -4), Cell(6, -4),
        Cell(4, -3), Cell(5, -3), Cell(6, -3),
    }
