from game_of_life import next_generation


def assert_next_generation_is(living_cells, expected_cells):
    """Assert the whole next generation, ignoring the order cells come back in."""
    assert sorted(next_generation(living_cells)) == sorted(expected_cells)


def test_empty_grid_stays_empty():
    """An empty grid has no living cells, so the next generation is empty."""
    assert next_generation([]) == []


def test_single_live_cell_dies_of_underpopulation():
    """A lone live cell has 0 live neighbors and dies of underpopulation."""
    assert next_generation([(0, 0)]) == []


def test_pair_of_live_cells_both_die_of_underpopulation():
    """Two adjacent live cells each have 1 live neighbor, so both die."""
    assert next_generation([(0, 1), (1, 1)]) == []


def test_live_cell_with_two_neighbors_survives():
    """The centre of a vertical blinker has 2 live neighbors and survives."""
    assert (0, 1) in next_generation([(0, 0), (0, 1), (0, 2)])


def test_live_cell_with_three_neighbors_survives():
    """The live centre (1,1) under a full top row has 3 live neighbors and survives."""
    assert (1, 1) in next_generation([(0, 2), (1, 2), (2, 2), (1, 1)])


def test_live_cell_with_more_than_three_neighbors_dies_of_overpopulation():
    """A live centre surrounded by 6 live neighbors exceeds 3 and dies."""
    overcrowded = [(0, 2), (1, 2), (2, 2), (1, 1), (0, 0), (1, 0), (2, 0)]
    assert (1, 1) not in next_generation(overcrowded)


def test_dead_cell_with_exactly_three_neighbors_reproduces():
    """The dead cell (1,1) has exactly 3 live neighbors and becomes alive."""
    assert (1, 1) in next_generation([(0, 2), (1, 2), (0, 1)])


def test_dead_cell_with_two_neighbors_does_not_reproduce():
    """Reproduction needs exactly 3 neighbors, so 2 is below the threshold."""
    assert (1, 0) not in next_generation([(0, 0), (2, 0)])


def test_dead_cell_with_four_neighbors_does_not_reproduce():
    """Reproduction needs exactly 3 neighbors, so 4 is above the threshold."""
    assert (1, 1) not in next_generation([(0, 0), (2, 0), (0, 2), (2, 2)])


def test_reproduction_example_from_specification():
    """The spec's rule 4 grid gains (1,1) and keeps its three living cells."""
    assert_next_generation_is(
        [(0, 1), (1, 1), (0, 0)], [(0, 0), (0, 1), (1, 0), (1, 1)]
    )


def test_block_is_a_still_life():
    """Every cell of a block has 3 neighbors, so the block is unchanged."""
    block = [(0, 0), (1, 0), (0, 1), (1, 1)]
    assert_next_generation_is(block, block)


def test_blinker_oscillates_from_vertical_to_horizontal():
    """A vertical blinker becomes the horizontal blinker [(-1,1),(0,1),(1,1)]."""
    assert_next_generation_is([(0, 0), (0, 1), (0, 2)], [(-1, 1), (0, 1), (1, 1)])


def test_blinker_oscillates_back_to_vertical():
    """The horizontal blinker returns to the vertical blinker [(0,0),(0,1),(0,2)]."""
    assert_next_generation_is([(-1, 1), (0, 1), (1, 1)], [(0, 0), (0, 1), (0, 2)])


def test_grid_is_infinite_in_negative_directions():
    """The grid is unbounded, so a blinker far in the negative quadrant oscillates."""
    far = -1_000_000
    assert_next_generation_is(
        [(far, far - 1), (far, far), (far, far + 1)],
        [(far - 1, far), (far, far), (far + 1, far)],
    )


def test_duplicate_input_cells_count_once():
    """A repeated coordinate names one living cell, so a lone duplicated cell dies."""
    assert next_generation([(0, 0), (0, 0)]) == []


def test_duplicate_neighbor_counts_once():
    """A repeated neighbor coordinate is one neighbor, so the pair still dies."""
    assert next_generation([(0, 0), (1, 0), (1, 0)]) == []
