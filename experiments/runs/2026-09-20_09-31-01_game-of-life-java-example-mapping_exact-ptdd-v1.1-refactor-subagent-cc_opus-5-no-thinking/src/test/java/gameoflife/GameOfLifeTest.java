package gameoflife;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    private static final int DRAWING_SIZE = 3;

    /** The blinker oscillator has period two: these two phases alternate forever. */
    private static final Set<Cell> VERTICAL_BLINKER =
            Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

    private static final Set<Cell> HORIZONTAL_BLINKER =
            Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

    private final GameOfLife game = new GameOfLife();

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), game.nextGeneration(Set.of()));
    }

    @Test
    void singleCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void pairOfCellsWithOneNeighbourEachDies() {
        Set<Cell> gen0 = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), game.nextGeneration(gen0));
    }

    @Test
    void liveCellWithTwoNeighboursSurvives() {
        Set<Cell> gen0 = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertTrue(game.nextGeneration(gen0).contains(new Cell(0, 1)));
    }

    @Test
    void liveCellWithThreeNeighboursSurvives() {
        Set<Cell> gen0 = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 1));

        assertTrue(game.nextGeneration(gen0).contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithMoreThanThreeNeighboursDies() {
        Set<Cell> gen0 = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1), new Cell(0, 2));

        assertFalse(game.nextGeneration(gen0).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithExactlyThreeNeighboursBecomesAlive() {
        Set<Cell> gen0 = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(game.nextGeneration(gen0).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighboursStaysDead() {
        Set<Cell> gen0 = Set.of(new Cell(0, 0), new Cell(1, 0));

        assertFalse(game.nextGeneration(gen0).contains(new Cell(0, 1)));
    }

    /**
     * See {@link #cellsInDrawing} for the adopted reading. The stated rule -- centre cell
     * (1,1) has 4 living neighbours and dies -- holds; the drawing additionally shows (1,0)
     * dead and (0,1) alive, which the stated rules contradict.
     */
    @Test
    void overpopulationExampleProducesSpecifiedGrid() {
        Set<Cell> gen0 = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        Set<Cell> drawn = cellsInDrawing(game.nextGeneration(gen0));

        assertEquals(Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2)), drawn);
    }

    /**
     * See {@link #cellsInDrawing} for the adopted reading. The caption says centre cell
     * (1,1) survives, but (1,1) is dead in generation 0 and has 4 living neighbours, so it
     * is not born; (0,1) and (2,1) each have exactly 3 and are born. Survival with 3 living
     * neighbours is discriminated separately by liveCellWithThreeNeighboursSurvives.
     */
    @Test
    void survivalExampleProducesSpecifiedGrid() {
        Set<Cell> gen0 = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 2));

        Set<Cell> drawn = cellsInDrawing(game.nextGeneration(gen0));

        assertEquals(Set.of(new Cell(1, 0), new Cell(0, 1), new Cell(2, 1)), drawn);
    }

    @Test
    void reproductionExampleProducesSpecifiedGrid() {
        Set<Cell> gen0 = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertEquals(
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)),
                game.nextGeneration(gen0));
    }

    @Test
    void blinkerRotatesFromVerticalToHorizontal() {
        assertEquals(HORIZONTAL_BLINKER, game.nextGeneration(VERTICAL_BLINKER));
    }

    @Test
    void blinkerRotatesBackToVertical() {
        assertEquals(VERTICAL_BLINKER, game.nextGeneration(HORIZONTAL_BLINKER));
    }

    @Test
    void blockRemainsUnchanged() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, game.nextGeneration(block));
    }

    /**
     * The same still life far from the origin in both axes. This discriminates coordinate
     * handling that assumes a non-negative origin, which the origin-anchored
     * {@link #blockRemainsUnchanged} cannot detect.
     */
    @Test
    void patternAtNegativeCoordinatesBehavesIdentically() {
        Set<Cell> block = Set.of(
                new Cell(-101, -101), new Cell(-100, -101),
                new Cell(-101, -100), new Cell(-100, -100));

        assertEquals(block, game.nextGeneration(block));
    }

    /**
     * Each living cell is reported exactly once, in no particular order. The specification's
     * generation 1 for the vertical blinker lists three cells, so a result that reported any
     * cell twice would carry more than three. Whether the three are the right ones is
     * discriminated separately by {@link #blinkerRotatesFromVerticalToHorizontal}.
     */
    @Test
    void nextGenerationReturnsEachLivingCellOnce() {
        Set<Cell> gen1 = game.nextGeneration(VERTICAL_BLINKER);

        assertEquals(3, gen1.size());
    }

    @Test
    void cellIsAValueTypeWithCoordinates() {
        Cell cell = new Cell(1, 2);

        assertEquals(1, cell.x());
        assertEquals(2, cell.y());
        assertEquals(new Cell(1, 2), cell);
        assertEquals(new Cell(1, 2).hashCode(), cell.hashCode());
        assertFalse(cell.equals(new Cell(2, 1)));
    }

    /**
     * The specification draws each rule example as a 3x3 grid anchored at the origin. The
     * result on the infinite grid may contain cells outside that grid; this keeps only the
     * cells the drawing can show, so a drawn example can be compared as an exact set.
     *
     * <p>Reading adopted for every drawn example: where a drawing contradicts the
     * specification's own stated Rules 1-4, the stated rules are authoritative. Drawn
     * examples are asserted against what Rules 1-4 produce, not against the drawing.
     */
    private static Set<Cell> cellsInDrawing(Set<Cell> cells) {
        Set<Cell> drawn = new HashSet<>();
        for (Cell cell : cells) {
            if (isDrawn(cell)) {
                drawn.add(cell);
            }
        }
        return drawn;
    }

    private static boolean isDrawn(Cell cell) {
        return isWithinDrawing(cell.x()) && isWithinDrawing(cell.y());
    }

    private static boolean isWithinDrawing(int coordinate) {
        return coordinate >= 0 && coordinate < DRAWING_SIZE;
    }
}
