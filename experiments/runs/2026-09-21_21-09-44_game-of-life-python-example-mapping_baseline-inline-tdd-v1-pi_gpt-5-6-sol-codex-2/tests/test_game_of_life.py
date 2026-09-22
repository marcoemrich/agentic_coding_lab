from game_of_life import Cell, next_generation


def test_single_cell_dies_from_underpopulation() -> None:
    assert next_generation({Cell(0, 0)}) == set()


def test_live_cell_with_two_neighbors_survives() -> None:
    horizontal = {Cell(-1, 0), Cell(0, 0), Cell(1, 0)}

    assert Cell(0, 0) in next_generation(horizontal)


def test_live_cell_with_three_neighbors_survives() -> None:
    cells = {Cell(0, 0), Cell(-1, -1), Cell(0, -1), Cell(1, -1)}

    assert Cell(0, 0) in next_generation(cells)


def test_live_cell_with_more_than_three_neighbors_dies() -> None:
    cells = {
        Cell(0, 0),
        Cell(-1, 0),
        Cell(1, 0),
        Cell(0, -1),
        Cell(0, 1),
    }

    assert Cell(0, 0) not in next_generation(cells)


def test_dead_cell_with_exactly_three_neighbors_becomes_alive() -> None:
    cells = {Cell(-1, 0), Cell(0, -1), Cell(1, 0)}

    assert Cell(0, 0) in next_generation(cells)


def test_two_cells_die_from_underpopulation() -> None:
    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_blinker_oscillates() -> None:
    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal
    assert next_generation(horizontal) == vertical


def test_block_is_a_still_life() -> None:
    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_empty_generation_remains_empty() -> None:
    assert next_generation(set()) == set()
