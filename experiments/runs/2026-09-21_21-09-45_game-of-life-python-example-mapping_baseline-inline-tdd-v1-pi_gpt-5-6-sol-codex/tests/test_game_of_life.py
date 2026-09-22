from game_of_life import Cell, next_generation


def test_underpopulation_kills_cells_with_only_one_neighbor() -> None:
    alive = {Cell(0, 1), Cell(1, 1)}

    assert next_generation(alive) == set()


def test_survival_keeps_live_cells_with_two_neighbors() -> None:
    alive = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}

    assert next_generation(alive) == {
        Cell(0, 0),
        Cell(1, 0),
        Cell(0, 1),
        Cell(1, 1),
    }


def test_overpopulation_kills_a_live_cell_with_four_neighbors() -> None:
    alive = {
        Cell(0, 0),
        Cell(-1, 0),
        Cell(1, 0),
        Cell(0, -1),
        Cell(0, 1),
    }

    assert next_generation(alive) == {
        Cell(-1, -1),
        Cell(0, -1),
        Cell(1, -1),
        Cell(-1, 0),
        Cell(1, 0),
        Cell(-1, 1),
        Cell(0, 1),
        Cell(1, 1),
    }


def test_reproduction_creates_a_dead_cell_with_three_neighbors() -> None:
    alive = {Cell(0, 0), Cell(1, 0), Cell(0, 1)}

    assert Cell(1, 1) in next_generation(alive)


def test_single_cell_dies() -> None:
    assert next_generation({Cell(0, 0)}) == set()


def test_block_is_a_still_life() -> None:
    block = {Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)}

    assert next_generation(block) == block


def test_blinker_oscillates() -> None:
    vertical = {Cell(0, 0), Cell(0, 1), Cell(0, 2)}
    horizontal = {Cell(-1, 1), Cell(0, 1), Cell(1, 1)}

    assert next_generation(vertical) == horizontal
    assert next_generation(horizontal) == vertical


def test_patterns_can_cross_negative_coordinates() -> None:
    vertical = {Cell(-5, -6), Cell(-5, -5), Cell(-5, -4)}

    assert next_generation(vertical) == {
        Cell(-6, -5),
        Cell(-5, -5),
        Cell(-4, -5),
    }


def test_accepts_any_iterable_of_cells() -> None:
    cells = (Cell(x, 0) for x in range(3))

    assert next_generation(cells) == {
        Cell(1, -1),
        Cell(1, 0),
        Cell(1, 1),
    }
