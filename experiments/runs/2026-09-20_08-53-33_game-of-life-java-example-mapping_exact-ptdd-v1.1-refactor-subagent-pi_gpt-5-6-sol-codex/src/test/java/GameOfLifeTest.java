import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class GameOfLifeTest {
    @Test
    void emptyGenerationRemainsEmpty() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleCellDiesFromUnderpopulation() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void pairDiesFromUnderpopulation() {
        Set<Cell> pair = Set.of(new Cell(0, 1), new Cell(1, 1));
        assertEquals(Set.of(), new GameOfLife().nextGeneration(pair));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> line = Set.of(new Cell(-1, 0), new Cell(0, 0), new Cell(1, 0));
        assertTrue(new GameOfLife().nextGeneration(line).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> cells = Set.of(
                new Cell(0, 0), new Cell(-1, 0), new Cell(1, 0), new Cell(0, 1));
        assertTrue(new GameOfLife().nextGeneration(cells).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithFourNeighborsDiesFromOverpopulation() {
        Set<Cell> cells = Set.of(new Cell(0, 0), new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1));
        assertFalse(new GameOfLife().nextGeneration(cells).contains(new Cell(0, 0)));
    }

    @Test
    void overpopulationDiagramProducesSixSurvivors() {
        Set<Cell> cells = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));
        Set<Cell> expected = Set.of(new Cell(1, -1),
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2),
                new Cell(1, 3));
        assertEquals(expected, new GameOfLife().nextGeneration(cells));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> cells = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(expected, new GameOfLife().nextGeneration(cells));
    }

    @Test
    void blinkerOscillatesFromVerticalToHorizontal() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void blinkerReturnsToItsInitialStateAfterTwoGenerations() {
        GameOfLife game = new GameOfLife();
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> afterTwo = game.nextGeneration(game.nextGeneration(vertical));
        assertEquals(vertical, afterTwo);
    }

    @Test
    void blockIsAStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void evolutionSupportsNegativeCoordinates() {
        Set<Cell> vertical = Set.of(
                new Cell(-1000, -1000), new Cell(-1000, -999), new Cell(-1000, -998));
        Set<Cell> horizontal = Set.of(
                new Cell(-1001, -999), new Cell(-1000, -999), new Cell(-999, -999));
        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }
}
