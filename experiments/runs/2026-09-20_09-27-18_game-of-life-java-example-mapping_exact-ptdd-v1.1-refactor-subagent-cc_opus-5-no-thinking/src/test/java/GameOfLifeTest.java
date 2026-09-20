import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of()));
    }

    @Test
    void singleCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(board("#")));
    }

    @Test
    void twoAdjacentCellsWithOneNeighborEachDieOfUnderpopulation() {
        assertEquals(
                Set.of(),
                GameOfLife.nextGeneration(board(
                        "..",
                        "##")));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> next = GameOfLife.nextGeneration(board(
                "#",
                "#",
                "#"));

        assertTrue(next.contains(new Cell(0, 1)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> next = GameOfLife.nextGeneration(board(
                "###",
                ".#."));

        assertTrue(next.contains(new Cell(1, 0)));
    }

    @Test
    void liveCellWithMoreThanThreeNeighborsDiesOfOverpopulation() {
        Set<Cell> next = GameOfLife.nextGeneration(board(
                "###",
                ".#.",
                "###"));

        assertFalse(next.contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithExactlyThreeNeighborsBecomesAlive() {
        Set<Cell> next = GameOfLife.nextGeneration(board(
                "##",
                "#."));

        assertTrue(next.contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighborsStaysDead() {
        assertEquals(
                Set.of(),
                GameOfLife.nextGeneration(board(
                        "#",
                        ".",
                        "#")));
    }

    @Test
    void blockStillLifeIsUnchanged() {
        Set<Cell> block = board(
                "##",
                "##");

        assertEquals(block, GameOfLife.nextGeneration(block));
    }

    @Test
    void blinkerOscillatesToHorizontal() {
        Set<Cell> verticalBlinker = board(
                "#",
                "#",
                "#");

        assertEquals(
                Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)),
                GameOfLife.nextGeneration(verticalBlinker));
    }

    @Test
    void blinkerReturnsToVerticalAfterTwoGenerations() {
        Set<Cell> verticalBlinker = board(
                "#",
                "#",
                "#");

        assertEquals(
                verticalBlinker,
                GameOfLife.nextGeneration(GameOfLife.nextGeneration(verticalBlinker)));
    }

    @Test
    void gridExtendsIntoNegativeCoordinates() {
        Set<Cell> blinkerFarFromOrigin = Set.of(
                new Cell(-5, -5), new Cell(-5, -4), new Cell(-5, -3));

        assertEquals(
                Set.of(new Cell(-6, -4), new Cell(-5, -4), new Cell(-4, -4)),
                GameOfLife.nextGeneration(blinkerFarFromOrigin));
    }

    @Test
    void gridGrowsBeyondInitialBounds() {
        Set<Cell> corner = board(
                "##",
                "#.");

        Set<Cell> next = GameOfLife.nextGeneration(corner);

        assertTrue(next.contains(new Cell(1, 1)));
        assertFalse(corner.contains(new Cell(1, 1)));
    }

    @Test
    void cellIsAValueTypeWithEqualityByCoordinates() {
        assertEquals(new Cell(1, 2), new Cell(1, 2));
        assertEquals(new Cell(1, 2).hashCode(), new Cell(1, 2).hashCode());
        assertNotEquals(new Cell(1, 2), new Cell(2, 1));
        assertEquals(1, new Cell(1, 2).x());
        assertEquals(2, new Cell(1, 2).y());
    }

    /**
     * Reads the specification's picture notation: '#' is a living cell, '.' is dead.
     * The first row is y=0 and the first column is x=0, so board("#", "#", "#")
     * is the vertical blinker [(0,0), (0,1), (0,2)].
     */
    private static Set<Cell> board(String... rows) {
        Set<Cell> livingCells = new HashSet<>();
        for (int y = 0; y < rows.length; y++) {
            for (int x = 0; x < rows[y].length(); x++) {
                if (rows[y].charAt(x) == '#') {
                    livingCells.add(new Cell(x, y));
                }
            }
        }
        return livingCells;
    }
}
