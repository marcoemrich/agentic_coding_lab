from game_of_life import Cell, next_generation


def test_empty_generation_stays_empty() -> None:
    assert next_generation(set()) == set()


def test_single_cell_dies_from_underpopulation() -> None:
    assert next_generation({Cell(0, 0)}) == set()


def test_cells_with_one_neighbor_die_from_underpopulation() -> None:
    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_live_cell_with_two_neighbors_survives() -> None:
    cells = {Cell(-1, 0), Cell(0, 0), Cell(1, 0)}

    assert Cell(0, 0) in next_generation(cells)


def test_live_cell_with_three_neighbors_survives() -> None:
    cells = {Cell(0, 0), Cell(-1, 0), Cell(1, 0), Cell(0, 1)}

    assert Cell(0, 0) in next_generation(cells)


def test_live_cell_with_four_neighbors_dies_from_overpopulation() -> None:
    cells = {
        Cell(0, 0),
        Cell(-1, 0),
        Cell(1, 0),
        Cell(0, -1),
        Cell(0, 1),
    }

    assert Cell(0, 0) not in next_generation(cells)


def test_dead_cell_with_three_neighbors_becomes_alive() -> None:
    cells = {Cell(-1, 0), Cell(1, 0), Cell(0, 1)}

    assert Cell(0, 0) in next_generation(cells)


def test_blinker_rotates() -> None:
    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(vertical) == {
        Cell(-1, 1),
        Cell(0, 1),
        Cell(1, 1),
    }


def test_blinker_returns_after_two_generations() -> None:
    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}

    assert next_generation(next_generation(vertical)) == vertical


def test_block_is_still_life() -> None:
    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block
