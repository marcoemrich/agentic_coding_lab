import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
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
    void singleCellDies() {
        GameOfLife.Cell cell = new GameOfLife.Cell(0, 0);

        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(cell)));
    }

    @Test
    void cellsWithOneNeighborDieFromUnderpopulation() {
        Set<GameOfLife.Cell> adjacentCells = Set.of(
                new GameOfLife.Cell(0, 1), new GameOfLife.Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(adjacentCells));
    }

    @Test
    void cellWithTwoNeighborsSurvives() {
        GameOfLife.Cell center = new GameOfLife.Cell(0, 0);
        Set<GameOfLife.Cell> row = Set.of(
                new GameOfLife.Cell(-1, 0), center, new GameOfLife.Cell(1, 0));

        assertTrue(new GameOfLife().nextGeneration(row).contains(center));
    }

    @Test
    void cellWithThreeNeighborsSurvives() {
        GameOfLife.Cell center = new GameOfLife.Cell(1, 1);
        Set<GameOfLife.Cell> cells = Set.of(
                new GameOfLife.Cell(0, 0), new GameOfLife.Cell(1, 0),
                new GameOfLife.Cell(2, 0), center);

        assertTrue(new GameOfLife().nextGeneration(cells).contains(center));
    }

    @Test
    void cellWithFourNeighborsDiesFromOverpopulation() {
        GameOfLife.Cell center = new GameOfLife.Cell(1, 1);
        Set<GameOfLife.Cell> cells = Set.of(center,
                new GameOfLife.Cell(1, 0), new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(2, 1), new GameOfLife.Cell(1, 2));

        assertFalse(new GameOfLife().nextGeneration(cells).contains(center));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        GameOfLife.Cell target = new GameOfLife.Cell(1, 1);
        Set<GameOfLife.Cell> cells = Set.of(
                new GameOfLife.Cell(0, 0), new GameOfLife.Cell(1, 0),
                new GameOfLife.Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(cells).contains(target));
    }

    @Test
    void verticalBlinkerBecomesHorizontalAcrossNegativeCoordinates() {
        Set<GameOfLife.Cell> vertical = Set.of(
                new GameOfLife.Cell(0, 0), new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(0, 2));
        Set<GameOfLife.Cell> horizontal = Set.of(
                new GameOfLife.Cell(-1, 1), new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(1, 1));

        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void blinkerOscillatesOverTwoGenerations() {
        Set<GameOfLife.Cell> vertical = Set.of(
                new GameOfLife.Cell(0, 0), new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(0, 2));
        GameOfLife game = new GameOfLife();

        Set<GameOfLife.Cell> afterTwoSteps = game.nextGeneration(
                game.nextGeneration(vertical));

        assertEquals(vertical, afterTwoSteps);
    }

    @Test
    void blockIsStillLife() {
        Set<GameOfLife.Cell> block = Set.of(
                new GameOfLife.Cell(0, 0), new GameOfLife.Cell(1, 0),
                new GameOfLife.Cell(0, 1), new GameOfLife.Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void cliAppliesRequestedStep() throws Exception {
        String output = runCli("{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}");

        assertEquals("{\"aliveCells\":[]}", output);
    }

    @Test
    void cliAppliesMultipleStepsAndSortsCells() throws Exception {
        String input = "{\"aliveCells\":[[3,1],[-2,6],[2,0],[-3,5],"
                + "[3,0],[-2,5],[2,1],[-3,6]],\"steps\":2}";

        String output = runCli(input);

        assertEquals("{\"aliveCells\":[[-3,5],[-3,6],[-2,5],[-2,6],"
                + "[2,0],[2,1],[3,0],[3,1]]}", output);
    }

    private String runCli(String input) throws Exception {
        InputStream originalInput = System.in;
        PrintStream originalOutput = System.out;
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
            return output.toString(StandardCharsets.UTF_8);
        } finally {
            System.setIn(originalInput);
            System.setOut(originalOutput);
        }
    }
}
