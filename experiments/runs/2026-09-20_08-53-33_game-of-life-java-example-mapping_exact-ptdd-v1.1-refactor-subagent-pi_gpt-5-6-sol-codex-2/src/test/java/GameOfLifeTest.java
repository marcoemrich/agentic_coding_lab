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
        Set<Cell> row = Set.of(new Cell(-1, 0), new Cell(0, 0), new Cell(1, 0));

        assertTrue(new GameOfLife().nextGeneration(row).contains(new Cell(0, 0)));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Set<Cell> cells = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, 1));

        assertTrue(new GameOfLife().nextGeneration(cells).contains(new Cell(1, 1)));
    }

    @Test
    void liveCellWithMoreThanThreeNeighborsDies() {
        Set<Cell> crowded = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        assertFalse(new GameOfLife().nextGeneration(crowded).contains(new Cell(1, 1)));
    }

    @Test
    void deadCellWithThreeNeighborsIsBorn() {
        Set<Cell> corner = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(corner));
    }

    @Test
    void generationSupportsNegativeCoordinates() {
        Set<Cell> negativeCorner = Set.of(
                new Cell(-2, -2), new Cell(-1, -2), new Cell(-2, -1));

        assertTrue(new GameOfLife().nextGeneration(negativeCorner)
                .contains(new Cell(-1, -1)));
    }

    @Test
    void blockIsStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void blinkerBecomesHorizontal() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

        assertEquals(horizontal, new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void blinkerReturnsAfterTwoGenerations() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        GameOfLife game = new GameOfLife();

        Set<Cell> afterTwoGenerations = game.nextGeneration(game.nextGeneration(vertical));

        assertEquals(vertical, afterTwoGenerations);
    }

    @Test
    void cliImplementsTheAcceptanceExample() throws Exception {
        String output = runCli("{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}");

        assertEquals("{\"aliveCells\":[]}", output.trim());
    }

    private String runCli(String input) throws Exception {
        var originalIn = System.in;
        var originalOut = System.out;
        var output = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
            return output.toString(StandardCharsets.UTF_8);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
    }

    @Test
    void cliAppliesStepsAndSortsOutput() throws Exception {
        String output = runCli(
                "{\"aliveCells\":[[1,1],[-1,1],[0,1]],\"steps\":2}");

        assertEquals("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}", output.trim());
    }
}
