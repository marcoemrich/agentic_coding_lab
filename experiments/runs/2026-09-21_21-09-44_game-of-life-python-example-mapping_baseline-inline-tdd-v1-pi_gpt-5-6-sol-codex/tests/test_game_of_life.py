from game_of_life import Cell, next_generation


def test_single_cell_dies_from_underpopulation() -> None:
    assert next_generation({Cell(0, 0)}) == set()


def test_two_cells_die_from_underpopulation() -> None:
    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_live_cell_with_two_neighbors_survives() -> None:
    living = {Cell(-1, 0), Cell(0, 0), Cell(1, 0)}

    assert Cell(0, 0) in next_generation(living)


def test_live_cell_with_three_neighbors_survives() -> None:
    living = {Cell(0, 0), Cell(-1, 0), Cell(1, 0), Cell(0, 1)}

    assert Cell(0, 0) in next_generation(living)
