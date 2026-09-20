import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    @Test
    void emptyGenerationRemainsEmpty() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of()));
    }

    @Test
    void singleCellDies() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void twoCellsDieFromUnderpopulation() {
        Set<Cell> current = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(current));
    }

    @Test
    void cellWithTwoNeighborsSurvives() {
        Set<Cell> current = Set.of(new Cell(-1, 0), new Cell(0, 0), new Cell(1, 0));

        assertTrue(new GameOfLife().nextGeneration(current).contains(new Cell(0, 0)));
    }

    @Test
    void cellWithThreeNeighborsSurvives() {
        Set<Cell> current = Set.of(
                new Cell(1, 1), new Cell(0, 0), new Cell(1, 0), new Cell(2, 0));

        assertTrue(new GameOfLife().nextGeneration(current).contains(new Cell(1, 1)));
    }

    @Test
    void cellWithFourNeighborsDies() {
        Cell subject = new Cell(0, 0);
        Set<Cell> current = Set.of(subject, new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1));

        assertFalse(new GameOfLife().nextGeneration(current).contains(subject));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> current = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> expected = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(current));
    }

    @Test
    void verticalBlinkerBecomesHorizontalAcrossNegativeCoordinates() {
        Set<Cell> current = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> expected = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(expected, new GameOfLife().nextGeneration(current));
    }

    @Test
    void blinkerReturnsAfterTwoGenerations() {
        Set<Cell> initial = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        GameOfLife game = new GameOfLife();

        assertEquals(initial, game.nextGeneration(game.nextGeneration(initial)));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void cliAppliesOneGenerationFromJson() throws Exception {
        String output = runCli("{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}");

        assertEquals("{\"aliveCells\":[]}", output);
    }

    private String runCli(String input) throws Exception {
        ByteArrayInputStream originalInput = new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8));
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        java.io.InputStream savedInput = System.in;
        PrintStream savedOutput = System.out;
        try {
            System.setIn(originalInput);
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
            return output.toString(StandardCharsets.UTF_8).trim();
        } finally {
            System.setIn(savedInput);
            System.setOut(savedOutput);
        }
    }

    @Test
    void cliAppliesRequestedStepsAndSortsCoordinates() throws Exception {
        String input = "{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}";

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}", runCli(input));
    }

    @Test
    void cliZeroStepsPreservesAndSortsLivingCells() throws Exception {
        String input = "{\"aliveCells\":[[0,1],[-1,2],[0,-1]],\"steps\":0}";

        assertEquals("{\"aliveCells\":[[-1,2],[0,-1],[0,1]]}", runCli(input));
    }
}
