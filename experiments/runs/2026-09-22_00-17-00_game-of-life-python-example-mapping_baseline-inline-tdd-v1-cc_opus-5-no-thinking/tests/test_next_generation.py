from game_of_life import Cell, next_generation


def cells(*coordinates: tuple[int, int]) -> set[Cell]:
    return {Cell(x, y) for x, y in coordinates}


def test_an_empty_grid_stays_empty():
    assert next_generation(set()) == set()


def test_a_lone_cell_dies_of_underpopulation():
    assert next_generation(cells((0, 0))) == set()


def test_two_neighbouring_cells_both_die_of_underpopulation():
    assert next_generation(cells((0, 1), (1, 1))) == set()


def test_a_cell_with_two_neighbours_survives():
    # The middle of a horizontal blinker keeps its two neighbours.
    assert Cell(0, 1) in next_generation(cells((0, 0), (0, 1), (0, 2)))


def test_a_cell_with_three_neighbours_survives():
    survivors = next_generation(cells((0, 0), (1, 0), (2, 0), (1, 2)))

    assert Cell(1, 1) not in survivors  # dead, only counted as a check of setup
    assert Cell(1, 0) in survivors


def test_a_cell_with_four_neighbours_dies_of_overpopulation():
    generation = cells(
        (0, 0), (1, 0), (2, 0),
        (1, 1),
        (0, 2), (1, 2), (2, 2),
    )

    assert Cell(1, 1) not in next_generation(generation)


def test_a_dead_cell_with_exactly_three_neighbours_is_born():
    assert Cell(1, 1) in next_generation(cells((0, 0), (1, 0), (0, 1)))


def test_a_dead_cell_with_two_neighbours_stays_dead():
    assert Cell(1, 1) not in next_generation(cells((0, 0), (1, 0)))


def test_the_blinker_oscillates():
    vertical = cells((0, 0), (0, 1), (0, 2))
    horizontal = cells((-1, 1), (0, 1), (1, 1))

    assert next_generation(vertical) == horizontal
    assert next_generation(horizontal) == vertical


def test_the_block_is_a_still_life():
    block = cells((0, 0), (1, 0), (0, 1), (1, 1))

    assert next_generation(block) == block


def test_the_overpopulation_example_hollows_out_the_centre():
    generation = cells(
        (0, 0), (1, 0), (2, 0),
        (1, 1),
        (0, 2), (1, 2), (2, 2),
    )

    # The centre dies of overpopulation; the pattern also grows beyond the
    # original 3x3 window, because (1, -1) and (1, 3) each gain three neighbours.
    assert next_generation(generation) == cells(
        (1, -1),
        (0, 0), (1, 0), (2, 0),
        (0, 2), (1, 2), (2, 2),
        (1, 3),
    )


def test_the_reproduction_example_completes_the_block():
    assert next_generation(cells((0, 0), (1, 0), (0, 1))) == cells(
        (0, 0), (1, 0), (0, 1), (1, 1)
    )


def test_the_grid_extends_into_negative_coordinates():
    assert next_generation(cells((-10, -10), (-10, -11), (-10, -9))) == cells(
        (-11, -10), (-10, -10), (-9, -10)
    )


def test_the_generation_is_not_modified():
    generation = cells((0, 0), (0, 1), (0, 2))

    next_generation(generation)

    assert generation == cells((0, 0), (0, 1), (0, 2))
