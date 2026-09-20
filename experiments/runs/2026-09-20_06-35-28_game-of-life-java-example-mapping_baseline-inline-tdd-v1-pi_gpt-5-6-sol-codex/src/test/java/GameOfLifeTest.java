import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    private final GameOfLife game = new GameOfLife();

    @Test
    void aSingleCellDiesFromUnderpopulation() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void cellsWithTwoOrThreeNeighborsSurvive() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, game.nextGeneration(block));
    }

    @Test
    void twoAdjacentCellsDieFromUnderpopulation() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(
                new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void aCellWithMoreThanThreeNeighborsDiesFromOverpopulation() {
        Set<Cell> crowded = Set.of(
                new Cell(0, 0),
                new Cell(-1, -1), new Cell(0, -1),
                new Cell(1, -1), new Cell(-1, 0));

        assertFalse(game.nextGeneration(crowded).contains(new Cell(0, 0)));
    }

    @Test
    void aDeadCellWithExactlyThreeNeighborsIsBorn() {
        Set<Cell> initial = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, game.nextGeneration(initial));
    }

    @Test
    void blinkerOscillatesAcrossTwoGenerations() {
        Set<Cell> vertical = Set.of(
                new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(
                new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, game.nextGeneration(vertical));
        assertEquals(vertical, game.nextGeneration(horizontal));
    }

    @Test
    void supportsNegativeCoordinates() {
        Set<Cell> block = Set.of(
                new Cell(-2, -2), new Cell(-1, -2),
                new Cell(-2, -1), new Cell(-1, -1));

        assertEquals(block, game.nextGeneration(block));
    }
}
