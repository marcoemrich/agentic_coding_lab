package gameoflife;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void cellWithOneNeighborDies() {
        assertEquals(Set.of(), nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> alive = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));
        assertTrue(nextGeneration(alive).contains(new Cell(1, 0)));
    }

    @Test
    void liveCellWithFourNeighborsDiesOfOverpopulation() {
        Set<Cell> alive = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));
        assertFalse(nextGeneration(alive).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithExactlyThreeNeighborsIsBorn() {
        Set<Cell> alive = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(expected, nextGeneration(alive));
    }

    @Test
    void blinkerOscillates() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));
        assertEquals(horizontal, nextGeneration(vertical));
        assertEquals(vertical, nextGeneration(horizontal));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));
        assertEquals(block, nextGeneration(block));
    }

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), nextGeneration(Set.of()));
    }

    @Test
    void gridIsInfiniteInNegativeDirections() {
        Set<Cell> block = Set.of(
                new Cell(-1000, -1000), new Cell(-999, -1000),
                new Cell(-1000, -999), new Cell(-999, -999));
        assertEquals(block, nextGeneration(block));
    }

    private Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        return new GameOfLife().nextGeneration(aliveCells);
    }
}
