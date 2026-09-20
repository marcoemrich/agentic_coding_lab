import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    private final GameOfLife game = new GameOfLife();

    @Test
    void anEmptyGenerationRemainsEmpty() {
        assertEquals(Set.of(), game.nextGeneration(Set.of()));
    }

    @Test
    void aSingleCellDiesFromUnderpopulation() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void twoAdjacentCellsDieFromUnderpopulation() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void aBlockSurvivesAsAStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, game.nextGeneration(block));
    }

    @Test
    void aLiveCellWithTwoNeighborsSurvives() {
        Set<Cell> next = game.nextGeneration(Set.of(
                new Cell(-1, 0), new Cell(0, 0), new Cell(1, 0)));

        assertTrue(next.contains(new Cell(0, 0)));
    }

    @Test
    void aLiveCellWithFourNeighborsDiesFromOverpopulation() {
        Set<Cell> next = game.nextGeneration(Set.of(
                new Cell(0, 0), new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1)));

        assertFalse(next.contains(new Cell(0, 0)));
    }

    @Test
    void aDeadCellWithThreeNeighborsIsBorn() {
        Set<Cell> initial = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, game.nextGeneration(initial));
    }

    @Test
    void aBlinkerOscillatesAcrossTwoGenerations() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, game.nextGeneration(vertical));
        assertEquals(vertical, game.nextGeneration(horizontal));
    }

    @Test
    void cellsCanLiveAtNegativeCoordinates() {
        Set<Cell> vertical = Set.of(new Cell(-10, -12), new Cell(-10, -11), new Cell(-10, -10));
        Set<Cell> horizontal = Set.of(new Cell(-11, -11), new Cell(-10, -11), new Cell(-9, -11));

        assertEquals(horizontal, game.nextGeneration(vertical));
    }
}
