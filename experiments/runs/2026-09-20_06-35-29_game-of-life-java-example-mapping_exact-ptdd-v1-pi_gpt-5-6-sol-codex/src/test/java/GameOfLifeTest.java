import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    @Test
    void emptyGenerationRemainsEmpty() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void adjacentPairDiesFromUnderpopulation() {
        Set<Cell> pair = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(pair));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Cell center = new Cell(0, 0);
        Set<Cell> generation = Set.of(center, new Cell(-1, 0), new Cell(1, 0));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(center));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Cell center = new Cell(0, 0);
        Set<Cell> generation = Set.of(
                center, new Cell(-1, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(center));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(generation));
    }

    @Test
    void liveCellWithFourNeighborsDies() {
        Cell center = new Cell(0, 0);
        Set<Cell> generation = Set.of(center,
                new Cell(-1, 0), new Cell(1, 0), new Cell(0, -1), new Cell(0, 1));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(center));
    }

    @Test
    void crowdedRuleThreePatternAppliesNeighborRules() {
        Set<Cell> generation = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));
        Set<Cell> expected = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, -1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2), new Cell(1, 3));

        assertEquals(expected, new GameOfLife().nextGeneration(generation));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void blinkerOscillatesAcrossNegativeCoordinates() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
        GameOfLife game = new GameOfLife();

        assertEquals(horizontal, game.nextGeneration(vertical));
        assertEquals(vertical, game.nextGeneration(horizontal));
    }
}
