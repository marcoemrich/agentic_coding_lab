import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    private final GameOfLife game = new GameOfLife();

    @Test
    void emptyGenerationRemainsEmpty() {
        assertEquals(Set.of(), game.nextGeneration(Set.of()));
    }

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void cellsWithFewerThanTwoNeighborsDie() {
        assertEquals(Set.of(), game.nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void blockIsAStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, game.nextGeneration(block));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> next = game.nextGeneration(Set.of(
                new Cell(-1, 0), new Cell(0, 0), new Cell(1, 0)));

        org.junit.jupiter.api.Assertions.assertTrue(next.contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> next = game.nextGeneration(Set.of(
                new Cell(0, 0), new Cell(-1, 0),
                new Cell(1, 0), new Cell(0, 1)));

        org.junit.jupiter.api.Assertions.assertTrue(next.contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithFourNeighborsDiesFromOverpopulation() {
        Set<Cell> next = game.nextGeneration(Set.of(
                new Cell(0, 0), new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1)));

        org.junit.jupiter.api.Assertions.assertFalse(next.contains(new Cell(0, 0)));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> next = game.nextGeneration(Set.of(
                new Cell(-1, 0), new Cell(1, 0), new Cell(0, 1)));

        org.junit.jupiter.api.Assertions.assertTrue(next.contains(new Cell(0, 0)));
    }

    @Test
    void blinkerOscillatesAcrossNegativeCoordinates() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, game.nextGeneration(vertical));
        assertEquals(vertical, game.nextGeneration(horizontal));
    }

    @Test
    void patternsAreNotBoundedToAnOriginCenteredGrid() {
        Set<Cell> vertical = Set.of(
                new Cell(-10_000, 50_000),
                new Cell(-10_000, 50_001),
                new Cell(-10_000, 50_002));
        Set<Cell> expected = Set.of(
                new Cell(-10_001, 50_001),
                new Cell(-10_000, 50_001),
                new Cell(-9_999, 50_001));

        assertEquals(expected, game.nextGeneration(vertical));
    }

    @Test
    void duplicateCoordinatesDoNotRepresentExtraLivingCells() {
        List<Cell> cells = List.of(new Cell(0, 0), new Cell(0, 0), new Cell(1, 0));

        assertEquals(Set.of(), game.nextGeneration(cells));
    }
}
