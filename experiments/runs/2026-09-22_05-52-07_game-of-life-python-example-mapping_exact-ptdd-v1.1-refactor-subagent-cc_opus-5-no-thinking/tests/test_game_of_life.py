from game_of_life import next_generation


def test_empty_grid_stays_empty():
    assert next_generation([]) == set()


def test_single_cell_dies_of_underpopulation():
    assert next_generation([(0, 0)]) == set()


def test_two_neighboring_cells_die_of_underpopulation():
    assert next_generation([(0, 1), (1, 1)]) == set()


def test_dead_cell_with_three_neighbors_is_born():
    assert (1, 1) in next_generation([(0, 0), (1, 0), (0, 1)])


def test_live_cell_with_three_neighbors_survives():
    assert (1, 1) in next_generation([(0, 0), (1, 0), (2, 0), (1, 1)])


def test_block_is_a_still_life():
    block = [(0, 0), (1, 0), (0, 1), (1, 1)]

    assert next_generation(block) == {(0, 0), (1, 0), (0, 1), (1, 1)}


def test_live_cell_with_two_neighbors_survives():
    assert (0, 1) in next_generation([(0, 0), (0, 1), (0, 2)])


def test_live_cell_with_more_than_three_neighbors_dies_of_overpopulation():
    overcrowded = [(0, 0), (1, 0), (2, 0), (1, 1), (0, 2), (1, 2), (2, 2)]

    assert (1, 1) not in next_generation(overcrowded)


def test_dead_cell_with_four_neighbors_stays_dead():
    four_diagonal_neighbors = [(0, 0), (2, 0), (0, 2), (2, 2)]

    assert (1, 1) not in next_generation(four_diagonal_neighbors)


def test_blinker_rotates_from_vertical_to_horizontal():
    vertical_blinker = [(0, 0), (0, 1), (0, 2)]

    assert next_generation(vertical_blinker) == {(-1, 1), (0, 1), (1, 1)}


def test_blinker_returns_to_vertical_after_two_generations():
    horizontal_blinker = [(-1, 1), (0, 1), (1, 1)]

    assert next_generation(horizontal_blinker) == {(0, 0), (0, 1), (0, 2)}


def test_overpopulation_spec_example_evolves_by_the_rule_text():
    """Spec rule 3, Gen 0 ###/.#./###.

    The spec's drawn Gen 1 (#.#/#.#/#.#) contradicts its own rules: the dead
    cells (0,1) and (2,1) have 5 living neighbors, so they cannot be born, and
    the drawing omits the births outside its 3x3 frame. Reading the rule text as
    normative and the drawing as illustrative, this asserts the rule-derived
    result on the infinite grid, in which the overcrowded center (1,1) dies.
    """
    overcrowded = [(0, 0), (1, 0), (2, 0), (1, 1), (0, 2), (1, 2), (2, 2)]

    assert next_generation(overcrowded) == {
        (1, -1),
        (0, 0), (1, 0), (2, 0),
        (0, 2), (1, 2), (2, 2),
        (1, 3),
    }


def test_survival_spec_example_evolves_by_the_rule_text():
    """Spec rule 2, Gen 0 ###/.../.#.

    As in the rule 3 example, the spec's drawn Gen 1 is a bounded sketch that
    contradicts its own rules: the isolated cell (1,2) has no living neighbor
    and dies, the drawing omits the births at (0,1) and (2,1) inside its own
    3x3 frame, and a further birth at (1,-1) falls outside that frame. The rule
    text is normative, so this asserts the rule-derived result: the middle of
    the row survives with 2 neighbors and three cells are born around it.
    """
    row_with_isolated_cell = [(0, 0), (1, 0), (2, 0), (1, 2)]

    assert next_generation(row_with_isolated_cell) == {
        (1, -1),
        (0, 1), (1, 0), (2, 1),
    }


def test_reproduction_spec_example_produces_block():
    """Spec rule 4, Gen 0 ##./#../... -> ##./##./...

    Unlike the rule 2 and rule 3 examples, this drawing is consistent with the
    rule text on the infinite grid: no cell outside the frame reaches three
    living neighbors, so the drawn result is the complete result.
    """
    corner = [(0, 0), (1, 0), (0, 1)]

    assert next_generation(corner) == {(0, 0), (1, 0), (0, 1), (1, 1)}


def test_pattern_at_large_negative_coordinates_behaves_identically():
    far_away = (-1000000, -1000000)
    vertical_blinker = [(0, 0), (0, 1), (0, 2)]
    horizontal_blinker = {(-1, 1), (0, 1), (1, 1)}

    assert next_generation(translate(vertical_blinker, far_away)) == translate(
        horizontal_blinker, far_away
    )


def translate(cells, offset):
    dx, dy = offset
    return {(x + dx, y + dy) for x, y in cells}


def test_next_generation_leaves_input_unchanged():
    vertical_blinker = [(0, 0), (0, 1), (0, 2)]

    next_generation(vertical_blinker)

    assert vertical_blinker == [(0, 0), (0, 1), (0, 2)]
