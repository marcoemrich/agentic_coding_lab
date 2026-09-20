import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

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
        Cell center = new Cell(0, 0);
        Set<Cell> line = Set.of(new Cell(-1, 0), center, new Cell(1, 0));

        assertTrue(new GameOfLife().nextGeneration(line).contains(center));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Cell center = new Cell(1, 1);
        Set<Cell> livingCells = Set.of(
                center, new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertTrue(new GameOfLife().nextGeneration(livingCells).contains(center));
    }

    @Test
    void liveCellWithMoreThanThreeNeighborsDies() {
        Cell center = new Cell(1, 1);
        Set<Cell> livingCells = Set.of(
                center, new Cell(0, 1), new Cell(2, 1), new Cell(1, 0), new Cell(1, 2));

        assertFalse(new GameOfLife().nextGeneration(livingCells).contains(center));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Cell center = new Cell(1, 1);
        Set<Cell> livingCells = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertTrue(new GameOfLife().nextGeneration(livingCells).contains(center));
    }

    @Test
    void reproductionExampleProducesExpectedGeneration() {
        Set<Cell> initial = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(initial));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void blinkerRotatesAfterOneGeneration() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void blinkerReturnsAfterTwoGenerations() {
        GameOfLife game = new GameOfLife();
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        Set<Cell> afterTwoGenerations = game.nextGeneration(game.nextGeneration(vertical));

        assertEquals(vertical, afterTwoGenerations);
    }

    @Test
    void generationSupportsNegativeCoordinates() {
        Set<Cell> vertical = Set.of(new Cell(-2, -2), new Cell(-2, -1), new Cell(-2, 0));
        Set<Cell> horizontal = Set.of(
                new Cell(-3, -1), new Cell(-2, -1), new Cell(-1, -1));

        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void cliAppliesOneGeneration() throws Exception {
        String output = runCli("{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}");

        assertEquals("{\"aliveCells\":[]}", output);
    }

    @Test
    void cliAppliesMultipleStepsAndSortsCells() throws Exception {
        String input = "{\"aliveCells\":[[11,11],[0,2],[10,10],[0,0],"
                + "[11,10],[0,1],[10,11]],\"steps\":2}";

        String output = runCli(input);

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2],[10,10],[10,11],"
                + "[11,10],[11,11]]}", output);
    }

    private String runCli(String input) throws Exception {
        ByteArrayInputStream standardInput = new ByteArrayInputStream(
                input.getBytes(StandardCharsets.UTF_8));
        ByteArrayOutputStream standardOutput = new ByteArrayOutputStream();
        var originalInput = System.in;
        var originalOutput = System.out;
        try {
            System.setIn(standardInput);
            System.setOut(new java.io.PrintStream(standardOutput, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
        } finally {
            System.setIn(originalInput);
            System.setOut(originalOutput);
        }
        return standardOutput.toString(StandardCharsets.UTF_8);
    }
}
