import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

/**
 * Where a drawn example in the specification contradicts the specification's own four rules, the
 * four rules and the infinite-grid constraint are taken as normative and the picture as an
 * erratum. Each affected test derives its expectation from the rules below.
 */
class GameOfLifeTest {

    private static final Cell[] BLINKER_VERTICAL = {new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)};

    private static final Cell[] BLINKER_HORIZONTAL = {new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)};

    private static Set<Cell> nextGeneration(Cell... livingCells) {
        return new GameOfLife().nextGeneration(Set.of(livingCells));
    }

    @Test
    void emptyGenerationStaysEmpty() {
        assertEquals(Set.of(), nextGeneration());
    }

    @Test
    void singleCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), nextGeneration(new Cell(0, 0)));
    }

    @Test
    void twoNeighbouringCellsBothDieOfUnderpopulation() {
        assertEquals(Set.of(), nextGeneration(new Cell(0, 1), new Cell(1, 1)));
    }

    @Test
    void liveCellWithTwoNeighboursSurvives() {
        Set<Cell> next =
                nextGeneration(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 2));

        assertTrue(next.contains(new Cell(1, 0)));
    }

    @Test
    void liveCellWithThreeNeighboursSurvives() {
        Set<Cell> next =
                nextGeneration(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertTrue(next.contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithMoreThanThreeNeighboursDiesOfOverpopulation() {
        Set<Cell> next = nextGeneration(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 1), new Cell(1, 2));

        assertFalse(next.contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithExactlyThreeNeighboursBecomesAlive() {
        Set<Cell> next = nextGeneration(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(next.contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighboursStaysDead() {
        Set<Cell> next = nextGeneration(new Cell(0, 0), new Cell(1, 0));

        assertFalse(next.contains(new Cell(0, 1)));
    }

    @Test
    void rule4ExampleProducesBlock() {
        assertEquals(
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)),
                nextGeneration(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1)));
    }

    @Test
    void rule3ExampleKeepsBothRowsAndBirthsAboveAndBelow() {
        // (1,0) has 3 living neighbours and survives, the dead cell (0,1) has 4 and stays
        // dead, the living centre (1,1) has 6 and dies of overpopulation, and the infinite
        // grid gives birth to (1,-1) and (1,3).
        assertEquals(
                Set.of(
                        new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                        new Cell(0, 2), new Cell(1, 2), new Cell(2, 2),
                        new Cell(1, -1), new Cell(1, 3)),
                nextGeneration(
                        new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                        new Cell(1, 1),
                        new Cell(0, 2), new Cell(1, 2), new Cell(2, 2)));
    }

    @Test
    void rule2ExampleKeepsTheCellWithTwoNeighbours() {
        // The dead centre (1,1) has 4 living neighbours, so rule 4 forbids its birth, while
        // (0,1), (2,1) and (1,-1) each have exactly 3 and are born.
        assertEquals(
                Set.of(new Cell(1, 0), new Cell(0, 1), new Cell(2, 1), new Cell(1, -1)),
                nextGeneration(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 2)));
    }

    @Test
    void blockIsAStillLife() {
        Cell[] block = {new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)};

        assertEquals(Set.of(block), nextGeneration(block));
    }

    @Test
    void blinkerRotatesAndExtendsIntoNegativeCoordinates() {
        assertEquals(Set.of(BLINKER_HORIZONTAL), nextGeneration(BLINKER_VERTICAL));
    }

    @Test
    void blinkerReturnsToItsOriginalShapeAfterTwoGenerations() {
        assertEquals(Set.of(BLINKER_VERTICAL), nextGeneration(BLINKER_HORIZONTAL));
    }

    @Test
    void patternAtLargeNegativeCoordinatesBehavesTheSame() {
        assertEquals(
                Set.of(
                        new Cell(-1_000_001, -999_999), new Cell(-1_000_000, -999_999),
                        new Cell(-999_999, -999_999)),
                nextGeneration(
                        new Cell(-1_000_000, -1_000_000), new Cell(-1_000_000, -999_999),
                        new Cell(-1_000_000, -999_998)));
    }
}
