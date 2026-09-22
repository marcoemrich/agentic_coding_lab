from game_of_life import Cell, next_generation


def test_empty_grid_stays_empty():
    assert next_generation([]) == []


def test_single_cell_dies_of_underpopulation():
    assert next_generation([Cell(0, 0)]) == []


def test_two_adjacent_cells_die_of_underpopulation():
    assert next_generation([Cell(0, 1), Cell(1, 1)]) == []


def test_live_cell_with_two_neighbors_survives():
    blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    assert Cell(0, 1) in next_generation(blinker)


def test_live_cell_with_three_neighbors_survives():
    cells = [Cell(0, 0), Cell(1, 0), Cell(2, 0), Cell(1, 1)]

    assert Cell(1, 1) in next_generation(cells)


def test_live_cell_with_more_than_three_neighbors_dies():
    # Spec rule 3 diagram: ###/.#./### -- the centre (1,1) has more than 3
    # living neighbours and dies.
    ring_with_centre = [
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    ]

    assert Cell(1, 1) not in next_generation(ring_with_centre)


def test_dead_cell_with_exactly_three_neighbors_is_born():
    l_triomino = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]

    assert Cell(1, 1) in next_generation(l_triomino)


def test_dead_cell_with_two_neighbors_stays_dead():
    pair = [Cell(0, 1), Cell(1, 1)]

    assert Cell(0, 0) not in next_generation(pair)


def test_reproduction_example_produces_block():
    l_triomino = [Cell(0, 0), Cell(1, 0), Cell(0, 1)]

    assert sorted(next_generation(l_triomino)) == [
        Cell(0, 0), Cell(0, 1), Cell(1, 0), Cell(1, 1),
    ]


def test_block_is_a_still_life():
    block = [Cell(0, 0), Cell(1, 0), Cell(0, 1), Cell(1, 1)]

    assert sorted(next_generation(block)) == sorted(block)


def test_blinker_oscillates_to_horizontal():
    vertical_blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    assert sorted(next_generation(vertical_blinker)) == [
        Cell(-1, 1), Cell(0, 1), Cell(1, 1),
    ]


def test_blinker_returns_to_start_after_two_generations():
    vertical_blinker = [Cell(0, 0), Cell(0, 1), Cell(0, 2)]

    two_generations_on = next_generation(next_generation(vertical_blinker))

    assert sorted(two_generations_on) == sorted(vertical_blinker)


def test_grid_is_infinite_in_negative_directions():
    far_blinker = [Cell(-1000, -1000), Cell(-1000, -999), Cell(-1000, -998)]

    assert sorted(next_generation(far_blinker)) == [
        Cell(-1001, -999), Cell(-1000, -999), Cell(-999, -999),
    ]


def test_overpopulation_example_produces_two_columns():
    ring_with_centre = [
        Cell(0, 0), Cell(1, 0), Cell(2, 0),
        Cell(1, 1),
        Cell(0, 2), Cell(1, 2), Cell(2, 2),
    ]

    # The spec's rule 3 illustration is internally inconsistent: it states the
    # centre has 4 living neighbours (the diagram gives 6) and shows a Gen 1
    # that the spec's own four rules do not produce. The rule it illustrates --
    # a live cell with more than 3 living neighbours dies -- is authoritative
    # and is pinned by test_live_cell_with_more_than_three_neighbors_dies.
    # This assertion records the result the four rules actually produce.
    assert sorted(next_generation(ring_with_centre)) == [
        Cell(0, 0), Cell(0, 2),
        Cell(1, -1), Cell(1, 0), Cell(1, 2), Cell(1, 3),
        Cell(2, 0), Cell(2, 2),
    ]


def test_survival_example_produces_vertical_pair():
    row_with_offset_cell = [Cell(0, 0), Cell(1, 0), Cell(2, 0), Cell(1, 2)]

    # The spec's rule 2 illustration is internally inconsistent: its prose calls
    # (1,1) a live cell with 3 living neighbours, but in its own Gen 0 diagram
    # (1,1) is dead and has 4 living neighbours, and its printed Gen 1 is not
    # what the spec's four rules produce. The rule it illustrates -- a live cell
    # with 2 or 3 living neighbours lives on -- is authoritative and is pinned by
    # test_live_cell_with_three_neighbors_survives. This assertion records the
    # result the four rules actually produce.
    assert sorted(next_generation(row_with_offset_cell)) == [
        Cell(0, 1), Cell(1, -1), Cell(1, 0), Cell(2, 1),
    ]
