from game_of_life import Cell, next_generation


def test_single_cell_dies_from_underpopulation() -> None:
    assert next_generation({Cell(0, 0)}) == set()


def test_live_cell_survives_with_two_neighbors() -> None:
    cells = {Cell(-1, 0), Cell(0, 0), Cell(1, 0)}

    assert Cell(0, 0) in next_generation(cells)


def test_dead_cell_is_born_with_three_neighbors() -> None:
    cells = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}

    assert next_generation(cells) == {
        Cell(0, 0),
        Cell(1, 0),
        Cell(0, 1),
        Cell(1, 1),
    }


def test_two_adjacent_cells_die_from_underpopulation() -> None:
    assert next_generation({Cell(0, 1), Cell(1, 1)}) == set()


def test_live_cell_survives_with_three_neighbors() -> None:
    cells = {Cell(0, 0), Cell(-1, -1), Cell(0, -1), Cell(1, -1)}

    assert Cell(0, 0) in next_generation(cells)


def test_live_cell_dies_from_overpopulation() -> None:
    cells = {
        Cell(0, 0),
        Cell(-1, 0),
        Cell(1, 0),
        Cell(0, -1),
        Cell(0, 1),
    }

    assert Cell(0, 0) not in next_generation(cells)


def test_blinker_oscillates() -> None:
    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal
    assert next_generation(horizontal) == vertical


def test_block_is_still_life() -> None:
    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_negative_coordinates_have_no_boundary() -> None:
    blinker = {Cell(-100, -101), Cell(-100, -100), Cell(-100, -99)}

    assert next_generation(blinker) == {
        Cell(-101, -100),
        Cell(-100, -100),
        Cell(-99, -100),
    }


def test_empty_generation_stays_empty() -> None:
    assert next_generation(set()) == set()
