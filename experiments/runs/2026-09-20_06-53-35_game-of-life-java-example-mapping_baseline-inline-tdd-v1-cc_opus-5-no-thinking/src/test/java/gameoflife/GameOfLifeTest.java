package gameoflife;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void blockSurvivesUnchanged() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(block, GameOfLife.nextGeneration(block));
    }

    @Test
    void cellWithOneNeighborDiesOfUnderpopulation() {
        Set<Cell> pair = Set.of(new Cell(0, 1), new Cell(1, 1));
        assertEquals(Set.of(), GameOfLife.nextGeneration(pair));
    }

    @Test
    void cellWithFourNeighborsDiesOfOverpopulation() {
        Set<Cell> aliveCells = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));
        assertFalse(GameOfLife.nextGeneration(aliveCells).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> aliveCells = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        assertEquals(
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)),
                GameOfLife.nextGeneration(aliveCells));
    }

    @Test
    void blinkerOscillatesIntoNegativeCoordinates() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, GameOfLife.nextGeneration(vertical));
        assertEquals(vertical, GameOfLife.nextGeneration(horizontal));
    }

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of()));
    }
}
