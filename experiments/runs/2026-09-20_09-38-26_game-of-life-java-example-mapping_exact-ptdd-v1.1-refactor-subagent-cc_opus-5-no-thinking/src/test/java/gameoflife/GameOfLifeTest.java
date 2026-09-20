package gameoflife;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), nextGenerationOf());
    }

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), nextGenerationOf(new Cell(0, 0)));
    }

    @Test
    void underpopulationTwoNeighbouringCellsBothDie() {
        assertEquals(Set.of(), nextGenerationOf(new Cell(0, 1), new Cell(1, 1)));
    }

    @Test
    void survivalLiveCellWithThreeNeighboursLivesOn() {
        Set<Cell> next = nextGenerationOf(
                new Cell(1, 1), new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertSurvives(new Cell(1, 1), next);
    }

    @Test
    void survivalLiveCellWithTwoNeighboursLivesOn() {
        Set<Cell> next = nextGenerationOf(new Cell(1, 1), new Cell(0, 0), new Cell(2, 0));

        assertSurvives(new Cell(1, 1), next);
    }

    @Test
    void overpopulationLiveCellWithFourNeighboursDies() {
        Set<Cell> next = nextGenerationOf(
                new Cell(1, 1), new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 2));

        assertDies(new Cell(1, 1), next);
    }

    @Test
    void reproductionDeadCellWithThreeNeighboursBecomesAlive() {
        Set<Cell> next = nextGenerationOf(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertBorn(new Cell(1, 1), next);
    }

    @Test
    void deadCellWithTwoNeighboursStaysDead() {
        Set<Cell> next = nextGenerationOf(new Cell(0, 0), new Cell(2, 0));

        assertDies(new Cell(1, 1), next);
    }

    /**
     * The specification's rule 3 drawing crops generation 1 to the original 3x3 box. On the
     * infinite grid the four numbered rules also produce births at (1,-1) and (1,3), and keep
     * (1,0) and (1,2) alive with three living neighbours each. The numbered rules are normative,
     * so this test asserts the rule-derived generation and rule 3's actual claim: the centre dies.
     */
    @Test
    void overpopulationFullExampleFromSpecification() {
        Set<Cell> next = nextGenerationOf(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        assertDies(new Cell(1, 1), next);
        assertEquals(Set.of(
                new Cell(1, -1),
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2),
                new Cell(1, 3)), next);
    }

    @Test
    void reproductionFullExampleFromSpecification() {
        Set<Cell> next = nextGenerationOf(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertEquals(Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1)), next);
    }

    @Test
    void blockStillLifeIsUnchanged() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, nextGenerationOf(block));
    }

    @Test
    void blinkerOscillatesToHorizontal() {
        Set<Cell> next = nextGenerationOf(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertEquals(Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)), next);
    }

    @Test
    void blinkerReturnsToVerticalAfterTwoGenerations() {
        Set<Cell> blinker = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertEquals(blinker, nextGenerationOf(nextGenerationOf(blinker)));
    }

    @Test
    void gridIsInfiniteInNegativeDirections() {
        Set<Cell> blockAtNegativeCoordinates = Set.of(
                new Cell(-5, -5), new Cell(-4, -5),
                new Cell(-5, -4), new Cell(-4, -4));

        assertEquals(blockAtNegativeCoordinates, nextGenerationOf(blockAtNegativeCoordinates));
    }

    /**
     * The grid is theoretically unlimited, so a pattern behaves identically wherever it sits.
     * The coordinates are far beyond any bounded-grid assumption but stay within int arithmetic,
     * because the specification defines no behaviour at the representation limit itself.
     */
    @Test
    void gridIsInfiniteForLargeCoordinates() {
        int far = 1_000_000_000;
        Set<Cell> next = nextGenerationOf(
                new Cell(far, far), new Cell(far, far + 1), new Cell(far, far + 2));

        assertEquals(Set.of(
                new Cell(far - 1, far + 1),
                new Cell(far, far + 1),
                new Cell(far + 1, far + 1)), next);
    }

    private static Set<Cell> nextGenerationOf(Cell... livingCells) {
        return nextGenerationOf(Set.of(livingCells));
    }

    private static Set<Cell> nextGenerationOf(Set<Cell> livingCells) {
        return new GameOfLife().nextGeneration(livingCells);
    }

    private static void assertSurvives(Cell cell, Set<Cell> nextGeneration) {
        assertTrue(nextGeneration.contains(cell));
    }

    private static void assertBorn(Cell cell, Set<Cell> nextGeneration) {
        assertTrue(nextGeneration.contains(cell));
    }

    private static void assertDies(Cell cell, Set<Cell> nextGeneration) {
        assertFalse(nextGeneration.contains(cell));
    }
}
