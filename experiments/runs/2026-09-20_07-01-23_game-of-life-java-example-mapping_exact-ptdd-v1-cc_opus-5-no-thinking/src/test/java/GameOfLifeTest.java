import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void emptyGridProducesEmptyNextGeneration() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleLiveCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void twoAdjacentCellsWithOneNeighborEachDie() {
        Set<Cell> generation = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(generation));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> generation = Set.of(new Cell(1, 1), new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertTrue(new GameOfLife().nextGeneration(block).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithMoreThanThreeNeighborsDies() {
        Set<Cell> generation = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithExactlyThreeNeighborsBecomesAlive() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighborsStaysDead() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(2, 0));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 0)));
    }

    @Test
    void overpopulationExampleProducesSpecifiedNextGeneration() {
        Set<Cell> generation = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        Set<Cell> expected = Set.of(
                new Cell(1, -1),
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2),
                new Cell(1, 3));

        assertEquals(expected, new GameOfLife().nextGeneration(generation));
    }

    @Test
    void reproductionExampleProducesSpecifiedNextGeneration() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        Set<Cell> expected = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(generation));
    }

    @Test
    void blockStillLifeRemainsUnchanged() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void verticalBlinkerBecomesHorizontalBlinker() {
        Set<Cell> verticalBlinker = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        Set<Cell> horizontalBlinker = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontalBlinker, new GameOfLife().nextGeneration(verticalBlinker));
    }

    @Test
    void horizontalBlinkerBecomesVerticalBlinker() {
        Set<Cell> horizontalBlinker = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        Set<Cell> verticalBlinker = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertEquals(verticalBlinker, new GameOfLife().nextGeneration(horizontalBlinker));
    }

    @Test
    void infiniteGridSupportsNegativeCoordinates() {
        Set<Cell> distantBlock = Set.of(
                new Cell(-101, -101), new Cell(-100, -101),
                new Cell(-101, -100), new Cell(-100, -100));

        assertEquals(distantBlock, new GameOfLife().nextGeneration(distantBlock));
    }

    @Test
    void duplicateInputCellsAreTreatedAsOneLiveCell() {
        List<Cell> blockListedTwice = List.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1),
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        Set<Cell> block = Set.copyOf(blockListedTwice);

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void cellIsAValueTypeComparedByCoordinates() {
        assertEquals(new Cell(1, 2), new Cell(1, 2));
        assertEquals(new Cell(1, 2).hashCode(), new Cell(1, 2).hashCode());
        assertEquals(1, new Cell(1, 2).x());
        assertEquals(2, new Cell(1, 2).y());
    }
}
