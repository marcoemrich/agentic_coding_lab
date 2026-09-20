package gol;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void underpopulatedPairDies() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void blockSurvives() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(block, GameOfLife.nextGeneration(block));
    }

    @Test
    void liveCellWithThreeNeighboursSurvives() {
        Set<Cell> shape = Set.of(new Cell(1, 1), new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));
        assertTrue(GameOfLife.nextGeneration(shape).contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithTwoNeighboursSurvives() {
        Set<Cell> shape = Set.of(new Cell(1, 1), new Cell(0, 0), new Cell(2, 0));
        assertTrue(GameOfLife.nextGeneration(shape).contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithFourNeighboursDies() {
        Set<Cell> shape = Set.of(
                new Cell(1, 1),
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 2));
        assertFalse(GameOfLife.nextGeneration(shape).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithThreeNeighboursIsBorn() {
        Set<Cell> shape = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(expected, GameOfLife.nextGeneration(shape));
    }

    @Test
    void blinkerOscillates() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
        assertEquals(horizontal, GameOfLife.nextGeneration(vertical));
        assertEquals(vertical, GameOfLife.nextGeneration(horizontal));
    }

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of()));
    }

    @Test
    void worksWithNegativeCoordinates() {
        Set<Cell> block = Set.of(
                new Cell(-5, -5), new Cell(-4, -5), new Cell(-5, -4), new Cell(-4, -4));
        assertEquals(block, GameOfLife.nextGeneration(block));
    }

}
