import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

    @Test
    void emptyGridStaysEmpty() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleCellDiesOfUnderpopulation() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void twoNeighboringCellsBothDieOfUnderpopulation() {
        Set<Cell> generation = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(generation));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Set<Cell> horizontalRowOfThree = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertTrue(new GameOfLife().nextGeneration(horizontalRowOfThree).contains(new Cell(1, 0)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> generation =
                Set.of(new Cell(1, 1), new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithFourNeighborsDiesOfOverpopulation() {
        Set<Cell> generation = Set.of(
                new Cell(1, 1),
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(0, 1));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithTwoNeighborsStaysDead() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0));

        assertFalse(new GameOfLife().nextGeneration(generation).contains(new Cell(1, 1)));
    }

    @Test
    void overpopulationExampleProducesExpectedGeneration() {
        // Rule 3 prose is authoritative: the live centre (1,1) has 4 live neighbours and dies.
        Set<Cell> generation = Set.of(
                new Cell(1, 1),
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(0, 1));

        Set<Cell> expected = Set.of(
                new Cell(1, -1),
                new Cell(0, 0), new Cell(2, 0),
                new Cell(0, 1), new Cell(2, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(generation));
    }

    @Test
    void reproductionExampleProducesExpectedGeneration() {
        Set<Cell> generation = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        Set<Cell> expected =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(generation));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void blinkerOscillatesToHorizontal() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void blinkerOscillatesBackToVertical() {
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertEquals(vertical, new GameOfLife().nextGeneration(horizontal));
    }

    @Test
    void infiniteGridSupportsNegativeCoordinates() {
        Set<Cell> blockFarInTheNegativeQuadrant = Set.of(
                new Cell(-5, -5), new Cell(-4, -5), new Cell(-5, -4), new Cell(-4, -4));

        assertEquals(
                blockFarInTheNegativeQuadrant,
                new GameOfLife().nextGeneration(blockFarInTheNegativeQuadrant));
    }

    @Test
    void inputIsTreatedAsSetOfLivingCells() {
        Set<Cell> withRepeatedCoordinates = new HashSet<>(List.of(
                new Cell(0, 0), new Cell(0, 0),
                new Cell(1, 0), new Cell(1, 0),
                new Cell(0, 1)));

        Set<Cell> expected =
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(withRepeatedCoordinates));
    }

    @Test
    void nextGenerationDoesNotMutateInput() {
        Set<Cell> blinker =
                new HashSet<>(List.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)));

        new GameOfLife().nextGeneration(blinker);

        assertEquals(Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2)), blinker);
    }

    @Test
    void cellIsAValueTypeWithXAndY() {
        Cell cell = new Cell(3, -7);

        assertEquals(3, cell.x());
        assertEquals(-7, cell.y());
        assertEquals(new Cell(3, -7), cell);
        assertEquals(new Cell(3, -7).hashCode(), cell.hashCode());
    }
}
