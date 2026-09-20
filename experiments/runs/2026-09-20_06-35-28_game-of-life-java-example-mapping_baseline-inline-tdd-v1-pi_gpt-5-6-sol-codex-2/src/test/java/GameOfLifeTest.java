import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    private final GameOfLife game = new GameOfLife();

    @Test
    void aSingleCellDiesFromUnderpopulation() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void twoCellsDieFromUnderpopulation() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void aBlockSurvivesUnchanged() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, game.nextGeneration(block));
    }

    @Test
    void aCellWithFourNeighborsDiesFromOverpopulation() {
        Set<Cell> plus = Set.of(
                new Cell(0, 0), new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1));

        Set<Cell> next = game.nextGeneration(plus);

        org.junit.jupiter.api.Assertions.assertFalse(next.contains(new Cell(0, 0)));
    }

    @Test
    void aDeadCellWithThreeNeighborsIsBorn() {
        Set<Cell> next = game.nextGeneration(Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1)));

        org.junit.jupiter.api.Assertions.assertTrue(next.contains(new Cell(1, 1)));
    }

    @Test
    void blinkerOscillatesAcrossNegativeCoordinates() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, game.nextGeneration(vertical));
        assertEquals(vertical, game.nextGeneration(horizontal));
    }

    @Test
    void anEmptyGenerationRemainsEmpty() {
        assertEquals(Set.of(), game.nextGeneration(Set.of()));
    }
}
