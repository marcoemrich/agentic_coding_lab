import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class GameOfLifeTest {
    @Test
    void emptyGenerationRemainsEmpty() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.<Cell>of()));
    }

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void adjacentPairDiesFromUnderpopulation() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(
                new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Cell center = new Cell(0, 0);
        Set<Cell> next = new GameOfLife().nextGeneration(Set.of(
                new Cell(-1, 0), center, new Cell(1, 0)));
        assertTrue(next.contains(center));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Cell center = new Cell(0, 0);
        Set<Cell> next = new GameOfLife().nextGeneration(Set.of(
                center, new Cell(-1, 0), new Cell(1, 0), new Cell(0, 1)));
        assertTrue(next.contains(center));
    }

    @Test
    void liveCellWithFourNeighborsDies() {
        Cell center = new Cell(0, 0);
        Set<Cell> next = new GameOfLife().nextGeneration(Set.of(
                center, new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1)));
        assertFalse(next.contains(center));
    }

    @Test
    void centerOfOverpopulationExampleDies() {
        Cell center = new Cell(1, 1);
        Set<Cell> next = new GameOfLife().nextGeneration(Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), center,
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2)));
        assertFalse(next.contains(center));
    }

    @Test
    void deadCellWithThreeNeighborsBecomesAlive() {
        Set<Cell> next = new GameOfLife().nextGeneration(Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1)));
        assertEquals(Set.of(new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1)), next);
    }

    @Test
    void deadCellsWithoutExactlyThreeNeighborsStayDead() {
        GameOfLife game = new GameOfLife();
        Cell target = new Cell(0, 0);
        assertFalse(game.nextGeneration(Set.of(
                new Cell(-1, 0), new Cell(1, 0))).contains(target));
        assertFalse(game.nextGeneration(Set.of(
                new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1))).contains(target));
    }

    @Test
    void verticalBlinkerBecomesHorizontal() {
        assertEquals(Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)),
                new GameOfLife().nextGeneration(Set.of(
                        new Cell(0, 0), new Cell(0, 1), new Cell(0, 2))));
    }

    @Test
    void horizontalBlinkerBecomesVertical() {
        assertEquals(Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)),
                new GameOfLife().nextGeneration(Set.of(
                        new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));
        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void translatedBlinkerCrossesNegativeCoordinates() {
        assertEquals(Set.of(new Cell(-2, 0), new Cell(-1, 0), new Cell(0, 0)),
                new GameOfLife().nextGeneration(Set.of(
                        new Cell(-1, -1), new Cell(-1, 0), new Cell(-1, 1))));
    }
}
