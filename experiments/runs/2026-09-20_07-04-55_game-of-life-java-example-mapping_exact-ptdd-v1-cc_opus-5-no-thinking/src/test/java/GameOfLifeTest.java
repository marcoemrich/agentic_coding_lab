import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void emptyGridProducesEmptyNextGeneration() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleLiveCellWithNoNeighborsDies() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void twoAdjacentLiveCellsEachWithOneNeighborDie() {
        Set<Cell> generation = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(generation));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> generation =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithFourNeighborsDies() {
        Set<Cell> generation =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 1),
                        new Cell(1, 2));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithExactlyThreeNeighborsBecomesAlive() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighborsStaysDead() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithFourNeighborsStaysDead() {
        Set<Cell> generation =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 2));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void blockRemainsUnchanged() {
        Set<Cell> block =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void blinkerRotatesToHorizontal() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertEquals(
                Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)),
                new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void blinkerRotatesBackToVertical() {
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(
                Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)),
                new GameOfLife().nextGeneration(horizontal));
    }

    @Test
    void gridExtendsIntoNegativeCoordinates() {
        Set<Cell> block =
                Set.of(new Cell(-5, -5), new Cell(-4, -5), new Cell(-5, -4), new Cell(-4, -4));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void liveCellWithEightNeighborsDies() {
        Cell centre = new Cell(1, 1);
        Set<Cell> generation = new HashSet<>(centre.neighbours());
        generation.add(centre);

        assertFalse(new GameOfLife().nextGeneration(generation).contains(centre));
    }

    @Test
    void cellIsAValueTypeComparedByCoordinates() {
        assertEquals(new Cell(1, 2), new Cell(1, 2));
        assertEquals(new Cell(1, 2).hashCode(), new Cell(1, 2).hashCode());
        assertNotEquals(new Cell(1, 2), new Cell(2, 1));
    }
}
