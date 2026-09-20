import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void cellsWithOneNeighborDieOfUnderpopulation() {
        Set<Cell> generation = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(generation));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(0, 1)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> generation =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithFourNeighborsDiesOfOverpopulation() {
        Set<Cell> generation = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithThreeNeighborsBecomesAlive() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighborsStaysDead() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(0, 1)));
    }

    /**
     * The specification's Rule 3 diagram shows Gen 1 as "#.#/#.#/#.#", which contradicts
     * Rule 2: the edge cell (1,0) has exactly 3 living neighbours and must survive. The
     * numbered rules are normative and the diagram illustrates only the sentence beneath
     * it ("center cell (1,1) has 4 live neighbors -> dies"), which
     * {@link #liveCellWithFourNeighborsDiesOfOverpopulation()} asserts. This test asserts
     * the whole generation that Rules 1-4 produce.
     */
    @Test
    void overpopulationExampleProducesFullNextGeneration() {
        Set<Cell> generation = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        assertEquals(
                Set.of(
                        new Cell(1, -1),
                        new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                        new Cell(0, 2), new Cell(1, 2), new Cell(2, 2),
                        new Cell(1, 3)),
                new GameOfLife().nextGeneration(generation));
    }

    @Test
    void reproductionExampleProducesFullNextGeneration() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertEquals(
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)),
                new GameOfLife().nextGeneration(generation));
    }

    @Test
    void blockIsAStillLife() {
        Set<Cell> block =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void blinkerRotatesAfterOneGeneration() {
        Set<Cell> blinker = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertEquals(
                Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)),
                new GameOfLife().nextGeneration(blinker));
    }

    @Test
    void blinkerReturnsToStartAfterTwoGenerations() {
        Set<Cell> blinker = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        GameOfLife gameOfLife = new GameOfLife();

        Set<Cell> afterTwoGenerations =
                gameOfLife.nextGeneration(gameOfLife.nextGeneration(blinker));

        assertEquals(blinker, afterTwoGenerations);
    }

    @Test
    void gridIsInfiniteTowardsNegativeCoordinates() {
        Set<Cell> blinker =
                Set.of(new Cell(-10, -11), new Cell(-10, -10), new Cell(-10, -9));

        assertEquals(
                Set.of(new Cell(-11, -10), new Cell(-10, -10), new Cell(-9, -10)),
                new GameOfLife().nextGeneration(blinker));
    }

    @Test
    void cellsWithSameCoordinatesAreEqual() {
        assertEquals(new Cell(3, -4), new Cell(3, -4));
        assertEquals(1, new HashSet<>(List.of(new Cell(3, -4), new Cell(3, -4))).size());
    }
}
