package gameoflife;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void singleCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void blockSurvivesUnchanged() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(block, GameOfLife.nextGeneration(block));
    }

    @Test
    void pairDiesOfUnderpopulation() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void cellWithThreeNeighboursSurvives() {
        Set<Cell> gen0 = Set.of(new Cell(0, 0), new Cell(1, 1), new Cell(2, 0), new Cell(1, 2));
        assertTrue(GameOfLife.nextGeneration(gen0).contains(new Cell(1, 1)));
    }

    @Test
    void cellWithFourNeighboursDiesOfOverpopulation() {
        Set<Cell> gen0 = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));
        assertFalse(GameOfLife.nextGeneration(gen0).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithThreeNeighboursIsBorn() {
        Set<Cell> gen0 = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(expected, GameOfLife.nextGeneration(gen0));
    }

    @Test
    void blinkerOscillates() {
        Set<Cell> gen0 = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> gen1 = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
        assertEquals(gen1, GameOfLife.nextGeneration(gen0));
        assertEquals(gen0, GameOfLife.nextGeneration(gen1));
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
