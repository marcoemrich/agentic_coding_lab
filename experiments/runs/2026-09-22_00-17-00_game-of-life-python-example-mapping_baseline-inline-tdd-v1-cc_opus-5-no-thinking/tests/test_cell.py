from game_of_life import Cell


def test_cell_carries_x_and_y_coordinates():
    x, y = 2, -3

    cell = Cell(x, y)

    assert cell.x == x
    assert cell.y == y


def test_cells_with_same_coordinates_are_equal():
    assert Cell(1, 1) == Cell(1, 1)
    assert Cell(1, 1) != Cell(1, 2)


def test_cells_are_usable_in_sets():
    assert {Cell(0, 0), Cell(0, 0)} == {Cell(0, 0)}
