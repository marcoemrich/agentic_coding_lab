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
        Set<Cell> alive = Set.of(new Cell(0, 0), new Cell(-1, 0), new Cell(1, 0));
        assertTrue(new GameOfLife().nextGeneration(alive).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> alive = Set.of(new Cell(0, 0), new Cell(-1, 0),
                new Cell(1, 0), new Cell(0, 1));
        assertTrue(new GameOfLife().nextGeneration(alive).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithFourNeighborsDies() {
        Set<Cell> alive = Set.of(new Cell(0, 0), new Cell(-1, 0),
                new Cell(1, 0), new Cell(0, -1), new Cell(0, 1));
        assertFalse(new GameOfLife().nextGeneration(alive).contains(new Cell(0, 0)));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> alive = Set.of(new Cell(0, 1), new Cell(1, 1), new Cell(0, 0));
        Set<Cell> expected = Set.of(new Cell(0, 1), new Cell(1, 1),
                new Cell(0, 0), new Cell(1, 0));
        assertEquals(expected, new GameOfLife().nextGeneration(alive));
    }

    @Test
    void statedLiveCenterWithThreeNeighborsSurvivesDespiteContradictoryArtwork() {
        Set<Cell> alive = Set.of(new Cell(1, 1), new Cell(0, 2),
                new Cell(1, 2), new Cell(2, 2));
        assertTrue(new GameOfLife().nextGeneration(alive).contains(new Cell(1, 1)));
    }

    @Test
    void shownOverpopulatedCenterDiesDespiteTextClaimingFourNeighbors() {
        Set<Cell> alive = Set.of(new Cell(0, 2), new Cell(1, 2), new Cell(2, 2),
                new Cell(1, 1), new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));
        assertFalse(new GameOfLife().nextGeneration(alive).contains(new Cell(1, 1)));
    }

    @Test
    void verticalBlinkerBecomesHorizontal() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void horizontalBlinkerBecomesVertical() {
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        assertEquals(vertical, new GameOfLife().nextGeneration(horizontal));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0),
                new Cell(0, 1), new Cell(1, 1));
        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void negativeCoordinateBlinkerDemonstratesInfiniteGrid() {
        Set<Cell> negativeVerticalBlinker = Set.of(
                new Cell(-2, -2), new Cell(-2, -1), new Cell(-2, 0));
        Set<Cell> expectedHorizontalBlinker = Set.of(
                new Cell(-3, -1), new Cell(-2, -1), new Cell(-1, -1));
        assertEquals(expectedHorizontalBlinker,
                new GameOfLife().nextGeneration(negativeVerticalBlinker));
    }
}
