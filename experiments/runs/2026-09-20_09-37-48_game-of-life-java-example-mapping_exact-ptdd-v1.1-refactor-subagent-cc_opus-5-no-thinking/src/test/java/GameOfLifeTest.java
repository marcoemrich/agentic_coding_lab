import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    private static final Set<Cell> VERTICAL_BLINKER =
            Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
    private static final Set<Cell> HORIZONTAL_BLINKER =
            Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
    private static final Set<Cell> BLOCK =
            Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
    private static final Set<Cell> BLOCK_AT_NEGATIVE_COORDINATES =
            Set.of(new Cell(-5, -5), new Cell(-4, -5), new Cell(-5, -4), new Cell(-4, -4));

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void liveCellWithOneNeighborDies() {
        assertEquals(
                Set.of(),
                new GameOfLife().nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)));

        assertTrue(next.contains(new Cell(0, 1)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(0, 0),
                                        new Cell(1, 0),
                                        new Cell(2, 0),
                                        new Cell(1, 1)));

        assertTrue(next.contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithFourNeighborsDies() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(0, 0),
                                        new Cell(1, 0),
                                        new Cell(2, 0),
                                        new Cell(1, 1),
                                        new Cell(0, 2),
                                        new Cell(1, 2),
                                        new Cell(2, 2)));

        assertFalse(next.contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithThreeNeighborsBecomesAlive() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1)));

        assertTrue(next.contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighborsStaysDead() {
        Set<Cell> next =
                new GameOfLife().nextGeneration(Set.of(new Cell(0, 0), new Cell(1, 0)));

        assertFalse(next.contains(new Cell(0, 1)));
    }

    @Test
    void underpopulationExampleProducesEmptyGeneration() {
        assertEquals(
                Set.of(),
                new GameOfLife().nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void survivalExampleKeepsTheThreeNeighborLiveCellAlive() {
        // Rule 2 example, read from its text: the live centre (1,1) has 3 live
        // neighbours and survives. The diagram's gen1 rendering is inconsistent
        // with the four rules, so the transition is computed from the rules.
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(0, 0),
                                        new Cell(1, 0),
                                        new Cell(2, 0),
                                        new Cell(1, 1)));

        assertEquals(
                Set.of(
                        new Cell(0, 0),
                        new Cell(2, 0),
                        new Cell(1, 0),
                        new Cell(1, 1),
                        new Cell(1, -1),
                        new Cell(0, 1),
                        new Cell(2, 1)),
                next);
    }

    @Test
    void overpopulationExampleKillsTheOvercrowdedCentreCell() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(0, 0),
                                        new Cell(1, 0),
                                        new Cell(2, 0),
                                        new Cell(1, 1),
                                        new Cell(0, 2),
                                        new Cell(1, 2),
                                        new Cell(2, 2)));

        // Rule 3 example, read from its text: the overpopulated centre dies.
        // The diagram's gen1 rendering is inconsistent with the four rules, so
        // the transition is computed from the rules.
        assertEquals(
                Set.of(
                        new Cell(0, 0),
                        new Cell(1, 0),
                        new Cell(2, 0),
                        new Cell(0, 2),
                        new Cell(1, 2),
                        new Cell(2, 2),
                        new Cell(1, -1),
                        new Cell(1, 3)),
                next);
    }

    @Test
    void reproductionExampleProducesBlock() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1)));

        assertEquals(
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)), next);
    }

    @Test
    void blinkerOscillatesToHorizontal() {
        Set<Cell> next = new GameOfLife().nextGeneration(VERTICAL_BLINKER);

        assertEquals(HORIZONTAL_BLINKER, next);
    }

    @Test
    void blinkerOscillatesBackToVertical() {
        Set<Cell> next = new GameOfLife().nextGeneration(HORIZONTAL_BLINKER);

        assertEquals(VERTICAL_BLINKER, next);
    }

    @Test
    void blockRemainsUnchanged() {
        assertEquals(BLOCK, new GameOfLife().nextGeneration(BLOCK));
    }

    @Test
    void patternAtNegativeCoordinatesBehavesIdentically() {
        assertEquals(
                BLOCK_AT_NEGATIVE_COORDINATES,
                new GameOfLife().nextGeneration(BLOCK_AT_NEGATIVE_COORDINATES));
    }

    @Test
    void patternAtLargeCoordinatesIsNotClipped() {
        int farFromOrigin = 1_000_000;

        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(farFromOrigin, 0),
                                        new Cell(farFromOrigin, 1),
                                        new Cell(farFromOrigin, 2)));

        assertEquals(
                Set.of(
                        new Cell(farFromOrigin - 1, 1),
                        new Cell(farFromOrigin, 1),
                        new Cell(farFromOrigin + 1, 1)),
                next);
    }

    @Test
    void inputCollectionIsNotMutated() {
        Set<Cell> livingCells = new HashSet<>(VERTICAL_BLINKER);

        new GameOfLife().nextGeneration(livingCells);

        assertEquals(VERTICAL_BLINKER, livingCells);
    }
}
