import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
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
    void singleLiveCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void twoAdjacentCellsWithOneNeighborEachDie() {
        assertEquals(
                Set.of(),
                new GameOfLife().nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1)));

        assertTrue(next.contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(0, 0),
                                        new Cell(1, 0),
                                        new Cell(0, 1),
                                        new Cell(1, 1)));

        assertTrue(next.contains(new Cell(0, 0)));
    }

    @Test
    void rule2PictureKeepsTheLiveCellWithTwoNeighbours() {
        // Reading adopted: rows run top-down as y=0,1,2, so the picture's gen 0 is
        // [(0,0),(1,0),(2,0),(1,2)]. The spec's sentence calls (1,1) a live cell that
        // survives, but (1,1) is dead in the picture and has 4 living neighbours, so it is
        // neither a survivor nor a birth under the four rules. This test asserts the rule
        // the example is given for: (1,0) has 2 living neighbours and lives on. The picture
        // also cannot show the cells born at (0,1), (2,1) and (1,-1) under Rule 4.
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(0, 0),
                                        new Cell(1, 0),
                                        new Cell(2, 0),
                                        new Cell(1, 2)));

        assertTrue(next.contains(new Cell(1, 0)));
    }

    @Test
    void liveCellWithMoreThanThreeNeighborsDies() {
        // Reading adopted: the four numbered rules are authoritative. The Rule 3 picture's
        // gen 1 shows (0,1) and (2,1) alive, but each has 5 living neighbours in gen 0 and
        // so cannot be born under Rule 4; the picture also cannot show the cells born at
        // (1,-1) and (1,3) outside its 3x3 window. This test asserts the rule the example
        // is given for: the center cell with 4+ living neighbours dies.
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
    void deadCellWithExactlyThreeNeighborsBecomesAlive() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1)));

        assertEquals(
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)), next);
    }

    @Test
    void deadCellWithTwoNeighborsStaysDead() {
        Set<Cell> next =
                new GameOfLife().nextGeneration(Set.of(new Cell(0, 0), new Cell(2, 0)));

        assertFalse(next.contains(new Cell(1, 0)));
    }

    @Test
    void deadCellWithFourNeighborsStaysDead() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(0, 0),
                                        new Cell(2, 0),
                                        new Cell(0, 2),
                                        new Cell(2, 2)));

        assertFalse(next.contains(new Cell(1, 1)));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void blinkerOscillatesToHorizontal() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)));

        assertEquals(Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)), next);
    }

    @Test
    void blinkerReturnsToVerticalAfterTwoGenerations() {
        GameOfLife gameOfLife = new GameOfLife();
        Set<Cell> blinker = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        Set<Cell> afterTwoGenerations =
                gameOfLife.nextGeneration(gameOfLife.nextGeneration(blinker));

        assertEquals(blinker, afterTwoGenerations);
    }

    @Test
    void gridIsInfiniteIntoNegativeCoordinates() {
        Set<Cell> next =
                new GameOfLife()
                        .nextGeneration(
                                Set.of(
                                        new Cell(-10, -10),
                                        new Cell(-10, -9),
                                        new Cell(-10, -8)));

        assertEquals(
                Set.of(new Cell(-11, -9), new Cell(-10, -9), new Cell(-9, -9)), next);
    }

    @Test
    void cellIsAValueTypeComparedByCoordinates() {
        assertEquals(new Cell(1, 2), new Cell(1, 2));
        assertEquals(new Cell(1, 2).hashCode(), new Cell(1, 2).hashCode());
        assertNotEquals(new Cell(1, 2), new Cell(2, 1));
    }

    @Test
    void nextGenerationDoesNotModifyItsInput() {
        Set<Cell> blinker =
                new HashSet<>(List.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)));

        new GameOfLife().nextGeneration(blinker);

        assertEquals(Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)), blinker);
    }
}
